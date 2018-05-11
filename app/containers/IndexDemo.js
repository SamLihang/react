/**
 * Created by sencha on 2017/3/25.
 */
import React,{Component,Platform} from 'react'
import { NavigatorIOS } from 'react-native'

import Test from '../pages/Test'

export default class IndexDemo extends Component{
    render(){
        return (
            <NavigatorIOS style={{flex:1,backgroundColor:'#ff0000'}}
                          tintColor='#ff0000'
                          barTintColor='#ff3456'
                          titleTextColor='#ffffff'//导航上的字体颜色
                          initialRoute={{
                              title:'报菜郎1',
                              component:Test
                          }}/>
        )
    }
}