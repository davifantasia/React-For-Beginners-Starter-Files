import React from 'react';
import autobind from 'autobind-decorator';

@autobind
class AddFishForm extends React.Component {
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
    }

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
}

export default AddFishForm;