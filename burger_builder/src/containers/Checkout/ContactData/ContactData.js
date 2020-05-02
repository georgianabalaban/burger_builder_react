import React, {Component} from 'react';
import Button from  '../../../components/UI/Button/Button';
import classes from './ContactData.module.css';
import axios from '../../../axios-orders';
import Spinner from '../../../components/UI/Spinner/Spinner';
class ContactData extends Component {
    state = {
        name: '',
        email: '',
        address: {
            street: '',
            postalCode: ''
        },
        loading: false
    };

    order = (event) => {
        event.preventDefault();
        this.setState({loading: true});
        const order = {
          ingredients: this.props.ingredients,
          price: this.props.price,
          customer: {
              name: 'Max',
              address: {
                  street: 'fdasfas',
                  zipCode: '32312',
                  country: 'RO'
              },
              email: 'ggfd@fds.com'
          },
          deliveryMethod: 'fastest'
        };
        axios.post('/orders.json', order )
            .then(response => {
                this.setState({loading: false});
                this.props.history.push('/');
            })
            .catch(error => {
                console.log(error);
                this.setState({loading: false});
            });
    };

    render() {
        let form = (
            <form>
                <input type="text" name="name" placeholder="Your name"/>
                <input type="text" name="email" placeholder="Your email"/>
                <input type="text" name="street" placeholder="Your street"/>
                <input type="text" name="postalcode" placeholder="Your postal code"/>
                <Button btnType="Success" clicked={this.order}>ORDER</Button>
            </form>
        );
        if (this.state.loading) {
            form = <Spinner/>;
        }
        return (
            <div className={classes.ContactData}>
                <h4>Enter your data</h4>
                {form}
            </div>
        );
    }
};

export default ContactData;