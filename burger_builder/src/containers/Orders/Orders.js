import React, {Component} from "react";
import Order from './Order/Order';
import axios from '../../axios-orders';
import withError from '../../components/errorHandler/errorHandler';
class Orders extends Component {
    state = {
        orders: [],
        loading: true
    };

    componentDidMount() {
     axios.get('/orders.json').then( response => {
         const fetchData = [];
         for (let key in response.data) {
             console.log(response.data);
             fetchData.push({...response.data[key], id: key});
         }
         this.setState({loading: false, orders: fetchData});
     }).catch(error => {
         console.log(error);
         this.setState({loading: false});
     });
    }

    render() {
        return (
            <div>
                {this.state.orders.map(order => (
                    <Order key={order.id} ingredients={order.ingredients} price={+order.price}/>
                ))}
            </div>
        );
    }
}

export default withError(Orders, axios);