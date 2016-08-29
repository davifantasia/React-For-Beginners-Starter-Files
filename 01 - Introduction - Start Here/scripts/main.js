const React = require('react');
const ReactDOM = require('react-dom');

const ReactRouter = require('react-router');
const Router = ReactRouter.Router;
const Route = ReactRouter.Route;
const Navigation = ReactRouter.Navigation;

const History = ReactRouter.History;
const createBrowserHistory = require('history/lib/createBrowserHistory');

const h = require('./helpers');

// Firebase
const Rebase = require('re-base');
const base = Rebase.createClass('https://catch-of-the-day-e14d5.firebaseio.com/');
// END: Firebase

const Catalyst = require('react-catalyst');

const App = React.createClass({
    mixins: [Catalyst.LinkedStateMixin],

    getInitialState() {
        return {
            fishes: {},
            order: {}
        }
    },

    componentDidMount() {
        base.syncState(this.props.params.storeId + '/fishes', {
            context: this,
            state: 'fishes'
        });

        const localStorageRef = localStorage.getItem('order-' + this.props.params.storeId);

        if (localStorageRef) {
            this.setState({
                order: JSON.parse(localStorageRef)
            });
        }
    },

    componentWillUpdate(nextProps, nextState) {
        localStorage.setItem('order-' + this.props.params.storeId, JSON.stringify(nextState.order));
    },

    addFish(fish) {
        const timeStamp = (new Date()).getTime();

        // update the state object
        this.state.fishes['fish-' + timeStamp] = fish;

        // set the state
        this.setState({ fishes: this.state.fishes });
    },

    addToOrder(key) {
        this.state.order[key] = this.state.order[key] + 1 || 1;
        this.setState({ order : this.state.order });
    },

    loadSamples() {
        this.setState({
            fishes: require('./sample-fishes')
        });
    },

    renderFish(key) {
        return <Fish key={key} index={key} details={this.state.fishes[key]} addToOrder={this.addToOrder} />;
    },

    render: function() {
        return (
            <div className="catch-of-the-day">
                <div className="menu">
                    <Header tagline="Fresh Seafood Market" />
                    <ul className="list-of-fishes">
                        {Object.keys(this.state.fishes).map(this.renderFish)}
                    </ul>
                </div>
                <Order fishes={this.state.fishes} order={this.state.order} />
                <Inventory addFish={this.addFish} loadSamples={this.loadSamples} fishes={this.state.fishes} linkState={this.linkState} />
            </div>
        )
    }
});

const Fish = React.createClass({
    onButtonClick() {
        const key = this.props.index;
        this.props.addToOrder(key);
    },

    render() {
        const details = this.props.details;
        const isAvailable = (details.status === 'available');
        let buttontext = (isAvailable ? 'Add To Order' : 'Sold Out!');

        return (
            <li className="menu-fish">
                <img src={details.image} alt={details.name} />
                <h3 className="fish-name">
                    {details.name}
                    <span className="price">{h.formatPrice(details.price)}</span>
                </h3>
                <p>{details.desc}</p>
                <button disabled={!isAvailable} onClick={this.onButtonClick}>{buttontext}</button>
            </li>
        );
    }
});

const Header = React.createClass({
    render: function() {
        return (
            <header className="top">
                <h1>Catch
                    <span className="ofThe">
                        <span className="of">of</span>
                        <span className="the">the</span>
                    </span>
                    Day</h1>
                <h3 className="tagline"><span>{this.props.tagline}</span></h3>
            </header>
        )
    }
});

const Order = React.createClass({
    renderOrder(key) {
        const fish = this.props.fishes[key];
        const count = this.props.order[key];

        if (!fish) {
            return <li key={key}>Sorry, fish no longer available!</li>
        }

        return (
            <li key={key}>
                <span>{count}lbs</span>
                {fish.name}
                <span className="price">{h.formatPrice(count * fish.price)}</span>
            </li>
        );
    },

    render() {
        const orderIds = Object.keys(this.props.order);
        let total = orderIds.reduce((prevTotal, key) => {
            const fish = this.props.fishes[key];
            let count = this.props.order[key];
            const isAvailable = fish && fish.status === 'available';

            if (fish && isAvailable) {
                return prevTotal + (count * parseInt(fish.price) || 0);
            }

            return prevTotal;
        }, 0);

        return (
            <div className="order-wrap">
                <h2 className="order-title">Your Order</h2>
                <ul className="order">
                    {orderIds.map(this.renderOrder)}
                    <li className="total">
                        <strong>Total:</strong>
                        {h.formatPrice(total)}
                    </li>
                </ul>
            </div>
        )
    }
});

const Inventory = React.createClass({
    renderInventory(key) {
        const linkState = this.props.linkState;
        return (
            <div className="fish-edit" key={key}>
                <input type="text" ref="name" placeholder="Fish Name" valueLink={linkState('fishes.' + key + '.name')} />
                <input type="text" ref="price" placeholder="Fish Price" valueLink={linkState('fishes.' + key + '.price')} />
                <select ref="status" valueLink={linkState('fishes.' + key + '.status')}>
                    <option value="available">Fresh!</option>
                    <option value="unavailable">Sold Out!</option>
                </select>
                <textarea ref="desc" placeholder="Desc" valueLink={linkState('fishes.' + key + '.desc')} />
                <input type="text" ref="image" placeholder="URL to image" valueLink={linkState('fishes.' + key + '.image')} />
                <button type="submit">- Remove Item</button>
            </div>
        );
    },

    render: function() {
        return (
            <div>
                <h2>Inventory</h2>

                {Object.keys(this.props.fishes).map(this.renderInventory)}

                <AddFishForm {...this.props}/>
                <button onClick={this.props.loadSamples}>Load Sample Fishes</button>
            </div>
        )
    }
});

const AddFishForm = React.createClass({
    createFish(event) {
        event.preventDefault();

        const fish = {
            name: this.refs.name.value,
            price: this.refs.price.value,
            status: this.refs.status.value,
            desc: this.refs.desc.value,
            image: this.refs.image.value,
        };

        this.props.addFish(fish);
        this.refs.fishForm.reset();
    },

    render() {
        return (
            <form className="fish-edit" ref="fishForm" onSubmit={this.createFish}>
                <input type="text" ref="name" placeholder="Fish Name" />
                <input type="text" ref="price" placeholder="Fish Price" />
                <select ref="status">
                    <option value="available">Fresh!</option>
                    <option value="unavailable">Sold Out!</option>
                </select>
                <textarea ref="desc" placeholder="Desc" />
                <input type="text" ref="image" placeholder="URL to image" />
                <button type="submit">+ Add Item </button>
            </form>
        );
    }
});

const StorePicker = React.createClass({
    mixins: [History],

    goToStore: function (event) {
        event.preventDefault();

        var storeId = this.refs.storeId.value;
        this.history.pushState(null, '/store/' + storeId);
    },

    render: function() {
        return (
            <form className="store-selector" onSubmit={this.goToStore}>
                <h2>Please Enter A Store</h2>
                <input type="text" ref="storeId" defaultValue={h.getFunName()} required />
                <input type="submit" />
            </form>
        )
    }
});

const NotFound = React.createClass({
    render: function () {
        return <h1>Not Found!</h1>
    }
});

var routes = (
    <Router history={createBrowserHistory()}>
        <Route path="/" component={StorePicker}/>
        <Route path="/store/:storeId" component={App}/>
        <Route path="*" component={NotFound}/>
    </Router>
);

ReactDOM.render(routes, document.querySelector('#main'));