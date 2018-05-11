import React, {Component} from 'react';
import {connect} from 'react-redux';
import {StyleSheet, Platform, DeviceEventEmitter, NativeAppEventEmitter} from 'react-native';
import ScrollableTabView, {DefaultTabBar, ScrollableTabBar} from 'react-native-scrollable-tab-view';
import BCTabBar from '../components/BCTabBar';
import {BASEPX, deviceWidth, px2dp, BCText, NavigationOptions} from '../BaseComponent';
import Index from './seller/product/Index';
import My from './seller/my/My';
import AccountManagement from './seller/account/AccountManagement';
import OrderManagement from './seller/orderManagement/OrderManagement';
import {ActionCompanyType} from "../actions/EmployeeAction";
import {toastShort} from '../utils/ToastUtil';
import JPushModule from 'jpush-react-native';
import {NavigationActions} from 'react-navigation'

import PleaseLogin from './PleaseLogin';

class SellerIndex extends Component {

    constructor(props) {
        super(props);
        this.navigation = this.props.navigation;
        this.state = {
            tabNames: ['商品管理', '订单管理', '账单管理', '我的'],
            tabIcon: [require('../imgs/Commoditymanagement.png'), require('../imgs/Ordermanagement.png'), require('../imgs/Accountmanagement.png'), require('../imgs/mine2.png')],
            tabIconSelected: [require('../imgs/Commoditymanagement2.png'), require('../imgs/Ordermanagement2.png'), require('../imgs/Accountmanagement2.png'), require('../imgs/Seller2.png')],
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
                tabBarPosition='bottom'>
                <Index navigation={this.props.navigation}/>
                {
                    this.props.ReduceEmployee.isLoggedIn ?
                        <OrderManagement navigation={this.props.navigation}/> :
                        <PleaseLogin navigation={this.props.navigation} Title='订单管理'/>

                }
                {
                    this.props.ReduceEmployee.isLoggedIn ?
                        <AccountManagement navigation={this.props.navigation}/> :
                        <PleaseLogin navigation={this.props.navigation} Title='账单管理'/>

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
        let companyTypeId = 2;
        dispatch(ActionCompanyType(companyTypeId));
    }

    componentDidMount() {
        const {dispatch, navigation} = this.props;

        if (Platform.OS == 'ios') {

            // NativeAppEventEmitter.addListener('OpenNotification', (message) => {
            //     toastShort('点击推送的消息' + message);
            // });
            //
            // let subscription = NativeAppEventEmitter.addListener(
            //     'ReceiveNotification',
            //     (notification) => toastShort(notification)
            // );
        }
        else {
            //初始化
            //JPushModule.initPush();
            //JPushModule.notifyJSDidLoad();

            //这是默认的通知消息
            /*JPushModule.addReceiveCustomMsgListener((message) => {
                //toastShort(message)
            });*/

            //自定义推送的消息
            /*JPushModule.addReceiveNotificationListener((map) => {
                //console.log("alertContent: " + map.alertContent);
                //extra是可选配置上的附件字段
                //console.log("extras: " + map.extras);
                let message = JSON.parse(map.extras);
                toastShort(message)
                //这里面解析json数据，并存在数据库中，同时显示在通知栏上
            })*/

            //点击通知进入应用的主页，相当于跳转到制定的页面
            // JPushModule.addReceiveOpenNotificationListener((map) => {
            //     let message = JSON.parse(map.extras);
            //     toastShort(message);
            //
            //     const resetAction = NavigationActions.reset({
            //         index: 0,
            //         actions: [
            //             NavigationActions.navigate({routeName: 'SellerBill'})
            //         ]
            //     });
            //     navigation.dispatch(resetAction);
            //     //this.push('SellerBill')
            // })
        }

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

const connectBuyerIndex = connect(mapStateToProps)(SellerIndex);
connectBuyerIndex.navigationOptions = NavigationOptions;
export default connectBuyerIndex;

