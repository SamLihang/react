/**
 * Created by Administrator on 2017/4/7.
 */
import {NavigationActions} from 'react-navigation';
import {AppNavigator} from '../RouteConfigs';
const initialNavState={
    index:1,
    routes:[
        {key:'BuyerIndex',routeName:'BuyerIndex'},
        {key:'Login',routeName:'Login'}
    ]
}

const initialAuthState={isLoggedIn:false};

export const nav=(state=initialNavState,action)=>{
    switch (action.type){
        case "@@redux/INIT":
            return AppNavigator.router.getStateForAction(action,state=0);
        case "Login":
            return AppNavigator.router.getStateForAction(NavigationActions.back(),state)
        case "Logout":
            return AppNavigator.router.getStateForAction(NavigationActions.navigate({routeName:'Login'}),state)
        default:
            return AppNavigator.router.getStateForAction(action,state);
    }
}

export const auth=(state=initialAuthState,action)=>{
    switch (action.type){
        case 'Login':
            return{...state,isLoggedIn:true}
        case 'Logout':
            return{...state,isLoggedIn:false}
        default:
            return state
    }
}
