const React = require('react');
const ReactDOM = require('react-dom');

const ReactRouter = require('react-router');
const Router = ReactRouter.Router;
const Route = ReactRouter.Route;
const Navigation = ReactRouter.Navigation;

const History = ReactRouter.History;
const createBrowserHistory = require('history/lib/createBrowserHistory');

const h = require('./helpers');

const App = React.createClass({
    getInitialState() {
        return {
            fishes: {},
            order: {}
        }
    },

    addFish(fish) {
        const timeStamp = (new Date()).getTime();

        // update the state object
        this.state.fishes['fish-' + timeStamp] = fish;

        // set the state
        this.setState({ fishes: this.state.fishes })
    },

    loadSamples() {
        this.setState({
            fishes: require('./sample-fishes')
        });
    },

    render: function() {
        return (
            <div className="catch-of-the-day">
                <div className="menu">
                    <Header tagline="Fresh Seafood Market" />
                </div>
                <Order />
                <Inventory addFish={this.addFish} loadSamples={this.loadSamples} />
            </div>
        )
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
    render: function() {
        return (
            <p>Order</p>
        )
    }
});

const Inventory = React.createClass({
    render: function() {
        return (
            <div>
                <h2>Inventory</h2>
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

ReactDOM.render(
    routes, document.querySelector('#main')
);