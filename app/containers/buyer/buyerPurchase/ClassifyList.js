/**
 * Created by Administrator on 2017/4/6.
 */
import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Image,
    Platform,
    TextInput,
    ScrollView,
    ListView,
    FlatList,
} from 'react-native';
import Tab, {HorizontalTab} from '../../../components/Tab';
import PageComponent from "../../PageComponent";
import BaseComponent, {deviceWidth, px2dp, BCText, BCImage, BCTouchable, substr,substr2, deviceHeight,BCHostImage,NavigationOptions} from '../../../BaseComponent';
import gs from '../../../styles/MainStyles';
import {SearchPageCalculate} from '../../../components/Calculate';
import {ActionShoppingCarts, UpdateCar} from "../../../actions/ShoppingCartAction";
import {ActionLoaderProducts, ActionProducts,ActionSearchProduct,ActionClassifyList} from '../../../actions/ProductAction';
import {fetchClassifyList,fetchClassifyListItems} from '../../../services/ProductServices';
import {
    fetchLoaderProducts,fetchSearchProduct,fetchSearchGetHotKeys,fetchSearchAddHotKey,
} from '../../../services/ProductServices';
import {fetchShoppingCarts,fetchDeleteShoppingCarts, fetchInsertOrUpdateShoppingCart} from "../../../services/ShoppingCartServices";
import {toastShort} from '../../../utils/ToastUtil';
import {toDecimal2} from '../../../utils/FormatUtil';
import {connect} from 'react-redux';


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
        IsOpen: React.PropTypes.bool,
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
            <BCTouchable style={[styles.spec,{paddingBottom:px2dp(5),paddingTop:px2dp(5), paddingLeft:px2dp(8),paddingRight:px2dp(5), backgroundColor:'#00c164',
                borderRadius:50,flex:1,justifyContent:'center',alignItems:'center'}]}
                         onPress={() => this.onSelectSpec()}>
                <BCText
                    style={[gs.fts_12, gs.c_fff, {marginRight: px2dp(5),textAlign:'center'}]}>{this.state.IsOpen ? '选规格' : '收起'}</BCText>
                {/*<BCImage style={[{width: px2dp(10), height: px2dp(8)}]}/>*/}
                {/*source={require('../imgs/up.png')}/>*/}
            </BCTouchable>

        )
    }

    //选择规格view
    renderSpecView(ProductId, productName,companyId) {
        return (
            !this.state.IsOpen ?
                this.state.item.Specs.map((obj, index) => {
                    if (index < 0) {
                        return false
                    }
                    else {
                        // let specName = obj.SpecName;
                        let spec=obj.SpecName;
                        let price = obj.Price;
                        let unit = obj.Unit;
                        let priceStr = substr(toDecimal2(price?price:0) + '', 8) + '/' + unit;
                        let unitAmount = obj.UnitAmount;
                        let disPlayUnit = obj.DisplayUnit;

                        return (
                            <View style={[gs.bgc_fff, styles.listSpecs]}
                                  key={ProductId + '-' + obj.SpecId + '-' + index}>
                                <View style={styles.productImg}/>
                                <View style={{flex: 1}}>
                                    {/*<BCImage style={[{width: px2dp(207)}]} source={require('../imgs/line.png')}/>*/}
                                    <View style={styles.listItemRight}>
                                        <View style={[styles.listItemRightTop,{justifyContent:'flex-start'}]}>
                                            <BCText style={[gs.c_3a3838]}>
                                                <BCText style={[gs.fts_14]}>{spec}</BCText>
                                            </BCText>
                                        </View>
                                        <View style={styles.listDetail}>
                                            <View style={[styles.listDetailRight,{flexDirection:'row'}]}>
                                                <BCText style={[gs.fts_14, gs.c_fd0319,]}>¥{priceStr}</BCText>
                                                {
                                                    obj.PriceChangeReason==1?<View style={[styles.jiang,{marginTop:px2dp(2)}]}><BCText style={[gs.fts_12,gs.c_fff]}>降</BCText></View>:null

                                                }
                                                {/*<BCImage style={[styles.actIcon]}
                                                 source={require('../imgs/drop.png')}/>*/}
                                            </View>
                                            <SearchPageCalculate
                                                ref={(c) => {
                                                    this._Products[ProductId + '-' + obj.SpecId] = c;
                                                }}
                                                ProductId={ProductId}
                                                Price={obj.Price}
                                                Quantity={obj.Quantity}
                                                SpecId={obj.SpecId}
                                                ShoppingCartId={obj.ShoppingCartId||0}
                                                CompanyId={companyId}
                                                UnitAmount={obj.UnitAmount}
                                                OnChange={this.props.updateShoppingCart}/>
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


    render() {
        const {dispatch} = this.props;
        let item = this.state.item;
        let Specs= item.Specs;
        if (!Specs || !Specs[0]) {
            return false
        }
        let firstSpec=Specs[0];
        let productName = substr2(item.ProductName, 7);
        let firstPriceString = substr(toDecimal2(firstSpec.Price?firstSpec.Price:0) + '', 8) + '/' + firstSpec.Unit;
        return (
            <View>
                <View style={[styles.listItem]}>
                    <BCTouchable onPress={() => this.props.GoProductList(item.CompanyId)}>
                        <BCHostImage style={styles.productImg}
                                     source={{uri: item.Image60}}/>
                    </BCTouchable>
                    <BCTouchable style={styles.listItemRight} onPress={() => this.props.GoProductList(item.CompanyId)}>
                        <View style={[styles.listItemRightTop]}>
                            <BCText style={[gs.fts_15, gs.c_3a3838]}>
                                {productName}
                            </BCText>
                            {/*{this.props.IsOpen ? this.renderChooseSpecView() : null}*/}
                        </View>
                        <BCText style={[gs.fts_13, gs.c_3a3838]}>{item.CompanyName}</BCText>
                        <View style={styles.listDetail}>
                            <View style={[styles.listDetailRight]}>
                                <View style={{flexDirection: 'row',}}>
                                    <BCText style={[gs.c_fd0319, {}]}>
                                        <BCText style={[gs.fts_12]}>￥</BCText>
                                        <BCText style={[gs.fts_13]}>{firstPriceString}</BCText>
                                    </BCText>
                                    {
                                        firstSpec.PriceChangeReason==1?<View style={[styles.jiang,{marginTop:px2dp(2)}]}><BCText style={[gs.fts_12,gs.c_fff]}>降</BCText></View>:null
                                    }
                                </View>
                            </View>
                        </View>
                    </BCTouchable>
                    <View style={{position:'absolute',bottom:px2dp(5),right:px2dp(12)}}>
                        {this.props.IsOpen ? this.renderChooseSpecView() :
                            <SearchPageCalculate
                                ref={(c) => {
                                    this._Products[item.ProductId + '-' + firstSpec.SpecId] = c;
                                }}
                                Quantity={firstSpec.Quantity}
                                Price={firstSpec.Price}
                                ProductId={item.ProductGlobalId}
                                SpecId={firstSpec.SpecId}
                                CompanyId={item.CompanyId}
                                UnitAmount={firstSpec.UnitAmount}
                                ShoppingCartId={firstSpec.ShoppingCartId}
                                OnChange={this.props.updateShoppingCart}/>}
                    </View>
                </View>
                {this.props.IsOpen ? this.renderSpecView(item.ProductGlobalId, item.ProductName,item.CompanyId) : null}
            </View>
        )
    }

    componentDidMount() {
        if (!this.props.item.Specs || this.props.item.Specs.length <= 0) {
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



class ClassifyList extends PageComponent {
    _page = 1;
    _Products = {};
    GlobalDatas = {};

    static propTypes = {
        product: React.PropTypes.object,
        OnSelect: React.PropTypes.func,
        ToPush: React.PropTypes.func,
        OnPressCalculate: React.PropTypes.func,
        totalPrice:React.PropTypes.number,
        item: React.PropTypes.object,
        renderDatas: React.PropTypes.array,
        // ParentCategoryId:React.PropTypes.ParentCategoryId,
    }


    constructor(props) {
        super(props);
        this.state = {
            value: "",
            renderDatas: [],
            GlobalDatas: [],
            searchKey:"",
            ParentCategoryId:0,
            ChildrenCategoryId:0,
            totalPrice:0,
        }
    }

    toIndex(){
        this.props.navigation.goBack();
    }
    //搜索框
    renderTop()  {
        return (
            <View style={{width:deviceWidth,height:Platform.OS=='ios'?px2dp(60):px2dp(45),}}>
                <View style={[styles.navigator, gs.bgc_f9f9f9, gs.bdc_bdbdbd]}>
                    {/*<BCTouchable style={{marginLeft:px2dp(-5),marginRight:px2dp(5)}}*/}
                        {/*onPress={()=>{*/}
                            {/*this.toIndex();*/}
                        {/*}}*/}
                    {/*>*/}
                        {/*<BCImage source={require('../../../imgs/Return.png')}></BCImage>*/}
                    {/*</BCTouchable>*/}
                    <View style={styles.searchBox}>
                        <BCImage style={styles.searchIcon} source={require('../../../imgs/search.png')}/>
                        <BCTouchable style={{width:'100%',justifyContent:'center'}}
                            onPress={()=>{
                            this.push('SearchPage')
                        }}>
                        {/*<TextInput*/}
                            {/*ref="searchKeyTextInput"*/}
                            {/*placeholder="搜索您要找的商品"*/}
                            {/*editable = {false}*/}
                            {/*placeholderTextColor="#b7b7b7"*/}
                            {/*underlineColorAndroid='transparent'*/}
                            {/*maxLength={20}*/}
                            {/*style={[styles.searchBar, gs.fts_14,]}*/}
                            {/*value={this.state.searchKey}*/}
                            {/*onChangeText ={(text) => {*/}
                                {/*// this.beginSearch(text);*/}
                                {/*if(!text){*/}
                                    {/*this.setState({*/}
                                        {/*dataSource: []*/}
                                    {/*});*/}
                                {/*}*/}
                                {/*this.setState({searchKey: text});*/}
                            {/*}}*/}
                        {/*/>*/}
                            <BCText style={{color:'#b7b7b7'}}>搜索您要找的商品</BCText>
                        </BCTouchable>
                    </View>
                    <BCTouchable activeOpacity={0.3} style={styles.rightButton} onPress={() =>{  //取消按钮点击去首页
                        this.toIndex();
                    }}>
                        <BCText style={[gs.c_BaseColor, gs.fts_15]}>取消</BCText>
                    </BCTouchable>
                </View>
            </View>
        )
    }


    _firstTabOnPress(index,Items){
        this._page=1;
        this.setState({
            ParentCategoryId:Items.CategoryId
        })
        // this.state.ParentCategoryId=Items.categoryId
        this.state.ChildrenCategoryId=0;
        this.state.renderDatas=Items.Children;
        if(Items.IsSelected){
            return false
        }
        Items.Children.map((item, index) => {
            if (index == 0) {
                Items.Children[index].IsSelected = true;
            }
            else {
                Items.Children[index].IsSelected = false;
            }
        })
        fetchClassifyListItems({p:this._page,productChildCategoryId:Items.Children[0].CategoryId})
            .then((ret)=>{
                let totalMoney=0;
                ret.data.map((Item,index)=>{
                    Item.Specs.map((item,i)=>{
                        let Quantity=item.Quantity?item.Quantity:0
                        totalMoney+=item.Price*item.UnitAmount*Quantity
                    })
                })
                this.setState({
                    dataSource:ret.data,
                    totalPrice:totalMoney,
                })
            }).catch((e)=>{})

    }
    _secondTabOnPress(index,renderDatas){
        this._page=1;
        this.state.ChildrenCategoryId = renderDatas[index].CategoryId
        this.state.totalPrice=0;
        renderDatas.map((item, index) => {
            if (index == 0) {
                renderDatas[index].IsSelected = true;
            }
            else {
                renderDatas[index].IsSelected = false;
            }
        })
        // console.log(this.state.ChildrenCategoryId)
        fetchClassifyListItems({p:this._page,productChildCategoryId:this.state.ChildrenCategoryId})
            .then((ret)=>{
                let totalMoney=0
                ret.data.map((Item,index)=>{
                    Item.Specs.map((item,i)=>{
                        let Quantity=item.Quantity?item.Quantity:0
                        // this.setState({
                        //     totalPrice:this.state.totalPrice+=item.Price*item.UnitAmount*Quantity
                        // })
                        totalMoney+=item.Price*item.UnitAmount*Quantity
                        // this.state.totalPrice+=item.Price*item.UnitAmount*Quantity
                    })
                })
                this.setState({
                    dataSource:ret.data,
                    totalPrice:totalMoney,
                })

            }).catch((e)=>{})
        // this.state.dataSource?
        //     this.state.dataSource.map((Item,index)=>{
        //         Item.Specs.map((item,i)=>{
        //             let Quantity=item.Quantity?item.Quantity:0
        //             this.setState({
        //                 totalPrice:this.state.totalPrice+=item.Price*item.UnitAmount*Quantity
        //             })
        //             // this.state.totalPrice+=item.Price*item.UnitAmount*Quantity
        //         })
        //     }):null;

    }

    //主分类
    TopTab() {
        const {dispatch} = this.props;
        let GlobalDatas = this.state.GlobalDatas;
        // 一级标签点击变色
        if (this.state.ParentCategoryId){
            GlobalDatas.map((item,index)=>{
                if(item.CategoryId==this.state.ParentCategoryId){
                    GlobalDatas[index].IsSelected=true;
                }else {
                    GlobalDatas[index].IsSelected=false;
                }
            })
        }else{
            if(GlobalDatas[0] && GlobalDatas[0].IsSelected==false){
                // GlobalDatas[0].IsSelected=true
            }
        }

        //加载第一次无数据，第二次加载获取数据赋值给state.renderDatas
        if (this.state.renderDatas[0]){

        }else{
            if(this.state.renderDatas && GlobalDatas &&GlobalDatas[0]){
                for (var i=0;i<GlobalDatas.length;i++){
                    if(GlobalDatas[i].IsSelected){
                        let index=i;
                        this.state.renderDatas=GlobalDatas[index].Children
                    }
                }

            }
        }

        //二级标签点击变色
        if (this.state.ChildrenCategoryId && this.state.ChildrenCategoryId !=0){
            this.state.renderDatas.map((item,index)=>{
                if(item.CategoryId==this.state.ChildrenCategoryId){
                    this.state.renderDatas[index].IsSelected=true;
                }else {
                    this.state.renderDatas[index].IsSelected=false;
                }
            })
        }else{
            if(this.state.renderDatas[0]){
                this.state.renderDatas[0].IsSelected=true
            }
        }

        return (
            <View>
                <View style={[styles.Category0, gs.bgc_fff]}>
                    <ScrollView ref="firstTab"
                                contentContainerStyle={[{paddingLeft: px2dp(28)}]}
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}>
                        {
                            this.state.GlobalDatas.map((Items, index) => {
                                return (
                                    <BCTouchable key={'p' + index}
                                                 style={[styles.CategoryItem0, Items.IsSelect ? gs.bdc_00C164 : gs.bdc_fff]}
                                                 onPress={() => {
                                                     this._firstTabOnPress(index, Items)
                                                 }}>
                                        <BCText
                                            style={[gs.fts_15, Items.IsSelected ? gs.c_00C164 : gs.c_3a3838]}>{Items.CategoryName}</BCText>
                                    </BCTouchable>
                                )
                            })
                        }
                    </ScrollView>
                </View>

            </View>
        )
    }


    //商品列表
    renderList() {
        return (
            <View style={[styles.lists, gs.bgc_fff,{marginBottom:px2dp(170)}]}>
                <View style={[styles.secondCategory, gs.bgc_f9f9f9]}>
                    <ScrollView  ref="SecondTab"
                                 contentContainerStyle={[]}
                                 showsVerticalScrollIndicator={false}>
                        {
                            this.state.renderDatas.map((item, index) => {
                                return (
                                    <BCTouchable key={'h' + index}
                                                 style={[styles.secondCategoryItem, gs.bgc_f2f1ef,item.IsSelected? gs.bgc_fff:gs.bgc_f9f9f9]}
                                                 onPress={() => {this._secondTabOnPress(index,this.state.renderDatas)}}
                                    >
                                        <BCText style={[{textAlign:'center'},gs.fts_14, item.IsSelected? (gs.bold, gs.c_00C164) : gs.c_888]}>{item.CategoryName}</BCText>
                                    </BCTouchable>
                                )
                            })
                        }
                    </ScrollView>
                </View>
                <FlatList
                    style={{width:deviceWidth - px2dp(90)}}
                    // initialNumToRender={5}
                    // ListFooterComponent={this.renderFooter.bind(this)}
                    data={this.state.dataSource}
                    renderItem={this.renderItem.bind(this)}
                    ref={(ref) => {
                        this._FlatList = ref;
                    }}
                    keyExtractor={this.keyExtractor.bind(this)}
                    refreshing={false}
                    onEndReachedThreshold={0.1}
                    onEndReached={this.onEndReached.bind(this)}
                />
            </View>
        )
    }

    //商品列表Item key
    keyExtractor(item, i) {
        return item.ProductGlobalId + '-' + i
    }
    //商品列表Item
    renderItem(rowData) {
        const {dispatch} = this.props;
        let bCompanyId=this.props.ReduceEmployee.currentEmployee.CompanyId;
        let item = rowData.item;
        let productType=item.ProductType;
        let sCompanyId=item.CompanyId
        let categoryId=item.CategoryId;
        let productGlobalId=item.ProductGlobalId;
        let parentCategoryId=item.ParentCategoryId;

        return <Dl
            // ref={(d) => {
            //     this._Dls[item.ProductId] = d;
            // }}
            item={item}
            dispatch={dispatch}
            updateShoppingCart={this.updateShoppingCart}
            IsOpen = {
                item.Specs&&item.Specs.length>1?true:false
            }
            OnInit={(_Product) => {
                Object.assign(this._Products, _Product)
            }}
            GoProductList={() => {
                this.push('ProductList', {productType,bCompanyId,sCompanyId,categoryId,productGlobalId,parentCategoryId,fromWhere:3 });  // fromWhere 最初由谁点到ProductList界面 1:首页采购》Providers 2:首页商品图片（小） 3:首页搜索
            }}/>
    }
    renderFooter(){
        // let totalMoney=0;
        // this.state.dataSource?
        //     this.state.dataSource.map((Item,index)=>{
        //         Item.Specs.map((item,i)=>{
        //             if(item.Quantity){
        //                 totalMoney+=item.Price*item.UnitAmount*item.Quantity
        //             }
        //             // this.state.totalPrice+=item.Price*item.UnitAmount*Quantity
        //         })
        //     }):null;
        // this.setState({
        //     totalPrice:totalMoney
        // })
        return  <View style={[styles.footerWrap]}>
                    <View style={styles.footer}>
                        <View style={[styles.money]}>
                            <BCText style={[gs.c_fd0319, gs.fts_16]}>合计:{toDecimal2(this.state.totalPrice) * 1}元</BCText>
                        </View>
                        <BCTouchable style={[styles.car]}
                                     onPress={() =>{
                                         this.push('Cart', { pageFrom: 'SearchPage', onBack: this.refreshView.bind(this)})}}>
                            {this.state.totalCount ?<BCText style={[gs.c_fff, gs.fts_17]}>去购物车</BCText> : <BCText style={[gs.c_fff, gs.fts_17]}>去购物车</BCText>}
                        </BCTouchable>
                    </View>
                </View>
    }

    updateShoppingCart=(type, quantity, shoppingCartId, specId,companyId,productId,moneyChanged)=> {
        if(quantity&&quantity>0){
            fetchInsertOrUpdateShoppingCart({
                ProductGlobalId:productId,
                ShoppingCartId:shoppingCartId,
                CompanyId:companyId,
                SpecId:specId,
                Quantity:quantity,
                ProductType:0,
            }).then((ret)=>{
                if(moneyChanged){
                    if(type=='add'){
                        this.setState({totalPrice:this.state.totalPrice+moneyChanged});
                    }else{
                        this.setState({totalPrice:this.state.totalPrice-moneyChanged});
                    }
                }

            });
        }else {
            fetchDeleteShoppingCarts(
                [shoppingCartId]
            ).then(()=>{
                this.setState({totalPrice:this.state.totalPrice-moneyChanged});
            });
        }
    }

    //刷新
    onRefersh() {
        const {dispatch} = this.props;
        let GlobalDatas = this.GlobalDatas;

        this._page = 1;
        // this.beginSearch(this.state.searchKey);
    }

    refreshView() {
        this.setState({
            dataSource: [],
            totalPrice: 0
        });
        this.onRefersh();
    }



    //返回回调
    onBack() {
        const {navigator} = this.props;
        if (navigator) {
            navigator.pop();
            this.props.backCallBack()
        }
    }
    //Main
    render() {
        return (
            <View style={[styles.main, gs.bgc_f2f1ef]}>

                {this.renderTop()}
                {this.TopTab()}
                {this.renderList()}
                {this.renderFooter()}

            </View>
        )
    }
    //加载更多
    onEndReached() {
        const {dispatch} = this.props;
        let dataSource = this.dataSource;
        let p= ++this._page;
        fetchClassifyListItems({p:p,productChildCategoryId:this.state.ChildrenCategoryId})
            .then((ret)=>{
                this.state.totalPrice=0;
                this.setState({
                    dataSource:this.state.dataSource.concat(ret.data),
                })
                let totalMoney=0
                this.state.dataSource.map((Item,index)=>{
                    Item.Specs.map((item,i)=>{
                        if(item.Quantity){
                            totalMoney+=item.Price*item.UnitAmount*item.Quantity
                        }
                    })
                })
                this.setState({
                    totalPrice:totalMoney
                })
            }).catch((e)=>{})
    }

    getProducts(productChildCategoryId) {
        fetchClassifyListItems({p: this._page, productChildCategoryId: productChildCategoryId})
            .then((ret) => {
                this.setState({
                    dataSource: ret.data,
                })
                let totalMoney = 0
                this.state.dataSource ?
                    this.state.dataSource.map((Item, index) => {
                        Item.Specs.map((item, i) => {
                            if (item.Quantity) {
                                totalMoney += item.Price * item.UnitAmount * item.Quantity
                            }
                            // this.setState({
                            //     totalPrice:this.state.totalPrice+=item.Price*item.UnitAmount*Quantity
                            // })
                            // this.state.totalPrice+=item.Price*item.UnitAmount*Quantity
                        })
                    }) : null;
                this.setState({
                    totalPrice: totalMoney
                })
                // this.setState({
                //     totalPrice:this.state.totalPrice
                // })

            })
            .catch((e) => {
            })
    }

    WillMount(){
        const {dispatch} = this.props;

        fetchClassifyList({categoryId:this.params.recommendId})
            .then((ret)=>{
                this.setState({
                    GlobalDatas:ret.data,
                })
                if(!this.params.recommendId) {
                    ret.data.map((item) => {
                        // console.log(item)
                        if (item.IsSelected) {
                            this.getProducts(0 - item.CategoryId);
                            return;
                        }
                    });
                }
            })
            .catch((e)=>{})
        if(this.params.recommendId){
            this.getProducts(0-this.params.recommendId);
        }
    }


    WillReceive(nextProps) {
        // if (nextProps.ReduceLoadShoppingCarts.datas != null && nextProps.ReduceLoadShoppingCarts.datas != this.props.ReduceLoadShoppingCarts.datas) {
        //     const {ReduceLoadShoppingCarts} = nextProps;
        //     let totalMoney=0;
        //     ReduceLoadShoppingCarts.datas.map((n,index)=>{
        //         totalMoney+=n.Amount;
        //     });
        //
        //     this.setState({
        //         IsReceived: true,
        //         totalPrice:totalMoney,
        //     })
        // }
    }
}


const styles = StyleSheet.create({
    main: {
        flex: 1,
        flexDirection:'column'
    },
    navigator: {
        height: Platform.OS === 'ios' ? px2dp(65) : px2dp(45),
        //justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: Platform.OS === 'ios' ? px2dp(20) : px2dp(0),
        borderBottomWidth: 1,
        paddingLeft: px2dp(16),
        paddingRight: px2dp(16)
    },
    rightButton: {
        width: '13%',
        alignItems: 'center',
        height: px2dp(28),

        justifyContent: "center"
    },
    searchBox: {
        width: '87%',
        height: px2dp(28),
        marginRight:px2dp(5),
        alignItems: 'center',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        borderRadius: px2dp(14),
        backgroundColor: '#ececec',

    },
    searchBar: {
        color: '#aea9a9',
        marginLeft: px2dp(6),
        padding: 0,
        width: '80%',
    },
    searchIcon: {
        width: px2dp(16),
        height: px2dp(17),
        marginLeft: px2dp(8)
    },
    //搜索结果
    productImg: {
        width: px2dp(60),
        height: px2dp(60),
        marginRight: px2dp(8),
    },
    listItemRight: {
        flex: 1,
    },
    listItem: {
        paddingLeft: px2dp(10),
        paddingRight: px2dp(12),
        paddingTop: px2dp(12),
        flexDirection: 'row',
        flexWrap: 'nowrap',
    },
    listSpecs:{
        paddingLeft:px2dp(10),
        paddingRight:px2dp(12),
        paddingVertical:px2dp(5),
        flexDirection: 'row',
        flexWrap: 'nowrap'
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
        marginTop: px2dp(8),
        height: px2dp(22),
        borderBottomWidth:px2dp(1),
        borderBottomColor:'#ccc',
    },
    handleProduct: {},
    actIcon: {
        width: px2dp(15),
        height: px2dp(15),
        marginLeft: px2dp(7),
        borderRadius: px2dp(2),
        alignItems: 'center',
        justifyContent: 'center'
    },
    companyDetail: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'center',
        alignItems: 'center',
    },
    companyDetailBg: {
        height: px2dp(13),
        width: px2dp(12),
        marginLeft: px2dp(4)
    },
    //促销'降'字
    jiang:{
        width:px2dp(16),
        height:px2dp(16),
        marginLeft:px2dp(5),
        backgroundColor:'#fd0016',
        borderRadius:2,
        justifyContent: 'center',
        alignItems: 'center',
    },

    //加减
    btnBox: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center'
    },
    btnInput: {
        width: px2dp(32),
        height: px2dp(30),
        padding: 0,
        textAlign: 'center'
    },
    //底部
    footerWrap: {
        width: '100%',
        height: px2dp(45),
        position: 'absolute',
        bottom: 0,
        left: 0,
        justifyContent: 'flex-end',
        zIndex: 100
    },
    footer: {
        width: '100%',
        height: px2dp(44),
        borderTopWidth: 1,
        borderTopColor: '#eee',
        flexDirection: 'row',
        overflow: 'visible',
        justifyContent: 'flex-end',
        backgroundColor: '#fff',
    },
    noProducts: {
        width: '100%',
        height: px2dp(44),
        flexDirection: 'row',
        overflow: 'visible',
        backgroundColor: '#202020',
        paddingLeft: px2dp(80),
        alignItems: 'center'
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
        backgroundColor: "#00c164"
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
    //tab标签
    Category0: {
        flexWrap: 'nowrap',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    CategoryItem0: {
        height: px2dp(44),
        justifyContent:'center',
        alignItems: 'center',
        paddingTop: px2dp(2),
        marginRight: px2dp(24)
    },

    lists :{
        width: deviceWidth,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    secondCategory: {
        width: px2dp(100),
        height: Platform.OS === 'ios' ?deviceHeight-px2dp(45)-px2dp(65)-px2dp(65) : deviceHeight-px2dp(45)-px2dp(45)-px2dp(65),
    },
    secondCategoryItem: {
        //width: px2dp(100),
        height: px2dp(40),
        paddingHorizontal: px2dp(14),
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomColor: '#e3e3e3',
        borderBottomWidth: 1,
    },

});

function mapStateToProps(store) {
    return {
        ReduceClassifyList: store.ReduceClassifyList,
        ReduceInsertOrUpdateShoppingCart: store.ReduceInsertOrUpdateShoppingCart,
        ReduceLoadShoppingCarts: store.ReduceLoadShoppingCarts,
        ReduceEmployee: store.ReduceEmployee,
    }
}

const connectClassifyList = connect(mapStateToProps)(ClassifyList);
connectClassifyList.navigationOptions = NavigationOptions;
export default connectClassifyList;