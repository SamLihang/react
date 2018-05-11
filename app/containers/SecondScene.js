/**
 * Created by sencha on 2017/3/27.
 */
import React from 'react'
import {
    StyleSheet,
    View,
    Alert,
    TouchableHighlight,
    Text
} from 'react-native'
import BaseComponent from './PageComponent';


export default class SecondScene extends BaseComponent {
    setTitle() {
        return "这是第二个页面"
    }
    content() {
        return (
            <TouchableHighlight onPress={this.onPress.bind(this)}>
                <Text>push sucess!I get {this.props.id},i want back!</Text>
            </TouchableHighlight>
        )
    }

    onPress() {
        const {navigator}=this.props;
        if (this.props.getSomething) {
            var flag = 'Axiba002';
            this.props.getSomething(flag)
        }
        if (navigator) {
            navigator.pop();
        }
    }
}

var Styles = StyleSheet.create({
    home: {
        //paddingTop:74
    }
})
