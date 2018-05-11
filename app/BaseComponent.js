/**
 * Created by sencha on 2017/3/29.
 */
import React, {PureComponent, Component, PropTypes} from 'react';
import {
    View,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    Dimensions,
    AsyncStorage,
    Platform
} from 'react-native';
import MyText from './components/MyText';
import gs from './styles/MainStyles';
import * as cf from './utils/CommonFuns';
import {setting,settingNew} from './utils/RequestUtil';
export * from './utils/CommonFuns';


const flattenStyle = StyleSheet.flatten;

export default class BaseComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scale: 1
        }
    }

    static navigationOptions = {
        header: null
    }
};

export const NavigationOptions = {
    header: null
}


export const BCText = ({style, children, ...props}) => {
    const fontSize = flattenStyle(style).fontSize || 14;
    const scaledFontSize = Math.round(fontSize * cf.deviceWidth / cf.BASEPX);
    return (
        //<MyText allowFontScaling={false} style={[style, {fontSize: scaledFontSize}]} {...props} TextContent={children}/>
        <Text allowFontScaling={false} style={[style, {fontSize: scaledFontSize}]} {...props}>{children}</Text>
    )
}

BCText.propTypes = {
    style: Text.propTypes.style,
    children: PropTypes.node
}
BCText.defaultProps = {
    style: {}
}

export const BCTouchable = ({style, children, ...props}) => {
    return (
        <TouchableOpacity style={[style]} {...props}>
            {children}
        </TouchableOpacity>
    )
}
BCTouchable.propTypes = {
    style: Text.propTypes.style,
    children: PropTypes.node.isRequired
}
BCTouchable.defaultProps = {
    style: {}
}


export const BCImage = ({style, children, ...props}) => {
    return (
        <Image style={[style]} {...props}/>
    )
}
BCImage.propTypes = {
    style: Text.propTypes.style
}
BCImage.defaultProps = {
    style: {}
}

export const BCHostImage = ({style, children, ...props}) => {
    let imageProps = {};
    const {source} = props;
    let url;
    if (source.uri) {
        url = {uri: setting.HOST + source.uri}
    }
    else {
        url = require('./imgs/Headportrait.png');
    }

    Object.assign(imageProps, props, {source: url})
    return (
        <Image style={[style]} {...imageProps}/>
    )
}
BCHostImage.propTypes = {
    style: Text.propTypes.style
}
BCHostImage.defaultProps = {
    style: {}
}
export const BCHostImageNew = ({style, children, ...props}) => {
    let imageProps = {};
    const {source} = props;
    let url;
    if (source.uri) {
        url = {uri: settingNew.HOST + source.uri}
    }
    else {
        url = require('./imgs/Headportrait.png');
    }

    Object.assign(imageProps, props, {source: url})
    return (
        <Image style={[style]} {...imageProps}/>
    )
}
BCHostImage.propTypes = {
    style: Text.propTypes.style
}
BCHostImage.defaultProps = {
    style: {}
}


/*

 export class BCText extends Text{
 constructor(props){
 props.allowFontScaling=false;
 super(props)
 }
 static propTypes={
 style:React.PropTypes.array
 }
 render(){
 //let propertys={allowFontScaling:false};
 //Object.assign(propertys,...this.props);
 return super.render();
 /!*return(
 <Text {...propertys} style={[...this.props.style]}>
 { this.props.children }
 </Text>
 )*!/
 }
 }*/
