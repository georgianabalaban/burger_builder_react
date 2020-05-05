import React from "react";
import classes from './Input.module.css';
const input = (props) => {
    let input = null;
    let inputElement = [classes.InputElement];
    let validationError = null;
    if (props.invalid && props.shouldValidate && props.touched) {
        inputElement.push(classes.Invalid);
        validationError = <p>Please enter a valid value!</p>;
    }

    switch (props.elementType) {
        case ('input'):
            input = <input onChange={props.changed} className={inputElement.join(' ')} {...props.elementConfig} value={props.value}/>;
            break;
        case ('textarea'):
            input = <textarea onChange={props.changed} className={inputElement.join(' ')} {...props.elementConfig} value={props.value}/>;
            break;
        case ('select'):
            input = (
                <select onChange={props.changed} className={inputElement.join(' ')} value={props.value}>
                    {props.elementConfig.options.map(option => (
                        <option key={option.value} value={option.value}>{option.displayValue}</option>
                    ))}
                </select>
            );
            break;
        default:
            input = <input onChange={props.changed} className={inputElement.join(' ')} {...props.elementConfig} value={props.value}/>;
    }
    return (
        <div className={classes.Input}>
            <label className={classes.Label}>{props.label}</label>
            {input}
            {validationError}
        </div>
    );
};

export default input;