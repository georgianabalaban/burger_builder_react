import React, {useState, useEffect, useCallback} from "react";
import Aux from '../../Auxiliar/Auxiliar';
import Burger from '../../components/Burger/Burger';
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../components/errorHandler/errorHandler';
import {connect, useDispatch, useSelector} from 'react-redux';
import * as actions from '../../store/actions/index';

const BurgerBuilder = props => {
    // constructor(props) {
    //     super(props);
    //     this.state = {};
    // }
    const [ purchasing, setPurchasing ] = useState(false);

    const dispatch = useDispatch();

    const onInitPurchase = () => dispatch(actions.purchaseInit());
    const onIngredientAdded = (name) => dispatch(actions.addIngredient(name));
    const onIngredientRemoved = (name) => dispatch(actions.removeIngredient(name));
    const onInitIngredients = useCallback(() => dispatch(actions.initIngredients()), [dispatch]);
    const onSetRedirectPath = (path) => dispatch(actions.setAuthRedirectPath(path));
    
    const ingr = useSelector(state => {
        return state.burgerBuilder.ingredients;
    });
    
    const price = useSelector(state => {
        return state.burgerBuilder.totalPrice;
    });
    
    const error = useSelector(state => {
        return state.burgerBuilder.error;
    });
    
    const isAuth = useSelector(state => {
        return state.auth.token !== null;
    });

    useEffect(() => {
        onInitIngredients();
    }, [onInitIngredients]);

    const updatePurchaseState = (ingredients) => {
        const sum = Object.keys(ingredients).map(key => {
                return ingredients[key];
            }).reduce((sum, el) => {
                return sum + el;
            }, 0);
        return sum <= 0;
    };

    const purchaseHandle = () => {
        //needs to be arrow function to contain correct value of this
        if ( isAuth ) {
            setPurchasing(true);
        } else {
            onSetRedirectPath('/checkout');
            props.history.push("/auth");
        }
    };

    const purchaseContinue = () => {
        onInitPurchase();
        props.history.push('/checkout');
    };

    const modalClosed = () => {
        setPurchasing(false);
    };

    const disabledInfo = {
        ...ingr
    };
    for (let key in disabledInfo) {
        disabledInfo[key] = disabledInfo[key] <= 0
    }

    let burger = error ? <p>Ingredients cant be loaded!</p> : <Spinner/>;

    let orderSummary = null;
    if (ingr) {
        burger = (
            <Aux>
                <Burger ingredients={ingr}/>
                <BuildControls isAuth={isAuth} ordered={purchaseHandle} purchasable={updatePurchaseState(ingr)} price={price} disabled={disabledInfo} ingredientAdded={onIngredientAdded} ingredientRemoved={onIngredientRemoved}/>
            </Aux>
        );
        orderSummary = <OrderSummary price={price} purchaseCanceled={modalClosed} purchaseContinue={purchaseContinue} ingredients={ingr}/>;
    }

    return (
        <Aux>
            <Modal modalClosed={modalClosed} show={purchasing}>
                {orderSummary}
            </Modal>
            {burger}
        </Aux>
    );

};

export default withErrorHandler(BurgerBuilder, axios);