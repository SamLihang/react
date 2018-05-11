/**
 * Created by Administrator on 2017/5/10.
 */
import React,{Component} from 'react';
import {Text,StyleSheet,TextInput} from 'react-native';
import {BCTouchable,BCImage,px2dp,deviceWidth} from '../BaseComponent'

export default class CheckTextInput extends  Component{
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
        password:React.PropTypes.string,
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
            maxLength:nextProps.maxLength
        })
    }
    OnChange(isSelect){
        this.setState({IsSelect:isSelect})
    }

    textChange(text){
        this.props._textChange(text.nativeEvent.text)
    }


    render(){
        return(
            this.state.IsSelect?
            <TextInput style={styles.inputStyle}
                       placeholder={this.props.title}
                       placeholderTextColor='#b7b7b7'
                       secureTextEntry={false}
                       maxLength={this.props.maxLength}
                       underlineColorAndroid='transparent'
                       value={this.props.password}
                       onEndEditing ={(text) => {
                           this.textChange(text);
                       }
                       }
                       onFocus={this.props.onFocus}
            />:
                <TextInput style={styles.inputStyle}
                           placeholder={this.props.title}
                           placeholderTextColor='#b7b7b7'
                           secureTextEntry={true}
                           maxLength={this.props.maxLength}
                           underlineColorAndroid='transparent'
                           value={this.props.password}
                           onEndEditing ={(text) => {
                               this.textChange(text);
                           }
                           }
                           onFocus={this.props.onFocus}
                />

        )
    }
}
const  styles=StyleSheet.create({
    inputStyle: {
        marginLeft: px2dp(20),
        height: px2dp(54),
        width: deviceWidth - px2dp(150)
    },
})