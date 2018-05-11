import React from "react";
import {Platform, StyleSheet, View} from "react-native";
import {
    BCImage,
    BCText,
    BCTouchable,
    deviceHeight,
    deviceWidth,
    px2dp,
    NavigationOptions
} from "../../../BaseComponent";
import {PullViewComponent} from "../../PageComponent";
import gs from "../../../styles/MainStyles";
import {connect} from "react-redux";
import {ActionSellerPurchaseAmount} from "../../../actions/CurrentPurchaseAmountAction";
import {formaTime,toDecimal2,} from "../../../utils/FormatUtil";

class OrderManagement extends PullViewComponent {
    //去除头部栏
    renderNavigator() {
        return null;
    }

    renderTop() {
        let {ReduceSellerPurchaseAmount} = this.props;
        let datas = ReduceSellerPurchaseAmount.datas;
        let MonthAmount = datas.MonthAmount;
        let WeekAmount = datas.WeekAmount;
        let TodayAmount = datas.TodayAmount;
        return (
            <View style={Styles.headerStyle}>
                <View style={Styles.salesvolume}>
                    <BCText style={[gs.fts_15, gs.c_fff, {
                        marginTop: px2dp(10),
                        marginLeft: px2dp(20)
                    }]}>当月销售额(元)</BCText>
                    <BCText
                        style={[gs.c_fff, gs.bold, Styles.textBold]}>{toDecimal2(MonthAmount)}</BCText>
                </View>
                <View style={Styles.moneyList}>
                    <BCTouchable style={Styles.btnStyle} onPress={() => {
                        this.push('SellerStatisticsChart')
                    }}>
                        <BCText style={[gs.fts_15, gs.c_fff]}>{toDecimal2(TodayAmount)}</BCText>
                        <BCText style={[gs.fts_14, gs.c_fff]}>日销售额</BCText>
                    </BCTouchable>
                    <BCTouchable onPress={() => {
                        this.push('SellerStatisticsChart')
                    }} style={[Styles.btnStyle, {marginLeft: px2dp(42)}]}>
                        <BCText style={[gs.fts_15, gs.c_fff]}>{toDecimal2(WeekAmount)}</BCText>
                        <BCText style={[gs.fts_14, gs.c_fff]}>本周销售额</BCText>
                    </BCTouchable>
                </View>
            </View>
        )

    }

    content() {
        return (
            <View style={[Styles.mian, gs.bgc_f2f1ef]}>
                {this.renderTop() }
               {/* <View style={Styles.ListStyle}>
                    <BCTouchable style={[Styles.ItemStyle, gs.bgc_fff]}>
                        <View style={{marginLeft: px2dp(14), alignItems: 'center'}}>
                            <BCText style={[gs.fts_15, gs.c_3a3838]}>即时销售量</BCText>
                        </View>
                        <View style={{marginRight: px2dp(12.5), width: px2dp(14), height: px2dp(14)}}>
                            <BCImage source={require('../../../imgs/right1.png')}/>
                        </View>
                    </BCTouchable>
                </View>*/}
                <View style={[Styles.myOrder, gs.bdc_e3e3e3, gs.bgc_fff]}>
                    <BCTouchable style={[Styles.orderTitle, gs.bdc_e3e3e3]}
                                 onPress={() => {this.push("SellerList")}}
                    >
                        <BCText style={[gs.fts_15, gs.c_3a3838, {marginLeft: px2dp(12)}]}>我的订单</BCText>
                        <View style={{flexDirection: 'row', marginRight: px2dp(13)}}>
                            <BCText style={[gs.fts_12, gs.c_b7b7b7]}>查看全部订单</BCText>
                            <BCImage style={{width: px2dp(12), height: px2dp(12)}}
                                     source={require('../../../imgs/right1.png')}></BCImage>
                        </View>
                    </BCTouchable>
                    <View style={Styles.orderList}>
                        <BCTouchable onPress={() => {
                            this.push("SellerList", {initialPage: 0})
                        }} style={{alignItems: 'center'}}>
                            <View>
                                <BCImage source={require('../../../imgs/Tobepaid.png')}></BCImage>
                            </View>
                            <View style={{marginTop: px2dp(8.5)}}>
                                <BCText style={[gs.c_3a3838, gs.fts_12]}>待接单</BCText>
                            </View>
                        </BCTouchable>
                        <BCTouchable onPress={() => {
                            this.push("SellerList", {initialPage: 1})
                        }} style={{alignItems: 'center'}}>
                            <View>
                                <BCImage source={require('../../../imgs/Waitinglist.png')}></BCImage>
                            </View>
                            <View style={{marginTop: px2dp(8.5)}}>
                                <BCText style={[gs.c_3a3838, gs.fts_12]}>待发货</BCText>
                            </View>
                        </BCTouchable>
                        <BCTouchable onPress={() => {
                            this.push("SellerList", {initialPage: 2})
                        }} style={{alignItems: 'center'}}>
                            <View>
                                <BCImage source={require('../../../imgs/Waitingfordelivery.png')}></BCImage>
                            </View>
                            <View style={{marginTop: px2dp(8.5)}}>
                                <BCText style={[gs.c_3a3838, gs.fts_12]}>待验货</BCText>
                            </View>
                        </BCTouchable>
                        <BCTouchable onPress={() => {
                            this.push("SellerList", {initialPage: 3})
                        }} style={{alignItems: 'center'}}>
                            <View>
                                <BCImage source={require('../../../imgs/Waitingforinspection.png')}></BCImage>
                            </View>
                            <View style={{marginTop: px2dp(8.5)}}>
                                <BCText style={[gs.c_3a3838, gs.fts_12]}>已完成</BCText>
                            </View>
                        </BCTouchable>
                        <BCTouchable onPress={()=>{
                            this.push('ServiceManagement')
                        }} style={{alignItems: 'center'}}>
                            <View>
                                <BCImage source={require('../../../imgs/Aftersalemanagements.png')}></BCImage>
                            </View>
                            <View style={{marginTop: px2dp(8.5)}}>
                                <BCText style={[gs.c_3a3838, gs.fts_12]}>售后管理</BCText>
                            </View>
                        </BCTouchable>
                    </View>
                </View>
            </View>
        )
    }

    //下拉刷新
    onRefresh() {
        const {dispatch} = this.props;
        dispatch(ActionSellerPurchaseAmount());
    }

    WillMount() {
        const {dispatch} = this.props;
        dispatch(ActionSellerPurchaseAmount());
    }

    WillReceive(nextProps) {
        if (nextProps.ReduceSellerPurchaseAmount.datas != null && nextProps.ReduceSellerPurchaseAmount.datas != this.props.ReduceSellerPurchaseAmount.datas) {
            this.setState({
                IsReceived: true
            });
        }
    }

}

const Styles = StyleSheet.create({
    mian: {
        flex: 1,
        height: deviceHeight
    },
    headerStyle: {
        width: deviceWidth,
        height: px2dp(245.5),
        backgroundColor: '#5096F2',
    },
    top: {
        flexDirection: 'row',
        height: Platform.OS === 'ios' ? px2dp(64) : px2dp(44),
        paddingTop: Platform.OS === 'ios' ? px2dp(28) : px2dp(8),
        paddingBottom: px2dp(8),
        paddingLeft: px2dp(10),
        paddingRight: px2dp(10),
        backgroundColor: '#FF9256',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    salesvolume: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: px2dp(30)
    },
    textBold: {
        marginTop: px2dp(15),
        marginLeft: px2dp(20),
        fontSize: px2dp(50)
    },
    moneyList: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingTop: px2dp(28)
    },
    ListStyle: {
        height: px2dp(53),
    },
    ItemStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: px2dp(53),
        alignItems: 'center'
    },
    btnStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        width: px2dp(125),
        height: px2dp(55),
        borderRadius: px2dp(4),
        borderWidth: 1,
        borderColor: '#fff'
    },
    myOrder: {
        height: px2dp(116.5),
        borderBottomWidth: 1,
        marginTop: px2dp(10)
    },
    orderTitle: {
        height: px2dp(39),
        borderBottomWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    orderList: {
        height: px2dp(77),
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },


})

function mapStateToProps(store) {
    return {
        ReduceSellerPurchaseAmount: store.ReduceSellerPurchaseAmount,
    }
}
const connectOrderManagement = connect(mapStateToProps)(OrderManagement);
connectOrderManagement.navigationOptions = NavigationOptions;
export default connectOrderManagement;
