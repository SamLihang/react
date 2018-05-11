/**
 * Created by Administrator on 2017/4/10.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
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
    px2dpH,
    getFitPX,
    BCText,
    BCImage,
    BCTouchable,
    substr,
    deviceHeight,
    NavigationOptions,
    BCHostImage
} from '../../../BaseComponent';
import {PullListComponent} from '../../PageComponent'
import gs from '../../../styles/MainStyles';
import styles from './Styles';
import RenderListItem from './RenderListItem'
import {
    openDetail5, ActionPurchaseOrders5,
    ActionQuickSignPurchaseOrder,
    ActionDetailsInspectionPurchaseOrder,
    ActionPurchaseOrderDetail,
    SignPurchaseOrders5,
    ActionPurchaseOrders7
} from '../../../actions/PurchaseOrderAction';
import {toastShort} from '../../../utils/ToastUtil';
import {formaTime,toDecimal2} from "../../../utils/FormatUtil";

class List5 extends PullListComponent {
    constructor(props) {
        super(props);// 初始状态
        this.state = {
            toPay: false,
            dataSource: []
        }
    }


    static propTypes = {
        OnCheck: React.PropTypes.func,
    };
    renderNavigator() {
        return null;
    }

    _RenderListItem = [];

    onBack(){
        if(this.params.pageForm&&this.params.pageForm=="Jpush"){
            this.push("BuyerMy");
        }
    }
    renderRow(data) {
        let loginEmployee = this.props.currentEmployee;
        let bCompanyId = loginEmployee.CompanyId;
        const item = data.item;
        const key = data.index;
        const PurchaseOrderId = item.PurchaseOrderId;
        let sCompanyId = item.SCompanyId;
        const dataSource = this.state.dataSource;
        var self = this;
        var isOpen = item.IsOpen;
        let DeliveryAmount = item.DeliveryAmount;
        let SalesOrderId = item.SalesOrderId;
        return (
            <View style={[styles.outView, gs.bgc_fff]}>
                <BCTouchable style={[styles.company]} onPress={() => {
                    this.push('CompanyDetial', {bCompanyId, sCompanyId ,from:1})
                }}>
                    <View style={{width:deviceWidth-px2dp(12), alignItems: 'center', flexDirection: "row",}}>
                        {
                            item.CompanyLogo!=null?
                                <BCHostImage style={styles.companyImg}
                                             source={{uri: item.CompanyLogo}}/>
                                :
                                <BCImage style={styles.productImg}
                                         source={require('../../../imgs/LOGO.png')} />
                        }

                        <BCText
                            style={[gs.fts_16, gs.c_888, {paddingLeft: px2dp(7)}]}>{substr(item.CompanyName, 11)}</BCText>
                        <BCImage source={require('../../../imgs/right1.png')} style={{marginLeft: px2dp(10)}}/>
                        <View style={ {position: 'absolute', right: px2dp(10)}}>
                            <BCText
                                style={[gs.fts_12, gs.c_b7b7b7,]}>{formaTime(item.CreateTime, "yyyy-MM-dd hh:mm")}</BCText>
                        </View>
                    </View>
                </BCTouchable>
                <RenderListItem
                    Company={item}
                    PurchaseOrderId={PurchaseOrderId}
                    ActualQuantity={item.ActualQuantity}
                    BCompanyId={bCompanyId}
                    PurchaseOrderLineId={item.PurchaseOrderLineId}
                    key={key}
                    ref={(c) => {
                        if (c) {
                            this._RenderListItem.push(c);
                        }
                    }}
                    ToPush={() => {
                        this.toPush(PurchaseOrderId,{index:2});
                    }}
                />

                <View style={styles.titleText}>
                    <BCText style={[gs.fts_13, gs.c_3a3838,]}>共{this.itemNum(item.Items)}件商品
                        合计：</BCText>
                    <BCText style={[gs.fts_13, gs.c_fd0319]}>¥{toDecimal2(item.Amount + DeliveryAmount)}</BCText>
                    <BCText style={[gs.fts_13, gs.c_3a3838,]}>({DeliveryAmount ? '含配送费' + DeliveryAmount + '元' : '免配送费'})</BCText>
                </View>

                <View style={[styles.titleText, {borderTopWidth: 1, borderTopColor: '#f2f1ef'}]}>
                    <BCTouchable style={[styles.border, {borderColor: "#b0b1b6"}]}      // gs.c_fd0319
                                 onPress={() => {
                                     //this.quickSign(PurchaseOrderId, dataSource, key, bCompanyId, SalesOrderId);
                                     this.props.OnCheck(PurchaseOrderId, dataSource, key, bCompanyId, SalesOrderId);
                                 }}
                    >
                        <BCText style={[gs.fts_13, {color: "#333"},]}>快速签收</BCText>
                    </BCTouchable>
                    <BCTouchable style={[styles.border, {borderColor: "#b0b1b6", marginLeft: px2dp(13)}]}      // FBAB10
                                 onPress={() => {
                                     this.push('CheckDetail', {PurchaseOrderId, dataSource, key})
                                 }}
                    >
                        <BCText style={[gs.fts_13, {color: "#333"}]}>详细验货</BCText>
                    </BCTouchable>
                </View>
            </View>)
    }

    itemNum(items) {
        let num = 0;
        items.map((item, index) => {
            num += item.Quantity;
        });
        return (
            <BCText>{num}</BCText>
        )
    }

    toPush(PurchaseOrderId) {
        this.push('PurchaseOrderDetail', {PurchaseOrderId, PurchaseOrderState: 5})
    }

    onOpen(PurchaseOrderID, isOpen) {
        InteractionManager.runAfterInteractions(() => {
            const {dispatch} = this.props;
            dispatch(openDetail5(PurchaseOrderID, isOpen));
        });
    }

    quickSign(PurchaseOrderId, dataSource, key, bCompanyId, SalesOrderId) {
        const {dispatch} = this.props;
        let ListItem = this._RenderListItem;
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
        var purchaseOrderStr = JSON.stringify(SignData);
        this._Loading.Trigger(true);
        dispatch(ActionDetailsInspectionPurchaseOrder(purchaseOrderStr));
        //toastLong("签收成功");
        let lists = dataSource;
        lists.splice(key, 1);
        this.setState({
            dataSource: lists
        });
    }

    keyExtractor(item, index) {
        return item.PurchaseOrderId
    }

    onRefersh() {
        const {dispatch} = this.props;
        this._page = 1;
        dispatch(ActionPurchaseOrders5({p: this._page, t: 5}));
    }

    onEndReached() {
        const {dispatch} = this.props;
        this._page++;
        dispatch(ActionPurchaseOrders5({p: this._page, t: 5}));
    }

    WillMount() {
        const {dispatch} = this.props;
        dispatch(ActionPurchaseOrders5({p: this._page, t: 5}));
    }

    WillReceive(nextProps) {
        const {dispatch} = this.props;
        if (nextProps.ReducePurchaseOrders5.datas != null && nextProps.ReducePurchaseOrders5.datas != this.props.ReducePurchaseOrders5.datas) {
            const {ReducePurchaseOrders5} = nextProps;
            const purchaseOrders5 = ReducePurchaseOrders5.datas;
            let dataSource = this.state.dataSource;
            if (purchaseOrders5.length <= 0) {
                if (this._page === 1) {
                    dataSource = purchaseOrders5;
                }
                this.noMoreData('暂时没有您的订单记录喔～');
            } else {
                if (this._page > 1 || dataSource.length <= 0) {
                    purchaseOrders5.map((purchaseOrder) => {
                        dataSource.push(purchaseOrder)
                    })
                } else {
                    dataSource = purchaseOrders5;
                }
            }
            this.setState({
                IsReceived: true,
                dataSource: dataSource,
                FlatListHeight: deviceHeight - (Platform.OS === 'ios' ? px2dpH(65) : px2dpH(55) ) - px2dpH(50)
            });
        }
        if (nextProps.ReduceDetailsInspectionPurchaseOrder.datas != null && nextProps.ReduceDetailsInspectionPurchaseOrder.datas !== this.props.ReduceDetailsInspectionPurchaseOrder.datas) {
            this._Loading.Trigger(false);
            //toastShort("验货成功");
            this._page=1;
            dispatch(ActionPurchaseOrders5({p: this._page, t: 5}));
        }

    }
}

function mapStateToProps(store) {
    return {
        ReducePurchaseOrders5: store.ReducePurchaseOrders5,
        currentEmployee: store.ReduceEmployee.currentEmployee,
        ReduceDetailsInspectionPurchaseOrder: store.ReduceDetailsInspectionPurchaseOrder,
    }

}
const connectPurchaseOrders5 = connect(mapStateToProps)(List5);
connectPurchaseOrders5.navigationOptions = NavigationOptions;
export default connectPurchaseOrders5;

