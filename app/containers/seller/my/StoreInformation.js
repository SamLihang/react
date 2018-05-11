/**
 * Created by Administrator on 2017/4/24.
 */
import React, {Component} from "react";
import {StyleSheet, View, Alert, Platform} from "react-native";
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
import {connect} from "react-redux";
import {ActionSellInfo} from "../../../actions/MyAction";
import {uploadImage} from "../../../utils/RequestUtil";
import {toastLong, toastShort} from '../../../utils/ToastUtil';
import {fetchLoadUploadLogo} from '../../../services/UploadImagesServices'
import {ActionEmployee} from '../../../actions/EmployeeAction'
import ImagePicker from 'react-native-image-crop-picker';
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
                    <View style={{height: px2dp(0.5), width: px2dp(355), backgroundColor: '#e3e3e3'}}></View>
                    <BCTouchable style={[Styles.menuItem, gs.bgc_fff, {
                        borderTopLeftRadius: px2dp(0),
                        borderTopRightRadius: px2dp(0)
                    }]}
                                 onPress={() => {
                                     this.SelectPhoto()
                                 }}
                    >
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

class StoreInformation extends PullViewComponent {
    constructor(props) {
        super(props)
        this.state = {
            IsShow: false,
            image: null,
            images: null,
        }
    }

    //设置页面标题
    setTitle() {
        return "店铺信息"
    }

    refeshView(msg) {
        const {dispatch} = this.props;
        dispatch(ActionSellInfo());
    }


    renderInformation() {
        let {ReduceSellInfo} = this.props;
        if (ReduceSellInfo.datas) {

            let datas = ReduceSellInfo.datas;
            let CompanyName = datas.CompanyName;
            //let LogoImage = datas.LogoImage;
            let images = this.state.images;
            let image = this.state.image;
            let CompanyDescription = datas.CompanyDescription;
            return (
                <View style={[Styles.area, gs.bgc_fff,]}>
                    <View style={Styles.avatar}>
                        <BCTouchable onPress={()=> this.ToPay()}>
                            {
                                images ?
                                    image ?
                                        this.renderAsset(image)
                                        :
                                        <BCHostImage style={[Styles.avatarSize]} source={{uri: images}}/> :
                                    <BCImage
                                        source={require('../../../imgs/LOGO.png') } style={[Styles.avatarSize]}/>
                            }
                        </BCTouchable>
                    </View>
                    <View
                         // onPress={() => this.push('SellerStoreName', {callback: this.refeshView.bind(this)})}
                         style={[Styles.storeName, {
                             borderBottomWidth: 1,
                             borderBottomColor: '#f2f1ef'
                         }]}>
                        <BCText style={[gs.fts_14, gs.c_3a3838]}>店铺名称</BCText>
                        <View style={{marginRight: px2dp(25)}}>
                            <View style={[Styles.storeName]}>
                                <BCText style={[gs.fts_14, gs.c_888]}>{CompanyName}</BCText>
                                {/*<BCImage source={require("../../../imgs/right1.png")}*/}
                                         {/*style={[Styles.more]}*/}
                                {/*></BCImage>*/}
                            </View>
                        </View>
                    </View>
                    <BCTouchable
                        onPress={() => this.push('SellerStoreIntroduction', {callback: this.refeshView.bind(this)})}
                        style={[Styles.storeName, {
                            borderBottomWidth: 1,
                            borderBottomColor: '#f2f1ef'
                        }]}>
                        <BCText style={[gs.fts_14, gs.c_3a3838]}>店铺简介</BCText>
                        <View style={{marginRight: px2dp(25)}}>
                            <View style={[Styles.storeName]}>
                                <BCText style={[gs.fts_14, gs.c_888]}>{substr((CompanyDescription), 16)}</BCText>
                                <BCImage source={require("../../../imgs/right1.png")}
                                         style={[Styles.more]}
                                ></BCImage>
                            </View>
                        </View>
                    </BCTouchable>
                   {/* <BCTouchable onPress={() => this.push('DeliveryFee', {callback: this.refeshView.bind(this)})}
                                 style={[Styles.storeName]}>
                        <BCText style={[gs.fts_14, gs.c_3a3838]}>配送费设置</BCText>
                        <View style={{marginRight: px2dp(25)}}>
                            <View style={[Styles.storeName]}>
                                <BCImage source={require("../../../imgs/right1.png")}
                                         style={[Styles.more]}
                                />
                            </View>
                        </View>
                    </BCTouchable>*/}
                </View>

            )
        }

    }

    renderContact() {
        let {ReduceSellInfo} = this.props;
        if (ReduceSellInfo.datas) {
            let datas = ReduceSellInfo.datas;
            let Phone = datas.Phone;
            let Address = datas.Address;
            let ContactName = datas.ContactName;
            return (
                <View style={[Styles.area2, gs.bgc_fff]}>
                    <BCTouchable onPress={() => {
                        this.push('SellerUpdateContact', {callback: this.refeshView.bind(this)})
                    }} style={[Styles.storeName, {borderBottomWidth: 1, borderBottomColor: '#f2f1ef'}]}>
                        <BCText style={[gs.fts_14, gs.c_3a3838]}>联系人</BCText>
                        <View style={{marginRight: px2dp(25)}}>
                            <View style={[Styles.storeName]}>
                                <BCText style={[gs.fts_14, gs.c_888]}>{ContactName}</BCText>
                                <BCImage source={require("../../../imgs/right1.png")}
                                         style={[Styles.more]}
                                ></BCImage>
                            </View>
                        </View>
                    </BCTouchable>
                    <BCTouchable onPress={() => {
                        this.push('SellerUpdatePhone', {callback: this.refeshView.bind(this)})
                    }} style={[Styles.storeName, {borderBottomWidth: 1, borderBottomColor: '#f2f1ef'}]}>
                        <BCText style={[gs.fts_14, gs.c_3a3838]}>联系电话</BCText>
                        <View style={{marginRight: px2dp(25)}}>
                            <View style={[Styles.storeName]}>
                                <BCText style={[gs.fts_14, gs.c_888]}>{Phone}</BCText>
                                <BCImage source={require("../../../imgs/right1.png")}
                                         style={[Styles.more]}
                                ></BCImage>
                            </View>
                        </View>
                    </BCTouchable>
                    <View style={[Styles.storeName, {borderBottomWidth: 1, borderBottomColor: '#f2f1ef'}]}>
                        <BCText style={[gs.fts_14, gs.c_3a3838]}>门店地址</BCText>
                        <BCTouchable style={{marginRight: px2dp(25)}}>
                            <View style={[Styles.storeName]}>
                                <BCImage source={require("../../../imgs/position.png")}
                                         style={[Styles.positionIcon, {marginRight: px2dp(12)}]}
                                ></BCImage>
                                <BCText style={[gs.fts_14, gs.c_888, {marginRight: px2dp(0)}]}>{Address}
                                </BCText>
                                <BCImage source={require("../../../imgs/right1.png")}
                                         style={[Styles.more]}
                                ></BCImage>
                            </View>
                        </BCTouchable>
                    </View>
                    {/*<BCTouchable onPress={() => {*/}
                        {/*this.push('SellerUpdateBusinessLicense', {callback: this.refeshView.bind(this)})*/}
                    {/*}} style={[Styles.storeName, {borderBottomWidth: 1, borderBottomColor: '#f2f1ef'}]}>*/}
                        {/*<BCText style={[gs.fts_14, gs.c_3a3838]}>营业执照</BCText>*/}
                        {/*<View style={{marginRight: px2dp(25)}}>*/}
                            {/*<View style={[Styles.storeName]}>*/}
                                {/*<BCImage source={require("../../../imgs/right1.png")}*/}
                                         {/*style={[Styles.more]}*/}
                                {/*></BCImage>*/}
                            {/*</View>*/}
                        {/*</View>*/}
                    {/*</BCTouchable>*/}
                </View>
            )
        }
    }

    content() {
        return (
            <View style={[Styles.main, gs.bgc_f2f1ef,]}>
                {this.renderInformation()}
                {this.renderContact()}
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
            width: 500,
            height: 500,
        }).then(image => {
            this.setState({
                //image: {uri: image.path, width: image.width, height: image.height},
                images: {uri: image.path, width: image.width, height: image.height}
            });
            let list1 = [];
            list1.push({
                path: this.state.images.uri,
            });
            uploadImage('/ReactCompany/UploadIcon', list1)
                .then(ret => {
                    if (ret.data) {
                        list1 = ret.data;
                        //let image=this.renderAsset(ret.data[0]);
                        fetchLoadUploadLogo({
                            list1,
                        }).then((ret) => {
                            if (ret.data) {
                                let data = ret.data;
                                this.setState({
                                    images: data.LogoImage,
                                });
                                const {dispatch, currentEmployee} = this.props;
                                currentEmployee.LogoImage = data.LogoImage;
                                dispatch(ActionSellInfo());
                                dispatch(ActionEmployee(currentEmployee));
                                toastShort("头像修改成功");
                            }
                        }).catch((e) => {
                        });
                    }
                    else if (ret.error) {
                        toastShort(ret.error.message)

                    }
                }).catch(err => {
            })
        }).catch(e => alert(e));
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
            this.setState({
                images: {uri: image.path, width: image.width}
            });
            let list1 = [];
            list1.push({
                path: this.state.images.uri,
            });
            uploadImage('/ReactCompany/UploadIcon', list1)
                .then(ret => {
                    if (ret.data) {
                        list1 = ret.data;
                        this.setState({
                            //images: {uri: ret.data[0], width: image.width,},
                        });
                        fetchLoadUploadLogo({
                            list1,
                        }).then((ret) => {
                            if (ret.data) {
                                let data = ret.data;
                                this.setState({
                                    images: data.LogoImage,
                                });
                                const {dispatch, currentEmployee} = this.props;
                                currentEmployee.LogoImage = data.LogoImage;
                                dispatch(ActionSellInfo());
                                dispatch(ActionEmployee(currentEmployee));
                                toastShort("头像修改成功");
                            }
                        }).catch((e) => {
                        });
                    }
                    else if (ret.error) {
                        toastShort(ret.error.message)
                        //this.onRefresh()
                    }
                }).catch(err => {
                //请求失败
            })
        }).catch(e => {
            //console.log(e);
        });
    }


    renderVideo(video) {
        return (<View style={{height: 300, width: 300}}>
            <Video source={{uri: video.uri, type: video.mime}}
                   style={{
                       position: 'absolute',
                       top: 0,
                       left: 0,
                       bottom: 0,
                       right: 0
                   }}
                   rate={1}
                   paused={false}
                   volume={1}
                   muted={false}
                   resizeMode={'cover'}
                   onError={e => console.log(e)}
                   onLoad={load => console.log(load)}
                   repeat={true}/>
        </View>);
    }

    renderImage(image) {
        return <BCImage
            style={{width: px2dp(39), height: px2dp(39), borderRadius: Platform.OS == 'ios' ? px2dp(20) : px2dp(50),}}
            source={image}/>

    }

    renderAsset(image) {
        if (image.mime && image.mime.toLowerCase().indexOf('video/') !== -1) {
            return this.renderVideo(image);
        }

        return this.renderImage(image);
    }

    ToPay() {
        this._Maks.Trigger(true);
        this._ToPayMaks.Trigger(true);
    }


    WillMount() {
        const {dispatch} = this.props;
        dispatch(ActionSellInfo());
    }

    WillReceive(nextProps) {
        if (nextProps.ReduceSellInfo.datas != null && nextProps.ReduceSellInfo.datas != this.props.ReduceSellInfo.datas) {
            const {ReduceSellInfo} = nextProps;
            const datas = ReduceSellInfo.datas;
            this.setState({
                IsReceived: true,
                images: datas.LogoImage,
            });
        }
    }
}

const Styles = StyleSheet.create({
    main: {
        flex: 1,
        height: deviceHeight
    },
    area: {
        width: deviceWidth,
        height: px2dp(186),
        marginTop: px2dp(10)
    },
    area2: {
        width: deviceWidth,
        height: px2dp(129),
        marginTop: px2dp(10)
    },
    //头像
    avatar: {
        height: px2dp(100),
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#f2f1ef'
    },
    avatarSize: {
        width: px2dp(70),
        height: px2dp(70),
        borderRadius: Platform.OS == 'ios' ? px2dp(20) : px2dp(50),
    },
    //列表
    storeName: {
        height: px2dp(43),
        marginLeft: px2dp(25),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

    },
    storeAddress: {
        height: px2dp(43),
        marginLeft: px2dp(25),
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    positionIcon: {
        marginLeft: px2dp(10),
        width: px2dp(15),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    more: {
        marginLeft: px2dp(10),
        width: px2dp(11.5),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    logoStyle: {
        marginTop: px2dp(116),
        alignItems: 'center',
        justifyContent: 'center'
    },
    textStyle: {
        marginTop: px2dp(16.5)
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
        borderRadius: 15,
    }
})

function mapStateToProps(store) {
    return {
        ReduceSellInfo: store.ReduceSellInfo,
        currentEmployee: store.ReduceEmployee.currentEmployee,
    }
}
const connectStoreInformation = connect(mapStateToProps)(StoreInformation);
connectStoreInformation.navigationOptions = NavigationOptions;
export default connectStoreInformation;