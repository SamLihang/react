import React, {Component} from 'react';
import {StyleSheet, View,} from 'react-native';
import {BCImage,BCHostImage, BCTouchable, BCText, px2dp, deviceWidth,NavigationOptions,deviceHeight} from '../../../BaseComponent';
import PageComponent from '../../PageComponent';
import {toastShort} from '../../../utils/ToastUtil';
import gs from '../../../styles/MainStyles'
import {connect} from "react-redux";
import {ActionCompanyImages} from "../../../actions/MyAction"
import ImagePicker from 'react-native-image-crop-picker';
import {uploadImage} from "../../../utils/RequestUtil";

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

    //点击拍照的方法
    takePhoto() {
        this.props.OnTakePhoto()
    }

    //选择图片
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
                        <BCText style={[gs.fts_17, gs.c_BaseColor, gs.fts_18]}>拍照片</BCText>
                    </BCTouchable>
                    <View style={{height: px2dp(0.5), width: px2dp(355), backgroundColor: '#e3e3e3'}}></View>
                    <BCTouchable style={[Styles.menuItem, gs.bgc_fff, {
                        borderTopLeftRadius: px2dp(0),
                        borderTopRightRadius: px2dp(0)
                    }]}
                                 onPress={() => {
                                     this.SelectPhoto()
                                 }}
                    >
                        <BCText style={[gs.fts_17, gs.c_BaseColor, gs.fts_18]}>我的相册</BCText>
                    </BCTouchable>
                    <BCTouchable style={[Styles.menuItem, gs.bgc_fff, {marginTop: px2dp(10)}]}
                                 onPress={() => this.props.Cancle()}>
                        <BCText style={[gs.fts_17, gs.c_3a3838, gs.fts_18]}>取消</BCText>
                    </BCTouchable>
                </View> : null
        )
    }
}


class UpdateBusinessLicense extends PageComponent {
    //设置页面标题
    setTitle() {
        return "上传营业执照"
    }

    constructor(props){
        super(props);
        this.state={
            BusinessLicense:'',
            images: null,
        }
    }

    onConfirm(){
        let image = this.state.images;
        if(image){
            let callBack = this.navigation.state.params.callback;
            callBack();
            this.pop()
        }else {
            toastShort("请上传您的营业执照");
        }
    }

    content() {

        let images = this.state.images;
            return (
                <View style={[Styles.main, gs.bgc_f2f1ef]}>
                    <View style={[Styles.header, gs.bgc_fff]}>
                        {
                            images?
                            <BCHostImage style={[Styles.license]} source={{uri: images}}/>:
                            <View style={[Styles.initImg]}>
                                <BCImage source={require("../../../imgs/license.png")} />
                                <BCText style={{fontSize: px2dp(14),color:"#666",marginTop:px2dp(9.5)}}>请上传营业执照</BCText>
                            </View>
                        }
                    </View>
                    <View style={[Styles.middle, gs.bgc_fff]}>
                        <BCTouchable style={[Styles.addPictureIcon]} onPress={() => this.ToPay()}>
                            <BCImage style={{width:px2dp(50),height:px2dp(40)}} source={require("../../../imgs/camera.png")}/>
                            <BCText style={{fontSize: px2dp(10), color: "#999",marginTop:px2dp(5)}}>添加照片</BCText>
                        </BCTouchable>
                    </View>
                    <View style={[Styles.footer, gs.bgc_fff]}>
                        <BCTouchable style={[Styles.btnStyle, gs.bgc_31ca96]} onPress={() => {
                            this.onConfirm()
                        }}>
                            <BCText style={[gs.fts_16, gs.c_fff]}>确认</BCText>
                        </BCTouchable>
                    </View>
                </View>
            )
    }


    _ToPayMaks = null;


    //弹窗
    maksContent() {
        return (
            <View>
                <ToPayMaks ref={(ref) => this._ToPayMaks = ref}
                           Cancle={() => {
                               this._ToPayMaks.Trigger(false);
                               this._Maks.Trigger(false);
                           }}
                           OnTakePhoto={() => {
                               this.pickSingleWithCamera(true);
                               this._ToPayMaks.Trigger(false);
                               this._Maks.Trigger(false);
                               //this.push('CameraView')
                           }}
                           OnSelectPhoto={() => {
                               this.pickSingle(false);
                               this._ToPayMaks.Trigger(false);
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
            width: 218,
            height: 218,
        }).then(image => {
            this.setState({
                images: image.path,
            });
            let list1 = [];
            list1.push({
                path: this.state.images,
            });
            uploadImage('/BclCompany/UploadCertificate', list1)
                .then(ret => {
                    if (ret.data) {
                            this.setState({
                                images: ret.data[0],
                            });
                            toastShort("图片上传成功")
                    }
                    else if (ret.error) {
                        toastShort(ret.error.message)
                    }
                }).catch(err => {
                toastShort(err);
            })
        }).catch(e => {

        });
    }

    //选图片
    pickSingle(cropit, circular = false) {
        ImagePicker.openPicker({
            width: 218,
            height: 218,
            cropping: cropit,
            cropperCircleOverlay: circular,
            compressImageMaxWidth: 640,
            compressImageMaxHeight: 480,
            compressImageQuality: 0.5,
            compressVideoPreset: 'MediumQuality',
        }).then(image => {
            this.setState({
                images: image.path,
            });
            let list1 = [];
            list1.push({
                path: this.state.images,
            });
            uploadImage('/BclCompany/UploadCertificate', list1)
                .then(ret => {
                    if (ret.data) {
                        this.setState({
                            images: ret.data[0],
                        });
                        toastShort("图片上传成功")
                    }
                    else if (ret.error) {
                        toastShort(ret.error.message)
                    }
                }).catch(err => {
                toastShort(err)
                //请求失败
            })
        }).catch(e => {
            //console.log(e);
        });
    }

    ToPay() {
        this._Maks.Trigger(true);
        this._ToPayMaks.Trigger(true);
    }


    WillMount() {
        const {dispatch} = this.props;
        const {ReduceSellInfo} = this.props;
        const datas = ReduceSellInfo.datas;
        dispatch(ActionCompanyImages({companyId:datas.CompanyId}));
    }
    WillReceive(nextProps) {
        if (nextProps.ReduceCompanyImages.datas != null && nextProps.ReduceCompanyImages.datas != this.props.ReduceCompanyImages.datas) {
            const {ReduceCompanyImages} = nextProps;
            const datas = ReduceCompanyImages.datas;
            this.setState({
                IsReceived: true,
                images: datas[0].Value,
            });
        }
    }
}


const Styles = StyleSheet.create({
    main: {
        flex: 1,
        height:deviceHeight
    },

    header: {
        height: px2dp(237),
        justifyContent: 'center',
        alignItems: 'center',
    },
    middle: {
        height: px2dp(150),
        marginTop: px2dp(10),
        borderWidth: px2dp(1),
        borderColor: '#dcdcdc',
        justifyContent: 'center',
        alignItems: 'flex-start'
    },
    addPictureIcon: {
        width: px2dp(81.5),
        height: px2dp(81.5),
        borderWidth: px2dp(1),
        borderColor: '#dcdcdc',
        borderStyle: 'dashed',
        marginLeft: px2dp(11),
        justifyContent: 'center',
        alignItems: 'center'
    },
    license: {
        // width: px2dp(152),
        // height: px2dp(218),
        justifyContent: 'center',
        alignItems: 'center'
    },
    initImg: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    footer: {
        height: px2dp(206.5),
        alignItems: 'center'
    },
    btnStyle: {
        width: px2dp(316),
        height: px2dp(39),
        borderRadius: px2dp(2.5),
        marginTop: px2dp(20),
        justifyContent: 'center',
        alignItems: 'center'
    },
    selectType: {
        position: 'absolute',
        left: 0,
        bottom: px2dp(17),
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
        borderRadius: 7.5,
    }
})

function mapStateToProps(store) {
    return {
        ReduceSellInfo: store.ReduceSellInfo,
        ReduceCompanyImages: store.ReduceCompanyImages
    }
}
const connectUpdateBusinessLicense = connect(mapStateToProps)(UpdateBusinessLicense);
connectUpdateBusinessLicense.navigationOptions = NavigationOptions;
export default connectUpdateBusinessLicense;
