/**
 * Created by Administrator on 2017/4/12.
 */
import React, {Component} from "react";
import {StyleSheet, TextInput, View, Platform} from "react-native";
import {
    BCImage,
    BCHostImage,
    BCText,
    BCTouchable,
    deviceHeight,
    deviceWidth,
    NavigationOptions,
    px2dp
} from "../../../BaseComponent";
import {PullViewComponent} from "../../PageComponent";
import gs from "../../../styles/MainStyles";
import PasswordInput from "../../../components/PasswordInput";
import {connect} from "react-redux";
import {
    ActionDetailsInspectionPurchaseOrder,
    ActionPurchaseOrderDetail,
    ActionPurchaseOrders7
} from "../../../actions/PurchaseOrderAction";
import {ActionDeleteShoppingCarts, ActionInsertOrUpdateShoppingCart} from "../../../actions/ShoppingCartAction";
import {Calculate} from "../../../components/Calculate";
import {fetchCheckSignPassword} from "../../../services/PurchaseOrderServices";
import DetailCalculate from '../../../components/DetailCalculate'
import YanHuoDetailCalculate from '../../../components/YanHuoDetailCalculate';
import {toastLong, toastShort} from "../../../utils/ToastUtil";
import {toDecimal2, accMul, accAdd} from '../../../utils/FormatUtil';

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

/*//乘法函数
function accMul(arg1, arg2) {
    var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
    try {
        m += s1.split(".")[1].length;
    }
    catch (e) {
    }
    try {
        m += s2.split(".")[1].length;
    }
    catch (e) {
    }
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
}
//给Number类型增加一个mul方法，使用时直接用 .mul 即可完成计算
Number.prototype.mul = function (arg) {
    return accMul(arg, this);
};*/

function changeTwoDecimal(x) {
    var f_x = parseFloat(x);
    if (isNaN(f_x)) {
        alert('function:changeTwoDecimal->parameter error');
        return false;
    }
    var f_x = Math.round(x * 100) / 100;
    var s_x = f_x.toString();
    var pos_decimal = s_x.indexOf('.');
    if (pos_decimal < 0) {
        pos_decimal = s_x.length;
        s_x += '.';
    }
    while (s_x.length <= pos_decimal + 2) {
        s_x += '0';
    }
    return s_x;
}

//支付的遮罩层
class ToPayMaks extends Component {
    constructor(props) {
        super(props)
        this.state = {
            IsShow: false
        }
    }

    static propTypes = {
        Cancle: React.PropTypes.func,
        ToForgetCheck: React.PropTypes.func,
    };

    Trigger(v) {
        this.setState({
            IsShow: v
        })
    }

    //6位输完
    endText(password) {
        this.props._changeText(password);
    }

    render() {
        return (
            this.state.IsShow ?
                <View style={{
                    zIndex: 99,
                    position: 'absolute',
                    bottom: 0,
                    width: deviceWidth,
                    backgroundColor: '#fff',
                    height: Platform.OS == 'ios' ? 400 : 180
                }}>
                    <View style={[gs.bdc_e3e3e3, {
                        flexDirection: 'row',
                        height: px2dp(49),
                        borderBottomWidth: px2dp(0.5),
                        alignItems: 'center'
                    }]}>
                        <BCTouchable onPress={() => this.props.Cancle()}>
                            <BCImage style={{marginLeft: px2dp(12)}}
                                     source={require("../../../imgs/close.png")}></BCImage>
                        </BCTouchable>
                        <BCText
                            style={[gs.fts_17, {color: 'black', marginLeft: px2dp(100)}]}>请输入验货密码</BCText>
                    </View>
                    <View style={{flexDirection: 'row', marginTop: px2dp(30), marginLeft: px2dp(15)}}>
                        <PasswordInput maxLength={6}
                                       onEnd={(text) => {
                                           this.endText(text);
                                       }}
                        />
                    </View>

                    <BCTouchable style={{marginTop: px2dp(12), marginLeft: px2dp(282)}}
                                 onPress={() => {
                                     this.props.ToForgetCheck();
                                 }}
                    >

                        <BCText style={[gs.fts_15, {color: '#148DE4'}]}>忘记密码？</BCText>
                    </BCTouchable>
                    {/*<View style={{alignItems: 'center', justifyContent: 'center', marginTop: px2dp(25)}}>
                     <BCText style={[gs.fts_14, gs.c_888]}>*未设置支付密码是，默认为登录密码</BCText>
                     </View>*/}
                </View> : null
        )
    }
}

//输入框组件
class ItemView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            IsShow: false,
            Text: "",
            _Remark: props._Remark,
            remark: [],
            newQuantity:-1,
            inputTextWidth:px2dp(70),

        }
    }

    CheckButton = null;
    _Products = {};

    static propTypes = {
        Text: React.PropTypes.string,
        PurchaseOrderId: React.PropTypes.number,
        PurchaseOrderLineId: React.PropTypes.number,
        _Remark: React.PropTypes.func,
        BCompanyId: React.PropTypes.number,
        ActualQuantity: React.PropTypes.number,
        RealQuantity: React.PropTypes.number,
        product: React.PropTypes.object,
        Price: React.PropTypes.number,
        DisplayUnitTypeId: React.PropTypes.number,
        UnitAmount: React.PropTypes.number,
    };
    static defaultProps = {
        Text: '',
        PurchaseOrderId: 0,
        PurchaseOrderLineId: 0,
        BCompanyId: 0,
        ActualQuantity: 0,
        product: {},
        Price: 0,
    };


    //点击显示输入框按钮
    OnShow() {
        this.setState({
            IsShow: !this.state.IsShow
        })
    }

    onTitle(title) {
        this.props._Remark(title);
    }

    _onPressCalculate(type, quantity, PurchaseOrderId, PurchaseOrderLineId, list,) {
        this.props.OnPressCalculate(type, quantity, PurchaseOrderId, PurchaseOrderLineId, this._Products, list,)
    }

    renderProblem() {
        const {dispatch} = this.props;
        //var remark=[];
        let item = this.props.product;


        if(this.state.newQuantity<0)
        { this.state.newQuantity=item.Quantity ;
        }

        return (
            <View >
                {/*<View><BCImage style={Styles.productImg} source={{uri: item.Image}}/></View>*/}

                <View style={Styles.listTitle}>
                    {
                        item.Image!=null?
                            <BCHostImage style={Styles.productImg}
                                         source={{uri: item.Image}}/>
                            :
                            <BCImage style={Styles.productImg}
                                     source={require('../../../imgs/LOGO.png')} />
                    }

                    <BCText style={[gs.fts_16, gs.c_3a3838, Styles.listText]}>{item.ProductName}</BCText>
                    <BCText style={[gs.fts_15, gs.c_fd0319, {marginTop: px2dp(13)}]}>¥{toDecimal2(item.Price)}/{item.Unit}</BCText>

                    <BCText style={[gs.fts_12, gs.c_3a3838, {marginTop:px2dp(13),marginLeft: px2dp(13),position:'absolute',top:px2dp(28),left:px2dp(90)}]}>单位: {item.Spec}</BCText>
                    <BCText style={[gs.fts_12, gs.c_3a3838, {marginLeft: px2dp(13),position:'absolute',left:px2dp(90),bottom:0}]}>下单数量: {item.Quantity}{item.DisplayUnit}</BCText>
                    <View style={[Styles.orderStyle,{marginTop:px2dp(13),justifyContent:'flex-end',position:'absolute', bottom:0,right:0}]}>


                        {/*加加减减*/}
                        <YanHuoDetailCalculate key={item.productId}
                                               ref={(c) => {
                                                   if (c != null) {
                                                       this._Products[item.PurchaseOrderLineId] = c;
                                                   }
                                               }}
                                               ProductGlobalId={item.PurchaseOrderId}
                                               PurchaseOrderLineId={item.PurchaseOrderLineId}
                                               Quantity={item.RealQuantity}
                                               Price={item.Price}
                                               UnitAmount={item.UnitAmount}
                                               DisplayUnitTypeId={item.DisplayUnitTypeId}
                                               OnChange={(type, quantity, shoppingCartId) => {
                                                   this._onPressCalculate(type, quantity, item.PurchaseOrderId, item.PurchaseOrderLineId, item)


                                                   /*this.setState({
                                                                  newQuantity:quantity,
                                                    });*/
                                               }}
                        />
                        <BCText style={[gs.fts_16, gs.c_3a3838,{marginRight:px2dp(5)}]}>{item.Unit}</BCText>
                    </View>
                </View>
                {/*<BCText style={[gs.fts_14, gs.c_888, {marginLeft: px2dp(13)}]}>单位: {item.Spec}</BCText>*/}

            </View>
        )
    }




    //显示输入框
    renderShowInput() {
        return (
            this.state.IsShow ? (
                <View style={{paddingBottom: px2dp(14)}}>
                    <TextInput style={[Styles.inputStyle, gs.bgc_f2f1ef]} multiline={true} placeholder="请在此输入您要反馈的问题"
                               placeholderTextColor='#b7b7b7'
                               underlineColorAndroid='transparent'
                               onChangeText={(text) => {
                                   this.state.Text = text;
                               }}
                    />
                </View>
            ) : (null)
        )
    }

    render() {
        return (
            <View>
                {this.renderProblem()}
            </View>
        )
    }
}

//输入框组件
class ShowProblem extends Component {
    constructor(props) {
        super(props)
        this.state = {
            IsShow: false,
            Text: "",
            _Remark: props._Remark,
            remark: [],
            Quantity: props.Quantity,
        }
    }

    CheckButton = null;
    _Products = {};

    static propTypes = {
        Text: React.PropTypes.string,
        PurchaseOrderId: React.PropTypes.number,
        PurchaseOrderLineId: React.PropTypes.number,
        _Remark: React.PropTypes.func,
        BCompanyId: React.PropTypes.number,
        ActualQuantity: React.PropTypes.number,
        RealQuantity: React.PropTypes.number,
        product: React.PropTypes.object,
        Price: React.PropTypes.number,
        DisplayUnitTypeId: React.PropTypes.number,
        UnitAmount: React.PropTypes.number,
    };
    static defaultProps = {
        Text: '',
        PurchaseOrderId: 0,
        PurchaseOrderLineId: 0,
        BCompanyId: 0,
        ActualQuantity: 0,
        RealQuantity:0,
        product: {},
        Price: 0,
    };


    //点击显示输入框按钮
    OnShow() {
        this.setState({
            IsShow: !this.state.IsShow
        })
    }

    onTitle(title) {
        this.props._Remark(title);
    }

    _onPressCalculate(type, quantity, PurchaseOrderId, PurchaseOrderLineId, list,) {
        this.props.OnPressCalculate(type, quantity, PurchaseOrderId, PurchaseOrderLineId, this._Products, list,)
    }

    renderProblem() {
        const {dispatch} = this.props;
        //var remark=[];
        let item = this.props.product;
        return (

            <View style={Styles.listItem}>
                <View style={Styles.problemStyle}>
                    <BCText style={[gs.fts_14, {marginTop: px2dp(5),marginLeft: px2dp(13), color: 'black'}]}>问题说明</BCText>
                    <View style={Styles.problemList}>
                        {
                            ["数量不足", "不够新鲜", "食材质量差", "其他", ""].map((title, index) => {
                                return (
                                    <CheckButton
                                        ref={(c) => {
                                            this.CheckButton = c
                                        }}
                                        OnChange={(isSelect) => {
                                            let CheckButtons = this.CheckButton;
                                            CheckButtons.OnChange(isSelect);
                                            if (title === "其他") {
                                                this.OnShow()
                                            }
                                            if (isSelect) {
                                                if (title === "其他") {
                                                } else {
                                                    this.state.remark.push(title);
                                                }

                                            }
                                        }}
                                        Title={title}
                                        key={index}/>
                                )
                            })
                        }
                    </View>
                    {this.renderShowInput()}
                </View>
            </View>
        )
    }

    //显示输入框
    renderShowInput() {
        return (
            this.state.IsShow ? (
                <View style={{paddingBottom: px2dp(14)}}>
                    {/*<TextInput style={[Styles.inputStyle, gs.bgc_f2f1ef]} multiline={true} placeholder="请在此输入您要反馈的问题"*/}
                    <TextInput style={[Styles.inputStyle, gs.bgc_fff]} multiline={true} placeholder="请在此输入您要反馈的问题"
                               placeholderTextColor='#b7b7b7'
                               underlineColorAndroid='transparent'
                               onChangeText={(text) => {
                                   this.state.Text = text;
                               }}
                    />
                </View>
            ) : (null)
        )
    }

    render() {
        return (
            <View>
                {this.renderProblem()}
            </View>
        )
    }
}

//选择按钮组件
class CheckButton extends Component {
    constructor(props) {
        super(props)
        this.state = {
            IsSelect: props.IsSelect,
            OnShow: props.OnShow,
        }
    }

    static propTypes = {
        IsSelect: React.PropTypes.bool,
        OnChange: React.PropTypes.func,
        Title: React.PropTypes.string,
        OnShow: React.PropTypes.func,
    };
    static defaultProps = {
        IsSelect: false,
    };

    OnChange(isSelect) {
        this.setState({IsSelect: isSelect})
    }

    OnShow() {
        this.props.OnShow()
    };

    _onPress() {
        this.setState({IsSelect: !this.state.IsSelect}, () => {
            this.props.OnChange(this.state.IsSelect);
        })
    }

    render() {
        let backgroundColor1 = {backgroundColor: gs.bgc_f2f1ef};
        let backgroundColor2 = {backgroundColor: 'rgb(0,193,100)'};
        let Color1 = {color: "#888"};
        let Color2 = {color: "#fff"};
        return (
            <BCTouchable
                style={[Styles.btnStyle, this.state.IsSelect ? backgroundColor2 : backgroundColor1, {marginLeft: px2dp(9)}]}
                // style={[Styles.btnStyle, this.state.IsSelect ? {border:'px2dp(1) #f2f1ef solid'}:{border:'px2dp(1) rgb(0,193,100) solid'}]}
                onPress={() => {
                    this._onPress()
                }}>
                <BCText style={[gs.fts_14, this.state.IsSelect ? Color2 : Color1]}>{this.props.Title}</BCText>
            </BCTouchable>
        )
    }
}

//价格
class TextChange extends Component {
    static defaultProps = {
        edit: false,
    };

    constructor(props) {
        super(props);
        this.state = {
            Text: props.text,
            edit: props.edit
        };
    }

    static propTypes = {
        Text: React.PropTypes.number,
        edit: React.PropTypes.bool
    };

    OnChange(text) {
        this.setState({Text: text})
    }

    render() {
        return (
            <BCText {...this.props}>￥{toDecimal2(this.state.Text)}元</BCText>
        )
    }
}

class CheckDetail extends PullViewComponent {
    //设置页面标题
    setTitle() {
        return "详细验货"
    }

    static propTypes = {
        _ToSign: React.PropTypes.func,
    };
    _ToPayMaks = null;
    _ShowProblem = {};
    _ItemView = {};
    _TextChange = null;

    constructor(props) {
        super(props);
        this.state = {
            showInput: false,

        }
    }

    _Products = {};

    renderProduct(Items) {
        const {dispatch} = this.props;
        let items = Items;
        return (
            items.map((item, index) => {
                return (
                    <View key={index} style={Styles.listItem}>
                        <ItemView
                            ref={(c) => {
                                if (c != null) {
                                    let Id = item.PurchaseOrderId;
                                    if (!this._ShowProblem[Id]) {
                                        this._ShowProblem[Id] = [];
                                    }
                                    this._ShowProblem[Id].push(c);
                                }

                            }}
                            ActualQuantity={item.ActualQuantity}
                            BCompanyId={item.CompanyId}
                            Price={item.Price}
                            PurchaseOrderId={item.PurchaseOrderId}
                            DisplayUnitTypeId={item.DisplayUnitTypeId}
                            UnitAmount={item.UnitAmount}
                            PurchaseOrderLineId={item.PurchaseOrderLineId}
                            product={item}
                            OnPressCalculate={(type, quantity, PurchaseOrderId, PurchaseOrderLineId, _Products, list) => {
                                let Amount = 0;
                                let key = list.PurchaseOrderId;
                                const {ReducePurchaseOrderDetail} = this.props;
                                let DeliveryAmount = ReducePurchaseOrderDetail.datas.DeliveryAmount;
                                let BoxShowProblems = this._ShowProblem[key];
                                BoxShowProblems.map((item, index) => {
                                    let Product = item._Products[item.props.PurchaseOrderLineId];
                                    if (Product.props.DisplayUnitTypeId === 2) {
                                        Amount += ((Product.props.Price) * toDecimal2(Product.state.quantity) );

                                    } else {
                                        Amount += ((Product.props.Price) * toDecimal2(Product.state.quantity))
                                    }
                                });
                                if (Amount < 0) {
                                    Amount = 0;
                                }
                                this._TextChange.OnChange((Amount + DeliveryAmount))
                            }}

                        />
                        {/*问题说明部分*/}
                        <ShowProblem
                            ref={(c) => {
                                if (c != null) {
                                    let Id = item.PurchaseOrderId;
                                    if (!this._ItemView[Id]) {
                                        this._ItemView[Id] = [];
                                    }
                                    this._ItemView[Id].push(c);
                                }

                            }}
                            ActualQuantity={item.ActualQuantity}
                            BCompanyId={item.CompanyId}
                            key={index}
                            Price={item.Price}
                            PurchaseOrderId={item.PurchaseOrderId}
                            DisplayUnitTypeId={item.DisplayUnitTypeId}
                            UnitAmount={item.UnitAmount}
                            PurchaseOrderLineId={item.PurchaseOrderLineId}
                            product={item}
                        />
                    </View>
                )
            })
        )
    }

    content() {
        const reducePurchaseOrderDetail = this.props.ReducePurchaseOrderDetail;
        if (reducePurchaseOrderDetail.datas) {
            let datas = reducePurchaseOrderDetail.datas;
            let Items = datas.PurchaseOrderLines;
            return (
                <View style={[gs.bgc_fff, {minHeight: deviceHeight + 1,}]}>
                    <View style={[Styles.companyName, gs.bgc_fff, gs.bdc_e3e3e3]}>
                        {
                            datas.LogoImage?
                                <BCHostImage style={{height: px2dp(29), width: px2dp(29), marginLeft: px2dp(12)}}
                                             source={{uri: datas.LogoImage}}/>
                                :
                                <BCImage style={{height: px2dp(29), width: px2dp(29), marginLeft: px2dp(12)}}
                                         source={require('../../../imgs/LOGO.png')}></BCImage>
                        }


                        <BCText style={[gs.fts_16, gs.c_888, {marginLeft: px2dp(7)}]}>{datas.BCompanyFullName}</BCText>
                    </View>
                    {this.renderProduct(Items)}
                    <View style={{height: px2dp(106)}}></View>
                </View>
            )
        } else {
        }
    }

    Bottom() {
        const {ReducePurchaseOrderDetail} = this.props;
        var Amount = 0;
        let Items = [];
        if (ReducePurchaseOrderDetail.datas) {
            let lists = ReducePurchaseOrderDetail.datas.PurchaseOrderLines;
            let DeliveryAmount = ReducePurchaseOrderDetail.datas.DeliveryAmount;
            lists.map((list, i) => {
                let key = list.PurchaseOrderId;
                Amount += list.Amount;
            });
            return (
                this.renderBottom(toDecimal2(Amount), DeliveryAmount)
            )
        }
    }

    renderBottom(Amount, DeliveryAmount) {
        return (
            <View style={Styles.footerWrap}>
                <View style={Styles.footer}>
                    <View style={[Styles.money]}>
                        <View style={{flexDirection: 'row', marginLeft: px2dp(13)}}>
                            <BCText style={[gs.c_fff, gs.fts_16]} onPress={() => this.onCloseMask()}>总额:
                                ￥{toDecimal2(parseFloat(Amount)+ DeliveryAmount)}元</BCText>
                            <BCText
                                style={[gs.c_b7b7b7, gs.fts_12, {paddingTop: px2dp(5)}]}>（含配送费{DeliveryAmount}元)</BCText>
                        </View>
                        <View style={{flexDirection: 'row', marginLeft: px2dp(13)}}>
                            <BCText style={[gs.c_fff, gs.fts_16]}>实际总额:
                                <TextChange
                                    ref={(c) => {
                                        this._TextChange = c
                                    }}
                                    style={[gs.c_fff, gs.fts_16]}
                                    text={parseFloat(Amount) + DeliveryAmount}
                                />
                            </BCText>
                            <BCText
                                style={[gs.c_b7b7b7, gs.fts_12, {paddingTop: px2dp(5)}]}>（含配送费{DeliveryAmount}元)</BCText>
                        </View>
                    </View>
                    <BCTouchable style={[{backgroundColor:'#31ca96'}, Styles.pay]} onPress={() => {
                        this.ToPay()
                    }}>
                        <BCText style={[gs.c_fff, gs.fts_17]}>去签收</BCText>
                    </BCTouchable>
                </View>
            </View>
        )
    }

    ToSign() {
        const {dispatch} = this.props;
        const {PurchaseOrderId} = this.params;
        let Amount = 0;
        const reducePurchaseOrderDetail = this.props.ReducePurchaseOrderDetail;
        let datas = reducePurchaseOrderDetail.datas;
        let data = datas.PurchaseOrderLines;
        let products = this._Products;
        let SignData = {
            PurchaseOrderId: PurchaseOrderId,
            SalesOrderId: datas.SalesOrderId,
            ActualAmount: datas.ActualAmount,
            BCompanyId: datas.BCompanyId,
            PurchaseOrderLines: {Items: []}
        };
        data.map((item, index) => {
            let key = item.PurchaseOrderId;
            let PurchaseOrderLineId = item.PurchaseOrderLineId;
            let BoxShowProblems = this._ShowProblem[key];
            let Problem = this._ItemView[key];
            BoxShowProblems.map((list, i) => {
                let Product = list._Products[list.props.PurchaseOrderLineId];
                Problem.map((da, c) => {
                    let text = da.state.Text.trim();
                    let Remark = "";
                    if (text === "") {
                        Remark = da.state.remark.newArr().toString();
                    } else {
                        Remark = da.state.remark.newArr().toString() + "," + text;
                    }
                    if (SignData.PurchaseOrderLines.Items.length <= data.length) {
                        if (da.props.PurchaseOrderLineId === list.props.PurchaseOrderLineId) {
                            SignData.PurchaseOrderLines.Items.push(
                                {
                                    ActualQuantity: Product.state.quantity,
                                    BCompanyId: list.props.BCompanyId,
                                    PurchaseOrderId: list.props.PurchaseOrderId,
                                    PurchaseOrderLineId: list.props.PurchaseOrderLineId,
                                    Price: list.props.Price,
                                    DisplayUnitTypeId: list.props.DisplayUnitTypeId,
                                    UnitAmount: list.props.UnitAmount,
                                    Remark: Remark.trim(),
                                }
                            );
                        }
                    }

                });
                /* let Product = list._Products[list.props.PurchaseOrderLineId];
                 let text = list.state.Text.trim();
                 let Remark = list.state.remark.newArr().toString() + "," + text;
                 if (list.props.PurchaseOrderId === PurchaseOrderId) {
                     if (SignData.PurchaseOrderLines.Items.length <= data.length) {
                         SignData.PurchaseOrderLines.Items.push(
                             {
                                 ActualQuantity: Product.state.quantity,
                                 BCompanyId: list.props.BCompanyId,
                                 PurchaseOrderId: list.props.PurchaseOrderId,
                                 PurchaseOrderLineId: list.props.PurchaseOrderLineId,
                                 Price: list.props.Price,
                                 DisplayUnitTypeId: list.props.DisplayUnitTypeId,
                                 UnitAmount: list.props.UnitAmount,
                                 Remark: Remark.trim(),
                             }
                         );
                     }
                 }*/
            });
        });
        if (SignData.PurchaseOrderLines.Items.length !== 1) {
            SignData.PurchaseOrderLines.Items.pop();
        }


        SignData.PurchaseOrderLines.Items.map((item, index) => {
            if (item.DisplayUnitTypeId === 2) {
                Amount += ((item.Price) * (item.ActualQuantity)  )
            } else {
                Amount += ((item.Price) * (item.ActualQuantity) )
            }
        });

        if (Amount != datas.ActualAmount) {
            SignData.ActualAmount = (toDecimal2(Amount) * 1);
        } else {
            SignData.ActualAmount = (datas.ActualAmount);

        }
        //console.log(SignData);

        var newList = [];
        SignData.PurchaseOrderLines.Items.forEach(function (line) {
            for (var i = 0; i < newList.length; i++) {
                if (newList[i].BCompanyId === line.BCompanyId) {
                    //newList[i].PurchaseOrderLines.push(line);
                    newList[i].num++;
                    return;
                }
            }
            newList.push({
                BCompanyId: line.BCompanyId,
                num: 1,
                PurchaseOrderId: line.PurchaseOrderId,
                PurchaseOrderLineId: line.PurchaseOrderLineId,
                Remark: line.Remark,
                ActualQuantity: line.ActualQuantity
            });
        });
        //SignData.PurchaseOrderLines.Items = newList;
        var purchaseOrderStr = JSON.stringify(SignData);
        this._Loading.Trigger(true);
        dispatch(ActionDetailsInspectionPurchaseOrder(purchaseOrderStr));
    }

    ToPay() {
        this._Maks.Trigger(true);
        this._ToPayMaks.Trigger(true);
    }

    //弹窗
    maksContent() {
        return (
            <View>
                <ToPayMaks ref={(ref) => this._ToPayMaks = ref}
                           Cancle={() => {
                               this._ToPayMaks.Trigger(false);
                               this._Maks.Trigger(false);
                           }}
                           ToForgetCheck={() => {
                               this.navigation.navigate('ReviseCheckPassword')
                           }}
                           _changeText={(password) => {
                               const {dispatch,} = this.props;
                               //验证支付密码是否正确
                               fetchCheckSignPassword({password}).then((ret) => {
                                   if (ret.data === null) {
                                       //支付密码正确后调用

                                       this.ToSign();
                                       //this._Loading.Trigger(true);
                                       //自动关闭支付弹窗
                                       this._ToPayMaks.Trigger(false);
                                       this._Maks.Trigger(false);
                                   }
                                   else if (ret.error) {
                                       if (ret.error.message == "请先设置验货密码") {
                                           this.push('ReviseCheckPassword');
                                           this._ToPayMaks.Trigger(false);
                                           this._Maks.Trigger(false);
                                           this._Loading.Trigger(false);
                                       } else {
                                           //toastShort("验货失败,请重新输入验货密码");
                                           this._Loading.Trigger(false);

                                       }
                                   }

                               }).catch((e) => {
                                   //toastShort("验货失败,请重新输入验货密码");
                                   this._Loading.Trigger(false);
                               });

                           }}
                />
            </View>
        )
    }

    WillMount() {
        const {dispatch} = this.props;
        const {PurchaseOrderId} = this.params;
        dispatch(ActionPurchaseOrderDetail({purchaseOrderId: PurchaseOrderId}));
    }

    WillReceive(nextProps) {
        const {dispatch} = this.props;
        if (nextProps.ReducePurchaseOrderDetail.datas != null && nextProps.ReducePurchaseOrderDetail.datas != this.props.ReducePurchaseOrderDetail.datas) {
            this.setState({
                IsReceived: true
            });
        }

        if (nextProps.ReduceDetailsInspectionPurchaseOrder.datas != null && nextProps.ReduceDetailsInspectionPurchaseOrder.datas != this.props.ReduceDetailsInspectionPurchaseOrder.datas) {
            const params = this.params;
            const {dispatch} = this.props;
            let lists = params.dataSource;
            if (lists.length > 0) {
                const key = params.key;
                lists.splice(key, 1);
                this.setState({
                    dataSource: lists
                });
                this._Loading.Trigger(false);

                const {navigation} = this.props;
                if (params.index === 2) {
                    this.push('BuyerIndex');
                }else if(params.index==='Jpush'){
                    this.push('PurchaseOrderList',{initialPage: 3,pageFrom:"Jpush"})
                    return false;
                }else{
                    if (navigator) {
                        navigation.goBack();
                        // this.push('PurchaseOrderList', {initialPage: 3});
                    }
                }
                toastShort("验货成功");
            }


            //dispatch(ActionPurchaseOrders7({p: 1, t: 7}));

        }
        if (nextProps.ReduceDetailsInspectionPurchaseOrder.error != null && nextProps.ReduceDetailsInspectionPurchaseOrder.error !== this.props.ReduceDetailsInspectionPurchaseOrder.error) {
            this._Loading.Trigger(false);
        }
    }

}

const Styles = StyleSheet.create({
    companyName: {
        height: px2dp(45),
        flexDirection: 'row',
        borderBottomWidth: 1,
        alignItems: 'center'
    },
    productImg:{
        width: px2dp(80),
        height: px2dp(80),
        marginRight: px2dp(8)
    },
    listItem: {
        //height:px2dp(153),
        borderBottomWidth: px2dp(0.5),
        borderBottomColor: gs.bdc_e3e3e3
    },
    listTitle: {
        flexDirection: 'row',
    },
    listText: {
        marginLeft: px2dp(15),
        marginTop: px2dp(13)
    },
    orderStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    btnBox: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        marginRight: px2dp(11)
    },
    btnInput: {
        width: px2dp(32),
        height: px2dp(22),
        padding: 0,
        textAlign: 'center',
        alignItems: 'center',
    },
    problemStyle: {
        marginTop: px2dp(16),
        backgroundColor:'#f7f7f7',
    },
    problemList: {
        flexDirection: 'row',
        marginLeft: px2dp(-4),
        marginTop: px2dp(11),
        paddingBottom: px2dp(14)
    },
    btnStyle: {
        width: px2dp(81),
        height: px2dp(27),
        borderRadius: px2dp(13.5),
        // border:'px2dp(1) #f2f1ef solid',
        justifyContent: 'center',
        alignItems: 'center'
    },
    inputStyle: {
        width: px2dp(345),
        height: px2dp(53),
        marginLeft: px2dp(13),
    },
    footerWrap: {
        width: '100%',
        height: px2dp(66),
        //position: 'absolute',
        //bottom: 0,
        //left: 0,
        justifyContent: 'flex-end',
        zIndex: 1
    },
    footer: {
        width: '100%',
        height: px2dp(46),
        flexDirection: 'row',
        overflow: 'visible',
        justifyContent: 'flex-end',
        backgroundColor: '#202020',
        opacity: 0.9
    },
    pay: {
        width: px2dp(94),
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    money: {
        width: deviceWidth - px2dp(94),
        //paddingRight: px2dp(9),
    },
})

function mapStateToProps(store) {
    //toastLong(JSON.stringify(store))
    return {
        ReducePurchaseOrderDetail: store.ReducePurchaseOrderDetail,
        ReduceInsertOrUpdateShoppingCart: store.ReduceInsertOrUpdateShoppingCart,
        ReduceDetailsInspectionPurchaseOrder: store.ReduceDetailsInspectionPurchaseOrder,
        ReducePurchaseOrders5: store.ReducePurchaseOrders5

    }
}

const connectCheckDetail = connect(mapStateToProps)(CheckDetail);
connectCheckDetail.navigationOptions = NavigationOptions;
export default connectCheckDetail;