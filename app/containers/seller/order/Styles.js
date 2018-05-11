/**
 * Created by Administrator on 2017/4/10.
 */
import {StyleSheet,Platform} from 'react-native';

import BaseComponent, {deviceWidth, px2dp,deviceHeight} from '../../../BaseComponent';

export default StyleSheet.create({
    content: {
        flex: 1,
        paddingBottom: px2dp(40),
        minHeight: deviceHeight + 1,
    },

    dl: {
        flexDirection: "row",
        alignItems: 'center',
        //width:px2dp(deviceWidth),
        //height: px2dp(73),
        backgroundColor: "red",
        paddingTop: px2dp(15),
        paddingBottom: px2dp(5),
        //paddingLeft: px2dp(18),
        borderBottomWidth: 1,
        borderColor: '#eee'
    },

    companyImg: {
        width: px2dp(50),
        height: px2dp(50),
    },

    spec: {
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'center',
    },

    company: {
        width:deviceWidth- px2dp(46),
        flexDirection: "row",
        //marginLeft: px2dp(14),
        //borderTopWidth: 1,
        //borderTopColor: '#e3e3e3',
        //justifyContent: 'center',
    },
    company3: {
        width:deviceWidth- px2dp(18),
        flexDirection: "row",
        paddingLeft:px2dp(18)
        //marginLeft: px2dp(14),
        //borderTopWidth: 1,
        //borderTopColor: '#e3e3e3',
        //justifyContent: 'center',
    },

    //底部
    /* footer: {
     width: deviceWidth,
     height: px2dp(45),
     flexDirection: 'row',
     backgroundColor: '#000',
     opacity: 0.9,
     alignItems:'center'
     },*/
    border: {
        borderWidth: px2dp(1),
        borderRadius: 4,
        width: px2dp(70),
        height: px2dp(25),
        alignItems: "center",
        justifyContent: 'center'
    },
    revice:{
        width:px2dp(95),
        height: px2dp(45),
        alignItems:'center',
        justifyContent:"center"
    },
    allSelect:{
        width:deviceWidth-px2dp(95),
        height:px2dp(45),
        flexDirection:"row",
        alignItems:'center',
        borderTopWidth: px2dp(0.5),
        borderTopColor: '#e3e3e3',
    },
    allSelect3:{
        width:deviceWidth-px2dp(95*2),
        height:px2dp(45),
        flexDirection:"row",
        alignItems:'center',
        borderTopWidth: px2dp(0.5),
        borderTopColor: '#e3e3e3',
    },
    pay: {
        width: px2dp(94),
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    money: {
        height: '100%',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        paddingRight: px2dp(9),
    },
    cart: {
        flex: 1,
        paddingLeft: px2dp(18),
        justifyContent: 'center',
        zIndex: 10,
        overflow: 'visible'
    },
    cartImg: {
        position: 'absolute',
        bottom: px2dp(17),
        left: px2dp(18),
        zIndex: 12,
    },
    maks: {
        position: 'absolute',
        left: 0,
        bottom: 0,
        width: deviceWidth,
        height: deviceHeight,
        opacity: 0.3,
    },
    footer: {
        width: '100%',
        height: px2dp(46),
        position: 'absolute',
        bottom: 0,
        left: 0,
        flexDirection: 'row',
        backgroundColor: '#fff',
        alignItems: 'center'
    },
    delete: {
        width: px2dp(94),
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        right: 0
    },

})