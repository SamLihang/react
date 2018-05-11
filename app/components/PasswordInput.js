/**
 * Created by Administrator on 2017/4/24.
 */
import React, {
    Component,
    PropTypes,
} from 'react';
import {
    StyleSheet,
    View,
    TextInput,
    TouchableHighlight,
    InteractionManager,
} from 'react-native';
import BaseComponent,{px2dp,BCText,deviceWidth} from '../BaseComponent';
import gs from '../styles/MainStyles';

export default class PasswordInput extends Component {
    static propTypes = {
        style: View.propTypes.style,
        inputItemStyle: View.propTypes.style,
        iconStyle: View.propTypes.style,
        maxLength: TextInput.propTypes.maxLength.isRequired,
        onChange: PropTypes.func,
        onEnd: PropTypes.func,
        autoFocus: PropTypes.bool,
    };

    static defaultProps = {
        autoFocus: true,
        onChange: () => {},
        onEnd: () => {},
    };

    state = {
        text: ''
    };

    componentDidMount() {
        if (this.props.autoFocus) {
            InteractionManager.runAfterInteractions(() => {
                this._onPress();
            });
        }
    }

    render(){
        return(
            <TouchableHighlight
                onPress={this._onPress.bind(this)}
                activeOpacity={1}
                underlayColor='transparent'>
                <View style={[styles.container,this.props.style]} >
                    <TextInput
                        style={{height:45,zIndex:99,position:'absolute',width:45*6,opacity:0}}
                        ref='textInput'
                        maxLength={this.props.maxLength}
                        autoFocus={true}
                        keyboardType='numeric'
                        onChangeText={
                            (text) => {
                                this.setState({text});
                                this.props.onChange(text);
                                if (text.length === this.props.maxLength) {
                                    this.props.onEnd(text);
                                    this.setState({text:''})
                                    this.refs.textInput.clear();
                                }
                            }
                        }
                    />
                    {
                        this._getInputItem()
                    }
                </View>
            </TouchableHighlight>
        )

    }
    _getInputItem(){
        let inputItem = [];
        let {text}=this.state;
        for (let i = 0; i < parseInt(this.props.maxLength); i++) {
            if (i == 0) {
                inputItem.push(
                    <View key={i} style={[styles.inputItem,this.props.inputItemStyle]}>
                        {i < text.length ? <View style={[styles.iconStyle,this.props.iconStyle]} /> : null}
                    </View>)
            }
            else {
                inputItem.push(
                    <View key={i} style={[styles.inputItem,styles.inputItemBorderLeftWidth,this.props.inputItemStyle]}>
                        {i < text.length ?
                            <View style={[styles.iconStyle,this.props.iconStyle]}>
                            </View> : null}
                    </View>)
            }
        }
        return inputItem;
    }

    _onPress(){
        this.refs.textInput.focus();
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#fff'
    },
    inputItem: {
        height: px2dp(47),
        width: px2dp(57),
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputItemBorderLeftWidth: {
        borderLeftWidth: 1,
        borderColor: '#ccc',
    },
    iconStyle: {
        width: px2dp(16),
        height: px2dp(16),
        backgroundColor: '#222',
        borderRadius: 8,
    },
});