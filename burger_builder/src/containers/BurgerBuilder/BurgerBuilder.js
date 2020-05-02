import React, {Component} from "react";
import Aux from '../../Auxiliar/Auxiliar';
import Burger from '../../components/Burger/Burger';
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../components/errorHandler/errorHandler';
const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 1.7
};
class BurgerBuilder extends Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {};
    // }
    state = {
        ingredients: null,
        totalPrice: 4,
        purchasable: true,
        purchasing: false,
        loading: false,
        error: false
    };

    componentDidMount() {
        axios.get('/ingredients.json').then(response => {
            this.setState({ingredients: response.data});
        }).catch(error => {
            this.setState({error: true});
        })
    }

    addIngredient = (type) => {
        const oldCount = this.state.ingredients[type];
        const updatedCounted = oldCount + 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCounted;
        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;
        this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
        this.updatePurchaseState(updatedIngredients);
    };

    removeIngredient = (type) => {
        const oldCount = this.state.ingredients[type];
        if (oldCount <= 0) {
            return;
        }
        const updatedCount  = oldCount - 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };

        updatedIngredients[type] = updatedCount;
        const priceAdd = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceAdd;
        this.setState({ingredients: updatedIngredients, totalPrice: newPrice});
        this.updatePurchaseState(updatedIngredients);
    };

    updatePurchaseState = (ingredients) => {
        const sum = Object.keys(ingredients).map(key => {
                return ingredients[key];
            }).reduce((sum, el) => {
                return sum + el;
            }, 0);
        this.setState({purchasable: sum <= 0})
    };

    purchaseHandle = () => {
        //needs to be arrow function to contain correct value of this
        this.setState({purchasing: true});
    };

    purchaseContinue = () => {
        const queryParams = [];
        for (let i in this.state.ingredients) {
            queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
        }
        queryParams.push('price=' + this.state.totalPrice);

        const queryString = queryParams.join('&');

        this.props.history.push({
            pathname: '/checkout',
            search: '?' + queryString
        });
    };

    modalClosed = () => {
        this.setState({purchasing: false});
    };

    render () {
        const disabledInfo = {
            ...this.state.ingredients
        };
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }

        let burger = this.state.error ? <p>Ingredients cant be loaded!</p> : <Spinner/>;
        let orderSummary = null;
        if (this.state.ingredients) {
            burger = (
                <Aux>
                    <Burger ingredients={this.state.ingredients}/>
                    <BuildControls ordered={this.purchaseHandle} purchasable={this.state.purchasable} price={this.state.totalPrice} disabled={disabledInfo} ingredientAdded={this.addIngredient} ingredientRemoved={this.removeIngredient}/>
                </Aux>
            );
            orderSummary = <OrderSummary price={this.state.totalPrice} purchaseCanceled={this.modalClosed} purchaseContinue={this.purchaseContinue} ingredients={this.state.ingredients}/>;
        }
        if (this.state.loading) {
            orderSummary = <Spinner/>;
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

export default withErrorHandler(BurgerBuilder, axios);