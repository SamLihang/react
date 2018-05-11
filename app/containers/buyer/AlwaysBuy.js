import React, {Component} from "react";
import {StyleSheet, View, Platform, FlatList} from "react-native";
import PageComponent, {PullViewComponent,PullListComponent} from "../PageComponent";
import {
    BCHostImage,
    BCImage,
    BCText,
    BCTouchable,
    deepCopy,
    NavigationOptions,
    px2dp,
    px2dpH,
    substr,
    deviceWidth,
    deviceHeight
} from "../../BaseComponent";
import gs from "../../styles/MainStyles";
import {connect} from "react-redux";
import {toastShort} from "../../utils/ToastUtil";
import {ActionAlwaysBuy, ActionLoaderAlwaysBuy} from "../../actions/AlwaysBuyAction";
import {ActionShoppingCarts, UpdateCar} from "../../actions/ShoppingCartAction";
import {fetchDeleteShoppingCarts, fetchInsertOrUpdateShoppingCart} from "../../services/ShoppingCartServices";
import {fetchDeleteAlwaysBuyProduct} from "../../services/AlwaysBuytServices";
import {toDecimal2} from '../../utils/FormatUtil';
import {Calculate} from "../../components/Calculate";
import CheckBox from "../../components/CheckBox";
import Tab from "../../components/Tab";
import {BCAlwayNavigator} from "../../components/BCNavigator";

class Dl extends Component {
    _Product = {}
    _CheckBox = {}

    static defaultProps = {
        isEdit: false,
        product: {},
    };
    static propTypes = {
        isEdit: React.PropTypes.bool,
        product: React.PropTypes.object,
        OnSelect: React.PropTypes.func,
        ToPush: React.PropTypes.func,
    }

    constructor(props) {
        super(props);
        this.state = {
            isEdit: props.isEdit,
            isSelect: props.IsSelect
        }
    }

    //改变编辑状态
    onChangeState(edit) {
        this.setState({
            isEdit: edit,
            isSelect: false
        })
    }

    //选中
    onChangeSelect(isSelect) {
        this.setState({
            isSelect: isSelect
        }, () => {
            Object.keys(this._CheckBox).forEach((id) => {
                this._CheckBox[id].OnChange(isSelect);
            })
        })
    }

    //加加减减
    _onPressCalculate(type, quantity, shoppingCartId, specId) {
        this.props.OnPressCalculate(type, quantity, shoppingCartId, this._Product, specId);
        this.props.product.Specs[0].Quantity = quantity;
    }

    render() {
        const {dispatch} = this.props;
        let product = this.props.product;
        let companyName = product.Specs[0].CompanyName;
        let ProductId = product.ProductId;

        // let Spec0 = this.props.product.Specs[0];
        // let SpecId = Spec0.SpecId;
        // let CompanyId = Spec0.CompanyId;
        // let productType = 0;
        // let price = Spec0.Price;
        // let unit = Spec0.Unit;
        // let priceStr = substr(toDecimal2(price) + '', 8) + '/' + unit;

        return (
            <View style={[{borderBottomWidth: 1, borderBottomColor: '#e3e3e3'}, gs.bgc_fff]}>
                {
                    product.Specs.map((item, index) => {
                        let Spec0 = item;
                        let SpecId = Spec0.SpecId;
                        let CompanyId = Spec0.CompanyId;
                        let productType = 0;
                        let price = Spec0.Price;
                        let unit = Spec0.Unit;
                        let priceChangeReason = Spec0.PriceChangeReason;
                        let priceStr = substr(toDecimal2(price) + '', 8) + '/' + unit;

                        return (
                            <View>
                                <BCTouchable onPress={() => {
                                    this.props.ToPush(ProductId, CompanyId, productType, Spec0.IsActive);
                                }}>
                                <View style={[styles.listItem]} key={index}>
                                    {
                                        this.state.isEdit ?
                                            <CheckBox IsSelect={this.state.isSelect}
                                                      WillReceiveProps={false}
                                                      ref={(c) => {
                                                          this._CheckBox[SpecId] = c
                                                      }}
                                                      OnChange={(isSelect) => {

                                                          this.props.OnSelect(isSelect,CompanyId+'-'+ ProductId+'-'+ SpecId)
                                                      }}/>
                                            : null
                                    }
                                    {/*<BCTouchable onPress={() => {*/}
                                        {/*this.props.ToPush(ProductId, CompanyId, productType, Spec0.IsActive);*/}
                                    {/*}}>*/}
                                        <BCHostImage style={this.state.isEdit ? styles.productImg1 : styles.productImg}
                                                     source={{uri: product.Image}}/>
                                    {/*</BCTouchable>*/}
                                    <View style={styles.listItemRight}>
                                        <View style={[styles.listItemRightTop]}>
                                            <BCText
                                                style={[gs.fts_15, gs.c_3a3838]}>{substr(product.ProductName, 11)}</BCText>
                                        </View>
                                        <BCText
                                            style={[gs.fts_13, gs.c_3a3838, {marginBottom: px2dp(4)}]}>{Spec0.SpecName}</BCText>
                                        <View style={styles.listDetail}>
                                            <View style={[styles.listDetailRight]}>
                                                <BCText style={[gs.c_fd0319]}>
                                                    <BCText style={[gs.fts_12]}>￥</BCText>
                                                    <BCText style={[gs.fts_13]}>{priceStr}</BCText>
                                                </BCText>
                                                {priceChangeReason == 1 ?
                                                    <View style={[gs.bgc_fd0319,styles.down]}>
                                                        <BCText style={[gs.fts_10,gs.c_fff]}>降</BCText>
                                                    </View>:null}
                                                {/*<BCImage style={[styles.actIcon]} source={require('../../../imgs/drop.png')}/>*/}
                                            </View>
                                            {/*<View>*/}
                                            {/*{*/}
                                                {/*Spec0.IsActive ?*/}
                                                    {/*<Calculate*/}
                                                        {/*ref={(c) => {*/}
                                                            {/*this._Product = c;*/}
                                                        {/*}}*/}
                                                        {/*ProductId={ProductId}*/}
                                                        {/*Quantity={Spec0.Quantity}*/}
                                                        {/*shoppingCartId={Spec0.ShoppingCartId}*/}
                                                        {/*OnChange={(type, quantity, shoppingCartId) => {*/}
                                                            {/*this._onPressCalculate(type, quantity, shoppingCartId, SpecId);*/}
                                                        {/*}}/>*/}
                                                    {/*: <BCText style={[gs.c_3a3838]}>已下架</BCText>*/}
                                            {/*}*/}
                                            {/*</View>*/}
                                        </View>
                                    </View>
                                </View>
                                </BCTouchable>
                                <View style={{justifyContent:'center',position:'absolute',bottom:px2dp(2),right:px2dp(5)}}>
                                    {
                                        Spec0.IsActive ?
                                            <Calculate
                                                ref={(c) => {
                                                    this._Product = c;
                                                }}
                                                ProductId={ProductId}
                                                Quantity={Spec0.Quantity}
                                                shoppingCartId={Spec0.ShoppingCartId}
                                                OnChange={(type, quantity, shoppingCartId) => {
                                                    this._onPressCalculate(type, quantity, shoppingCartId, SpecId);
                                                }}/>
                                            : <BCText style={[gs.c_3a3838]}>已下架</BCText>
                                    }
                                </View>
                            </View>
                        )
                    })
                }

                <View style={[styles.company]}>
                    <BCText style={[gs.fts_13, gs.c_b7b7b7]}>由{companyName}配送</BCText>
                </View>
            </View>
        )
    }

}

class Bottom extends Component {

    _CheckBox = {}

    static defaultProps = {
        isEdit: false,
    };
    static propTypes = {
        isEdit: React.PropTypes.bool,
        OnSelectAll: React.PropTypes.func,
        OnDelete: React.PropTypes.func,
        pushCart:React.PropTypes.func,
    }

    constructor(props) {
        super(props);
        this.state = {
            isEdit: props.isEdit,
            isSelect: false
        }
    }

    onChangeState(edit) {
        this.setState({
            isEdit: edit,
            isSelect: false
        })
    }

    render() {
        return (
            this.state.isEdit ?
                <View style={styles.footer}>
                    <CheckBox IsSelect={this.state.isSelect}
                              ref={(c) => {
                                  this._CheckBox = c
                              }}
                              OnChange={(isSelect) => {
                                  this.setState({
                                      isSelect: isSelect
                                  }, () => {
                                      this.props.OnSelectAll(isSelect);
                                  })
                              }}/>
                    <BCText style={[gs.fts_15,gs.c_333]}>全选</BCText>
                    <BCTouchable style={[gs.bgc_fd3547, styles.delete]} onPress={() => {
                        this.props.OnDelete()
                    }}>
                        <BCText style={[gs.c_fff, gs.fts_17]}>删除</BCText>
                    </BCTouchable>
                </View>
                :null
                // {/*<View style={styles.footerWrap}>*/}
                //     {/*<BCTouchable style={[styles.car]}*/}
                //                  {/*onPress={() =>{*/}
                //                      {/*this.props.pushCart()*/}
                //                      {/*}}>*/}
                //         {/*{this.state.totalCount ?<BCText style={[gs.c_fff, gs.fts_17]}>去购物车</BCText> : <BCText style={[gs.c_fff, gs.fts_17]}>去购物车</BCText>}*/}
                //     {/*</BCTouchable>*/}
                // {/*</View>*/}
        )
    }
}

class AlwaysBuy extends PullListComponent {
    _Products = {};
    _Bottom = {};
    ProductGlobalIds = [];
    _Dls = {};
    GlobalDatas = {
        Categorys: [],
        CategoryId: null
    };
    init = true;
    isEdit = false;
    isSelectAll = false;

    constructor(props) {
        super(props);
        this.state = {
            isEdit: false,
            dataSource: [],
            paddingBottom: 0
        };

    }
    renderNavigator() {
        return (
            <BCAlwayNavigator navigation={this.props.navigation}
                              isShowBack={this.isShowBack()}
                              pageFrom={(this.params && this.params.pageFrom) ? true : false}
                              goSearch={this.goSearch.bind(this)}
                              rightTitle={this.rightTitle()}
                              backCallBack={this.onBack}
                              isEdit={this.isEdit}
                              onPressRight={(isEdit) => this.onClickNavigationRight(isEdit)}/>
        )
    }

    //是否显示返回
    isShowBack() {
        if (this.params && this.params.pageFrom) {
            return true
        }
        else {
            return false
        }
    }

    //点击编辑
    onClickNavigationRight(isEdit) {
        this.isEdit = isEdit;
        this.isSelectAll = false;
        this._Bottom.onChangeState(isEdit);

        this.setState({
            paddingBottom: isEdit ? 46 : 0
        })

        Object.keys(this._Dls).forEach((id) => {
            let productDl = this._Dls[id];
            if (productDl) {
                productDl.onChangeState(isEdit);
            }
        });
    }

    //点击搜索
    goSearch() {
        this.push('SearchPageProducts', {
            productType: -1,
            callBack: this.refeshView.bind(this)
        })
    }

    keyExtractor(item, index) {
        return item.ProductId + '-' + index
    }

    refeshView() {
        this.onRefersh();
    }

    //下拉刷新
    onRefresh(Edit) {
        const {dispatch} = this.props;
        this._page=1;
        dispatch(ActionAlwaysBuy(this._page, this.GlobalDatas.CategoryId));
    }

    //刷新
    onRefersh() {
        const {dispatch} = this.props;
        //重置编辑状态
        this.isEdit = false;
        Object.keys(this._Dls).forEach((id) => {
            let productDl = this._Dls[id];
            if (productDl) {
                productDl.onChangeState(false);
            }
        });
        this._Bottom.onChangeState(false);
        //发送请求
        this._page = 0;
        dispatch(ActionAlwaysBuy(0, this.GlobalDatas.CategoryId));
        this.setState({
            paddingBottom: this.isEdit ? 46 : 0
        })

    }

    //上拉
    onEndReached() {
        const {dispatch} = this.props;
        this._page++;
        dispatch(ActionAlwaysBuy(this._page, this.GlobalDatas.CategoryId));
    }

    //更新购物车
    updataCart(productId, specId, quantity, shoppingCartId) {
        const {dispatch} = this.props;
        let productDl = this._Dls[productId + '-' + specId].props.product;

        let InsertProducts = {
            company: {},
            products: deepCopy(productDl),
            productType: -1,
            sCompanyId: productDl.Specs[0].CompanyId
        }
        let Specs0 = InsertProducts.products.Specs[0];

        if (Specs0.ShoppingCartId && this.init) {
            Specs0.betweenNum = quantity;
            this.init = false;
        }
        else {
            Specs0.betweenNum = quantity - Specs0.Quantity
        }
        Specs0.ShoppingCartId = shoppingCartId;
        productDl.Specs[0].Quantity = quantity;
        InsertProducts.company.CompanyName = Specs0.CompanyName;
        InsertProducts.company.CompanyImage = Specs0.CompanyImage;
        InsertProducts.company.CompanyId = Specs0.CompanyId;
        dispatch(UpdateCar(InsertProducts));
    }

    Top() {
        if (this.GlobalDatas.Categorys.length > 0) {
            let categorys = this.GlobalDatas.Categorys;
            return <Tab Style={1}
                        Items={categorys}
                        OnPress={(i, categoryId) => {
                            const {dispatch} = this.props;
                            this.GlobalDatas.CategoryId = categoryId;
                            //取消编辑
                            this.isEdit = false;
                            this._Bottom.onChangeState(false);
                            //发送请求
                            this._page = 1;
                            dispatch(ActionAlwaysBuy(0, categoryId));
                        }}/>
        }
    }

    // content() {
    //
    //     if (!this.props.ReduceLoaderAlwaysBuy.datas||this.props.ReduceLoaderAlwaysBuy.datas.Categorys.length <= 0) {
    //         this.noRecord('暂无商品')
    //        // return false;
    //     }
    //
    //     return (
    //         <View style={[styles.noNontent,gs.bgc_fff, {flex: 1}]}>
    //             {
    //                 this.state.dataSource.length ?
    //                     <View style={[{
    //                         width: deviceWidth,
    //                         height:deviceHeight - (Platform.OS === 'ios' ? px2dpH(65) : px2dpH(45))
    //                     }]}>
    //                         <FlatList
    //                             initialNumToRender={7}
    //                             //ListFooterComponent={this.renderFooter.bind(this)}
    //                             data={this.state.dataSource}
    //                             renderItem={this.renderRow.bind(this)}
    //                             ref={(ref) => {
    //                                 this._FlatList = ref;
    //                             }}
    //                             keyExtractor={this.keyExtractor.bind(this)}
    //                             onRefresh={this.onRefersh.bind(this)}
    //                             refreshing={false}
    //                             onEndReached={this.onEndReached.bind(this)}
    //                             onEndReachedThreshold={0.2}
    //                         />
    //                     </View> :
    //                     this.noRecord('暂无商品')
    //             }
    //         </View>
    //     )
    // }

    renderRow(data) {
        const {dispatch} = this.props;
        let product = data.item;
        let Specs0 = product.Specs[0];
        let sCompanyId = Specs0.CompanyId;
        let productId = product.ProductId
        return <Dl
            ref={(d) => {
                product.Specs.map((item)=>{
                    this._Dls[sCompanyId + '-' + productId + '-' + item.SpecId] = d;
                })
            }}
            product={product}
            dispatch={dispatch}
            isEdit={this.isEdit}
            IsSelect={this.isSelectAll}
            OnSelect={(isSelect, productId) => {
                if (isSelect) {
                    //加入ProductGlobalIds
                    if (!this.ProductGlobalIds.includes(productId)) {
                        this.ProductGlobalIds.push(productId)
                    }
                    //所有数据的长度
                    var i=0;
                    Object.keys(this._Dls).forEach(() => {
                        i++;
                    });
                    //是否全选了 如果全选了 改变底部
                    if (this.ProductGlobalIds.length == i) {
                        this._Bottom.isSelect = isSelect;
                        this._Bottom._CheckBox.OnChange(isSelect);
                    }
                }
                else {
                    //检出ProductGlobalIds
                    let index = this.ProductGlobalIds.findIndex(id => id == productId);
                    if (index >= 0) {
                        this.ProductGlobalIds.splice(index, 1)
                    }
                    //改变全选了
                    if (this._Bottom.isSelect) {
                        this._Bottom.isSelect = isSelect;
                        this._Bottom._CheckBox.OnChange(isSelect);
                    }
                }
            }}
            OnPressCalculate={(type, quantity, shoppingCartId, _Product, specId) => {
                this._Loading.Trigger(true);

                if (quantity) {
                    fetchInsertOrUpdateShoppingCart({
                        CompanyId: sCompanyId,
                        ProductGlobalId: productId,
                        SpecId: specId,
                        ShoppingCartId: shoppingCartId,
                        ProductType: 0,
                        Quantity: quantity
                    }).then((ret) => {
                        if (ret.data) {
                            _Product.state.shoppingCartId = ret.data.ShoppingCartId;


                            //更新购物车
                            //this.updataCart(product.ProductId, specId, quantity, ret.data.ShoppingCartId)
                        }
                        else if (ret.error) {
                            this.onRefersh();
                            toastShort(ret.error.messages)
                        }

                        this._Loading.Trigger(false);
                    }).catch((e) => {
                        this.onRefersh();
                        this._Loading.Trigger(false);
                    });
                }
                else {
                    fetchDeleteShoppingCarts([shoppingCartId]).then((ret) => {
                        if (!ret.data) {
                            //更新购物车
                            //this.updataCart(product.ProductId, specId, quantity, shoppingCartId);
                        }
                        else if (ret.error) {
                            this.onRefersh();
                            toastShort(ret.error.messages)
                        }

                        this._Loading.Trigger(false);
                    }).catch((e) => {
                        this.onRefersh();
                        this._Loading.Trigger(false);
                    });
                }

                //更新购物车
                dispatch(ActionShoppingCarts());
            }}
            ToPush={(productGlobalId, companyId, productType, isActive) => {
                this.push('ProductDetail', {
                    productGlobalId,
                    companyId,
                    productType,
                    fromIndex:0,
                    isActive,
                    callBack: this.refeshView.bind(this)
                });
            }}
        />
    }

    Bottom() {
        const {dispatch} = this.props;
        return (
            <Bottom
                style={{position:'absolute',bottom:0,right:0,zIndex:50}}
                ref={(b) => {
                    this._Bottom = b
                }}

                pushCart={()=>{this.push('Cart',{pageForm:'Home'})}}

                isEdit={false}
                OnSelectAll={(isSelect) => {
                    this.isSelectAll = isSelect;
                    Object.keys(this._Dls).forEach((id) => {
                        let productDl = this._Dls[id];
                        if (productDl) {
                            if (productDl.isSelect != isSelect) {
                                productDl.onChangeSelect(isSelect);
                                productDl.props.OnSelect(isSelect, id)
                                //productDl.props.OnSelect(isSelect, productDl.props.product.ProductId)
                            }
                        }
                    });
                }}
                OnDelete={() => {
                    fetchDeleteAlwaysBuyProduct(this.ProductGlobalIds).then((ret) => {

                        if (ret.data == null) {
                            this.onRefersh();

                        }
                        else {
                            this.onRefersh();
                            toastShort(JSON.stringify(ret.data))
                        }
                        //删除总类
                        let Categorys=this.props.ReduceLoaderAlwaysBuy.datas.Categorys;
                        if(this.isSelectAll) {
                                for(var cat in Categorys){
                                   if(Categorys[cat].IsSelect){
                                       Categorys.splice(cat,1);
                                       if(Categorys.length>0){
                                           Categorys[0].IsSelect=true;
                                           dispatch(ActionAlwaysBuy(0, Categorys[0].CategoryId));
                                       }
                                       break;
                                   }
                                }
                             }
                    }).catch((e) => {
                        //toastShort(JSON.stringify(e))
                    });

                }}
            />
        )
    }

    WillMount() {
        const {dispatch} = this.props;
        dispatch(ActionLoaderAlwaysBuy());
    }

    /*componentDidUpdate() {
        if (this.isEdit) {
            Object.keys(this._Dls).forEach((id) => {
                let productDl = this._Dls[id];
                if (productDl) {
                    productDl.onChangeState(this.isEdit);
                }
            });
        }
    }*/

    //初始化数据
    WillReceive(nextProps) {
        //2个入口进入该页面 区分高度
        let heightAndroid = 155;
        let heightios = deviceHeight > 700 ? 205 : 160;
        if(this.params&&this.params.enterType==1){
            heightAndroid = 105;
            heightios = deviceHeight > 700 ? 165 : 120;
        }



        if (nextProps.ReduceLoaderAlwaysBuy.datas != null && nextProps.ReduceLoaderAlwaysBuy.datas != this.props.ReduceLoaderAlwaysBuy.datas) {
            const {ReduceLoaderAlwaysBuy} = nextProps;

            if (ReduceLoaderAlwaysBuy.datas.Categorys.length <= 0) {
                this.setState({
                    IsReceived: true
                });
                return false;
            }

            this.GlobalDatas.Categorys = ReduceLoaderAlwaysBuy.datas.Categorys;
            this.GlobalDatas.CategoryId = ReduceLoaderAlwaysBuy.datas.Categorys[0].CategoryId;
            let products = ReduceLoaderAlwaysBuy.datas.Products;

            this.setState({
                IsReceived: true,
                dataSource: products,
                FlatListHeight: deviceHeight - (Platform.OS === 'ios' ? px2dpH(heightios) : px2dpH(heightAndroid))
            });
        } else if (nextProps.ReduceLoaderAlwaysBuy.error != null && nextProps.ReduceLoaderAlwaysBuy.error != this.props.ReduceLoaderAlwaysBuy.error) {

            this.setState({
                IsReceived: true,
                dataSource: [],
                FlatListHeight: deviceHeight - (Platform.OS === 'ios' ? px2dpH(heightios) : px2dpH(heightAndroid))
            });
        }
        if (nextProps.ReduceAlwaysBuy.datas != null && nextProps.ReduceAlwaysBuy.datas != this.props.ReduceAlwaysBuy.datas) {
            const {ReduceAlwaysBuy} = nextProps;
            let products = ReduceAlwaysBuy.datas.Products;
            let dataSource = this.state.dataSource;
            if (this._page > 1) {
                products.map((product) => {
                    dataSource.push(product)
                })
            }
            else {
                dataSource = products;
            }
            this.setState({
                IsReceived: true,
                dataSource: dataSource,
                FlatListHeight: deviceHeight - (Platform.OS === 'ios' ? px2dpH(heightios) : px2dpH(heightAndroid))
            });
        }
    }
}

const styles = StyleSheet.create({
    main: {
        flex: 1
    },

    content: {
        flex: 1,
        borderTopWidth: 1,
        paddingBottom: px2dp(40),
        minHeight: deviceHeight + 1,
        borderTopColor: '#e3e3e3'
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
    listItem: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        paddingTop: px2dp(12),
        paddingRight: px2dp(12),
        marginBottom: px2dp(12),
    },
    productImg: {
        width: px2dp(60),
        height: px2dp(60),
        marginRight: px2dp(8),
        marginLeft: px2dp(14),
    },
    productImg1: {
        width: px2dp(60),
        height: px2dp(60),
        marginRight: px2dp(8),
    },
    productImg2: {
        width: px2dp(60),
        height: px2dp(60),
        marginRight: px2dp(8),
        marginLeft: px2dp(46)
    },
    listItemRight: {
        flex: 1,
    },
    listItemRightTop: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: 'center',
    },
    listDetail: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: 'center',
        height: px2dp(22)
    },
    listDetailRight: {
        flexDirection: "row",
        alignItems: 'center',
    },

    dt: {
        flexDirection: "row",
        flexWrap: 'nowrap',
        alignItems: 'center',
        height: px2dp(29),
        paddingLeft: px2dp(18)
    },

    actIcon: {
        width: px2dp(15),
        height: px2dp(15),
        marginLeft: px2dp(7),
    },

    spec: {
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'center',
    },

    company: {
        height: px2dp(29),
        marginLeft: px2dp(14),
        borderTopWidth: 1,
        borderTopColor: '#e3e3e3',
        justifyContent: 'center',
    },

    footer: {
        width: '100%',
        height: px2dp(46),
        position: 'absolute',
        bottom: 0,
        left: 0,
        flexDirection: 'row',
        backgroundColor: '#fff',
        paddingLeft: px2dp(12),
        alignItems: 'center',
        borderTopWidth:.5,
        borderTopColor: '#e3e3e3',
    },
    delete: {
        width: px2dp(94),
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        right: 0
    },
    footerWrap: {
        width: '100%',
        height: px2dp(45),
        backgroundColor:'#fff',
        borderTopWidth:1,
        borderTopColor:'#ccc',
        position: 'absolute',
        bottom: 0,
        left: 0,
        flexDirection:'row',
        justifyContent: 'flex-end',
        zIndex: 100
    },
    car: {
        width: px2dp(94),
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#00c164"
    },
});

function mapStateToProps(store) {
    return {
        ReduceLoaderAlwaysBuy: store.ReduceLoaderAlwaysBuy,
        ReduceAlwaysBuy: store.ReduceAlwaysBuy
    }
}

const connectProviders = connect(mapStateToProps)(AlwaysBuy);
connectProviders.navigationOptions = NavigationOptions;
export default connectProviders;
