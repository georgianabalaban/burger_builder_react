import React, {Component} from "react";
import Modal from '../UI/Modal/Modal';
import Aux from '../../Auxiliar/Auxiliar';
const errorHandler = (WrappedComponent, axios) => {
    return class extends Component {
        constructor(props) {
            super(props);
            this.state = {
                error: null
            };

        }

        componentWillMount() {
            axios.interceptors.request.use(req => {
                this.setState({error: null});
                return req;
            });
            axios.interceptors.response.use(res => res, error => {
                this.setState({error: error});
            });
        }

        errorConfirmed = () => {
            this.setState({error: null});
        };

        render() {
            return (
                <Aux>
                    <WrappedComponent {...this.props}/>
                    <Modal show={this.state.error} modalClosed={this.errorConfirmed}>{this.state.error ? this.state.error.message : null}</Modal>
                </Aux>
            );
        }
    }
}

export default errorHandler;