/**
 * Created by Administrator on 2017/5/6.
 */
import React, {Component} from 'react';
import {StyleSheet, View, TextInput, Platform, ListView} from 'react-native';
import {
    BCImage,
    BCTouchable,
    BCText,
    px2dp,
    deviceWidth,
    substr,
    betweenDate,
    NavigationOptions
} from '../BaseComponent';
import PageComponent from '../containers/PageComponent';
import {connect} from "react-redux";
import gs from '../styles/MainStyles';
import Calendar from 'react-native-range-calendar';

import {ActionBBills} from "../actions/AccountAction";
import {ActionSSBills} from "../actions/MyAction";
import {px2dpH} from "../utils/CommonFuns";

class MonthPicker extends PageComponent {
    Today = new Date();

    currentMonth = (this.Today.getMonth() + 1 < 10 ? '0' + (this.Today.getMonth() + 1) : this.Today.getMonth() + 1);
    currentYear=0;

    constructor(props) {
        super(props);
        this.state = {
            //年份,月份
            years: [2016, 2017,2018],
            month: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
            selectedYear: 2017,
            selectedMonth: this.currentMonth,
        }
    }

    //设置页面标题
    setTitle() {
        return "选择月份"
    }

    onBack() {
        /*if (this.params && this.params.callBack) {
            this.params.callBack(this.state.selectedYear + '年' + this.state.selectedMonth + '月')
        }*/
    }

    renderYear() {
        return (
            <View style={[Styles.yearView, gs.bgc_fff]}>
                {
                    this.state.years.map((year, index) => {
                        return (
                            <BCTouchable key={index}
                                         onPress={() => {
                                             this.onClickYear(year)
                                         }}>
                                <BCText style={[
                                    gs.fts_15,
                                    Styles.yearItem,
                                    {color: (this.state.selectedYear == year) ? '#00C164' : '#333333'}
                                ]}>
                                    {year}年
                                </BCText>
                            </BCTouchable>
                        )
                    })
                }
            </View>
        )
    }

    onClickYear(year) {
        this.setState({
            selectedYear: year,
            selectedMonth: '01'
        }, () => {
            this.refreshBill()
        });
    }

    renderMonth() {
        return (
            <View style={[Styles.monthView, gs.bgc_fff]}>
                {
                    this.state.month.map((month, index) => {
                        return (
                            <BCTouchable key={index}
                                         style={[Styles.monthItem]}
                                         onPress={() => {
                                             this.onClickMonth(month)
                                         }}>
                                <BCText style={[{color: (this.state.selectedMonth == month) ? '#00C164' : '#333333'}]}>
                                    <BCText style={[gs.fts_20]}>{month}</BCText>
                                    <BCText style={[gs.fts_16]}>月</BCText>
                                </BCText>
                            </BCTouchable>
                        )
                    })
                }
            </View>
        )
    }

    onClickMonth(month) {
        this.setState({
            selectedMonth: month
        }, () => {
            this.refreshBill();
            this.pop();
        })
    }

    //更新账单页面
    refreshBill() {
        const {dispatch} = this.props;
        if (this.params && this.params.callBack) {
            this.params.callBack(this.state.selectedYear, this.state.selectedMonth)
        }
        if (this.params.pageFrom == 'buyer') {
            dispatch(ActionBBills({date: this.state.selectedYear + '-' + this.state.selectedMonth}));
        }
        else if (this.params.pageFrom == 'seller') {
            dispatch(ActionBBills({date: this.state.selectedYear + '-' + this.state.selectedMonth}));
        }
    }

    content() {
        return (
            <View style={Styles.main}>
                {this.renderYear()}
                {this.renderMonth()}
            </View>
        );
    }

    selectTime(value) {
        this.pop('PriceTendency', {value})
    }

    WillMount() {
        this.setState({
            IsReceived: true
        })
    }
}

const Styles = StyleSheet.create({
    main: {
        flex: 1,
        alignItems: 'center'
    },
    yearView: {
        width: deviceWidth,
        height: px2dp(44),
        flexDirection: 'row',
        //justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: px2dp(20),
    },
    yearItem: {
        marginRight: px2dp(18)
    },
    monthView: {
        //width: deviceWidth,
        flexDirection: 'row',
        flexWrap: 'wrap',
        //justifyContent: 'space-around',
        alignItems: 'center',
        // marginHorizontal: px2dp(13),
        borderColor: '#E5E5E5',
        borderRightWidth: 1,
        borderBottomWidth: 1
    },
    monthItem: {
        // width: Platform.OS=='ios'?px2dp((deviceWidth-px2dp(50))/3):px2dp((deviceWidth-px2dp(30))/3),
        width:'33%',
        height: px2dpH(115),
        justifyContent: 'center',
        alignItems: 'center',
        borderTopWidth: 1,
        borderColor: '#E5E5E5',
        borderLeftWidth: 1,

    },
});

function mapStateToProps(store) {
    return {
        ReduceBBills: store.ReduceBBills
    }
}

const connectPurchaseOrders1 = connect(mapStateToProps)(MonthPicker);
connectPurchaseOrders1.navigationOptions = NavigationOptions;
export default connectPurchaseOrders1;