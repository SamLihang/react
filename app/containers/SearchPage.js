/**
 * Created by Administrator on 2017/4/6.
 */
import React, {Component} from 'react';
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
    FlatList,
    AsyncStorage,
    KeyboardAvoidingView,
} from 'react-native';
import PageComponent from "../containers/PageComponent";
import BaseComponent, {deviceWidth, px2dp, BCText, BCImage, BCTouchable, substr,substr2, deviceHeight,BCHostImage,NavigationOptions} from '../BaseComponent';
import gs from '../styles/MainStyles';
import {SearchPageCalculate} from '../components/Calculate';
import {ActionShoppingCarts, UpdateCar} from "../actions/ShoppingCartAction";
import {ActionLoaderProducts, ActionProducts,ActionSearchProduct} from '../actions/ProductAction';
import {
    fetchLoaderProducts,fetchSearchProduct,fetchSearchGetHotKeys,fetchSearchAddHotKey,fetchProductsCategory
} from '../services/ProductServices';
import {fetchShoppingCarts,fetchDeleteShoppingCarts, fetchInsertOrUpdateShoppingCart} from "../services/ShoppingCartServices";
import {toastShort} from '../utils/ToastUtil';
import {toDecimal2} from '../utils/FormatUtil';
import {connect} from 'react-redux';


// 搜索结果页面标签
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

    //选择规格view
    renderSpecView(ProductId, productName,companyId) {
        return (
                this.state.item.Specs.map((obj, index) => {
                    if (index < 0) {
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
                        // if (displayUnitTypeId == 2) {
                            //priceStr += disPlayUnit;
                        // } else {
                            //priceStr += unit;
                        // }
                        return (
                            <View style={[gs.bgc_fff, styles.listItem]}
                                  key={ProductId + '-' + obj.SpecId + '-' + index}>
                                <View style={styles.productImg}/>
                                <View style={{flex: 1}}>
                                    {/*<BCImage style={[{width: px2dp(207)}]} source={require('../imgs/line.png')}/>*/}
                                    <View style={styles.listItemRight}>
                                        <View style={[styles.listItemRightTop,{justifyContent:'flex-start'}]}>
                                            <BCText style={[gs.c_3a3838, {marginTop: px2dp(8)}]}>
                                                {/*<BCText style={[gs.fts_12]}>￥</BCText>*/}
                                                <BCText style={[gs.fts_14]}>{specName}</BCText>
                                            </BCText>
                                            {
                                                obj.PriceChangeReason==1?<View style={[styles.jiang,{marginTop:px2dp(4)}]}><BCText style={[gs.fts_12,gs.c_fff]}>降</BCText></View>:null

                                            }
                                        </View>
                                        <View style={styles.listDetail}>
                                            <View style={[styles.listDetailRight]}>
                                                <BCText style={[gs.fts_14, gs.c_fd0319,]}>¥{priceStr}</BCText>
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
                                                ShoppingCartId={obj.ShoppingCartId}
                                                CompanyId={companyId}
                                                UnitAmount={obj.UnitAmount}
                                                OnChange={this.props.updateShoppingCart}/>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        )
                    }
                })
        )
    }

    render() {
        const {dispatch} = this.props;
        let item = this.state.item;
        let productName = substr2(item.ProductName, 15);
        let priceString = substr(toDecimal2(item.Price) + '', 8) + '/' + item.Unit;
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
                        {/*<BCText style={[gs.fts_13, gs.c_3a3838]}>{specName}</BCText>*/}
                        <BCText style={[gs.fts_12,{marginTop:px2dp(2)}]}>{substr2(item.CompanyName, 15)}</BCText>
                        <BCText style={[gs.fts_12,{}]}>{substr(item.SpecName)}</BCText>
                        <View style={styles.listDetail}>
                            <View style={[styles.listDetailRight]}>
                                <View style={{flexDirection: 'row',}}>
                                    <BCText style={[gs.c_fd0319, {}]}>
                                        <BCText style={[gs.fts_15]}>￥</BCText>
                                        <BCText style={[gs.fts_15]}>{priceString}</BCText>
                                    </BCText>
                                    {
                                        item.PriceChangeReason==1?<View style={[styles.jiang]}><BCText style={[gs.fts_12,gs.c_fff]}>降</BCText></View>:null

                                    }
                                </View>

                                {/*<BCImage style={[styles.actIcon]} source={require('../imgs/drop.png')}/>*/}
                            </View>
                        </View>
                    </BCTouchable>
                    <View style={{position:'absolute',bottom:px2dp(5),right:px2dp(12)}}>
                        {this.props.IsOpen ? this.renderChooseSpecView() :
                        <SearchPageCalculate
                            ref={(c) => {
                                this._Products[item.ProductId + '-' + item.SpecId] = c;
                            }}
                            Quantity={item.Quantity}
                            Price={item.Price}
                            ProductId={item.ProductGlobalId}
                            SpecId={item.SpecId}
                            CompanyId={item.CompanyId}
                            UnitAmount={item.UnitAmount}
                            ShoppingCartId={item.ShoppingCartId}
                            OnChange={this.props.updateShoppingCart}/>}
                    </View>
                </View>
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

//热搜+历史纪录
class StackListComponent extends  Component{
    dataSource:[]
    historyRecord:[]
    isHistoryRecordVisible:false

    static propTypes = {
        dataSource:React.PropTypes.array,
        onHotSearchKeyClick:React.PropTypes.func,
        historyRecord:React.PropTypes.array,
        isHistoryRecordVisible:React.PropTypes.bool,
    }

    constructor(props) {
        super(props);
        this.state = {
            onHotSearchKeyClick:null,
            isHistoryRecordVisible:true
        }
    }
    //删除数据
    deleteData(){
        AsyncStorage.removeItem("historySearchRecord");
        this.setState({isHistoryRecordVisible:false})
    }

    //热门搜索
    renderHot(){
        return(<View style={[gs.bgc_fff, {padding: px2dp(17)}]}>
                <BCText>热门搜索</BCText>
                <View style={styles.hotView}>
                    {
                        this.props.dataSource.map((item,index)=>{
                            return (<BCTouchable key={index} style={styles.hot} onPress={() =>{
                                if(this.props.onHotSearchKeyClick){
                                    this.props.onHotSearchKeyClick(index,item)
                                }
                            }}>
                                <View >
                                    <BCText style={[gs.fts_13, gs.c_3a3838]}>{item}</BCText>
                                </View>
                            </BCTouchable>)
                        })
                    }
                </View>
            </View>)
    }
    renderHistory(){
        return(
            <View style={[styles.result,gs.bgc_fff]}>
                {
                    this.props.historyRecord?
                        this.props.historyRecord.map((item, i) => {
                            return (
                                <BCTouchable key={i} style={[styles.row, gs.bgc_fff,]} onPress={() =>{
                                    if(this.props.onHotSearchKeyClick){
                                        this.props.onHotSearchKeyClick(i,item)
                                    }
                                }}>
                                    <BCImage source={require('../imgs/time@2x.png')}></BCImage>
                                    <View  style={[styles.border, {borderBottomColor: "#e3e3e3"}]}>
                                        <BCText  style={[gs.fts_14, gs.c_3a3838, {width: deviceWidth - px2dp(39)}]}>{item}</BCText>
                                    </View>
                                </BCTouchable>


                            )
                        }):null
                }
                <View>
                    <BCTouchable style={[styles.deleteHistory, gs.bgc_fff]}
                                 onPress={() =>
                                     this.deleteData()
                                 }

                                >
                        <BCImage source={require('../imgs/delete@2x.png')}
                                 style={{marginRight: px2dp(7)}}></BCImage>
                        <BCText style={[gs.fts_13, gs.c_888]}>清空历史记录</BCText>
                    </BCTouchable>
                </View>
            </View>
        )
    }
    render(){
       return (
           <View style={{flex: 1,position:'absolute',top:Platform.OS === 'ios' ? px2dp(65) : px2dp(45),width:'100%'}}>
               {this.renderHot()}
               {this.state.isHistoryRecordVisible ? this.renderHistory():(<View></View>)}
           </View>)
    }
}

class SearchPage extends PageComponent {
    _page = 1;
    _Products = {};
    _FlatList = null;
    _Tab = null;
    _VerticalTab = null;
    GlobalDatas = {};
    Carts = [];
    _Dls = {};
    item={};
    hotSearchKeys=[];
    productCategory = [];
    // waitSearchKey:null;

    static propTypes = {
        product: React.PropTypes.object,
        OnSelect: React.PropTypes.func,
        ToPush: React.PropTypes.func,
        OnPressCalculate: React.PropTypes.func,
        totalPrice:React.PropTypes.number,
        item: React.PropTypes.object,
        OnInit: React.PropTypes.func,
        hotSearchKeys:React.PropTypes.array

    }


    constructor(props) {
        super(props);
        this.state = {
            totalPrice:0,
            dataSource:[],
            inputText: '',
            isShowHistory: false,
            value: "",
            data: [],
            searchKey:"",
            IsOpen: false,
            deleteHistory:false,
            hotSearchKeys:[],
            historyRecord:[],
            sortShow: false,
            sortWay: 0,  //0 综合排序 1价格由高到低 2价格由低到高
            searchTarget: false,   //搜索对象 false 为商品 true 为店铺
            filterShow: false,
            categoryId: null,
            minPrice: null,
            maxPrice: null,
            productType: 0,   //0 是采购 2是补货
            waitSearchKey:null,
            shadowShow: false
        }
    }

    searchProduct(empty=false){
        this._page=empty?1:this._page;
        let maxPrice = this.state.maxPrice;
        let minPrice = this.state.minPrice;
        let parentProductCategoryId = this.state.categoryId;
        let productType = this.state.productType;
        let orderBy = this.state.sortWay;
        let p = this._page;
        let companyId = this.navigation.state.params?this.navigation.state.params.sCompanyId:null;
        fetchSearchProduct({
            searchKey: this.state.waitSearchKey,
            p: p,
            // CompanyId: companyId,
            sellerCompanyId: companyId,
            pageSize: 20,
            minPrice: minPrice,
            maxPrice: maxPrice,
            productCategoryId: null,
            parentProductCategoryId: parentProductCategoryId,
            productType: productType,
            orderBy: orderBy,
            isMall: true,       //是否参与商城   true 参与 false 不参与
    }).then((ret) => {
            if (ret.data) {
                let productSource=[];
                if (empty){
                    productSource = ret.data;
                }else{
                    productSource = this.state.dataSource;
                    ret.data.map((item)=>{
                        productSource.push(item)
                    })
                }
                this.setState({
                    dataSource: productSource
                });
                // let totalMoney = 0
                ret.data.findIndex(item=> {
                    item.Specs.findIndex(row=>{
                        totalMoney += row.Quantity * row.UnitAmount * row.Price
                    });
                });
                this.setState({
                    totalPrice:totalMoney
                })
            }else{
                this.setState({
                    dataSource:[],
                    totalPrice:0
                })
            }
        }).catch((e) => {

        });
        const {dispatch} = this.props;
        dispatch(ActionShoppingCarts());
    }

    //延时搜索
    addWaitTimer=(text)=> {
        if (this.timer) {
            clearTimeout(this.timer);
        }
        if ( this.state.waitSearchKey == text) {
            this.searchProduct(true);
        } else {
            if (text) {
                this.timer = setTimeout(() => {
                    this.addWaitTimer(text);
                }, 300);
            }
        }
        this.setState({waitSearchKey: text});

    }
    //开始搜索(接口调用)
    beginSearch = (text)=> {

        this.setState({
            searchKey: text
        });
        this.addWaitTimer(text);
    }

    toIndex(){
        this.props.navigation.goBack();
    }
    //搜索框
    renderTop()  {
        return (
            <View style={{flex: 1}}>
                <View style={[styles.navigator, gs.bgc_fff, gs.bdc_bdbdbd]}>
                    <View style={styles.searchBox}>
                        <BCImage style={styles.searchIcon} source={require('../imgs/search.png')}/>
                        <TextInput
                            ref="searchKeyTextInput"
                            placeholder="输入菜品名称"
                            autoFocus={true}
                            placeholderTextColor="#999"
                            underlineColorAndroid='transparent'
                            maxLength={20}
                            style={[styles.searchBar, gs.fts_14,]}
                            value={this.state.searchKey}
                            onChangeText ={(text) => {
                                this.beginSearch(text);
                                if(!text){
                                    this.setState({
                                        dataSource: []
                                    });
                                }
                                this.setState({searchKey: text});
                            }}
                        />
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


    // 热门搜索/历史纪录
    renderSearchInput(){
         let searchKeyClick=(index,text) => {
             this.setState({searchKey:text});
             this.refs.searchKeyTextInput.focus();
             this.beginSearch(text);
         }

        return (
            <StackListComponent
                dataSource={this.state.hotSearchKeys} onHotSearchKeyClick={searchKeyClick}
                historyRecord={this.state.historyRecord}
            ></StackListComponent>)
    }


    //保存数据
    setData(text){
        let historyRecord=this.state.historyRecord
        for(let index=0;index<historyRecord.length;index++){
            if(historyRecord[index]==text){
                return false;
            }
        }
        if(historyRecord.length>4){
            historyRecord.shift();
        }
        historyRecord.unshift(text);
        AsyncStorage.setItem("historySearchRecord",JSON.stringify(historyRecord));
    }
    //给后台传热搜词
    addHotKey(searchKey){
        if(searchKey.length>1){
            fetchSearchAddHotKey(searchKey).then((ret)=>{
                return
            })
        }else{
            return false
        }
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

    //商品列表
    renderList() {
        return (
            <View style={[styles.lists, gs.bgc_fff]}>
                <View style={{height:px2dp(40),backgroundColor:'#fff',flexDirection:'row',alignItems:'center',justifyContent:'space-around',borderBottomColor:'#eee', borderBottomWidth:1,}}>
                    <BCTouchable onPress={() =>{
                        this.setState({
                            sortShow: !this.state.sortShow
                        })
                    }}><View style={{width:px2dp(100),justifyContent:'center',alignItems:'center',flexDirection:'row'}}><BCText style={gs.c_31ca96}>{this.state.sortWay==0?'综合排序':this.state.sortWay == 1?'价格由低到高':'价格由高到低'}</BCText><BCImage style={{marginLeft:px2dp(5)}} source={this.state.sortShow?require('../imgs/pull.png'):require('../imgs/pull_up.png')}/></View></BCTouchable>
                    <BCTouchable disabled = {true} onPress={() =>{
                        this.setState({searchTarget: !this.state.searchTarget});
                    }}><View style={{width:px2dp(100),alignItems:'center'}}><BCText>{this.state.searchTarget?'商品':'店铺'}</BCText></View></BCTouchable>
                    <BCTouchable onPress={() =>{
                        this.setState({filterShow: !this.state.filterShow,shadowShow:true});
                        this.refs.searchKeyTextInput.onBlur;
                    }}><View style={{width:px2dp(100),alignItems:'center',justifyContent:'center',flexDirection:'row'}}><BCText>筛选</BCText><BCImage style={{marginLeft:px2dp(5)}} source={require('../imgs/screening.png')}/></View></BCTouchable>
                </View>
                {this.state.sortShow? <View style={{position:'absolute',top:px2dp(40),zIndex:9,width:'100%',paddingBottom:px2dp(10),backgroundColor:'#fff',borderBottomWidth:1,borderBottomColor:'#eee'}}>
                    <BCTouchable style={styles.sortItem}
                       onPress={()=>{
                        this.setState({
                           sortWay: 0,
                            sortShow: false
                        });
                        this.state.sortWay = 0;
                        this.searchProduct(true);
                        this._FlatList.scrollToIndex({animated: true, index: 0});
                    }}><View style={styles.sortItemContent}><BCText style={this.state.sortWay == 0 ? gs.c_31ca96:gs.c_666}>综合排序</BCText></View></BCTouchable>
                    <BCTouchable style={styles.sortItem}
                       onPress={()=>{
                           this.setState({
                               sortWay: 1,
                               sortShow: false
                          });
                           this.state.sortWay = 1;
                           this.searchProduct(true);
                           this._FlatList.scrollToIndex({animated: true, index: 0});
                       }}><View style={styles.sortItemContent}><BCText style={this.state.sortWay == 1 ? gs.c_31ca96:gs.c_666}>价格由低到高</BCText></View></BCTouchable>
                    <BCTouchable style={styles.sortItem}
                        onPress={()=>{
                            this.setState({
                                sortWay: 2,
                                sortShow: false
                            });
                            this.state.sortWay = 2;
                            this.searchProduct(true);
                            this._FlatList.scrollToIndex({animated: true, index: 0});
                        }}><View style={styles.sortItemContent}><BCText style={this.state.sortWay == 2 ? gs.c_31ca96:gs.c_666}>价格由高到低</BCText></View></BCTouchable>
                </View> :<View/>}
                {
                    <FlatList
                        style={styles.flat}
                        initialNumToRender={5}
                        ListFooterComponent={this.renderFooter.bind(this)}
                        data={this.state.dataSource}
                        renderItem={this.renderItem.bind(this)}
                        ref={(ref) => {
                            this._FlatList = ref;
                        }}
                        keyExtractor={this.keyExtractor.bind(this)}
                        refreshing={false}
                        onEndReached={this.onEndReached.bind(this)}
                    />
                }
            </View>
        )
    }

    //商品列表Item
    renderItem(rowData) {
        const {dispatch} = this.props;
        let item = rowData.item;
        let productType=item.ProductType;
        let sCompanyId=item.CompanyId;
        let categoryId=item.CategoryId;
        let productGlobalId=item.ProductGlobalId;
        let parentCategoryId=item.ParentCategoryId;

        return <Dl
            ref={(d) => {
                this._Dls[item.ProductId] = d;
            }}
            item={item}
            dispatch={dispatch}
            updateShoppingCart={this.updateShoppingCart}
            IsOpen = {
                item.Specs&&item.Specs.length>1?true:false
            }
            OnInit={(_Product) => {
                Object.assign(this._Products, _Product)
            }}
            GoProductList={(sCompanyId) => {
                this.params&&this.params.sCompanyId?
                    this.push('ProductDetail', {productGlobalId, companyId: sCompanyId, productType: 0,fromIndex:1}):
                    this.push('ProductList', {productType:0,sCompanyId,categoryId,productGlobalId,parentCategoryId,fromWhere:3 })
                    // fromWhere 最初由谁点到ProductList界面 1:首页采购》Providers 2:首页商品图片（小） 3:首页搜索
                    this.setData(this.state.searchKey);
                    this.addHotKey(this.state.searchKey);
            }}/>
    }
    //商品列表Item key
    keyExtractor(item, index) {
        return item.ProductId + '-' + index
    }

    resetFilter(){
        this.setState({
            minPrice: null,
            maxPrice: null,
            categoryId: null,
        })
    }



    confirmFilter(){
        this.setState({filterShow:false,shadowShow:false});
        this.searchProduct(true)
    }

    底部购物车
    renderFooter() {
        return  <View style={styles.footerWrap}>
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

    renderFilter(){
        return(
            <View style={{width:'85%',height:'100%',position:'absolute',right:0,top:0,backgroundColor:'#fff',zIndex:200,borderWidth:1,borderColor:'#eee'}}>
            <KeyboardAvoidingView style={{flex:1}}  behavior="position" >
            {/*<View style={{height:'100%',width:'100%'}}>*/}
            <View style={{width:'100%'}}>
                <View style={{width:'100%',marginTop:px2dp(10),borderBottomWidth:1,borderBottomColor:'#eee'}}>
                    <BCText style={{marginLeft:px2dp(10)}}>商品分类</BCText>
                    <View style={{flexDirection:'row',flexWrap:'wrap',justifyContent: 'space-around',width:'100%',paddingBottom:px2dp(15)}}>
                        {this.state.productCategory.map((item,index)=>{
                            return(
                            <BCTouchable
                                key={index}
                                onPress={()=>{
                                this.setState({
                                    categoryId: item.CategoryId
                                })
                            }}>
                                <View style={{width:px2dp(80),height:px2dp(25),borderRadius:px2dp(2.5),backgroundColor:this.state.categoryId === item.CategoryId?'#fff':'#f0f0f0',
                                    marginTop:px2dp(15),alignItems:'center', justifyContent:'center',borderWidth:1,borderColor:this.state.categoryId === item.CategoryId?'#31ca96':'#f0f0f0'}}>
                                    <BCText style={[gs.fts_14,this.state.categoryId === item.CategoryId?gs.c_31ca96:gs.c_666]}>{item.CategoryName}</BCText>
                                </View>
                            </BCTouchable>
                            )
                        })}
                    </View>
                </View>
                <View style={{width:'100%',marginTop:px2dp(10),borderBottomWidth:1,borderBottomColor:'#eee'}}>
                    <BCText style={{marginLeft:px2dp(10)}}>价格区间(元)</BCText>
                    <View style={{flexDirection:'row',justifyContent:'space-around',alignItems:'center',marginVertical:px2dp(15)}}>
                        <TextInput placeholder={this.state.minPrice?this.state.minPrice+'':"最低价"}  keyboardType="numeric" onChangeText={(text)=>{
                            if(isNaN(text*1)){
                                toastShort('请输入正确的数字~')
                            }else {
                                this.setState({minPrice: text})
                            }}} placeholderTextColor="#999" underlineColorAndroid="transparent"
                                   maxLength={5} style={{width:'40%',height:px2dp(25),backgroundColor:'#f0f0f0',color:'#999',lineHeight:px2dp(25),borderRadius:px2dp(2.5),padding:0,textAlign:'center',alignItems:'center'}}/>
                        <BCText>-</BCText>
                        <TextInput placeholder={this.state.maxPrice?this.state.maxPrice+'':"最高价"} keyboardType="numeric" onChangeText={(text)=>{
                            if(isNaN(text*1)){
                                toastShort('请输入正确的数字~')
                            }else{
                                this.setState({maxPrice:text})
                            }}} placeholderTextColor="#999" underlineColorAndroid="transparent"
                                   maxLength={5} style={{width:'40%',height:px2dp(25),backgroundColor:'#f0f0f0',color:'#999',lineHeight:px2dp(25),borderRadius:px2dp(2.5),padding:0,textAlign:'center'}}/>
                    </View>
                </View>
            {/*</View>*/}
            </View>
            </KeyboardAvoidingView>
            <View style={{position:'absolute',bottom:0,width:'100%',flexDirection: 'row'}}>
                <BCTouchable style={{width:'50%',height:px2dp(40),backgroundColor:'#fff',borderTopWidth:1,borderTopColor:'#eee',alignItems:'center',justifyContent:'center'}}
                    onPress={()=>{this.resetFilter()}}>
                    <BCText style={[gs.c_333,gs.fts_16]}>重置</BCText>
                </BCTouchable>
                <BCTouchable style={{width:'50%',height:px2dp(40),backgroundColor:'#31ca96',alignItems:'center',justifyContent:'center'}}
                    onPress={()=>{this.confirmFilter()}}>
                    <BCText style={[gs.c_fff,gs.fts_16]}>确定</BCText>
                </BCTouchable>
            </View>
        </View>
        )
    }

    renderShadow(){
        return(
            <View style={{width:deviceWidth,height:deviceHeight,backgroundColor:'#000',opacity:.3,zIndex:100,position:'absolute',top:0,left:0}}/>
        )
    }

    //刷新
    onRefersh() {
        const {dispatch} = this.props;
        let GlobalDatas = this.GlobalDatas;

        this._page = 1;
        this.beginSearch(this.state.searchKey);
    }

    refreshView() {
        this.setState({
            dataSource: [],
            totalPrice: 0
        });
        this.onRefersh();
    }

    //加载更多
    onEndReached() {
        const {dispatch} = this.props;
        // let GlobalDatas = this.GlobalDatas;
        this._page++;
        this.searchProduct()
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
                {this.state.shadowShow?this.renderShadow():<View/>}
                {this.renderTop()}
                {(this.state.waitSearchKey && this.state.waitSearchKey.length>0) ? this.renderList() : this.renderSearchInput()}
                {(this.state.waitSearchKey && this.state.waitSearchKey.length>0) ? this.renderFooter() : null}
                {this.state.filterShow?this.renderFilter() :<View/>}
            </View>
        )
    }

    static defaultProps = {
        product: {},
    };
    _Products = {};

    WillMount(){
        AsyncStorage.getItem("historySearchRecord",(e,val)=>{
            let tempHistoryRecord=JSON.parse(val);
            this.setState({historyRecord:tempHistoryRecord?tempHistoryRecord:[]});
        });
        // const {dispatch} = this.props;
        //dispatch(ActionShoppingCarts());
        fetchSearchGetHotKeys().then((ret)=>{
            this.setState({hotSearchKeys:ret.data})
        });
        fetchProductsCategory().then((ret)=>{
            this.setState({productCategory:ret.data})
        });
    }


    WillReceive(nextProps) {
        if (nextProps.ReduceLoadShoppingCarts.datas != null && nextProps.ReduceLoadShoppingCarts.datas != this.props.ReduceLoadShoppingCarts.datas) {
            const {ReduceLoadShoppingCarts} = nextProps;
            let totalMoney=0;
            ReduceLoadShoppingCarts.datas.map((n,index)=>{
                totalMoney+=n.Amount;
            });

            this.setState({
                IsReceived: true,
                totalPrice:totalMoney,
            })
        }
        // if (nextProps.ReduceLoderProducts.datas != null && nextProps.ReduceLoderProducts.datas != this.props.ReduceLoderProducts.datas) {
        //     const {ReduceLoderProducts} = nextProps;
        //     const {bCompanyId, sCompanyId} = this.params;
        //     let {Categorys, Provider, Products, Carts} = ReduceLoderProducts.datas;
        //     if (Categorys.length) {
        //         Object.assign(this.GlobalDatas,
        //             {
        //                 Provider,
        //                 Products,
        //                 bCompanyId,
        //                 sCompanyId,
        //                 ParentCategoryId: Categorys[0].CategoryId,
        //                 CategoryId: Categorys[0].Items[0].CategoryId
        //             });
        //     }
        //     else {
        //         Object.assign(this.GlobalDatas,
        //             {
        //                 Provider,
        //                 Products,
        //                 bCompanyId,
        //                 sCompanyId,
        //                 ParentCategoryId: null,
        //                 CategoryId: null
        //             });
        //     }
        //
        //     this.Carts = Carts;
        //     this.setState({
        //         IsReceived: true,
        //         dataSource: Products
        //     });
        // }

    }
}

SearchPage.prototypes = {
    backCallBack: React.PropTypes.func.isRequired,
    goSearch: React.PropTypes.func
};

const styles = StyleSheet.create({
    main: {
        flex: 1
    },
    navigator: {
        height: Platform.OS === 'ios' ? px2dp(65) : px2dp(45),
        //justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: Platform.OS === 'ios' ? px2dp(20) : px2dp(0),
        borderBottomWidth: 1,
        borderBottomColor: '#cbcbcb',
        paddingLeft: px2dp(16),
        paddingRight: px2dp(16)
    },
    rightButton: {
        width: '13%',
        alignItems: 'center',
        height: px2dp(28),

        justifyContent: "center"
    },
    lists:{
        position:'absolute',
        top:Platform.OS === 'ios' ? px2dp(65) : px2dp(45),
        left: 0,
        width:'100%',
        height: deviceHeight-px2dp(45)-px2dp(22)-(Platform.OS === 'ios' ? px2dp(65) : px2dp(45)),
    },
    searchBox: {
        width: '87%',
        height: px2dp(28),
        alignItems: 'center',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        borderRadius: px2dp(14),
        backgroundColor: '#ececec',
    },
    searchBar: {
        color: '#999',
        marginLeft: px2dp(6),
        padding: 0,
        width: '80%',
    },
    searchIcon: {
        width: px2dp(16),
        height: px2dp(17),
        marginLeft: px2dp(8)
    },
    //热门
    hot: {
        //width: px2dp(80),
        paddingLeft:px2dp(7),
        paddingRight:px2dp(7),
        height: px2dp(28),
        borderWidth: px2dp(1),
        borderColor: "#bdbdbd",
        borderRadius: 14,
        marginRight: px2dp((deviceWidth - 320 - 17) / 5),
        justifyContent: "center",
        alignItems: "center",
        marginTop: px2dp(16)
    },
    hotView: {
        flexDirection: "row",
        flexWrap: "wrap",
    },

    //历史
    row: {
        height: px2dp(40),
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: px2dp(16)
    },
    border: {
        width: deviceWidth - px2dp(39),
        borderBottomWidth: px2dp(1),
        height: px2dp(39),
        justifyContent: "center",
        borderBottomColor: "#fff",
        marginLeft: px2dp(10)
    },
    deleteHistory: {
        height: px2dp(40),
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    historyTitle: {
        borderBottomColor: '#ccc',
        borderBottomWidth: 0.5,
        width: deviceWidth - 15 - 10 - 16,
        marginLeft: 10,
        paddingTop: 15,
        paddingBottom: 15
    },
    clearHistoryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        borderBottomColor: '#ccc',
        borderBottomWidth: 0.5,
    },
    keywordsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    sortItem:{
        width:'100%',
        height:px2dp(40),
    },
    sortItemContent:{
        width:'90%',
        height:'100%',
        marginLeft:'5%',
        paddingRight:'5%',
        borderBottomColor:'#eee',
        borderBottomWidth:1,
        justifyContent: 'center',
    },
    result: {
        marginTop: px2dp(10),
        borderColor: '#ccc',
        borderTopWidth: 1,
    },
    item: {
        fontSize: px2dp(16),
        padding: 5,
        paddingTop: 10,
        paddingBottom: 10,
        borderWidth: px2dp(1),
        borderColor: '#ddd',
        borderTopWidth: 0,
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
        borderBottomWidth:1,
        borderBottomColor: '#eee'
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
        marginVertical: px2dp(5),
        height: px2dp(22),
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
        zIndex: 100,
    },
    footer: {
        width: '100%',
        height: px2dp(45),
        flexDirection: 'row',
        overflow: 'visible',
        justifyContent: 'flex-end',
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#eee'
    },
    noProducts: {
        width: '100%',
        height: px2dp(45),
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

});

function mapSearchPage(store) {
    return {
        // ReduceLoderProducts: store.ReduceLoderProducts,
        ReduceSearchProduct:store.ReduceSearchProduct,
        ReduceLoadShoppingCarts: store.ReduceLoadShoppingCarts,
        ReduceInsertOrUpdateShoppingCart: store.ReduceInsertOrUpdateShoppingCart,
        ReduceDeleteShoppingCarts: store.ReduceDeleteShoppingCarts
    }
}



const connectProductList= connect(mapSearchPage)(SearchPage);
connectProductList.navigationOptions = NavigationOptions;
export default connectProductList;