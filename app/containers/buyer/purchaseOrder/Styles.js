/**
 * Created by Administrator on 2017/4/10.
 */
import {StyleSheet,Platform} from 'react-native';

import BaseComponent, {deviceWidth, px2dp,deviceHeight} from '../../../BaseComponent';

export default StyleSheet.create({
    type: {
        flexWrap: 'nowrap',
    },
    typeItem: {
        height: px2dp(28),
        borderBottomWidth: 2,
        alignItems: 'center',
        paddingTop: px2dp(2),
        marginRight: px2dp(24)
    },
    outView: {
        marginBottom:px2dp(10),
    },
    company: {
        flexDirection: "row",
        paddingTop: px2dp(8),
        paddingBottom: px2dp(8),
        paddingLeft: px2dp(12),
        paddingRight: px2dp(12),
        alignItems: 'center',
        borderBottomColor: '#e3e3e3',
        borderBottomWidth: 1
    },
    companyW: {
        flexDirection: "row",
        paddingTop: px2dp(8),
        paddingBottom: px2dp(8),
        paddingLeft: px2dp(6),
        paddingRight: px2dp(12),
        alignItems: 'center',
    },
    companyImg: {
        width: px2dp(29),
        height: px2dp(29),
    },
    finish:{
        flexDirection: "row",
        alignItems: 'center',
        borderBottomColor: '#e3e3e3',
        borderBottomWidth: 1,
    },

    //列表
    productImg: {
        width: px2dp(60),
        height: px2dp(60),
        marginRight: px2dp(8),
    },
    listItemRight: {
        justifyContent: "space-around",
        flex: 1,
        // borderStyle:'solid',
        // borderBottomWidth:px2dp(1),
        // borderBottomColor:'rgb(210,210,210)',
    },
    listItem: {
        paddingTop: px2dp(12),
        flexDirection: 'row',
        flexWrap: 'nowrap',
        backgroundColor: "#f7f7f7",
        paddingLeft: px2dp(12),
        paddingRight: px2dp(12),
        paddingBottom:px2dp(12),
    },
    listItemFinish: {
        paddingTop: px2dp(12),
        flexDirection: 'row',
        backgroundColor: "#f7f7f7",
        paddingLeft: px2dp(46),
        paddingRight: px2dp(12),
        paddingBottom:px2dp(12),
    },
    listItemRightTop: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: 'center',
    },
    listDetail: {
        flexDirection: "row",
    },
    handleProduct: {},
    actIcon: {
        width: px2dp(15),
        height: px2dp(15),
        marginLeft: px2dp(7),
        borderRadius: px2dp(2),
        alignItems: 'center',
        justifyContent: 'center'
    },
    number: {
        position: 'absolute', right: 0,
        marginLeft:px2dp(5),
    },

    companyDetailBg: {
        height: px2dp(13),
        width: px2dp(12),
    },
    //查看详情
    lookDetail: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingRight: px2dp(12),
        alignItems: "center",
        backgroundColor: '#f7f7f7',
        height: px2dp(40)
    },
    titleText: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingRight: px2dp(12),
        alignItems: "center",
        height: px2dp(36),
    },
    border: {
        borderWidth: px2dp(1),
        borderRadius: 4,
        width: px2dp(70),
        height: px2dp(25),
        alignItems: "center",
        justifyContent: 'center'
    },
    //选择
    select:{

    },
    //底部
    footer: {
       /* width: deviceWidth,
        height: px2dp(45),
        flexDirection: 'row',
        backgroundColor: '#000',
        opacity: 0.9,
        alignItems:'center',*/
        width: '100%',
        height: px2dp(45),
        position: 'absolute',
        bottom: 0,
        left: 0,
        flexDirection: 'row',
        backgroundColor: '#000',
        opacity: 0.9,
        alignItems: 'center'
    },
    print:{
        width:px2dp(95),
        height: px2dp(45),
        alignItems:'center',
        justifyContent:"center"
    },
    allSelect:{
        width:deviceWidth-px2dp(95),
        height:px2dp(45),
        flexDirection:"row",
        alignItems:'center'
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
    //弹出框
    selectType: {
        position: 'absolute',
        left: deviceWidth/2-px2dp(258/2),
        bottom: deviceHeight/2-px2dp(108/2),
        height: px2dp(108),
        zIndex: 2,
        width:px2dp(258),
        borderRadius: 15,
        //justifyContent:"center",
        alignItems:'center',
        backgroundColor:"#fff"
    },
    menuItem: {
        height: px2dp(20),
        width:px2dp(258/2-1),
        justifyContent: 'center',
        alignItems: 'center',
        marginTop:px2dp(10),
        backgroundColor:"red",
    },
    topView:{
       //borderBottomWidth:0.5,
       //borderBottomColor:"#dbdbdb",
       width:px2dp(258)-px2dp(30),
        marginTop:px2dp(12),
        height:px2dp(50),
        alignItems:'center',

    },
    topTitle:{
        color:"#000",
        marginTop:px2dp(10),
    },
    line:{
        width:px2dp(258),
        height:px2dp(1),
        borderBottomWidth: 1,
        borderBottomColor:"#dbdbdb",
    },
    hengXian:{
        width:px2dp(302),
        height:px2dp(1),
        paddingRight: px2dp(12),
        backgroundColor:'#dbdbdb',
        position:'absolute',
        left:px2dp(46),
        bottom:1,
    }
})