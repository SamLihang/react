/**
 * Created by sencha on 2017/3/24.
 */
import React, {Component} from "react";
import {connect} from "react-redux";
import {StyleSheet} from "react-native";
import ScrollableTabView from "react-native-scrollable-tab-view";
import BCTabBar from "../components/BCTabBar";
import {NavigationOptions} from "../BaseComponent";
import Home from "./buyer/Home";
import AlwaysBuy from "./buyer/AlwaysBuy";
import My from "./buyer/My";
import Cart from "./buyer/shoppingCart/Cart";
import {ActionCompanyType} from "../actions/EmployeeAction";

import PleaseLogin from './PleaseLogin';

class BuyerIndex extends Component {

    constructor(props) {
        super(props);
        this.navigation = this.props.navigation;
        this.state = {
            tabNames: ['首页', '常购商品', '购物车', '我的'],
            tabIcon: [require('../imgs/homepage2.png'), require('../imgs/commodity2.png'), require('../imgs/ShoppingMall2.png'), require('../imgs/mine2.png')],
            tabIconSelected: [require('../imgs/homepage.png'), require('../imgs/commodity.png'), require('../imgs/ShoppingMall.png'), require('../imgs/mine.png')],
            tabColor: ['#31ca96', '#999999']
        };
    }

    render() {
        const {navigate} = this.props.navigation;
        let tabNames = this.state.tabNames;
        let tabIcon = this.state.tabIcon;
        let tabIconSelected = this.state.tabIconSelected;
        let tabColor = this.state.tabColor;

        global.token = this.props.ReduceEmployee.token;

        return (
            <ScrollableTabView
                locked={true}
                renderTabBar={() => <BCTabBar tabNames={tabNames} tabIcon={tabIcon} tabIconSelected={tabIconSelected}
                                              tabColor={tabColor}/>}
                onChangeTab={(obj) => {
                    // this.props.ReduceEmployee.isLoggedIn ?null:this.push('Login')
                   // alert('index:' + obj.i);
                }
                }

                tabBarPosition='bottom'>
                <Home navigation={this.props.navigation}/>
                {
                    this.props.ReduceEmployee.isLoggedIn ?
                        <AlwaysBuy navigation={this.props.navigation}/> :
                        <PleaseLogin navigation={this.props.navigation} Title='常购商品'/>

                }
                {
                    this.props.ReduceEmployee.isLoggedIn ?
                        <Cart navigation={this.props.navigation}/> :
                        <PleaseLogin navigation={this.props.navigation} Title='购物车'/>

                }
                <My navigation={this.props.navigation}/>
            </ScrollableTabView>
        );
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.ReduceCompanyType === null && nextProps.ReduceCompanyType !== this.props.ReduceCompanyType) {
            let type = nextProps.ReduceCompanyType;

        }
    }

    componentWillMount() {
        const {dispatch} = this.props;
        let companyTypeId = 3;
        dispatch(ActionCompanyType(companyTypeId));
    }
}

const styles = StyleSheet.create({
    content: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#EBEBEB',
        flex: 1
    }
});

function mapStateToProps(store) {
    return {
        ReduceEmployee: store.ReduceEmployee,
        ReduceCompanyType: store.ReduceCompanyType
    }
}

const connectBuyerIndex = connect(mapStateToProps)(BuyerIndex);
connectBuyerIndex.navigationOptions = NavigationOptions;
export default connectBuyerIndex;

