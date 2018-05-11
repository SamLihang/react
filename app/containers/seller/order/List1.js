/**
 * Created by Administrator on 2017/4/10.
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
import {
    ActionSellerSalesOrder1,
    ActionAcceptSalesOrder,
    UpdateSelectList1,
    ActionSellerSalesOrder3,
    UpdateSalesOrder3,
    UpdatePurchaseOrders3,
} from '../../../actions/SellerSalesOrderAction';
import {openDetail3, ActionPurchaseOrders3,} from '../../../actions/PurchaseOrderAction';
import CheckBox from '../../../components/CheckBox';
import {toastLong, toastShort,confirm} from '../../../utils/ToastUtil';
import {formaTime, toDecimal2} from '../../../utils/FormatUtil'

//#region 时间格式化
Date.prototype.format = function (format) {
    /*
     * eg:format="yyyy-MM-dd hh:mm:ss";
     */
    var o = {
        "M+": this.getMonth() + 1, // month
        "d+": this.getDate(), // day
        "h+": this.getHours(), // hour
        "m+": this.getMinutes(), // minute
        "s+": this.getSeconds(), // second
        "q+": Math.floor((this.getMonth() + 3) / 3), // quarter
        "S": this.getMilliseconds()
        // millisecond
    }
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4
            - RegExp.$1.length));
    }

    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1
                ? o[k]
                : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
};

//#endregion

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

class OrderDl extends Component {
    constructor(props) {
        super(props)
        this.state = {
            IsShow: false,
            List: props.List,
        }
    }

    dataSource = null;
    purchaseOrderId = 0;
    _CheckBoxList = [];

    static propTypes = {
        Confirm: React.PropTypes.func,
        List: React.PropTypes.object,
    };
    static defaultProps = {
        List: {},
        PurchaseOrderId: 0,
        PurchaseOrderLineId: 0,
        BCompanyId: 0,
        ActualQuantity: 0,
    };

    render() {
        let dl = this.props.List;
        let key = dl.index;
        let list = dl.item;
        let salesOrderId = list.SalesOrderId;
        let sCompanyId = list.SCompanyId;
        let isSelect = list.IsSelect;
        return (
            <View style={[styles.dl, gs.bgc_fff]} key={key}>
                <CheckBox
                    ref={(c) => {
                        if (c != null) {
                            let key = salesOrderId;
                            {/*if (!this._CheckBoxList[key]) {
                             this._CheckBoxList[key] = [];
                             }*/
                            }
                            this._CheckBoxList.push(c);
                        }
                    }}

                    SalesOrderId={salesOrderId}
                    SCompanyId={sCompanyId}
                    Checked={require('../../../imgs/Selected.png')}
                    IsSelect={isSelect}
                    OnChange={(isSelect) => {
                        let key = salesOrderId;
                        let boxProducts = this._CheckBoxList;
                        let i = 0;

                        boxProducts.map((Product, index) => {
                            if (Product.state.IsSelect) {
                                i++;
                                if (isSelect) {
                                    if (i + 1 > boxProducts.length) {
                                        //this._CheckBoxAll.OnChange(isSelect);
                                    }
                                }
                                else {
                                    if (i + 1 <= boxProducts.length) {
                                        //this._CheckBoxAll.OnChange(isSelect);
                                    }
                                }
                            }
                        });
                    }}/>
                <BCTouchable style={[styles.company]} onPress={() => {
                    alert(list.CompanyName)
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
                        <BCText style={[gs.fts_16, gs.c_fd0319, {paddingLeft: px2dp(11)}]}>￥{list.Amount}</BCText>
                    </View>
                    <View style={{position: 'absolute', top: 4, right: px2dp(0)}}>
                        <BCText style={[gs.fts_12, gs.c_b7b7b7, {paddingLeft: px2dp(7)}]}>{list.DateTime}</BCText>
                    </View>
                </BCTouchable>
            </View>
        )
    }
}
class List1 extends PullListComponent {
    constructor(props) {
        super(props);// 初始状态
        this.state = {
            dataSource: [],
        };
        this.isSelectAll=false;//是否全选
        this.selectList=[];
    }

    static propTypes = {
        OnCancel: React.PropTypes.func,
        ToPay: React.PropTypes.func,

    };

    renderNavigator() {
        return null;
    }

    _RenderListItem = [];
    _CheckBoxAll = null;
    _CheckBoxList = [];



    renderRow(data) {
        this._CheckBoxList = [];
        let list = data.item;
        let key = data.index;
        let salesOrderId = list.SalesOrderId;
        let sCompanyId = list.SCompanyId;
        let isSelect = list.IsSelect;
        const dataSource = this.state.dataSource;
        {/*<OrderDl List={data} key={key}/>*/
        }
        var self = this;
        return (
            <View style={[styles.dl, gs.bgc_fff]} >
                <CheckBox
                    ref={(c) => {
                        if (c != null) {
                            let key = salesOrderId;
                            {/*if (!this._CheckBoxList[key]) {
                             this._CheckBoxList[key] = [];
                             }*/
                            }
                            this._CheckBoxList.push(c);
                        }
                    }}
                    _product={list}
                    SalesOrderId={salesOrderId}
                    SCompanyId={sCompanyId}
                    Key={salesOrderId}
                    Checked={require('../../../imgs/Selected.png')}
                    IsSelect={isSelect}
                    OnChange={(isSelect) => {
                        let key = salesOrderId;
                        let boxProducts = this._CheckBoxList;
                        let i = 0;
                        boxProducts.map((Product, index) => {
                            if (Product.state.IsSelect) {
                                i++;
                                if (isSelect){
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
                            } else {
                                if (i + 1 <= boxProducts.length) {
                                    this._CheckBoxAll.OnChange(Product.state.IsSelect);
                                    this.isSelectAll=Product.state.IsSelect;
                                }
                                //把取消选中的列表删除到新的数组
                                this.selectList.newArr();
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
                    this.push('SellerDetail1', {salesOrderId, dataSource, key})
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
                    <View style={{position: 'absolute', top: 4, right: px2dp(20)}}>
                        <BCText
                            style={[gs.fts_12, gs.c_b7b7b7, {paddingLeft: px2dp(7)}]}>{formaTime(list.CreateTime, "MM-dd hh:mm")}</BCText>
                    </View>
                </BCTouchable>
            </View>
        )

    }

    Bottom(){
        this._CheckBoxAll=null;
        const {dispatch} = this.props;
        const dataSource=this.state.dataSource;
        return (
            dataSource.length>0?
            <View style={styles.footer}>
                <View style={styles.allSelect}>
                    <CheckBox
                        Checked={require('../../../imgs/Selected.png')}
                        ref={(c) => {
                            if(c!==null){
                                this._CheckBoxAll = c
                            }
                        }}
                        IsSelect={this.isSelectAll}
                        OnChange={(isSelect) => {
                            this.isSelectAll=isSelect;
                            let boxBoxList = this._CheckBoxList;
                            boxBoxList.map((data, index) => {
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
                    this.AcceptSalesOrder();
                }} style={[styles.revice, gs.bgc_BaseColor]}>
                    <BCText style={[gs.fts_17, gs.c_fff,]}>接单</BCText>
                </BCTouchable>
            </View>:null
        )
    }

    AcceptSalesOrder() {
        const {dispatch} = this.props;
        let boxProducts = this._CheckBoxList;
        var salesOrderIds = [];
        let Update = [];
        let lists = this.state.dataSource;
        boxProducts.map((product, index) => {
            lists.map((data, i) => {
                if (product.state.IsSelect && data.SalesOrderId === product.props.SalesOrderId) {
                    salesOrderIds.push(product.props.SalesOrderId);
                    Update.push(product.props._product);
                    //lists.splice(i, 1);
                }
            });
        });

        if (salesOrderIds.length > 0) {
            salesOrderIds = salesOrderIds.newArr();
            //this._Loading.Trigger(true);
            //dispatch(UpdateSalesOrder3(Update));
            confirm("确定要接单吗？", function () {
                dispatch(ActionAcceptSalesOrder(salesOrderIds));
            }, function () {
                return false
            });

        } else {
            toastShort("请选中要接单的商品");
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
        dispatch(ActionSellerSalesOrder1({p: this._page, t: 1}));
    }

    onEndReached() {
        const {dispatch} = this.props;
        this._page++;
        dispatch(ActionSellerSalesOrder1({p: this._page, t: 1}));
        let Data=this.selectList;
        /*if(Data.length>0){
            dispatch(UpdateSelectList1(Data))
        }*/
    }


    WillMount() {
        const {dispatch} = this.props;
        dispatch(ActionSellerSalesOrder1({p: this._page, t: 1}));
    }


    WillReceive(nextProps) {
        const {dispatch} = this.props;
        if (nextProps.ReduceSellerSalesOrder1.datas != null && nextProps.ReduceSellerSalesOrder1.datas != this.props.ReduceSellerSalesOrder1.datas) {
            const {ReduceSellerSalesOrder1} = nextProps;
            const sellerSalesOrders1 = ReduceSellerSalesOrder1.datas;
            let dataSource = this.state.dataSource;
            if (sellerSalesOrders1.length <= 0) {
                this.noMoreData('暂时没有您的订单记录喔～');
            } else {
                if (this._page > 1 || dataSource.length <= 0) {
                    sellerSalesOrders1.map((purchaseOrder) => {
                        dataSource.push(purchaseOrder)
                    });

                } else {
                    dataSource = sellerSalesOrders1
                }
                if(sellerSalesOrders1.length===0){
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
        if (nextProps.ReduceAcceptSalesOrder.datas != null && nextProps.ReduceAcceptSalesOrder.datas !== this.props.ReduceAcceptSalesOrder.datas) {
            this._Loading.Trigger(false);
            const {dispatch} = this.props;
            let lists = this.state.dataSource;
            const salesOrderIds = nextProps.ReduceAcceptSalesOrder.datas;
            if (salesOrderIds) {
                this.state.dataSource.map((data,index)=>{
                    data.IsSelect=false;
                });
                this.isSelectAll=false;//是否全选
                if(lists.length===0){
                    this.isSelectAll=false;//是否全选
                }
                salesOrderIds.map((id,index)=>{
                    lists.map((data, i) => {
                        if (data.SalesOrderId === id) {
                            lists.splice(i, 1);
                        }
                    });
                });
                this.setState({
                    dataSource: lists
                });
                toastShort("你已接单成功");
                this._page = 1;
                dispatch(ActionSellerSalesOrder1({p: this._page, t: 1}));

            } else {
                toastShort("此订单以被取消");
            }

        }
        if (nextProps.ReduceAcceptSalesOrder.error != null && nextProps.ReduceAcceptSalesOrder.error !== this.props.ReduceAcceptSalesOrder.error) {
            this._Loading.Trigger(false);
        }
    }

}


function mapStateToProps(store) {
    return {
        ReduceSellerSalesOrder1: store.ReduceSellerSalesOrder1,
        ReduceAcceptSalesOrder: store.ReduceAcceptSalesOrder,
    }

}
const connectSellerSalesOrder1 = connect(mapStateToProps)(List1);
connectSellerSalesOrder1.navigationOptions = NavigationOptions;
export default connectSellerSalesOrder1;