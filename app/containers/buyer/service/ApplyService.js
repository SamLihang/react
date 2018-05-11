/**
 * Created by Administrator on 2017/7/24.
 */
import React, {Component} from "react";
import {InteractionManager, Platform, StyleSheet, TextInput, View, KeyboardAvoidingView,ScrollView} from "react-native";
import {
    BCHostImage,
    BCImage,
    BCText,
    BCTouchable,
    deviceHeight,
    deviceWidth,
    NavigationOptions,
    px2dp,px2dpH,
    substr,
    BCTextarea
} from "../../../BaseComponent";
import {PullViewComponent} from "../../PageComponent";
import gs from "../../../styles/MainStyles";
import {connect} from "react-redux";
import {formaTime, toDecimal2} from "../../../utils/FormatUtil";
import PasswordInput from "../../../components/PasswordInput";
import CheckBox from "../../../components/CheckBox";
import {toastShort, confirm} from "../../../utils/ToastUtil";
import {fetchApplyService} from '../../../services/PurchaseOrderServices';
import ImagePicker from 'react-native-image-crop-picker';
import {uploadImage} from "../../../utils/RequestUtil";
import {setting} from '../../../utils/RequestUtil';


//遮罩层 相机相册
class ToPayMaks2 extends Component {
    constructor(props) {
        super(props)
        this.state = {
            IsShow: false,
            image: null,
            images: null
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

    //点击拍照的方法
    takePhoto() {
        this.props.OnTakePhoto()
    }

    //选着图片
    SelectPhoto() {
        this.props.OnSelectPhoto()
    }

    render() {
        return (
            this.state.IsShow ?
                <View style={[Styles.selectType]}>
                    <BCTouchable onPress={() => {
                        this.takePhoto()
                    }} style={[Styles.menuItem, gs.bgc_fff, gs.bdc_e3e3e3, {
                        borderBottomLeftRadius: px2dp(0),
                        borderBottomRightRadius: px2dp(0)
                    }]}>
                        <BCText style={[gs.fts_17, gs.c_BaseColor, gs.fts_18]}>拍照</BCText>
                    </BCTouchable>
                    <View style={{height: px2dpH(0.5), width: px2dp(355), backgroundColor: '#e3e3e3'}}></View>
                    <BCTouchable onPress={() => {
                        this.SelectPhoto()
                    }}
                                 style={[Styles.menuItem, gs.bgc_fff, {
                                     borderTopLeftRadius: px2dp(0),
                                     borderTopRightRadius: px2dp(0)
                                 }]}>
                        <BCText style={[gs.fts_17, gs.c_BaseColor, gs.fts_18]}>相册</BCText>
                    </BCTouchable>
                    <BCTouchable style={[Styles.menuItem, gs.bgc_fff, {marginTop: px2dp(10)}]}
                                 onPress={() => this.props.Cancle()}>
                        <BCText style={[gs.fts_17, gs.c_3a3838, gs.fts_18]}>取消</BCText>
                    </BCTouchable>
                </View> : null
        )
    }
}

//遮罩层
class ToPayMaks extends Component {
    static propTypes = {
        Cancle: React.PropTypes.func,
        _changeText: React.PropTypes.func,
    };

    constructor(props) {
        super(props)
        this.state = {
            IsShow: false
        }
        this.checkedArray = []
    }

    Trigger(v) {
        this.setState({
            IsShow: v
        })
    }

    _CheckBoxList = [];
    _CheckBoxAll = null;

    renderProduct() {
        return (

            <View style={Styles.product}>
                <ScrollView
                    ref={(scroll)=>this._scroll = scroll}
                    style={[{height:px2dpH(300)}] }
                    //contentContainerStyle={{paddingLeft:20,paddingTop:20,paddingRight:20}}
                    keyboardDismissMode='on-drag'
                    keyboardShouldPersistTaps='never'
                    showsVerticalScrollIndicator={true}
                    scrollEnabled={true}
                    pagingEnabled={true}
                    horizontal={false}
                    onContentSizeChange={(contentWidth, contentHeight)=>{
                        // var msg = 'onContentSizeChange:'+contentWidth+','+contentHeight;
                        // ToastAndroid.show(msg,ToastAndroid.SHORT);
                    }}
                    onScroll={(e)=>{
                        // console.warn('onScroll');
                    }}>

                {
                    this.props.data.map((item, index) => {
                        let productName = item.ProductName;
                        let image = item.Image;
                        let spec = item.Spec;
                        let unit = item.Unit;
                        let actualQuantity = item.ActualQuantity;
                        let price = item.Price;

                        return (



                                <View style={Styles.listBoxStyle} key={index}>

                                <CheckBox
                                    ref={(c) => {
                                        if (c != null) {
                                            this._CheckBoxList.push(c);
                                        }
                                    }}
                                    IsSelect={this.state.IsSelect}
                                    checked={require('../../../imgs/onSelect.png')}
                                    OnChange={(isSelect) => {
                                        let boxProducts = this._CheckBoxList;
                                        if (boxProducts) {
                                            let i = 0;
                                            boxProducts.map((boxProduct) => {
                                                if (boxProduct.state.IsSelect) {
                                                    i++;
                                                }
                                            });
                                            if (isSelect) {
                                                if (i + 1 > boxProducts.length) {
                                                    this._CheckBoxAll.OnChange(isSelect, this)
                                                }
                                            } else {
                                                if (i + 1 <= boxProducts.length) {
                                                    this._CheckBoxAll.OnChange(isSelect, this);
                                                }
                                            }
                                        }

                                        //找到操作的哪一个
                                        const i = this.checkedArray.findIndex(item => item == index);
                                        if (i >= 0) {
                                            if (!isSelect) {
                                                this.checkedArray.splice(i, 1)
                                            }
                                        }
                                        else {
                                            if (isSelect) {
                                                this.checkedArray.push(index)
                                            }
                                        }

                                    }}
                                />
                                <BCHostImage style={{width: px2dp(41), height: px2dpH(41)}}
                                             source={{uri: image}}/>
                                <View style={Styles.titleStyle}>
                                    <BCText style={[gs.fts_16, gs.c_3a3838]}>{substr(productName, 10)}</BCText>
                                    <View style={Styles.priceStyle}>
                                        <BCText style={[gs.c_3a3838, gs.fts_13]}>{spec}</BCText>
                                        <BCText
                                            style={[gs.c_3a3838, gs.fts_13, {paddingLeft: px2dp(50)}]}>￥{price}/{unit}</BCText>
                                        <BCText
                                            style={[gs.c_3a3838, gs.fts_13, {paddingLeft: px2dp(50)}]}>X{actualQuantity}</BCText>
                                    </View>
                                </View>
                                </View>


                        )
                    })
                }
                </ScrollView>
            </View>
            )
    }

    render() {
        return (
            this.state.IsShow ?
                <View style={{
                    zIndex: 1000,
                    position: 'relative',
                    bottom: px2dpH(100),
                    width: deviceWidth,
                    backgroundColor: '#fff',
                    //height: Platform.OS == 'ios' ? px2dpH(360) : px2dpH(300)
                }}>
                    <View>
                        <BCText style={[gs.c_888, gs.fts_14, {padding: px2dp(10)}]}>选择售后商品</BCText>
                        {this.renderProduct()}
                        <View style={Styles.checkBoxStyle}>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <CheckBox
                                    checked={require('../../../imgs/onSelect.png')}
                                    ref={(c) => {
                                        this._CheckBoxAll = c
                                    }}
                                    OnChange={(isSelect) => {
                                        let boxBoxList = this._CheckBoxList;
                                        boxBoxList.map((data, index) => {
                                            data.OnChange(isSelect, this);
                                        });

                                        //同步checkedArray
                                        if (isSelect) {
                                            this.checkedArray = [];
                                            this.props.data.map((item, index) => {
                                                this.checkedArray.push(index);
                                            })
                                        }
                                        else {
                                            this.checkedArray = [];
                                        }
                                    }}
                                />
                                <BCText style={[gs.fts_14, gs.c_3a3838]}>全选</BCText>
                            </View>
                            <BCTouchable onPress={
                                () => this.props.Cancle(this.checkedArray)
                            } style={{
                                width: px2dp(63),
                                height: px2dpH(32),
                                borderRadius: px2dp(4),
                                backgroundColor: '#fd0319',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginRight: px2dp(16)
                            }}>
                                <BCText style={[gs.fts_14, gs.c_fff]}>确定</BCText>
                            </BCTouchable>
                        </View>
                    </View>
                </View> : (null)
        )
    }
}

class ApplyService extends PullViewComponent {
    constructor(props) {
        super(props)
        this.state = {
            dataSource: [],
            totalPrice: 0,
            imageLists: {
                image0: require('../../../imgs/Photo.png'),
                image1: require('../../../imgs/Photo.png'),
            },
        }

        this.imageView = ''
        this.purchaseOrderLinesArray = []
        this.Amount=0;

        this.ErrorText = true;
        this.MoneyText="";

        this.leaveMessage = ''
        this.ErrorMessage=true;

    }

    //设置页面标题
    setTitle() {
        return "申请售后"
    }

    _ToPayMaks = null;

    //商品行
    renderProduct() {
        let dataSource = this.state.dataSource;
        this.purchaseOrderLinesArray = [];
        return (
            <View style={Styles.product}>
                {
                    dataSource.map((line, index) => {
                        this.purchaseOrderLinesArray.push(line.PurchaseOrderLineId)

                        let productName = line.ProductName;
                        let image = line.Image;
                        let spec = line.Spec;
                        let unit = line.Unit;
                        let actualQuantity = line.ActualQuantity;
                        let price = line.Price;
                        return (
                            <View style={Styles.listStyle} key={index}>
                                <BCHostImage style={{width: px2dp(41), height: px2dpH(41)}}
                                             source={{uri: image}}/>
                                <View style={Styles.titleStyle}>
                                    <BCText style={[gs.fts_16, gs.c_3a3838]}>{substr(productName, 10)}</BCText>
                                    <View style={Styles.priceStyle}>
                                        <BCText style={[gs.c_3a3838, gs.fts_13, {width: px2dp(100)}]}>{spec}</BCText>
                                        <BCText
                                            style={[gs.c_3a3838, gs.fts_13, {width: px2dp(100)}]}>￥{price}/{unit}</BCText>
                                        <BCText
                                            style={[gs.c_3a3838, gs.fts_13]}>X {actualQuantity}</BCText>
                                    </View>
                                </View>
                            </View>
                        )
                    })
                }
            </View>
        )
    }

    content() {
        const {data} = this.params;
        let imageLists = this.state.imageLists;
        return (
            <View style={[Styles.mainStyle, gs.bgc_f2f1ef]}>
                <View style={[gs.bgc_fff]}>
                    <BCText style={[gs.c_888, gs.fts_14, {padding: px2dp(10)}]}>售后商品</BCText>
                    {this.renderProduct()}
                    <BCTouchable onPress={() => {
                        this.ToPay()
                    }} style={Styles.btnStyle}>
                        <BCText style={[gs.fts_14, gs.c_00C164]}>重选商品</BCText>
                    </BCTouchable>
                </View>
                <View style={[gs.bgc_fff, {marginTop: px2dp(10),marginBottom:px2dp(70)}]}>
                    {/*退款金额*/}
                    <View style={[Styles.moneyStyle]}>
                        <BCText style={[gs.fts_14, gs.c_3a3838, {marginLeft: px2dp(19),marginRight:px2dp(10)}]}>退款金额</BCText>
                        <TextInput style={[{
                            width: px2dp(160),
                            height: px2dpH(28),
                            backgroundColor: "#f5f5f5",
                            fontSize: px2dp(14),
                            margin: 0,
                            padding: 0,
                            marginTop: Platform.OS === 'ios' ? px2dpH(8) : px2dp(0),
                            textAlign: 'center'

                        },Styles.textInputStyle, gs.fts_14]}
                                   placeholder={'最多'+this.state.totalPrice}
                                   keyboardType='numeric'
                                   placeholderTextColor='#b7b7b7'
                                   underlineColorAndroid='transparent'
                                   onEndEditing ={(obj) => {
                                       this.checkMoneyText(obj.nativeEvent.text)
                                   }}
                                   onChangeText={(text) => {
                                       this.MoneyText=text;
                                   }}

                        />
                    </View>
                    <KeyboardAvoidingView behavior="padding">
                        <View style={{marginTop: px2dpH(10)}}>



                            <TextInput placeholder='描述一下退款原因'
                                       placeholderTextColor='#b7b7b7'
                                       multiline={true}
                                       style={{
                                           fontSize: px2dp(14),
                                           lineHeight:px2dp(21),
                                           paddingLeft: px2dp(19),
                                           width: deviceWidth,
                                           height: this.state.height,
                                       }}

                                       underlineColorAndroid='transparent'

                                       maxLength={100}

                                       onChange={
                                           this.onChange.bind(this)
                                       }
                                       onChangeText={(text) => {
                                           this.checkLeaveMessage(text);
                                           this.leaveMessage = text;

                                       }}/>
                            <View style={Styles.phoneStyle}>
                                {
                                    Object.keys(imageLists).map((item, index) => {
                                        return (
                                            <BCTouchable style={{marginLeft: px2dp(19)}}
                                                         key={index}
                                                         onPress={() => {
                                                             this.imageView = index;
                                                             this._Maks.Trigger(true);
                                                             this._ToPayMaks2.Trigger(true);
                                                         }}>
                                                <BCImage source={imageLists[item]}
                                                         style={{width: px2dp(80), height: px2dpH(80)}}/>
                                            </BCTouchable>
                                        )
                                    })
                                }
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </View>
        )
    }


    onChange(event) {
        //console.log(event.nativeEvent);
        var height = 0;
        if (event.nativeEvent.contentSize.height > 43) {//此处是判断 是否大于我设置的input默认高度，如果大于则使用input的内容高度
            height = event.nativeEvent.contentSize.height;//内容高度
        } else {
            height = this.state.height;
        }
        this.setState({
            commentVal:event.nativeEvent.text,
            height:height
        })
    }

    //此处是判断是否大于100字，大于则不能提交（大于不提交被maxLength覆盖）
    checkLeaveMessage(text){
            if( text.length==100){
                toastShort('留言不能大于100个字');
                this.ErrorMessage = true;
                return false;
            }else{
                this.ErrorMessage=false;
            }
    }



    Bottom() {

        return (
            <View style={Styles.footerWrap}>
                <BCTouchable onPress={() => {
                    //this.push('ServiceDetail')

                    if(this.ErrorMessage){
                        this.checkLeaveMessage(this.MoneyText);
                    }

                    if(this.ErrorText){
                        this.checkMoneyText(this.MoneyText);
                    }


                    if(!this.ErrorText&&!this.ErrorMessage){
                        confirm('您将申请售后', this.onConfirm.bind(this), this.onCancle)}



                }} style={[Styles.confirmBtn, {backgroundColor: '#fd0319'}]}>
                    <BCText style={[gs.fts_15, gs.c_fff]}>提交</BCText>
                </BCTouchable>
            </View>
        )
    }

    checkMoneyText(text)
    {

        if (isNaN(text * 1)) {
            toastShort('请输入正确数字');
            this.ErrorText = true;
            return false;
        } else {
            this.Amount = text * 1;
            this.ErrorText = false;
        }
        this.Amount = text * 1;
        if(this.Amount<=0 ){
            toastShort('不能为0');
            this.ErrorText = true;
            return false;
        }
        if( this.Amount>this.state.totalPrice){
            // toastShort('不能为超过最大'+this.state.totalPrice);
            toastShort('不能超过商品总价'+this.state.totalPrice);
            this.ErrorText = true;
            return false;
        }

    }

    onConfirm() {

        const {data} = this.params;
        let obj = {};
        obj.PurchaseOrderNo = data.purchaseOrderNo;
        obj.PurchaseOrderId = data.purchaseOrderId;
        obj.SalesOrderId = data.salesOrderId;
        obj.SCompanyId = data.sCompanyId;
        obj.Amount = this.Amount;
        obj.LeftWord = this.leaveMessage;
        obj.PurchaseOrderLines = this.purchaseOrderLinesArray;
        Object.keys(this.state.imageLists).map((item, index) => {
            obj['Image' + index] = this.state.imageLists[item].uri;
        });

        fetchApplyService({ServiceStr: JSON.stringify(obj)}).then((ret) => {
            if (ret.data.success == 0) {
                toastShort('申请成功');
                //跳转到售后详情
                let serviceOrderId = ret.data.data.ServiceOrderId;
                this.push('ServiceDetail', {serviceOrderId})
            }
            else {
                let message=ret.data.message;
                if(message.indexOf("Incorrect string value")>-1){
                    toastShort("不能输入表情图");
                    return false;
                }
                toastShort(ret.data.message)
            }
        }).catch((e) => {

        });
    }

    onCancle() {

    }

    ToPay() {
        this._Maks.Trigger(true);
        this._ToPayMaks.Trigger(true);
    }

    maksContent() {
        const {data} = this.params;
        return (
            <View>
                <ToPayMaks ref={(ref) => this._ToPayMaks = ref}
                           data={data.purchaseOrderLines}
                           Cancle={(checkedArray) => {
                               //如果重选了商品,重新组合dataSource
                               if (checkedArray.length > 0) {
                                   let dataSource = [];
                                   checkedArray.map((check, index) => {
                                       dataSource.push(this.params.data.purchaseOrderLines[check])
                                   })

                                   this.setState({
                                       dataSource: dataSource
                                   }, () => {
                                       this.calculatePrice(dataSource);
                                       this._ToPayMaks.checkedArray = []
                                   })
                               }

                               //关闭遮罩
                               this._Maks.Trigger(false);
                               this._ToPayMaks.Trigger(false);
                           }}
                />

                <ToPayMaks2 ref={(ref) => this._ToPayMaks2 = ref}
                            Cancle={() => {
                                this._ToPayMaks2.Trigger(false);
                                this._Maks.Trigger(false);
                            }}
                            OnTakePhoto={() => {
                                this.pickSingleWithCamera(true);
                                this._ToPayMaks2.Trigger(false);
                                this._Maks.Trigger(false);
                                //this.push('CameraView')
                            }}
                            OnSelectPhoto={() => {
                                this.pickSingle(false);
                                this._ToPayMaks2.Trigger(false);
                                this._Maks.Trigger(false);
                            }}
                />
            </View>
        )
    }

    //拍照
    pickSingleWithCamera(cropping) {
        ImagePicker.openCamera({
            cropping: cropping,
            width: 500,
            height: 500,
        }).then(image => {
            let imageLists = this.state.imageLists;

            uploadImage('/ReactCommon/UploadIcon?type=1', [{path: image.path}])
                .then(ret => {
                    if (ret.data) {
                        imageLists['image' + this.imageView] = {uri: setting.HOST + ret.data[0]};
                    }

                    this.setState({
                        imageLists: imageLists
                    }, () => {
                        this.imageView = '';
                    });

                }).catch(err => {
                //请求失败
            })

        }).catch(e => {
            //toastShort(e)
        });
    }

    //选图片
    pickSingle(cropit, circular = false) {
        ImagePicker.openPicker({
            width: 39,
            height: 39,
            cropping: cropit,
            cropperCircleOverlay: circular,
            compressImageMaxWidth: 640,
            compressImageMaxHeight: 480,
            compressImageQuality: 0.5,
            compressVideoPreset: 'MediumQuality',
        }).then(image => {
            let imageLists = this.state.imageLists;
            imageLists['image' + this.imageView] = {uri: image.path};

            uploadImage('/ReactCommon/UploadIcon?type=1', [{path: image.path}])
                .then(ret => {
                    if (ret.data) {
                        if (ret.data) {
                            imageLists['image' + this.imageView] = {uri: HOST + ret.data[0]};
                        }

                        this.setState({
                            imageLists: imageLists
                        }, () => {
                            this.imageView = '';
                        });

                    }
                }).catch(err => {
                //请求失败
            })

        }).catch(e => {
            //toastShort(e.message ? e.message : e);
        });
    }

    //计算价格
    calculatePrice(Items) {
        let totalPrice = 0;
        Items.forEach((item, index) => {
            if (item.DisplayUnitTypeId == 2) {
                totalPrice += item.Price * item.RealQuantity
            }
            else {
                totalPrice += item.Price * item.RealQuantity
            }
        })
        this.setState({
            totalPrice: toDecimal2(totalPrice)
        })
    }

    WillMount() {
        const {data} = this.params;
        this.setState({
            dataSource: data.purchaseOrderLines,
            totalPrice: data.ActualAmount,
            IsReceived: true,
        });
    }
}

const Styles = StyleSheet.create({
    mainStyle: {
        flex: 1,
        minHeight: deviceHeight
    },
    product: {
        paddingBottom: px2dp(15),
        borderBottomWidth: 1,
        borderBottomColor: '#e3e3e3'
    },
    listStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        height: px2dpH(41),
        paddingLeft: px2dp(34),
        marginTop: px2dpH(15)
    },
    listBoxStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        //height: px2dpH(41),
        marginTop: px2dpH(15)
    },
    titleStyle: {
        marginLeft: px2dp(14)
    },
    priceStyle: {
        flexDirection: 'row',
    },
    btnStyle: {
        width: deviceWidth,
        height: px2dpH(43),
        justifyContent: 'center',
        alignItems: 'center'
    },
    moneyStyle: {
        width: deviceWidth,
        height: px2dpH(43),
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#e3e3e3',
        alignItems: 'center'
    },
    phoneStyle: {
        flexDirection: 'row',
        paddingTop: px2dpH(30),
        paddingBottom: px2dp(10),
        borderBottomWidth: 1,
        borderBottomColor: '#e3e3e3'
    },
    footerWrap: {
        width: deviceWidth,
        height: px2dpH(61),
        position: 'absolute',
        bottom: 0,
        left: 0,
        borderTopWidth: 1,
        borderTopColor: '#e3e3e3',
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center'
    },
    confirmBtn: {
        width: px2dp(355),
        height: px2dpH(45),
        borderRadius: px2dp(4),
        justifyContent: 'center',
        alignItems: 'center'
    },
    checkBoxStyle: {
        width: deviceWidth,
        height: px2dpH(43),
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center'
    },

    selectType: {
        position: 'absolute',
        left: 0,
        bottom: px2dp(17),
        width: deviceWidth,
        height: px2dpH(183),
        zIndex: 2,
        paddingLeft: px2dp(10),
        paddingRight: px2dp(10)
    },
    menuItem: {
        height: px2dpH(57),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
    }
});

function mapStateToProps(store) {
    return {}
}

const connectApplyService = connect(mapStateToProps)(ApplyService);
connectApplyService.navigationOptions = NavigationOptions;
export default connectApplyService;