/**
 * Created by sencha on 2017/3/29.
 */
export default function (state=0, action) {
    switch(action.type){
        case 'AddScale':
            return state+1;
        case 'DecScale':
            return state-1;
        default:
            return state
    }
}