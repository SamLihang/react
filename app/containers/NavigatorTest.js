/**
 * Created by sencha on 2017/3/27.
 */
import React,{Component} from 'react'
import {
    View,
    Text,
    Image,
    ToolbarAndroid,
    StyleSheet,
    Navigator
} from 'react-native'
import MainStyles from '../styles/MainStyles'

import AddTodo from './AddTodo'
import HomeScene from './HomeScene'

var NavigationBarRouteMapper={
    LeftButton(route,navigator,index,navState){
        return null;
    },
    RightButton(route,navigator,index,navState){
        return null;
    },
    Title(route,navigator,index,navState){
        return(
            <View style={MainStyles.navigator_title}>
                <Text style={MainStyles.navigator_title_text}>应用标题</Text>
            </View>
        )
    }
}

export default class NavigatorTest extends Component{
    render(){
        return(
            <Navigator
                style={MainStyles.main}
                initialRoute={{name:'Home',component:HomeScene}}
                configureScene={(route,routeStack)=>{
                    return Object.assign(Navigator.SceneConfigs.PushFromRight,{defaultTransitionVelocity:10000})
                    //return Navigator.SceneConfigs.PushFromRight
                }}
                renderScene={(route,navigator)=>{
                    let Com=route.component;
                    return <Com {...route.params} navigator={navigator}/>
                }}
                /*navigationBar={
                    <Navigator.NavigationBar style={MainStyles.navigator} routeMapper={NavigationBarRouteMapper}/>
                }*/
            />
        )
    }
}
