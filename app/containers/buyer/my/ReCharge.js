/**
 * Created by Administrator on 2017/5/3.
 */
import React, {Component} from 'react';
import {StyleSheet, View, TextInput, ListView, Platform} from 'react-native';
import {BCImage, BCTouchable, BCText, px2dp, deviceWidth, substr, NavigationOptions,deviceHeight} from '../../../BaseComponent';
import {PullViewComponent} from '../../PageComponent';
import {connect} from "react-redux";
import {ActionRecharge,ActionMyAmount} from '../../../actions/MyAction'
import gs from '../../../styles/MainStyles'
import {toastShort} from '../../../utils/ToastUtil';
import {toDecimal2} from '../../../utils/FormatUtil';

class ReCharge extends PullViewComponent {
    //设置页面标题
    setTitle() {
        return "账户充值"
    }
    constructor(props) {
        super(props);
        this.state = {
            IsReceived: true,
            amount:'',
        }
    }

    Onconfirm(){
        const {dispatch} = this.props;
        let amount=this.state.amount.trim();
        if(amount==''){
            toastShort("充值金额必须大于0");
            return false;
        }
        if(!/^[0-9]+([.]{1}[0-9]+){0,1}$/.test(amount)){
            toastShort("充值金额只能是数字或者小数");
            return false;
        }
        dispatch(ActionRecharge({payType:3,amount:amount}));
        this._Loading.Trigger(false)
    }

    content() {
        const {dispatch} = this.props;
        return (
            <View style={Styles.Main}>
                <View style={Styles.TopStyle}>
                    <BCText style={[gs.fts_14, gs.c_888, {marginTop: px2dp(16)}]}>充值金额</BCText>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <BCText style={[gs.c_3a3838, {fontSize: px2dp(40)}]}>￥</BCText>
                        <TextInput underLineColorAndroid='transpatent'
                                   onChangeText={(text) => this.setState({amount: text})}
                                   value={this.state.amount}
                                   keyboardType='numeric'
                                   underlineColorAndroid='transparent'
                                   style={[gs.bold,{fontSize: px2dp(50), margin: 0, padding: 0, width: px2dp(280)}]}/>
                    </View>
                </View>
                <View style={[gs.bgc_fff, {marginTop: px2dp(10)}]}>
                    <View style={Styles.BottomStyle}>
                        <BCText style={[gs.fts_14, gs.c_888]}>支付方式</BCText>
                    </View>
                    <View style={Styles.LastStyle}>
                        <BCImage style={{width: px2dp(24), height: px2dp(24)}}
                                 source={require('../../../imgs/complete.png')}/>
                        <BCText style={[gs.fts_15, gs.c_3a3838, {marginLeft: px2dp(10.5)}]}>支付宝</BCText>
                    </View>
                </View>
                <BCTouchable style={[Styles.ButtonStyle,gs.bgc_00c164]} onPress={() => {
                        this.Onconfirm()
                }}>
                    <BCText style={[gs.fts_16, gs.c_fff]}>确认充值</BCText>
                </BCTouchable>
            </View>
        )
    }


    WillMount() {
        this.setState({
            IsReceived: true
        })
    }

    WillReceive(nextProps){
        if (nextProps.ReduceRecharge.data != null && nextProps.ReduceRecharge.data != nextProps.ReduceRecharge.data) {
            const {ReduceRecharge} = nextProps;

            this._Loading.Trigger(false);
        }
        if (nextProps.ReduceRecharge.message != null && nextProps.ReduceRecharge.message !== this.props.ReduceRecharge.message) {
            toastShort(nextProps.ReduceRecharge.message);
            this._Loading.Trigger(false);
            if(nextProps.ReduceRecharge.data==1){
                const {dispatch} = this.props;
                dispatch(ActionMyAmount());
                //let cllBack=this.navigation.state.params.callback;
                //callback();
                this.pop();
            }
        }
    }
}



const Styles = StyleSheet.create({
    Main:{
        flex: 1,
        height: deviceHeight
    },
    TopStyle: {
        marginTop: px2dp(10),
        paddingLeft: px2dp(20),
        justifyContent: 'center',
        height: px2dp(108),
        backgroundColor: '#fff'
    },
    BottomStyle: {
        justifyContent: 'center',
        marginLeft: px2dp(20),
        height: px2dp(45),
        borderBottomWidth: 0.5,
        backgroundColor: '#fff',
        borderBottomColor: '#f2f1ef'
    },
    LastStyle: {
        flexDirection: 'row',
        paddingLeft: px2dp(36),
        height: px2dp(45),
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    ButtonStyle: {
        width: px2dp(315),
        height: px2dp(43),
        borderRadius: 2.5,
        marginTop: px2dp(32),
        marginLeft: px2dp(30),
        justifyContent: 'center',
        alignItems: 'center'
    }


});


function mapStateToProps(store) {
    return {
        ReduceRecharge: store.ReduceRecharge,
    }
}
const connectReCharge = connect(mapStateToProps)(ReCharge);
connectReCharge.navigationOptions = NavigationOptions;
export default connectReCharge;
