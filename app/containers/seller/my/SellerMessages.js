/**
 * Created by Administrator on 2017/4/25.
 */
import React, {Component} from 'react';
import {StyleSheet, View, TextInput, ListView, Image, Text} from 'react-native';
import {BCImage, BCTouchable, BCText, px2dp, deviceWidth, substr, NavigationOptions} from '../../../BaseComponent';
import {PullViewComponent,PullListComponent} from '../../PageComponent';
import gs from '../../../styles/MainStyles';
import {formaTime} from '../../../utils/FormatUtil'


import {ActionTradeLogistics} from '../../../actions/TradeLogisticsAction';
import {connect} from 'react-redux';

class SellerMessages extends PullListComponent {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: []
        };
    }
    //设置页面标题
    setTitle() {
        return "交易物流信息"
    }

    renderRow(data) {
        const {dispatch} = this.props;
        let item = data.item;
        let key = data.index;

        let Time = item.Time;
        let commonTime = formaTime(Time, "yyyy-MM-dd");
        //已发货
        let Title = item.Title;
        //订单编号
        let OrderNoType = item.OrderNoType;
        //公司
        let Content = item.Content;
        //账期号
        let Order = item.Order;

        return (
            <View style={[Styles.main]} key={key}>
                <View  style={[gs.bgc_f2f1ef]}>
                    <BCTouchable onPress={() => {
                        if (item.OrderNoType == '订单编号') {
                            let initialPage;
                            switch (Title) {
                                case '已验货':
                                    initialPage = 3;
                                    break;
                                /*case '已改价':
                                    initialPage = 2;
                                    break;
                                case '已接单':
                                    initialPage = 2;
                                    break;*/
                                default:
                                    initialPage = 0;
                                    break;
                            }
                            this.push('SellerList', {initialPage: initialPage})
                        }
                        else if (item.OrderNoType == '账期') {
                            this.push('AccountPay')
                        }
                    }}>
                        <View style={[Styles.time]}>
                            <BCText style={[gs.c_fff, gs.fts_12]}>{commonTime}</BCText>
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            marginTop: px2dp(15),
                            marginLeft: px2dp(12.5)
                        }}>
                            <BCImage source={require('../../../imgs/notice.png')}/>
                            <View style={{flexDirection: 'row'}}>
                                <BCImage source={require('../../../imgs/horn.png')}
                                         style={[Styles.horn]}/>
                                <View style={[Styles.bubble, gs.bgc_fff, {marginLeft: px2dp(14.3)}]}>
                                    <BCText style={[gs.fts_16, gs.c_3a3838]}>
                                        {Title}
                                    </BCText>
                                    <BCText style={[gs.fts_15, gs.c_888, {marginTop: px2dp(5)}]}>
                                        {Content}
                                    </BCText>
                                    <BCText style={[gs.fts_12, gs.c_888, {marginTop: px2dp(5)}]}>
                                        {OrderNoType} {Order}
                                    </BCText>
                                </View>
                            </View>
                        </View>
                    </BCTouchable>
                </View>
            </View>
        )
    }

    keyExtractor(item, index) {
        return index
    }

    onRefersh(item) {
        const {dispatch} = this.props;
        this._page = 1;
        dispatch(ActionTradeLogistics({p: this._page}));
    }

    //加载更多
    onEndReached() {
        const {dispatch} = this.props;
        this._page++;
        dispatch(ActionTradeLogistics({p: this._page}));
    }

    WillMount() {
        const {dispatch} = this.props;
        this._page = 1;
        dispatch(ActionTradeLogistics({p: this._page}));
    }

    //初始化数据
    WillReceive(nextProps) {
        if (nextProps.ReduceTradeLogistics.datas != null && nextProps.ReduceTradeLogistics.datas != this.props.ReduceTradeLogistics.datas) {
            const {ReduceTradeLogistics} = nextProps;

            let datas = ReduceTradeLogistics.datas;
            let dataSource = this.state.dataSource;
            if (datas.length <= 0) {
                this.noMoreData('暂时还没有物流信息喔～');
            } else{
                if (this._page > 1) {
                    datas.map((list) => {
                        dataSource.push(list);
                    });
                } else {
                    dataSource = datas;
                }
            }


            this.setState({
                IsReceived: true,
                dataSource: dataSource,
                //FlatListHeight: deviceHeight - (Platform.OS === 'ios' ? px2dp(65) : px2dp(45)) - px2dp(35)
            });
        }
    }


}

const Styles = StyleSheet.create({
    main: {
        flex: 1,
    },
    time: {
        borderRadius: px2dp(12),
        width: px2dp(140),
        height: px2dp(24),
        backgroundColor: gs.bgc_f2f1ef,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: (deviceWidth - px2dp(140)) / 2,
        marginTop: px2dp(15)
    },
    horn: {
        marginTop: px2dp(16),
        width: px2dp(16),
        height: px2dp(28),
        position: 'absolute',
        zIndex: 2,
    },
    bubble: {
        width: px2dp(283),
        padding: px2dp(13.5, 16),
        borderWidth: px2dp(1.5),
        borderRadius: px2dp(4),
        borderColor: '#d7d7d7'
    },
    logoStyle: {
        marginTop: px2dp(116),
        alignItems: 'center',
        justifyContent: 'center'
    },
    textStyle: {
        marginTop: px2dp(16.5)
    }
});

function mapStateToProps(store) {
    return {
        ReduceTradeLogistics: store.ReduceTradeLogistics
    }
}
const connectTradeLogistics = connect(mapStateToProps)(SellerMessages);
connectTradeLogistics.navigationOptions = NavigationOptions;
export default connectTradeLogistics;