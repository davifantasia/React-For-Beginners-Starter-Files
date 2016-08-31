import React from 'react';
import reactMixin from 'react-mixin';
import Catalyst from 'react-catalyst';
import autobind from 'autobind-decorator';
import config from '../config';

// Firebase
import Rebase from 're-base';
const base = Rebase.createClass(config.firebaseUrl);
// END: Firebase

import sampleFishes from '../sample-fishes';

import Header from './Header';
import Fish from './Fish';
import Order from './Order';
import Inventory from './Inventory';

@autobind
class App extends React.Component {

    constructor() {
        super();

        this.state = {
            fishes: {},
            order: {}
        };
    }

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
    }

    componentWillUpdate(nextProps, nextState) {
        localStorage.setItem('order-' + this.props.params.storeId, JSON.stringify(nextState.order));
    }

    addToOrder(key) {
        this.state.order[key] = this.state.order[key] + 1 || 1;
        this.setState({ order : this.state.order });
    }

    removeFromOrder(key) {
        delete this.state.order[key];
        this.setState({
            order: this.state.order
        });
    }

    addFish(fish) {
        const timeStamp = (new Date()).getTime();

        // update the state object
        this.state.fishes['fish-' + timeStamp] = fish;

        // set the state
        this.setState({ fishes: this.state.fishes });
    }

    removeFish(key) {
        if (confirm('Are you sure you want to remove this fish?')) {
            this.state.fishes[key] = null; // Setting to null deletes the item.
            this.setState({
                fishes: this.state.fishes
            });
        }
    }

    loadSamples() {
        this.setState({
            fishes: sampleFishes
        });
    }

    renderFish(key) {
        return <Fish key={key} index={key} details={this.state.fishes[key]} addToOrder={this.addToOrder} />;
    }

    render() {
        return (
            <div className="catch-of-the-day">
                <div className="menu">
                    <Header tagline="Fresh Seafood Market" />
                    <ul className="list-of-fishes">
                        {Object.keys(this.state.fishes).map(this.renderFish)}
                    </ul>
                </div>
                <Order fishes={this.state.fishes} order={this.state.order} removeFromOrder={this.removeFromOrder} />
                <Inventory addFish={this.addFish} removeFish={this.removeFish} loadSamples={this.loadSamples} fishes={this.state.fishes} linkState={this.linkState.bind(this)} />
            </div>
        )
    }

}

reactMixin.onClass(App, Catalyst.LinkedStateMixin);

export default App;