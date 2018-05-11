//支付/验货密码TextInput
import React,{Component} from 'react';
import {Text,StyleSheet,TextInput,View} from 'react-native';
import {BCTouchable,BCImage,px2dp,deviceWidth} from '../BaseComponent'
import CheckPassword from "../components/CheckPassword";
import gs from "../styles/MainStyles";

export default class CheckTextInput2Ios extends  Component{
    constructor(props) {
        super(props);
        this.state = {
            IsSelect: props.IsSelect,
            maxLength: props.maxLength,
        };
    }

    static propTypes = {
        OnChange:React.PropTypes.func,
        _product: React.PropTypes.object,
        // password:React.PropTypes.string,
        payPassword:React.PropTypes.string,
        value:React.PropTypes.string,
        _textChange:React.PropTypes.func,
        title:React.PropTypes.string,
    };
    static defaultProps={
        IsSelect:false,
        maxLength:20,
        _product: {}
    }
    componentWillReceiveProps(nextProps){
        this.setState({
            IsSelect:nextProps.IsSelect,
            maxLength:20
        })
    }
    OnChange(isSelect){
        this.setState({IsSelect:!isSelect})
    }

    textChange(text){
        this.props._textChange(text.nativeEvent.text)
    }


    render(){
        return(
                <View style={[styles.itemStyle,gs.bdc_e3e3e3, {borderBottomWidth: px2dp(1)}]}>

                        <TextInput style={styles.inputStyle}
                                    placeholder={this.props.title}
                                    placeholderTextColor='#b7b7b7'
                                    secureTextEntry={this.state.IsSelect}
                                    maxLength={this.props.maxLength}
                                    underlineColorAndroid='transparent'
                                    value={this.props.payPassword}
                                    onEndEditing ={(text) => {
                                            this.textChange(text);
                                        }
                                    }
                                    onFocus={
                                        this.props.onFocus
                                    }
                                    onBlur={
                                        this.props.onBlur
                                    }
                        />
                    <CheckPassword
                        IsSelect={!this.state.IsSelect}
                        OnChange={(IsSelect) => {
                            this.OnChange(this.state.IsSelect)
                        }}/>
                         {/*<KeyboardSpacer topSpacing={px2dp(25)}/>*/}
                </View>
        )
    }
}
const  styles=StyleSheet.create({
    inputStyle: {
        marginLeft: px2dp(20),
        height: px2dp(54),
        width: deviceWidth - px2dp(150)
    },
    itemStyle: {
        height: px2dp(54),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
})