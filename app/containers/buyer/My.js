import React, {Component} from "react";
import {connect} from "react-redux";
import {Linking, Platform, StyleSheet, View} from "react-native";
import {
    BCHostImage,
    BCImage,
    BCText,
    BCTouchable,
    deviceWidth,
    NavigationOptions,
    px2dp,
    substr
} from "../../BaseComponent";
import {PullViewComponent} from "../PageComponent";
import gs from "../../styles/MainStyles";
import {ActionStoreInformation} from '../../actions/StoreInformationAction';
import {fetchStoreInformation} from '../../services/StoreInformationServices';

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
                    {/* <BCTouchable style={[Styles.menuItem, gs.bgc_fff,]}>
                     <BCText style={[gs.fts_17, gs.c_BaseColor, gs.fts_18]}>0571-88319282</BCText>
                     </BCTouchable>*/}
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

    static propTypes = {
        url:React.PropTypes.string,
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

    constructor(props) {
        super(props);
        this.state = {
            loginEmployee: {}
        }
    }

    _ToPayMaks = null;

    renderNavigator() {
        return null;
    }

    refeshView(msg) {
        const {dispatch} = this.props;
        dispatch(ActionStoreInformation());
    }

    Top() {
        let loginEmployee = this.props.currentEmployee;

        return (
            <View style={Styles.header}>
                <BCImage source={require('../../imgs/Backgroundmap.png')}
                         style={{width: deviceWidth, height: px2dp(170)}}/>
                <View style={{position: 'absolute', zIndex: 1, top: px2dp(33)}}>
                    <View style={Styles.topStyle}>
                        {
                            loginEmployee.CompanyName ?
                                <BCTouchable onPress={() => {
                                    this.push('StoreInformation', {callback: this.refeshView.bind(this)})
                                }}>
                                    <View style={[Styles.imagShadow, gs.bgc_fff,]}></View>
                                    {
                                        loginEmployee.LogoImage ?
                                            <BCHostImage style={Styles.imageStyle}
                                                         source={{uri: loginEmployee.LogoImage}}/>:
                                            <BCImage style={Styles.imageStyle}
                                                     source={require('../../imgs/Headportrait.png')}/> 
                                    }
                                </BCTouchable> :
                                <BCTouchable onPress={() => {
                                    this.push('StoreInformation', {needLogin: true})
                                }}>
                                    <View style={[Styles.imagShadow, gs.bgc_fff,]}></View>
                                    {
                                        loginEmployee.LogoImage ?
                                            <BCHostImage style={Styles.imageStyle}
                                                         source={{uri: loginEmployee.LogoImage}}/> :
                                            <BCImage style={Styles.imageStyle}
                                                     source={require('../../imgs/Headportrait.png')}/>
                                    }
                                </BCTouchable>

                        }
                        {
                            loginEmployee.CompanyName ?
                                <BCTouchable onPress={() => {
                                    this.push('SetUp')
                                }} style={{left: px2dp(114)}}>
                                    <BCImage source={require('../../imgs/Setup.png')}></BCImage>
                                </BCTouchable> :
                                <BCTouchable onPress={() => {
                                    this.push('SetUp', {needLogin: true})
                                }} style={{left: px2dp(114)}}>
                                    <BCImage source={require('../../imgs/Setup.png')}></BCImage>
                                </BCTouchable>
                        }
                    </View>
                    <View style={Styles.registShow}>
                        {
                            loginEmployee.CompanyName ?
                                <View style={[Styles.registCompany]}>
                                    <BCText
                                        style={[gs.fts_17, gs.c_fff, {backgroundColor: '#31D192'}]}>{substr((loginEmployee.CompanyName), 15)}</BCText>
                                    <BCText
                                        style={[gs.fts_13, gs.c_fff, {backgroundColor: '#31D192'}]}>{substr((loginEmployee.CompanyDescription), 15)}</BCText>
                                </View> :
                                <View style={Styles.registLogin}>
                                    <BCTouchable onPress={() => {
                                        this.push('Login', {needLogin: true, pageType: 'login'})
                                    }}>
                                        <BCText style={[gs.fts_17, gs.c_fff, {backgroundColor: '#31D192'}]}>登录</BCText>
                                    </BCTouchable>
                                    <BCText style={[gs.fts_17, gs.c_fff, {backgroundColor: '#31D192'}]}>|</BCText>
                                    <BCTouchable onPress={() => {
                                        this.push('Login', {needLogin: true, pageType: 'regist'})
                                    }}>
                                        <BCText style={[gs.fts_17, gs.c_fff, {backgroundColor: '#31D192'}]}>注册</BCText>
                                    </BCTouchable>
                                </View>
                        }

                    </View>
                </View>
            </View>
        )
    }

    content() {
        let loginEmployee = this.props.currentEmployee
        return (
            <View style={[Styles.main, gs.bgc_f2f1ef]}>
                {
                    loginEmployee.CompanyName ?
                        <View style={[Styles.bill, gs.bdc_e3e3e3, gs.bgc_fff]}>
                            <BCTouchable onPress={() => {
                                this.push('MyAmount')
                            }} style={{marginLeft: px2dp(55), alignItems: 'center'}}>
                                <BCImage source={require('../../imgs/amount.png')}></BCImage>
                                <BCText style={[gs.fts_13, gs.c_3a3838]}>我的余额</BCText>
                            </BCTouchable>
                            <View style={{width: px2dp(0.5), height: px2dp(40), backgroundColor: '#e3e3e3'}}></View>
                            <BCTouchable onPress={() => {
                                this.push('AccountPay')
                            }} style={{marginRight: px2dp(55), alignItems: 'center'}}>
                                <BCImage source={require('../../imgs/Accountperiods.png')}></BCImage>
                                <BCText style={[gs.fts_13, gs.c_3a3838]}>账期结算</BCText>
                            </BCTouchable>
                        </View> :
                        <View style={[Styles.bill, gs.bdc_e3e3e3, gs.bgc_fff]}>
                            <BCTouchable onPress={() => {
                                this.push('MyAmount', {needLogin: true})
                            }} style={{marginLeft: px2dp(55), alignItems: 'center'}}>
                                <BCImage source={require('../../imgs/amount.png')}></BCImage>
                                <BCText style={[gs.fts_13, gs.c_3a3838]}>我的余额</BCText>
                            </BCTouchable>
                            <View style={{width: px2dp(0.5), height: px2dp(40), backgroundColor: '#e3e3e3'}}></View>
                            <BCTouchable onPress={() => {
                                this.push('AccountPay', {needLogin: true})
                            }} style={{marginRight: px2dp(55), alignItems: 'center'}}>
                                <BCImage source={require('../../imgs/Accountperiods.png')}></BCImage>
                                <BCText style={[gs.fts_13, gs.c_3a3838]}>账期结算</BCText>
                            </BCTouchable>
                        </View>
                }
                {
                    loginEmployee.CompanyName ?
                        <View style={[Styles.myOrder, gs.bdc_e3e3e3, gs.bgc_fff]}>
                            <BCTouchable onPress={() => {this.push('PurchaseOrderList')}}
                                         style={[Styles.orderTitle, gs.bdc_e3e3e3]}>
                                <BCText style={[gs.fts_15, {color: '#000', marginLeft: px2dp(12)}]}>我的订单</BCText>
                                <BCTouchable style={{flexDirection: 'row', marginRight: px2dp(13)}} onPress={() => {
                                    this.push('PurchaseOrderList')
                                }}>
                                    <BCText style={[gs.fts_12, gs.c_b7b7b7]}>查看全部订单</BCText>
                                    <BCImage style={{width: px2dp(12), height: px2dp(12)}}
                                             source={require('../../imgs/right1.png')}></BCImage>
                                </BCTouchable>
                            </BCTouchable>
                            <View style={Styles.orderList}>
                                <BCTouchable onPress={() => {
                                    this.push('PurchaseOrderList', {initialPage: 0})

                                }} style={{alignItems: 'center'}}>
                                    <View>
                                        <BCImage source={require('../../imgs/Tobepaid.png')}></BCImage>
                                    </View>
                                    <View style={{marginTop: px2dp(8.5)}}>
                                        <BCText style={[gs.c_3a3838, gs.fts_12]}>待付款</BCText>
                                    </View>
                                </BCTouchable>
                                <BCTouchable onPress={() => {
                                    this.push('PurchaseOrderList', {initialPage: 1})

                                }} style={{alignItems: 'center'}}>
                                    <View>
                                        <BCImage source={require('../../imgs/Waitinglist.png')}></BCImage>
                                    </View>
                                    <View style={{marginTop: px2dp(8.5)}}>
                                        <BCText style={[gs.c_3a3838, gs.fts_12]}>待接单</BCText>
                                    </View>
                                </BCTouchable>
                                <BCTouchable onPress={() => {
                                    this.push('PurchaseOrderList', {initialPage: 2})

                                }} style={{alignItems: 'center'}}>
                                    <View>
                                        <BCImage source={require('../../imgs/Waitingfordelivery.png')}></BCImage>
                                    </View>
                                    <View style={{marginTop: px2dp(8.5)}}>
                                        <BCText style={[gs.c_3a3838, gs.fts_12]}>待发货</BCText>
                                    </View>
                                </BCTouchable>
                                <BCTouchable onPress={() => {
                                    this.push('PurchaseOrderList', {initialPage: 3})

                                }} style={{alignItems: 'center'}}>
                                    <View>
                                        <BCImage source={require('../../imgs/Waitingforinspection.png')}></BCImage>
                                    </View>
                                    <View style={{marginTop: px2dp(8.5)}}>
                                        <BCText style={[gs.c_3a3838, gs.fts_12]}>待验货</BCText>
                                    </View>
                                </BCTouchable>
                                <BCTouchable onPress={() => {
                                    this.push('ServiceList')
                                }}
                                             style={{alignItems: 'center'}}>
                                    <View>
                                        <BCImage source={require('../../imgs/Aftersalemanagements.png')}/>
                                    </View>
                                    <View style={{marginTop: px2dp(8.5)}}>
                                        <BCText style={[gs.c_3a3838, gs.fts_12]}>售后</BCText>
                                    </View>
                                </BCTouchable>
                            </View>
                        </View> :
                        <View style={[Styles.myOrder, gs.bdc_e3e3e3, gs.bgc_fff]}>
                            <BCTouchable style={[Styles.orderTitle, gs.bdc_e3e3e3]}
                                         onPress={() => {
                                            this.push('CurrentPurchaseAmount', {needLogin: true})
                                         }}
                            >
                                <BCText style={[gs.fts_15, {color: '#000', marginLeft: px2dp(12)}]}>我的订单</BCText>
                                <BCTouchable style={{flexDirection: 'row', marginRight: px2dp(13)}} onPress={() => {
                                    this.push('CurrentPurchaseAmount', {needLogin: true})
                                }}>
                                    <BCText style={[gs.fts_12, gs.c_b7b7b7]}>查看全部订单</BCText>
                                    <BCImage style={{width: px2dp(12), height: px2dp(12)}}
                                             source={require('../../imgs/right1.png')}></BCImage>
                                </BCTouchable>
                            </BCTouchable>
                            <View style={Styles.orderList}>
                                <BCTouchable onPress={() => {
                                    this.push('PurchaseOrderList', {needLogin: true})
                                }} style={{alignItems: 'center'}}>
                                    <View>
                                        <BCImage source={require('../../imgs/Tobepaid.png')}></BCImage>
                                    </View>
                                    <View style={{marginTop: px2dp(8.5)}}>
                                        <BCText style={[gs.c_3a3838, gs.fts_12]}>待支付</BCText>
                                    </View>
                                </BCTouchable>
                                <BCTouchable onPress={() => {
                                    this.push('PurchaseOrderList', {needLogin: true})
                                }} style={{alignItems: 'center'}}>
                                    <View>
                                        <BCImage source={require('../../imgs/Waitinglist.png')}></BCImage>
                                    </View>
                                    <View style={{marginTop: px2dp(8.5)}}>
                                        <BCText style={[gs.c_3a3838, gs.fts_12]}>待接单</BCText>
                                    </View>
                                </BCTouchable>
                                <BCTouchable onPress={() => {
                                    this.push('PurchaseOrderList', {needLogin: true})
                                }} style={{alignItems: 'center'}}>
                                    <View>
                                        <BCImage source={require('../../imgs/Waitingfordelivery.png')}></BCImage>
                                    </View>
                                    <View style={{marginTop: px2dp(8.5)}}>
                                        <BCText style={[gs.c_3a3838, gs.fts_12]}>待发货</BCText>
                                    </View>
                                </BCTouchable>
                                <BCTouchable onPress={() => {
                                    this.push('PurchaseOrderList', {needLogin: true})
                                }} style={{alignItems: 'center'}}>
                                    <View>
                                        <BCImage source={require('../../imgs/Waitingforinspection.png')}></BCImage>
                                    </View>
                                    <View style={{marginTop: px2dp(8.5)}}>
                                        <BCText style={[gs.c_3a3838, gs.fts_12]}>待验货</BCText>
                                    </View>
                                </BCTouchable>
                                <BCTouchable onPress={() => {
                                    this.push('CustomerService')
                                }} style={{alignItems: 'center'}}>
                                    <View>
                                        <BCImage source={require('../../imgs/Aftersalemanagements.png')}></BCImage>
                                    </View>
                                    <View style={{marginTop: px2dp(8.5)}}>
                                        <BCText style={[gs.c_3a3838, gs.fts_12]}>售后</BCText>
                                    </View>
                                </BCTouchable>
                            </View>
                        </View>
                }
                <View>
                    {
                        loginEmployee.CompanyName ?
                            <View style={[Styles.aboutStyle, gs.bdc_e3e3e3, gs.bgc_fff]}>
                                <BCTouchable style={Styles.itemStyle} onPress={() => {
                                    this.push('CurrentPurchaseAmount')
                                }}>
                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <BCImage style={{marginLeft: px2dp(12.5)}}
                                                 source={require('../../imgs/Statistic.png')}></BCImage>
                                        <BCText style={[gs.fts_15, gs.c_3a3838, {marginLeft: px2dp(18)}]}>统计</BCText>
                                    </View>
                                    <View style={{marginRight: px2dp(10), width: px2dp(14), height: px2dp(14)}}>
                                        <BCImage source={require('../../imgs/right1.png')}></BCImage>
                                    </View>
                                </BCTouchable>
                                <BCTouchable style={Styles.itemStyle} onPress={() => {
                                    this.push('AddressList', {pageFrom: 'My'})
                                }}>
                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <BCImage style={{marginLeft: px2dp(12.5)}}
                                                 source={require('../../imgs/Receivingaddress.png')}></BCImage>
                                        <BCText
                                            style={[gs.fts_15, gs.c_3a3838, {marginLeft: px2dp(18)}]}>我的收货地址</BCText>
                                    </View>
                                    <View style={{marginRight: px2dp(10), width: px2dp(14), height: px2dp(14)}}>
                                        <BCImage source={require('../../imgs/right1.png')}></BCImage>
                                    </View>
                                </BCTouchable>
                                <BCTouchable onPress={() => {
                                    this.push('CommonProblem')
                                }} style={Styles.itemStyle}>
                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <BCImage style={{marginLeft: px2dp(12.5)}}
                                                 source={require('../../imgs/Commonproblem.png')}></BCImage>
                                        <BCText style={[gs.fts_15, gs.c_3a3838, {marginLeft: px2dp(18)}]}>常见问题</BCText>
                                    </View>
                                    <View style={{marginRight: px2dp(10), width: px2dp(14), height: px2dp(14)}}>
                                        <BCImage source={require('../../imgs/right1.png')}></BCImage>
                                    </View>
                                </BCTouchable>
                                <BCTouchable onPress={() => {
                                    this.ToPay()
                                }} style={Styles.itemStyle}>
                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <BCImage style={{marginLeft: px2dp(12.5)}}
                                                 source={require('../../imgs/ContactCustomerService.png')}></BCImage>
                                        <BCText style={[gs.fts_15, gs.c_3a3838, {marginLeft: px2dp(18)}]}>联系客服</BCText>
                                    </View>
                                    <View style={{marginRight: px2dp(10), width: px2dp(14), height: px2dp(14)}}>
                                        <BCImage source={require('../../imgs/right1.png')}></BCImage>
                                    </View>
                                </BCTouchable>
                                <BCTouchable onPress={() => {
                                    this.push('AboutUs')
                                }} style={Styles.itemStyle}>
                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <BCImage style={{marginLeft: px2dp(12.5)}}
                                                 source={require('../../imgs/Aboutus.png')}></BCImage>
                                        <BCText style={[gs.fts_15, gs.c_3a3838, {marginLeft: px2dp(18)}]}>关于我们</BCText>
                                    </View>
                                    <View style={{marginRight: px2dp(10), width: px2dp(14), height: px2dp(14)}}>
                                        <BCImage source={require('../../imgs/right1.png')}></BCImage>
                                    </View>
                                </BCTouchable>
                            </View> :
                            <View style={[Styles.aboutStyle, gs.bdc_e3e3e3, gs.bgc_fff]}>
                                <BCTouchable style={Styles.itemStyle} onPress={() => {
                                    this.push('CurrentPurchaseAmount', {needLogin: true})
                                }}>
                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <BCImage style={{marginLeft: px2dp(12.5)}}
                                                 source={require('../../imgs/Statistic.png')}></BCImage>
                                        <BCText style={[gs.fts_15, gs.c_3a3838, {marginLeft: px2dp(18)}]}>统计</BCText>
                                    </View>
                                    <View style={{marginRight: px2dp(10), width: px2dp(14), height: px2dp(14)}}>
                                        <BCImage source={require('../../imgs/right1.png')}></BCImage>
                                    </View>
                                </BCTouchable>
                                <BCTouchable style={Styles.itemStyle} onPress={() => {
                                    this.push('AddressList', {pageFrom: 'My', needLogin: true})
                                }}>
                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <BCImage style={{marginLeft: px2dp(12.5)}}
                                                 source={require('../../imgs/Receivingaddress.png')}></BCImage>
                                        <BCText
                                            style={[gs.fts_15, gs.c_3a3838, {marginLeft: px2dp(18)}]}>我的收货地址</BCText>
                                    </View>
                                    <View style={{marginRight: px2dp(10), width: px2dp(14), height: px2dp(14)}}>
                                        <BCImage source={require('../../imgs/right1.png')}></BCImage>
                                    </View>
                                </BCTouchable>
                                <BCTouchable onPress={() => {
                                    this.push('CommonProblem')
                                }} style={Styles.itemStyle}>
                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <BCImage style={{marginLeft: px2dp(12.5)}}
                                                 source={require('../../imgs/Commonproblem.png')}></BCImage>
                                        <BCText style={[gs.fts_15, gs.c_3a3838, {marginLeft: px2dp(18)}]}>常见问题</BCText>
                                    </View>
                                    <View style={{marginRight: px2dp(10), width: px2dp(14), height: px2dp(14)}}>
                                        <BCImage source={require('../../imgs/right1.png')}></BCImage>
                                    </View>
                                </BCTouchable>
                                <BCTouchable onPress={() => {
                                    this.ToPay()
                                }} style={Styles.itemStyle}>
                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <BCImage style={{marginLeft: px2dp(12.5)}}
                                                 source={require('../../imgs/ContactCustomerService.png')}></BCImage>
                                        <BCText style={[gs.fts_15, gs.c_3a3838, {marginLeft: px2dp(18)}]}>联系客服</BCText>
                                    </View>
                                    <View style={{marginRight: px2dp(10), width: px2dp(14), height: px2dp(14)}}>
                                        <BCImage source={require('../../imgs/right1.png')}></BCImage>
                                    </View>
                                </BCTouchable>
                                <BCTouchable onPress={() => {
                                    this.push('AboutUs')
                                }} style={Styles.itemStyle}>
                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <BCImage style={{marginLeft: px2dp(12.5)}}
                                                 source={require('../../imgs/Aboutus.png')}></BCImage>
                                        <BCText style={[gs.fts_15, gs.c_3a3838, {marginLeft: px2dp(18)}]}>关于我们</BCText>
                                    </View>
                                    <View style={{marginRight: px2dp(10), width: px2dp(14), height: px2dp(14)}}>
                                        <BCImage source={require('../../imgs/right1.png')}></BCImage>
                                    </View>
                                </BCTouchable>
                            </View>

                    }
                </View>
            </View>
        )
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
        const {dispatch} = this.props;
        //dispatch(ActionStoreInformation());
        this.setState({
            IsReceived: true
        });
    }

    WillReceive(nextProps) {

    }
}

const Styles = StyleSheet.create({
    main: {
        flex: 1
    },
    header: {
        height: px2dp(170)
    },
    topStyle: {
        height: px2dp(65),
        width: deviceWidth,
        flexDirection: 'row',
    },
    imagShadow: {
        width: px2dp(65),
        height: px2dp(65),
        opacity: 0.2,
        borderRadius: 50,
        marginLeft: px2dp(147),
    },
    imageStyle: {
        position: 'absolute',
        left: (deviceWidth - px2dp(57)) / 2,
        top: px2dp(4),
        width: px2dp(57),
        height: px2dp(57),
        borderRadius: Platform.OS == 'ios' ? px2dp(28) : px2dp(50),
    },
    registLogin: {
        width: px2dp(107),
        flexDirection: 'row',
        justifyContent: 'space-between',
        left: (deviceWidth - px2dp(107)) / 2,
    },
    registCompany: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    registShow: {
        width: deviceWidth,
        marginTop: px2dp(10),
        marginBottom: px2dp(10)
    },
    bill: {
        height: px2dp(66),
        borderBottomWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    myOrder: {
        height: px2dp(116.5),
        borderBottomWidth: 1,
        marginTop: px2dp(10)
    },
    orderTitle: {
        height: px2dp(39),
        borderBottomWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    orderList: {
        height: px2dp(77),
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    aboutStyle: {
        height: px2dp(235),
        borderBottomWidth: 1,
        marginTop: px2dp(10)
    },
    itemStyle: {
        height: px2dp(47),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
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
        ReduceStoreInformation: store.ReduceStoreInformation
    }
}

const connectMy = connect(mapStateToProps)(My);
connectMy.navigationOptions = NavigationOptions;
export default connectMy;