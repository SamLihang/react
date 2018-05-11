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
    AsyncStorage
} from 'react-native';
import BaseComponent, {
    deviceWidth,
    px2dp,
    getFitPX,
    px2dpH,
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
import {openDetail3, ActionPurchaseOrders3, ActionPurchaseOrders4} from '../../../actions/PurchaseOrderAction';
import {formaTime, toDecimal2} from "../../../utils/FormatUtil";

class List3 extends PullListComponent {
    constructor(props) {
        super(props);// 初始状态
        this.state = {
            toPay: false,
            dataSource: []
        }
    }

    static propTypes = {
        OnCancel: React.PropTypes.func,
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
        const PurchaseOrderId = item.PurchaseOrderId;
        let sCompanyId = item.SCompanyId;
        var self = this;
        var isOpen = item.IsOpen;
        let DeliveryAmount = item.DeliveryAmount;
        let dataSource = this.state.dataSource;
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
                        <View style={{position: 'absolute', right: px2dp(10)}}>
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
                        this.push('PurchaseOrderDetail', {PurchaseOrderId, PurchaseOrderState: 3, dataSource, key})
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
                        this.props.OnCancel(this.state.dataSource, PurchaseOrderId, key);
                    }}>
                        <BCText style={[gs.fts_13, gs.c_3a3838,]}>取消订单</BCText>
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

    onOpen(PurchaseOrderID, isOpen) {
        InteractionManager.runAfterInteractions(() => {
            const {dispatch} = this.props;
            dispatch(openDetail3(PurchaseOrderID, isOpen));
        });
    }

    onCancel(one, two, three, four, five) {
        this.props.mask.getShow({
            showMaks: one,
            type: two,
            PurchaseOrderId: three,
            dataSource: four,
            key: five
        })
    }

    toPush(PurchaseOrderId) {
        this.push('PurchaseOrderDetail', {PurchaseOrderId, PurchaseOrderState: 3, dataSource, key})
    }

    keyExtractor(item, index) {
        return item.PurchaseOrderId
    }

    onRefersh() {
        const {dispatch} = this.props;
        this._page = 1;
        dispatch(ActionPurchaseOrders3({p: this._page, t: 3}));
        dispatch(ActionPurchaseOrders4({p: this._page, t: 4}));
    }

    onEndReached() {
        const {dispatch} = this.props;
        this._page++;
        dispatch(ActionPurchaseOrders3({p: this._page, t: 3}));
    }

    WillMount() {
        const {dispatch} = this.props;

        dispatch(ActionPurchaseOrders3({p: this._page, t: 3}));
    }

    WillReceive(nextProps) {
        if (nextProps.ReducePurchaseOrders3.datas != null && nextProps.ReducePurchaseOrders3.datas !== this.props.ReducePurchaseOrders3.datas) {
            const {ReducePurchaseOrders3} = nextProps;
            const purchaseOrders3 = ReducePurchaseOrders3.datas;
            let dataSource = this.state.dataSource;
            if (purchaseOrders3.length <= 0) {
                if (this._page === 1) {
                    dataSource = purchaseOrders3;
                }
                this.noMoreData('暂时没有您的订单记录喔～');
            } else {
                if (this._page > 1 || dataSource.length <= 0) {
                    purchaseOrders3.map((purchaseOrder) => {
                        dataSource.push(purchaseOrder)
                    })
                } else {
                    dataSource = purchaseOrders3;
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
        ReducePurchaseOrders3: store.ReducePurchaseOrders3,
        currentEmployee: store.ReduceEmployee.currentEmployee,
    }

}

const connectPurchaseOrders3 = connect(mapStateToProps)(List3);
connectPurchaseOrders3.navigationOptions = NavigationOptions;
export default connectPurchaseOrders3;