import React, {Component} from "react";
import {ScrollView, StyleSheet, TextInput, View, ListView, FlatList, Platform} from "react-native";
import PageComponent from "../../PageComponent";
import {
    BCHostImage,
    BCImage,
    BCText,
    BCTouchable,
    deviceWidth,
    NavigationOptions,
    px2dp,
    substr,
    deviceHeight,
    deepCopy
} from "../../../BaseComponent";
import gs from "../../../styles/MainStyles";
import {connect} from "react-redux";
import {ActionLoadReplenishProducts, ActionReplenishProducts} from '../../../actions/ProductAction';
import {
    ActionInsertOrUpdateShoppingCart, ActionDeleteShoppingCarts, UpdateCar, ActionShoppingCarts
} from '../../../actions/ShoppingCartAction';
import {fetchDeleteShoppingCarts, fetchInsertOrUpdateShoppingCart} from '../../../services/ShoppingCartServices';
import {toastShort} from '../../../utils/ToastUtil';
import {toDecimal2} from '../../../utils/FormatUtil';

import {Calculate} from '../../../components/Calculate';
import ShoppingCartBar from '../../../components/ShoppingCartBar';
import Tab, {VerticalTab} from '../../../components/Tab';

class ShoppingCartLists extends Component {
    _Product = {};

    static defaultProps = {
        ListsItems: [],
        _products: {}
    };
    static propTypes = {
        Cancle: React.PropTypes.func,
        OnClearData: React.PropTypes.func,
        ListsItems: React.PropTypes.array,
        OnCount: React.PropTypes.func
    }

    constructor(props) {
        super(props);
        this.state = {
            IsShow: false,
            listsItems: props.ListsItems,
            _products: props._products,
            _Dls: props._Dls
        }
    }

    Trigger(v) {
        this.setState({
            IsShow: v
        })
    }

    //清空
    onClearAll() {
        this.setState(() => {
            this.props.ClearAll()
        });
    }

    //items
    SetListsItems(items) {
        this.setState({
            ListsItems: items
        })
    }

    //购物车列表
    renderCartList(item, index) {
        return (
            <View style={[styles.cartItem]} key={item.ProductName + index}>
                <BCText>
                    <BCText style={[gs.fts_15, gs.c_3a3838]}>{substr(item.ProductName, 8)}</BCText>
                    <BCText style={[gs.fts_12, gs.c_888]}>/{substr(item.SpecName, 7)}</BCText>
                </BCText>
                <View style={[styles.cartItemRight]}>
                    <BCText style={[styles.cartItemPrice, gs.fts_13, gs.c_fd0319]}>￥{toDecimal2(item.Price)}</BCText>
                    <Calculate
                        ref={(c) => {
                            this._Product = c;
                        }}
                        ProductId={item.ProductGlobalId}
                        Quantity={item.Quantity}
                        SpecId={item.SpecId}
                        shoppingCartId={item.ShoppingCartId}
                        OnChange={(type, quantity, shoppingCartId) => {
                            /*if (!this.state._Dls[item.ProductGlobalId].state.IsOpen) {
                             const _product = this.state._products[item.ProductGlobalId + '-' + item.SpecId];
                             if (type == 'add') {
                             _product.onAdd()
                             }
                             else if (type == 'reduce') {
                             _product.onReduce()
                             }
                             else if (type == 'input') {
                             _product.onInput(num)
                             }
                             }
                             else {
                             this.props.OnCount(type, quantity, shoppingCartId, item.SpecId, item.Price, item.ProductGlobalId)
                             }*/

                            this.props.OnCount(type, quantity, shoppingCartId, item.ProductGlobalId, item.SpecId, item.Price, item.SpecName, item.ProductName, item.DisplayUnitTypeId, item.UnitAmount)
                        }}/>
                </View>
            </View>
        )
    }

    render() {
        return (
            this.state.IsShow ?
                <View style={[styles.cartList]}>
                    <View style={[styles.cartHeader, gs.bgc_f2f1ef]}>
                        <BCText style={[gs.fts_13, gs.c_888]}>购物车</BCText>
                        <BCTouchable style={[styles.clearBtn]} onPress={() => this.onClearAll()}>
                            <BCImage style={[{width: px2dp(13), height: px2dp(14), marginRight: px2dp(7)}]}
                                     source={require('../../../imgs/delete.png')}/>
                            <BCText style={[gs.fts_13, gs.c_888]}>清空</BCText>
                        </BCTouchable>
                    </View>
                    <View style={[styles.cartContentWrap]}>
                        <ScrollView showsVerticalScrollIndicator={false}
                                    contentContainerStyle={[styles.cartContent, gs.bgc_fff]}>
                            {this.state.listsItems.map((item, i) => {
                                return this.renderCartList(item, i)
                            })}
                        </ScrollView>
                    </View>
                    <View style={[styles.cartFooter, gs.bgc_fff]}>
                        {/*<BCText style={[gs.fts_15, gs.c_888, {marginRight: px2dp(10)}]}>配送费</BCText>
                         <BCText style={[gs.fts_15, gs.c_fd0319]}>￥38.80</BCText>*/}
                    </View>
                </View>
                : null
        )
    }
}

class Dl extends Component {
    Init = 0
    _Products = {}

    static defaultProps = {
        item: {}
    };
    static propTypes = {
        item: React.PropTypes.object,
        OnPressCalculate: React.PropTypes.func,
        OnInit: React.PropTypes.func,
        IsOpen: React.PropTypes.bool
    }

    constructor(props) {
        super(props);
        this.state = {
            IsOpen: false,
            item: props.item
        }
    }

    //选规格View
    renderChooseSpecView() {
        return (
            <BCTouchable style={[styles.spec]} onPress={() => this.onSelectSpec()}>
                <BCText
                    style={[gs.fts_12, gs.c_888, {marginRight: px2dp(5)}]}>{this.state.IsOpen ? '选规格' : '收起'}</BCText>
                <BCImage style={[{width: px2dp(10), height: px2dp(8)}]}
                         source={require('../../../imgs/up.png')}/>
            </BCTouchable>
        )
    }

    //选择规格view
    renderSpecView(ProductId, productName) {
        return (
            !this.state.IsOpen ?
                this.state.item.Specs.map((obj, index) => {
                    if (index <= 0) {
                        return false
                    }
                    else {
                        let specName = obj.SpecName;
                        let price = obj.Price;
                        let unit = obj.Unit;
                        let priceStr = substr(toDecimal2(price) + '', 8) + '/' + unit;
                        let unitAmount = obj.UnitAmount;
                        let disPlayUnit = obj.DisplayUnit;
                        let displayUnitTypeId = obj.DisplayUnitTypeId;
                        if (displayUnitTypeId == 2) {
                            //priceStr += disPlayUnit;
                        } else {
                            //priceStr += unit;
                        }
                        return (
                            <View style={[gs.bgc_fff, styles.listItem2]}
                                  key={ProductId + '-' + obj.SpecId + '-' + index}>
                                <View style={styles.productImg}/>
                                <View style={{flex: 1}}>
                                    <BCImage style={[{width: px2dp(207)}]} source={require('../../../imgs/line.png')}/>
                                    <View style={styles.listItemRight}>
                                        <View style={[styles.listItemRightTop]}>
                                            <BCText style={[gs.c_3a3838, {marginTop: px2dp(8)}]}>
                                                {/*<BCText style={[gs.fts_12]}>￥</BCText>*/}
                                                <BCText style={[gs.fts_14]}>{specName}</BCText>
                                                {/*<BCText style={[gs.fts_14, {marginHorizontal: px2dp(4)}]}>/</BCText>
                                                 <BCText style={[gs.fts_13]}></BCText>*/}
                                            </BCText>
                                        </View>
                                        <View style={styles.listDetail}>
                                            <View style={[styles.listDetailRight]}>
                                                <BCText style={[gs.fts_13, gs.c_fd0319,]}>{priceStr}</BCText>
                                                {/*<BCImage style={[styles.actIcon]}
                                                 source={require('../../../imgs/drop.png')}/>*/}
                                            </View>
                                            <Calculate
                                                ref={(c) => {
                                                    this._Products[ProductId + '-' + obj.SpecId] = c;
                                                }}
                                                ProductId={ProductId}
                                                Quantity={obj.Quantity}
                                                SpecId={obj.SpecId}
                                                shoppingCartId={obj.ShoppingCartId}
                                                OnChange={(type, quantity, shoppingCartId) => {
                                                    //this.state.item.Specs[index].Quantity = quantity;
                                                    this._onPressCalculate(type, quantity, shoppingCartId, ProductId, obj.SpecId, obj.Price, obj.SpecName, productName, obj.DisplayUnitTypeId, obj.UnitAmount)
                                                }}/>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        )
                    }
                }) : null
        )
    }

    //选规格
    onSelectSpec() {
        this.setState({
            IsOpen: !this.state.IsOpen,
        });
    }

    _onPressCalculate(type, quantity, shoppingCartId, productId, SpecId, price, specName, productName, displayUnitTypeId, unitAmount) {
        this.props.OnPressCalculate({
            type, quantity, shoppingCartId,
            _Product: this._Products[productId + '-' + SpecId],
            SpecId, price, specName, productId, productName, displayUnitTypeId, unitAmount
        })
    }

    render() {
        const {dispatch} = this.props;

        let item = this.state.item;
        if (item.Specs.length <= 0) {
            return false
        }

        let Spec0 = item.Specs[0];
        let productName = substr(item.ProductName, 8);
        let productId = item.ProductId;
        let specName = Spec0.SpecName;
        let specId = Spec0.SpecId;
        let price = Spec0.Price;
        let quantity = Spec0.Quantity;

        let unit = Spec0.Unit;
        let priceStr = substr(toDecimal2(price) + '', 8) + '/' + unit;
        let unitAmount = Spec0.UnitAmount;
        let disPlayUnit = Spec0.DisplayUnit;
        let displayUnitTypeId = Spec0.DisplayUnitTypeId;
        if (displayUnitTypeId == 2) {
            //priceStr += disPlayUnit;
        } else {
            //priceStr += unit;
        }

        return (
            <View>
                <View style={[styles.listItem]}>
                    <BCTouchable onPress={() =>
                        this.props.GoProductDetail(item.ProductId)
                    }>
                        <BCHostImage style={styles.productImg}
                                     source={{uri: item.Image}}/>
                    </BCTouchable>
                    <View style={styles.listItemRight}>
                        <View style={[styles.listItemRightTop]}>
                            <BCText style={[gs.fts_15, gs.c_3a3838]}>
                                {productName}
                            </BCText>
                            {this.props.IsOpen ? this.renderChooseSpecView() : null}
                        </View>
                        <BCText style={[gs.fts_13, gs.c_3a3838]}>{specName}</BCText>
                        <View style={styles.listDetail}>
                            <View style={[styles.listDetailRight]}>
                                <BCText style={[gs.c_fd0319, {width: px2dp(100)}]}>
                                    <BCText style={[gs.fts_13]}>¥{priceStr}</BCText>
                                </BCText>
                                {/*<BCImage style={[styles.actIcon]} source={require('../../../imgs/drop.png')}/>*/}
                            </View>
                            <Calculate
                                ref={(c) => {
                                    this._Products[item.ProductId + '-' + item.Specs[0].SpecId] = c;
                                }}
                                Quantity={quantity}
                                ProductId={productId}
                                SpecId={specId}
                                shoppingCartId={Spec0.ShoppingCartId}
                                OnChange={(type, quantity, shoppingCartId) => {
                                    this._onPressCalculate(
                                        type, quantity, shoppingCartId,
                                        productId, specId, price, specName,
                                        item.ProductName, displayUnitTypeId, unitAmount
                                    )
                                }}/>
                        </View>
                    </View>
                </View>
                {this.props.IsOpen ? this.renderSpecView(item.ProductId, item.ProductName) : null}
            </View>
        )
    }

    componentDidMount() {
        if (this.props.item.Specs.length <= 0) {
            return false
        }
        if (this._Products) {
            this.props.OnInit(this._Products)
        }
    }

    componentDidUpdate() {
        if (!this.state.IsOpen) {
            this.props.OnInit(this._Products);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.item != null && nextProps.item !== this.props.item) {
            this.setState({
                item: nextProps.item
            })
        }
    }
}

class ReplenishProducts extends PageComponent {
    _page = 1
    _Products = {}
    _ShoppingCartBar = null
    _ShoppingCartLists = null
    _FlatList = null
    _Tab = null
    _VerticalTab = null
    GlobalDatas = {}
    Carts = []
    _Dls = {}
    existDl = {}
    whenError = false

    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
        }
        this.ParentCategoryId = 0;
        this.CategoryId = 0;
    }

    isShowSearchBar() {
        return true
    }

    //点击搜索
    goSearch() {
        this.push('SearchPageProducts', {
            productType: 0,
            sCompanyId: this.GlobalDatas.sCompanyId,
            priceGroupId: this.GlobalDatas.Provider.PriceGroupId,
            callBack: this.refeshView.bind(this)
        })
    }

    //返回回调
    onBack() {
        const {dispatch} = this.props;
        //更新购物车
        dispatch(ActionShoppingCarts());
    }

    //公司信息
    renderCompany(bCompanyId, sCompanyId, provider) {
        let text = null;
        if (provider.StartQuantity) {
            text = '起送量 : ' + provider.StartQuantity + '   达到起送量免配送费'
        }
        else if (provider.StartPrice) {
            text = '起送价' + provider.StartPrice + '元   达到起送价免配送费'
        }
        else {
            text = '免配送费'
        }

        return (
            <View style={gs.bgc_fff}>
                <View style={[styles.company]}>
                    <BCHostImage style={styles.companyImg}
                                 source={{uri: provider.LogoImage}}/>
                    <View style={styles.companyContent}>
                        <BCText style={[gs.fts_16, gs.c_3a3838,{width:deviceWidth-px2dp(90),paddingRight:px2dp(7)}]} >{provider.CompanyName}</BCText>
                        <BCText style={[gs.fts_14, gs.c_888,]}>主营: {provider.MainType}</BCText>
                        <View style={styles.delivery}>
                            <View><BCText style={[gs.fts_14, gs.c_888,]}>{text}</BCText></View>
                            <BCTouchable style={styles.companyDetail}
                                         onPress={() => {
                                             this.push('CompanyDetial', {bCompanyId:0, sCompanyId ,from:1})
                                         }}>
                                <BCText style={[gs.fts_14, gs.c_00C164,]}>详情</BCText>
                                <BCImage style={styles.companyDetailBg}
                                         source={require('../../../imgs/right.png')}/>
                            </BCTouchable>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    //主分类
    renderCategory(categorys) {
        return (
            <Tab
                ref={(t) => {
                    this._Tab = t
                }}
                Items={categorys}
                OnPress={(i, categoryId) => {
                    const {dispatch} = this.props;
                    let GlobalDatas = this.GlobalDatas;

                    GlobalDatas.ParentCategoryId = categoryId;
                    GlobalDatas.CategoryId = GlobalDatas.ParentCategorys[i].Items[0].CategoryId;

                    let category = GlobalDatas.ParentCategorys;
                    let childCategorys = GlobalDatas.ChildCategorys;

                    this._VerticalTab.state.Items = GlobalDatas.ParentCategorys[i].Items;
                    this._VerticalTab.reLoad();
                    this._page = 1;
                    dispatch(ActionReplenishProducts({
                        productType: 2,
                        sCompanyId: GlobalDatas.sCompanyId,
                        parentCategoryId: categoryId,
                        priceGroupId: GlobalDatas.Provider.PriceGroupId,
                        categoryId: GlobalDatas.CategoryId
                    }));
                }}/>
        )
    }

    //主要内容
    renderContent(childCategory) {
        return (
            <View style={[styles.content]}>
                {this.renderSecondCategory(childCategory)}
                {this.renderList()}
            </View>
        )
    }

    //二级分类
    renderSecondCategory(categoryArray) {
        return (
            <VerticalTab Items={categoryArray}
                         ref={(v) => {
                             this._VerticalTab = v
                         }}
                         OnPress={(i, categoryId, pid) => {
                             const {dispatch} = this.props;
                             let GlobalDatas = this.GlobalDatas;
                             GlobalDatas.ParentCategoryId = pid;
                             GlobalDatas.CategoryId = categoryId;

                             let childCategorys = GlobalDatas.ChildCategorys;

                             this._page = 1;
                             dispatch(ActionReplenishProducts({
                                 productType: 2,
                                 sCompanyId: GlobalDatas.sCompanyId,
                                 priceGroupId: GlobalDatas.Provider.PriceGroupId,
                                 parentCategoryId: pid,
                                 categoryId: categoryId
                             }));
                         }}/>
        )
    }

    //商品列表
    renderList() {
        return (
            <View style={[styles.lists, gs.bgc_fff]}>
                {
                    this.state.dataSource.length ?
                        <FlatList
                            initialNumToRender={5}
                            ListFooterComponent={this.renderFooter.bind(this)}
                            data={this.state.dataSource}
                            renderItem={this.renderItem.bind(this)}
                            ref={(ref) => {
                                this._FlatList = ref;
                            }}
                            keyExtractor={this.keyExtractor.bind(this)}
                            onRefresh={this.onRefersh.bind(this)}
                            refreshing={false}
                            onEndReached={this.onEndReached.bind(this)}
                        /> : this.noRecord('暂无商品')
                }
            </View>
        )
    }
/*/> : this.noRecord(this.GlobalDatas.ParentCategorys.length ? '暂无商品' : '请绑定分类', gs.bgc_fff)*/
    //商品列表Item
    renderItem(rowData) {
        let {Provider} = this.GlobalDatas;
        const {dispatch} = this.props;
        let item = rowData.item;
        return <Dl
            ref={(d) => {
                this._Dls[item.ProductId] = d;
            }}
            item={item}
            dispatch={dispatch}
            IsOpen={(item.Specs.length > 1) ? true : false}
            OnInit={(_Product) => {
                Object.assign(this._Products, _Product)
            }}
            OnPressCalculate={(parmasObj) => {
                //parmasObj = {type, quantity, shoppingCartId, _Product, productId, SpecId, price, specName,productName,displayUnitTypeId,unitAmount}
                if (parmasObj._Product) {
                    if (!this._Products[parmasObj.productId + '-' + parmasObj.SpecId]) {
                        this._Products[parmasObj.productId + '-' + parmasObj.SpecId] = _Product;
                    }
                }

                //如果遮罩层开启,不开启转转转
                if (!this._ShoppingCartLists.state.IsShow) {
                    //this._Loading.Trigger(true);
                }

                if (parmasObj.quantity) {
                    /*dispatch(ActionInsertOrUpdateShoppingCart({
                     CompanyId: item.CompanyId,
                     ProductGlobalId: item.ProductId,
                     SpecId: SpecId,
                     ShoppingCartId: shoppingCartId,
                     ProductType: 0,
                     Quantity: quantity
                     }));*/
                    fetchInsertOrUpdateShoppingCart({
                        CompanyId: item.CompanyId,
                        ProductGlobalId: parmasObj.productId,
                        SpecId: parmasObj.SpecId,
                        ShoppingCartId: parmasObj.shoppingCartId,
                        ProductType: 2,
                        Quantity: parmasObj.quantity
                    }).then((ret) => {
                        if (ret.data) {
                            let data = ret.data;
                            let ShoppingCartId = data.ShoppingCartId;
                            let productId = data.ProductGlobalId;
                            let specId = data.SpecId;

                            if (this._Dls[productId]) {
                                let Specs = this._Dls[productId].state.item.Specs;
                                let index = Specs.findIndex(item => item.SpecId == specId);
                                Specs[index].Quantity = data.Quantity;
                            }

                            //更新ShoppingCartId 如果页面上存在,进行更新,else
                            let product = this._Products[productId + '-' + specId];
                            if (product && product.state.shoppingCartId == 0) {
                                product.state.shoppingCartId = ShoppingCartId;
                            }

                            //更新shoppingCartBar的数据
                            this._ShoppingCartBar.SetTotalCount(parmasObj.type, ProductObj = {
                                Price: parmasObj.price,
                                ProductName: parmasObj.productName,
                                CompanyId: item.CompanyId,
                                ProductGlobalId: parmasObj.productId,
                                Quantity: parmasObj.quantity,
                                SpecId: parmasObj.SpecId,
                                EmployeeId: 1,
                                ShoppingCartId: parmasObj.shoppingCartId,
                                SpecName: parmasObj.specName,
                                DisplayUnitTypeId: parmasObj.displayUnitTypeId,
                                UnitAmount: parmasObj.unitAmount
                            }, parmasObj._Product)

                            //更新购物车
                            //dispatch(ActionShoppingCarts());
                            //this.updateCart(productId, specId, ShoppingCartId);
                        }
                        else {
                            //toastShort('请刷新试试')
                            //刷新页面
                            //this.onRefersh();
                        }

                        //this._Loading.Trigger(false);
                    }).catch((e) => {
                        //this._Loading.Trigger(false);
                        //刷新页面
                        this.onRefersh();
                    });
                }
                else {
                    //dispatch(ActionDeleteShoppingCarts([shoppingCartId]));
                    fetchDeleteShoppingCarts([parmasObj.shoppingCartId]).then((ret) => {
                        if (!ret.data) {
                            let product = this._Products[parmasObj.productId + '-' + parmasObj.SpecId];
                            product.state.shoppingCartId = 0;

                            let productId = parmasObj.productId ;
                            if (this._Dls[productId]) {
                                let Specs = this._Dls[productId].state.item.Specs;
                                let index = Specs.findIndex(item => item.SpecId == specId);
                                Specs[index].Quantity =0;
                            }

                            //更新shoppingCartBar的数据
                            this._ShoppingCartBar.SetTotalCount(parmasObj.type, ProductObj = {
                                Price: parmasObj.price,
                                ProductName: parmasObj.productName,
                                CompanyId: item.CompanyId,
                                ProductGlobalId: parmasObj.productId,
                                Quantity: parmasObj.quantity,
                                SpecId: parmasObj.SpecId,
                                EmployeeId: 1,
                                ShoppingCartId: parmasObj.shoppingCartId,
                                SpecName: parmasObj.specName,
                                DisplayUnitTypeId: parmasObj.displayUnitTypeId,
                                UnitAmount: parmasObj.unitAmount
                            }, parmasObj._Product)

                            //更新购物车
                            dispatch(ActionShoppingCarts());
                            //this.updateCart(parmasObj.productId, parmasObj.SpecId, 0);
                        }
                        else if (ret.error) {
                            toastShort(ret.error.messages);
                            //刷新页面
                            this.onRefersh();
                        }

                        //this._Loading.Trigger(false);
                    }).catch((e) => {
                        //this._Loading.Trigger(false);
                        //刷新页面
                        this.onRefersh();
                    });
                }
            }}
            GoProductDetail={(productGlobalId) => {
                this.push('ProductDetail', {
                    productGlobalId,
                    companyId: item.CompanyId,
                    productType: 2,
                    isActive: true,
                    callBack: this.refeshView.bind(this),
                    freeDistance:Provider.FreeDistance,
                });
            }}/>
    }

    renderFooter() {
        return (
            <View style={[{height: px2dp(58)}]}></View>
        )
    }

    //商品列表Item key
    keyExtractor(item, index) {
        return item.ProductId + '-' + index
    }

    //刷新
    onRefersh() {
        const {dispatch} = this.props;
        let GlobalDatas = this.GlobalDatas;

        //关闭mask和maskContent
        this._Loading.Trigger(false);
        this._Maks.Trigger(false);
        this._ShoppingCartLists.Trigger(false);

        this._page = 1;
        dispatch(ActionReplenishProducts({
            productType: 2,
            sCompanyId: GlobalDatas.sCompanyId,
            priceGroupId: GlobalDatas.Provider.PriceGroupId,
            parentCategoryId: GlobalDatas.ParentCategoryId,
            categoryId: GlobalDatas.CategoryId
        }));
    }

    refeshView() {
        this.onRefersh();
    }

    //加载更多
    onEndReached(end) {
        const {dispatch} = this.props;
        let GlobalDatas = this.GlobalDatas;
        dispatch(ActionReplenishProducts({
            productType: 2,
            sCompanyId: GlobalDatas.sCompanyId,
            priceGroupId: GlobalDatas.Provider.PriceGroupId,
            parentCategoryId: GlobalDatas.ParentCategoryId,
            categoryId: GlobalDatas.CategoryId,
            p: ++this._page
        }));
    }

    //更新购物车
    updateCart(productId, specId, type) {
        const {dispatch} = this.props;

        //更新购物车
        let InsertProduct = this._Dls[productId].state.item;
        let Specs = InsertProduct.Specs
        let index = Specs.findIndex(item => item.SpecId == specId);

        let InsertProducts = {
            company: this.GlobalDatas.Provider,
            products: deepCopy(InsertProduct),
            Type: 2,
            sCompanyId: this.GlobalDatas.sCompanyId
        }
        InsertProducts.products.Specs = [Specs[index]];
        if (type) {
            InsertProducts.products.Specs[0].ShoppingCartId = type;
        }
        else {
            InsertProducts.products.Specs[0].Quantity = 0;
        }
        dispatch(UpdateCar(InsertProducts))

    }

    //选规格
    onSelectSpec(i) {
        let data = this.products;
        data.map((item, index) => {
            if (i == index) {
                data[index].specState = !data[index].specState;
            }
        })
        this.setState({data: data})
    }

    //弹窗
    maksContent() {
        const {dispatch} = this.props;
        let Carts = this.Carts;
        return (
            <ShoppingCartLists
                ref={(ref) => this._ShoppingCartLists = ref}
                dispatch={dispatch}
                OnCount={(type, quantity, shoppingCartId, productId, SpecId, price, specName, productName, displayUnitTypeId, unitAmount) => {
                    const _dl = this._Dls[productId];
                    if (_dl) {
                        if (!_dl.state.IsOpen) {
                            const _product = this._Products[productId + '-' + SpecId];
                            if (type == 'add') {
                                _product.onAdd()
                            }
                            else if (type == 'reduce') {
                                _product.onReduce()
                            }
                            else if (type == 'input') {
                                _product.onInput(quantity)
                            }
                        }
                        else {
                            _dl.props.OnPressCalculate({
                                type, quantity, shoppingCartId,
                                _Product: this._Products[productId + '-' + SpecId],
                                SpecId, price, productId, specName, productName, displayUnitTypeId, unitAmount
                            });
                        }
                    }
                    else {
                        let productDl = this.existDl;
                        if (!productDl) {
                            Object.keys(this._Dls).forEach((id) => {
                                if (this._Dls[id]) {
                                    productDl = this._Dls[id];
                                    return null;
                                }
                            });
                        }

                        productDl.props.OnPressCalculate({
                            type, quantity, shoppingCartId,
                            _Product: null, SpecId, price, productId, specName,
                            productName, displayUnitTypeId, unitAmount
                        });
                    }
                }}
                ClearAll={() => {
                    let Items = this._ShoppingCartBar.state.Items;
                    let shoppingCartIds = [];
                    Items.map((item, index) => {
                        shoppingCartIds.push(item.ShoppingCartId)
                    })
                    fetchDeleteShoppingCarts(shoppingCartIds).then((ret) => {
                        if (ret.data === null) {
                            /*//所有商品shoppingCartId置0
                             Object.keys(this._Products).forEach((id) => {
                             let productDl = this._Products[id];
                             if (productDl) {
                             productDl.state.shoppingCartId = 0;
                             }
                             })*/

                            //清空_ShoppingCartLists,_ShoppingCartBar数据
                            this._ShoppingCartLists.state.listsItems = [];
                            this._ShoppingCartBar.setState({
                                totalCount: 0,
                                Items: [],
                                totalPrice: 0,
                            })
                            //关闭弹窗
                            this._Maks.Trigger(false);
                            this._ShoppingCartLists.Trigger(false);
                            //刷新页面
                            this.onRefersh();
                            toastShort('清空成功');
                        }
                        else if (ret.error) {
                            toastShort(JSON.stringify(ret.error.messages));
                            //刷新页面
                            this.onRefersh();
                        }
                    }).catch((e) => {
                        //刷新页面
                        this.onRefersh();
                    });
                }}/>
        )
    }

    //shoppingCartBar
    Bottom() {
        let Carts = this.Carts;
        let totalCount = 0;
        let totalPrice = 0;
        Carts.map((item, index) => {
            totalCount += item.Quantity;
            if (item.DisplayUnitTypeId == 2) {
                totalPrice += item.Quantity * item.Price * item.UnitAmount
            }
            else {
                totalPrice += item.Quantity * item.Price
            }

        });

        return (
            <ShoppingCartBar
                ref={(s) => {
                    this._ShoppingCartBar = s;
                }}
                TotalCount={totalCount}
                TotalPrice={toDecimal2(totalPrice) * 1}
                DeliveryAmount={this.GlobalDatas.Provider.DeliveryAmount}
                StartPrice={this.GlobalDatas.Provider.StartPrice}
                StartQuantity={this.GlobalDatas.Provider.StartQuantity}
                Items={Carts}
                OnBuy={() => {
                    const {dispatch} = this.props;
                    //更新购物车
                    dispatch(ActionShoppingCarts());

                    this._ShoppingCartLists.Trigger(false);
                    this._Maks.Trigger(false);
                    this.push('Cart', {pageFrom: 'PrductList'})
                }}
                OnListsItemsChange={(items) => {
                    if (!items.length) {
                        this._Maks.Trigger(false);
                        this._ShoppingCartLists.Trigger(false);
                    }
                    //this._Maks.Trigger(true);
                    //this._ShoppingCartLists.Trigger(true);
                    this._ShoppingCartLists.SetListsItems(items);
                }}
                closeMask={() => {
                    this._Loading.Trigger(false);
                    this._Maks.Trigger(false);
                    this._ShoppingCartLists.Trigger(false);
                }}
                OnOpenMask={(totalCount, items, _products) => {
                    if (!totalCount && !items && !_products) {
                        this._ShoppingCartLists.Trigger(!this._ShoppingCartLists.state.IsShow);
                        this._Maks.Trigger(!this._Maks.state.IsShow);
                        return false;
                    }
                    Object.assign(this._Products, _products);
                    if (totalCount) {
                        items.map((item, index) => {
                            if (!item.ShoppingCartId) {
                                item.ShoppingCartId = this._Products[item.ProductGlobalId + '-' + item.SpecId].state.shoppingCartId;
                            }
                        })

                        //给_ShoppingCartLists传输数据
                        if (!this._ShoppingCartLists.state.IsShow) {
                            this._ShoppingCartLists.state.listsItems = items;
                            this._ShoppingCartLists.state._Dls = this._Dls;
                            this._ShoppingCartLists.state._products = this._Products;
                        }
                        this._ShoppingCartLists.Trigger(!this._ShoppingCartLists.state.IsShow);
                        this._Maks.Trigger(!this._Maks.state.IsShow);

                        //记录一个存在的dl
                        Object.keys(this._Dls).forEach((id) => {
                            if (this._Dls[id]) {
                                this.existDl = this._Dls[id];
                                return null;
                            }
                        });
                    }
                }}/>
        )
    }

    //content
    content() {
        if (!this.props.ReduceLoadReplenishProducts.datas) {
            return (
                <View style={[styles.main, gs.bgc_f2f1ef]}>
                    {
                        this.noRecord('暂无商品')
                    }
                </View>
            )
        }
        else {
            let {bCompanyId, sCompanyId, Provider, ParentCategorys, ChildCategorys, Products} = this.GlobalDatas;
            return (
                <View style={[styles.main, gs.bgc_f2f1ef]}>
                    {this.renderCompany(bCompanyId, sCompanyId, Provider)}
                    {this.renderCategory(ParentCategorys)}
                    {this.renderContent(ChildCategorys)}
                </View>
            )
        }
    }

    WillMount() {
        const {dispatch} = this.props;
        const {sCompanyId} = this.params;
        dispatch(ActionLoadReplenishProducts({productType: 2, sCompanyId}));
    }

    //初始化数据
    WillReceive(nextProps) {
        if (nextProps.ReduceLoadReplenishProducts.datas != null && nextProps.ReduceLoadReplenishProducts.datas != this.props.ReduceLoadReplenishProducts.datas) {
            const {ReduceLoadReplenishProducts} = nextProps;
            const {bCompanyId, sCompanyId} = this.params;
            let {Categorys, Provider, Products, Carts} = ReduceLoadReplenishProducts.datas;
            if (Categorys.length) {
                Object.assign(this.GlobalDatas,
                    {
                        ParentCategorys: Categorys,
                        ChildCategorys: Categorys[0].Items,
                        Provider,
                        Products,
                        bCompanyId,
                        sCompanyId,
                        ParentCategoryId: Categorys[0].CategoryId,
                        CategoryId: Categorys[0].Items[0].CategoryId
                    });
            }
            else {
                Object.assign(this.GlobalDatas,
                    {
                        ParentCategorys: Categorys,
                        ChildCategorys: [],
                        Provider,
                        Products,
                        bCompanyId,
                        sCompanyId,
                        ParentCategoryId: null,
                        CategoryId: null
                    });
            }
            this.Carts = Carts;
            this.setState({
                IsReceived: true,
                dataSource: Products
            });
        }
        if (nextProps.ReduceReplenishProducts.datas != null && nextProps.ReduceReplenishProducts.datas != this.props.ReduceReplenishProducts.datas) {
            const {ReduceReplenishProducts} = nextProps;
            const products = ReduceReplenishProducts.datas.Products;
            const Carts = ReduceReplenishProducts.datas.Carts;
            this.Carts = Carts;

            let Products = this.GlobalDatas.Products;
            if (this._page > 1) {
                products.map((product) => {
                    Products.push(product)
                })
            }
            else {
                Products = products
            }

            Object.assign(this.GlobalDatas, {Products});

            this.setState({
                dataSource: Products,
            });
        }
        if (nextProps.ReduceInsertOrUpdateShoppingCart != null && nextProps.ReduceInsertOrUpdateShoppingCart.datas != this.props.ReduceInsertOrUpdateShoppingCart.datas) {
            const {dispatch} = this.props;

            const {ReduceInsertOrUpdateShoppingCart} = nextProps;
            let datas = ReduceInsertOrUpdateShoppingCart.datas;
            let ShoppingCartId = datas.ShoppingCartId;

            this._Loading.Trigger(false);

            let Specs = this._Dls[datas.ProductGlobalId].state.item.Specs
            let index = Specs.findIndex(item => item.SpecId == datas.SpecId);
            Specs[index].Quantity = datas.Quantity

            let product = this._Products[datas.ProductGlobalId + '-' + datas.SpecId];

            if (product && product.state.shoppingCartId == 0) {
                product.state.shoppingCartId = ShoppingCartId;
            }

            //更新购物车
            let InsertProduct = this._Dls[datas.ProductGlobalId].state.item;
            let InsertProducts = {
                company: this.GlobalDatas.Provider,
                products: deepCopy(InsertProduct),
                productType: 0,
                sCompanyId: this.GlobalDatas.sCompanyId
            }
            InsertProducts.products.Specs = [Specs[index]];
            InsertProducts.products.Specs[0].ShoppingCartId = ShoppingCartId;
            dispatch(UpdateCar(InsertProducts))
        }
        if (nextProps.ReduceInsertOrUpdateShoppingCart.error != null && nextProps.ReduceInsertOrUpdateShoppingCart.error !== this.props.ReduceInsertOrUpdateShoppingCart.error) {
            this._Loading.Trigger(false);
        }
        if (nextProps.ReduceDeleteShoppingCarts != null && nextProps.ReduceDeleteShoppingCarts.datas != this.props.ReduceDeleteShoppingCarts.datas) {
            const {ReduceDeleteShoppingCarts} = nextProps;

            if (ReduceDeleteShoppingCarts.datas.data === null) {
                this._Loading.Trigger(false);
            }
        }
    }
}

const styles = StyleSheet.create({
    main: {
        flex: 1
    },
    company: {
        flexDirection: 'row',
        padding: px2dp(12)
    },
    companyImg: {
        height: px2dp(74),
        width: px2dp(74)
    },
    companyContent: {
        justifyContent: "space-around",
        marginLeft: px2dp(12),
        paddingTop: px2dp(4),
        paddingBottom: px2dp(4)
    },
    companyDetail: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'center',
        alignItems: 'center',
    },
    delivery: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: deviceWidth - px2dp(110),
        alignItems: 'center'
    },
    companyDetailBg: {
        height: px2dp(13),
        width: px2dp(12),
        marginLeft: px2dp(4)
    },

    content: {
        flex: 1,
        borderTopWidth: 1,
        borderTopColor: '#e3e3e3',
        flexDirection: "row",
        flexWrap: 'nowrap',
    },

    secondCategory: {
        width: '26%',
    },
    secondCategoryItem: {
        width: px2dp(100),
        height: px2dp(40),
        justifyContent: 'center',
        alignItems: 'center'
    },

    lists: {
        width: '74%',
        //height: deviceHeight - (Platform.OS === 'ios' ? px2dp(65) : px2dp(45) ) - px2dp(30 + 74 + 24 + 66),
        flex: 1,
        paddingTop: px2dp(9),
    },
    listItem: {
        paddingLeft: px2dp(10),
        paddingRight: px2dp(12),
        marginBottom: px2dp(12),
        flexDirection: 'row',
        flexWrap: 'nowrap'
    },
    listItem2: {
        paddingLeft: px2dp(10),
        paddingRight: px2dp(12),
        flexDirection: 'row',
        flexWrap: 'nowrap',
        marginBottom: px2dp(8),
    },
    productImg: {
        width: px2dp(60),
        height: px2dp(60),
        marginRight: px2dp(8)
    },
    listItemRight: {
        flex: 1,
    },
    listItemRightTop: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: 'center',
        //marginBottom: px2dp(8),
    },
    listDetail: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: 'center',
        //height: px2dp(21),
        flex: 1
    },
    listDetailRight: {
        flexDirection: "row",
        alignItems: 'center',
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
        marginTop: px2dp(8),
    },

    cartList: {
        width: deviceWidth,
        zIndex: 1,
        position: 'absolute',
        bottom: px2dp(46),
        left: 0
    },
    cartHeader: {
        //width: '100%',
        height: px2dp(26),
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: px2dp(9),
        paddingRight: px2dp(14),
    },
    clearBtn: {
        flexDirection: "row",
        alignItems: 'center',
    },
    cartContentWrap: {
        maxHeight: px2dp(230),
        //height: px2dp(100),
    },
    cartFooter: {
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingLeft: px2dp(9),
        paddingRight: px2dp(14),
        height: px2dp(30)
    },

    cartContent: {
        paddingLeft: px2dp(9),
        paddingRight: px2dp(14),
    },
    cartItem: {
        height: px2dp(45),
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#e8e8e8'
    },
    cartItemRight: {
        flexDirection: "row",
        alignItems: 'center',
    },
    cartItemPrice: {
        marginRight: px2dp(25)
    },
});

function mapStateToProps(store) {
    return {
        ReduceLoadReplenishProducts: store.ReduceLoadReplenishProducts,
        ReduceReplenishProducts: store.ReduceReplenishProducts,
        ReduceInsertOrUpdateShoppingCart: store.ReduceInsertOrUpdateShoppingCart,
        ReduceDeleteShoppingCarts: store.ReduceDeleteShoppingCarts
    }
};
const connectProviders = connect(mapStateToProps)(ReplenishProducts);
connectProviders.navigationOptions = NavigationOptions;
export default connectProviders;