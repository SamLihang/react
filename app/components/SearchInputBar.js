/**
 * Created by Administrator on 2017/4/6.
 */
import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Image,
    Platform,
    TouchableOpacity,
    TextInput,
    ScrollView
} from 'react-native';
import BaseComponent, {deviceWidth, px2dp, BCText, BCImage, BCTouchable, substr} from '../BaseComponent';
import gs from '../styles/MainStyles';

export default class SearchInputBar extends BaseComponent {

    static defaultProps = {
        isShowSearchBar: false//是否显示searchBar
    };
    static propTypes = {
        backCallBack: React.PropTypes.func,
        goSearch: React.PropTypes.func
    }

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={[Styles.navigator, gs.bgc_f9f9f9, gs.bdc_bdbdbd]}>
                <View style={Styles.searchBox}>
                    <BCImage style={Styles.searchIcon} source={require('../imgs/search.png')}/>
                    <TextInput
                        placeholder="输入菜品名称"
                        autoFocus={true}
                        placeholderTextColor="#b7b7b7"
                        underlineColorAndroid='transparent'
                        style={[Styles.searchBar, gs.fts_14,]}
                        onChangeText={(text) => {
                            this.props.onChangeText(text)
                        }}
                        onEndEditing={() => {
                            //this.props.onEndEditing(text)
                        }}
                    />
                </View>
                <BCTouchable activeOpacity={0.3} style={Styles.rightButton} onPress={() =>
                    this.props.onCanale()
                }>
                    <BCText style={[gs.c_BaseColor, gs.fts_15]}>取消</BCText>
                </BCTouchable>
            </View>
        )
    }
}

const Styles = StyleSheet.create({
    navigator: {
        height: Platform.OS === 'ios' ? px2dp(65) : px2dp(45),
        //justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: Platform.OS === 'ios' ? px2dp(28) : px2dp(8),
        borderBottomWidth: 1,
        paddingLeft: px2dp(16),
        paddingRight: px2dp(16)
    },
    rightButton: {
        width: '13%',
        alignItems: 'center'
    },
    searchBox: {
        width: '87%',
        height: px2dp(28),
        alignItems: 'center',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        borderRadius: px2dp(14),
        backgroundColor: '#ececec',

    },
    searchBar: {
        color: '#3a3838',
        marginLeft: px2dp(6),
        padding: 0,
        width: '80%',
    },
    searchIcon: {
        width: px2dp(16),
        height: px2dp(17),
        marginLeft: px2dp(8)
    },
})