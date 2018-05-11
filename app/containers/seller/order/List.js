/**
 * Created by Administrator on 2017/4/10.
 */
import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Image,
    Platform,
    TouchableOpacity,
    TextInput,
    ScrollView,
    InteractionManager,
    ListView,
    AsyncStorage,
} from 'react-native';

import BaseComponent, {
    deviceWidth,
    px2dp,
    BCText,
    BCImage,
    BCTouchable,
    substr,
    deviceHeight,
    NavigationOptions
} from '../../../BaseComponent';
import PageComponent, {PullViewComponent, PullListComponent} from '../../PageComponent'
import {connect} from 'react-redux';
import {toastLong} from '../../../utils/ToastUtil';
import gs from '../../../styles/MainStyles';
import ScrollableTabView, {ScrollableTabBar, DefaultTabBar}  from 'react-native-scrollable-tab-view';
import BCTabBar from '../../../components/BCTabBar';
import BCTextTabBar from '../../../components/BCTextTabBar';
import PasswordInput from '../../../components/PasswordInput'
import {
    ActionSellerSalesOrder1,
    ActionSellerSalesOrder3,
    ActionSellerSalesOrder5,
    ActionSellerSalesOrder7
} from '../../../actions/SellerSalesOrderAction';

import List1 from './List1';
import List3 from './List3';
import List5 from './List5';
import List7 from './List7';
class SellerList extends PageComponent {
    _page = 1;

    constructor(props) {
        super(props);
        this.state = {
            tabNames: ['待接单', '待发货', '待验货', '已完成'],
            tabColor: ['#31ca96', '#000000'],
            lineColor: ['#31ca96', '#ffffff'],
            initialPage: 0
        };
    }

    _OnCancelMaks = null;
    _ToPayMaks = null;

    //设置页面标题
    setTitle() {
        return "订单列表"
    }
    onBack(){
        if(this.params&&this.params.pageForm&&this.params.pageForm=="Jpush"){
            this.push("SellerIndex")
        }
    }
    //主分类
    content() {
        const {dispatch} = this.props;
        const navigation = this.props.navigation;
        let tabNames = this.state.tabNames;
        let tabColor = this.state.tabColor;
        let lineColor = this.state.lineColor;
        return (
            <View style={{flex: 1}}>
                <ScrollableTabView
                    locked={true}
                    initialPage={this.state.initialPage}
                    renderTabBar={() => <BCTextTabBar tabNames={tabNames} tabColor={tabColor} lineColor={lineColor}/>}
                    tabBarPosition='top'
                    onChangeTab={(currentPage) => {
                        {/* if(currentPage.i===0){
                         dispatch(ActionSellerSalesOrder1({p: this._page,t: 1}));
                         }
                         if(currentPage.i===1){
                         dispatch(ActionSellerSalesOrder3({p:  this._page,t: 3}));
                         }
                         if(currentPage.i===2){
                         dispatch(ActionSellerSalesOrder5({p: this._page,t: 5}));
                         }
                         if(currentPage.i===3){
                         dispatch(ActionSellerSalesOrder7({p:  this._page,t: 7}));
                         }*/
                        }
                    }}
                >
                    <List1 navigation={navigation}/>
                    <List3 navigation={navigation}/>
                    <List5 navigation={navigation}/>
                    <List7 navigation={navigation}/>
                </ScrollableTabView>
            </View>
        );
    }

    WillMount() {
        let initialPage = 0
        if (this.params && this.params.initialPage >= 0) {
            initialPage = this.params.initialPage
        }
        this.setState({
            IsReceived: true,
            initialPage: initialPage
        })
    }

    /*WillReceive(nextProps) {
     if (nextProps.ReduceCancelPurchaseOrder.datas != null && nextProps.ReduceCancelPurchaseOrder.datas !== this.props.ReduceCancelPurchaseOrder.datas) {
     var lists =this._OnCancelMaks.dataSource;
     const key=this._OnCancelMaks.key;
     lists.splice(key, 1);
     this.setState({
     dataSource:lists
     })
     this._Loading.Trigger(false);
     }
     }*/
}

function mapStateToProps(store) {
    return {
        //ReduceCancelPurchaseOrder: store.ReduceCancelPurchaseOrder
    }

}
const connectList = connect(mapStateToProps)(SellerList);
connectList.navigationOptions = NavigationOptions;
export default connectList;