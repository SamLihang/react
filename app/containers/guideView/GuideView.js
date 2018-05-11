'use strict';
import React from "react";
import {connect} from "react-redux";
import {Image, ScrollView, StyleSheet, View,Platform, BackHandler,BackAndroid,NativeAppEventEmitter} from "react-native";
import PageComponent from "../PageComponent";
import {BCImage, BCText, BCTouchable, deviceHeight, deviceWidth, NavigationOptions, px2dp} from "../../BaseComponent";
import gs from "../../styles/MainStyles";
import {NavigationActions} from 'react-navigation'
import timer from 'react-timer-mixin'
import JPushModule from 'jpush-react-native';
let image1 = require('./guideImage/guide1.jpg');
let image2 = require('./guideImage/guide2.jpg');
let image3 = require('./guideImage/guide3.jpg');
let image4 = require('./guideImage/guide4.jpg');

class GuideView extends PageComponent {
    isSetTimer = true

    constructor(props) {
        super(props);
        if(Platform.OS === 'android') JPushModule.initPush();
    };

    content() {
        const loginEmployee = this.props.currentEmployee;
        if (loginEmployee && loginEmployee.EmployeeId && loginEmployee.EmployeeId > 0) {
            if (this.isSetTimer) {
                this.timer = setTimeout(
                    () => {
                        if (loginEmployee.CompanyTypeId == 3) {
                            //this.push("BuyerIndex");
                            const resetAction = NavigationActions.reset({
                                index: 0,
                                actions: [
                                    NavigationActions.navigate({routeName: 'BuyerIndex'})
                                ]
                            });
                            this.props.navigation.dispatch(resetAction)
                        } else {
                            const resetAction = NavigationActions.reset({
                                index: 0,
                                actions: [
                                    NavigationActions.navigate({routeName: 'SellerIndex'})
                                ]
                            });
                            this.props.navigation.dispatch(resetAction)
                            //this.push("SellerIndex");
                        }
                    },
                    4000
                );
            }

            return (<View style={Styles.mains}>
                <BCImage source={require('./guideImage/guide5.jpg')} style={Styles.backgroundImages}/>
                <BCTouchable onPress={() => {
                    this.timer && clearTimeout(this.timer)
                    const {navigation} = this.props;
                    if (loginEmployee.CompanyTypeId == 3) {
                        const resetAction = NavigationActions.reset({
                            index: 0,
                            actions: [
                                NavigationActions.navigate({routeName: 'BuyerIndex'})
                            ]
                        });
                        this.props.navigation.dispatch(resetAction)


                        //this.push("BuyerIndex");
                    } else {
                        const resetAction = NavigationActions.reset({
                            index: 0,
                            actions: [
                                NavigationActions.navigate({routeName: 'SellerIndex'})
                            ]
                        });
                        this.props.navigation.dispatch(resetAction)

                        //navigation.Reset("SellerIndex");
                        //this.push("SellerIndex");
                    }
                }} style={Styles.circle}>
                    <BCText style={[gs.fts_13, {color: '#ffffff', zIndex: 2}]}>跳过</BCText>
                </BCTouchable>
            </View>)
        } else {
            return (
                <ScrollView
                    contentContainerStyle={Styles.contentContainer}
                    bounces={false}
                    pagingEnabled={true}
                    showsHorizontalScrollIndicator={false}
                    horizontal={true}>

                    <Image source={image1} style={Styles.guideImage}/>
                    <Image source={image2} style={Styles.guideImage}/>
                    <Image source={image3} style={Styles.guideImage}/>
                    <Image source={image4} style={Styles.guideImage}/>
                    <View style={Styles.main}>
                        <BCImage source={require('../../imgs/SellerImage.png')} style={Styles.backgroundImage}/>
                        <View style={Styles.type}>
                            <View style={Styles.btnType}>
                                <View style={Styles.btnLeft}>
                                    <BCImage source={require('../../imgs/Business.png')}/>
                                </View>
                                <BCTouchable style={Styles.touchable} onPress={() => {
                                    const resetAction = NavigationActions.reset({
                                        index: 0,
                                        actions: [
                                            NavigationActions.navigate({routeName: 'BuyerIndex', companyTypeId: 3})
                                        ]
                                    });
                                    this.props.navigation.dispatch(resetAction)
                                    //this.push('BuyerIndex', {companyTypeId: 3})
                                }}>
                                    <View style={{alignItems: 'center'}}>
                                        <BCText style={[gs.fts_15, gs.bold, {color: '#6D4330'}]}>我是买家</BCText>
                                        <BCText style={[gs.fts_14, {color: '#6D4330'}]}>采购各类新鲜食材</BCText>
                                    </View>
                                    <BCImage style={{marginLeft: px2dp(33)}}
                                             source={require('../../imgs/rightarrow.png')}/>
                                </BCTouchable>
                            </View>
                            <View style={[Styles.btnType, {marginTop: px2dp(16)}]}>
                                <View style={Styles.btnLeft}>
                                    <BCImage source={require('../../imgs/seller.png')}/>
                                </View>
                                <BCTouchable style={Styles.touchable} onPress={() => {
                                    const resetAction = NavigationActions.reset({
                                        index: 0,
                                        actions: [
                                            NavigationActions.navigate({routeName: 'SellerIndex', companyTypeId: 2})
                                        ]
                                    });
                                    this.props.navigation.dispatch(resetAction)
                                    //this.push('SellerIndex', {companyTypeId: 2})
                                }}>
                                    <View style={{alignItems: 'center'}}>
                                        <BCText style={[gs.fts_15, gs.bold, {color: '#6D4330'}]}>我是卖家</BCText>
                                        <BCText style={[gs.fts_14, {color: '#6D4330'}]}>供应各类时蔬水产</BCText>
                                    </View>
                                    <BCImage style={{marginLeft: px2dp(33)}}
                                             source={require('../../imgs/rightarrow.png')}/>
                                </BCTouchable>
                            </View>
                        </View>
                    </View>

                </ScrollView>
            )
        }
    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }

    renderNavigator() {
        return null;
    }

    WillReceive(nextProps) {
        if (nextProps.currentEmployee && nextProps.currentEmployee != this.props.currentEmployee) {
            const {currentEmployee} = nextProps;
            this.isSetTimer = false;
        }
    }

    WillMount() {
        this.setState({
            IsReceived: true
        })
    }

    DidMount()
    {

        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', this._onBackAndroid);

            //-----------jpush  android start

            // 在收到点击事件之前调用此接口
            JPushModule.notifyJSDidLoad((resultCode) => {
                if (resultCode === 0) {
                }
            });
            //通知栏收到信息触发
            JPushModule.addReceiveNotificationListener((message) => {
                //console.log("收到通知",message);
            });

            //通知栏收到信息打开触发
            JPushModule.addReceiveOpenNotificationListener((map) => {
                //console.log("打开通知",map);
                this.extrasChuli(map.extras);

            });
            //-----------jpush  android end
        }


        //-----------jpush  ios start
        /*if (Platform.OS === 'ios') {

            //这个是网上抄来的  事件通知方法
            this.subscription = NativeAppEventEmitter.addListener(
                'ReceiveNotification',
                (notification) => {
                    console.log('-------------------收到推送----------------');
                    console.log("3",notification)

                    //清除IOS APP角标  数量-1（设0 清除  不知道-1 是否可以让角标数量值减1 有待测试）
                    JPushModule.setBadge(-1, (map) => {
                        console.log("value="+map);
                    });
                    //this.extrasChuli(notification.extras);
                }
            );

            //通知栏收到消息（这个是我自己根据文档 自己看的  要测试验证）
            this.subscription1 = NativeAppEventEmitter.addListener(
                'kJPFDidReceiveRemoteNotification',
                (notification) => {
                    console.log('-------------------打开应用 收到推送----------------');
                    console.log("4",notification)
                    alert("kJPFDidReceiveRemoteNotification"+notification);
                    //清除IOS APP角标  数量-1（设0 清除  不知道-1 是否可以让角标数量值减1 有待测试）
                    JPushModule.setBadge(-1, (map) => {
                        console.log("value="+map);
                    });
                    this.extrasChuli(notification.extras);
                }
            );

            //通知栏打开消息
            this.subscription2 = NativeAppEventEmitter.addListener(
                'kJPFOpenNotification',
                (notification) => {
                    console.log('-------------------打开应用 收到推送----------------');
                    console.log("6",notification)

                    alert("kJPFOpenNotification"+notification);
                    //清除IOS APP角标  数量-1（设0 清除  不知道-1 是否可以让角标数量值减1 有待测试）
                    JPushModule.setBadge(-1, (map) => {
                        console.log("value="+map);
                    });
                    this.extrasChuli(notification.extras);
                }
            );
        }*/
        //-----------jpush  ios end
    }
    extrasChuli(extrasInfo) {
        try {

            let extrasJson = JSON.parse(extrasInfo);
            let Type = extrasJson.Type;
            let UseID = extrasJson.UseID;
            let OrderState=extrasJson.OrderState;

            let moduleName = 'BuyerIndex';
            let paramsSelf = {};

            const loginEmployee = this.props.currentEmployee;

            if(loginEmployee=="undefined"){
                return  false;
            }

            if (loginEmployee.CompanyTypeId == 3) {
                moduleName = 'BuyerIndex';
            }
            else {
                moduleName = 'SellerIndex';
            }

            //判断Type 的值 然后调完不同模块  到RootConfig.js 配置 路由
            /// OrderState 订单状态
            ///1、待接单  --推送到卖家
            ///2、已接单  --推送到买家
            ///3、已发货  --推送到买家
            ///4、已验货  --推送到卖家
            if (Type && Type == 1) {
                moduleName = 'SellerIndex';
                if(OrderState&&OrderState==0){
                    moduleName = 'SellerIndex';
                }
                if(OrderState&&OrderState==1){
                    moduleName = 'SellerDetail1';
                    paramsSelf = {salesOrderId: UseID,pageForm:"Jpush"};
                }
                if(OrderState&&OrderState==4){
                    moduleName = 'SellerDetail4';
                    paramsSelf = {salesOrderId: UseID,pageForm:"Jpush"};
                }
            }
            //PurchaseOrderState 4待发货 5待验货
            if (Type == 2) {
                moduleName = 'BuyerIndex';
                if(OrderState&&OrderState==2){
                    moduleName = 'PurchaseOrderDetail';
                    paramsSelf = {PurchaseOrderId: UseID, PurchaseOrderState: 4,pageForm:"Jpush"};
                }
                if(OrderState&&OrderState==3){
                    moduleName = 'PurchaseOrderDetail';
                    paramsSelf = {PurchaseOrderId: UseID, PurchaseOrderState: 5,pageForm:"Jpush"};
                }
            }
            //推送的消息为卖家。登录的类型为买家，则跳到买家首页
            if(Type==1 && loginEmployee.CompanyTypeId == 3){
                moduleName = 'BuyerIndex';
            }
            //若推送的消息为买家。  登录者为卖家。则跳到卖家首页
            if(Type==2 && loginEmployee.CompanyTypeId == 2){
                moduleName = 'SellerIndex';
            }

            //跳转模块页面
            const resetAction = NavigationActions.reset({
                index: 0,
                actions: [
                    NavigationActions.navigate({routeName: moduleName, params: paramsSelf,})
                ],

            });
            this.props.navigation.dispatch(resetAction)
        }
        catch (error)
        {
            console.log(error)
        }

    }

    WillUnMount() {
        if (Platform.OS === 'android') {
            BackAndroid.removeEventListener('hardwareBackPress', this._onBackAndroid);
        }
        JPushModule.removeReceiveCustomMsgListener();
        JPushModule.removeReceiveNotificationListener();
        this.subscription && this.subscription.remove();
        this.subscription1 && this.subscription1.remove();
        this.subscription2 && this.subscription2.remove();
    }
}

const Styles = StyleSheet.create({
    main: {
        height: deviceHeight,
        width: deviceWidth,
        backgroundColor: '#fff',
    },
    mains: {
        height: deviceHeight,
        width: deviceWidth,
    },
    contentContainer: {
        width: deviceWidth * 5,
        height: deviceHeight,
    },
    guideImage: {
        width: deviceWidth,
        height: deviceHeight,
    },
    backgroundImage: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: deviceHeight,
        width: deviceWidth,

    },
    backgroundImages: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: deviceHeight,
        width: deviceWidth,

    },
    type: {
        position: 'absolute',
        top: (deviceHeight - px2dp(214)) / 2,
        left: (deviceWidth - px2dp(272)) / 2
    },
    btnType: {
        width: px2dp(272),
        height: px2dp(99),
        borderRadius: px2dp(4),
        backgroundColor: '#fff',
        opacity: 0.8,
        flexDirection: 'row',
    },
    btnLeft: {
        borderRightWidth: 0.5,
        width: px2dp(66),
        height: px2dp(99),
        borderRightColor: '#888',
        alignItems: 'center',
        justifyContent: 'center'
    },
    touchable: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: px2dp(33)
    },
    circle: {
        width: px2dp(45),
        height: px2dp(45),
        backgroundColor: '#000',
        borderRadius: px2dp(50),
        position: 'absolute',
        right: px2dp(20),
        top: px2dp(40),
        opacity: 0.35,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

function mapStateToProps(store) {
    return {
        currentEmployee: store.ReduceEmployee.currentEmployee,
    }
}

const guideView = connect(mapStateToProps)(GuideView);
guideView.navigationOptions = NavigationOptions;
export default guideView;