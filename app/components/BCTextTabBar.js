import React, {Component} from 'react';

import {
    StyleSheet,
    View,
    TouchableOpacity,
    Image
} from 'react-native';
import BaseComponent,{px2dp,BCText,deviceWidth} from '../BaseComponent';
import gs from '../styles/MainStyles';


export default class BCTextTabBar extends BaseComponent {
    static propTypes = {
        goToPage: React.PropTypes.func, // 跳转到对应tab的方法
        activeTab: React.PropTypes.number, // 当前被选中的tab下标
        tabs: React.PropTypes.array, // 所有tabs集合
        tabNames: React.PropTypes.array, // 保存Tab名称
        lineColor: React.PropTypes.array, // [tabColor,tabColorSelected]
        tabColor: React.PropTypes.array, // [tabColor,tabColorSelected]
    };

    setAnimationValue({value}) {
       // console.log(value);
    }

    componentDidMount() {
        // Animated.Value监听范围 [0, tab数量-1]
        this.props.scrollValue.addListener(this.setAnimationValue);
    }

    renderTabOption(tab, i) {
        let color = this.props.activeTab == i ? this.props.tabColor[0] : this.props.tabColor[1]; // 判断i是否是当前选中的tab，设置不同的颜色
        let line = this.props.activeTab == i ? this.props.lineColor[0] : this.props.lineColor[1];
        return (
            <TouchableOpacity key={i} onPress={() => this.props.goToPage(i)} style={styles.tab} activeOpacity={1}>
                <View style={[styles.textStyle]}>
                <BCText style={[{color: color},gs.fts_15,]}>
                    {this.props.tabNames[i]}
                </BCText>
                </View>
                <View style={[styles.tabUnderlineStyle,{backgroundColor:line}]}>
                </View>
               {/* <View style={[styles.tabItem,{borderBottomWidth:2,borderBottomColor:line}]}>
                    <BCText style={[{color: color},gs.fts_15,styles.textStyle]}>
                        {this.props.tabNames[i]}
                    </BCText>
                </View>*/}
            </TouchableOpacity>
        );
    }

    render() {
        return (
            <View style={styles.tabs}>
                {this.props.tabs.map((tab, i) => this.renderTabOption(tab, i))}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    tabs: {
        flexDirection: 'row',
        height: px2dp(45),
        borderBottomWidth:1,
        borderBottomColor:'#e3e3e3'
    },
    tab: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        height: px2dp(42),
    },
    tabItem: {
        flexDirection: 'column',
        alignItems: 'center',
        //backgroundColor:"red",
        height: px2dp(42),
    },
    tabUnderlineStyle:{
        position: 'absolute',
        height: px2dp(2),
        //backgroundColor: '#00C164',
        bottom: px2dp(0),
        width:px2dp(50)
    },
    textStyle:{
        height: px2dp(40),
        backgroundColor:"#fff",
       //paddingTop:px2dp(4),
       justifyContent:"center"
    }
});
