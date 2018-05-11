/**
 * Created by Administrator on 2017/6/20.
 */
import React, {Component} from 'react';
import {StyleSheet, View, TextInput, ListView} from 'react-native';
import {
    BCImage,
    BCTouchable,
    BCText,
    px2dp,
    deviceWidth,
    substr,
    deviceHeight,
    NavigationOptions
} from '../BaseComponent';
import PageComponent from './PageComponent';
import gs from '../styles/MainStyles';
import {connect} from "react-redux";

class PleaseLogin extends PageComponent {

    static propTypes = {};
    static defaultProps = {
        title: '报菜郎'
    };

    constructor(props) {
        super(props);
        this.state = {
            title: props.Title
        }
    }

    //设置页面标题
    setTitle() {
        return this.state.title
    }

    isShowBack() {
        return false
    }

    content() {
        return (
            <View style={[Styles.main, gs.bgc_fff, {justifyContent: 'center', alignItems: 'center'}]}>
                <BCTouchable onPress={() => {
                    this.push('AlwaysBuy', {needLogin: true})
                }}>
                    <BCText style={[gs.fts_16, Styles.textStyle]}>请登录</BCText>
                </BCTouchable>
            </View>
        )
    }

    WillMount() {
        this.setState({
            IsReceived: true,
        })
        this.push('Login')
    }
}

const Styles = StyleSheet.create({
    main: {
        flex: 1
    },
    logoStyle: {
        marginTop: px2dp(116),
        alignItems: 'center',
        justifyContent: 'center'
    },
    textStyle: {
        marginTop: px2dp(16.5)
    }
});

function mapStateToProps(store) {
    return {
        currentEmployee: store.ReduceEmployee,
    }
}
const connectLogin = connect(mapStateToProps)(PleaseLogin);
connectLogin.navigationOptions = NavigationOptions;
export default connectLogin;