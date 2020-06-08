import React from "react";
import Aux from '../../../Auxiliar/Auxiliar';
import Button from '../../UI/Button/Button';
const orderSummary = (props) => {
    const ingredientSummary = Object.keys(props.ingredients).map(key => {
        return (
            <li key={key}><span style={{textTransform: 'capitalize'}}>{key}</span>: {props.ingredients[key]}</li>
        );
    });

    return (
        <Aux>
            <h3>Your order</h3>
            <p>A delicious burger with the following ingredients:</p>
            <ul>
                {ingredientSummary}
            </ul>
            <strong>Total price: {props.price.toFixed(2)}</strong>
            <p>Continue to Checkout?</p>
            <Button clicked={props.purchaseCanceled} btnType="Danger">CANCEL</Button>
            <Button clicked={props.purchaseContinue} btnType="Success">CONTINUE</Button>
        </Aux>
    )
};

export default orderSummary;