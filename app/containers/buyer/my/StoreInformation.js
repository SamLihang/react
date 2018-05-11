/**
 * Created by Administrator on 2017/4/24.
 */
import React, {Component} from 'react';

import {
    StyleSheet, View, TextInput, ListView, Platform, ScrollView, Alert,
    Image, TouchableOpacity,
} from 'react-native';

import {
    BCImage,
    BCTouchable,
    BCText,
    px2dp,
    deviceWidth,
    substr,
    NavigationOptions,
    deviceHeight,
    BCHostImage
} from '../../../BaseComponent';
import {PullViewComponent} from '../../PageComponent';
import gs from '../../../styles/MainStyles';
import {uploadImage} from "../../../utils/RequestUtil";
import {toastLong, toastShort} from '../../../utils/ToastUtil';
import {ActionEmployee} from '../../../actions/EmployeeAction'
import {ActionStoreInformation} from '../../../actions/StoreInformationAction';
import {fetchLoadUploadLogo} from '../../../services/UploadImagesServices'
import {connect} from 'react-redux';
import ImagePicker from 'react-native-image-crop-picker';

//遮罩层
class ToPayMaks extends Component {
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
                    <View style={{height: px2dp(0.5), width: px2dp(355), backgroundColor: '#e3e3e3'}}></View>
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
        dispatch(ActionStoreInformation());
    }


    renderInformation() {
        let {ReduceStoreInformation} = this.props;
        if (ReduceStoreInformation.datas) {

            let datas = ReduceStoreInformation.datas;
            let CompanyFullName = datas.CompanyName;
            //let image=this.state.image;
            let images = this.state.images;
            let CompanyDescription = datas.CompanyDescription;
            let ContactName = datas.ContactName;
            return (
                <View style={[Styles.area, gs.bgc_fff,]}>
                    <View
                        style={[Styles.avatar, {borderBottomWidth: px2dp(1), borderBottomColor: '#f2f1ef'}]}>
                        <BCText style={[gs.fts_14, gs.c_3a3838]}>店铺头像</BCText>
                        <BCTouchable onPress={() => this.ToPay()} style={{marginRight: px2dp(25)}}>
                            <View style={[Styles.avatar]}>
                                {
                                    images ?
                                        <BCHostImage style={[Styles.avatarSize]} source={{uri: images}}/> :
                                        <BCImage
                                            source={require('../../../imgs/LOGO.png')} style={[Styles.avatarSize]}/>
                                }
                                <BCImage source={require("../../../imgs/right1.png")}
                                         style={[Styles.more]}
                                />
                            </View>
                        </BCTouchable>
                    </View>
                    <View
                        // onPress={() => this.push('StoreName', {callback: this.refeshView.bind(this), CompanyFullName})}
                        style={[Styles.storeName, {
                            borderBottomWidth: px2dp(1),
                            borderBottomColor: '#f2f1ef'
                        }]}>
                        <BCText style={[gs.fts_14, gs.c_3a3838]}>店铺名称</BCText>
                        <View style={{marginRight: px2dp(25)}}>
                            <View style={[Styles.storeName]}>
                                <BCText style={[gs.fts_14, gs.c_888]}>{CompanyFullName}
                                </BCText>
                                {/*<BCImage source={require("../../../imgs/right1.png")}*/}
                                         {/*style={[Styles.more]}*/}
                                {/*></BCImage>*/}
                            </View>
                        </View>
                    </View>
                    <BCTouchable onPress={() => this.push('StoreIntroduction', {callback: this.refeshView.bind(this)})}
                                 style={[Styles.storeName, {
                                     borderBottomWidth: px2dp(1),
                                     borderBottomColor: '#f2f1ef'
                                 }]}>
                        <BCText style={[gs.fts_14, gs.c_3a3838]}>店铺简介</BCText>
                        <View style={{marginRight: px2dp(25)}}>
                            <View style={[Styles.storeName]}>
                                <BCText style={[gs.fts_14, gs.c_888,{flexWrap:'nowrap'}]}>{substr((CompanyDescription),16)}
                                </BCText>
                                <BCImage source={require("../../../imgs/right1.png")}
                                         style={[Styles.more]}
                                ></BCImage>
                            </View>
                        </View>
                    </BCTouchable>
                    <BCTouchable onPress={() => {
                        this.push('UpdateContact', {callback: this.refeshView.bind(this)})
                    }} style={[Styles.storeName]}>
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
                </View>

            )
        }

    }

    renderContact() {
        let {ReduceStoreInformation} = this.props;
        if (ReduceStoreInformation.datas) {
            let datas = ReduceStoreInformation.datas;
            let Phone = datas.Phone;
            let Address = datas.Address;
            return (
                <View style={[Styles.area2, gs.bgc_fff]}>
                    <BCTouchable onPress={() => {
                        this.push('UpdatePhone', {callback: this.refeshView.bind(this)})
                    }} style={[Styles.storeName, {borderBottomWidth: px2dp(1), borderBottomColor: '#f2f1ef'}]}>
                        <BCText style={[gs.fts_14, gs.c_3a3838]}>联系电话</BCText>
                        <View style={{marginRight: px2dp(25)}}>
                            <View style={[Styles.storeName]}>
                                <BCText style={[gs.fts_14, gs.c_888]}>{Phone}</BCText>
                                <BCImage source={require("../../../imgs/right1.png")}
                                         style={[Styles.more]}
                                />
                            </View>
                        </View>
                    </BCTouchable>
                    {/*<View style={[Styles.storeName, {borderBottomWidth: px2dp(1), borderBottomColor: '#f2f1ef'}]}>*/}
                        {/*<BCText style={[gs.fts_14, gs.c_3a3838]}>门店地址</BCText>*/}
                        {/*<BCTouchable style={{marginRight: px2dp(0)}}>*/}
                            {/*<View style={[Styles.storeName,{width:'90%',flexDirection:'row',justifyContent:'flex-start',flexWrap:'wrap',backgroundColor:'#636279'}]}>*/}
                                {/*<BCImage source={require("../../../imgs/position.png")} style={[Styles.positionIcon, {marginRight: px2dp(12)}]}></BCImage>*/}
                                {/*<BCText style={[gs.fts_14, gs.c_888, {flexWrap:'wrap'}]}>{Address}*/}
                                {/*</BCText>*/}
                                {/*<BCImage source={require("../../../imgs/right1.png")}*/}
                                         {/*style={[Styles.more]}*/}
                                {/*></BCImage>*/}
                            {/*</View>*/}
                        {/*</BCTouchable>*/}
                    {/*</View>*/}
                    {/*<BCText style={[gs.fts_14, gs.c_888, {*/}
                        {/*marginTop: px2dp(14.5),*/}
                        {/*marginLeft: px2dp(107.5)*/}
                    {/*}]}>{Address}</BCText>*/}

                    <View style={{width:deviceWidth-px2dp(25),marginLeft:px2dp(25),flexDirection:'row',alignItems:'center',justifyContent:'space-between',borderBottomWidth: 1, borderBottomColor: '#f2f1ef'}}>
                        <BCText style={[gs.fts_14, gs.c_3a3838]}>门店地址</BCText>
                        <View style={{width:'75%',height:'100%',flexDirection:'row',alignItems:'center',justifyContent:'flex-end',marginRight:px2dp(25)}}>
                            {/*<BCImage source={require("../../../imgs/position.png")} style={[Styles.positionIcon, {marginRight: px2dp(12)}]}></BCImage>*/}
                            <BCText style={[gs.fts_14, gs.c_888, {flexWrap:'wrap',lineHeight:Platform.OS=='ios'?px2dp(36):px2dp(31),marginBottom:Platform.OS=='ios'?px2dp(9):px2dp(14)}]}>{Address}</BCText>
                            {/*<BCImage source={require("../../../imgs/right1.png")} style={[Styles.more]}></BCImage>*/}
                        </View>
                    </View>
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
                                dispatch(ActionStoreInformation());
                                dispatch(ActionEmployee(currentEmployee));
                                toastShort("头像修改成功");
                            }
                            else {
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
                                dispatch(ActionStoreInformation());
                                dispatch(ActionEmployee(currentEmployee));
                                toastShort("头像修改成功");
                            }
                            else {
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
            Alert.alert(e.message ? e.message : e);
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
        dispatch(ActionStoreInformation());
    }

    WillReceive(nextProps) {
        if (nextProps.ReduceStoreInformation.datas != null && nextProps.ReduceStoreInformation.datas !== this.props.ReduceStoreInformation.datas) {
            const data = nextProps.ReduceStoreInformation.datas;
            this.setState({
                IsReceived: true,
                images: data.LogoImage,
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
        height: px2dp(195.5),
        marginTop: px2dp(10)
    },
    area2: {
        width: deviceWidth,
        // height: px2dp(130),
        marginTop: px2dp(10)
    },
    //头像
    avatar: {
        height: px2dp(65),
        marginLeft: px2dp(25),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    avatarSize: {
        width: px2dp(39),
        height: px2dp(39),
        borderRadius: Platform.OS == 'ios' ? px2dp(20) : px2dp(50),
    },
    //列表
    storeName: {
        width:deviceWidth-px2dp(25),
        height: px2dp(43),
        marginLeft: px2dp(25),
        flexDirection: 'row',
        justifyContent: 'space-between',
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
        ReduceStoreInformation: store.ReduceStoreInformation,
        currentEmployee: store.ReduceEmployee.currentEmployee,
    }
}

const connectStoreInformation = connect(mapStateToProps)(StoreInformation);
connectStoreInformation.navigationOptions = NavigationOptions;
export default connectStoreInformation;