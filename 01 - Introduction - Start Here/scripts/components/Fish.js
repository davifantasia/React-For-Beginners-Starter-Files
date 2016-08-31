import React from 'react';
import autobind from 'autobind-decorator';
import h from '../helpers';

@autobind
class Fish extends React.Component {
    onButtonClick() {
        const key = this.props.index;
        this.props.addToOrder(key);
    }

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
}

export default Fish;