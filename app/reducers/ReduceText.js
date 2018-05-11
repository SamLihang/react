/**
 * Created by sencha on 2017/3/23.
 */
export default function (state='',action) {
    switch (action.type){
        case 'TEXT_UPDATE':
            return action.text;
        default:
            return state;
    }
}