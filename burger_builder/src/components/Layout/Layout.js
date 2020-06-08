import React, {useState} from 'react';
import Aux from '../../Auxiliar/Auxiliar';
import classes from './Layout.module.css';
import Toolbar from '../Navigation/Toolbar/Toolbar';
import SideDrawer from '../Navigation/SideDrawer/SideDrawer';
import { connect } from 'react-redux';

const Layout = props => {
    const [sideDrawerIsVisible, setSideDrawerIsVisible] = useState(false);
    const sideDrawerClosed = () => {
        setSideDrawerIsVisible(false);
    };
    const sideDrawerToggle = () => {
        setSideDrawerIsVisible(!sideDrawerIsVisible);
    };

    return (
        <Aux>
            <Toolbar isAuth={props.isAuth} drawerClicked={sideDrawerToggle}/>
            <SideDrawer isAuth={props.isAuth} open={sideDrawerIsVisible} closed={sideDrawerClosed}/>
            <main className={classes.Content}>
                {props.children}
            </main>
        </Aux>
    );
};
const mapStateToProps = state => {
    return {
        isAuth: state.auth.token !== null
    };
};

export default connect(mapStateToProps)(Layout);