import React, {useEffect, Suspense} from 'react';
import Layout from './components/Layout/Layout';
import BurgerBuilder from "./containers/BurgerBuilder/BurgerBuilder";
import Logout from "./containers/Auth/logout/Logout";
import { Route, withRouter, Redirect } from 'react-router-dom';
import {connect} from 'react-redux';
import * as actions from './store/actions/index';
import {Switch} from "react-router";

const Checkout = React.lazy(() => {
    return import("./containers/Checkout/Checkout");
});
const Orders = React.lazy(() => {
    return import("./containers/Orders/Orders");
});
const Auth = React.lazy(() => {
    return import("./containers/Auth/Auth");
});

 const App = props => {

     const { onTryAutoSignup } = props;

     useEffect(() => {
         onTryAutoSignup();
     }, [onTryAutoSignup]);

     let routes = (
         <Switch>
             <Route path="/auth" component={Auth}/>
             <Route path="/" exact component={BurgerBuilder}/>
             <Redirect to="/"/>
         </Switch>
     );
     if (props.isAuth) {
         routes = (
             <Switch>
                 <Route path="/checkout" component={Checkout}/>
                 <Route path="/orders" component={Orders}/>
                 <Route path="/logout" component={Logout}/>
                 <Route path="/auth" component={Auth}/>
                 <Route path="/" exact component={BurgerBuilder}/>
                 <Redirect to="/"/>
             </Switch>
         );
     }
     return (
         <div>
             <Layout>
                 <Suspense fallback={<p>Loading...</p>}>{routes}</Suspense>
             </Layout>
         </div>
     );
};

const mapStateToProps = state => {
     return {
        isAuth: state.auth.token !== null
     }
};

const mapDispatchToProps = dispatch => {
    return {
        onTryAutoSignup: () => dispatch(actions.authCheckState())
    }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
