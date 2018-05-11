import React, {Component} from "react";
import {connect} from "react-redux";
import {Platform, StyleSheet, View, Linking} from "react-native";
import {
    BCHostImage,
    BCImage,
    BCText,
    BCTouchable,
    deviceHeight,
    deviceWidth,
    NavigationOptions,
    px2dp,
    substr
} from "../../../BaseComponent";
import {PullViewComponent} from "../../PageComponent";
import gs from "../../../styles/MainStyles";
import {ActionLogOut} from "../../../actions/EmployeeAction";
import {toastShort} from "../../../utils/ToastUtil";
import {ActionSellInfo} from "../../../actions/MyAction";

//遮罩层
class ToPayMaks extends Component {
    constructor(props) {
        super(props)
        this.state = {
            IsShow: false
        }
    }

    static propTypes = {
        Cancle: React.PropTypes.func,
    };

    Trigger(v) {
        this.setState({
            IsShow: v
        })
    }

    render() {
        return (
            this.state.IsShow ?
                <View style={[Styles.selectType]}>
                    <CustomButton url={'tel:400-680-5217'} text='400-680-5217'/>
                    <BCTouchable style={[Styles.menuItem, gs.bgc_fff, {marginTop: px2dp(10)}]}
                                 onPress={() => this.props.Cancle()}>
                        <BCText style={[gs.fts_17, gs.c_3a3838, gs.fts_18]}>取消</BCText>
                    </BCTouchable>
                </View> : null
        )
    }
}

class CustomButton extends React.Component {
    constructor(props) {
        super(props);
    }

    propTypes: {
        url: React.PropTypes.string,
    };

    render() {
        return (
            <BCTouchable
                style={[Styles.menuItem, gs.bgc_fff,]}
                underlayColor="#a5a5a5"
                onPress={() => Linking.canOpenURL(this.props.url).then(supported => {
                    if (supported) {
                        Linking.openURL(this.props.url);
                    } else {
                        //console.log('无法打开该URI: ' + this.props.url);
                    }
                })}>
                <BCText style={[gs.fts_17, gs.c_BaseColor, gs.fts_18]}>{this.props.text}</BCText>
            </BCTouchable>
        );
    }
}

class My extends PullViewComponent {
    //去除头部栏
    renderNavigator() {
        return null;
    }

    _ToPayMaks = null;
    relative

    Top() {
        let loginEmployee = this.props.currentEmployee
        return (
            <View style={Styles.headerStyle}>
                <BCImage source={require('../../../imgs/background.png')}
                         style={{width: deviceWidth, height: px2dp(165)}}/>
                <View style={Styles.rowStyle}>
                    {
                        loginEmployee.CompanyName ?
                            <BCTouchable onPress={() => {
                                this.push('SellerStoreInformation')
                            }}>
                                <View style={[Styles.imageShadow, gs.bgc_fff,]}></View>
                                {
                                    loginEmployee.LogoImage ?
                                        <BCHostImage style={Styles.imageStyle}
                                                     source={{uri: loginEmployee.LogoImage}}/> :
                                        <BCImage style={Styles.logoImage}
                                                 source={require('../../../imgs/Headportrait.png')}/>
                                }
                            </BCTouchable> :
                            <BCTouchable onPress={() => {
                                this.push('SellerStoreInformation', {needLogin: true})
                            }}>
                                <View style={[Styles.imageShadow, gs.bgc_fff,]}></View>
                                {
                                    loginEmployee.LogoImage ?
                                        <BCHostImage style={Styles.imageStyle}
                                                     source={{uri: loginEmployee.LogoImage}}/> :
                                        <BCImage style={Styles.logoImage}
                                                 source={require('../../../imgs/Headportrait.png')}/>
                                }
                            </BCTouchable>
                    }
                    {
                        loginEmployee.CompanyName ?
                            <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: px2dp(15)}}>
                                <View style={{backgroundColor: '#2AD191'}}>
                                    <BCText
                                        style={[gs.fts_17, gs.c_fff,{width:px2dp(240),marginRight:px2dp(15)}]}>{substr((loginEmployee.CompanyName), 15)}</BCText>
                                    <BCText
                                        style={[gs.fts_13, gs.c_fff]}>{substr((loginEmployee.CompanyDescription), 15)}</BCText>
                                </View>
                            </View> :
                            <View style={Styles.registLogin}>
                                <BCTouchable style={{backgroundColor: '#2AD191'}} onPress={() => {
                                    this.push('Providers', {needLogin: true, pageType: 'login'})
                                }}>
                                    <BCText style={[gs.fts_17, gs.c_fff]}>登录</BCText>
                                </BCTouchable>
                                <BCText style={[gs.fts_17, gs.c_fff, {backgroundColor: '#2AD191'}]}>|</BCText>
                                <BCTouchable style={{backgroundColor: '#2AD191'}} onPress={() => {
                                    this.push('Providers', {needLogin: true, pageType: 'regist'})
                                }}>
                                    <BCText style={[gs.fts_17, gs.c_fff]}>注册</BCText>
                                </BCTouchable>
                            </View>
                    }
                </View>
            </View>
        )
    }


    refeshView(msg) {
        const {dispatch} = this.props;
        dispatch(ActionSellInfo());
    }

    content() {
        const {dispatch} = this.props;
        let loginEmployee = this.props.currentEmployee
        return (
            <View style={[Styles.main, gs.bgc_fff]}>
                {
                    loginEmployee.CompanyName ?
                        <View>
                            <View style={Styles.parallelStyle}>
                                <BCTouchable onPress={() => {
                                    this.push('MyCustomer')
                                }} style={{alignItems: 'center', justifyContent: 'center'}}>
                                    <View style={{width:px2dp(25),height:px2dp(25),justifyContent:'center',alignItems:'center'}}><BCImage source={require('../../../imgs/VIP.png')}/></View>
                                    <BCText style={[gs.fts_15, gs.c_3a3838, {paddingTop: px2dp(15)}]}>我的客户</BCText>
                                </BCTouchable>
                                <BCTouchable
                                    onPress={() => this.push('DeliveryFee', {callback: this.refeshView.bind(this)})}
                                    style={{alignItems: 'center', justifyContent: 'center',marginLeft:px2dp(3)}}>
                                    <View style={{width:px2dp(25),height:px2dp(25),justifyContent:'center',alignItems:'center'}}><BCImage source={require('../../../imgs/yunfei.png')}/></View>
                                    <BCText style={[gs.fts_15, gs.c_3a3838, {paddingTop: px2dp(15)}]}>运费管理</BCText>
                                </BCTouchable>
                                <BCTouchable onPress={() => {
                                    this.push('SellerSetUp')
                                }} style={{alignItems: 'center', justifyContent: 'center'}}>
                                    <View style={{width:px2dp(25),height:px2dp(25),justifyContent:'center',alignItems:'center'}}><BCImage source={require('../../../imgs/securitymanagement.png')}/></View>
                                    <BCText style={[gs.fts_15, gs.c_3a3838, {paddingTop: px2dp(15)}]}>安全管理</BCText>
                                </BCTouchable>
                                <BCTouchable onPress={() => {
                                    this.push('PrintSetup')
                                }} style={{alignItems: 'center', justifyContent: 'center'}}>
                                    <View style={{width:px2dp(25),height:px2dp(25),justifyContent:'center',alignItems:'center'}}><BCImage source={require('../../../imgs/Printsettings.png')}/></View>
                                    <BCText style={[gs.fts_15, gs.c_3a3838, {paddingTop: px2dp(15)}]}>打印设置</BCText>
                                </BCTouchable>
                            </View>
                            <View style={Styles.parallelStyle}>
                                <BCTouchable onPress={() => {
                                    this.push('Authenticate')
                                }} style={{alignItems: 'center', justifyContent: 'center'}}>
                                    <View style={{width:px2dp(25),height:px2dp(25),justifyContent:'center',alignItems:'center'}}><BCImage source={require('../../../imgs/Authentication.png')}/></View>
                                    <BCText style={[gs.fts_15, gs.c_3a3838, {paddingTop: px2dp(15)}]}>企业认证</BCText>
                                </BCTouchable>
                                {/*<BCTouchable*/}
                                    {/*onPress={() => this.push('ReplenishFee', {callback: this.refeshView.bind(this)})}*/}
                                    {/*style={{alignItems: 'center', justifyContent: 'center',marginLeft:px2dp(4)}}>*/}
                                    {/*<BCImage source={require('../../../imgs/replenish.png')}/>*/}
                                    {/*<BCText style={[gs.fts_15, gs.c_3a3838, {paddingTop: px2dp(15)}]}>补货运费</BCText>*/}
                                {/*</BCTouchable>*/}
                                {/*<BCTouchable*/}
                                    {/*onPress={() => this.push('FareScale', {callback: this.refeshView.bind(this)})}*/}
                                    {/*style={{alignItems: 'center', justifyContent: 'center'}}>*/}
                                    {/*<BCImage source={require('../../../imgs/premium.png')}/>*/}
                                    {/*<BCText style={[gs.fts_15, gs.c_3a3838, {paddingTop: px2dp(15)}]}>补货加价比</BCText>*/}
                                {/*</BCTouchable>*/}
                                <BCTouchable onPress={() => {
                                    this.ToPay()
                                }} style={{alignItems: 'center', justifyContent: 'center',}}>
                                    <View style={{width:px2dp(25),height:px2dp(25),justifyContent:'center',alignItems:'center'}}><BCImage source={require('../../../imgs/ContactCustomerService.png')}/></View>
                                    <BCText style={[gs.fts_15, gs.c_3a3838, {paddingTop: px2dp(15)}]}>联系客服</BCText>
                                </BCTouchable>
                                <BCTouchable onPress={() => {
                                    this.push('AboutUs')
                                }} style={{alignItems: 'center', justifyContent: 'center'}}>
                                    <View style={{width:px2dp(25),height:px2dp(25),justifyContent:'center',alignItems:'center'}}><BCImage source={require('../../../imgs/Aboutus.png')}/></View>
                                    <BCText style={[gs.fts_15, gs.c_3a3838, {paddingTop: px2dp(15)}]}>关于我们</BCText>
                                </BCTouchable>
                                <BCTouchable onPress={() => {
                                    [dispatch(ActionLogOut()),
                                        this.push('SellerIndex'),
                                        this.ExitAccount()]
                                }} style={{alignItems: 'center', justifyContent: 'center'}}>
                                    <View style={{width:px2dp(25),height:px2dp(25),justifyContent:'center',alignItems:'center'}}><BCImage source={require('../../../imgs/exit.png')}/></View>
                                    <BCText style={[gs.fts_15, gs.c_3a3838, {paddingTop: px2dp(15)}]}>安全退出</BCText>
                                </BCTouchable>
                            </View>
                        </View> :
                        <View>
                            <View style={Styles.parallelStyle}>
                                <BCTouchable onPress={() => {
                                    this.push('MyCustomer', {needLogin: true})
                                }} style={{alignItems: 'center', justifyContent: 'center'}}>
                                    <View style={{width:px2dp(25),height:px2dp(25),justifyContent:'center',alignItems:'center'}}><BCImage source={require('../../../imgs/VIP.png')}/></View>
                                    <BCText style={[gs.fts_15, gs.c_3a3838, {paddingTop: px2dp(15)}]}>我的客户</BCText>
                                </BCTouchable>
                                <BCTouchable
                                    onPress={() => this.push('DeliveryFee', {callback: this.refeshView.bind(this),needLogin: true})}
                                    style={{alignItems: 'center', justifyContent: 'center'}}>
                                    <View style={{width:px2dp(25),height:px2dp(25),justifyContent:'center',alignItems:'center'}}><BCImage source={require('../../../imgs/yunfei.png')}/></View>
                                    <BCText style={[gs.fts_15, gs.c_3a3838, {paddingTop: px2dp(15)}]}>运费管理</BCText>
                                </BCTouchable>
                                <BCTouchable onPress={() => {
                                    this.push('SellerSetUp', {needLogin: true})
                                }} style={{alignItems: 'center', justifyContent: 'center'}}>
                                    <View style={{width:px2dp(25),height:px2dp(25),justifyContent:'center',alignItems:'center'}}><BCImage source={require('../../../imgs/securitymanagement.png')}/></View>
                                    <BCText style={[gs.fts_15, gs.c_3a3838, {paddingTop: px2dp(15)}]}>安全管理</BCText>
                                </BCTouchable>
                                <BCTouchable onPress={() => {
                                    this.push('PrintSetup', {needLogin: true})
                                }} style={{alignItems: 'center', justifyContent: 'center'}}>
                                    <View style={{width:px2dp(25),height:px2dp(25),justifyContent:'center',alignItems:'center'}}><BCImage source={require('../../../imgs/Printsettings.png')}/></View>
                                    <BCText style={[gs.fts_15, gs.c_3a3838, {paddingTop: px2dp(15)}]}>打印设置</BCText>
                                </BCTouchable>
                            </View>
                            <View style={Styles.parallelStyle}>
                                <BCTouchable onPress={() => {
                                    this.push('Authenticate', {needLogin: true})
                                }} style={{alignItems: 'center', justifyContent: 'center'}}>
                                    <View style={{width:px2dp(25),height:px2dp(25),justifyContent:'center',alignItems:'center'}}><BCImage source={require('../../../imgs/Authentication.png')}/></View>
                                    <BCText style={[gs.fts_15, gs.c_3a3838, {paddingTop: px2dp(15)}]}>企业认证</BCText>
                                </BCTouchable>
                                <BCTouchable onPress={() => {
                                    this.ToPay()
                                }} style={{alignItems: 'center', justifyContent: 'center',}}>
                                    <View style={{width:px2dp(25),height:px2dp(25),justifyContent:'center',alignItems:'center'}}><BCImage source={require('../../../imgs/ContactCustomerService.png')}/></View>
                                    <BCText style={[gs.fts_15, gs.c_3a3838, {paddingTop: px2dp(15)}]}>联系客服</BCText>
                                </BCTouchable>
                                {/*<BCTouchable*/}
                                    {/*onPress={() => this.push('ReplenishFee', {callback: this.refeshView.bind(this),needLogin: true})}*/}
                                    {/*style={{alignItems: 'center', justifyContent: 'center'}}>*/}
                                    {/*<BCImage source={require('../../../imgs/replenish.png')}/>*/}
                                    {/*<BCText style={[gs.fts_15, gs.c_3a3838, {paddingTop: px2dp(15)}]}>补货运费</BCText>*/}
                                {/*</BCTouchable>*/}
                                {/*<BCTouchable*/}
                                    {/*onPress={() => this.push('FareScale', {callback: this.refeshView.bind(this),needLogin: true})}*/}
                                    {/*style={{alignItems: 'center', justifyContent: 'center'}}>*/}
                                    {/*<BCImage source={require('../../../imgs/premium.png')}/>*/}
                                    {/*<BCText style={[gs.fts_15, gs.c_3a3838, {paddingTop: px2dp(15)}]}>补货加价比</BCText>*/}
                                {/*</BCTouchable>*/}
                                <BCTouchable onPress={() => {
                                    this.push('AboutUs')
                                }} style={{alignItems: 'center', justifyContent: 'center'}}>
                                    <View style={{width:px2dp(25),height:px2dp(25),justifyContent:'center',alignItems:'center'}}><BCImage source={require('../../../imgs/Aboutus.png')}/></View>
                                    <BCText style={[gs.fts_15, gs.c_3a3838, {paddingTop: px2dp(15)}]}>关于我们</BCText>
                                </BCTouchable>
                                <BCTouchable onPress={() => {
                                    [dispatch(ActionLogOut()),
                                        this.push('SellerIndex'),
                                        this.ExitAccount()]
                                }} style={{alignItems: 'center', justifyContent: 'center'}}>
                                    <View style={{width:px2dp(25),height:px2dp(25),justifyContent:'center',alignItems:'center'}}><BCImage source={require('../../../imgs/exit.png')}/></View>
                                    <BCText style={[gs.fts_15, gs.c_3a3838, {paddingTop: px2dp(15)}]}>安全退出</BCText>
                                </BCTouchable>
                            </View>
                        </View>
                }


            </View>
        )
    }


    //退出账号的提示语
    ExitAccount() {
        toastShort("退出账号成功")
    }

    //弹窗
    maksContent() {
        return (
            <View>
                <ToPayMaks ref={(ref) => this._ToPayMaks = ref}
                           Cancle={() => {
                               this._ToPayMaks.Trigger(false);
                               this._Maks.Trigger(false);
                           }}
                />
            </View>
        )
    }

    ToPay() {
        this._Maks.Trigger(true);
        this._ToPayMaks.Trigger(true);
    }

    WillMount() {
        this.setState({
            IsReceived: true
        })
    }
}

const Styles = StyleSheet.create({
    headerStyle: {
        height: px2dp(168),
        backgroundColor: '#fff'
    },
    rowStyle: {
        width: deviceWidth,
        height: px2dp(65),
        position: 'absolute',
        top: (px2dp(168) - px2dp(65)) / 2,
        zIndex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    imageShadow: {
        width: px2dp(65),
        height: px2dp(65),
        opacity: 0.2,
        borderRadius: 50,
        marginLeft: px2dp(26)
    },
    imageStyle: {
        position: 'absolute',
        width: px2dp(57),
        height: px2dp(57),
        borderRadius: Platform.OS == 'ios' ? px2dp(28) : px2dp(50),
        left: px2dp(30),
        top: px2dp(4)
    },
    logoImage: {
        position: 'absolute',
        width: px2dp(57),
        height: px2dp(57),
        borderRadius: Platform.OS == 'ios' ? px2dp(28) : px2dp(50),
        left: px2dp(30),
        top: px2dp(4)
    },
    registLogin: {
        width: px2dp(107),
        flexDirection: 'row',
        justifyContent: 'space-between',
        left: px2dp(25),
    },
    main: {
        flex: 1,
        height: deviceHeight,
    },
    parallelStyle: {
        width: deviceWidth,
        height: px2dp(79),
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: px2dp(10),
        marginTop: px2dp(10)
    },
    parallelStyle2: {
        width: deviceWidth,
        height: px2dp(79),
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
        paddingBottom: px2dp(10),
        marginTop: px2dp(10)
    },

    // 遮罩层内容样式
    selectType: {
        position: 'absolute',
        left: 0,
        bottom: Platform.OS === 'ios' ? px2dp(-36) : px2dp(-16),
        width: deviceWidth,
        height: px2dp(183),
        zIndex: 33,
        paddingLeft: px2dp(10),
        paddingRight: px2dp(10)
    },
    menuItem: {
        height: px2dp(57),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
    }
});

function mapStateToProps(store) {
    return {
        currentEmployee: store.ReduceEmployee.currentEmployee,
        ReduceSellInfo: store.ReduceSellInfo
    }
}

const connectMy = connect(mapStateToProps)(My);
connectMy.navigationOptions = NavigationOptions;
export default connectMy;