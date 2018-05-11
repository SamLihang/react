import React, {Component} from 'react';
import {StyleSheet, View, TextInput, ListView} from 'react-native';
import {
    BCImage,
    BCTouchable,
    BCText,
    px2dp,
    deviceWidth,
    substr,
    deviceHeight,
    NavigationOptions
} from '../../../BaseComponent';
import {PullViewComponent} from '../../PageComponent';
import gs from '../../../styles/MainStyles'
import Echarts from 'native-echarts';
import {ActionSellerStatisticsChart} from '../../../actions/CurrentPurchaseAmountAction';
import {connect} from 'react-redux';

class SellerStatisticsChart extends PullViewComponent {
    //设置页面标题
    setTitle() {
        return "销售额"
    }

    content() {
        const {ReduceSellerStatisticsChart} = this.props;
        const datas = ReduceSellerStatisticsChart.datas;
        const days = datas.Days;
        const months = datas.Months;

        const xAxis = [];
        const monthsxAxis = [];
        const series = [];
        const monthsseries = [];
        days.map((item, index) => {
            xAxis.push(item.Time);
            series.push(item.Amount)
        });
        months.map((item, index) => {
            monthsxAxis.push(item.Time);
            monthsseries.push(item.Amount)
        });
        const dayOption = {
            title: {
                text: '日销售单价走势',
                subtext: '单位(元)',
                x: 'center',
                top: '-20%'
            },
            tooltip: {
                trigger: 'axis'
            },
            grid: {
                top: px2dp(30),
                left: '5%',
                right: '5%',
            },
            xAxis: [{
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    show: true,
                    interval: 0,
                    textStyle: {
                        color: '#888888',
                        fontSize: px2dp(12),
                    }
                },
                type: 'category',
                data: xAxis
            }],
            yAxis: [{show: false}],
            animation: false,
            dataZoom: {
                type: 'inside',
                start: 80,
                //end: 100,
                zoomLock: true
            },
            series: [{
                name: '',
                type: 'line',
                data: series,
                symbol: 'emptyCircle',   //拐角标记的图形
                symbolSize: 10,
                label: {
                    normal: {
                        show: true,
                        position: 'top',
                    }
                },
            }],
            color: ['rgb(255,166,117)', 'rgb(117,182,255)', 'rgb(83,232,160)', 'rgb(250,108,145)'],
        }
        const monthsOption = {
            title: {
                text: '日销售单价走势',
                subtext: '单位(元)',
                x: 'center',
                top: '-20%'
            },
            tooltip: {
                trigger: 'axis'
            },
            grid: {
                top: px2dp(30),
                left: '5%',
                right: '5%',
            },
            xAxis: [{
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    show: true,
                    interval: 0,
                    textStyle: {
                        color: '#888888',
                        fontSize: px2dp(12),
                    }
                },
                type: 'category',
                data: monthsxAxis
            }],
            yAxis: [{show: false}],
            animation: false,
            dataZoom: {
                type: 'inside',
                start: 80,
                //end: 100,
                zoomLock: true
            },
            series: [{
                name: '',
                type: 'line',
                data: monthsseries,
                symbol: 'emptyCircle',   //拐角标记的图形
                symbolSize: 10,
                label: {
                    normal: {
                        show: true,
                        position: 'top',
                    }
                },
            }],
            toolbox: {
                //改变icon的布局朝向
                //orient: 'vertical',
                show: false,
                showTitle: true,
                feature: {
                    //show是否显示表格，readOnly是否只读
                    dataView: {show: true, readOnly: false},
                    magicType: {
                        //折线图  柱形图    总数统计 分开平铺
                        type: ['line', 'bar', 'stack', 'tiled'],
                    },

                }
            },
            color: ['rgb(255,166,117)', 'rgb(117,182,255)', 'rgb(83,232,160)', 'rgb(250,108,145)'],
        }
        return (
            <View>
                <View style={[Styles.tendencyPic, gs.bgc_fff]}>
                    <BCText style={[gs.fts_15, gs.c_3a3838]}>日销售单价走势</BCText>
                    <BCText style={[gs.fts_12, gs.c_888]}>单位(元)</BCText>
                    <Echarts option={dayOption} height={300}/>
                </View>
                <View style={[Styles.tendencyPic, gs.bgc_fff]}>
                    <BCText style={[gs.fts_15, gs.c_3a3838]}>月销售单价走势</BCText>
                    <BCText style={[gs.fts_12, gs.c_888]}>单位(元)</BCText>
                    <Echarts option={monthsOption} height={300}/>
                </View>
            </View>

        )
    }

    WillMount() {
        const {dispatch} = this.props;
        dispatch(ActionSellerStatisticsChart());
    }

    WillReceive(nextProps) {
        if (nextProps.ReduceSellerStatisticsChart.datas != null && nextProps.ReduceSellerStatisticsChart.datas != this.props.ReduceSellerStatisticsChart.datas) {
            this.setState({
                IsReceived: true
            });
        }
    }
}

const Styles = StyleSheet.create({
    main: {
        flex: 1,
        height: deviceHeight,
    },
    logoStyle: {
        marginTop: px2dp(116),
        alignItems: 'center',
        justifyContent: 'center'
    },
    textStyle: {
        marginTop: px2dp(16.5)
    },
    tendencyPic: {
        width: deviceWidth,
        height: px2dp(369.5),
        marginTop: px2dp(10),
        justifyContent: 'center',
        alignItems: 'center'
    }
})

function mapStateToProps(store) {
    return {
        ReduceSellerStatisticsChart: store.ReduceSellerStatisticsChart,
    }
}
const connectSellerStatisticsChart = connect(mapStateToProps)(SellerStatisticsChart);
connectSellerStatisticsChart.navigationOptions = NavigationOptions;
export default connectSellerStatisticsChart;