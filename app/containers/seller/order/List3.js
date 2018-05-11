/**
 * Created by Administrator on 2017/4/10. 卖家订单列表待发货
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
//import RenderListItem from './RenderListItem'
import {ActionSellerSalesOrder3,ActionDeliverySalesOrder,ActionSellerSalesOrder5,UpdateSalesOrder5} from '../../../actions/SellerSalesOrderAction';
import CheckBox from '../../../components/CheckBox';
import {toastLong,toastShort,confirm} from '../../../utils/ToastUtil';
import {formaTime,toDecimal2} from '../../../utils/FormatUtil';
import {print} from '../../buyer/my/PrintSetup';
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
};

class List3 extends PullListComponent {
    constructor(props) {
        super(props);// 初始状态
        this.state = {
            dataSource:[],
        };
        this.isSelectAll=false;//是否全选
        this.selectList=[];
    }

    static propTypes = {
        OnCancel: React.PropTypes.func,
        ToPay: React.PropTypes.func
    };

    renderNavigator() {
        return null;
    }

    _RenderListItem = [];
    _CheckBoxAll=null;
    _CheckBoxList=[];

    formaTime(str, format){
        var date = new Date(parseInt(str.replace("/Date(", "").replace(")/", ""), 10));
        return date.format(format);
    }

    renderRow(data) {
        this._CheckBoxList=[];
        let list = data.item;
        let key = data.index;
        let salesOrderId=list.SalesOrderId;
        let sCompanyId=list.SCompanyId;
        let isSelect=list.IsSelect;
        const dataSource = this.state.dataSource;
        var self = this;
        return (
            <View style={[styles.dl, gs.bgc_fff]} >
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
                        //let key=salesOrderId;
                        let boxProducts = this._CheckBoxList;
                        let i = 0;
                        boxProducts.map((Product, index) => {
                            if (Product.state.IsSelect) {
                                i++;
                                if (isSelect) {
                                    if (i + 1 > boxProducts.length) {
                                        this._CheckBoxAll.OnChange(isSelect);
                                        this.isSelectAll=isSelect;
                                    }
                                    //把选中的列表添加到新的数组
                                    this.selectList.push({
                                        SalesOrderId:Product.props.SalesOrderId,
                                    });
                                    this.selectList.newArr();
                                    this.state.dataSource.map((data,index)=>{
                                        this.selectList.map((obj,index)=>{
                                            if(obj.SalesOrderId===data.SalesOrderId)
                                                data.IsSelect=true;
                                        });
                                    });
                                }
                                else {
                                    if (i + 1 <= boxProducts.length) {
                                        this._CheckBoxAll.OnChange(isSelect);
                                        this.isSelectAll=isSelect;
                                    }
                                }
                            }else{
                                if (i + 1 <= boxProducts.length) {
                                    this._CheckBoxAll.OnChange(Product.state.IsSelect);
                                    this.isSelectAll=Product.state.IsSelect;
                                }
                                //把取消选中的列表删除到新的数组
                                this.selectList.map((list,index)=>{
                                    if(list.SalesOrderId===Product.props.SalesOrderId){
                                        this.selectList.splice(index,1);
                                        this.state.dataSource.map((data,index)=>{
                                            if(data.SalesOrderId===list.SalesOrderId){
                                                data.IsSelect=false;
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }}/>
                <BCTouchable style={[styles.company]} onPress={() => {
                    this.push('SellerDetail2', {salesOrderId,dataSource, key})
                }}>
                    {
                        list.CompanyLogo!==null?
                            <BCHostImage style={styles.companyImg}
                                         source={{uri:  list.CompanyLogo}}/>:
                            <BCImage style={styles.companyImg}
                                     source={require('../../../imgs/LOGO.png')}/>
                    }

                    <View style={{justifyContent: "space-around"}}>
                        <BCText
                            style={[gs.fts_16, gs.c_3a3838, {paddingLeft: px2dp(11)}]}>{substr(list.CompanyName, 11)}</BCText>
                        <BCText style={[gs.fts_16, gs.c_fd0319, {paddingLeft: px2dp(11)}]}>￥{toDecimal2(list.Amount+list.DeliveryAmount)}</BCText>
                    </View>
                    <View style={{position: 'absolute', top: 4, right: px2dp(20)}}>
                        <BCText style={[gs.fts_12, gs.c_b7b7b7, {paddingLeft: px2dp(7)}]}>{formaTime(list.CreateTime, "MM-dd hh:mm")}</BCText>
                    </View>
                </BCTouchable>
            </View>
        )
    }
    Bottom() {
        //const {ReducePurchaseOrders7} = this.props;
        const dataSource=this.state.dataSource;
        return (
            dataSource.length>0?
            <View style={styles.footer}>
                <View style={styles.allSelect3}>
                    <CheckBox
                        Checked={require('../../../imgs/Selected.png')}
                        ref={(c) => {
                            if(c!==null){
                                this._CheckBoxAll = c
                            }
                        }}
                        IsSelect={this.isSelectAll}
                        OnChange={(isSelect) => {
                            let boxBoxList = this._CheckBoxList;
                            boxBoxList.map((data,index)=>{
                                data.OnChange(isSelect);
                            });
                            if(isSelect){
                                if( this.selectList.length>0){
                                    this.selectList.splice(0,this.selectList.length);
                                }
                                this.state.dataSource.map((data,index)=>{
                                    this.selectList.push({
                                        SalesOrderId:data.SalesOrderId,
                                    });
                                    data.IsSelect=true;
                                });

                            }else{
                                this.state.dataSource.map((data,index)=>{
                                    data.IsSelect=false;
                                });
                                this.selectList.splice(0,this.selectList.length);
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
                                    bian:data.props._product.ActualAmount,
                                    Remark: data.props._product.Remark,
                                    ActualAmount:data.props._product.ActualAmount,
                                    OrderNo:data.props._product.SalesOrderNo,
                                    Address:data.props._product.Address,
                                Items: data.props._product.Items,
                                }
                            )
                        }
                    });
                    if (printDate.length > 0) {
                        this.state.dataSource.map((data, index) => {
                            data.IsSelect = false;
                        });
                        this.isSelectAll = false;//是否全选
                    //     this.push("PrintSetup", printDate);
                    // } else {
                    //     toastShort("请选中需要打印的内容")
                        if(BluetoothConnection){
                            print(printDate);
                        } else {
                            this.push("PrintSetup", printDate);
                        }
                    } else {
                        toastShort("请选中需要打印的内容")
                    }
                }}
                             style={[styles.revice, {backgroundColor:"#6c768a"}]}>
                    <BCText style={[gs.fts_17, gs.c_fff,]}>打印</BCText>
                </BCTouchable>
                <BCTouchable onPress={() => {
                    this.DeliverySalesOrder()
                }} style={[styles.revice, gs.bgc_00c164]}>
                    <BCText style={[gs.fts_17, gs.c_fff,]}>发货</BCText>
                </BCTouchable>
            </View>:
              null
        )
    }

    DeliverySalesOrder(){
        const {dispatch} = this.props;
        let boxProducts = this._CheckBoxList;
        var salesOrderIds=[];
        var lists =this.state.dataSource;
        let Update=[];
        boxProducts.map((product,index)=>{
            lists.map((data,i)=>{
            if(product.state.IsSelect&&data.SalesOrderId===product.props.SalesOrderId){
                salesOrderIds.push(product.props.SalesOrderId);
                Update.push(product.props._product);
                //lists.splice(i, 1);
            }
            });
        });
        if (salesOrderIds.length > 0) {
            salesOrderIds=salesOrderIds.newArr();
            //this._Loading.Trigger(true);
            //dispatch(UpdateSalesOrder5(Update));
            confirm("确定要发货吗？", function () {
                dispatch(ActionDeliverySalesOrder(salesOrderIds));
            }, function () {
                return false
            });
        } else {
            toastShort("请选中要发货的商品");
        }
    }
    keyExtractor(item, index) {
        return item.SalesOrderId
    }

    onRefersh(item) {
        const {dispatch} = this.props;
        this._page = 1;
        this.state.dataSource.map((data,index)=>{
            data.IsSelect=false;
        });
        dispatch(ActionSellerSalesOrder3({p: this._page,t: 3}));
    }

    onEndReached() {
        const {dispatch} = this.props;
        this._page++;
        dispatch(ActionSellerSalesOrder3({p: this._page,t: 3}));
    }


    WillMount() {
        const {dispatch} = this.props;
        dispatch(ActionSellerSalesOrder3({p: this._page,t: 3}));
    }

    WillReceive(nextProps) {
        if (nextProps.ReduceSellerSalesOrder3.datas != null && nextProps.ReduceSellerSalesOrder3.datas != this.props.ReduceSellerSalesOrder3.datas) {
            const {ReduceSellerSalesOrder3} = nextProps;
            const sellerSalesOrders3 = ReduceSellerSalesOrder3.datas;
            let dataSource = this.state.dataSource;
            if (sellerSalesOrders3.length <= 0) {
                this.noMoreData('暂时没有您的订单记录喔～');
            }else{
                if (this._page > 1 || dataSource.length <= 0) {
                    sellerSalesOrders3.map((sellerSalesOrder) => {
                        dataSource.push(sellerSalesOrder)
                    });

                }else{
                    dataSource = sellerSalesOrders3
                }
                if(sellerSalesOrders3.length===0){
                    this.isSelectAll=true;
                }else{
                    this.isSelectAll=false;
                }
            }
            //刷新为空
            if(this._page===1){
                this.isSelectAll=false;//是否全选
                this.selectList=[];
                this.state.dataSource=dataSource;
            }
            this.setState({
                IsReceived: true,
                dataSource: dataSource,
                FlatListHeight: deviceHeight - (Platform.OS === 'ios' ? px2dp(65) : px2dp(45) ) - px2dp(100)
            });
        }
        if (nextProps.ReduceDeliverySalesOrder.datas != null && nextProps.ReduceDeliverySalesOrder.datas != this.props.ReduceDeliverySalesOrder.datas) {
            const {ReduceDeliverySalesOrder} = nextProps;
            const {dispatch} = this.props;
            this._Loading.Trigger(false);
            const salesOrderIds = ReduceDeliverySalesOrder.datas;
            let dataSource= this.state.dataSource;
            if (salesOrderIds) {
                salesOrderIds.map((id,index)=>{
                    dataSource.map((data, i) => {
                        if (data.SalesOrderId === id) {
                            dataSource.splice(i, 1);
                        }
                    });
                });
            }
            //改变状态
            this.state.dataSource.map((data,index)=>{
                data.IsSelect=false;
            });
            this.isSelectAll=false;//是否全选
            if(dataSource.length===0){
                this.isSelectAll=false;//是否全选
            }
            this.setState({
                dataSource: dataSource,
            });
            this._page=1;
            dispatch(ActionSellerSalesOrder3({p: this._page,t: 3}));
            toastShort("你已发货成功");
        }
        if (nextProps.ReduceAcceptSalesOrder.datas != null && nextProps.ReduceAcceptSalesOrder.datas !== this.props.ReduceAcceptSalesOrder.datas) {
            this._Loading.Trigger(false);
            const {dispatch} = this.props;
            const data=nextProps.ReduceAcceptSalesOrder.datas;
            this._page=1;
            dispatch(ActionSellerSalesOrder3({p: this._page,t: 3}));
        }
    }
}


function mapStateToProps(store) {
    return {
        ReduceSellerSalesOrder3: store.ReduceSellerSalesOrder3,
        ReduceDeliverySalesOrder:store.ReduceDeliverySalesOrder,
        ReduceAcceptSalesOrder:store.ReduceAcceptSalesOrder,
    }

}
const connectSellerSalesOrder3 = connect(mapStateToProps)(List3);
connectSellerSalesOrder3.navigationOptions = NavigationOptions;
export default connectSellerSalesOrder3;