/**
 * Created by Administrator on 2017/4/10.
 */
import React from "react";
import {connect} from "react-redux";
import {View, Platform} from "react-native";
import {
    BCHostImage,
    BCImage,
    BCText,
    BCTouchable,
    NavigationOptions,
    px2dp,
    px2dpH,
    getFitPX,
    substr,
    deviceWidth,
    deviceHeight
} from "../../../BaseComponent";
import {PullListComponent} from "../../PageComponent";
import gs from "../../../styles/MainStyles";
import styles from "./Styles";
import RenderListItem from "./RenderListItem";
import {ActionPurchaseOrders1, ActionPurchaseOrders3} from "../../../actions/PurchaseOrderAction";
import {formaTime,toDecimal2} from "../../../utils/FormatUtil";
const orderType = {
    "toPay": 1,
    "cancelOreder": 2
}
class List1 extends PullListComponent {
    constructor(props) {
        super(props);// 初始状态
    }

    static propTypes = {
        OnCancel: React.PropTypes.func,
        ToPay: React.PropTypes.func
    };

    renderNavigator() {
        return null;
    }

    _RenderListItem = [];

    renderRow(data) {
        let loginEmployee = this.props.currentEmployee;
        let bCompanyId = loginEmployee.CompanyId;
        const item = data.item;
        const key = data.index;
        let sCompanyId = item.SCompanyId;
        const PurchaseOrderId = item.PurchaseOrderId;
        const SCompanyId = item.SCompanyId;
        var isOpen = item.IsOpen;
        var self = this;
        let DeliveryAmount = item.DeliveryAmount;
        let dataSource = this.state.dataSource;
        return (
            <View style={[styles.outView, gs.bgc_fff]}>
                <BCTouchable style={[styles.company]} onPress={() => {
                    this.push('CompanyDetial', {bCompanyId, sCompanyId ,from:1})
                }}>
                    <View style={{width: deviceWidth-px2dp(12), alignItems: 'center', flexDirection: "row",}}>

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
                    key={key}
                    ref={(c) => {
                        if (c) {
                            this._RenderListItem.push(c);
                        }
                    }}
                    ToPush={() => {
                        this.push('PurchaseOrderDetail', {PurchaseOrderId, PurchaseOrderState: 1, dataSource, key})
                    }}
                />
                <View style={styles.titleText}>
                    <BCText style={[gs.fts_13, gs.c_3a3838,]}>共{this.itemNum(item.Items)}件商品
                        合计：</BCText>
                    <BCText style={[gs.fts_13, gs.c_fd0319]}>¥{toDecimal2(item.Amount + DeliveryAmount)}</BCText>
                    <BCText style={[gs.fts_13, gs.c_3a3838,]}>({DeliveryAmount ? '含配送费' + DeliveryAmount + '元' : '免配送费'})</BCText>
                </View>

                <View style={[styles.titleText, {borderTopWidth: 1, borderTopColor: '#f2f1ef'}]}>
                    <BCTouchable style={[styles.border, {borderColor: "#b0b1b6"}]} onPress={() => {
                        this.props.OnCancel(this.state.dataSource, PurchaseOrderId, key)
                    }}>
                        <BCText style={[gs.fts_13, gs.c_3a3838,]}>取消订单</BCText>
                    </BCTouchable>
                    <BCTouchable style={[styles.border, {borderColor: "#fd0319", marginLeft: px2dp(13)}]}
                                 onPress={() => {
                                     //this.props.ToPay(this.state.dataSource, PurchaseOrderId, key)
                                     this.push('PurchaseOrderDetail', {
                                         PurchaseOrderId,
                                         PurchaseOrderState: 1,
                                         dataSource,
                                         key
                                     })
                                 }}>
                        <BCText style={[gs.fts_13, gs.c_fd0319,]}>去支付</BCText>
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

    renderLine(item, index) {
        return (
            <View style={[styles.listItem]} key={index}>
                {
                    item.Image!=null?
                        <BCHostImage style={styles.productImg}
                                     source={{uri: item.Image}}/>
                        :
                        <BCImage style={styles.productImg}
                                 source={require('../../../imgs/LOGO.png')} />
                }
               <View style={styles.listItemRight}>
                    <BCText style={[gs.fts_16, gs.c_3a3838]}>{item.ProductName}</BCText>
                    <BCText style={[gs.fts_13, gs.c_3a3838]}>{item.Spec}</BCText>
                    <View style={styles.listDetail}>
                        <BCText style={[gs.fts_13, gs.c_fd0319,]}>¥{item.Price}/{item.Unit}</BCText>
                        {
                            item.Price == item.OriginalPrice ?
                                (null) :
                                <View style={[styles.actIcon, gs.bgc_fd0319,]}>
                                    {item.Price > item.OriginalPrice ?
                                        <BCText style={[gs.fts_10, gs.c_fff]}>升</BCText>
                                        :
                                        <BCText style={[gs.fts_10, gs.c_fff]}>降</BCText>
                                    }


                                </View>
                        }

                        <View style={styles.number}>

                            <BCText style={[gs.fts_13, gs.c_3a3838,]}>X{item.Quantity}</BCText>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    keyExtractor(item, index) {
        return item.PurchaseOrderId
    }

    onRefersh(item) {
        const {dispatch} = this.props;
        this._page = 1;
        dispatch(ActionPurchaseOrders1({p: this._page, t: 1}));
        dispatch(ActionPurchaseOrders3({p: this._page, t: 3}));

    }

    onEndReached() {
        const {dispatch} = this.props;
        this._page++
        dispatch(ActionPurchaseOrders1({p: this._page, t: 1}));
    }

    WillMount() {
        const {dispatch} = this.props;
        dispatch(ActionPurchaseOrders1({p: this._page, t: 1}));
    }

    WillReceive(nextProps) {
        if (nextProps.ReducePurchaseOrders1.datas != null && nextProps.ReducePurchaseOrders1.datas != this.props.ReducePurchaseOrders1.datas) {
            const {ReducePurchaseOrders1} = nextProps;
            const purchaseOrders1 = ReducePurchaseOrders1.datas;
            let dataSource = this.state.dataSource;
            if (purchaseOrders1.length <= 0) {
                if (this._page === 1) {
                    dataSource = purchaseOrders1;
                }
                this.noMoreData('暂时没有您的订单记录喔～');
            } else {
                if (this._page > 1 || dataSource.length <= 0) {
                    purchaseOrders1.map((purchaseOrder) => {
                        dataSource.push(purchaseOrder)
                    })
                } else {
                    dataSource = purchaseOrders1;
                }
            }

            this.setState({
                IsReceived: true,
                dataSource: dataSource,
                FlatListHeight: deviceHeight - (Platform.OS === 'ios' ? px2dpH(65) : px2dpH(60) ) - px2dpH(43)
            });
        }
    }
}

function mapStateToProps(store) {
    return {
        ReducePurchaseOrders1: store.ReducePurchaseOrders1,
        currentEmployee: store.ReduceEmployee.currentEmployee,
    }

}
const connectPurchaseOrders1 = connect(mapStateToProps)(List1);
connectPurchaseOrders1.navigationOptions = NavigationOptions;
export default connectPurchaseOrders1;