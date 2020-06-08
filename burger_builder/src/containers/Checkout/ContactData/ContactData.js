import React, {useState} from 'react';
import Button from  '../../../components/UI/Button/Button';
import classes from './ContactData.module.css';
import axios from '../../../axios-orders';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import {connect} from 'react-redux';
import withErrorHandler from '../../../components/errorHandler/errorHandler';
import * as actions from '../../../store/actions/index';
import {updateObject, checkValidity} from '../../../shared/utility';

const ContactData = props => {
    const [orderForm, setOrderForm] = useState({
        name: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                placeholder: 'Your name'
            },
            value: '',
            validation: {
                required: true
            },
            valid: false,
            touched: false
        },
        street: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                placeholder: 'Your street'
            },
            value: '',
            validation: {
                required: true
            },
            valid: false,
            touched: false
        },
        zipCode: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                placeholder: 'Your zip code'
            },
            value: '',
            validation: {
                required: true,
                minLength: 4,
                maxLength: 5
            },
            valid: false,
            touched: false
        },
        country: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                placeholder: 'Your country'
            },
            value: '',
            validation: {
                required: true
            },
            valid: false,
            touched: false
        },
        email: {
            elementType: 'input',
            elementConfig: {
                type: 'email',
                placeholder: 'Your email'
            },
            value: '',
            validation: {
                required: true
            },
            valid: false,
            touched: false
        },
        deliveryMethod: {
            elementType: 'select',
            elementConfig: {
                options: [
                    {value: 'fastest', displayValue: 'Fastest'},
                    {value: 'cheapest', displayValue: 'Cheapest'}
                ]
            },
            value: 'fastest',
            validation: {},
            valid: true
        }
    });

    const [validForm, setValidForm] = useState(false);

    const order = (event) => {
        event.preventDefault();
        const formData = {};
        for (let key in orderForm) {
            formData[key] = orderForm[key].value;
        }
        const order = {
            ingredients: props.ingr,
            price: props.price,
            orderData: formData,
            userId: props.userId
        };

        props.onOrderBurger(order, props.token);
    };

    const inputChanged = (event, input) => {
        const updatedElement = updateObject(orderForm[input], {
            value: event.target.value,
            valid: checkValidity(event.target.value, orderForm[input].validation),
            touched: true
        });

        const updated = updateObject(orderForm, {
            [input]: updatedElement
        });

        let formIsValid = true;
        for (let key in updated) {
            formIsValid = updated[key].valid && formIsValid;
        }

        setOrderForm(updated);
        setValidForm(formIsValid);
    };

        const formElements = [];
        for (let key in orderForm) {
            formElements.push({
                id: key,
                config: orderForm[key]
            });
        }
        let form = (
            <form onSubmit={order}>
                {formElements.map(formElem => {
                    return (
                      <Input changed={(event) => inputChanged(event, formElem.id)} invalid={!formElem.config.valid} touched={formElem.config.touched} shouldValidate={formElem.config.validation} key={formElem.id} elementType={formElem.config.elementType} elementConfig={formElem.config.elementConfig} value={formElem.config.value}/>
                    );
                })}
                <Button btnType="Success" disabled={!validForm} clicked={order}>ORDER</Button>
            </form>
        );
        if (props.loading) {
            form = <Spinner/>;
        }
        return (
            <div className={classes.ContactData}>
                <h4>Enter your data</h4>
                {form}
            </div>
        );
};

const mapStateToProps = state => {
    return {
        ingr: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        loading: state.order.loading,
        token: state.auth.token,
        userId: state.auth.userId
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onOrderBurger: (orderData, token) => dispatch(actions.purchaseBurger(orderData, token))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ContactData, axios));