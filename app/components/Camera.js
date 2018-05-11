/**
 * Created by Administrator on 2017/6/6.
 */
import React from "react";
import {View, Text, StyleSheet, ScrollView, Alert,
    Image, TouchableOpacity, NativeModules, Dimensions,AppRegistry} from "react-native";
import PageComponent from "../containers/PageComponent";
import gs from "../styles/MainStyles" ;
//import ImagePicker from 'react-native-image-crop-picker';

export default class CameraView extends PageComponent {

    //去除头部栏
    renderNavigator() {
        return null;
    }

//构造函数
    constructor(props) {
        super(props);
        this.state = {
            cameraType: Camera.constants.Type.back,
            image: null,
            images: null
        };
    }

    //渲染
    render() {
        return (
            <View style={styles.container}>
                <ScrollView>
                    {this.state.image ? this.renderAsset(this.state.image) : null}
                    {this.state.images ? this.state.images.map(i => <View key={i.uri}>{this.renderAsset(i)}</View>) : null}
                </ScrollView>
                <TouchableOpacity onPress={() => this.pickSingleWithCamera(false)} style={styles.button}>
                    <Text style={styles.text}>Select Single With Camera</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => this.pickSingleWithCamera(true)} style={styles.button}>
                    <Text style={styles.text}>Select Single With Camera With Cropping</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.pickSingle(false)} style={styles.button}>
                    <Text style={styles.text}>Select Single</Text>
                </TouchableOpacity>
                {/*<Camera
                    ref={(cam) => {
                        this.camera = cam;
                    }}
                    style={styles.preview}
                    type={this.state.cameraType}
                    aspect={Camera.constants.Aspect.fill}>
                    <Text style={styles.button} onPress={this.switchCamera.bind(this)}>[切换摄像头]</Text>
                    <Text style={styles.button} onPress={this.takePicture.bind(this)}>[拍照]</Text>
                </Camera>*/}
            </View>
        );
    }

   /* //切换前后摄像头
    switchCamera() {
        var state = this.state;
        if (state.cameraType === Camera.constants.Type.back) {
            state.cameraType = Camera.constants.Type.front;
        } else {
            state.cameraType = Camera.constants.Type.back;
        }
        this.setState(state);
    }

    //拍摄照片
    takePicture() {
        this.camera.capture()
            .then(function (data) {
                alert("拍照成功！图片保存地址：\n" + data.path)
            })
            .catch(err => console.error(err));
    }*/


    pickSingleWithCamera(cropping) {
        ImagePicker.openCamera({
            cropping: cropping,
            width: 500,
            height: 500,
        }).then(image => {
            //console.log('received image', image);
            this.setState({
                image: {uri: image.path, width: image.width, height: image.height},
                images: null
            });
        }).catch(e => alert(e));
    }

    pickSingleBase64(cropit) {
        ImagePicker.openPicker({
            width: 300,
            height: 300,
            cropping: cropit,
            includeBase64: true
        }).then(image => {
            //console.log('received base64 image');
            this.setState({
                image: {uri: `data:${image.mime};base64,`+ image.data, width: image.width, height: image.height},
                images: null
            });
        }).catch(e => alert(e));
    }

    cropLast() {
        if (!this.state.image) {
            return Alert.alert('No image', 'Before open cropping only, please select image');
        }

        ImagePicker.openCropper({
            path: this.state.image.uri,
            width: 200,
            height: 200
        }).then(image => {
            //console.log('received cropped image', image);
            this.setState({
                image: {uri: image.path, width: image.width, height: image.height, mime: image.mime},
                images: null
            });
        }).catch(e => {
            //console.log(e);
            Alert.alert(e.message ? e.message : e);
        });
    }

    pickSingle(cropit, circular=false) {
        ImagePicker.openPicker({
            width: 300,
            height: 300,
            cropping: cropit,
            cropperCircleOverlay: circular,
            compressImageMaxWidth: 640,
            compressImageMaxHeight: 480,
            compressImageQuality: 0.5,
            compressVideoPreset: 'MediumQuality',
        }).then(image => {
            //console.log('received image', image);
            this.setState({
                image: {uri: image.path, width: image.width, height: image.height, mime: image.mime},
                images: null
            });
        }).catch(e => {
            //console.log(e);
            Alert.alert(e.message ? e.message : e);
        });
    }

    pickMultiple() {
        ImagePicker.openPicker({
            multiple: true,
            waitAnimationEnd: false
        }).then(images => {
            this.setState({
                image: null,
                images: images.map(i => {
                    //console.log('received image', i);
                    return {uri: i.path, width: i.width, height: i.height, mime: i.mime};
                })
            });
        }).catch(e => alert(e));
    }
    renderVideo(video) {
        return (<View style={{height: 300, width: 300}}>
            <Video source={{uri: video.uri, type: video.mime}}
                   style={{position: 'absolute',
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
                   repeat={true} />
        </View>);
    }

    renderImage(image) {
        return <Image style={{width: 300, height: 300, resizeMode: 'contain'}} source={image} />
    }
    renderAsset(image) {
        if (image.mime && image.mime.toLowerCase().indexOf('video/') !== -1) {
            return this.renderVideo(image);
        }

        return this.renderImage(image);
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
    },
    preview: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        flexDirection: 'row',
    },
    toolBar: {
        width: 200,
        margin: 40,
        backgroundColor: '#000000',
        justifyContent: 'space-between',

    },
    button: {
        flex: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
        color: '#000',
        padding: 10,
        margin: 40,
    }
});
