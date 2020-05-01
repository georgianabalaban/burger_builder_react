import React from "react";
import BurgerIngredient from "./BurgerIngredient/BurgerIngredient";
import classes from './Burger.module.css';
const burger = (props) => {
    let transformerIngredients = Object.keys(props.ingredients).map(igKey => {
        return [...Array(props.ingredients[igKey])].map((_, i) => {
            return <BurgerIngredient key={igKey + i} type={igKey}/>;
        });
    }).reduce((arr, el) => {
        return arr.concat(el);
    }, []);

    if (transformerIngredients.length === 0) {
        transformerIngredients = <p>Please start adding ingredients!</p>
    }

    return (
      <div className={classes.Burger}>
        <BurgerIngredient type="bread-top"/>
          {transformerIngredients}
        <BurgerIngredient type="bread-bottom"/>
      </div>
    );
};

export default burger;