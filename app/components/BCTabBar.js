import React, {Component} from 'react';

import {
    StyleSheet,
    View,
    TouchableOpacity,
    Image
} from 'react-native';
import BaseComponent,{px2dp,px2dpH,BCText} from '../BaseComponent';
import gs from '../styles/MainStyles';

export default class BCTabBar extends BaseComponent {
    static propTypes = {
        goToPage: React.PropTypes.func, // 跳转到对应tab的方法
        activeTab: React.PropTypes.number, // 当前被选中的tab下标
        tabs: React.PropTypes.array, // 所有tabs集合
        tabNames: React.PropTypes.array, // 保存Tab名称
        tabIcon: React.PropTypes.array, // 保存Tab图标
        tabIconSelected: React.PropTypes.array, // 保存选中状态Tab图标
        tabColor: React.PropTypes.array, // [tabColor,tabColorSelected]
    };

    setAnimationValue({value}) {
        //console.log(value);
    }

    componentDidMount() {
        // Animated.Value监听范围 [0, tab数量-1]
        this.props.scrollValue.addListener(this.setAnimationValue);
    }

    renderTabOption(tab, i) {
        let color = this.props.activeTab == i ? this.props.tabColor[0] : this.props.tabColor[1]; // 判断i是否是当前选中的tab，设置不同的颜色
        let uri = this.props.activeTab == i ? this.props.tabIconSelected[i] : this.props.tabIcon[i];
        return (
            <TouchableOpacity key={i} onPress={() => this.props.goToPage(i)} style={styles.tab} activeOpacity={1}>
                <View style={styles.tabItem}>
                    <Image source={uri}/>
                    <BCText style={[{color: color},gs.fts_10,{marginTop:px2dp(4)}]}>
                        {this.props.tabNames[i]}
                    </BCText>
                </View>
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
        height: px2dpH(48),
        borderTopWidth:1,
        borderTopColor:'#e3e3e3',
        shadowColor:'#cdcdcd',
        shadowOffset:{width:px2dp(0),height:px2dp(-7)},
        shadowOpacity:.5,
        shadowRadius: px2dp(7),
        elevation: px2dp(20)
    },
    tab: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff'
    },
    tabItem: {
        flexDirection: 'column',
        alignItems: 'center',
    },
});
