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
import {toastShort} from '../../../utils/ToastUtil';
import gs from '../../../styles/MainStyles';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import BCTabBar from '../../../components/BCTabBar';
import BCTextTabBar from '../../../components/BCTextTabBar';
import PasswordInput from '../../../components/PasswordInput'
import styles from './Styles';
import {
    ActionPurchaseOrders1,
    ActionCancelPurchaseOrder,
    ActionDetailsInspectionPurchaseOrder,
    ActionPurchaseOrders7
} from '../../../actions/PurchaseOrderAction';
import {fetchCheckSignPassword} from "../../../services/PurchaseOrderServices";
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
/*class QuickSignMaks extends Component {
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
}*/

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

    //6位输完
    endText(password) {
        this.props._changeText(password);
    }


    render() {
        return (
            this.state.IsShow ?
                <View style={{
                    zIndex: 99,
                    position: 'absolute',
                    bottom: 0,
                    width: deviceWidth,
                    backgroundColor: '#fff',
                    height: Platform.OS == 'ios' ? 400 : 180
                }}>
                    <View style={[gs.bdc_e3e3e3, {
                        flexDirection: 'row',
                        height: px2dp(49),
                        borderBottomWidth: px2dp(0.5),
                        alignItems: 'center'
                    }]}>
                        <BCTouchable onPress={() => this.props.Cancle()}>
                            <BCImage style={{marginLeft: px2dp(12)}}
                                     source={require("../../../imgs/close.png")}></BCImage>
                        </BCTouchable>
                        <BCText
                            style={[gs.fts_17, {color: 'black', marginLeft: px2dp(100)}]}>请输入验货密码</BCText>
                    </View>
                    <View style={{flexDirection: 'row', marginTop: px2dp(30), marginLeft: px2dp(15)}}>
                        <PasswordInput maxLength={6}
                                       onEnd={(text) => {
                                           this.endText(text);
                                       }}
                        />
                    </View>
                    <BCTouchable style={{marginTop: px2dp(12), marginLeft: px2dp(282)}}
                                 onPress={() => {
                                     this.props.ToForgetCheck();
                                 }}
                    >
                        <BCText style={[gs.fts_15, {color: '#148DE4'}]}>忘记密码？</BCText>
                    </BCTouchable>
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

class List extends PageComponent {
    constructor(props) {
        super(props);
        this.state = {
            tabNames: ['待付款', '待接单', '待发货', '待验货', '已完成'],
            tabColor: ['#00C164', '#000000'],
            lineColor: ['#00C164', '#ffffff'],
            initialPage: 0
        };
    }

    _OnCancelMaks = null;
    _ToPayMaks = null;
    _QuickSignMaks = null;

    //设置页面标题
    setTitle() {
        return "订单列表"
    }
    //设置页面标题右边为图片时的地址
    rightType() {
        //return 'imgSearch'
    }

    //点击搜索
    goSearch() {
        //this.push('SellerOrderSearch', {callBack: null})
    }

    onBack(){
        if(this.params&&this.params.pageFrom&&this.params.pageFrom=="Jpush"){
            this.push("BuyerIndex");
        }
    }

    //主分类
    content() {
        const navigation = this.props.navigation;
        let tabNames = this.state.tabNames;
        let tabColor = this.state.tabColor;
        let lineColor = this.state.lineColor;
        return (
            <View style={{flex: 1}}>
                <ScrollableTabView locked={true}
                                   initialPage={this.state.initialPage}
                                   renderTabBar={() => <BCTextTabBar tabNames={tabNames} tabColor={tabColor}
                                                                     lineColor={lineColor}/>}
                                   tabBarPosition='top'>
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

    maksContent() {
        return (
            <View>
                <OnCancelMaks
                    ref={(ref) => this._OnCancelMaks = ref}
                    Cancle={() => {
                        this._OnCancelMaks.Trigger(false);
                        this._Maks.Trigger(false);
                    }}
                    Confirm={() => {
                        const {dispatch} = this.props;
                        this._Maks.Trigger(false);
                        this._OnCancelMaks.Trigger(false);
                        this._Loading.Trigger(true);
                        dispatch(ActionCancelPurchaseOrder(this._OnCancelMaks.purchaseOrderId));
                    }}
                />
                <ToPayMaks ref={(ref) => this._ToPayMaks = ref}
                           Cancle={() => {
                               this._ToPayMaks.Trigger(false);
                               this._Maks.Trigger(false);
                           }}
                />
                <QuickSignMaks
                    ref={(ref) => this._QuickSignMaks = ref}
                    ToForgetCheck={() => {
                        this.navigation.navigate('ReviseCheckPassword')
                    }}
                    Cancle={() => {
                        this._QuickSignMaks.Trigger(false);
                        this._Maks.Trigger(false);
                    }}
                    _changeText={(password) => {
                        const {dispatch,} = this.props;
                        //验证支付密码是否正确
                        fetchCheckSignPassword({password}).then((ret) => {
                            if (ret.data === null) {
                                //支付密码正确后调用
                                this._Maks.Trigger(false);
                                this._QuickSignMaks.Trigger(false);
                                this._Loading.Trigger(true);
                                let PurchaseOrderId = this._OnCancelMaks.purchaseOrderId;
                                let dataSource = this._QuickSignMaks.dataSource;
                                let bCompanyId = this._QuickSignMaks.bCompanyId;
                                let key = this._QuickSignMaks.key;
                                let SalesOrderId = this._QuickSignMaks.SalesOrderId;
                                let SignData = {
                                    PurchaseOrderId: PurchaseOrderId,
                                    ActualAmount: 0,
                                    SalesOrderId: SalesOrderId,
                                    BCompanyId: bCompanyId,
                                    PurchaseOrderLines: {Items: []}
                                };
                                dataSource.map((data, index) => {
                                    data.Items.map((list, i) => {
                                        if (data.PurchaseOrderId === PurchaseOrderId) {
                                            SignData.ActualAmount = data.ActualAmount;
                                            SignData.PurchaseOrderLines.Items.push(
                                                {
                                                    ActualQuantity: list.RealQuantity,
                                                    BCompanyId: bCompanyId,
                                                    PurchaseOrderId: data.PurchaseOrderId,
                                                    PurchaseOrderLineId: list.PurchaseOrderLineId,
                                                    Remark: "",
                                                }
                                            );
                                        }
                                    })
                                });
                                let purchaseOrderStr = JSON.stringify(SignData);
                                dispatch(ActionDetailsInspectionPurchaseOrder(purchaseOrderStr));
                                //this._Loading.Trigger(true);
                                //自动关闭支付弹窗
                                this._ToPayMaks.Trigger(false);
                                this._Maks.Trigger(false);
                            }
                            else if (ret.error) {
                                if (ret.error.message == "请先设置验货密码") {
                                    this.push('ReviseCheckPassword');
                                    this._ToPayMaks.Trigger(false);
                                    this._Maks.Trigger(false);
                                    this._Loading.Trigger(false);
                                } else {
                                    //toastShort("验货失败,请重新输入验货密码");
                                    this._Loading.Trigger(false);
                                }
                            }

                        }).catch((e) => {
                            //toastShort("验货失败,请重新输入验货密码");
                            this._Loading.Trigger(false);
                        });

                    }}
                    Confirm={() => {
                        const {dispatch} = this.props;
                        this._Maks.Trigger(false);
                        this._QuickSignMaks.Trigger(false);
                        this._Loading.Trigger(true);
                        let PurchaseOrderId = this._OnCancelMaks.purchaseOrderId;
                        let dataSource = this._QuickSignMaks.dataSource;
                        let bCompanyId = this._QuickSignMaks.bCompanyId;
                        let key = this._QuickSignMaks.key;
                        let SalesOrderId = this._QuickSignMaks.SalesOrderId;
                        let SignData = {
                            PurchaseOrderId: PurchaseOrderId,
                            ActualAmount: 0,
                            SalesOrderId: SalesOrderId,
                            BCompanyId: bCompanyId,
                            PurchaseOrderLines: {Items: []}
                        };
                        dataSource.map((data, index) => {
                            data.Items.map((list, i) => {
                                if (data.PurchaseOrderId === PurchaseOrderId) {
                                    SignData.ActualAmount = data.ActualAmount;
                                    SignData.PurchaseOrderLines.Items.push(
                                        {
                                            ActualQuantity: list.ActualQuantity,
                                            BCompanyId: bCompanyId,
                                            PurchaseOrderId: data.PurchaseOrderId,
                                            PurchaseOrderLineId: list.PurchaseOrderLineId,
                                            Remark: "",
                                        }
                                    );
                                }
                            })
                        });
                        let purchaseOrderStr = JSON.stringify(SignData);
                        dispatch(ActionDetailsInspectionPurchaseOrder(purchaseOrderStr));
                        //toastLong("签收成功");
                        {/*let lists = dataSource;
                         lists.splice(key, 1);
                         this.setState({
                         dataSource: lists
                         });*/
                        }
                    }}
                />
            </View>
        )
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

    WillReceive(nextProps) {
        if (nextProps.ReduceCancelPurchaseOrder.datas != null && nextProps.ReduceCancelPurchaseOrder.datas !== this.props.ReduceCancelPurchaseOrder.datas) {
            if (this._OnCancelMaks.dataSource) {
                var lists = this._OnCancelMaks.dataSource;
                const key = this._OnCancelMaks.key;
                lists.splice(key, 1);
                this.setState({
                    dataSource: lists
                })
            }
            this._Loading.Trigger(false);
            if (Platform.OS === 'ios') {
                toastShort("取消成功");
            } else {
                toastShort("取消成功");
            }
        }
        if (nextProps.ReduceCancelPurchaseOrder.error != null && nextProps.ReduceCancelPurchaseOrder.error !== this.props.ReduceCancelPurchaseOrder.error) {
            this._Loading.Trigger(false);
        }
        if (nextProps.ReduceDetailsInspectionPurchaseOrder.datas != null && nextProps.ReduceDetailsInspectionPurchaseOrder.datas !== this.props.ReduceDetailsInspectionPurchaseOrder.datas) {
            if (this._QuickSignMaks.dataSource) {
                let lists = this._QuickSignMaks.dataSource;
                const key = this._QuickSignMaks.key;
                lists.splice(key, 1);
                this.setState({
                    dataSource: lists
                })
                toastShort("验货成功");
            }
            this._Loading.Trigger(false);

            const {dispatch} = this.props;
            //dispatch(ActionPurchaseOrders7({p: 1, t: 7}));
        }
        if (nextProps.ReduceDetailsInspectionPurchaseOrder.error != null && nextProps.ReduceDetailsInspectionPurchaseOrder.error !== this.props.ReduceDetailsInspectionPurchaseOrder.error) {
            if (this._QuickSignMaks.dataSource) {
                this._Loading.Trigger(false);
            }
        }
    }
}

function mapStateToProps(store) {
    return {
        ReduceCancelPurchaseOrder: store.ReduceCancelPurchaseOrder,
        ReduceDetailsInspectionPurchaseOrder: store.ReduceDetailsInspectionPurchaseOrder,
    }

}
const connectList = connect(mapStateToProps)(List);
connectList.navigationOptions = NavigationOptions;
export default connectList;