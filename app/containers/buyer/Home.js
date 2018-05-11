/**
 * Created by sencha on 2017/3/29.
 */
import React from 'react';

import {connect, Provider} from 'react-redux';
import {StyleSheet, View, TextInput, Platform, ScrollView,FlatList,Alert,AsyncStorage,Linking} from 'react-native';
import {px2dp,px2dpH, deviceWidth, BCText, BCTouchable, BCImage, BCHostImage,BCHostImageNew,substr,substr2,version} from '../../BaseComponent';
import {toDecimal2} from "../../utils/FormatUtil";
import {PullViewComponent} from '../PageComponent';
import gs from '../../styles/MainStyles';
import {ActionLoadMallProducts, ActionLoadMallAd, ActionLoadMallAdPC} from '../../actions/ProductAction';
import {fetchVersion,fetchHeader}from '../../services/BuyerIndexService'
import {ActionSelectIndexRecommend} from '../../actions/BuyerIndexAction';
import Swiper from 'react-native-swiper';
import {deviceHeight} from "../../utils/CommonFuns";
import {getDateStr, Today} from "../../utils/CommonFuns";

class Home extends PullViewComponent {
    tools = [{
        'text': '商品分类',
        'routeName': 'ClassifyList',
        'source': require('../../imgs/fenlei.png')
    }, {
        'text': '我的订单',
        'routeName': 'PurchaseOrderList',
        'source': require('../../imgs/dingDan.png')
    }, {
        'text': '附近店铺',
        'routeName': 'Providers',
        'source': require('../../imgs/fujindianpu.png')
    }, {
        'text': '商品比价',
        'routeName': 'PriceParity',
        'source': require('../../imgs/bijia.png')
    }, {
        'text': '补货',
        'routeName': 'ReplenishCompanys',
        'source': require('../../imgs/buhuoIcon.png')
    }, {
        'text': '账期结算',
        'routeName': 'AccountPay',
        'source': require('../../imgs/jiesuan.png')
    },{
        'text': '采购统计',
        'routeName': 'ProductPurchaseAmount',
        'source': require('../../imgs/caigoutongji.png')
    },{
        'text': '餐饮服务',
        'routeName': 'AddTodo',
        'source': require('../../imgs/fuwu.png')
    }]


    owners = [{
        'ProductName': '澳大利亚牛肉鹈',
        'Image': '/Upload/ProductGlobalIco/A904BFEF8A09934336F9E96B34C06AFD.jpg'
    }, {
        'ProductName': '五花肉',
        'Image': '/Upload/ProductGlobalIco/A904BFEF8A09934336F9E96B34C06AFD.jpg'
    }, {
        'ProductName': '新西兰牛肉',
        'Image': '/Upload/ProductGlobalIco/A904BFEF8A09934336F9E96B34C06AFD.jpg'
    }, {
        'ProductName': '肌肉',
        'Image': '/Upload/ProductGlobalIco/A904BFEF8A09934336F9E96B34C06AFD.jpg'
    }, {
        'ProductName': '猪肉',
        'Image': '/Upload/ProductGlobalIco/A904BFEF8A09934336F9E96B34C06AFD.jpg'
    }]
    poops = [{
        'text': '澳大利亚牛肉',
        'source': '/Upload/ProductGlobalIco/A904BFEF8A09934336F9E96B34C06AFD.jpg'
    }, {
        'text': '五花肉',
        'source': '/Upload/ProductGlobalIco/A904BFEF8A09934336F9E96B34C06AFD.jpg'
    }, {
        'text': '新西兰牛肉',
        'source': '/Upload/ProductGlobalIco/A904BFEF8A09934336F9E96B34C06AFD.jpg'
    }, {
        'text': '肌肉',
        'source': '/Upload/ProductGlobalIco/A904BFEF8A09934336F9E96B34C06AFD.jpg'
    }, {
        'text': '猪肉',
        'source': '/Upload/ProductGlobalIco/A904BFEF8A09934336F9E96B34C06AFD.jpg'
    }]
    images = [
        {'source': '/Upload/AD/xsb.jpg'},
        {'source': '/Upload/AD/hngj.jpg'},
        {'source': '/Upload/AD/zywss.jpg'}

    ]

    constructor(props, context) {
        super(props, context);
        this.state = {
            city: '杭州',
            IsReceived: true,
            owners: [],
            Price:[],
            big:[],
            swiperShow:false,
            _FlatList:null,
            showRecomm:false,
            versionNew:false,
            bannerData:[],
            imageHeight:px2dp(120),
        }


    }
    ////////////////////////////////////////// swiper 与 scrollview 该属性冲突 为true时 导致无法轮播

    setIsRemoveClippedSubviews()
    {
        return false;
    }
    //////////////////////////////////////////
    refeshView() {
        const {dispatch} = this.props;
        if (this.props.currentEmployee.token) {
            dispatch(ActionLoadMallProducts(AreaId=this.state.areaId));

        }
        dispatch(ActionLoadMallAdPC({type:0}));
        dispatch(ActionLoadMallAd({type:1}));
    }
    renderNavigator() {
        const {dispatch, num, currentEmployee} = this.props
        return (
            <View style={[header.top, gs.bgc_BaseColor]}>
                <BCTouchable style={header.location}
                    onPress={() => {
                         this.push('SelectCity', {
                             changeCity: (city) => {
                                 this.state.areaId=city.AreaId
                                 this.state.city=city.AreaName
                                this.setState({city: city.AreaName,areaId:city.AreaId})
                             },callBack: this.refeshView.bind(this)
                         })
                     }}
                >
                    <BCText style={[gs.c_fff, gs.fts_15]}>{substr2(this.state.city,4)}</BCText>
                    <BCImage style={header.icon} source={require('../../imgs/Arrow.png')}></BCImage>
                </BCTouchable>

               <BCTouchable style={[header.search,{backgroundColor:'#21bd88'}]}
                             onPress={() => {
                                 this.push('SearchPage', { needLogin: true,callBack: this.refeshView.bind(this) })
                             }}>
                    <BCText style={[gs.c_fff, gs.fts_15]}>请输入菜品名称</BCText>
                </BCTouchable>
                {/*<BCText style={header.Text_title}>报菜郎商城</BCText>*/}

                <BCTouchable style={header.message} onPress={() => {
                    this.push('TradeLogistics', {needLogin: true})
                }}>
                    <BCImage source={require('../../imgs/information.png')}></BCImage>
                </BCTouchable>
            </View>
        )
    }

    renderTopTools() {
        const {dispatch, num, currentEmployee} = this.props
        return (
            <View style={[header.content, gs.bgc_BaseColor]}>
                <BCTouchable
                    onPress={() => {
                        this.push('Providers', {needLogin: true,})
                    }}
                    style={header.item}>
                    <BCImage source={require('../../imgs/Purchase.png')}></BCImage>
                    <BCText style={[header.item_text, gs.c_fff, gs.fts_16]}>采购</BCText>
                </BCTouchable>
                <BCTouchable
                    onPress={() => {
                        this.push('PriceParity', {needLogin: true})
                    }}
                    style={header.item}>
                    <BCImage source={require('../../imgs/Parity.png')}></BCImage>
                    <BCText style={[header.item_text, gs.c_fff, gs.fts_16]}>比价</BCText>
                </BCTouchable>
                <BCTouchable onPress={() => {
                    this.push('ReplenishCompanys', {needLogin: true})
                }} style={header.item}>
                    <BCImage source={require('../../imgs/replenishment.png')}></BCImage>
                    <BCText style={[header.item_text, gs.c_fff, gs.fts_16]}>补货</BCText>
                </BCTouchable>
            </View>
        )
    }

    renderTools({text, source, routeName}, index) {
        return (
            <BCTouchable style={content.tool_item} key={index} onPress={() => {
                if (routeName == 'AlwaysBuy') {
                    this.push(routeName, {needLogin: true, pageFrom: 'index',enterType:1});
                }
                else {
                    this.push(routeName, {needLogin: true})
                }
            }}>
                {/*<BCImage source={source}></BCImage>*/}
                <BCHostImage resizeMode='contain' style={{width:'40%',height:'40%'}} source={{uri: source}}></BCHostImage>
                <BCText style={[content.tool_item_text, gs.c_3a3838]}>{text}</BCText>
            </BCTouchable>
        )
    }

    //设置title

    // renderTitle(title) {
    //     return (
    //             title==="自营食材"?
    //             <BCTouchable style={[content.title]} onPress={() => {
    //                 this.push('MallProducts', {needLogin: true})
    //             }}>
    //                 <BCImage source={require('../../imgs/Red.png')}></BCImage>
    //                 <BCText style={[content.title_text, gs.fts_14, gs.bold]}>{title}</BCText>
    //             </BCTouchable>:
    //             <View style={[content.title]}>
    //                 <BCImage source={require('../../imgs/Red.png')}></BCImage>
    //                 <BCText style={[content.title_text, gs.fts_14, gs.bold]}>{title}</BCText>
    //             </View>
    //     )
    // }

    //自营食材

    renderOwnerProduct() {
        return (
            <View style={[content.owner_product]}>
                {
                    this.state.owners.map((owner, index) => {
                        let productGlobalId=owner.ADINNERURL*1;
                        let companyId=owner.CompanyId;
                        let productType=owner.ProductType;
                        let type=1
                        if (index > 5) {
                            return false
                        }
                        return (
                            <BCTouchable style={content.owner_product_item} key={index} onPress={() => {
                                //this.push('MallProducts', {needLogin: true})
                                this.push('ProductDetail', {
                                    productGlobalId,
                                    companyId:companyId,
                                    productType:productType,
                                    isActive: true,
                                    type,
                                    needLogin:true
                                    //sActive,
                                    //callBack: this.refeshView.bind(this)
                                });
                            }}>
                                <BCHostImage
                                    resizeMode='contain'
                                    style={[{width: px2dp(120), height: px2dp(120)}]}
                                    //source={{uri: owner.Image}}
                                    source={{uri: owner.ADIMAGE}}

                                />
                                <View style={[content.product_item_title, gs.bgc_000]}>
                                    <BCText style={[gs.c_fff, gs.fts_14]}>{owner.ProductName}{owner.ADSUBJECT}</BCText>
                                </View>
                            </BCTouchable>
                        )
                    })
                }
            </View>
        )
    }



    //改版 ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓

    renderFenLeiList() {
        return (
            <View style={[{flexDirection: 'row'}]}>
                <FlatList
                    initialNumToRender={5}
                    // ListFooterComponent={this.renderFooter.bind(this)}
                    data={this.state.TuPianData}
                    renderItem={this.renderItem.bind(this)}
                    ref={(ref) => {
                        this._FlatList = ref;
                    }}
                    keyExtractor={this.keyExtractor.bind(this)}
                    // onRefresh={this.onRefersh.bind(this)}
                    refreshing={false}
                    onEndReached={this.onEndReached.bind(this)}
                />
            </View>
        )
    }

    renderItem(){
        return(
            <View>
                {
                    this.state.TuPianData.map((Data, index) => {
                        let BCompanyId=Data.BCompanyId;
                        let SCompanyId=Data.SelectIndexRecommend[0].CompanyId

                        return(
                            <View style={{width: '100%',}} key={index}>
                                <BCTouchable style={[{height: px2dp(150), width: deviceWidth,}]}
                                    onPress={()=>{
                                        this.push('ClassifyList', {
                                            recommendId:Data.GlobalCategoryId,
                                            needLogin: true,
                                        });
                                    }}
                                >

                                    <BCHostImage
                                        resizeMode='contain'
                                        style={{width: deviceWidth, height: px2dp(150),marginTop:px2dp(-3)}}
                                        source={{uri: Data.CategoryImage}}
                                    ></BCHostImage>

                                </BCTouchable>

                                <ScrollView style={{paddingLeft:px2dp(5),paddingRight:px2dp(5)}}
                                    horizontal={true} showsHorizontalScrollIndicator={false}
                                            removeClippedSubviews={false}>
                                    {
                                        Data.SelectIndexRecommend.map((SelectIndexRecommend, index) => {
                                            let ProductImage = SelectIndexRecommend.ProductImage;
                                            let ProductName = SelectIndexRecommend.ProductName;
                                            let Price = SelectIndexRecommend.Price;
                                            let companyId=SelectIndexRecommend.CompanyId;
                                            let categoryId=SelectIndexRecommend.CategoryId2;
                                            let parentCategoryId=SelectIndexRecommend.ParentCategoryId;
                                            let productGlobalId=SelectIndexRecommend.ProductlId;
                                            let productType=0;

                                            if (index > 6) {
                                                return false
                                            }

                                            return (
                                                <View style={{marginTop: px2dp(5)}} key={index}>
                                                    <BCTouchable style={content.owner_product_item} key={index} onPress={() => {
                                                        // this.push('ProductDetail', {
                                                        //     productGlobalId,
                                                        //     companyId: companyId,
                                                        //     productType: productType,
                                                        //     fromWhere:2,        // fromWhere 最初由谁点到ProductList界面 1:首页采购》Providers 2:首页商品图片（小） 3:首页搜索
                                                        //     fromIndex:0,    //判断‘店铺’按钮是push（‘ProductList’）还是goBack  0是goBack
                                                        //     needLogin: true,
                                                        //     // callBack: null
                                                        // });
                                                        this.push('ProductList', {
                                                            productType: productType,
                                                            sCompanyId: companyId,
                                                            categoryId,
                                                            parentCategoryId,
                                                            productGlobalId,
                                                            fromWhere:2 });
                                                    }}>
                                                        <BCHostImage
                                                            resizeMode='contain'
                                                            style={[{width: px2dp(92), height: px2dp(92),borderWidth:1,borderColor:'#eee'}]}
                                                            source={{uri: ProductImage}}
                                                        />
                                                        <View style={[{
                                                            height: px2dp(50),
                                                            width: px2dp(86),
                                                            flexDirection: 'column',
                                                            alignItems: 'center',
                                                            marginTop: px2dp(5)
                                                        }]}>
                                                            <BCText style={[gs.fts_13, {width: px2dp(90), color: '#333'}]}
                                                                    numberOfLines={1}>{ProductName}</BCText>
                                                            <BCText style={[gs.fts_13, {width: px2dp(90), color: '#fd3546'}]}
                                                                    numberOfLines={1}>￥{toDecimal2(Price)}</BCText>
                                                        </View>
                                                    </BCTouchable>
                                                </View>
                                            )
                                        })
                                    }
                                </ScrollView>
                            </View>
                        )
                    })
                }
            </View>
        )
    }

    //改版 ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑

    // keyExtractor(data, index) {
    //     return index
    // }
    //加载更多
    onEndReached() {
        // const {dispatch} = this.props;
        // let GlobalDatas = this.GlobalDatas;
        //
        // dispatch(ActionProducts({
        //     parentCategoryId: GlobalDatas.ParentCategoryId,
        //     categoryId: GlobalDatas.ChildCategoryId,
        //     p: ++this._page
        // }));
    }

    /* renderPoop() {
         return (
             <View style={[content.poop]}>
                 {
                     this.poops.map((poop, index) => {
                         return (
                             <View style={content.poop_item} key={index}>
                                 <BCHostImage
                                     //resizeMode='contain'
                                     style={[{width: px2dp(83), height: px2dp(55)}]}
                                     source={{uri: poop.source}}
                                 />
                                 <View style={[content.poop_item_right]}>
                                     <View style={content.poop_title}>
                                         <BCText style={[gs.c_3a3838, gs.fts_14]}>{poop.text}</BCText>
                                     </View>
                                     <View style={[content.poop_price]}>
                                         <View style={content.poop_price_left}>
                                             <BCText style={[gs.c_e93040, gs.fts_13]}>¥</BCText>
                                             <BCText style={[gs.c_e93040, gs.fts_15]}>38.80</BCText>
                                             <BCText style={[gs.c_e93040, gs.fts_12]}>/斤</BCText>
                                             <BCText
                                                 style={[gs.c_b7b7b7, gs.fts_12, {
                                                     marginLeft: px2dp(6),
                                                     textDecorationLine: 'line-through'
                                                 }]}>¥48.80</BCText>
                                         </View>
                                         <BCTouchable style={[gs.bgc_e93040, content.poopButton]}>
                                             <BCText style={[gs.c_fff, gs.fts_12]}>立即抢购</BCText>
                                         </BCTouchable>
                                     </View>
                                 </View>
                             </View>
                         )
                     })
                 }
             </View>
         )
     }*/

    /*render() {
        return (
            <Swiper height={200}
            >
                {this.renderImg()}
            </Swiper>

        );
    }*/
    renderImg() {
        let imageViews = [];
        bigs = this.state.big;
        for(let i = 0; i < bigs.length; i++) {
            imageViews.push(
                <BCHostImage
            key={i}
            style={{height: px2dp(165),width:deviceWidth}}
            source={{uri: this.state.big[i].ADIMAGE}}/>
            );
        }
        return imageViews;
    }

    renderBanner(){
        let imageViews = [];
        for(let i = 0; i < this.state.bannerData.length; i++) {
            imageViews.push(
                <BCTouchable  key={i} onPress={()=>{this.state.bannerData[i].redirectShop?this.push('ProductList',{sCompanyId:this.state.bannerData[i].redirectShop,categoryId:this.state.bannerData[i].redirectCategory,parentCategoryId:this.state.bannerData[i].redirectParentCategory,needLogin:true}):
                    this.push('ClassifyList',{CategoryId:this.state.bannerData[i].redirectCategory,recommendId:this.state.bannerData[i].redirectParentCategory,needLogin:true})
                }}>
                    <BCHostImage
                        // resizeMode='contain'
                        style={{height: this.state.bannerData[i].imageHeight,width:deviceWidth}}
                        source={{uri: this.state.bannerData[i].imageUrl}}/>
                </BCTouchable>
            );
        }
        return imageViews;
        // return(
            // <View style={{height:px2dp(120),flexDirection:'row'}}>
            //     <BCImage  style={{width:deviceWidth,height:px2dp(this.state.bannerData.imageHeight)}} source={require('../../imgs/banner.jpg')}></BCImage>
            // </View>
        // )
    }
    content() {
        return (
            <View style={[content.main, gs.bgc_f2f1ef]}>
                {/*{this.state.versionNew?<View></View>:this.renderTiShi()}*/}
                {/*{this.renderOwnerProduct()}*/}
                <Swiper width={deviceWidth} height={px2dp(this.state.imageHeight)||px2dp(120)} autoplay={true}  removeClippedSubviews={false}>
                    {this.renderBanner()}
                </Swiper>
                {/*{this.renderTopTools()}*/}
                <View style={[content.tools, gs.bgc_fff]}>
                    {
                        this.tools.map((item, index) => {
                            return this.renderTools(item, index)
                        })
                    }
                </View>

                {/*商品展示模块*/}
                <View style={[{marginTop:px2dp(10)},gs.bgc_fff]}>
                    {this.state.showRecomm? this.renderItem():null}
                </View>
            </View>
        )
    }
    //系统函数
    // DidMount(){
    //
    //    // alert('DidMount');
    //     //延时3s 显示轮播
    //     setTimeout(()=>{
    //         this.setState({
    //             swiperShow:true
    //         });
    //     },2000)
    // }
    WillMount() {
        const {dispatch} = this.props;
        let currentDate = getDateStr(0);
        this.setState({
            IsReceived: true,
        });
        if (this.props.currentEmployee.token) {
            dispatch(ActionLoadMallProducts());
        }
        dispatch(ActionLoadMallAdPC({type:0}));
        dispatch(ActionLoadMallAd({type:1}));
        dispatch(ActionSelectIndexRecommend());
        AsyncStorage.getItem("lastDate",(e,val)=>{
            let lastDate=val;
            if (lastDate!=currentDate){
                fetchVersion().then((ret)=>{
                    console.log(ret)
                    if (ret.code==0){
                        let msg='';
                        let currentVersion=ret.data.version
                        if(ret.data.message){
                            msg=ret.data.message
                        };
                        if(currentVersion!=version){
                            Alert.alert('提示',ret.data.message?msg:'版本有更新，是否前往下载?',
                                [
                                    {text: '取消',  onPress: () => {AsyncStorage.setItem("lastDate",currentDate),console.log('111',currentDate)},style: 'cancel'},
                                    // {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                                    {text: '确定', onPress: () => {AsyncStorage.setItem("lastDate",currentDate),
                                        Linking.canOpenURL(Platform.OS=='android'?ret.data.downlinkAndroid:ret.data.downlinkIos).then(supported => {
                                            if (supported) {
                                                Linking.openURL(Platform.OS=='android'?ret.data.downlinkAndroid:ret.data.downlinkIos);
                                            } else {
                                                //console.log('无法打开该URI: ' + this.props.url);
                                            }
                                        })}
                                    },
                                ],
                                { cancelable: false }
                            )
                        }
                    }
                }).catch((e) => {});
            }
        });

        fetchHeader().then((ret)=>{
            let iconsData=ret.data.icons;
            for (var i=0;i<this.tools.length;i++){
                this.tools[i].source=iconsData[i].imageUrl
                this.tools[i].text=iconsData[i].iconType

            }
            this.setState({
                imageHeight:ret.data.advertises?ret.data.advertises[0].imageHeight:px2dp(120),
                bannerData:ret.data.advertises,
                iconsData:ret.data.icons
            })
        })

    }


    //自己画的提示更新界面 暂时不用  versionNew用来判断是否显示
    renderTiShi(){
        return (
            <View style={{width:deviceWidth,height:deviceHeight,alignItems:'center',justifyContent:'center',position:'absolute',top:0,left:0,zIndex:11,}}>
                <View style={{width:deviceWidth,height:deviceHeight,opacity:0.4,backgroundColor:'#333',position:'absolute',top:0,left:0,zIndex:10,}}></View>
                <View style={{width:'60%',height:'25%',backgroundColor:'#fff',borderRadius:20,flexDirection:'column',justifyContent:'space-around',opacity:1,zIndex:12}}>
                    <View style={{justifyContent:'center'}}>
                        <BCText style={{color:'#000',fontSize:16,textAlign:'center'}}>版本已更新，是否前往下载最新版本？</BCText>
                    </View>

                    <View style={{flexDirection:'row',justifyContent:'space-around',alignItems:'center'}}>
                        <BCTouchable style={{width:px2dp(60),height:px2dp(25),borderRadius:20,backgroundColor:'#31ca96',justifyContent:'center',alignItems:'center'}}
                            onPress={()=>{this.setState({versionNew:!this.state.versionNew})}}
                        >
                            <BCText style={{color:'#fff',fontSize:18}}>取消</BCText>
                        </BCTouchable>
                        <BCTouchable style={{width:px2dp(60),height:px2dp(25),borderRadius:20,backgroundColor:'#31ca96',justifyContent:'center',alignItems:'center'}}
                                     onPress={()=>{this.setState({versionNew:!this.state.versionNew})}}
                        >
                            <BCText style={{color:'#fff',fontSize:18}}>确定</BCText>
                        </BCTouchable>
                    </View>
                </View>
            </View>
        )
    }

    WillReceive(nextProps) {
        if (nextProps.ReduceLoadMallProducts.datas != null && nextProps.ReduceLoadMallProducts.datas != this.props.ReduceLoadMallProducts.datas) {
            const {ReduceLoadMallProducts} = nextProps;
            let {Categorys, Product, Carts} = ReduceLoadMallProducts.datas;

            this.setState({
                IsReceived: true,
                //owners: Product
            });
        }
        if (nextProps.ReduceLoadMallAd.datas != null && nextProps.ReduceLoadMallAd.datas != this.props.ReduceLoadMallAd.datas) {
            const {ReduceLoadMallAd} = nextProps;
            let MallAdProduct = ReduceLoadMallAd.datas;
            this.setState({
                IsReceived: true,
                owners: MallAdProduct.data
            });
        }
        if (nextProps.ReduceLoadMallAdPc.datas != null && nextProps.ReduceLoadMallAdPc.datas != this.props.ReduceLoadMallAdPc.datas) {
            const {ReduceLoadMallAdPc} = nextProps;
            let MallAdProduct1 = ReduceLoadMallAdPc.datas;
            this.setState({
                IsReceived: true,
                big: MallAdProduct1.data
            });
        }
        if (nextProps.ReduceSelectIndexRecommend.datas != null && nextProps.ReduceSelectIndexRecommend.datas != this.props.ReduceSelectIndexRecommend.datas) {
            const {ReduceSelectIndexRecommend} = nextProps;
            let SelectIndexRecommend = ReduceSelectIndexRecommend.datas;
            this.setState({
                showRecomm: true,
                TuPianData: SelectIndexRecommend,
                IsReceived: true,
            });
        }

    }
}

const header = StyleSheet.create({
    top: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        height: Platform.OS === 'ios' ? px2dp(64) : px2dp(44),
        paddingTop: Platform.OS === 'ios' ? px2dp(28) : px2dp(8),
        paddingBottom: px2dp(8),
    },
    location: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal:px2dp(10),
    },
    icon: {
        marginLeft: px2dp(7)
    },
    search: {
        height: px2dp(28),
        width: px2dp(221),
        borderRadius: px2dp(14),
        flexShrink: 1,
        margin:0,
        padding: 0,
        opacity: 0.6,
        justifyContent: 'center',
        alignItems: 'center'
    },
    message: {
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: px2dp(10)
    },
    content: {
        height: px2dp(106),
        flexDirection: 'row',
        justifyContent: 'space-around',

    },
    item: {
        alignItems: 'center',
        paddingLeft: px2dp(10),
        paddingRight: px2dp(10),
        justifyContent: 'center'
    },
    item_text: {
        marginTop: px2dp(16)
    },
    Text_title:{
        marginTop: px2dp(4),
        color:"#ffffff",
        height: px2dp(28),
        width: px2dp(249),
        // justifyContent: 'center',
        // alignItems: 'center'
        textAlign:'center'
    }
});
const content = StyleSheet.create({
    main: {
        flex: 1
    },
    tools: {
        height: px2dp(145),
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between'
    },
    tool_item: {
        width: deviceWidth / 4,
        height: px2dp(72),
        justifyContent: 'center',
        alignItems: 'center',
    },
    tool_item_text: {
        marginTop: px2dp(7)
    },
    tejia: {
        paddingLeft: px2dp(10),
        paddingRight: px2dp(10),
        height: px2dp(42),
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#e8e8e8'
    },
    tejia_text: {
        height: px2dp(30),
        marginLeft: px2dp(10),
        borderLeftWidth: 1,
        paddingLeft: px2dp(10),
        justifyContent: 'center'
    },
    owner: {
        height: px2dp(178),
        marginTop: px2dp(10)
    },
    title: {
        flexDirection: 'row',
        height: px2dp(43),
        alignItems: 'center',
        paddingLeft: px2dp(10)
    },
    title_text: {
        marginLeft: px2dp(6)
    },
    owner_product: {
        height: px2dp(135),
        flexDirection: 'row'
    },
    owner_product_item: {
        paddingLeft: px2dp(5),
        paddingRight: px2dp(5),
        alignItems: 'center'
    },
    product_item_title: {
        height: px2dp(35),
        width: px2dp(120),
        alignItems: 'center',
        position: 'absolute',
        bottom: px2dp(15),
        justifyContent: 'center',
        opacity: 0.7
    },
    banner: {
        flex: 1,
        height: px2dpH(140),
        paddingLeft: px2dp(12),
        paddingRight: px2dp(12),
        paddingTop: px2dp(10),
        paddingBottom: px2dp(10),
        justifyContent: 'center',
        alignItems: 'center',
    },
    poop: {
        flex: 1
    },
    poop_item: {
        flexDirection: 'row',
        height: px2dp(67),
        paddingBottom: px2dp(12),
        paddingLeft: px2dp(12),
        paddingRight: px2dp(12)
    },
    poop_item_right: {
        flex: 1,
        marginLeft: px2dp(10)
    },
    poop_title: {
        height: px2dp(30),
        justifyContent: 'center'
    },
    poop_price: {
        height: px2dp(25),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    poop_price_left: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    poopButton: {
        height: px2dp(25),
        width: px2dp(68),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: px2dp(12),
    }

});

//selector：这是你自己编写的一个函数。这个函数声明了你的组件需要整个 store 中的哪一部分数据作为自己的 props。
function selector(store) {
    return {
        num: store.num,
        currentEmployee: store.ReduceEmployee,
        ReduceLoadMallProducts: store.ReduceLoadMallProducts,
        ReduceLoadMallAd:store.ReduceLoadMallAd,
        ReduceLoadMallAdPc:store.ReduceLoadMallAdPc,
        ReduceSelectIndexRecommend:store.ReduceSelectIndexRecommend,
        ReduceVersion:store.ReduceVersion,
    }
}

// 包装 component ，注入 dispatch 和 state 到其默认的 connect(selector)(App) 中；
export default connect(selector)(Home);