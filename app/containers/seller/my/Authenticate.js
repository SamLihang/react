/**
 * Created by Administrator on 2017/4/24. 企业认证
 */
import React, {Component} from "react";
import {connect} from "react-redux";
import {
    StyleSheet, View, TextInput, ListView, Platform, ScrollView, Alert,
    Image, TouchableOpacity,
} from "react-native";
import {
    BCImage,
    BCText,
    BCTouchable,
    deviceHeight,
    deviceWidth,
    NavigationOptions,
    px2dp,
    BCHostImage,
} from "../../../BaseComponent";
import {PullViewComponent} from "../../PageComponent";
import gs from "../../../styles/MainStyles";
import ImagePicker from 'react-native-image-crop-picker';
import {uploadImage} from "../../../utils/RequestUtil";
import {toastLong, toastShort} from '../../../utils/ToastUtil';
import {fetchUploadImages} from '../../../services/UploadImagesServices'
import {ActionLoadUploadImages, ActionUploadImages} from '../../../actions/UploadImageAction'


//遮罩层
class ToPayMaks extends Component {
    constructor(props) {
        super(props)
        this.state = {
            IsShow: false,
            index: 0,
        }
    }

    static propTypes = {
        Cancle: React.PropTypes.func,
        OnTakePhoto: React.PropTypes.func,
        OnSelectPhoto: React.PropTypes.func,
        index: React.PropTypes.number,
    };

    Trigger(v, index) {
        this.setState({
            IsShow: v,
            index: index,
        })
    }

    takePhoto(index) {
        this.props.OnTakePhoto(index)
    }

    SelectPhoto(index) {
        this.props.OnSelectPhoto(index)
    }

    render() {
        return (
            this.state.IsShow ?
                <View style={[Styles.selectType]}>
                    <BCTouchable onPress={() => {
                        this.takePhoto(this.state.index)
                    }} style={[Styles.menuItem, gs.bgc_fff, gs.bdc_e3e3e3, {
                        borderBottomLeftRadius: px2dp(0),
                        borderBottomRightRadius: px2dp(0)
                    }]}>
                        <BCText style={[gs.fts_17, gs.c_BaseColor, gs.fts_18]}>拍照</BCText>
                    </BCTouchable>
                    <View style={{height: px2dp(0.5), width: px2dp(355), backgroundColor: '#e3e3e3'}}></View>
                    <BCTouchable onPress={() => {
                        this.SelectPhoto(this.state.index)
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

//每一个图片
class ImageRow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //cameraType: Camera.constants.Type.back,
            image: null,
            images: null,
            exampleImages: [
                require('../../../imgs/exampleImage1@2x.png'),
                require('../../../imgs/exampleImage2@2x.png'),
                require('../../../imgs/exampleImage3@2x.png')
            ]

        };
    }

    _ToPayMaks = null;

    static propTypes = {
        AuditState:React.PropTypes.number,
        title: React.PropTypes.string,
        text1: React.PropTypes.string,
        text2: React.PropTypes.string,
        image: React.PropTypes.object,
        index: React.PropTypes.number,
        name: React.PropTypes.string,
    };

    uploadPhoto(index) {
        this.props.uploadPhoto(index)
    };

    renderImage(image) {
        return (
        <BCTouchable onPress={()=>{this.props.showPic(image)}}>
            <BCHostImage style={{
                width: (Platform.OS === "ios") ? px2dp(140) : px2dp(192), height: px2dp(87)
            }} source={image}/>
        </BCTouchable>
        )
    }

    renderAsset(image) {
        if (image.mime && image.mime.toLowerCase().indexOf('video/') !== -1) {
            //return this.renderVideo(image);
        }
        return this.renderImage(image);
    }

    //渲染
    render() {
        return (
            <View style={[Styles.business, gs.bgc_fff]}>
                <View style={Styles.titleStyle}>
                    <BCText style={[gs.fts_14, gs.c_3a3838,{width:'100%'}]}>{this.props.title}</BCText>
                </View>
                <View style={Styles.rowStyle}>
                    <View style={Styles.certificate}>
                        {this.props.image.uri ?
                            this.renderAsset(this.props.image)
                            :
                            <View>
                                <BCImage source={require('../../../imgs/example.png')} style={Styles.example}/>
                                <BCImage source={this.state.exampleImages[this.props.index]}
                                         style={{width: px2dp(109), height: px2dp(75)}}/>
                            </View>
                        }
                    </View>
                    <View style={Styles.upload}>
                        <BCText style={[gs.fts_12, {color: '#b7b7b7'}]}>1.{this.props.text1}；</BCText>
                        <BCText
                            style={[gs.fts_12, {color: '#b7b7b7', marginTop: px2dp(3)}]}>2.{this.props.text2}；</BCText>
                        <BCTouchable
                            disabled = {this.props.AuditState === 1 || this.props.AuditState === 4}
                            onPress={() => {
                            this.uploadPhoto(this.props.index);
                        }} style={[Styles.uploadBtn,this.props.AuditState === 1 || this.props.AuditState === 4?Styles.forbidUpLoad:null]}>
                            <BCText style={[gs.fts_15, gs.c_fff]}>{this.props.image.uri?'重新上传':'上传'}</BCText>
                        </BCTouchable>
                    </View>
                </View>
            </View>
        );
    }
}

class Authenticate extends PullViewComponent {
    constructor(props) {
        super(props);
        this.state = {
            //cameraType: Camera.constants.Type.back,
            image: null,
            images: null,
            image1: {uri: null},
            image2: {uri: null},
            image3: {uri: null},
            showPicture: null
        };
        this.list1 = [];
        this.list2 = [];
        this.list3 = [];
        this.AuditState = 0;
    }

    //设置页面标题 
    setTitle() {
        return "企业认证"
    }

    _ToPayMaks = null;
    ImageRow = [];

    showPic(image){
        this.setState({
            showPicture:image
        })
    }

    content() {
        this.ImageRow = [];
        return (
            <View style={[Styles.main, gs.bgc_f2f1ef]}>
                {
                    this.state.showPicture?
                            <View style={{width:deviceWidth,height:deviceHeight,position:'absolute',top:0,left:0,backgroundColor:'rgba(50,50,50,.8)',zIndex:9}}>
                                <BCTouchable style={{width:'100%',height:'100%',alignItems:'center',justifyContent:'center'}} onPress={()=>{this.setState({showPicture:false,})}}>
                                    <BCHostImage style={{width:'100%',height:px2dp(250)}} source={this.state.showPicture}/>
                                </BCTouchable>
                            </View>:<View/>
                }
                <View style={Styles.promptStyle}>
                    <BCText style={[gs.fts_13, gs.c_888]}>照片仅用于核实您的店铺是否真实存在，不会对外展示</BCText>
                </View>{this.AuditState == 1?
                <View style={{position:'absolute',top:px2dp(2),right:px2dp(0),zIndex:3}}>
                    <BCImage source={require('../../../imgs/attestationSuccess.png')} />
                </View>:null}
                {
                    [
                        {
                            name: "A",
                            title: "营业执照",
                            text1: "需文字清晰、边框完整、露出国徽、真实有效",
                            text2: "拍复印证件需加盖印章",
                            image: this.state.image1,
                        },

                        {
                            name: "B",
                            title: "食品许可证",
                            text1: "需文字清晰、边框完整、真实有效",
                            text2: "拍复印证件需加盖印章",
                            image: this.state.image2,
                        },

                        {
                            name: "C",
                            title: "法人手持身份证照",
                            text1: "需清晰展示五官和文字信息",
                            text2: "不可自拍，不可只拍身份证",
                            image: this.state.image3,
                        },
                    ].map((row, index) => {
                        return (
                            <ImageRow
                                key={index}
                                ref={(c) => {
                                    if (c !== null) {
                                        this.ImageRow.push(c);
                                    }
                                }}
                                title={row.title}
                                text1={row.text1}
                                text2={row.text2}
                                image={row.image}
                                AuditState={this.AuditState}
                                index={index}
                                name={row.name}
                                showPic={this.showPic.bind(this)}
                                uploadPhoto={(index) => {
                                    this._Maks.Trigger(true, index);
                                    this._ToPayMaks.Trigger(true, index);
                                    this.maksContent(index);
                                }}

                            />
                        )
                    })
                }
            </View>
        )
    }

    Bottom() {
        return (
            this.renderBottom()
        )
    }

    renderBottom() {
        return (
            (this.AuditState === 3 || this.AuditState === 5) ?
                <View style={Styles.footerWrap}>
                    <BCTouchable style={Styles.confirmBtn} onPress={() => {
                        this.uploadImages()
                    }}>
                        <BCText style={[gs.fts_15, gs.c_fff]}>立即认证</BCText>
                    </BCTouchable>
                </View> :
                <View style={Styles.footerWrap}>
                    <View style={[Styles.confirmBtn,this.AuditState === 1? Styles.forbidUpLoad:null]}>
                        <BCText style={[gs.fts_15, gs.c_fff]}>{this.AuditState === 1 ? "认证成功" : "等待审核～"}</BCText>
                    </View>
                </View>
        )
    }

    footText() {
        return (
            <View style={Styles.footerWrap}>
                <View style={Styles.confirmBtn}>
                    <BCText style={[gs.fts_15, gs.c_fff]}>{this.AuditState === 1 ? "审核中" : ""}</BCText>
                </View>
            </View>
        )
    }

    //立即认证
    uploadImages() {
        let list1 = this.list1;
        let list2 = this.list2;
        let list3 = this.list3;
        if (list1.length > 0 && list2.length > 0 && list3.length) {
            fetchUploadImages({
                list1, list2, list3
            }).then((ret) => {
                if (ret.data) {
                    let data = ret.data;
                    this.setState({
                        IsReceived: true,
                        image1: {uri: data.CertificateImageThumb},
                        image2: {uri: data.LegalPersonImageThumb},
                        image3: {uri: data.LicenseImageThumb||LicenseImage},
                    });
                    toastShort("上传认证成功 请耐心等待1至3个工作日");
                }
                else {
                }
                this._Loading.Trigger(false);
            }).catch((e) => {
                this._Loading.Trigger(false);
                this.props.AuditState = 4;
                //刷新页面
                // this.onRefresh();
            });
        } else {
            toastShort("请上传图片，再认证")
        }


    }

    //遮罩层
    maksContent(index) {
        return (
            <View>
                <ToPayMaks ref={(ref) => this._ToPayMaks = ref}
                           Cancle={() => {
                               this._ToPayMaks.Trigger(false);
                               this._Maks.Trigger(false);
                           }}
                           OnTakePhoto={(index) => {
                               this.pickSingleWithCamera(true, index);
                               this._ToPayMaks.Trigger(false, index);
                               this._Maks.Trigger(false);
                               //this.push('CameraView')
                           }}
                           OnSelectPhoto={(index) => {
                               this.props;
                               this.pickSingle(false, false, index);
                               this._ToPayMaks.Trigger(false, index);
                               this._Maks.Trigger(false);
                           }}
                           index={index}

                />
            </View>
        )
    }

    //拍照
    pickSingleWithCamera(cropping, index) {
        ImagePicker.openCamera({
            cropping: cropping,
            width: 400,
            height: 300
        }).then(image => {
            //console.log('received image', image);
            if (index === 0) {
                this.setState({
                    image1: {uri: image.path, width: image.width,},
                });
                let ImageArr = [];
                ImageArr.push({
                    name: "A",
                    path: this.state.image1.uri,
                    index: index,
                });
                uploadImage('/ReactCompany/UploadCertificate', ImageArr)
                    .then(ret => {
                        if (ret.data) {
                            this.list1 = ret.data;
                            this.setState({
                                image1: {uri: ret.data[0], width: image.width,},
                            });
                        }
                        else if (ret.error) {
                            toastShort(ret.error.message)
                            //this.onRefresh()
                        }
                    }).catch(err => {
                    //请求失败
                })
            }
            if (index === 1) {
                this.setState({
                    image2: {uri: image.path, width: image.width,},
                });
                let ImageArr = [];
                ImageArr.push({
                    name: "A",
                    path: this.state.image2.uri,
                    index: index,
                });
                uploadImage('/ReactCompany/UploadLicense', ImageArr)
                    .then(ret => {
                        if (ret.data) {
                            this.list2 = ret.data;
                            this.setState({
                                image2: {uri: ret.data[0], width: image.width,},
                            });
                        }
                        else if (ret.error) {
                            toastShort(ret.error.message)
                            //this.onRefresh()
                        }
                    }).catch(err => {
                    //请求失败
                })
            }
            if (index === 2) {
                this.setState({
                    image3: {uri: image.path, width: image.width,},
                });
                let ImageArr = [];
                ImageArr.push({
                    name: "A",
                    path: this.state.image3.uri,
                    index: index,
                });
                uploadImage('/ReactCompany/UploadLegalPerson', ImageArr)
                    .then(ret => {
                        if (ret.data) {
                            this.list3 = ret.data;
                            this.setState({
                                image3: {uri: ret.data[0], width: image.width,},
                            });
                        }
                        else if (ret.error) {
                            toastShort(ret.error.message)
                            //this.onRefresh()
                        }
                    }).catch(err => {
                    //请求失败
                })
            }
        }).catch(e => {
            //Alert.alert(e.message ? e.message : e);
        });
    }

    //选图片
    pickSingle(cropit, circular = false, index) {
        ImagePicker.openPicker({
            width: 192,
            height: 75,
            cropping: cropit,
            cropperCircleOverlay: circular,
            compressImageMaxWidth: 640,
            compressImageMaxHeight: 480,
            compressImageQuality: 0.5,
            compressVideoPreset: 'MediumQuality',
        }).then(image => {
            // console.log('received image', image);
            if (index === 0) {
                this.setState({
                    image1: {uri: image.path, width: image.width,},
                });
                let ImageArr = [];
                ImageArr.push({
                    name: "A",
                    path: this.state.image1.uri,
                    index: index,
                });
                uploadImage('/ReactCompany/UploadCertificate', ImageArr)
                    .then(ret => {
                        if (ret.data) {
                            this.list1 = ret.data;
                            this.setState({
                                image1: {uri: ret.data[0], width: image.width,},
                            });
                        }
                        else if (ret.error) {
                            toastShort(ret.error.message)
                            //this.onRefresh()
                        }
                    }).catch(err => {
                    //请求失败
                })

            }
            if (index === 1) {
                this.setState({
                    image2: {uri: image.path, width: image.width,},
                });
                let ImageArr = [];
                ImageArr.push({
                    name: "A",
                    path: this.state.image2.uri,
                    index: index,
                });
                uploadImage('/ReactCompany/UploadLicense', ImageArr)
                    .then(ret => {
                        if (ret.data) {
                            this.list2 = ret.data;
                            this.setState({
                                image2: {uri: ret.data[0], width: image.width,},
                            });
                        }
                        else if (ret.error) {
                            toastShort(ret.error.message)
                            //this.onRefresh()
                        }
                    }).catch(err => {
                    //请求失败
                })

            }
            if (index === 2) {
                this.setState({
                    image3: {uri: image.path, width: image.width,},
                });
                let ImageArr = [];
                ImageArr.push({
                    name: "A",
                    path: this.state.image3.uri,
                    index: index,
                });
                uploadImage('/ReactCompany/UploadLegalPerson', ImageArr)
                    .then(ret => {
                        if (ret.data) {
                            this.list3 = ret.data;
                            this.setState({
                                image3: {uri: ret.data[0], width: image.width,},
                            });
                        }
                        else if (ret.error) {
                            toastShort(ret.error.message)
                            //this.onRefresh()
                        }
                    }).catch(err => {
                    //请求失败
                })
            }
        }).catch(e => {
            //Alert.alert(e.message ? e.message : e);
        });
    }

    /* WillMount() {
         this.setState({
             IsReceived: true
         })

     }*/
    WillMount() {
        const {dispatch} = this.props;
        dispatch(ActionLoadUploadImages());
    }

    WillReceive(nextProps) {
        if (nextProps.ReduceLoadUploadImages.datas != null && nextProps.ReduceLoadUploadImages.datas != this.props.ReduceLoadUploadImages.datas) {
            const {ReduceLoadUploadImages} = nextProps;
            const LoadUploadData = ReduceLoadUploadImages.datas;

            this.AuditState = LoadUploadData.AuditState;
            if (this.AuditState === 3) {
                toastShort("审核未通过哦～")
            }
            if (this.AuditState === 1) {
                // toastShort("审核通过")
            }
            if (this.AuditState === 4) {
                toastShort("审核中，请耐心等待～")
            }
            this.state.image1 = LoadUploadData.CertificateImage;
            this.state.image2 = LoadUploadData.LicenseImage;
            this.state.image3 = LoadUploadData.LegalPersonImage;
            /* if (sellerSalesOrders7.length <= 0 || dataSource === undefined) {
                 this.noMoreData()
             } else {
                 if (this._page > 1 || dataSource.length <= 0) {
                     sellerSalesOrders7.map((sellerSalesOrder) => {
                         dataSource.push(sellerSalesOrder);
                     })
                 } else {
                     dataSource = sellerSalesOrders7;
                 }
             }*/
            this.list1.push(
                LoadUploadData.CertificateImage,
                LoadUploadData.CertificateImageThumb,
            );
            this.list2.push(
                LoadUploadData.LicenseImage,
                LoadUploadData.LicenseImageThumb,
            );
            this.list3.push(
                LoadUploadData.LegalPersonImage,
                LoadUploadData.LegalPersonImageThumb
            );
            this.setState({
                IsReceived: true,
                image1: {uri: LoadUploadData.CertificateImage},
                image2: {uri: LoadUploadData.LicenseImage},
                image3: {uri: LoadUploadData.LegalPersonImage},
                //dataSource: dataSource,
            });
        }
    }
}

const Styles = StyleSheet.create({
    main: {
        flex: 1,
        height: deviceHeight-px2dp(60),
    },
    promptStyle: {
        height: px2dp(38),
        justifyContent: 'center',
        alignItems: 'center',
        flexShrink: 1,
    },
    business: {
        height: px2dp(149),
    },
    titleStyle: {
        height: px2dp(44),
        justifyContent: 'center',
        marginLeft: px2dp(18)
    },
    rowStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    certificate: {
        width: px2dp(130),
        height: px2dp(87),
        borderWidth: 1,
        borderColor: '#d7d7d7',
        marginLeft: px2dp(18),
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative'
    },
    example: {
        position: 'absolute',
        top: px2dp(-5),
        left: px2dp(-12),
        zIndex: 2
    },
    upload: {
        height: px2dp(87),
        width: px2dp(192),
        marginLeft: px2dp(17),
        marginRight: px2dp(18),
    },
    uploadBtn: {
        width: px2dp(105),
        height: px2dp(31),
        backgroundColor: '#31ca96',
        borderRadius: px2dp(2.5),
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: px2dp(7)
    },
    forbidUpLoad:{
        backgroundColor: '#dcdcdc'
    },
    listItem: {
        height: px2dp(149),
        marginTop: px2dp(10)
    },
    footerWrap: {
        width: deviceWidth,
        height: px2dp(61),
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
        height: px2dp(45),
        borderRadius: px2dp(4),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#31ca96'
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
        ReduceLoadUploadImages: store.ReduceLoadUploadImages,
        ReduceUploadImages: store.ReduceUploadImages,
    }
}

const connectAuthenticate = connect(mapStateToProps)(Authenticate);
connectAuthenticate.navigationOptions = NavigationOptions;
export default connectAuthenticate;