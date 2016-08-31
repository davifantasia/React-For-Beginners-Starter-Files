import React from 'react';
import AddFishForm from './AddFishForm';
import autobind from 'autobind-decorator';
import config from '../config';
import Firebase from 'firebase';

const ref = new Firebase(config.firebaseUrl);

@autobind
class Inventory extends React.Component {
    static propTypes = {
        fishes: React.PropTypes.object.isRequired,
        addFish: React.PropTypes.func.isRequired,
        removeFish: React.PropTypes.func.isRequired,
        loadSamples: React.PropTypes.func.isRequired,
        linkState: React.PropTypes.func.isRequired
    };

    constructor() {
        super();

        this.state = {
            uid: ''
        }
    }

    renderLogin() {
        return (
            <nav className="login">
                <h2>Inventory</h2>
                <p>Sign in to manage your store's inventory</p>
                <button className="github" onClick={this.authenticate.bind(this, 'github')}>Log In with Github</button>
                <button className="facebook"onClick={this.authenticate.bind(this, 'facebook')} >Log In with Facebook</button>
                <button className="twitter"onClick={this.authenticate.bind(this, 'twitter')} >Log In with Twitter</button>
            </nav>
        )
    }

    authenticate(provider) {
        ref.authWithOAuthPopup(provider, function (err, authData) {
            console.log(authData);
        });
    }

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
                <button type="submit" onClick={this.props.removeFish.bind(null, key)}>- Remove Item</button>
            </div>
        );
    }

    render() {
        // TODO: Problem with current version of Firebase.
        // Got the idea, will implement in other apps.

        // let logoutButton = <button>Log Out!</button>
        //
        // // Check if user is not logged in
        // if (!this.state.uid) {
        //     return (
        //         <div> {this.renderLogin()} </div>
        //     )
        // }
        //
        // // Then check if user is owner of current store
        // if (this.state.uid !== this.state.owner) {
        //     return (
        //         <div>
        //             <p>Sorry, you aren't the owner of this store</p>
        //             {logoutButton}
        //         </div>
        //     )
        // }
        //
        // return (
        //     <div>
        //         <h2>Inventory</h2>
        //
        //         {logoutButton}
        //
        //         {Object.keys(this.props.fishes).map(this.renderInventory)}
        //
        //         <AddFishForm {...this.props}/>
        //         <button onClick={this.props.loadSamples}>Load Sample Fishes</button>
        //     </div>
        // )

        return (
            <div>
                <h2>Inventory</h2>

                {Object.keys(this.props.fishes).map(this.renderInventory)}

                <AddFishForm {...this.props}/>
                <button onClick={this.props.loadSamples}>Load Sample Fishes</button>
            </div>
        )
    }
}

export default Inventory;