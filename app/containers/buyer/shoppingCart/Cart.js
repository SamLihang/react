import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Platform,
    ScrollView,
    Alert,
    Button,
    InteractionManager
} from 'react-native';
import PageComponent, {PullViewComponent, PullListComponent} from '../../PageComponent'
import {
    px2dp,
    deviceWidth,
    deviceHeight,
    substr,
    BCText,
    BCImage,
    BCTouchable,
    NavigationOptions,
    BCHostImage
} from '../../../BaseComponent';
import gs from '../../../styles/MainStyles';
import CheckBox from '../../../components/CheckBox';
import TextChange from '../../../components/TextChange';
import {Calculate} from '../../../components/Calculate';
import CarCalculate from '../../../components/CarCalculate';
import CarButton from '../../../components/CarButton';
import BCNavigator from '../../../components/BCNavigator';
import {connect} from "react-redux";
import {
    ActionShoppingCarts,
    ActionDeleteShoppingCarts,
    ActionInsertOrUpdateShoppingCart,
    DeleteCar
} from "../../../actions/ShoppingCartAction";
import {ActionLoaderAlwaysBuy} from '../../../actions/AlwaysBuyAction'
import {toastLong, toastShort, confirm} from '../../../utils/ToastUtil'
import {toDecimal2} from '../../../utils/FormatUtil';
import SlideDelete from './SlideDelete';
import {BCShoppingNavigator} from "../../../components/BCNavigator";
import {fetchInsertOrUpdateShoppingCart,fetchDeleteShoppingCarts} from '../../../services/ShoppingCartServices'

class CompanyTips extends Component {
    static defaultProps = {
    };

    constructor(props) {
        super(props);
        this.state = {
            Text: props.Text,

        };
    }

    static propTypes = {
        Text: React.PropTypes.string,
        Callback: React.PropTypes.func
    };

    componentWillReceiveProps(nextProps) {
        this.setState({
            Text: nextProps.Text
        })
    }

    OnChange(text) {
        this.setState({Text: text})
    }

    //改变状态
    onChangeEdit() {
        this.setState({
            edit: !this.state.edit
        });
    }

    render() {
        return (
            <BCText {...this.props}><BCText style={{color: '#fd3546'}}>{this.state.Text}</BCText></BCText>
        )
    }
}

class ShoppingCartFooter extends Component{
    static defaultProps = {
    };

    constructor(props) {
        super(props);
        this.state = {
            TotalAmount: props.number,
            TotalDeliveryAmount: props.number,
        };
    }

    onChangeEdit() {
        this.setState({
            edit: !this.state.edit
        });
    }

    static propTypes = {
        TotalAmount: React.PropTypes.number,
        TotalDeliveryAmount: React.PropTypes.number
    };

    componentWillReceiveProps(nextProps) {
        this.setState({
            TotalAmount: nextProps.TotalAmount,
            TotalAmount: nextProps.TotalDeliveryAmount
        })
    }

    OnTotalAmountChanged(value) {
        this.setState({TotalAmount: value})
        return this;
    }

    OnTotalDeliveryAmountChanged(value) {
        this.setState({TotalDeliveryAmount: value})
        return this;
    }

    render() {
        return (
            <View style={{alignItems:'flex-end',marginRight:px2dp(20)}}>
                <BCText style={[gs.c_333,gs.fts_16]}>合计
                    <TextChange ref={(c) => {
                        this._TextChange = c
                    }} style={[gs.c_fd3547, gs.fts_16]} Text={(this.state.TotalAmount)*1+(this.state.TotalDeliveryAmount)*1+''}/>
                </BCText>
                {this.state.TotalDeliveryAmount*1?<BCText style={[gs.c_666, gs.fts_12,{backgroundColor:'transparent'}]}>(含配送费<BCText>{this.state.TotalDeliveryAmount}</BCText>元)</BCText>:
                    <BCText style={[gs.c_666, gs.fts_12,{backgroundColor:'transparent'}]}>(免配送费)</BCText>
                }

            </View>
        )
    }
}

class Cart extends PullViewComponent {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            run: false,
            CheckBoxProducts:[],
        }
    }

    CheckBoxCompanys = [];
    CheckBoxProducts = {};
    CarCalculates = {};
    CheckBoxAll = null;
    _TextChange = null;
    _carButton = null;
    _Tips = [];
    _Footer=null;
    _SlideDelete = null;
    _SlideBoxProducts = {};

    setTitle() {
        return "购物车";
    }

    //是否显示返回
    isShowBack() {
        //let ProductDetail = this.props.ReduceProductDetail;
        if (this.params && this.params.pageFrom) {
            return true
        } else {
            return false
        }
    }

    rightType() {
        const {ReduceLoadShoppingCarts} = this.props;
        if (this.state.dataSource.length == 0) {
            return true
        } else {
            return "Edit"
        }

    }

    //返回回调
    onBack() {
        const {dispatch} = this.props;
        dispatch(ActionLoaderAlwaysBuy());
        if (this.params.callBack) {
            let callBack = this.params.callBack;
            callBack();
        }
        if(this.params.pageFrom&&this.params.pageFrom=="SearchPage"){
            this.params.onBack();
        }

    }

    //右边点击事件
    /*onClickNavigationRight(Edit) {
     this.changeEdit(Edit);
     this.renderFooter(Edit);
     }*/

    renderNavigator() {
        return (
            <BCShoppingNavigator navigation={this.props.navigation}
                                 title={this.setTitle()}
                                 backCallBack={this.isShowBack()}
                                 renderRight={this.rightType()}
                                 OnClick={(Edit) => {
                                     this.changeEdit(Edit);
                                     this.renderFooter(Edit);
                                 }}
                                 OnBack={() => {
                                     this.onBack();
                                     const {navigation} = this.props;
                                     if (navigator) {
                                         navigation.goBack();
                                     }
                                 }}
            />
        )
    }

    //下拉刷新
    onRefresh(Edit) {
        const {dispatch} = this.props;
        dispatch(ActionShoppingCarts());
    }

    //dl列表
    renderCompanys(company, index) {

        let products = company.Items;
        return (
            <View style={[styles.dl, gs.bgc_fff]} key={index}>
                {this.renderCompany(company,this.onSelectedProductsChanged,this)}
                {
                    <BCTouchable onPress={() => {this.push('ProductList',{sCompanyId:company.CompanyId })}}>
                        <CompanyTips style={{marginLeft:px2dp(44),marginTop:px2dp(3)}}
                                     ref={(c) => {
                                         if (c != null) {
                                             this._Tips.push(c);
                                         }
                                     }} Text=""></CompanyTips>
                    </BCTouchable>
                }
                {
                    products.map((product, i) => {
                        if (product.CompanyId === company.CompanyId) {
                            return this.renderProduct(product, i,company, this.onSelectedProductsChanged,this)
                        }
                    })
                }

            </View>
        )
    }

    onSelectedProductsChanged(caller){
        // console.log("onSelectedProductsChanged",caller)
        let  totalDeliveryMoney = 0;
        let  totalQuantity=0;
        let  totalAmount= 0;
        caller.CheckBoxCompanys.map((checkBoxCompany,index)=>{
            let products = caller.CheckBoxProducts[checkBoxCompany.props.CompanyId + '-' + checkBoxCompany.props.Type];
            let currentQuantity=0;
            let currentAmount=0;
            var currentCompany = caller.state.dataSource[index];
            products.map((product)=>{
                if(product.state.IsSelect) {
                    let key = product.props.ProductId + "-" + product.props.SpecId + "-" + currentCompany.CompanyId + '-' + product.props.ProductType;
                    for (var property in caller.CarCalculates) {
                        if (property == key) {
                            var quantity = caller.CarCalculates[property].state.quantity;
                            currentQuantity += quantity;
                            currentAmount += product.props.Price * quantity * product.props.UnitAmount;
                            break;
                        }
                    }
                }
            });


                if(currentQuantity>0) {
                    totalQuantity += currentQuantity;
                    totalAmount += currentAmount;
                    if(currentCompany.DeliveryAmount*1){
                        if(currentCompany.Type == 0){
                            if( currentAmount < currentCompany.StartPrice){
                                caller._Tips[index].OnChange("还差" + toDecimal2(currentCompany.StartPrice - currentAmount) + "元免配送费，去凑单～");
                                totalDeliveryMoney += currentCompany.DeliveryAmount;
                            }else if(currentQuantity < currentCompany.StartQuantity) {
                                caller._Tips[index].OnChange("还差" + toDecimal2(currentCompany.StartQuantity - currentQuantity) + "件免配送费，去凑单～");
                                totalDeliveryMoney += currentCompany.DeliveryAmount;
                            }else {
                                caller._Tips[index].OnChange("");
                            }
                        }else{
                            if( currentAmount < currentCompany.ReplenishStartPrice){
                                caller._Tips[index].OnChange("还差" + toDecimal2(currentCompany.ReplenishStartPrice - currentAmount) + "元免配送费，去凑单～");
                                totalDeliveryMoney += currentCompany.ReplenishDeliveryAmount;
                            }else if(currentQuantity < currentCompany.ReplenishStartQuantity) {
                                caller._Tips[index].OnChange("还差" + toDecimal2(currentCompany.ReplenishStartQuantity - currentQuantity) + "件免配送费，去凑单～");
                                totalDeliveryMoney += currentCompany.ReplenishDeliveryAmount;
                            }else{
                                caller._Tips[index].OnChange("");
                            }
                        }
                    }
                }else{
                    caller._Tips[index].OnChange("");
                }


        });
        caller._Footer
            .OnTotalAmountChanged(toDecimal2(totalAmount))
            .OnTotalDeliveryAmountChanged(toDecimal2(totalDeliveryMoney));
    }


    //dt (公司名)
    renderCompany(company,onSelectedProductChanged,caller) {
        let loginEmployee = this.props.currentEmployee;
        let bCompanyId = loginEmployee.CompanyId;
        this.CheckBoxCompanys = [];
        this.CheckBoxProducts = {};
        this.CarCalculates = {};
        this.CheckBoxAll = null;
        this._TextChange = null;
        const companyId = company.CompanyId;
        const companyName = company.CompanyName;
        const logoImage = company.LogoImage;
        const isSelect = company.IsSelect;
        var self = this;
        let checkBox = <CheckBox
            ref={(c) => {
                if (c != null) {
                    this.CheckBoxCompanys.push(c);
                }
            }}
            Checked={require('../../../imgs/onSelect.png')}
            CompanyId={companyId}
            Type={company.Type}
            IsSelect={isSelect}
            OnChange={(isSelect) => {

                let key = companyId + "-" + company.Type;
                let boxProducts = this.CheckBoxProducts[key];
                if (boxProducts) {
                    boxProducts.map((boxProduct) => {
                        boxProduct.OnChange(isSelect, this, this.MathTotal);
                    })
                }
                let companyBoxs = this.CheckBoxCompanys;
                let i = 0;
                companyBoxs.map((e, index) => {
                    if (e.state.IsSelect) {
                        i++;
                        if (isSelect) {
                            if (i + 1 > companyBoxs.length) {
                                this.CheckBoxAll.OnChange(isSelect, this, this.MathTotal);
                            }
                        }
                        else {
                            if (i + 1 <= companyBoxs.length) {
                                this.CheckBoxAll.OnChange(isSelect, this, this.MathTotal);
                            }
                        }
                    } else {
                        if (i + 1 <= companyBoxs.length) {
                            this.CheckBoxAll.OnChange(e.state.IsSelect, this, this.MathTotal);
                        }
                    }
                });
                onSelectedProductChanged(caller)
            }}/>
        return (
            <View style={[styles.dt]} key={companyId}>
                {checkBox}
                <BCTouchable style={[{marginRight: px2dp(8)}]}
                     onPress={() => {
                        let sCompanyId = companyId;
                        this.push('CompanyDetial', {bCompanyId, sCompanyId ,from:1})
                     }}
                >
                    <BCHostImage style={[styles.comapnyImg]} source={{uri: logoImage}}/>
                </BCTouchable>
                <BCTouchable style={[styles.companyName]} onPress={() => {
                    let sCompanyId = companyId;
                    this.push('ProductList', {
                        bCompanyId,
                        sCompanyId,
                        // CartToList:true,
                    })
                }}>
                    <BCText style={[gs.fts_16, gs.c_888]}>{substr(companyName, 11)}</BCText>
                    <BCImage style={[{width: px2dp(12), height: px2dp(12), marginLeft: px2dp(6)}]}
                             source={require('../../../imgs/right1.png')}/>
                </BCTouchable>
                {this.renderReplenishIcon(company)}
            </View>
        )
    }

    uuid(){
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";
        var uuid = s.join("");
        return uuid;
    }
    //dd
    renderProduct(product, i,company,onSelectedProductChanged,caller) {
        const {dispatch} = this.props;
        let isSelect = product.IsSelect;
        let companyId = product.CompanyId;
        let productGlobalId = product.ProductGlobalId;
        let SpecId = product.SpecId;
        let price = product.Price;
        let quantity = product.Quantity;
        let shoppingCartId = product.ShoppingCartId;
        let priceChangeReason = product.PriceChangeReason;
        let checkBox = <CheckBox
            Checked={require('../../../imgs/onSelect.png')}
            CompanyId={companyId}
            SpecId={SpecId}
            ProductId={productGlobalId}
            ProductType={product.ProductType}
            Price={price}
            Quantity={quantity}
            ShoppingCartId={shoppingCartId}
            DisplayUnitTypeId={product.DisplayUnitTypeId}
            UnitAmount={product.UnitAmount}
            _product={this.state._product}
            ref={(c) => {
                if (c != null) {
                    let key = companyId + "-" + product.ProductType;
                    if (!this.CheckBoxProducts[key]) {
                        this.CheckBoxProducts[key] = [];
                    }
                    this.CheckBoxProducts[key].push(c);
                }
            }}
            IsSelect={isSelect}
            OnChange={(isSelect) => {
                company.Tips+=company.CompanyName;
                onSelectedProductChanged(caller);
                let key = companyId + "-" + product.ProductType;
                let boxProducts = this.CheckBoxProducts[key];
                if (boxProducts) {
                    var i = 0;
                    boxProducts.map((boxProduct) => {
                        if (boxProduct.state.IsSelect) {
                            i++;
                        }
                    });
                    if (isSelect) {
                        if (i + 1 > boxProducts.length) {
                            var r = this.CheckBoxCompanys.find((n) => {
                                return (n.props.CompanyId === companyId && n.props.Type == product.ProductType);
                            });
                            r.OnChange(isSelect, this, this.MathTotal);
                        }
                    } else {
                        if (i + 1 <= boxProducts.length) {
                            var r = this.CheckBoxCompanys.find((n) => {
                                return (n.props.CompanyId === companyId && n.props.Type == product.ProductType);
                            });
                            r.OnChange(isSelect, this, this.MathTotal);
                        }
                    }
                }
                this.isCheckAll(isSelect, key);
                this.state.CheckBoxProducts=this.CheckBoxProducts
                this.MathTotal(this)    // 点击重
            }}/>;
        return (
            <View  key={this.uuid()}>
                <View style={[styles.dd]}>
                    <BCTouchable style={{flexDirection: 'row',alignItems: 'center'}}
                                 onPress={()=>{
                                     this.push('ProductDetail', {
                                         productGlobalId:productGlobalId,
                                         companyId: companyId,
                                         productType: product.ProductType,
                                         fromIndex:0,    //判断‘店铺’按钮是push（‘ProductList’）还是goBack  0是goBack
                                     })
                                 }}>
                        {checkBox}
                        <BCHostImage style={styles.productImg}
                                     source={{uri: product.Image}}/>
                        <View style={[styles.itemRight, {paddingTop: px2dp(10),width:px2dp(200)}]}>
                            <View style={{justifyContent: "space-around", height: "100%",}}>
                                <BCText style={[gs.fts_15, gs.c_3a3838, gs.bold]}>{substr(product.ProductName, 11)}</BCText>
                                <BCText style={[gs.fts_11, gs.c_666]}>
                                    <BCText style={[gs.fts_11, gs.c_666]}>￥</BCText>
                                    <BCText style={[gs.fts_11, gs.c_666]}>{toDecimal2(product.Price)}</BCText>
                                    <BCText style={[gs.fts_11, gs.c_666]}>/{product.Unit}</BCText>
                                </BCText>
                                <View style={{flexDirection:'row',alignItems:'center'}}>
                                    <View style={{flexDirection:'row'}}>
                                        <BCText style={[gs.c_fd0319,gs.fts_13]}>￥</BCText>
                                        <BCText style={[gs.c_fd0319,gs.fts_13]}>{toDecimal2(product.Price*product.UnitAmount)}</BCText>
                                        <BCText style={[gs.c_666,gs.fts_13]}>/{product.DisplayUnit}</BCText>
                                        {(product.Unit !== product.DisplayUnit)?<View><BCText style={[gs.c_666,gs.fts_13]}>({product.UnitAmount+product.Unit})</BCText></View>:null}
                                    </View>
                                    {
                                        priceChangeReason==1?
                                            <View style={[gs.bgc_fd0319,styles.down]}>
                                                <BCText style={[gs.fts_10,gs.c_fff]}>降</BCText>
                                            </View>
                                            :null
                                    }
                                </View>
                            </View>
                        </View>
                    </BCTouchable>
                    <View style={[styles.number]}>
                        <CarCalculate
                            ref={(c) => {
                                let key = productGlobalId + "-" + SpecId + "-" + companyId + '-' + product.ProductType;
                                if (c) {
                                    this.CarCalculates[key] = (c);
                                }
                            }}
                            companyId={companyId}
                            ProductId={productGlobalId}
                            Quantity={quantity}
                            ProductType={product.ProductType}
                            shoppingCartId={shoppingCartId}
                            SpecId={SpecId}
                            OnChange={(type, quantity, shoppingCartId) => {
                                let CarCalculates = this.CarCalculates;
                                if (CarCalculates) {
                                    let products = CarCalculates[productGlobalId + "-" + SpecId + "-" + companyId + '-' + product.ProductType];
                                    let key = companyId + "-" + products.props.ProductType;
                                    let boxProducts = this.CheckBoxProducts[key];
                                    boxProducts.map((boxProduct) => {
                                        if (boxProduct.props.ProductId === products.props.ProductId && boxProduct.state.IsSelect === true) {
                                            this.MathTotal(this);          //+-重计算
                                        }
                                    });
                                    if (quantity>0) {
                                        this._Loading.Trigger(true);
                                        fetchInsertOrUpdateShoppingCart({
                                            CompanyId: companyId,
                                            ProductGlobalId: productGlobalId,
                                            SpecId: SpecId,
                                            ShoppingCartId: shoppingCartId,
                                            ProductType: products.props.ProductType,
                                            Quantity: quantity
                                        }).then((ret) => {
                                            if (ret.data) {
                                            }
                                            else {
                                                //toastShort('请刷新试试')
                                                //刷新页面
                                                this.onRefresh();
                                            }
                                            this._Loading.Trigger(false);
                                            onSelectedProductChanged(caller);
                                        }).catch((e) => {
                                            this._Loading.Trigger(false);
                                            //刷新页面
                                            this.onRefresh();
                                        });
                                    }else if(quantity==0){
                                        dispatch(DeleteCar(shoppingCartId));
                                        dispatch(ActionDeleteShoppingCarts([shoppingCartId]));
                                        dispatch(ActionLoaderAlwaysBuy());
                                    }
                                }
                            }}
                            key = {this.uuid()}/>
                    </View>
                </View>
            </View>
        )
    }

    //检测是否全部全选
    isCheckAll(isSelect, key) {
        var i = 0;
        var allLength = 0;
        let boxProducts = this.CheckBoxProducts;
        for (let val in boxProducts) {
            for (let Product of boxProducts[val]) {
                if (Product) {
                    if (Product.state.IsSelect) {
                        i++;
                    }
                    allLength++;
                }
            }
        }
        if (i === allLength) {
            this.CheckBoxAll.OnChange(true, this, this.MathTotal);
        } else {
            this.CheckBoxAll.OnChange(false, this, this.MathTotal);
        }
    }

    changeEdit(Edit) {
        let products = this.CarCalculates;
        //let SlideBoxProducts = this._SlideBoxProducts;
        let companys = this.props.ReduceLoadShoppingCarts.datas;
        companys.map((company, index) => {
            company.Items.map((Product, i) => {
                let key = Product.CompanyId + "-" + Product.ProductType;
                /* SlideBoxProducts[key].map((obj,c)=>{
                 obj.onChangeEdit(!Edit);
                 });*/
                products[Product.ProductGlobalId + "-" + Product.SpecId + "-" + Product.CompanyId + "-" + Product.ProductType].onChangeEdit(!Edit);
            })
        });

        // this._TextChange.onChangeEdit(!Edit);
        this._Footer.onChangeEdit(!Edit)
        this._carButton.onChangeEdit(!Edit);
        //this._SlideDelete.onChangeEdit(!Edit)

        /*if (this.params && this.params.callBack) {
            let callBack = this.params.callBack;
            callBack();
        }
        const {dispatch} = this.props;*/
        //dispatch(ActionLoaderAlwaysBuy());
    }

    MathTotal(self) {

    }

    //补货的标记
    renderReplenishIcon(company) {
        let style = {
            width: px2dp(24),
            height: px2dp(29),
            position: 'absolute',
            top: 0,
            right: px2dp(12)
        }

        if (company.Type == 0 || company.Type == -1) {
            return null;
        } else if (company.Type == 1) {
            return (<BCImage style={[style]} source={require('../../../imgs/direct.png')}/>)
        } else {
            return (  <BCImage style={[style]} source={require('../../../imgs/repair.png')}/>)
        }
    }

    //删除
    deleteCell() {
        const {dispatch, ReduceLoadShoppingCarts} = this.props;
        let shoppingCartIds = [];
        let boxProducts = this.CheckBoxProducts;
        if (boxProducts) {
            for (let boxProduct in boxProducts) {
                boxProducts[boxProduct].map((Product, index) => {
                    if (Product.state.IsSelect) {
                        shoppingCartIds.push(
                            Product.props.ShoppingCartId
                        );
                        //dispatch(DeleteCar(Product.props.ShoppingCartId));
                    }
                });
            }
        }
        if (shoppingCartIds.length > 0) {
            //关闭按钮的提示窗
            let self = this;
            confirm("确定要删除吗？", function () {
                //self.pop();
                shoppingCartIds.map((id, index) => {
                    dispatch(DeleteCar(id));
                });
                dispatch(ActionDeleteShoppingCarts(shoppingCartIds));
                dispatch(ActionLoaderAlwaysBuy());
            }, function () {
                return false
            });


        } else {
            toastLong("请选中要删除的商品")
        }
    }


    //去结算
    toPay(one) {

        let boxProducts = this.CheckBoxProducts;
        let shoppingCartIds = [];
        if (boxProducts) {
            for (let boxCompanyID in boxProducts) {
                for (let Product of boxProducts[boxCompanyID]) {
                    if (Product) {
                        if (Product.state.IsSelect) {
                            shoppingCartIds.push(
                                Product.props.ShoppingCartId
                            )
                        }
                    }
                }
            }
        }
        if (shoppingCartIds.length > 0) {
            this.push('ConfirmOrder', {shoppingCartIds: shoppingCartIds.toString()})
        } else {
            toastLong("请选中要结算的商品");
            /* this.setState({
             showMaks: true,
             });*/
        }
    }

    //底部
    Bottom() {
        const {ReduceLoadShoppingCarts} = this.props;
        data = this.props.ReduceLoadShoppingCarts.datas;
        return (
            this.state.dataSource.length > 0 ? this.renderFooter() : null
        )
    }

    renderFooter() {
        let checkBox = <CheckBox
            ref={(c) => {
                if (c != null) {
                    this.CheckBoxAll = c
                }
            }}
            Checked={require('../../../imgs/onSelect.png')}
            OnChange={(isSelect) => {
                if(!isSelect){
                    this._Tips.map((item)=>item.OnChange(null));
                }else{
                    let index=0;
                    let totalSelected=0;
                    let totalQuantity=0;
                    let totalAmount=0;
                    for(let p in this.CheckBoxProducts){
                        let item =this.CheckBoxProducts[p];
                        index += 1;

                        item.map((product)=>{
                            // if(product.state.IsSelect) {
                                totalSelected +=1;
                                totalQuantity += product.props.Quantity;
                                totalAmount += product.props.Price*product.props.Quantity *product.props.UnitAmount;
                            // }
                        })

                        if(totalSelected>0){
                            this.state.dataSource.map((company, index)=> {
                                // console.log(totalSelected,totalQuantity,company.StartQuantity,totalAmount,company.StartPrice)
                                if (totalAmount < company.StartPrice) {
                                    this._Tips[index].OnChange("还差" + toDecimal2(company.StartPrice - totalAmount) + "元免配送费，去凑单～");
                                } else if (totalQuantity < company.StartQuantity) {
                                    this._Tips[index].OnChange("还差" + toDecimal2(company.StartQuantity - totalQuantity) + "件免配送费，去凑单～");
                                }else{
                                    this._Tips[index].OnChange(null);
                                }
                            })
                        }

                    }
                }
                let boxCompanys = this.CheckBoxCompanys;
                boxCompanys.map((boxCompany) => {
                    boxCompany.OnChange(isSelect);
                    let key = boxCompany.props.CompanyId + "-" + boxCompany.props.Type;
                    let boxProducts = this.CheckBoxProducts[key];
                    if (boxProducts) {
                        setTimeout(function () {
                        }, 300);
                        boxProducts.map((boxProduct) => {
                            boxProduct.OnChange(isSelect, this, this.MathTotal);
                        })
                    }
                });
                this.onSelectedProductsChanged(this);
            }}/>;
        return (
            <View style={styles.footerWrap}>
                <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',width:'75%'}}>
                    <View style={{flexDirection: 'row',alignItems:'center'}}>
                        {checkBox}
                        <BCText style={[gs.c_333, gs.fts_14]}>全选</BCText>
                    </View>
                    <ShoppingCartFooter ref={(v)=> this._Footer = v}></ShoppingCartFooter>
                </View>
                <CarButton
                    ref={(c) => {
                        this._carButton = c
                    }}
                    _products={this.CheckBoxProducts}
                    _toPay={() => {
                        this.toPay();
                    }}
                    _deleteCell={() => {
                        this.deleteCell();
                    }}
                    onchange={() => {
                    }
                    }
                />
            </View>
        )
    }

    //弹窗
    maksContent() {
        return (
            this.state.showMaks ?
                <View style={[styles.selectType]}>
                    <View style={[styles.topView]}>
                        <BCText style={[gs.fts_18, styles.topTitle]}>确定删除吗？</BCText>
                    </View>
                    <View style={{flexDirection: "row"}}>
                        <BCTouchable style={[styles.menuItem, gs.bgc_fff, {
                            marginTop: px2dp(10),
                            borderRightWidth: 0.5,
                            borderRightColor: "#dbdbdb"
                        }]}
                                     onPress={() => this.onCloseMask()}>
                            <BCText style={[gs.fts_17, gs.fts_18, {color: '#3b5df2', marginTop: px2dp(2)}]}>取消</BCText>
                        </BCTouchable>
                        <BCTouchable style={[styles.menuItem, gs.bgc_fff, {marginTop: px2dp(10)}]}
                                     onPress={() => this.deleteRow()}>
                            <BCText style={[gs.fts_17, gs.fts_18, {color: '#3b5df2', marginTop: px2dp(2)}]}>确定</BCText>
                        </BCTouchable>
                    </View>
                </View> :
                null
        )
    }

    onCloseMask() {
        this.setState({
            showMaks: false
        })
    }

    WillMount() {
        const {dispatch} = this.props;
        this.setState({CheckBoxProducts:[]})
        dispatch(ActionShoppingCarts());

    }

    componentDidMount() {
        this.setState({
            run: true
        })
    }

    //初始化数据
    WillReceive(nextProps) {
        this.setState({
            IsReceived: true
        });
        if (nextProps.ReduceLoadShoppingCarts.datas != null && nextProps.ReduceLoadShoppingCarts != this.props.ReduceLoadShoppingCarts) {
            const {ReduceLoadShoppingCarts} = nextProps;
            let dataSourceError = ReduceLoadShoppingCarts.datas;
            let dataSource=[];
            for (let i=0;i<dataSourceError.length;i++){
                if(dataSourceError[i].Items.length>0){
                    dataSource.push(dataSourceError[i])
                }
            }
            this.setState({
                dataSource: dataSource
            });
        }
    }

    content() {
        let uri1 = require('../../../imgs/nullShoppingCart.png');
        // let dataSource=this.state.dataSource;
        // let companys=[];
        let companys = this.state.dataSource;
        //var companys = this.props.ReduceLoadShoppingCarts.datas;
        let content= (
            companys.length > 0 ?
                <View style={[styles.content, {backgroundColor: "#eae9ef"}]}>
                    {
                        companys.map((company, index) => {
                            return this.renderCompanys(company, index);
                        })
                    }
                    {/*{
                     companys.map((company, index) => {
                     this._SlideBoxProducts={};
                     return (
                     <View style={[styles.dl, gs.bgc_fff]} key={index}>
                     {this.renderCompany(company)}
                     {
                     company.Items.map((product, i) => {
                     let isSelect = product.IsSelect;
                     let companyId = product.CompanyId;
                     let productGlobalId = product.ProductGlobalId;
                     let price = product.Price;
                     let quantity = product.Quantity;
                     let shoppingCartId = product.ShoppingCartId;
                     let specId = product.SpecId;
                     if (product.CompanyId === company.CompanyId) {
                     return (
                     <SlideDelete key={i}
                     ref={(c) => {
                     if (c != null) {
                     let key = companyId + "-" + product.ProductType;
                     if (!this._SlideBoxProducts[key]) {
                     this._SlideBoxProducts[key] = [];
                     }
                     this._SlideBoxProducts[key].push(c);
                     }
                     }}
                     callDeleteClick={() => alert('删除')}
                     ProductName={product.ProductName}
                     Price={product.Price}
                     iconName={product.Image}
                     Unit={product.Unit}
                     ProductId={productGlobalId}
                     Quantity={quantity}
                     CompanyId={companyId}
                     OnChange={() => {}}
                     />
                     )
                     }
                     })
                     }
                     </View>
                     )

                     })
                     }*/}
                </View> :
                <View style={[styles.noNontent, gs.bgc_fff]}>
                    <View style={{justifyContent: "center", alignItems: "center", marginTop: px2dp(100)}}>
                        <BCImage style={[{width: px2dp(150), height: px2dp(105),}]}
                                 source={uri1}/>
                            <BCText style={[gs.fts_14, gs.c_31ca96, {marginTop: px2dp(30)}]}>购物车里什么都没有喔～</BCText>
                    </View>
                   <View style={{justifyContent: 'center',alignItems:'center'}}>
                        <BCTouchable style={{width:px2dp(150),height:px2dp(30),borderRadius:px2dp(5),backgroundColor:'#fd3546',marginTop:px2dp(20),justifyContent:'center',alignItems:'center'}}
                                     onPress={()=>{this.push('ClassifyList',{categoryId:1,})
                        }}>
                            <BCText style={[gs.fts_16,gs.c_fff]}>去购买</BCText>
                        </BCTouchable>
                    </View>
                </View>
        );
        return content;
    }
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        paddingBottom: px2dp(40),
        minHeight: deviceHeight + 1,
    },
    down:{
        width: px2dp(15),
        height: px2dp(15),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: px2dp(3),
        marginLeft: px2dp(6.5)
    },
    noNontent: {
        flex: 1,
        height: deviceHeight,
    },
    dl: {
        marginBottom: px2dp(10),
        //paddingBottom:px2dp(13)
    },

    dt: {
        height: px2dp(44),
        borderBottomWidth: 1,
        borderBottomColor: '#e3e3e3',
        paddingVertical: px2dp(7),
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
    },
    chooseBtn: {
        marginRight: px2dp(13),
        marginLeft: px2dp(12),
    },
    chooseCIcle: {
        width: px2dp(20),
        height: px2dp(20),
    },
    comapnyImg: {
        width: px2dp(29),
        height: px2dp(29),
    },
    companyName: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
    },

    dd: {
        height: px2dp(73),
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        marginBottom: px2dp(12),
    },

    //商品个数 （×X个）
    number:{
        width:px2dp(100),
        height:px2dp(34),
        flexDirection: 'row',
        justifyContent:'center',
        alignItems:'flex-end',
        position: "absolute",
        top: px2dp(40),
        right : px2dp(10),
        zIndex:1,
        // color:'#fff',fontSize:px2dp(12),
    },
    productImg: {
        width: px2dp(60),
        height: px2dp(60),
        marginRight: px2dp(9),
        marginTop: px2dp(7)
    },
    itemRight: {
        height: "100%",
        //height: px2dp(60),
        flex: 1,
        //justifyContent: "space-around",
        //justifyContent: "space-around",
    },
    listDetail: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    listDetailRight: {
        flexDirection: "row",
        alignItems: 'center',
        marginTop: px2dp(2),
    },
    handleProduct: {},
    actIcon: {
        width: px2dp(15),
        height: px2dp(15),
        marginLeft: px2dp(7),
    },

    btnBox: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
    },
    btnInput: {
        width: px2dp(32),
        height: px2dp(22),
        padding: 0,
        textAlign: 'center',
        alignItems: 'center',
    },

    footerWrap: {
        width: '100%',
        height: px2dp(44),
        position: 'absolute',
        bottom: 0,
        left: 0,
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: px2dp(12),
        backgroundColor: '#fff',
        borderTopWidth:.5,
        borderTopColor:'#e3e3e3',
    },
    selectAll: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        marginRight: px2dp(13)
    },
    pay: {
        width: px2dp(94),
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        right: 0
    },

    //弹出框
    selectType: {
        position: 'absolute',
        left: deviceWidth / 2 - px2dp(258 / 2),
        bottom: (deviceHeight - px2dp(50)) / 2 - px2dp(108 / 2),
        height: px2dp(108),
        zIndex: 2,
        width: px2dp(258),
        borderRadius: 15,
        justifyContent: "center",
        alignItems: 'center',
        backgroundColor: "#fff"
    },
    menuItem: {
        height: px2dp(30),
        width: px2dp(258 / 2 - 1),
        justifyContent: 'center',
        alignItems: 'center',
        //borderTopWidth:1,
        //borderTopColor:"#dbdbdb"
    },
    topView: {
        borderBottomWidth: 1,
        borderBottomColor: "#dbdbdb",
        width: deviceWidth,
    },
    topTitle: {
        color: "#000",
        marginTop: px2dp(10),
        marginBottom: px2dp(15),
        marginLeft: px2dp(258 / 2 - 25),
    },

});

function mapStateToProps(store) {
    //toastLong(JSON.stringify(store.ReduceLoderProducts))
    return {
        ReduceLoadShoppingCarts: store.ReduceLoadShoppingCarts,
        ReduceDeleteShoppingCarts:store.ReduceDeleteShoppingCarts,
        currentEmployee: store.ReduceEmployee.currentEmployee,
        ReduceProductDetail: store.ReduceProductDetail,
        ReduceInsertOrUpdateShoppingCart: store.ReduceInsertOrUpdateShoppingCart,
    }
}

const connectProviders = connect(mapStateToProps)(Cart);
connectProviders.navigationOptions = NavigationOptions;
export default connectProviders;