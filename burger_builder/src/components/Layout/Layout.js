import React, {Component} from 'react';
import Aux from '../../Auxiliar/Auxiliar';
import classes from './Layout.module.css';
import Toolbar from '../Navigation/Toolbar/Toolbar';
import SideDrawer from '../Navigation/SideDrawer/SideDrawer';
import { connect } from 'react-redux';
class Layout extends Component {
    state = {
        showSideDrawer: false
    };
    sideDrawerClosed = () => {
        this.setState({showSideDrawer: false});
    };
    sideDrawerToggle = () => {
        this.setState((prevState) => {
            return {showSideDrawer: !prevState.showSideDrawer};
        });
    };
    render() {
        return (
            <Aux>
                <Toolbar isAuth={this.props.isAuth} drawerClicked={this.sideDrawerToggle}/>
                <SideDrawer isAuth={this.props.isAuth} open={this.state.showSideDrawer} closed={this.sideDrawerClosed}/>
                <main className={classes.Content}>
                    {this.props.children}
                </main>
            </Aux>
        );
    }
}
const mapStateToProps = state => {
    return {
        isAuth: state.auth.token !== null
    };
};

export default connect(mapStateToProps)(Layout);