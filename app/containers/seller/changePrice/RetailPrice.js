/**
 * Created by Administrator on 2017/5/25. 零售改价
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
    AsyncStorage,
    FlatList,
    Keyboard,
    KeyboardAvoidingView,
} from 'react-native';
import ReactNative from 'react-native';
import BaseComponent, {
    deviceWidth,
    px2dp,
    BCText,
    BCImage,
    BCHostImage,
    BCTouchable,
    substr,
    deviceHeight,
    NavigationOptions,
} from '../../../BaseComponent';
import PageComponent from '../../PageComponent'
import gs from '../../../styles/MainStyles';
import {PullViewComponent, PullListComponent} from '../../PageComponent'
import ScrollableTabView, {ScrollableTabBar, DefaultTabBar}  from 'react-native-scrollable-tab-view';
import {connect} from "react-redux";
import {
    ActionLoaderRetailPrice,
    ActionRetailPrice,
    ActionUpdateRetailPrice,
    EditPrice
}  from '../../../actions/RetailPriceAction';
import {fetchUpdateRetailPrice} from '../../../services/RetailPriceServices'
import {toastLong} from '../../../utils/ToastUtil';
import Tab, {HorizontalTab} from '../../../components/Tab';
import {toDecimal2} from '../../../utils/FormatUtil';
let dismissKeyboard = require('dismissKeyboard');
//输入框
class TextInputItem extends Component {
    static defaultProps = {
        Quantity: 0,
        List: {},
        SpecName:null
    };
    static propTypes = {
        Quantity: React.PropTypes.number,
        OnChange: React.PropTypes.func,
        SpecId: React.PropTypes.number,
        PurchaseOrderLineId: React.PropTypes.number,
        _UpdateRetailPrice: React.PropTypes.func,
        _scrollTo: React.PropTypes.func,
        scrollViewTo: React.PropTypes.func,
        SpecName:React.PropTypes.string,
    };

    constructor(props) {
        super(props);
        this.state = {
            quantity: props.Quantity,
            ifZero: false,
            List: props.List,
            SpecName:props.SpecName
        };
        this.pageY = 0;
    }

    dataSource = null;
    _TextInput = null;


    render() {
        let p = this.props.List;
        let productGlobalId = p.ProductGlobalId;
        let refId = this.props.Key;
        return (
            <View
                style={{flexDirection:'row',justifyContent:'flex-end'}}
                onStartShouldSetResponderCapture={(e) => {
                    dismissKeyboard();
                    const target = e.nativeEvent.target;
                    this.pageY = e.nativeEvent.pageY;
                    if (target !== ReactNative.findNodeHandle(this._TextInput)) {
                        this._TextInput.blur();
                    }
                }}>
                <View style={{width:px2dp(56),height:px2dp(1),backgroundColor:'#000',position:'absolute',bottom:px2dp(8),right:px2dp(6)}}/>
                <BCText style={{position:'absolute',top:px2dp(10),right:px2dp(-32),color:'#565454'}} >
                    元/{this.state.SpecName}</BCText>
                <TextInput
                    ref={(c) => {
                        if (c !== null) {
                            this._TextInput = (c);
                        }
                    }}
                    style={[gs.fts_14, gs.c_3a3838, {
                        padding: 0,
                        margin: 0,
                        width: px2dp(60),
                        height: px2dp(40),
                        textAlign: "right",
                        paddingRight:px2dp(8),
                        marginRight:px2dp(10),
                        // borderBottomStyle:'solid',
                        // borderBottomWidth:px2dp(1),
                        // borderBottomColor:'#000',
                    }]}
                    underlineColorAndroid='transparent'
                    keyboardType='numeric'
                    maxLength={6}
                    key={refId}
                    onFocus={this.props.scrollViewTo.bind(this.pageY, this)}
                    onEndEditing={(text) => {
                        let SpecId = p.SpecPrices.SpecId;
                        let price = toDecimal2(text.nativeEvent.text);
                        var re = /^[0-9]+.?[0-9]*$/;
                        if (price != "") {
                            if (!re.test(price)) {
                                if (Platform.OS === "ios") {
                                    toastLong("请输入正确的数字")
                                } else {
                                    toastLong("请输入正确的数字");
                                }
                                price = "";
                                this.setState({
                                    quantity: 0
                                });
                            }
                            else if (parseFloat(price) > 9999) {
                                this.setState({
                                    quantity: 9999
                                });
                                price = 9999;
                                this.props._UpdateRetailPrice(productGlobalId, SpecId, price);
                            }
                            else {
                                this.props._UpdateRetailPrice(productGlobalId, SpecId, price);
                            }
                        }
                        this.props._scrollTo();
                        //this.refs.scroll.scrollTo({y:0,x:0,animated:true})
                    }}
                    onChangeText={(text) => {
                        var re = /^[0-9]+.?[0-9]*$/;
                        if (text != "") {
                            if (!re.test(text)) {
                                //alert("请输入正确的数字");
                                text = "";
                                this.setState({
                                    quantity: 0
                                });
                            }
                            if (parseFloat(text) > 9999) {
                                this.setState({
                                    quantity: 9999
                                });
                                text = 9999;
                            }
                        }
                        toDecimal2(parseFloat(text));
                    }}
                    /* value={toDecimal2(this.state.quantity)}*/
                    defaultValue={toDecimal2(this.state.quantity)}
                />
            </View>
        )
    }

    onInput(num) {
        if (num == this.state.quantity) {
            return false
        }
        else {
            this.setState({
                quantity: num
            });
        }

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.Quantity != this.props.Quantity) {
            this.setState({
                quantity: nextProps.Quantity,
            })
        }
    }
}

class RetailPrice extends PageComponent {
    GlobalDatas = {};
    _page = 1;

    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            keyboardSpace: 0,
            viewHeight:0,
            upDrop:0,  //控制键盘上拉
            keyboardHeight: 225 //键盘高度
        };
        this.ParentCategoryId = 0;
        this.CategoryId = 0;
        // this.contentHeight = 0;
        // this._TextInput = null;//当前编辑的textInput
        // this.moveH = 0;//ScrollView滑动的距离
        // this.lastMoveH = 0;//保留上次滑动的距离
        // this.needMove = false;//弹出键盘时，textInputView是否需要滑动
        // this.target = 0;//当前input的高度
        // this.pageY = 0;//当前input的高度
        // this.showFoot = false;//底部
    }

    _TextInput = null;
    _FlatList = null;
    _Tab = null;
    _HorizontalTab = null;
    _TextInputItem = null;
    _ScrollView = null;
    //设置页面标题
    setTitle() {
        return "零售改价"
    }

    rightType() {
        return 'imgSearch'
    }

    //点击搜索
    goSearch() {
        this.push('RetailPriceSearch', {callBack: this.refeshView.bind(this)})
    }
    Top() {
        let {Products, Categorys} = this.GlobalDatas;
        let GlobalDatas = this.GlobalDatas;
        let categorys = GlobalDatas.Categorys;
        let categoryArray = categorys[0].Items;
        return (
            <View>
                <Tab
                    ref={(t) => {
                        this._Tab = t
                    }}
                    Style={1}
                    Items={categorys}
                    OnPress={(i, categoryId) => {
                        const {dispatch} = this.props;
                        let GlobalDatas = this.GlobalDatas;

                        GlobalDatas.ParentCategoryId = categoryId;
                        GlobalDatas.ChildCategoryId = GlobalDatas.Categorys[i].Items[0].CategoryId;

                        this._HorizontalTab.state.Items = GlobalDatas.Categorys[i].Items;
                        this._HorizontalTab.reLoad();
                        this._page = 1;
                        dispatch(ActionRetailPrice({
                            parentCategoryId: categoryId,
                            categoryId: GlobalDatas.ChildCategoryId,
                            isActive: GlobalDatas.isActive
                        }));
                    }}/>

                <HorizontalTab Items={categoryArray}
                               ref={(h) => {
                                   this._HorizontalTab = h
                               }}
                               OnPress={(i, categoryId, pid) => {
                                   const {dispatch} = this.props;
                                   let GlobalDatas = this.GlobalDatas;
                                   GlobalDatas.ChildCategoryId = categoryId;
                                   GlobalDatas.ParentCategoryId = pid;
                                   this._page = 1;
                                   dispatch(ActionRetailPrice({
                                       parentCategoryId: pid,
                                       categoryId: categoryId,
                                       isActive: GlobalDatas.isActive
                                   }));
                               }}/>
            </View>
        )
    }

    renderCategory(categorys){
        let categoryArray = categorys[0].Items;
        return (
            <View>
                <Tab
                    ref={(t) => {
                        this._Tab = t
                    }}
                    Style={1}
                    Items={categorys}
                    OnPress={(i, categoryId) => {
                        const {dispatch} = this.props;
                        let GlobalDatas = this.GlobalDatas;

                        GlobalDatas.ParentCategoryId = categoryId;
                        GlobalDatas.ChildCategoryId = GlobalDatas.Categorys[i].Items[0].CategoryId;

                        this._HorizontalTab.state.Items = GlobalDatas.Categorys[i].Items;
                        this._HorizontalTab.reLoad();
                        this._page = 1;
                        dispatch(ActionRetailPrice({
                            parentCategoryId: categoryId,
                            categoryId: GlobalDatas.ChildCategoryId,
                            isActive: GlobalDatas.isActive
                        }));
                    }}/>

                <HorizontalTab Items={categoryArray}
                               ref={(h) => {
                                   this._HorizontalTab = h
                               }}
                               OnPress={(i, categoryId, pid) => {
                                   const {dispatch} = this.props;
                                   let GlobalDatas = this.GlobalDatas;
                                   GlobalDatas.ChildCategoryId = categoryId;
                                   GlobalDatas.ParentCategoryId = pid;
                                   this._page = 1;
                                   dispatch(ActionRetailPrice({
                                       parentCategoryId: pid,
                                       categoryId: categoryId,
                                       isActive: GlobalDatas.isActive
                                   }));
                               }}/>
            </View>
        )
    }

    renderContent(Products) {
        const {dispatch} = this.props;
        return (
            <View style={[styles.outView]}>
                <View style={styles.TitleStyle}>
                    <View style={[styles.itemLeftCaiMing,{marginLeft:px2dp(23)}]}><BCText
                        style={[gs.fts_14, gs.c_fff]}>商品</BCText></View>
                    <View style={styles.itemRight}><BCText
                        style={[gs.fts_14, gs.c_fff]}>零售价</BCText></View>
                </View>
                {this.renderList(Products)}
                {Platform.OS==='ios'?<View style={{width:'100%',height:0}}></View>:
                <View style={{
                    width: '100%',
                    height: this.state.keyboardSpace - px2dp(40),
                    //height: 238,
                    backgroundColor: '#fff',
                    opacity:0.1,
                }}>
                </View>}
            </View>
        )
    }

    content() {
        let {Products, Categorys} = this.GlobalDatas;
        return (
            <View style={[styles.main, gs.bgc_f2f1ef]}>
                {/*{this.renderCategory(Categorys)}*/}
                {this.renderContent(Products)}
            </View>
        )
    }



    //商品列表
    productList(rowData) {
        const {dispatch} = this.props;
        let p = rowData.item;
        let i = rowData.index;
        let productGlobalId = p.ProductGlobalId;
        return (
            <View key={i}
                  style={[styles.ItemStyle, i % 2 === 0 ? gs.bgc_fff : gs.bgc_f2f1ef]}>
                <View style={styles.itemLeftCaiMing}>
                    {(p.ProductName.length+p.SpecPrices.SpecName.length)<=16?
                        <View style={{flex: 1, flexDirection: 'row',alignItems: 'center',marginLeft:px2dp(18)}}>
                            <BCText style={[gs.fts_14, gs.c_3a3838]}>{p.ProductName}</BCText>
                            <BCText style={[gs.fts_12, gs.c_3a3838]}>({p.SpecPrices.SpecName})</BCText>
                        </View>:
                        <View style={{marginLeft:px2dp(18)}}>
                            <BCText style={[gs.fts_14, gs.c_3a3838]}>{p.ProductName}</BCText>
                            <BCText style={[gs.fts_12, gs.c_3a3838]}>({p.SpecPrices.SpecName})</BCText>
                        </View>
                    }
                </View>
                <View style={[styles.itemRight,{paddingRight:px2dp(50)}]}>
                    <TextInputItem
                        style={{textDecorationLine:'underline',textDecorationStyle:'solid',textDecorationColor:'#3a3838',width:px2dp(50),}}
                        ref={(c) => {
                            if (c !== null) {
                                this._TextInputItem = (c);
                            }
                        }}
                        List={p}
                        Quantity={p.SpecPrices.Price}
                        SpecName={p.SpecPrices.Unit}
                        key={i}
                        _UpdateRetailPrice={(productGlobalId, SpecId, price) => {
                            dispatch(ActionUpdateRetailPrice({productGlobalId, SpecId, price}));
                        }
                        }
                        _scrollTo={() => {
                            //当编辑结束时
                        }}
                        scrollViewTo={(e) => {
                                    if(e.pageY>deviceHeight-this.state.keyboardHeight-50){
                                        let h = Platform.OS === "ios"?parseInt(e.pageY-(deviceHeight-this.state.keyboardHeight)+50)
                                            :parseInt(e.pageY-(deviceHeight-this.state.keyboardHeight));
                                        this.setState(({
                                            upDrop : h
                                        }))
                                    }else{
                                        let h = Platform.OS === "ios"? 0: -50;
                                        this.setState(({
                                            upDrop : h
                                        }))
                                    }
                        }}
                    />
                </View>
            </View>
        )
    }
    //商品列表
    renderList() {
        return (
            <View style={[gs.bdc_fff, {
                marginBottom: px2dp(15), flex: 1,overflow:'hidden'
            }]}>
                <KeyboardAvoidingView keyboardVerticalOffset={this.state.upDrop} behavior={"position"}>
                    <FlatList
                        initialNumToRender={10}
                        keyboardDismissMode='interactive'
                        contentInset={{bottom: this.state.keyboardSpace - px2dp(0)}}
                        onContentSizeChange={(contentWidth, contentHeight) => {
                            this.contentHeight = parseInt(contentHeight + this.state.keyboardSpace);
                        }}
                        onScrollEndDrag={(e) => {
                            this.moveH = e.nativeEvent.contentOffset.y;
                        }}
                        data={this.state.dataSource}
                        renderItem={this.productList.bind(this)}
                        ref={(ref) => {
                            this._FlatList = ref;
                        }}
                        keyExtractor={this.keyExtractor.bind(this)}
                        onRefresh={this.onRefersh.bind(this)}
                        refreshing={false}
                        onEndReached={this.onEndReached.bind(this)}
                    />
                </KeyboardAvoidingView>
            </View>
        )
    }

    //商品列表Item key
    keyExtractor(item, index) {
        return item.ProductGlobalId + '-' + index
    }

    onRefersh() {
        const {dispatch} = this.props;
        let GlobalDatas = this.GlobalDatas;
        this._page = 1;
        this.showFoot = false;

        dispatch(ActionRetailPrice({
            parentCategoryId: GlobalDatas.ParentCategoryId,
            categoryId: GlobalDatas.ChildCategoryId,
        }));
    }

    refeshView() {
        this.onRefersh();
    }

    onEndReached() {
        const {dispatch} = this.props;
        let GlobalDatas = this.GlobalDatas;
        dispatch(ActionRetailPrice(
            {
                parentCategoryId: GlobalDatas.ParentCategoryId,
                categoryId: GlobalDatas.ChildCategoryId,
                /*parentCategoryId: GlobalDatas.Categorys[0].CategoryId,
                categoryId: GlobalDatas.Categorys[0].Items[0].CategoryId,*/
                p: ++this._page
            }));
    }

    _keyboardDidShow(e){
        if(this.state.keyboardHeight !== e.endCoordinates.height) {
            this.setState({
                keyboardHeight: e.endCoordinates.height
            })
        }
    }

    _keyboardDidHide(e){
        this.setState({
            // upDrop:0
        })
    }

    WillMount() {
        const {dispatch} = this.props;
        dispatch(ActionLoaderRetailPrice());
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    WillReceive(nextProps) {
        if (nextProps.ReduceLoaderRetailPrice.datas != null && nextProps.ReduceLoaderRetailPrice.datas != this.props.ReduceLoaderRetailPrice.datas) {
            const {ReduceLoaderRetailPrice} = nextProps;
            const Categorys = ReduceLoaderRetailPrice.datas.Categorys;
            const products = ReduceLoaderRetailPrice.datas.Products;
            let dataSource = this.state.dataSource;
            this.GlobalDatas.Categorys = Categorys;
            this.GlobalDatas.Products = products;
            this.GlobalDatas.ParentCategoryId = Categorys[0].CategoryId;
            this.GlobalDatas.ChildCategoryId = Categorys[0].Items[0].CategoryId;

            this.setState({
                IsReceived: true,
                dataSource: products,
                FlatListHeight: deviceHeight - (Platform.OS === 'ios' ? px2dp(10) : px2dp(45) ) - px2dp(150)
            });
        }
        if (nextProps.ReduceRetailPrice.datas != null && nextProps.ReduceRetailPrice.datas != this.props.ReduceRetailPrice.datas) {
            const {ReduceRetailPrice} = nextProps;
            const products = ReduceRetailPrice.datas.Products;
            //var products = ReduceRetailPrice.datas;
            if (products.length <= 0 && this._page > 1) {
                this.showFoot = true;
                //toastLong('亲，已经到底啦');
            }
            let Products = this.GlobalDatas.Products;
            if (this._page > 1) {
                if (products) {

                    products.map((product, index) => {
                        Products.push(product)
                    })
                }

            }
            else {
                Products = products
            }
            Object.assign(this.GlobalDatas, {Products})
            this.setState({
                dataSource: Products,
            });
        }
    }
}

const styles = StyleSheet.create({
    main: {
        //flex:1,
        height: deviceHeight - px2dp(60),
    },
    outView: {
        // width: px2dp(330),
        // marginLeft: px2dp(23),
        // marginRight: px2dp(23),
        // borderRadius: px2dp(8),
        backgroundColor: '#fff',
        marginBottom: px2dp(40),
        height: deviceHeight - px2dp(180),
        //flex: 1,
    },
    TopView: {
        width: px2dp(330),
        marginLeft: px2dp(23),
        marginRight: px2dp(23),
        // borderRadius: px2dp(8),
        backgroundColor: '#fff',
        //flex: 1,
    },
    TitleStyle: {
        width: '100%',
        height: px2dp(36),
        backgroundColor: '#31CA96',
        // borderTopLeftRadius: px2dp(4),
        // borderTopRightRadius: px2dp(4),
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    ItemStyle: {
        width: '100%',
        height: px2dp(35),
        //backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
    },
    LastStyle: {
        width: '100%',
        height: px2dp(35),
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        // borderBottomLeftRadius: px2dp(4),
        // borderBottomRightRadius: px2dp(4)
    },
    item:{
        width: '50%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    itemLeft: {
        width: '70%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    itemLeftCaiMing: {
        width: '70%',
        justifyContent: 'center',
        // alignItems: 'center',
    },
    itemRight: {
        width: '30%',
        justifyContent: 'center',
        alignItems: 'center',
    }
});

function mapStateToProps(store) {
    return {
        ReduceLoaderRetailPrice: store.ReduceLoaderRetailPrice,
        ReduceRetailPrice: store.ReduceRetailPrice
    }
}
const connectProviders = connect(mapStateToProps)(RetailPrice);
connectProviders.navigationOptions = NavigationOptions;
export default connectProviders;