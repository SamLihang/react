/**
 * Created by Administrator on 2017/4/27.
 */
import React, {Component} from 'react';
import {StyleSheet, View, TextInput, Platform, ListView} from 'react-native';
import {
    BCImage,
    BCTouchable,
    BCText,
    px2dp,
    deviceHeight,
    deviceWidth,
    substr,
    NavigationOptions,
    Today,
    betweenDate
} from '../../../BaseComponent';
import PageComponent from '../../PageComponent';
import BCNavigator from  '../../../components/BCNavigator';
import gs from '../../../styles/MainStyles';
import {toastLong} from "../../../utils/ToastUtil";

import Echarts from 'native-echarts';

import {ActionPriceTendency} from '../../../actions/PriceParityAction';
import {connect} from 'react-redux';
import {fetchPriceTendency} from '../../../services/PriceParityServices';

import {formaTime} from '../../../utils/FormatUtil'

class PriceTendency extends PageComponent {

    constructor(props) {
        super(props);
    }

    //设置页面标题
    setTitle() {
        let name = this.params.product.ProductName;
        return name;
    }

    rightType() {
        //return 'pic'
    }

    onClickNavigationRight() {
        //this.onShow()
    }

    onShow() {
        this.setState({showMaks: true});
    }

    onHide() {
        this.setState({showMaks: false});
    }

    maksContent() {
        return (
            this.state.showMaks ? (
                <View style={{
                    zIndex: 2,
                    position: 'absolute',
                    top: px2dp(50),
                    width: deviceWidth,
                    backgroundColor: '#fff',
                    height: px2dp(260)
                }}>
                    {/*<View style={[gs.bdc_e3e3e3,{flexDirection:'row',height:px2dp(49),borderBottomWidth:px2dp(0.5),alignItems:'center'}]}>*/}
                    {/*<BCTouchable onPress={() => this.onHide()}>*/}
                    {/*<BCImage style={{marginLeft:px2dp(12)}} source={require("../../../imgs/close.png")}></BCImage>*/}
                    {/*</BCTouchable>*/}
                    {/*<BCText style={[gs.fts_17,{color:'black',marginLeft:px2dp(100)}]}>请输入支付密码</BCText>*/}
                    {/*</View>*/}
                    {/*<View style={{flexDirection:'row',marginTop:px2dp(30),marginLeft:px2dp(15)}}>*/}
                    {/*<TextInput autoFocus={true} style={[gs.bdc_e3e3e3,{width:px2dp(57),height:px2dp(47),borderWidth:px2dp(0.5),textAlign:'center'}]}/>*/}
                    {/*<TextInput style={[gs.bdc_e3e3e3,{width:px2dp(57),height:px2dp(47),borderWidth:px2dp(0.5),textAlign:'center'}]}/>*/}
                    {/*<TextInput style={[gs.bdc_e3e3e3,{width:px2dp(57),height:px2dp(47),borderWidth:px2dp(0.5),textAlign:'center'}]}/>*/}
                    {/*<TextInput style={[gs.bdc_e3e3e3,{width:px2dp(57),height:px2dp(47),borderWidth:px2dp(0.5),textAlign:'center'}]}/>*/}
                    {/*<TextInput style={[gs.bdc_e3e3e3,{width:px2dp(57),height:px2dp(47),borderWidth:px2dp(0.5),textAlign:'center'}]}/>*/}
                    {/*<TextInput style={[gs.bdc_e3e3e3,{width:px2dp(57),height:px2dp(47),borderWidth:px2dp(0.5),textAlign:'center'}]}/>*/}
                    {/*</View>*/}
                    {/*<BCTouchable style={{marginTop:px2dp(12),marginLeft:px2dp(282)}}>*/}
                    {/*<BCText style={[gs.fts_15,{color:'#148DE4'}]}>忘记密码？</BCText>*/}
                    {/*</BCTouchable>*/}
                    {/*<View style={{alignItems:'center',justifyContent:'center',marginTop:px2dp(25)}}>*/}
                    {/*<BCText style={[gs.fts_14,gs.c_888]}>*未设置支付密码是，默认为登录密码</BCText>*/}
                    {/*</View>*/}
                </View>
            ) : (null)
        )
    }

    Bottom() {
        return (
            <View style={{zIndex: 2}}>
                {/* <BCText onPress={() => this.onShow()}>开启</BCText>
                 <BCText >---------</BCText>
                 <BCText onPress={() => this.onHide()}>关</BCText>*/}
            </View>
        )
    }

    content() {
        const productGlobalId = this.params.product.Id
        const {ReducePriceTendency} = this.props;
        const datas = ReducePriceTendency.datas;
        const markets = datas.Markets;
        var dataLists = {};


        for (let i = 0; i < datas.Datas.length && datas.Datas.length > 0; i++) {
            let data = datas.Datas[i];
            dataLists[data.Key] = data.Value;
        }

        if(datas.Datas.length>0){
            var legendDatas = [];
            let series = [];
            let xAxis = [];
            xAxis = datas.Datas[0].Value.map((ret) => {
                return formaTime(ret.CreateTime, "MM/dd")
            });
            markets.map((market, Index) => {
                legendDatas.push(market.MarketName)
                if (dataLists[market.MarketId] != null) {
                    series.push({
                        name: market.MarketName,
                        type: 'line',
                        data: dataLists[market.MarketId].map((ret) => {
                            return ret.Price
                        }),
                        symbol: 'emptyCircle',   //拐角标记的图形
                        symbolSize: 10,
                    })
                }
            })


            const option = {
                title: {
                    text: '日采购单价走势',
                    subtext: '单位(元)',
                    x: 'center',
                    top: '-20%',
                    show: false
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: legendDatas,
                    left: '5%',
                    right: '5%',
                    textStyle: {
                        fontSize: 12
                    }
                },
                grid: {
                    top: legendDatas.length > 2 ? px2dp(60) : px2dp(30),
                    left: '5%',
                    right: '5%',
                    //containLabel: true
                },
                xAxis: [{
                    type: 'category',
                    data: xAxis,
                    boundaryGap: false,
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
                    }
                }],
                yAxis: [{show: false}],
                animation: false,
                dataZoom: {
                    type: 'inside',
                    start: 80,
                    //end: 100,
                    zoomLock: true
                },
                series: series,
                color: ['rgb(255,166,117)', 'rgb(117,182,255)', 'rgb(83,232,160)', 'rgb(250,108,145)', '#43c6eb', '#40d2bc'],
            }


            return (
                <View style={Styles.main}>
                    <View style={[Styles.storeName, gs.bgc_fff]}>
                        <BCTouchable style={[Styles.calender_btn]} onPress={() => {
                            //this.push('ChooseCalender', {productGlobalId})
                        }}>
                            <BCImage source={require("../../../imgs/calendar.png")}/>
                            <BCText
                                style={[gs.fts_16, gs.c_3a3838, {marginLeft: px2dp(10)}]}>{betweenDate(Today(), -30)}</BCText>
                            <BCText
                                style={[gs.fts_16, gs.c_888, {marginLeft: px2dp(14), marginRight: px2dp(14)}]}>至</BCText>
                            <BCText style={[gs.fts_16, gs.c_3a3838]}>{Today()}</BCText>
                        </BCTouchable>
                    </View>
                    <View style={[Styles.tendencyPic, gs.bgc_fff]}>
                        <BCText style={[gs.fts_15, gs.c_3a3838]}>日采购单价走势</BCText>
                        <BCText style={[gs.fts_12, gs.c_888]}>单位(元)</BCText>
                        <Echarts option={option} height={300}/>
                    </View>
                </View>
            );
        }else{
            // return this.noRecord("暂无市场数据");
            return this.noRecord("");
        }


    }

    WillMount() {
        const {dispatch} = this.props;
        const productGlobalId = this.params.product.Id
        dispatch(ActionPriceTendency({productGlobalId}));
    }

    WillReceive(nextProps) {
        if (nextProps.ReducePriceTendency.datas != null && nextProps.ReducePriceTendency.datas != this.props.ReducePriceTendency.datas) {
            const {ReducePriceTendency} = nextProps;

            this.setState({
                IsReceived: true,
            });
        }
    }
}

const Styles = StyleSheet.create({
    main: {
        flex: 1,
        alignItems: 'center',
        height: deviceHeight + 1,

    },
    title: {
        width: px2dp(342),
        height: px2dp(45),
        marginTop: px2dp(10),
        borderRadius: px2dp(5),
        borderWidth: px2dp(1),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: 20,
        textAlign: 'center',
    },
    titleWord: {
        width: px2dp(115),
        height: px2dp(45),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleView: {
        height: Platform.OS == 'ios' ? 64 : 44,
        paddingTop: Platform.OS == 'ios' ? 14 : 0,
        backgroundColor: '#ff6400',
        justifyContent: 'center',
        alignItems: 'center',
    },

    selectType: {
        position: 'absolute',
        left: 0,
        bottom: px2dp(200),
        width: deviceWidth,
        height: px2dp(183),
        zIndex: 33,
        paddingLeft: px2dp(10),
        paddingRight: px2dp(10)
    },
    menuItem: {
        height: px2dp(57),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
    },
    storeName: {
        height: px2dp(55),
        width: deviceWidth,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    calender_btn: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    tendencyPic: {
        width: deviceWidth,
        height: px2dp(369.5),
        marginTop: px2dp(10),
        justifyContent: 'center',
        alignItems: 'center'
    }
});

function mapStateToProps(store) {
    return {
        ReducePriceTendency: store.ReducePriceTendency,
    }
}
const connectPriceTendency = connect(mapStateToProps)(PriceTendency);
connectPriceTendency.navigationOptions = NavigationOptions;
export default connectPriceTendency;