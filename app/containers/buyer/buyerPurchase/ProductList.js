import React, {Component} from "react";
import {ScrollView, StyleSheet, View, FlatList, Platform} from "react-native";
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
    substr2,
    deviceHeight,
    deepCopy
} from "../../../BaseComponent";
import gs from "../../../styles/MainStyles";
import {connect} from "react-redux";
import {ActionLoaderProducts,ActionLoaderProductsByCategory, ActionProducts} from '../../../actions/ProductAction';
import {
    ActionInsertOrUpdateShoppingCart,
    ActionDeleteShoppingCarts,
    UpdateCar,
    ActionShoppingCarts
} from '../../../actions/ShoppingCartAction';
import {fetchDeleteShoppingCarts, fetchInsertOrUpdateShoppingCart} from '../../../services/ShoppingCartServices';
import {toastShort} from '../../../utils/ToastUtil';
import {toDecimal2} from '../../../utils/FormatUtil';

import {Calculate} from '../../../components/Calculate';
import ShoppingCartBar from '../../../components/ShoppingCartBar';
import Tab, {VerticalTab} from '../../../components/Tab';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'

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
            IsOpen: true,
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
                    if (index <=0) {
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
                        let priceChangeReason = obj.PriceChangeReason;
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
                                                <BCText style={[gs.fts_13, gs.c_fd0319,]}>¥{priceStr}</BCText>
                                                {priceChangeReason == 1?
                                                    <View style={[gs.bgc_fd0319,styles.down]}>
                                                        <BCText style={[gs.fts_10,gs.c_fff]}>降</BCText>
                                                    </View>:null}
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
        let productName = substr2(item.ProductName, 7);
        let productId = item.ProductId;
        let specName = Spec0.SpecName;
        let specId = Spec0.SpecId;
        let priceChangeReason = Spec0.PriceChangeReason;
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
                                    <BCText style={[gs.c_fd0319]}>
                                        <BCText style={[gs.fts_12]}>￥</BCText>
                                        <BCText style={[gs.fts_13]}>{priceStr}</BCText>
                                    </BCText>
                                    {priceChangeReason ==1 ?
                                        <View style={[gs.bgc_fd0319,styles.down]}>
                                            <BCText style={[gs.fts_10,gs.c_fff]}>降</BCText>
                                        </View>:null}
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

class ProductList extends PageComponent {
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
            jumpParentCategoryId:undefined,
            jumpCategoryId:undefined,
            jumpProductGlobalId:undefined,
            onfreshProductGlobalId:undefined
        }
        this.ParentCategoryId = 0;
        this.CategoryId = 0;
    }

    isShowSearchBar() {
        return true
    }

    //点击搜索
    goSearch() {
        this.push('SearchPage', {
            sCompanyId: this.GlobalDatas.sCompanyId,
            callBack: this.refeshView.bind(this)
        })
    }

    //返回回调
    onBack() {
        const {dispatch} = this.props;
        //更新购物车
        dispatch(ActionShoppingCarts());
        if (this.params.fromWhere==1){  // 最初由谁点到ProductList界面 1:首页采购》Providers
            // this.push('Providers')
            this.pop()
        }
        if (this.params.fromWhere==2){  //2:首页分类图片（小）
            this.pop()
            // this.push('BuyerIndex')
        }
        if (this.params.fromWhere==3){  //3:首页搜索界面
            this.pop()
            // this.push('SearchPage')
        }
    }

    //公司信息
    renderCompany(bCompanyId, sCompanyId, provider) {
        let text = null;
        if (provider.StartQuantity) {
            text = '起送量 : ' + provider.StartQuantity
        }
        else if (provider.StartPrice) {
            text = '起送价 :' + provider.StartPrice + '元'
        }
        else if (provider.DeliveryAmount){
            text = '运费 :' + provider.DeliveryAmount + '元'
        }else {
            text = '免配送费'
        }

        return (
            <View style={gs.bgc_fff}>
                <BCTouchable
                             onPress={() => {
                                 this.push('CompanyDetial', {bCompanyId, sCompanyId ,from:1})
                             }}>
                    <View style={[styles.company]}>
                        <BCHostImage style={styles.companyImg}
                                     source={{uri: provider.LogoImage}}/>
                        <View style={styles.companyContent}>
                            <BCText style={[gs.fts_16, gs.c_3a3838,]}>{substr2(provider.CompanyName,16)}</BCText>
                            <BCText style={[gs.fts_14, gs.c_888,{width:px2dp(260)}]}>主营: {substr2(provider.MainType,14)}</BCText>
                            <View style={styles.delivery}>
                                <View style={styles.companyDetail}>
                                    <BCText style={[gs.fts_14, gs.c_888,]}>{text}</BCText></View>
                                <View style={{flex:1,flexDirection:'row',justifyContent:'flex-end'}}>
                                    <BCText style={[gs.fts_14, gs.c_00C164,]}>详情</BCText>
                                    <BCImage style={styles.companyDetailBg}
                                             source={require('../../../imgs/right.png')}/>
                                </View>
                            </View>
                        </View>
                    </View>
                </BCTouchable>
            </View>
        )
    }

    //主分类
    renderCategory(categorys,parentCategoryId) {
        return (
            <Tab
                ref={(t) => {
                    this._Tab = t
                }}
                ParentCategoryId={parentCategoryId}
                Items={categorys}
                OnPress={(i, categoryId) => {
                    const {dispatch} = this.props;
                    let GlobalDatas = this.GlobalDatas;
                    this._FlatList.scrollToIndex({animated: true, index: 0});

                    GlobalDatas.ParentCategoryId = categoryId;
                    GlobalDatas.CategoryId = GlobalDatas.ParentCategorys[i].Items[0].CategoryId;

                    let category = GlobalDatas.ParentCategorys;
                    let childCategorys = GlobalDatas.ChildCategorys;
                    this._VerticalTab.state.childCategory=undefined
                    this._VerticalTab.state.Items = GlobalDatas.ParentCategorys[i].Items;
                    this._VerticalTab.reLoad();
                    this._page = 1;

                    if(this.state.jumpCategoryId&&this.state.jumpCategoryId==GlobalDatas.CategoryId){
                        this.state.onfreshProductGlobalId=undefined
                        dispatch(ActionProducts({
                            productType: 0,
                            sCompanyId: GlobalDatas.sCompanyId,
                            priceGroupId: GlobalDatas.Provider.PriceGroupId,
                            parentCategoryId: categoryId,
                            categoryId: GlobalDatas.CategoryId,
                            ProductGlobalId:this.state.jumpProductGlobalId
                        }));

                    }else {
                        dispatch(ActionProducts({
                            productType: 0,
                            sCompanyId: GlobalDatas.sCompanyId,
                            priceGroupId: GlobalDatas.Provider.PriceGroupId,
                            parentCategoryId: categoryId,
                            categoryId: GlobalDatas.CategoryId,
                        }));
                    }

                    /*dispatch(ActionProducts({
                        productType: 0,
                        sCompanyId: GlobalDatas.sCompanyId,
                        parentCategoryId: categoryId,
                        priceGroupId: GlobalDatas.Provider.PriceGroupId,
                        categoryId: GlobalDatas.CategoryId
                    }));*/
                }}/>
        )
    }

    //主要内容
    renderContent(childCategory,childCategoryId) {
        return (
            <View style={[styles.content]}>
                {this.renderSecondCategory(childCategory,childCategoryId)}
                {this.renderList()}
            </View>
        )
    }

    //二级分类
    renderSecondCategory(categoryArray,childCategory) {
        return (
            <VerticalTab Items={categoryArray}
                         ref={(v) => {
                             this._VerticalTab = v
                         }}
                         childCategory={childCategory}
                         OnPress={(i, categoryId, pid) => {
                             const {dispatch} = this.props;
                             let GlobalDatas = this.GlobalDatas;
                             GlobalDatas.ParentCategoryId = pid;
                             GlobalDatas.CategoryId = categoryId;
                             this._VerticalTab.state.childCategory=undefined
                             let childCategorys = GlobalDatas.ChildCategorys;
                             this._page = 1;
                             this._FlatList.scrollToIndex({animated: true, index: 0});
                             if(this.state.jumpCategoryId&&this.state.jumpCategoryId==GlobalDatas.CategoryId){
                                 this.state.onfreshProductGlobalId=undefined
                                 dispatch(ActionProducts({
                                     productType: 0,
                                     sCompanyId: GlobalDatas.sCompanyId,
                                     priceGroupId: GlobalDatas.Provider.PriceGroupId,
                                     parentCategoryId: pid,
                                     categoryId: categoryId,
                                     ProductGlobalId:this.state.jumpProductGlobalId
                                 }));
                             }else {
                                 dispatch(ActionProducts({
                                     productType: 0,
                                     sCompanyId: GlobalDatas.sCompanyId,
                                     priceGroupId: GlobalDatas.Provider.PriceGroupId,
                                     parentCategoryId: pid,
                                     categoryId: categoryId,
                                 }));
                             }
                             /*this._page = 1;
                             dispatch(ActionProducts({
                                 productType: 0,
                                 sCompanyId: GlobalDatas.sCompanyId,
                                 priceGroupId: GlobalDatas.Provider.PriceGroupId,
                                 parentCategoryId: pid,
                                 categoryId: categoryId
                             }));*/
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
                            getItemLayout = {(data,index)=>({length:px2dp(0),offset:px2dp(0)*index,index})}
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
        const {dispatch} = this.props;
        let item = rowData.item;
        /*if(this.state.onfreshProductGlobalId&&this.state.onfreshProductGlobalId==item.ProductId){
            this.state.onfreshProductGlobalId=undefined;
            return false;
        }*/
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

                if (parmasObj.quantity&&parmasObj.quantity>0) {
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
                        ProductType: 0,
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
                                let index = Specs.findIndex(Specs => Specs.SpecId == parmasObj.SpecId);
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
                // if(this.params && this.params.pageFrom=='Home'){this.pop()}
                this.push('ProductDetail', {
                    productGlobalId,
                    companyId: item.CompanyId,
                    productType: 0,
                    fromWhere:this.params.fromWhere,
                    // isActive: true,
                    callBack: this.refeshView.bind(this)
                })
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
        this._page = 1;
        const {dispatch} = this.props;
        let GlobalDatas = this.GlobalDatas;

        //关闭mask和maskContent
        this._Loading?this._Loading.Trigger(false):{};
        this._Maks?this._Maks.Trigger(false):{};
        this._ShoppingCartLists?this._ShoppingCartLists.Trigger(false):{};
        if(this.state.jumpCategoryId&&this.state.jumpCategoryId==GlobalDatas.CategoryId){
            this.state.onfreshProductGlobalId=undefined
            dispatch(ActionProducts({
                productType: 0,
                sCompanyId: GlobalDatas.sCompanyId,
                priceGroupId: GlobalDatas.Provider.PriceGroupId,
                parentCategoryId: GlobalDatas.ParentCategoryId,
                categoryId: GlobalDatas.CategoryId,
                ProductGlobalId:this.state.jumpProductGlobalId
            }));

        }else {
            dispatch(ActionProducts({
                productType: 0,
                sCompanyId: GlobalDatas.sCompanyId,
                priceGroupId: GlobalDatas.Provider.PriceGroupId,
                parentCategoryId: GlobalDatas.ParentCategoryId,
                categoryId: GlobalDatas.CategoryId
            }));
        }
        dispatch(ActionShoppingCarts());
        /*this._page = 1;
            dispatch(ActionProducts({
                productType: 0,
                sCompanyId: GlobalDatas.sCompanyId,
                priceGroupId: GlobalDatas.Provider.PriceGroupId,
                parentCategoryId: GlobalDatas.ParentCategoryId,
                categoryId: GlobalDatas.CategoryId
            }));*/

    }

    refeshView() {
        this.onRefersh();
    }

    //加载更多
    onEndReached(end) {
        const {dispatch} = this.props;
        let GlobalDatas = this.GlobalDatas;
        this._page++;
        if(this.state.jumpCategoryId&&this.state.jumpCategoryId==GlobalDatas.CategoryId){

            this.state.onfreshProductGlobalId=this.state.jumpProductGlobalId
            if(this._page>1){

                dispatch(ActionProducts({
                    p: this._page,
                    productType: 0,
                    sCompanyId: GlobalDatas.sCompanyId,
                    priceGroupId: GlobalDatas.Provider.PriceGroupId,
                    parentCategoryId: GlobalDatas.ParentCategoryId,
                    categoryId: GlobalDatas.CategoryId,
                    ProductGlobalId:this.state.jumpProductGlobalId,
                }));
            }else{
                dispatch(ActionProducts({
                    productType: 0,
                    sCompanyId: GlobalDatas.sCompanyId,
                    priceGroupId: GlobalDatas.Provider.PriceGroupId,
                    parentCategoryId: GlobalDatas.ParentCategoryId,
                    categoryId: GlobalDatas.CategoryId,
                    ProductGlobalId:this.state.jumpProductGlobalId,
                }));
            }
        }else {
            dispatch(ActionProducts({
                p: this._page,
                productType: 0,
                sCompanyId: GlobalDatas.sCompanyId,
                priceGroupId: GlobalDatas.Provider.PriceGroupId,
                parentCategoryId: GlobalDatas.ParentCategoryId,
                categoryId: GlobalDatas.CategoryId,
                ProductGlobalId:this.state.jumpProductGlobalId,
            }));
        }

        /*dispatch(ActionProducts({
            productType: 0,
            sCompanyId: GlobalDatas.sCompanyId,
            priceGroupId: GlobalDatas.Provider.PriceGroupId,
            parentCategoryId: GlobalDatas.ParentCategoryId,
            categoryId: GlobalDatas.CategoryId,
            p: ++this._page
        }));*/
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
            productType: 0,
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
                FromWhere={0}
                TotalCount={totalCount}
                TotalPrice={toDecimal2(totalPrice) * 1}
                Provider={this.GlobalDatas.Provider}
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
                    this.push('Cart', {pageFrom: 'PrductList', callBack: this.refeshView.bind(this)})
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
        let {bCompanyId, sCompanyId, Provider, ParentCategorys, ChildCategorys,Products,ParentCategoryId,CategoryId} = this.GlobalDatas;
        return (
            <View style={[styles.main, gs.bgc_f2f1ef]}>
                {this.renderCompany(bCompanyId, sCompanyId, Provider)}
                {this.renderCategory(ParentCategorys,ParentCategoryId)}
                {this.renderContent(ChildCategorys,CategoryId)}
            </View>
        )
    }

    WillMount() {
        const {dispatch} = this.props;
        const {sCompanyId,categoryId,parentCategoryId, productGlobalId,fromWhere} = this.params;
        this.setState({
            jumpParentCategoryId:parentCategoryId,
            jumpCategoryId:categoryId,
            jumpProductGlobalId:productGlobalId
        });
        // console.log(categoryId)
        if(categoryId ){
            dispatch(ActionLoaderProductsByCategory({productType: 0, sCompanyId,categoryId,parentCategoryId,productGlobalId}));
        }else{
            dispatch(ActionLoaderProducts({productType: 0, sCompanyId:sCompanyId,fromWhere:fromWhere}));
        }
        dispatch(ActionShoppingCarts());
    }

    //初始化数据
    WillReceive(nextProps){
        if(nextProps.ReduceLoaderProductsByCategory != null && nextProps.ReduceLoaderProductsByCategory.datas != this.props.ReduceLoaderProductsByCategory.datas)
        {
            const {ReduceLoaderProductsByCategory} = nextProps;
            const {bCompanyId, sCompanyId} = this.params;
            let {Categorys, Provider, Products, Carts} = ReduceLoaderProductsByCategory.datas;
            let Items=[];
            Categorys.map((item, i) => {
                if(item.CategoryId==this.state.jumpParentCategoryId){
                    Items=item.Items;
                }
            });
            if (Categorys.length) {
                Object.assign(this.GlobalDatas,
                    {
                        ParentCategorys: Categorys,
                        ChildCategorys: Items,
                        Provider,
                        Products,
                        bCompanyId:Provider.BCompanyId,
                        sCompanyId,
                        ParentCategoryId: this.state.jumpParentCategoryId,
                        CategoryId: this.state.jumpCategoryId
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
        if (nextProps.ReduceLoderProducts.datas != null && nextProps.ReduceLoderProducts.datas != this.props.ReduceLoderProducts.datas) {
            const {ReduceLoderProducts} = nextProps;
            const {bCompanyId, sCompanyId} = this.params;
            let {Categorys, Provider, Products, Carts} = ReduceLoderProducts.datas;
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
        if (nextProps.ReduceProduct.datas != null && nextProps.ReduceProduct.datas != this.props.ReduceProduct.datas) {
            const {ReduceProduct} = nextProps;
            const products = ReduceProduct.datas.Products;
            const Carts = ReduceProduct.datas.Carts;
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
        marginLeft: px2dp(2),
        marginTop:px2dp(2),
    },

    content: {
        flex: 1,
        borderTopWidth: 1,
        borderTopColor: '#e3e3e3',
        flexDirection: "row",
        flexWrap: 'nowrap',
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
        flexWrap: 'nowrap',

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
        justifyContent:'flex-start',
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
        ReduceLoderProducts: store.ReduceLoderProducts,
        ReduceProduct: store.ReduceProduct,
        ReduceInsertOrUpdateShoppingCart: store.ReduceInsertOrUpdateShoppingCart,
        ReduceDeleteShoppingCarts: store.ReduceDeleteShoppingCarts,
        ReduceLoaderProductsByCategory:store.ReduceLoaderProductsByCategory
    }
};
const connectProviders = connect(mapStateToProps)(ProductList);
connectProviders.navigationOptions = NavigationOptions;
export default connectProviders;