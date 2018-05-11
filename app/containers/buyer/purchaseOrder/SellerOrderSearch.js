import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Platform,
    ScrollView,
    InteractionManager
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
import {toastShort} from '../../../utils/ToastUtil';
import gs from '../../../styles/MainStyles';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import BCTabBar from '../../../components/BCTabBar';
import BCTextTabBar from '../../../components/BCTextTabBar';
import PasswordInput from '../../../components/PasswordInput'
import styles from '../purchaseOrder/Styles';
import {
    ActionPurchaseOrders1,
    ActionCancelPurchaseOrder,
    ActionDetailsInspectionPurchaseOrder
} from '../../../actions/PurchaseOrderAction';
import SearchInputBar from '../../../components/SearchInputBar';
import {fetchPurchaseOrders} from '../../../services/PurchaseOrderServices';

import List1 from './List1';
import List3 from './List3';
import List4 from './List4';
import List5 from './List5';
import List7 from './List7';

//取消订单
class OnCancelMaks extends Component {
    constructor(props) {
        super(props)
        this.state = {
            IsShow: false
        }
    }

    dataSource = null;
    purchaseOrderId = 0;
    key = 0;

    static propTypes = {
        Confirm: React.PropTypes.func,
        Cancle: React.PropTypes.func
    };

    Trigger(v) {
        this.setState({
            IsShow: v
        })
    }

    render() {
        return (
            this.state.IsShow ?
                <View style={[styles.selectType]}>
                    <View style={[styles.topView]}>
                        <BCText style={[gs.fts_18, styles.topTitle]}>确定取消该订单吗？</BCText>
                    </View>
                    <View style={[styles.line]}>
                    </View>
                    <View style={{flexDirection: "row", marginBottom: px2dp(15)}}>
                        <BCTouchable style={[styles.menuItem, gs.bgc_fff, {
                            borderRightWidth: 0.5, borderRightColor: "#dbdbdb"
                        }]}
                                     onPress={() => this.props.Cancle()}>
                            <BCText style={[gs.fts_17, gs.fts_18, {color: '#3b5df2', marginTop: px2dp(2)}]}>取消</BCText>
                        </BCTouchable>
                        <BCTouchable style={[styles.menuItem, gs.bgc_fff,]}
                                     onPress={() => this.props.Confirm()}>
                            <BCText style={[gs.fts_17, gs.fts_18, {color: '#3b5df2', marginTop: px2dp(2)}]}>确定</BCText>
                        </BCTouchable>
                    </View>
                </View> : null
        )
    }
}
//快速验货
class QuickSignMaks extends Component {
    constructor(props) {
        super(props)
        this.state = {
            IsShow: false
        }
    }

    dataSource = null;
    purchaseOrderId = 0;
    key = 0;

    static propTypes = {
        Confirm: React.PropTypes.func,
        Cancle: React.PropTypes.func
    };

    Trigger(v) {
        this.setState({
            IsShow: v
        })
    }

    render() {
        return (
            this.state.IsShow ?
                <View style={[styles.selectType]}>
                    <View style={[styles.topView]}>
                        <BCText style={[gs.fts_18, styles.topTitle]}>确定验货吗？</BCText>
                    </View>
                    <View style={[styles.line]}>
                    </View>
                    <View style={{flexDirection: "row", marginBottom: px2dp(15)}}>
                        <BCTouchable style={[styles.menuItem, gs.bgc_fff, {
                            borderRightWidth: 0.5, borderRightColor: "#dbdbdb"
                        }]}
                                     onPress={() => this.props.Cancle()}>
                            <BCText style={[gs.fts_17, gs.fts_18, {color: '#3b5df2', marginTop: px2dp(2)}]}>取消</BCText>
                        </BCTouchable>
                        <BCTouchable style={[styles.menuItem, gs.bgc_fff,]}
                                     onPress={() => this.props.Confirm()}>
                            <BCText style={[gs.fts_17, gs.fts_18, {color: '#3b5df2', marginTop: px2dp(2)}]}>确定</BCText>
                        </BCTouchable>
                    </View>
                </View> : null
        )
    }
}
//去支付
class ToPayMaks extends Component {
    constructor(props) {
        super(props)
        this.state = {
            IsShow: false
        }
    }

    dataSource = null;
    purchaseOrderId = 0;
    key = 0;

    static propTypes = {
        Cancle: React.PropTypes.func
    };

    Trigger(v) {
        this.setState({
            IsShow: v
        })
    }

    render() {
        return (
            this.state.IsShow ?
                <View style={{
                    zIndex: 2,
                    position: 'absolute',
                    bottom: 0,
                    width: deviceWidth,
                    backgroundColor: '#fff',
                    height: px2dp(260)
                }}>
                    <View style={[gs.bdc_e3e3e3, {
                        flexDirection: 'row',
                        height: px2dp(49),
                        borderBottomWidth: px2dp(0.5),
                        alignItems: 'center'
                    }]}>
                        <BCTouchable onPress={() => this.props.Cancle()}>
                            <BCImage style={{marginLeft: px2dp(12)}}
                                     source={require("../../../imgs/close@2x.png")}></BCImage>
                        </BCTouchable>
                        <BCText
                            style={[gs.fts_17, {color: 'black', marginLeft: px2dp(100)}]}>请输入支付密码</BCText>
                    </View>
                    <View style={{flexDirection: 'row', marginTop: px2dp(30), marginLeft: px2dp(15)}}>
                        <PasswordInput maxLength={6} onChangeText={
                            (text) => {
                                alert(text)
                            }}
                        />
                    </View>

                    <BCTouchable style={{marginTop: px2dp(12), marginLeft: px2dp(282)}}>
                        <BCText style={[gs.fts_15, {color: '#148DE4'}]}>忘记密码？</BCText>
                    </BCTouchable>
                    {/* <View style={{alignItems: 'center', justifyContent: 'center', marginTop: px2dp(25)}}>
                     <BCText style={[gs.fts_14, gs.c_888]}>*未设置支付密码是，默认为登录密码</BCText>
                     </View>*/}
                </View> : null
        )
    }
}

export default class SellerOrderSearch extends PullViewComponent {
    _ListItems = {};
    _OnCancelMaks = null;
    _ToPayMaks = null;
    _QuickSignMaks = null;

    static defaultProps = {};
    static propTypes = {
        backCallBack: React.PropTypes.func,
        goSearch: React.PropTypes.func
    }

    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            tabNames: ['待付款', '待接单', '待发货', '待验货', '已完成'],
            tabColor: ['#00C164', '#000000'],
            lineColor: ['#00C164', '#ffffff'],
            initialPage: 0
        }
    }

    renderTop() {
        return (
            <SearchInputBar
                onChangeText={(text) => {
                    if (text) {
                        fetchPurchaseOrders({
                            t: 1,
                            searchKey: text
                        }).then((ret) => {
                            if (ret.data.Products) {
                                this.setState({
                                    dataSource: ret.data.Products
                                })
                            }
                        }).catch((e) => {

                        });
                    }
                    else {

                    }
                }}
                onEndEditing={() => {

                }}
                onCanale={() => {
                    if (this.params.callBack) {
                        this.params.callBack();
                    }

                    this.pop();
                }}
            />
        )
    }

    renderList() {
        const navigation = this.props.navigation;
        let tabNames = this.state.tabNames;
        let tabColor = this.state.tabColor;
        let lineColor = this.state.lineColor;

        return (
            <View style={{height: deviceHeight - (Platform.OS === 'ios' ? px2dp(65) : px2dp(45))}}>
                <ScrollableTabView locked={true}
                                   initialPage={this.state.initialPage}
                                   renderTabBar={() => <BCTextTabBar tabNames={tabNames} tabColor={tabColor}
                                                                     lineColor={lineColor}/>}
                                   tabBarPosition='top'
                                   onChangeTab={({i, from}) => {

                                   }}>
                    <List1
                        navigation={navigation}
                        ToPay={(dataSource, purchaseOrderId, key) => {
                            this._Maks.Trigger(true);
                            this._ToPayMaks.Trigger(true);
                            this._ToPayMaks.dataSource = dataSource;
                            this._ToPayMaks.purchaseOrderId = purchaseOrderId;
                            this._ToPayMaks.key = key;
                        }}
                        OnCancel={(dataSource, purchaseOrderId, key) => {
                            this._Maks.Trigger(true);
                            this._OnCancelMaks.Trigger(true);
                            this._OnCancelMaks.dataSource = dataSource;
                            this._OnCancelMaks.purchaseOrderId = purchaseOrderId;
                            this._OnCancelMaks.key = key;
                        }}/>
                    <List3 navigation={navigation}
                           OnCancel={(dataSource, purchaseOrderId, key) => {
                               this._Maks.Trigger(true);
                               this._OnCancelMaks.Trigger(true);
                               this._OnCancelMaks.dataSource = dataSource;
                               this._OnCancelMaks.purchaseOrderId = purchaseOrderId;
                               this._OnCancelMaks.key = key;
                           }}
                    />
                    <List4 navigation={navigation}/>
                    <List5 navigation={navigation}
                           OnCheck={(PurchaseOrderId, dataSource, key, bCompanyId, SalesOrderId) => {
                               this._Maks.Trigger(true);
                               this._QuickSignMaks.Trigger(true);
                               this._OnCancelMaks.purchaseOrderId = PurchaseOrderId;
                               this._QuickSignMaks.dataSource = dataSource;
                               this._QuickSignMaks.bCompanyId = bCompanyId;
                               this._QuickSignMaks.key = key;
                               this._QuickSignMaks.SalesOrderId = SalesOrderId;
                           }}

                    />
                    <List7 navigation={navigation} style={{minHeight: deviceHeight + 1, marginBottom: px2dp(50)}}/>
                </ScrollableTabView>
            </View>
        );
    }

    render() {
        return (
            <View style={[styles.main, gs.bgc_f2f1ef]}>
                {this.renderTop()}
                {this.renderList()}
            </View>
        )
    }

    WillMount() {
        const {pageType} = this.params;
        this.GlobalData = {pageType};
    }
}
