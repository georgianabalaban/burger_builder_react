import React, {Component} from "react";
import Aux from '../../Auxiliar/Auxiliar';
import Burger from '../../components/Burger/Burger';
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../components/errorHandler/errorHandler';
import {connect} from 'react-redux';
import * as actions from '../../store/actions/index';

class BurgerBuilder extends Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {};
    // }
    state = {
        purchasing: false
    };

    componentDidMount() {
        this.props.onInitIngredients();
    }

    updatePurchaseState = (ingredients) => {
        const sum = Object.keys(ingredients).map(key => {
                return ingredients[key];
            }).reduce((sum, el) => {
                return sum + el;
            }, 0);
        return sum <= 0;
    };

    purchaseHandle = () => {
        //needs to be arrow function to contain correct value of this
        this.setState({purchasing: true});
    };

    purchaseContinue = () => {
        this.props.onInitPurchase();
        this.props.history.push('/checkout');
    };

    modalClosed = () => {
        this.setState({purchasing: false});
    };

    render () {
        const disabledInfo = {
            ...this.props.ingr
        };
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }

        let burger = this.props.error ? <p>Ingredients cant be loaded!</p> : <Spinner/>;

        let orderSummary = null;
        if (this.props.ingr) {
            burger = (
                <Aux>
                    <Burger ingredients={this.props.ingr}/>
                    <BuildControls ordered={this.purchaseHandle} purchasable={this.updatePurchaseState(this.props.ingr)} price={this.props.price} disabled={disabledInfo} ingredientAdded={this.props.onIngredientAdded} ingredientRemoved={this.props.onIngredientRemoved}/>
                </Aux>
            );
            orderSummary = <OrderSummary price={this.props.price} purchaseCanceled={this.modalClosed} purchaseContinue={this.purchaseContinue} ingredients={this.props.ingr}/>;
        }

        return (
            <Aux>
                <Modal modalClosed={this.modalClosed} show={this.state.purchasing}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    }
}

const mapStateToProps = state => {
    return {
        ingr: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onInitPurchase: () => dispatch(actions.purchaseInit()),
        onIngredientAdded: (name) => dispatch(actions.addIngredient(name)),
        onIngredientRemoved: (name) => dispatch(actions.removeIngredient(name)),
        onInitIngredients: () => dispatch(actions.initIngredients())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));