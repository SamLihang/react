/**
 * Created by sencha on 2017/3/25.
 */
import React,{Component} from 'react'
import {View,StyleSheet,Image,Text} from 'react-native'
var MockData = [{
    img : 'https://gtms02.alicdn.com/tps/i2/TB1hbkyHpXXXXboXXXXcy0wIpXX-70-70.png',
    text : '手机圈儿',
    link : 'http://3c.m.tmall.com'
},{
    img : 'https://gtms01.alicdn.com/tps/i1/TB13zsxHpXXXXX8XpXXcy0wIpXX-70-70.png',
    text : '发现好玩',
    link : 'http://3c.m.tmall.com'
},{
    img : 'https://gtms01.alicdn.com/tps/i1/TB1wpUtHpXXXXb1XVXXcy0wIpXX-70-70.png',
    text : '我爱我家',
    link : 'http://3c.m.tmall.com'
},{
    img : 'https://gtms03.alicdn.com/tps/i3/TB14NwyHpXXXXaUXXXXcy0wIpXX-70-70.png',
    text : '生活圈儿',
    link : 'http://3c.m.tmall.com'
},{
    img : 'https://gtms04.alicdn.com/tps/i4/TB1ODktHpXXXXXZXVXXcy0wIpXX-70-70.png',
    text : '试用中心',
    link : 'http://3c.m.tmall.com'
}];

export default class Cat extends Component{
    renderItems(data){
        return data.map(function(item,i) {
            return(
                <View key={i} style={styles.boxItem}>
                    <Image source={{uri:item.img}} style={styles.boxImg}  />
                    <Text style={styles.boxText}>{item.text}</Text>
                </View>
            )
        })
    }
    render(){
        return(
            <View style={styles.box}>
                {this.renderItems(MockData)}
            </View>
        )
    }
}

var styles=StyleSheet.create({
    box:{
        flexDirection:'row',
        justifyContent:'center',
        paddingBottom:10,
        paddingTop:10,
        paddingLeft:5,
        paddingRight:5,
        backgroundColor:'#eeeeee'
    },
    boxItem:{
        flex:1,
        flexDirection:'column',
        //justifyContent:'center',
        alignItems:'center',
        padding:2
    },
    boxImg:{
        width:35,
        height:35,
        marginBottom:10
    },
    boxText:{
        color:'#333333',
        fontSize:12
    }
})