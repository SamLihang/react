/**
 * Created by Administrator on 2017/5/4.
 */
import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import {
    BCImage,
    BCTouchable,
    BCText,
    px2dp,
    deviceWidth,
    deviceHeight,
    NavigationOptions
} from '../../../BaseComponent';
import {PullViewComponent} from '../../PageComponent';
import gs from '../../../styles/MainStyles'
import {connect} from "react-redux";
import {ActionLoaderWithdrawDetail}  from '../../../actions/WithdrawalDetailAction';

class WithdrawalsDetails extends PullViewComponent {
    GlobalDatas = {};
    constructor(props) {
        super(props);
        this.state = {
            // 银行卡尾号
            data: [],
            dataSource: []
        }
    }

    //设置页面标题
    setTitle() {
        return "提现详情"
    }

    content() {
        let Datas = this.GlobalDatas;
        return (
            <View style={Styles.Main}>
                <View style={Styles.TopStyle}>
                    <BCImage style={{width: px2dp(22), height: px2dp(107.5)}}
                             source={require('../../../imgs/Applicationforwithdrawal.png')}></BCImage>
                    <View style={Styles.TopRight}>
                        <BCText style={[gs.c_00C164, gs.fts_16]}>提现申请已提交，等待银行处理</BCText>
                        <BCText style={[gs.c_b7b7b7, gs.fts_14, {marginTop: px2dp(11)}]}>{Datas.WithdrawBankName}（{Datas.WithdrawAccount}）</BCText>
                        <BCText style={[gs.c_b7b7b7, gs.fts_14]}>{Datas.Amount}元</BCText>
                        <BCText style={[gs.c_3a3838, gs.fts_16, {marginTop: px2dp(17)}]}>预计24小时之内到账</BCText>
                        <BCText style={[gs.c_b7b7b7, gs.fts_14, {marginTop: px2dp(6)}]}>如信息填写有误，资金将原路退回</BCText>
                    </View>
                </View>
                <BCTouchable style={Styles.ButtonStyles} onPress={() => {this.push('')}} >
                    <BCText style={[gs.c_fff]}>完成</BCText>
                </BCTouchable>
            </View>
        )
    }

    WillMount() {
        const {dispatch} = this.props;
        dispatch(ActionLoaderWithdrawDetail(800));
    }

    WillReceive(nextProps) {
        if (nextProps.ReduceLoaderWithdrawalDetail.datas != null && nextProps.ReduceLoaderWithdrawalDetail.datas != this.props.ReduceLoaderWithdrawalDetail.datas) {
            const {ReduceLoaderWithdrawalDetail} = nextProps;
            const Category = ReduceLoaderWithdrawalDetail.datas;
            let dataSource = this.state.dataSource;
            this.GlobalDatas = Category;

            this.setState({
                IsReceived: true,
                dataSource: dataSource
            });
        }
    }

}

const Styles = StyleSheet.create({
    Main: {
        flex: 1,
        height: deviceHeight
    },
    TopStyle: {
        width: deviceWidth,
        height: px2dp(206),
        backgroundColor: '#fff',
        paddingLeft: px2dp(22.5),
        paddingTop: px2dp(31),
        flexDirection: 'row',
    },
    TopRight: {
        marginLeft: px2dp(10.5),
    },
    ButtonStyles: {
        width: px2dp(325),
        height: px2dp(43),
        backgroundColor: '#00C164',
        borderRadius: px2dp(2.5),
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: px2dp(30),
        marginTop: px2dp(27)
    }
})

function mapStateToProps(store) {
    return {
        ReduceLoaderWithdrawalDetail: store.ReduceLoaderWithdrawalDetail
    }
}
const connectProviders = connect(mapStateToProps)(WithdrawalsDetails);
connectProviders.navigationOptions = NavigationOptions;
export default connectProviders;