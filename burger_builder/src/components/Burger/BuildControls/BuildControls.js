import React from "react";
import classes from './BuildControls.module.css';
import BuildControl from "./BuildControl/BuildControl";
const controls = [
    { label: 'Salad', type: 'salad'},
    { label: 'Bacon', type: 'bacon'},
    { label: 'Cheese', type: 'cheese'},
    { label: 'Meat', type: 'meat'}
];
const BuildControls = (props) => (
    <div className={classes.BuildControls}>
        <p>Current price: <strong>{props.price.toFixed(2)}</strong></p>
        {controls.map(ctrl => (
            <BuildControl disabled={props.disabled[ctrl.type]} key={ctrl.label} label={ctrl.label} added={() => props.ingredientAdded(ctrl.type)} removed={() => props.ingredientRemoved(ctrl.type)}/>
        ))}
        <button disabled={props.purchasable} onClick={props.ordered} className={classes.OrderButton}>{ props.isAuth ? 'ORDER NOW' : 'SIGNIN TO ORDER' }</button>
    </div>
);

export default BuildControls;