/**
 * Created by Administrator on 2017/4/10. 卖家已完成
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
Array.prototype.newArr = function () {
    var res = [];
    var json = {};
    for (var i = 0; i < this.length; i++) {
        if (!json[this[i]]) {
            res.push(this[i]);
            json[this[i]] = 1;
        }
    }
    return res;
}
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
import {
    ActionSellerSalesOrder7,
    UpdateSelectList7,
    ActionConfirmReceive
} from '../../../actions/SellerSalesOrderAction';
import CheckBox from '../../../components/CheckBox';
import {formaTime, toDecimal2} from '../../../utils/FormatUtil'
import {toastLong, toastShort, confirm} from '../../../utils/ToastUtil';
import {fetchConfirmReceive} from "../../../services/SellerOrderServices"
import {print} from '../../buyer/my/PrintSetup';
class List7 extends PullListComponent {
    constructor(props) {
        super(props);// 初始状态
        this.state = {
            dataSource: [],

        };
        this.isSelectAll = false;//是否全选
        this.selectList = [];
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
        const {dispatch} = this.props;
        this._CheckBoxList = [];
        let list = data.item;
        let key = data.index;
        let salesOrderId = list.SalesOrderId;
        let sCompanyId = list.SCompanyId;
        let isSelect = list.IsSelect;
        var self = this;
        return (
            <View style={[styles.dl, gs.bgc_fff]}>
                <CheckBox
                    ref={(c) => {
                        if (c != null) {
                            //let key = salesOrderId;
                            this._CheckBoxList.push(c);
                        }
                    }}
                    _product={list}
                    SalesOrderId={salesOrderId}
                    SCompanyId={sCompanyId}
                    Checked={require('../../../imgs/Selected.png')}
                    IsSelect={isSelect}
                    OnChange={(isSelect) => {
                        const {dispatch} = this.props;
                        //let key = salesOrderId;
                        let boxProducts = this._CheckBoxList;
                        let i = 0;
                        boxProducts.map((Product, index) => {
                            if (Product.state.IsSelect) {
                                i++;
                                if (isSelect) {
                                    if (i + 1 > boxProducts.length) {
                                        this._CheckBoxAll.OnChange(isSelect);
                                        this.isSelectAll = isSelect;
                                    }
                                    //把选中的列表添加到新的数组
                                    this.selectList.push({
                                        SalesOrderId: Product.props.SalesOrderId,
                                    });
                                    this.selectList.newArr();
                                    this.state.dataSource.map((data, index) => {
                                        this.selectList.map((obj, index) => {
                                            if (obj.SalesOrderId === data.SalesOrderId)
                                                data.IsSelect = true;
                                        });
                                    });
                                }
                                else {
                                    if (i + 1 <= boxProducts.length) {
                                        this._CheckBoxAll.OnChange(isSelect);
                                        this.isSelectAll = isSelect;
                                    }
                                }
                            } else {
                                if (i + 1 <= boxProducts.length) {
                                    this._CheckBoxAll.OnChange(Product.state.IsSelect);
                                    this.isSelectAll = Product.state.IsSelect;
                                }
                                //把取消选中的列表删除到新的数组
                                this.selectList.map((list, index) => {
                                    if (list.SalesOrderId === Product.props.SalesOrderId) {
                                        this.selectList.splice(index, 1);
                                        //state中的值也改为false;
                                        this.state.dataSource.map((data, index) => {
                                            if (data.SalesOrderId === list.SalesOrderId) {
                                                data.IsSelect = false;
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }}/>
                <BCTouchable style={[styles.company]} onPress={() => {
                    this.push('SellerDetail4', {salesOrderId})
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
                            style={[gs.fts_16, gs.c_fd0319, {paddingLeft: px2dp(11)}]}>￥{toDecimal2(list.ActualAmount)}</BCText>
                    </View>
                    <View style={{position: 'absolute', top: 4, right: px2dp(20)}}>
                        <View>
                            <BCText
                                style={[gs.fts_12, gs.c_b7b7b7, {paddingLeft: px2dp(7)}]}>
                                {formaTime(list.CreateTime, "MM-dd hh:mm")}</BCText>
                        </View>
                        {
                            list.PayType === 1 && list.SettleTypeId === 2 && list.SettleStatusId < 7 ?
                                <BCTouchable style={[styles.border, {
                                    borderColor: "#b0b1b6",
                                    marginLeft: px2dp(5),
                                    marginTop: px2dp(2)
                                }]}
                                             onPress={() => {
                                                 //关闭按钮的提示窗
                                                 let self = this;
                                                 confirm("确定要收款吗？", function () {

                                                     let salesOrderIds = [];
                                                     salesOrderIds.push(salesOrderId);
                                                     dispatch(ActionConfirmReceive(salesOrderIds));
                                                     //self.pop()
                                                     {/*fetchConfirmReceive(salesOrderIds).then((ret) => {
                                                      if (ret.data) {
                                                      this.onRefersh()
                                                      toastShort("收款成功");
                                                      }
                                                      }).catch((e) => {
                                                      toastShort("收款失败");
                                                      });*/
                                                     }
                                                 }, function () {
                                                     return false
                                                 });
                                                 //this.props.OnCancel(this.state.dataSource, PurchaseOrderId, key);
                                             }}>
                                    <BCText style={[gs.fts_12, {color: "#ff9c12"},]}>确认收款</BCText>
                                </BCTouchable> :
                                null
                        }
                    </View>
                </BCTouchable>
            </View>
        )
    }

    Bottom() {
        this._CheckBoxAll = null;
        const {dispatch} = this.props;
        const dataSource = this.state.dataSource;
        return (
            dataSource.length > 0 ?
                <View style={styles.footer}>
                    <View style={styles.allSelect}>
                        <CheckBox
                            Checked={require('../../../imgs/Selected.png')}
                            ref={(c) => {
                                if (c !== null) {
                                    this._CheckBoxAll = c
                                }
                            }}
                            IsSelect={this.isSelectAll}
                            OnChange={(isSelect) => {
                                this.isSelectAll = isSelect;
                                let boxBoxList = this._CheckBoxList;
                                boxBoxList.map((data, index) => {
                                    data.OnChange(isSelect);
                                });
                                if (isSelect) {
                                    if (this.selectList.length > 0) {
                                        this.selectList.splice(0, this.selectList.length);

                                    }
                                    this.state.dataSource.map((data, index) => {
                                        this.selectList.push({
                                            SalesOrderId: data.SalesOrderId,
                                        });
                                        data.IsSelect = true;
                                    });

                                } else {
                                    this.state.dataSource.map((data, index) => {
                                        data.IsSelect = false;
                                    });
                                    this.selectList.splice(0, this.selectList.length);
                                }
                            }}/>
                        <BCText style={[gs.fts_14, gs.c_3a3838, {marginLeft: px2dp(0)}]}>全选</BCText>
                    </View>
                    <BCTouchable onPress={() => {
                        let printDate = [];
                        let NewPrintDate = [];
                        let boxBoxList = this._CheckBoxList;
                        boxBoxList.map((data, index) => {
                            if (data.state.IsSelect) {
                                printDate.push({
                                        CreateTime: data.props._product.CreateTime,
                                        CompanyName: data.props._product.CompanyName,
                                        Phone:data.props._product.Phone,
                                        Address:data.props._product.Address,
                                        bian:data.props._product.ActualAmount,
                                        Remark: data.props._product.Remark,
                                        ActualAmount:data.props._product.ActualAmount,
                                        OrderNo:data.props._product.SalesOrderNo,
                                        Items: data.props._product.Items,
                                    }
                                )
                            }
                        });
                        if (printDate.length > 0) {
                            this.state.dataSource.map((data, index) => {
                                data.IsSelect = false;
                            });
                            this.setState({
                                dataSource: this.state.dataSource
                            });
                            this.isSelectAll = false;//是否全选
                            if(BluetoothConnection){
                                print(printDate);
                            } else {
                                this.push("PrintSetup", printDate);
                            }
                        } else {
                            toastShort("请选中需要打印的内容")
                        }
                    }} style={[styles.revice, {backgroundColor: "#00c164"}]}>
                        <BCText style={[gs.fts_17, gs.c_fff,]}>打印</BCText>
                    </BCTouchable>
                </View> : null
        )
    }


    keyExtractor(item, index) {
        return item.SalesOrderId
    }

    onRefersh(item) {
        const {dispatch} = this.props;
        this._page = 1;
        this.state.dataSource.map((data, index) => {
            data.IsSelect = false;
        });
        dispatch(ActionSellerSalesOrder7({p: this._page, t: 7}));

    }

    onEndReached() {
        const {dispatch} = this.props;
        this._page++;
        let Data = this.selectList;

        /*if(Data.length>0){
         dispatch(UpdateSelectList7(Data))
         }*/
        dispatch(ActionSellerSalesOrder7({p: this._page, t: 7}));

    }


    WillMount() {
        const {dispatch} = this.props;
        dispatch(ActionSellerSalesOrder7({p: this._page, t: 7}));
    }

    WillReceive(nextProps) {
        if (nextProps.ReduceSellerSalesOrder7.datas != null && nextProps.ReduceSellerSalesOrder7.datas != this.props.ReduceSellerSalesOrder7.datas) {
            const {ReduceSellerSalesOrder7} = nextProps;
            const sellerSalesOrders7 = ReduceSellerSalesOrder7.datas;
            let dataSource = this.state.dataSource;
            if (sellerSalesOrders7.length <= 0 || dataSource === undefined) {
                this.noMoreData('暂时没有您的订单记录喔～');
            } else {
                if (this._page > 1 || dataSource.length <= 0) {
                    sellerSalesOrders7.map((sellerSalesOrder) => {
                        dataSource.push(sellerSalesOrder);
                    });
                } else {
                    dataSource = sellerSalesOrders7;
                }
                if (sellerSalesOrders7.length === 0) {
                    this.isSelectAll = true;
                } else {
                    this.isSelectAll = false;
                }
            }
            //刷新为空
            if (this._page === 1) {
                this.isSelectAll = false;//是否全选
                this.selectList = [];
                this.state.dataSource = dataSource;
                this.state.dataSource.map((data, index) => {
                    data.IsSelect = false;
                });
            }
            this.setState({
                IsReceived: true,
                dataSource: dataSource,
                FlatListHeight: deviceHeight - (Platform.OS === 'ios' ? px2dp(65) : px2dp(45) ) - px2dp(100)
            });
        }
        if (nextProps.ReduceConfirmReceive.datas != null && nextProps.ReduceConfirmReceive.datas !== this.props.ReduceConfirmReceive.datas) {
            toastLong("收款成功");
            const {dispatch} = this.props;
            this._page = 1;
            dispatch(ActionSellerSalesOrder7({p: this._page, t: 7}));
        }
        if (nextProps.ReduceConfirmReceive.error != null && nextProps.ReduceConfirmReceive.error !== this.props.ReduceConfirmReceive.error) {
            //toastLong("收款失败");
            //this._Loading.Trigger(false);
        }
    }
}


function mapStateToProps(store) {
    return {
        ReduceSellerSalesOrder7: store.ReduceSellerSalesOrder7,
        ReduceConfirmReceive: store.ReduceConfirmReceive,
    }

}
const connectSellerSalesOrder7 = connect(mapStateToProps)(List7);
connectSellerSalesOrder7.navigationOptions = NavigationOptions;
export default connectSellerSalesOrder7;