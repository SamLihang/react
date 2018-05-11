/**
 * Created by Administrator on 2017/4/24. 账款管理
 */
import React from "react";
import {StyleSheet, View,Platform} from "react-native";
import {BCImage, BCText, BCTouchable, deviceHeight, deviceWidth, px2dp,substr,NavigationOptions,BCHostImage} from "../../../BaseComponent";
import {PullViewComponent} from "../../PageComponent";
import gs from "../../../styles/MainStyles";
import {ActionGetSalesOrderSettle} from "../../../actions/ShopDetailAction";
import {connect} from 'react-redux';
import {toDecimal2} from "../../../utils/FormatUtil";

class AccountManagement extends PullViewComponent {
    //去除头部栏
    renderNavigator() {
        return null;
    }

    renderName(name) {
        return (
            <BCText style={[gs.fts_16, gs.c_3a3838]}>{substr(name, 16)}</BCText>
        )
    }

    Top() {
        return (
            <View style={[Styles.headerStyle,gs.bgc_f2f1ef]}>
                <View style={[Styles.backgroundStyle, gs.bgc_00c164]}></View>
                <BCTouchable onPress={()=>{this.push('SellerMyAmount')}} style={[Styles.topStyle, gs.bgc_00c164]}>
                    <BCImage source={require('../../../imgs/balance.png')}/>
                    <BCText style={[gs.fts_13, gs.c_fff]}>我的余额</BCText>
                </BCTouchable>
                <View style={{paddingTop:px2dp(20),paddingLeft:px2dp(15)}}>
                    <BCText style={[gs.fts_14,gs.c_888]}>账期管理</BCText>
                </View>
            </View>
        )
    }

    renderItem(){
        let {ReduceGetSalesOrderSettle}=this.props;
        if(ReduceGetSalesOrderSettle.datas.length<=0){
            return this.noRecord('暂无数据')
        }
        else {
            let datas=ReduceGetSalesOrderSettle.datas;
            return(
                datas.map((item,index)=>{
                    let img=item.Image;
                    let name=item.CompanyName;
                    let cycleStr=item.CycleStr;
                    let stateStr=item.StateStr;
                    let amount=item.Amount;
                    let unPaidAmount=item.UnPaidAmount;
                    let BCompanyId=item.BCompanyId;
                    return(
                        <View key={index} style={[Styles.accountStyle, gs.bgc_fff]}>
                            <View style={[Styles.rowStyle]}>
                                <View style={Styles.companyStyle}>
                                    <BCHostImage style={{width: px2dp(39), height: px2dp(39), borderRadius:Platform.OS=='ios'?px2dp(19):px2dp(50)}}
                                             source={(img != null)?{uri: img}:require('../../../imgs/Headportrait.png')}
                                    />
                                    <View style={Styles.contentStyle}>
                                        {/*公司名称*/}
                                        {this.renderName(name)}
                                        <BCText
                                            style={[gs.fts_12, gs.c_888, {marginTop: px2dp(5)}]}>记账周期 {cycleStr}</BCText>
                                    </View>
                                </View>
                                <View style={[Styles.btnStyle,(stateStr=='已完成')?gs.bgc_ccc:((stateStr=='已到期')?{backgroundColor:'#fd0319'}:{backgroundColor:'#ff9130'})]}>
                                    <BCText style={[gs.c_fff, gs.fts_11]}>{stateStr}</BCText>
                                </View>
                            </View>
                            <View style={[Styles.moneyStyle, gs.bdc_e8e8e8]}>
                                <View style={{alignItems: 'center', justifyContent: 'center', marginLeft: px2dp(88)}}>
                                    <BCText style={[gs.fts_13, gs.c_888]}>总金额</BCText>
                                    <BCText style={[gs.fts_15, gs.c_3a3838]}>{toDecimal2(amount)}</BCText>
                                </View>
                                <View style={{width: px2dp(0.5), height: px2dp(30), backgroundColor: '#e8e8e8'}}></View>
                                <View style={{alignItems: 'center', justifyContent: 'center', marginRight: px2dp(88)}}>
                                    <BCText style={[gs.fts_13, gs.c_888]}>未支付</BCText>
                                    <BCText style={[gs.fts_15, gs.c_3a3838]}>{toDecimal2(unPaidAmount)}</BCText>
                                </View>
                            </View>
                            <BCTouchable onPress={()=>{this.push('AccountList',{name,BCompanyId})}} style={Styles.moreStyle}>
                                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                    <BCText style={[gs.fts_15, gs.c_00C164]}>查看更多</BCText>
                                </View>
                            </BCTouchable>
                        </View>
                    )
                })
            )
        }
    }

    content() {
        return (
            <View style={[Styles.main, gs.bgc_f2f1ef]}>
                {this.renderItem()}
            </View>
        )
    }

    onRefresh() {
        const {dispatch} = this.props;
        dispatch(ActionGetSalesOrderSettle());
    }

    WillMount() {
        const {dispatch} = this.props;
        dispatch(ActionGetSalesOrderSettle());
    }

    WillReceive(nextProps) {
        if (nextProps.ReduceGetSalesOrderSettle.datas != null && nextProps.ReduceGetSalesOrderSettle.datas != this.props.ReduceGetSalesOrderSettle.datas) {
            this.setState({
                IsReceived: true,
            });
        }

    }
}

var Styles = StyleSheet.create({
    headerStyle: {
        height: px2dp(114),
    },
    backgroundStyle: {
        height: px2dp(65),
    },
    main: {
        flex: 1,
        // height: deviceHeight,
    },
    topStyle: {
        width: px2dp(72),
        height: px2dp(72),
        borderRadius: px2dp(50),
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        zIndex: 2,
        left: (deviceWidth - px2dp(72)) / 2,
        top: px2dp(26)
    },
    accountStyle: {
        marginTop: px2dp(10)
    },
    rowStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: px2dp(13),
        alignItems: 'center'
    },
    companyStyle: {
        flexDirection: 'row',
        marginLeft: px2dp(12)
    },
    contentStyle: {
        marginLeft: px2dp(10.5)
    },
    btnStyle: {
        paddingLeft:px2dp(7),
        paddingRight:px2dp(7),
        height: px2dp(20),
        borderRadius: px2dp(5),
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: px2dp(12),
    },
    moneyStyle: {
        flexDirection: 'row',
        marginTop: px2dp(21.5),
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingBottom: px2dp(23.5),
        borderBottomWidth: 1
    },
    moreStyle: {
        height: px2dp(43),
        justifyContent: 'center'
    }
})

function mapStateToProps(store) {
    return {
        ReduceGetSalesOrderSettle: store.ReduceGetSalesOrderSettle
    }
}
const connectAccountManagement = connect(mapStateToProps)(AccountManagement);
connectAccountManagement.navigationOptions = NavigationOptions;
export default connectAccountManagement;


