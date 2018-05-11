/**
 * Created by sencha on 2017/3/27.
 */
import React, {Component} from 'react';
import {
    View,
    TouchableHighlight,
    Text,
    Alert,
    TouchableOpacity,
    ScrollView,
    StyleSheet
} from 'react-native';
import BaseComponent, {PullListComponent} from './PageComponent';
import SecondScene from './SecondScene';
import PullTest from './PullTest';
import PullViewTest from './PullViewTest'

export default class HomeScene extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            id: 'AXIBA001',
            flag: null
        }
    }

    setTitle() {
        return "首页"
    }

    isShowBack() {
        return false
    }

    content() {
        return (
            <ScrollView>
                <TouchableHighlight style={Styles.button} onPress={this.goToPullTest.bind(this)}>
                    <Text style={Styles.buttonText}>Go To PullListTest</Text>
                </TouchableHighlight>
                <TouchableHighlight style={Styles.button} onPress={this.goToPullVIewTest.bind(this)}>
                    <Text style={Styles.buttonText}>Go To PullVIewTest</Text>
                </TouchableHighlight>
                <TouchableHighlight style={Styles.button} onPress={this.onPress.bind(this)}>
                    <Text style={Styles.buttonText}>push
                        me!{this.state.flag && 'I \'m' + this.state.flag + ',i come from secon page'}</Text>
                </TouchableHighlight>
            </ScrollView>
        )
    }

    onPress() {
        var self = this;
        const {navigator} = this.props;
        if (navigator) {
            navigator.push({
                name: 'touch View',
                component: SecondScene,
                params: {
                    id: this.state.id,
                    getSomething: function (flag) {
                        self.setState({
                            flag: flag
                        })
                    }
                }
            })
        }
    }

    goToPullTest() {
        let self = this;
        const {navigator} = this.props;
        if (navigator) {
            navigator.push({
                name: 'touch View',
                component: PullTest
            })
        }
    }

    goToPullVIewTest() {
        let self = this;
        const {navigator} = this.props;
        if (navigator) {
            navigator.push({
                name: 'touch View',
                component: PullViewTest
            })
        }
    }
}

const Styles = StyleSheet.create({
    home: {
        flex: 1
        //paddingTop:74,
        //paddingLeft:10,
        //alignItems:'center',
        //backgroundColor:'#ff0000'
    },
    button: {
        borderWidth: 1,
        borderColor: '#00C164',
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#00C164',
        marginBottom: 10,
        marginTop: 10
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 14
    }
})
