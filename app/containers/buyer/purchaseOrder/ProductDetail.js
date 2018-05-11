/**
 * Created by Administrator on 2017/4/11.
 */
import React, {Component} from 'react';
import {StyleSheet, View, Text, TextInput, ScrollView, WebView,Platform} from 'react-native';
import {connect} from "react-redux";
import {PullViewComponent} from '../../PageComponent'
import {
    px2dp,
    px2dpH,
    deviceWidth,
    deviceHeight,
    substr,
    BCText,
    BCImage,
    BCTouchable,
    NavigationOptions,
    BCHostImage,
    deepCopy
} from '../../../BaseComponent';
import gs from '../../../styles/MainStyles';
import ProductDetailBar from './ProductDetailBar';
import {ActionProductDetail} from '../../../actions/ProductAction'
import {
    fetchInsertOrUpdateShoppingCart,
    fetchDeleteShoppingCarts,
    fetchShoppingCarts
} from '../../../services/ShoppingCartServices'
import {ActionShoppingCarts, ActionInsertOrUpdateShoppingCart, UpdateCar} from '../../../actions/ShoppingCartAction';
import {Calculate} from '../../../components/Calculate';
import {toDecimal2} from '../../../utils/FormatUtil';
import {toastShort} from '../../../utils/ToastUtil';

//选中多规格按钮 单个按钮组件
class CheckButton extends Component {
    constructor(props) {
        super(props)
        this.state = {
            IsSelect: props.IsSelect,
            Title: props.Title,
            Data: props.Data,
        }
    }

    static propTypes = {
        IsSelect: React.PropTypes.bool,
        OnChange: React.PropTypes.func,
        Title: React.PropTypes.object,
        Data: React.PropTypes.array,
    };
    static defaultProps = {
        IsSelect: false,
    };

    OnChange(isSelect) {
        this.setState({
            IsSelect: isSelect
        })
    }

    _onPress(Price, Unit, SpecId, SpecName, ShoppingCartId, Quantity) {
        this.setState({
            IsSelect: !this.state.IsSelect
        }, () => {
            this.props.OnChange(this.state.IsSelect, Price, Unit, SpecId, SpecName, ShoppingCartId, Quantity);
        })
    }

    render() {
        let Data = this.state.Data;
        let Price = this.state.Title.Price;
        let Unit = this.state.Title.Unit;
        let SpecId = this.state.Title.SpecId;
        const index = Data.findIndex(
            item =>
                item.SpecId === SpecId);
        let SpecName = this.state.Title.SpecName;
        let ShoppingCartId = this.state.Title.ShoppingCartId;
        //let Quantity = Data[index].Quantity;
        let Quantity = this.state.Title.Quantity;
        return (
            <BCTouchable
                style={[styles.specBorder, this.state.IsSelect ? {borderColor: '#00C164'} : {borderColor: '#f2f1ef'}]}
                onPress={() => {
                    this._onPress(Price, Unit, SpecId, SpecName, ShoppingCartId, Quantity)
                }}>
                <BCText
                    style={[gs.fts_13, gs.c_888, this.state.IsSelect ? {color: "#00C164"} : {color: "#3a3838"}]}>{this.props.Title.SpecName}</BCText>
            </BCTouchable>
        )
    }

}

//整个按钮组组件
class SpecItem extends Component {
    CheckButton = [];

    constructor(props) {
        super(props)
        this.state = {}
    }

    static propTypes = {
        data: React.PropTypes.array

    };
    static defaultProps = {
        data: [],
    };

    render() {
        this.CheckButton = [];
        return (
            <View style={styles.specView}>
                {
                    this.props.data.map((Spec, index) => {
                        return (
                            <CheckButton Title={Spec}
                                         Data={this.props.data}
                                         SpecId={Spec.SpecId}
                                         key={index}
                                         IsSelect={index == 0 ? true : false}
                                         ref={(c) => {
                                             if (c !== null) {
                                                 this.CheckButton.push(c);
                                             }
                                         }}
                                         OnChange={(isSelect, Price, Unit, SpecId, SpecName, ShoppingCartId, Quantity) => {
                                             this.CheckButton.map((btn, index) => {
                                                 //实现单选
                                                 if (btn.props.SpecId != Spec.SpecId) {
                                                     btn.OnChange(false);
                                                 }
                                                 else {
                                                     btn.OnChange(true);
                                                     const index = this.props.data.findIndex(
                                                         item =>
                                                             item.SpecId === SpecId);
                                                     Quantity = this.props.data[index].Quantity;
                                                     this.props.OnChange(isSelect, Price, Unit, SpecId, SpecName, ShoppingCartId, Quantity)
                                                 }
                                             })
                                         }}/>
                        )
                    })
                }
            </View>
        )
    }
}

//价格和加减按钮组件
class PriceCalculate extends Component {
    constructor(props) {
        super(props)
        this.state = {
            Text: "",
            price: props.data.price,
            Unit: props.data.Unit,
            SpecId: props.data.SpecId,
            Quantity: props.data.Quantity,
            ShoppingCartId: props.data.ShoppingCartId,
        }
    }

    _Products = {};
    static propTypes = {
        item: React.PropTypes.object,
        OnPressCalculate: React.PropTypes.func,
        OnInit: React.PropTypes.func,
    };

    changePrice(price, Unit, SpecId, Quantity, ShoppingCartId) {
        this.setState({
            price: price,
            Unit: Unit,
            SpecId: SpecId,
            Quantity: Quantity,
            ShoppingCartId: ShoppingCartId,
        })
    }

    _onPressCalculate(type, quantity, shoppingCartId, productId, SpecId, price, SpecName) {
        this.props.OnPressCalculate({
            type, quantity, shoppingCartId,
            _Product: this._Products[productId + '-' + SpecId],
            SpecId, price, SpecName, productId
        })
    }

    renderPrice() {
        let price = this.state.price;
        let data = this.props.data.data;
        let SpecId = this.state.SpecId;
        let Spec = data.Specs;
        // console.log('Spec[index]', Spec)
        const index = Spec.findIndex(
            item =>
                item.SpecId === SpecId);
        let Quantity = Spec[index].Quantity;
        let ShoppingCartId = Spec[index].ShoppingCartId;
        let priceChangeReason = Spec[index].PriceChangeReason;
        let Price = this.props.data.price;
        let SpecName = this.props.data.SpecName;
        let ProductGlobalId = data.ProductId;

        return (
            <View style={styles.priceView}>
                <View>
                    <BCText style={[gs.fts_16, gs.c_fd0319,]}>￥{toDecimal2(price)}/{this.state.Unit}</BCText>
                </View>
                {priceChangeReason == 1?
                    <View style={[gs.bgc_fd0319,styles.down]}>
                        <BCText style={[gs.fts_10,gs.c_fff]}>降</BCText>
                    </View>:null}
                <View style={styles.btnBox}>
                    {
                        this.props.IsActive ?
                            <Calculate
                                ref={(c) => {
                                    this._Products[ProductGlobalId + '-' + SpecId] = c;
                                }}
                                Quantity={Quantity}
                                ProductId={ProductGlobalId}
                                SpecId={SpecId}
                                shoppingCartId={ShoppingCartId}
                                OnChange={(type, quantity, shoppingCartId) => {
                                    this._onPressCalculate(type, quantity, shoppingCartId, ProductGlobalId, SpecId, this.state.price, SpecName,)
                                }}/>
                            :
                            <BCText style={[gs.fts_16, gs.c_fd0319,]}>已下架</BCText>
                    }

                </View>
            </View>
        )
    }

    render() {
        return this.renderPrice()
    }
}

class ProductDetail extends PullViewComponent {
    _Product = {};
    _Products = {};
    _ProductDetailBar = null;
    _PriceView = {};
    callBack = null;
    index = 0;

    constructor(props) {
        super(props)
        this.state = {
            webViewHeight:500,
            isBorderBottom: true,
            isSelectSpec: true,
            //规格
            specData: [],
            dataSource: [],
        }
    }

    //设置页面标题
    setTitle() {
        return "商品详情"
    }

    //返回回调
    onBack() {
        if (this.params.callBack) {
            let callBack = this.params.callBack;
            callBack();
        }
        if (this.params.type) {
            this.push('MallProducts',)
        }
    }

    updateDataSource(ShoppingCartId, specId, data) {
        const datas = this.state.dataSource;
        datas.Specs.map((item, index) => {
            if (item.SpecId === specId) {
                item.ShoppingCartId = ShoppingCartId;
            }
        })
    }

    updateCart(productId, specId, quantity, shoppingCartId) {
        const {dispatch, ReduceProductDetail} = this.props;
        const {productGlobalId, companyId, productType, product} = this.params;
        const data = ReduceProductDetail.datas;
        //const data = deepCopy(this.state.dataSource);
        let Specs = data.Specs;
        let InsertProducts = {
            company: {},
            products: {Image: {}, ProductId: {}, ProductName: {}, Specs},
            productType: productType,
            sCompanyId: companyId,
        };
        let Specs0 = InsertProducts.products.Specs[0];
        InsertProducts.products.Image = data.Image;
        InsertProducts.products.ProductId = data.ProductId;
        InsertProducts.products.ProductName = data.ProductName;
        Specs0.ShoppingCartId = shoppingCartId;
        Specs0.Quantity = quantity;
        InsertProducts.company.CompanyName = product.Specs[0].CompanyName;
        InsertProducts.company.LogoImage = product.Specs[0].CompanyImage;
        InsertProducts.company.CompanyId = data.CompanyId;
        //dispatch(UpdateCar(InsertProducts));
    }

    onClickSpec(i, Spec) {
        let spec = Spec;
        if (spec[i].IsSelect) {
        }
        else {
            spec.map((e, index) => {
                if (i == index) {
                    spec[index].IsSelect = true;
                }
                else {
                    spec[index].IsSelect = false;
                }
            });
            this.setState({specData: spec})
        }
    }

    onRefresh() {
        const {dispatch} = this.props;
        const {productGlobalId, companyId, productType} = this.params;
        dispatch(ActionProductDetail({
            productGlobalId: productGlobalId,
            companyId: companyId,
            productType: productType,
        }));
    }

    refeshView() {
        this.onRefresh();
    }

    //选择规格
    onSelectSpec() {
        this.setState({
            isSelectSpec: !this.state.isSelectSpec,
        });
    }

    content() {
        const {dispatch} = this.props;
        const {freeDistance} = this.params;
        const data = this.state.dataSource;
        let ProductName = data.ProductName;
        let ProductGlobalId = data.ProductId;
        let Spec = data.Specs;
        let ShoppingCartId = Spec[0].ShoppingCartId;
        let Image = data.Image;
        let SpecId = Spec[0].SpecId;
        let CompanyId = data.CompanyId;
        let Description = data.Description;
        const HTML = `
        <!DOCTYPE html>\n
        <html>
          <head>
            <title></title>
            <meta http-equiv="content-type" content="text/html; charset=utf-8">
              <meta name="viewport" content="user-scalable=no, width=device-width" />
            <style type="text/css">
              body {
                margin: auto;
                font-size: 12px;
                
              }
            </style>
          </head>
          <body>
          <script>window.onload=function(){window.location.hash = 1;document.title = document.body.clientHeight;}</script>
            <div style="text-align: center">${Description}</div>
          </body>
        </html>
        `;
        return (
            <View>
                <View style={[styles.head, gs.bgc_fff]}>
                    <BCHostImage style={{height: px2dp(280), width: deviceWidth}}
                                 source={{uri: Image}}
                    />
                    <View style={{
                        marginLeft: px2dp(12),
                        paddingTop: px2dp(13),
                        paddingBottom: px2dp(16)
                    }}>
                        <BCText style={[gs.fts_16, gs.c_3a3838,]}>{ProductName}</BCText>
                        <BCText
                            style={[gs.fts_13, gs.c_888,]}>{/*freeDistance ? freeDistance + "公里范围内起送" : null*/}</BCText>
                    </View>
                </View>
                <View style={[gs.bgc_fff, {marginTop: px2dp(10)}]}>
                    <BCText
                        style={[gs.fts_13, gs.c_888, {marginTop: px2dp(8), marginLeft: px2dp(12),}]}>选择规格</BCText>
                    <SpecItem data={Spec}
                              OnChange={(isSelect, Price, Unit, SpecId, SpecName, ShoppingCartId, Quantity) => {
                                  this._PriceView.changePrice(Price, Unit, SpecId, Quantity, ShoppingCartId, SpecName);
                                  this._ProductDetailBar.SetTotalCount("ban",
                                      ProductObj = {
                                          Price: Price,
                                          ProductName: ProductName,
                                          CompanyId: CompanyId,
                                          ProductId: ProductGlobalId,
                                          Quantity: Quantity,
                                          SpecId: SpecId,
                                          ShoppingCartId: ShoppingCartId
                                      },
                                  );
                                  this.Bottom(SpecId);
                              }}/>

                    <PriceCalculate ref={(p) => {
                        this._PriceView = p
                    }}
                                    data={{
                                        data,
                                        price: Spec[0].Price,
                                        Unit: Spec[0].Unit,
                                        SpecId: Spec[0].SpecId,
                                        SpecName: Spec[0].SpecName,
                                        ShoppingCartId: Spec[0].ShoppingCartId,
                                        Quantity: Spec[0].Quantity,
                                    }}
                                    IsActive={data.IsActive}
                                    OnPressCalculate={(paramsObj) => {
                                        if (paramsObj.quantity) {
                                            fetchInsertOrUpdateShoppingCart({
                                                CompanyId: CompanyId,
                                                ProductGlobalId: ProductGlobalId,
                                                SpecId: paramsObj.SpecId,
                                                ShoppingCartId: paramsObj.shoppingCartId,
                                                ProductType: this.params.productType,
                                                Quantity: paramsObj.quantity
                                            }).then((ret) => {
                                                if (ret.data) {
                                                    let data = ret.data;
                                                    let ShoppingCartId = data.ShoppingCartId;
                                                    let productId = data.ProductGlobalId;
                                                    let specId = data.SpecId;

                                                    //this.updateDataSource(ShoppingCartId, specId, data);
                                                    //更新购物车
                                                    //dispatch(ActionShoppingCarts());
                                                    //this.updateCart(productId, specId, paramsObj.quantity, ShoppingCartId);
                                                }
                                                else if (ret.error) {
                                                    //toastShort(ret.error.message)
                                                    //this.onRefresh()
                                                }
                                            }).catch((e) => {
                                                //this.onRefresh()
                                                this._Loading.Trigger(false);
                                            });
                                        }
                                        else {
                                            fetchDeleteShoppingCarts([paramsObj.shoppingCartId]).then((ret) => {
                                                if (!ret.data) {
                                                    //更新购物车
                                                    //dispatch(ActionShoppingCarts());
                                                    //this.updateCart(ProductGlobalId, paramsObj.SpecId, 0, paramsObj.shoppingCartId);
                                                }
                                                else if (ret.error) {
                                                    //this.onRefresh()
                                                    //toastShort(ret.error.messages)
                                                }
                                                this._Loading.Trigger(false);
                                            }).catch((e) => {
                                                // this.onRefresh()
                                                this._Loading.Trigger(false);
                                            });
                                        }
                                        this._ProductDetailBar.SetTotalCount(paramsObj.type, ProductObj = {
                                            Price: paramsObj.price,
                                            ProductName: ProductName,
                                            CompanyId: CompanyId,
                                            ProductId: ProductGlobalId,
                                            Quantity: paramsObj.quantity,
                                            SpecId: paramsObj.SpecId,
                                            EmployeeId: 1,
                                        }, paramsObj._Product)
                                    }}/>
                </View>
                <View style={[ styles.introduceView,gs.bgc_fff]}>
                    <BCText
                        style={[gs.fts_13, gs.c_888, {marginLeft: px2dp(12), marginTop: px2dp(12)}]}>商品介绍</BCText>
                    {
                        Description==null || Description==''?
                            <View style={{marginLeft: px2dp(12),marginTop:px2dp(20)}}>
                                <BCText style={[gs.fts_13,gs.c_888]}>暂无数据</BCText>
                            </View>
                            :
                            <View style={{height:this.state.height,width:deviceWidth}}>
                            <WebView
                                source={{html: HTML}}
                                style={{flex:1,width:deviceWidth,height:this.state.height,alignItems:'center',justifyContent: 'space-between'}}
                                automaticallyAdjustContentInsets={true}
                               contentInset={{top:0,left:10}}
                                scalesPageToFit={true}
                                javaScriptEnabled={true}
                                scrollEnabled={false}

                                onNavigationStateChange={(title)=>{
                                    if(title.title != undefined) {
                                        this.setState({
                                            height:(parseInt(title.title))
                                        })
                                    }
                                }}
                            />
                            </View>
                    }
                </View>
            </View>
        )
    }

    //底部
    Bottom(SpecId, i) {
        const data = this.state.dataSource;
        let totalCount = 0;
        let totalPrice = 0;
        let SpecTotalCount = 0;
        let SpecTotalPrice = 0;
        let Spec = data.Specs;
        totalCount = Spec[this.index].Quantity;
        if (Spec[this.index].DisplayUnitTypeId === 2) {
            totalPrice = Spec[this.index].Quantity * Spec[this.index].Price * Spec[this.index].UnitAmount;
        } else {
            totalPrice = Spec[this.index].Quantity * Spec[this.index].Price;
        }

        if (SpecId !== undefined && SpecId !== null) {
            const index = Spec.findIndex(
                item =>
                    item.SpecId === SpecId);
            totalCount = Spec[index].Quantity;
            if (Spec[index].DisplayUnitTypeId === 2) {
                totalPrice = Spec[index].Quantity * Spec[index].Price * Spec[index].UnitAmount;
            } else {
                totalPrice = Spec[index].Quantity * Spec[index].Price;
            }
            this.index = index;
        }
        /* if (Spec.length > 1) {
         Spec.map((item, index) => {
         if (item.Quantity > 0) {
         SpecTotalCount = item.Quantity;
         SpecTotalPrice = item.Quantity * item.Price
         }
         });
         } else {
         Spec.map((item, index) => {
         totalCount += item.Quantity;
         totalPrice += item.Quantity * item.Price
         });
         }*/
        let PriceView = this._PriceView;
        let bCompanyId=this.state.dataSource.BCompanyId;
        let sCompanyId=this.state.dataSource.CompanyId;
        return (
            <ProductDetailBar
                ref={(c) => {
                    this._ProductDetailBar = c;
                }}
                TotalCount={totalCount}
                TotalPrice={toDecimal2(totalPrice) * 1}
                Items={Spec}
                Push={()=>{
                    this.pop();
                    {
                        this.params.fromIndex!==0?
                            this.navigation.goBack():  // this.params.callBack():
                            this.push('ProductList', {
                                bCompanyId,
                                sCompanyId,
                                fromWhere: this.params.fromWhere,
                                // fromIndex:this.params.fromIndex,
                            })
                    }
                }}
                ToShoppingCar={() => {
                    this.push('Cart', {pageFrom: 'PrductDetail', callBack: this.refeshView.bind(this, this)});
                    //this.onRefresh();

                }}
            />
        )
    }

    WillMount() {
        const {dispatch} = this.props;
        const {productGlobalId, companyId, productType} = this.params;
        dispatch(ActionProductDetail({
            productGlobalId: productGlobalId,
            companyId: companyId,
            productType: productType,
            fromWhere:this.params.fromWhere,
            fromIndex:this.params.fromIndex,
        }));
    }

    WillReceive(nextProps) {
        if (nextProps.ReduceProductDetail.datas != null && nextProps.ReduceProductDetail.datas !== this.props.ReduceProductDetail.datas) {
            const dataSource = nextProps.ReduceProductDetail.datas;
            this.setState({
                dataSource: dataSource,
                IsReceived: true,

            });
        }
        /*if (nextProps.ReduceLoadShoppingCarts.datas != null && nextProps.ReduceLoadShoppingCarts != this.props.ReduceLoadShoppingCarts) {
            const {ReduceLoadShoppingCarts} = nextProps;
            let UpdateData = ReduceLoadShoppingCarts.datas;
        }*/
        this.reSetHeight();
    }
}

const styles = StyleSheet.create({
    main: {
        flex: 1
    },
    head: {},
    specView: {
        flexDirection: "row",
        flexWrap: "wrap",

    },
    specBorder: {
        borderRadius: 4,
        borderWidth: px2dp(1),
        width: px2dp(86),
        height: px2dp(29),
        marginLeft: px2dp(12),
        marginTop: px2dp(8),
        justifyContent: "center",
        alignItems: "center",

    },

    //加减
    btnBox: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        position: 'absolute',
        right: 0
    },
    btnInput: {
        width: px2dp(32),
        height: px2dp(30),
        padding: 0,
        textAlign: 'center'
    },

    introduceView: {
        marginTop: px2dp(10),
        paddingBottom: px2dp(12),
        marginBottom: px2dp(90)
    },

    priceView: {
        flexDirection: 'row',
        alignItems: "center",
        paddingBottom: px2dp(12),
        width: deviceWidth - px2dp(12 + 12),
        paddingRight: px2dp(12),
        borderTopWidth: 1,
        borderTopColor: "#f2f1ef",
        marginTop: px2dp(8),
        paddingTop: px2dp(12),
        marginLeft: px2dp(12)
    },

    //底部
    footerWrap: {
        width: '100%',
        height: px2dp(66),
        position: 'absolute',
        bottom: 0,
        left: 0,
        justifyContent: 'flex-end',
        zIndex: 100
    },
    footer: {
        width: '100%',
        height: px2dp(46),
        flexDirection: 'row',
        overflow: 'visible',
        justifyContent: 'flex-end',
        backgroundColor: '#fff',
        opacity: 0.9
    },
    pay: {
        width: px2dp(94),
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    car: {
        width: px2dp(94),
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#ff9c12"
    },
    money: {
        height: '100%',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        paddingRight: px2dp(9),
    },
    cart: {
        flex: 1,
        paddingLeft: px2dp(18),
        justifyContent: 'center',
        zIndex: 101,
    },
    cartImg: {
        position: 'absolute',
        bottom: px2dp(17),
        left: px2dp(18),
        zIndex: 102,
    },
    num: {
        minWidth: px2dp(18),
        height: px2dp(11),
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 1,
        right: 0,
        paddingHorizontal: px2dp(4),
        borderRadius: px2dp(9),
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
});

function mapStateToProps(store) {
    return {
        ReduceProductDetail: store.ReduceProductDetail,
        ReduceInsertOrUpdateShoppingCart: store.ReduceInsertOrUpdateShoppingCart,
        ReduceLoadShoppingCarts: store.ReduceLoadShoppingCarts,
    }
}

const connectProductDetail = connect(mapStateToProps)(ProductDetail);
connectProductDetail.navigationOptions = NavigationOptions;
export default connectProductDetail;