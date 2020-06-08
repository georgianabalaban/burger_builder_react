import React from "react";
import Modal from '../UI/Modal/Modal';
import Aux from '../../Auxiliar/Auxiliar';
import useHttpErrorHandler from '../../hooks/httpErrorHandler';
const errorHandler = (WrappedComponent, axios) => {
    return props => {
        const [error, clearError] = useHttpErrorHandler(axios);
        return (
            <Aux>
                <WrappedComponent {...props}/>
                <Modal show={error} modalClosed={clearError}>{error ? error.message : null}</Modal>
            </Aux>
        );
    }
};

export default errorHandler;