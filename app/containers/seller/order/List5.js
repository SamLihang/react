/**
 * Created by Administrator on 2017/4/10. 卖家订单列表待验货
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View,
    StyleSheet,
    Image,
    Platform,
    TouchableOpacity,
    TextInput,
    ScrollView,
    InteractionManager,
    ListView,
    AsyncStorage
} from 'react-native';


import BaseComponent, {
    deviceWidth,
    px2dp,
    BCText,
    BCImage,
    BCTouchable,
    substr,
    deviceHeight,
    NavigationOptions,
    BCHostImage
} from '../../../BaseComponent';
import {PullListComponent} from '../../PageComponent'
import gs from '../../../styles/MainStyles';
import styles from './Styles';
import {ActionSellerSalesOrder5} from '../../../actions/SellerSalesOrderAction';
import CheckBox from '../../../components/CheckBox';
import {formaTime, toDecimal2} from '../../../utils/FormatUtil'


class List5 extends PullListComponent {
    constructor(props) {
        super(props);// 初始状态
        this.state = {
            dataSource: [],
        }
    }

    static propTypes = {
        OnCancel: React.PropTypes.func,
        ToPay: React.PropTypes.func
    };

    renderNavigator() {
        return null;
    }

    _RenderListItem = [];
    _CheckBoxAll = null;
    _CheckBoxList = [];


    renderRow(data) {
        let list = data.item;
        let key = data.index;
        let salesOrderId = list.SalesOrderId;
        let sCompanyId = list.SCompanyId;
        let isSelect = list.IsSelect;
        var self = this;
        return (
            <View style={[styles.dl, gs.bgc_fff]} >
                <BCTouchable style={[styles.company3]} onPress={() => {
                    this.push('SellerDetail3', {salesOrderId})
                }}>
                    {
                        list.CompanyLogo !== null ?
                            <BCHostImage style={styles.companyImg}
                                         source={{uri: list.CompanyLogo}}/> :
                            <BCImage style={styles.companyImg}
                                     source={require('../../../imgs/LOGO.png')}/>
                    }

                    <View style={{justifyContent: "space-around"}}>
                        <BCText
                            style={[gs.fts_16, gs.c_3a3838, {paddingLeft: px2dp(11)}]}>{substr(list.CompanyName, 11)}</BCText>
                        <BCText
                            style={[gs.fts_16, gs.c_fd0319, {paddingLeft: px2dp(11)}]}>￥{toDecimal2(list.Amount + list.DeliveryAmount)}</BCText>
                    </View>
                    <View style={{position: 'absolute', top: 4, right: px2dp(0)}}>
                        <BCText
                            style={[gs.fts_12, gs.c_b7b7b7, {paddingLeft: px2dp(7)}]}>{formaTime(list.CreateTime, "MM-dd hh:mm")}</BCText>
                    </View>
                </BCTouchable>
            </View>
        )
    }

    keyExtractor(item, index) {
        return item.SalesOrderId
    }

    onRefersh(item) {
        const {dispatch} = this.props;
        this._page = 1;
        dispatch(ActionSellerSalesOrder5({p: this._page, t: 5}));
    }

    onEndReached() {
        const {dispatch} = this.props;
        this._page++;
        dispatch(ActionSellerSalesOrder5({p: this._page, t: 5}));
    }


    WillMount() {
        const {dispatch} = this.props;
        dispatch(ActionSellerSalesOrder5({p: this._page, t: 5}));
    }

    WillReceive(nextProps) {
        if (nextProps.ReduceSellerSalesOrder5.datas != null && nextProps.ReduceSellerSalesOrder5.datas != this.props.ReduceSellerSalesOrder5.datas) {
            const {ReduceSellerSalesOrder5} = nextProps;
            const sellerSalesOrders5 = ReduceSellerSalesOrder5.datas;
            let dataSource = this.state.dataSource;
            if (sellerSalesOrders5.length <= 0) {
                if (this._page === 1) {
                    dataSource = sellerSalesOrders5;
                }
                this.noMoreData('暂时没有您的订单记录喔～');
            } else {
                if (this._page > 1 || dataSource.length <= 0) {
                    sellerSalesOrders5.map((sellerSalesOrder) => {
                        dataSource.push(sellerSalesOrder)
                    })
                } else {
                    dataSource = sellerSalesOrders5;
                }
            }
            this.setState({
                IsReceived: true,
                dataSource: dataSource,
                FlatListHeight: deviceHeight - (Platform.OS === 'ios' ? px2dp(125) : px2dp(45) )
            });
        }
        if (nextProps.ReduceDeliverySalesOrder.datas != null && nextProps.ReduceDeliverySalesOrder.datas != this.props.ReduceDeliverySalesOrder.datas) {
            const {ReduceDeliverySalesOrder} = nextProps;
            const {dispatch} = this.props;
            this._Loading.Trigger(false);
            this._page = 1;
            const sers3 = ReduceDeliverySalesOrder.datas;
            dispatch(ActionSellerSalesOrder5({p: this._page, t: 5}));
        }
    }
}


function mapStateToProps(store) {
    return {
        ReduceSellerSalesOrder5: store.ReduceSellerSalesOrder5,
        ReduceDeliverySalesOrder: store.ReduceDeliverySalesOrder
    }

}
const connectSellerSalesOrder5 = connect(mapStateToProps)(List5);
connectSellerSalesOrder5.navigationOptions = NavigationOptions;
export default connectSellerSalesOrder5;