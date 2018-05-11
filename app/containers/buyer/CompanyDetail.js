/**
 * Created by Administrator on 2017/4/5.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Platform,
    ScrollView,
    Linking,
    TouchableHighlight
} from 'react-native';
import PageComponent,{PullViewComponent} from '../PageComponent'
import {
    px2dp,
    deviceWidth,
    deviceHeight,
    substr,
    BCText,
    BCImage,
    BCTouchable,
    NavigationOptions,
    BCHostImage,
} from '../../BaseComponent';
import gs from '../../styles/MainStyles';
import {toastLong} from '../../utils/ToastUtil';
import {ActionCompanyImages} from "../../actions/MyAction"
import {ActionProviders, ActionProvider} from '../../actions/ProviderAction';
import {formaTime, toDecimal2} from '../../utils/FormatUtil'
import {ReduceCompanyImages} from "../../reducers/ReducePurchaseMy";

class OnCallMaks extends Component {
    constructor(props) {
        super(props)
        this.state = {
            IsShow: false
        }
    }

    static propTypes = {
        Call: React.PropTypes.func,
        Cancle: React.PropTypes.func,
        Phone: React.PropTypes.string,
    };

    Trigger(v) {
        this.setState({
            IsShow: v
        })
    }

    render() {
        return (
            this.state.IsShow ?
                <View style={[Detail.selectType]}>
                    <CustomButton url={'tel:' + this.props.Phone} text={this.props.Phone}/>
                    {/*<BCTouchable style={[Detail.menuItem, gs.bgc_fff,]}>
                     <BCText style={[gs.fts_17, gs.c_BaseColor, gs.fts_18]}>{this.props.Phone}</BCText>
                     </BCTouchable>*/}
                    <BCTouchable style={[Detail.menuItem, gs.bgc_fff, {marginTop: px2dp(10)}]}
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
                style={[Detail.menuItem, gs.bgc_fff,]}
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

class CompanyDetail extends PullViewComponent {
    constructor(props) {
        super(props);
        this.state = {
            isBorderBottom: true,
            data: [],
            certificates: [],
            from: 1,          //1为买家0为卖家
        }
    }

    static propTypes = {
        OnCall: React.PropTypes.func,
    };
    _OnCallMaks = null;

    //设置页面标题
    setTitle() {
        return "商户详情"
    }


    shouldComponentUpdate() {
        return true;
    }

    content() {
        const ReduceCompanyImages = this.props.ReduceCompanyImages;
        const ReduceProviders = this.props.ReduceProvider;
        if (ReduceProviders.datas && ReduceCompanyImages && ReduceCompanyImages.datas) {
            let companyData = ReduceProviders.datas;
            //营业时间
            let OpenTimeFrom = formaTime(companyData.OpenTimeFrom, "hh:mm");
            let OpenTimeTo = formaTime(companyData.OpenTimeTo, "hh:mm");
            let Time = OpenTimeFrom + '-' + OpenTimeTo;
            //认证照片
            let CertificateImage = ReduceCompanyImages.datas.CertificateImage;
            let LicenseImage = ReduceCompanyImages.datas.LicenseImage;

            return (
                <View style={[Detail.main, gs.bgc_f2f1ef]}>
                    {/*头部*/}
                    <View style={gs.bgc_fff}>
                        <View style={[Detail.head]}>
                            {
                                companyData.LogoImage?
                                    <BCHostImage style={{height: px2dp(74), width: px2dp(74)}}
                                                 source={{uri: companyData.LogoImage}}></BCHostImage>
                                    :
                                    <BCImage style={{height: px2dp(74), width: px2dp(74)}}
                                             source={require('../../imgs/LOGO.png')}/>
                            }
                             <View style={{
                                justifyContent: "space-around",
                                marginLeft: px2dp(12),
                                paddingTop: px2dp(4),
                                paddingBottom: px2dp(4)
                            }}>
                                <BCText style={[gs.fts_16, gs.c_3a3838,{width:deviceWidth-px2dp(86),paddingRight:px2dp(7)}]}>{companyData.CompanyName}</BCText>
                                <BCText style={[gs.fts_14, gs.c_888,{width:px2dp(260)}]}>主营:{companyData.MainType}</BCText>
                                <View style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    width: deviceWidth - px2dp(110),
                                }}>
                                    {/*<BCText style={[gs.fts_14, gs.c_888,]}>3公里内免费配送</BCText>*/}
                                    {/*<BCText*/}
                                        {/*style={[gs.fts_14, gs.c_888,]}>/!*companyData.Distance?companyData.Distance:0*!/m</BCText>*/}
                                </View>
                            </View>
                        </View>
                        <View style={Detail.address}>
                            <BCImage source={require("../../imgs/position@2x.png")}></BCImage>
                            <BCText
                                style={[gs.fts_14, gs.c_3a3838, Detail.addressTitle, {borderRightColor: gs.bgc_f2f1ef}]}>{substr((companyData.Address), 40)}</BCText>
                            <BCTouchable style={Detail.call} onPress={() => this.OnCall(companyData.phone)}>
                                <BCImage source={require("../../imgs/telephone@2x.png")}></BCImage>
                            </BCTouchable>
                        </View>
                    </View>
                    {
                        companyData.IsBind  && this.state.from?
                            this.renderRow('营业时间: ', Time, true, require('../../imgs/time.png')):null
                    }
                    {
                        companyData.IsBind ?
                            this.renderRow('约定账期: ', companyData.Cycle, true, require('../../imgs/Accountperiod.png')):null
                    }
                    {
                        companyData.IsBind ?
                            this.renderRow('付款延迟: ', companyData.PaymentDelay, false, require('../../imgs/payment.png')):null
                    }
                    <View style={{height: px2dp(10)}}></View>
                    {
                        companyData.IsBind  && this.state.from?
                            this.renderRow('起送价: ', companyData.StartPrice ? companyData.StartPrice : 0, true, require('../../imgs/Startingprice.png')):null
                    }
                    {this.state.from?
                        this.renderRow('配送范围: ', companyData.Distance ? toDecimal2(companyData.Distance / 1000) + '公里' : "无", false, require('../../imgs/Range.png')):null}
                    <View style={{height: px2dp(10)}}></View>
                    {
                            this.renderRow('企业认证','', true, require('../../imgs/qiye.png'))
                    }
                    <View style={[Detail.licenses]}>
                        <View style={{alignItems:'center',justifyContent:'center',marginLeft:px2dp(15)}}>
                            <View style={[Detail.licensesItem]}>
                                {
                                    CertificateImage?
                                        <BCHostImage  style={{ width: px2dp(95),height: px2dp(125)}} source={{uri: CertificateImage}}></BCHostImage>:
                                        <BCImage
                                                 source={require('../../imgs/LOGO.png')}/>
                                }
                            </View>
                            <BCText style={[gs.fts_12]}>工商营业执照</BCText>
                        </View>
                        {this.state.from?
                            <View style={{alignItems: 'center', justifyContent: 'center', marginLeft: px2dp(15)}}>
                                <View style={[Detail.licensesItem]}>
                                    {
                                        LicenseImage ?
                                            <BCHostImage style={{width: px2dp(95), height: px2dp(125)}}
                                                         source={{uri: LicenseImage}}></BCHostImage> :
                                            <BCImage
                                                source={require('../../imgs/LOGO.png')}/>
                                    }
                                </View>
                                <BCText style={[gs.fts_12]}>食品经营许可证</BCText>
                            </View>:null
                        }
                    </View>
                </View>
            )
        } else {
            return (
                <View style={[Detail.main, gs.bgc_f2f1ef]}>
                    {
                        this.noRecord('暂无数据')
                    }
                </View>
            )
        }

    }

    OnCall() {
        this._Maks.Trigger(true);
        this._OnCallMaks.Trigger(true);
    }

    maksContent() {
        const ReduceProvider = this.props.ReduceProvider;
        if (ReduceProvider.datas) {
            let companyData = ReduceProvider.datas;
            return (
                <View>
                    <OnCallMaks
                        ref={(ref) => this._OnCallMaks = ref}
                        Cancle={() => {
                            this._OnCallMaks.Trigger(false);
                            this._Maks.Trigger(false);
                        }}
                        Call={() => {
                            this._Maks.Trigger(false);
                            this._OnCallMaks.Trigger(false);
                        }}
                        Phone={companyData.Phone}
                    />
                </View>
            )
        } else {

        }

    }

    renderHead() {
        return (
            <View style={gs.bgc_fff}>
                <View style={[Detail.head]}>
                    <BCImage style={{height: px2dp(74), width: px2dp(74)}}
                             source={require('../../imgs/LOGO.png')}/>
                    <View style={{
                        justifyContent: "space-around",
                        marginLeft: px2dp(12),
                        paddingTop: px2dp(4),
                        paddingBottom: px2dp(4)
                    }}>
                        <BCText style={[gs.fts_16, gs.c_3a3838,]}>吴氏商品有限公司</BCText>
                        <BCText style={[gs.fts_14, gs.c_888,]}>主营:新鲜时蔬 禽蛋肉类 调料其他</BCText>
                        <View style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            width: deviceWidth - px2dp(110),
                        }}>
                            <BCText style={[gs.fts_14, gs.c_888,]}>3公里内免费配送</BCText>
                            <BCText style={[gs.fts_14, gs.c_888,]}>600m</BCText>
                        </View>
                    </View>
                </View>
                <View style={Detail.address}>
                    <BCImage source={require("../../imgs/position@2x.png")}></BCImage>
                    <BCText
                        style={[gs.fts_14, gs.c_3a3838, Detail.addressTitle, {borderRightColor: gs.bgc_f2f1ef}]}>{substr('霞湾霞8号霞湾霞8号霞湾霞8号霞湾霞8号霞湾霞8号霞湾霞8号霞湾霞8号霞湾霞8号霞湾霞8号', 40)}</BCText>
                    <BCTouchable style={Detail.call} onPress={() => this.onShow()}>
                        <BCImage source={require("../../imgs/telephone@2x.png")}></BCImage>
                    </BCTouchable>
                </View>
            </View>
        )
    }

    renderRow(title, string, isBorderBottom, image,) {
        return (
            <View style={[Detail.row, gs.bgc_fff,]}>
                <BCImage source={image}></BCImage>
                <View style={[Detail.border, isBorderBottom ? {borderBottomColor: "#e3e3e3"} : gs.bgc_fff]}>
                    <BCText style={[gs.fts_14, gs.c_3a3838,]}>{title}</BCText>
                    <BCText style={[gs.fts_14, gs.c_3a3838, {width: deviceWidth - px2dp(110)}]}>{string}</BCText>
                </View>
            </View>
        )
    }

    /* Bottom() {
     return (
     <View style={{zIndex: 2}}>
     {/!*  <BCText onPress={() => this.onOpenMask()}>开启</BCText>
     <BCText onPress={() => this.onOpenMask()}>---------</BCText>
     <BCText onPress={() => this.onCloseMask()}>关</BCText>*!/}
     </View>
     )
     }*/

    componentDidMount() {
        var url = Linking.getInitialURL().then((url) => {
            if (url) {
                //console.log('捕捉的URL地址为: ' + url);
            }
        }).catch(err => console.error('错误信息为:', err));
    }

    WillMount() {
        const {dispatch} = this.props;
        const {bCompanyId, sCompanyId} = this.props.navigation.state.params;
        dispatch(ActionProvider(14, sCompanyId));
        dispatch(ActionCompanyImages({companyId:sCompanyId}));
        this.setState({IsReceived: true});
    }

    WillReceive(nextProps) {
        if (nextProps.ReduceProvider.datas != null && nextProps.ReduceProvider != this.props.ReduceProvider) {
            const {ReduceProvider} = nextProps;
            this.setState({
                from: nextProps.navigation.state.params.from,
                data: ReduceProvider.datas
            });
            if(nextProps.ReduceCompanyImages.datas != null && nextProps.ReduceCompanyImages != this.props.ReduceCompanyImages){
                const {ReduceCompanyImages} = nextProps;
                this.setState({
                    certificates: ReduceCompanyImages.datas,
                    IsReceived: true,
                })
            }
        }
        if (nextProps.ReduceCompanyImages.error != null && nextProps.ReduceCompanyImages.error != this.props.ReduceCompanyImages.error) {
            this.setState({
                IsReceived: true
            })
        }
        if (nextProps.ReduceProvider.error != null && nextProps.ReduceProvider.error != this.props.ReduceProvider.error) {
            this.setState({
                IsReceived: true
            })
        }
    }

}

const Detail = StyleSheet.create({
    main: {
        flex: 1,
        minHeight: deviceHeight + 1,
    },
    head: {
        flexDirection: 'row',
        padding: px2dp(12)
    },
    address: {
        flexDirection: 'row',
        paddingLeft: px2dp(12),
        paddingBottom: px2dp(12),
        alignItems: "center"

    },
    addressTitle: {
        width: deviceWidth - px2dp(80),
        paddingLeft: px2dp(10),
        paddingRight: px2dp(10),
        borderRightWidth: 1,
    },
    call: {
        marginLeft: px2dp(15),
        width: px2dp(30),
        height: px2dp(30),
        justifyContent: 'center',
        alignItems: 'center'
    },
    row: {
        height: px2dp(40),
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: px2dp(12)
    },
    border: {
        width: deviceWidth - px2dp(39),
        borderBottomWidth: px2dp(0),
        height: px2dp(39),
        borderBottomColor: "#fff",
        marginLeft: px2dp(10),
        flexDirection: "row",
        alignItems: "center"

    },
    licensesItem: {
        alignItems:'center',
        justifyContent: 'center',
        width: px2dp(95),
        height: px2dp(125),
        borderWidth:1,
        borderColor: '#eee',
    },
    licenses:{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: "#fff",
        width:'100%',
        height: px2dp(160),
        paddingLeft: px2dp(20),
    },
    selectType: {
        position: 'absolute',
        left: 0,
        bottom: Platform.OS === 'ios' ? px2dp(-36) : px2dp(-45),
        width: deviceWidth,
        height: px2dp(183),
        zIndex: 2,
        paddingLeft: px2dp(10),
        paddingRight: px2dp(10)
    },
    menuItem: {
        height: px2dp(57),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
    },
    button: {
        margin: 5,
        backgroundColor: 'white',
        padding: 15,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#cdcdcd',
    },
});

function mapStateToProps(store) {
    return {
        ReduceProvider: store.ReduceProvider,
        ReduceCompanyImages: store.ReduceCompanyImages
    }

}

const connectProviders = connect(mapStateToProps)(CompanyDetail);
connectProviders.navigationOptions = NavigationOptions;
export default connectProviders;