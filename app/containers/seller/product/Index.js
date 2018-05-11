/**
 * Created by sencha on 2017/3/29.
 */
import React from "react";
import {connect} from "react-redux";
import {Platform, StyleSheet, TextInput, View, Linking} from "react-native";
import {BCImage, BCText, BCTouchable, deviceWidth, px2dp} from "../../../BaseComponent";
import {PullViewComponent} from "../../PageComponent";
import gs from "../../../styles/MainStyles";
import {toastShort} from '../../../utils/ToastUtil';

class Index extends PullViewComponent {
    /*{
        'text': '统计',
        'routeName': 'DevelopmentPage',
        'source': require('../../../imgs/Statistics.png')
    },*/
    tools = [{
        'text': '我的订单',
        'routeName': 'SellerList',
        'source': require('../../../imgs/Myorder.png')
    }, {
        'text': '零售改价',
        'routeName': 'RetailPrice',
        'source': require('../../../imgs/Retailpricechange.png')
    }, {
        'text': '售后管理',
        'routeName': 'ServiceManagement',
        'source': require('../../../imgs/Aftersalemanagement.png')
    }, {
        'text': '补货',
        'routeName': 'SellerReplenishProducts',
        'source': require('../../../imgs/sellerreplenishment.png')
    }, {
        'text': '企业认证',
        'routeName': 'Authenticate',
        'source': require('../../../imgs/Enterprisecertification.png')
    }, {
        'text': '促销管理',
        'routeName': 'SalesPromotion',
        'source': require('../../../imgs/Promotionmanagement.png')
    }, {
        'text': '我的促销',
        'routeName': 'DevelopmentPage',
        'source': require('../../../imgs/Mypromotion.png')
    }, {
        'text': '更多',
        'routeName': 'DevelopmentPage',
        'source': require('../../../imgs/Moreicon.png')
    }]

    constructor(props, context) {
        super(props, context);
        this.state = {
            IsReceived: true
        }
    }

    renderNavigator() {
        const {dispatch, num, currentEmployee} = this.props
        return (
            <View style={[header.top, gs.bgc_BaseColor]}>
                <BCTouchable style={header.message}
                             onPress={() => Linking.canOpenURL('tel:400-680-5217').then(supported => {
                                 if (supported) {
                                     Linking.openURL('tel:400-680-5217');
                                 } else {
                                     toastShort('无法打开该URI: ' + 'tel:400-680-5217');
                                 }
                             })}

                >
                    <BCImage source={require('../../../imgs/Phone.png')}></BCImage>
                </BCTouchable>

                <BCTouchable style={[header.search, {backgroundColor:'#21bd88'}]}
                             onPress={() => {
                                 this.push('ProductsSearch', {
                                     callBack: null,
                                     isActive: true,
                                     needLogin: true
                                 })
                             }}>
                    <BCText style={[gs.c_fff, gs.fts_15]}>输入菜品名称</BCText>
                </BCTouchable>

                <BCTouchable style={header.message} onPress={() => {
                    this.push('SellerMessages', {needLogin: true})
                }}>
                    <BCImage source={require('../../../imgs/information.png')}></BCImage>
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
                        this.push('AddProduct1', {needLogin: true})
                    }}
                    style={header.item}>
                    <BCImage source={require('../../../imgs/Release.png')}></BCImage>
                    <BCText style={[header.item_text, gs.c_fff, gs.fts_16]}>商品发布</BCText>
                </BCTouchable>
                <BCTouchable
                    onPress={() => {
                        this.push('Products', {needLogin: true})
                    }}
                    style={header.item}>
                    <BCImage source={require('../../../imgs/Mygoods.png')}></BCImage>
                    <BCText style={[header.item_text, gs.c_fff, gs.fts_16]}>我的商品</BCText>
                </BCTouchable>
                <BCTouchable onPress={() => {
                    this.push('PriceGroupManage', {needLogin: true})
                }} style={header.item}>
                    <BCImage source={require('../../../imgs/Pricegroup.png')}></BCImage>
                    <BCText style={[header.item_text, gs.c_fff, gs.fts_16]}>价格组</BCText>
                </BCTouchable>
            </View>
        )
    }

    renderTools({text, source, routeName}, index) {
        return (
            <BCTouchable style={content.tool_item} key={index} onPress={() => {
                this.push(routeName, {needLogin: true, title: text})
            }}>
                <BCImage source={source} style={{height: px2dp(31), width: px2dp(31)}}/>
                <BCText style={[content.tool_item_text, gs.c_3a3838]}>{text}</BCText>
            </BCTouchable>
        )
    }

    renderTitle(title, subtitle) {
        return (
            <View style={[content.title]}>
                <BCImage source={require('../../../imgs/Red.png')}></BCImage>
                <BCText style={[content.title_text, gs.fts_14, gs.bold]}>{title}</BCText>
                <BCText style={[content.title_text, gs.fts_12,]}>{subtitle}</BCText>
            </View>
        )
    }

    content() {
        return (
            <View style={[content.main, gs.bgc_f2f1ef]}>
                {this.renderTopTools()}
                <View style={[content.tools, gs.bgc_fff]}>
                    {
                        this.tools.map((item, index) => {
                            return this.renderTools(item, index)
                        })
                    }
                </View>
                <View style={[content.owner, gs.bgc_fff]}>
                    {this.renderTitle('精选推荐活动', '为你准备好的厂家活动')}
                    <View style={content.banner}>
                        <BCImage style={{height: px2dp(140), width: px2dp(350)}}
                                 source={require('../../../imgs/image.png')}/>
                        <BCText style={[content.bannerText, gs.fts_14, gs.c_3a3838]}>4月2日－4月13日至下沙国际贸易中心购物满3000元，享7折优惠享7折优惠享7折优惠享7折优惠享7折优惠</BCText>
                    </View>
                    <View style={content.iconStyle}>
                        <View style={{flexDirection: 'row', paddingRight: px2dp(34)}}>
                            <BCImage source={require('../../../imgs/Readingquantity.png')}></BCImage>
                            <BCText style={[gs.fts_12, gs.c_b7b7b7, {marginLeft: px2dp(8)}]}>222</BCText>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <BCImage source={require('../../../imgs/Sellertime.png')}></BCImage>
                            <BCText style={[gs.fts_12, gs.c_b7b7b7, {marginLeft: px2dp(8)}]}>222</BCText>
                        </View>
                    </View>
                    <View style={content.line}></View>
                </View>
                <View style={[content.ownerList, gs.bgc_fff]}>
                    <View style={content.banner}>
                        <BCImage style={{height: px2dp(140), width: px2dp(350)}}
                                 source={require('../../../imgs/banner.png')}></BCImage>
                        <BCText style={[content.bannerText, gs.fts_14, gs.c_3a3838]}>4月2日－4月13日至下沙国际贸易中心购物满3000元，享7折优惠享7折优惠享7折优惠享7折优惠享7折优惠</BCText>
                    </View>
                    <View style={content.iconStyle}>
                        <View style={{flexDirection: 'row', paddingRight: px2dp(34)}}>
                            <BCImage source={require('../../../imgs/Readingquantity.png')}></BCImage>
                            <BCText style={[gs.fts_12, gs.c_b7b7b7, {marginLeft: px2dp(8)}]}>222</BCText>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <BCImage source={require('../../../imgs/Sellertime.png')}></BCImage>
                            <BCText style={[gs.fts_12, gs.c_b7b7b7, {marginLeft: px2dp(8)}]}>222</BCText>
                        </View>
                    </View>
                    <View style={content.line}></View>
                </View>
            </View>
        )
    }

}

//selector：这是你自己编写的一个函数。这个函数声明了你的组件需要整个 store 中的哪一部分数据作为自己的 props。
function selector(store) {
    return {
        num: store.num,
        currentEmployee: store.ReduceEmployee
    }
}

// 包装 component ，注入 dispatch 和 state 到其默认的 connect(selector)(App) 中；
export default connect(selector)(Index);

const header = StyleSheet.create({
    top: {
        flexDirection: 'row',
        height: Platform.OS === 'ios' ? px2dp(60) : px2dp(44),
        paddingTop: Platform.OS === 'ios' ? px2dp(20) : px2dp(8),
        paddingBottom: px2dp(8),
        //paddingLeft: px2dp(10),
        paddingRight: px2dp(10)
    },
    location: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    icon: {
        marginLeft: px2dp(7)
    },
    search: {
        height: px2dp(28),
        width: px2dp(249),
        borderRadius: px2dp(14),
        marginLeft: px2dp(10),
        padding: 0,
        opacity: 0.6,
        justifyContent: 'center',
        alignItems: 'center'
    },
    message: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: px2dp(10),
        paddingRight: px2dp(10),
        marginLeft: px2dp(10)
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
    owner: {
        height: px2dp(282),
        marginTop: px2dp(10),
    },
    ownerList: {
        height: px2dp(246),
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
        paddingLeft: px2dp(10),
        paddingRight: px2dp(10),
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
        paddingLeft: px2dp(12),
        paddingRight: px2dp(12),
        paddingTop: px2dp(10),
        paddingBottom: px2dp(10),
        alignItems: 'center'
    },
    bannerText: {
        width: px2dp(328.5),
        marginTop: px2dp(10),
    },
    iconStyle: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingRight: px2dp(21)
    },
    line: {
        marginLeft: px2dp(12),
        marginTop: px2dp(14),
        width: px2dp(361.5),
        height: 1,
        backgroundColor: '#e8e8e8'
    }
    /* poop: {
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
     }*/

});