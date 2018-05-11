/**
 * Created by Administrator on 2017/5/17.
 */
import React from "react";
import {Platform, StyleSheet, View} from "react-native";
import {
    BCImage,
    BCText,
    BCTouchable,
    deviceHeight,
    deviceWidth,
    NavigationOptions,
    px2dp
} from "../../../../BaseComponent";
import {PullViewComponent} from "../../../PageComponent";
import gs from "../../../../styles/MainStyles";
import {connect} from "react-redux";
import {ActionCurrentPurchaseAmount} from "../../../../actions/CurrentPurchaseAmountAction";
import {BCPurchaseAmount} from "../../../../components/BCNavigator";
import {formaTime, toDecimal2} from "../../../../utils/FormatUtil";

class CurrentPurchaseAmount extends PullViewComponent {
    //设置页面标题
    setTitle() {
        return "统计"
    }

    renderNavigator() {
        return (
            <BCPurchaseAmount navigation={this.props.navigation}
                              title={this.setTitle()}
                              OnBack={() => {
                                  const {navigation} = this.props;
                                  if (navigator) {
                                      navigation.goBack();
                                  }
                              }}
            />
        )
    }

    renderTop() {
        let {ReduceCurrentPurchaseAmount} = this.props;
        let datas = ReduceCurrentPurchaseAmount.datas;
        let MonthAmount = datas.MonthAmount;
        let WeekAmount = datas.WeekAmount;
        let TodayAmount = datas.TodayAmount;
        return (
            <View style={Styles.headerStyle}>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    <BCText style={[gs.fts_15, gs.c_fff, {
                        marginTop: px2dp(20),
                        marginLeft: px2dp(20)
                    }]}>当月采购余额(元)</BCText>
                    <BCText
                        style={[gs.c_fff, gs.bold, {
                            marginTop: px2dp(10),
                            marginLeft: px2dp(20),
                            fontSize: px2dp(50)
                        }]}>{toDecimal2(MonthAmount)}</BCText>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'center', paddingTop: px2dp(32)}}>
                    <BCTouchable style={Styles.btnStyle} onPress={() => {
                        this.push('PurchaseStatisticsChart')
                    }}>
                        <BCText style={[gs.fts_15, gs.c_fff]}>{toDecimal2(TodayAmount)}</BCText>
                        <BCText style={[gs.fts_14, gs.c_fff]}>日采购额</BCText>
                    </BCTouchable>
                    <BCTouchable onPress={() => {
                        this.push('PurchaseStatisticsChart')
                    }} style={[Styles.btnStyle, {marginLeft: px2dp(42)}]}>
                        <BCText style={[gs.fts_15, gs.c_fff]}>{toDecimal2(WeekAmount)}</BCText>
                        <BCText style={[gs.fts_14, gs.c_fff]}>本周采购额</BCText>
                    </BCTouchable>
                </View>
            </View>
        )

    }

    content() {

        return (
            <View style={[Styles.mian, gs.bgc_f2f1ef]}>
                {this.renderTop() }
                <View style={Styles.ListStyle}>
                    <BCTouchable style={[Styles.ItemStyle, gs.bgc_fff]} onPress={() => {
                        this.push('ProductPurchaseAmount')
                    }}>
                        <View style={{marginLeft: px2dp(14), alignItems: 'center'}}>
                            <BCText style={[gs.fts_15, gs.c_3a3838, {marginLeft: px2dp(14)}]}>商品采购量</BCText>
                        </View>
                        <View style={{marginRight: px2dp(12.5), width: px2dp(14), height: px2dp(14)}}>
                            <BCImage source={require('../../../../imgs/right1.png')}/>
                        </View>
                    </BCTouchable>
                </View>
            </View>
        )

    }

    WillMount() {
        const {dispatch} = this.props;
        dispatch(ActionCurrentPurchaseAmount());
    }

    WillReceive(nextProps) {
        if (nextProps.ReduceCurrentPurchaseAmount.datas != null && nextProps.ReduceCurrentPurchaseAmount.datas != this.props.ReduceCurrentPurchaseAmount.datas) {
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

})

function mapStateToProps(store) {
    return {
        ReduceCurrentPurchaseAmount: store.ReduceCurrentPurchaseAmount,
    }
}
const connectCurrentPurchaseAmount = connect(mapStateToProps)(CurrentPurchaseAmount);
connectCurrentPurchaseAmount.navigationOptions = NavigationOptions;
export default connectCurrentPurchaseAmount;