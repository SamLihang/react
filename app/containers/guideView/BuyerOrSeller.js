import React from "react";
import {StyleSheet, View} from "react-native";
import {BCImage, BCText, BCTouchable, deviceHeight, deviceWidth, px2dp} from "../../BaseComponent";
import PageComponent from "../PageComponent";
import gs from "../../styles/MainStyles";

export default class BuyerOrSeller extends PageComponent {
    content() {
        return (
            <View style={Styles.main}>
                <BCImage source={require('../../imgs/SellerImage.png')} style={Styles.backgroundImage}/>
                <View style={Styles.type}>
                    <View style={Styles.btnType}>
                        <View style={Styles.btnLeft}>
                            <BCImage source={require('../../imgs/Business.png')}/>
                        </View>
                        <BCTouchable style={Styles.touchable}>
                            <View style={{alignItems: 'center'}}>
                                <BCText style={[gs.fts_15, gs.bold, {color: '#6D4330'}]}>我是买家</BCText>
                                <BCText style={[gs.fts_14, {color: '#6D4330'}]}>采购各类新鲜食材</BCText>
                            </View>
                            <BCImage style={{marginLeft: px2dp(33)}} source={require('../../imgs/rightarrow.png')}/>
                        </BCTouchable>
                    </View>
                    <View style={[Styles.btnType, {marginTop: px2dp(16)}]}>
                        <View style={Styles.btnLeft}>
                            <BCImage source={require('../../imgs/seller.png')}/>
                        </View>
                        <BCTouchable style={Styles.touchable}>
                            <View style={{alignItems: 'center'}}>
                                <BCText style={[gs.fts_15, gs.bold, {color: '#6D4330'}]}>我是卖家</BCText>
                                <BCText style={[gs.fts_14, {color: '#6D4330'}]}>采购各类新鲜食材</BCText>
                            </View>
                            <BCImage style={{marginLeft: px2dp(33)}} source={require('../../imgs/rightarrow.png')}/>
                        </BCTouchable>
                    </View>
                </View>
            </View>
            //<Guide/>
        )

    }

    renderNavigator() {
        return null;
    }

    WillMount() {
        this.setState({
            IsReceived: true
        })
    }
}

const Styles = StyleSheet.create({
    main: {
        height: deviceHeight,
    },
    backgroundImage: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: deviceHeight,
    },
    type: {
        position: 'absolute',
        top: (deviceHeight - px2dp(214)) / 2,
        left: (deviceWidth - px2dp(272)) / 2
    },
    btnType: {
        width: px2dp(272),
        height: px2dp(99),
        borderRadius: px2dp(4),
        backgroundColor: '#fff',
        opacity: 0.8,
        flexDirection: 'row',
    },
    btnLeft: {
        borderRightWidth: 0.5,
        width: px2dp(66),
        height: px2dp(99),
        borderRightColor: '#888',
        alignItems: 'center',
        justifyContent: 'center'
    },
    touchable: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: px2dp(33)
    }
});