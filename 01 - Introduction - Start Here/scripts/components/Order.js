import React from 'react';
import h from '../helpers';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import autobind from 'autobind-decorator';

@autobind
class Order extends React.Component {
    static propTypes = {
        fishes: React.PropTypes.object.isRequired,
        order: React.PropTypes.object.isRequired,
        removeFromOrder: React.PropTypes.func.isRequired
    };

    renderOrder(key) {
        const fish = this.props.fishes[key];
        const count = this.props.order[key];
        const removeButton = <button onClick={this.props.removeFromOrder.bind(null, key)}>&times;</button>;

        if (!fish) {
            return <li key={key}>Sorry, fish no longer available! {removeButton}</li>
        }

        return (
            <li key={key}>
                <span>
                    <CSSTransitionGroup
                        component="span"
                        transitionName="count"
                        transitionLeaveTimeout={250}
                        transitionEnterTimeout={250}
                    >
                        <span key={count}>{count}</span>
                    </CSSTransitionGroup>

                    lbs {fish.name} {removeButton}
                </span>
                <span className="price">{h.formatPrice(count * fish.price)}</span>
            </li>
        );
    }

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

                <CSSTransitionGroup
                    className="order"
                    component="ul"
                    transitionName="order"
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={500}
                >
                    {orderIds.map(this.renderOrder)}
                    <li className="total">
                        <strong>Total:</strong>
                        {h.formatPrice(total)}
                    </li>
                </CSSTransitionGroup>
            </div>
        )
    }
}

export default Order;