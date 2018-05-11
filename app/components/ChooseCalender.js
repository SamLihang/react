/**
 * Created by Administrator on 2017/5/6.
 */
import React, {Component} from 'react';
import {StyleSheet, View, TextInput, Platform, ListView} from 'react-native';
import {BCImage, BCTouchable, BCText, px2dp, deviceWidth, substr, Today, betweenDate} from '../BaseComponent';
import {PullViewComponent} from '../containers/PageComponent';
import gs from '../styles/MainStyles';
import Calendar from 'react-native-range-calendar';

export default class ChooseCalender extends PullViewComponent {
    Today = Today();

    constructor(props) {
        super(props);
        this.state = {
            //默认选择的值
            selectedDate: [this.Today],
            //日期的显示区间
            showDateRange: ['2016-01-01', this.Today],
            //启用范围
            enableDateRange: [betweenDate(this.Today, -30), this.Today],
        }
    }

    //设置页面标题
    setTitle() {
        return "选择日期"
    }

    rightType() {
        return ''
    }

    content() {
        return (
            <View style={Styles.main}>
                <Calendar
                    showDateRange={this.state.showDateRange}
                    enableDateRange={this.state.enableDateRange}
                    selectedDate={this.state.selectedDate}
                    isRange={false}
                    animate={false}
                    onChange={(value) => this.selectTime(value)}
                    renderDate={(param = {}) => {
                        const {selected, innerSelected, date, text, disable} = param;
                    }}
                />
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
    tendencyPic: {
        width: deviceWidth,
        height: px2dp(369.5),
        marginTop: px2dp(10),
        // textAlign:'center',
        justifyContent: 'center',
        alignItems: 'center'
    }
})