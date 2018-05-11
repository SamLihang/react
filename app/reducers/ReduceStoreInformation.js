/*
 * Created by sencha on 2017/4/11.
 */
import * as Types from '../actions/Types';
import {REHYDRATE} from 'redux-persist/constants'

const initalStoreInformation = {};
const initalStoreName = {};
const initalStoreIntroduction = {};
const initalUpdateContact = {};

//店铺详情
export function ReduceStoreInformation(state = initalStoreInformation, action) {
    switch (action.type) {
        case REHYDRATE:
            //var incoming = action.payload.ReduceAddressManage;
            //if (incoming) return {...state, ...incoming}
            return state;
        case Types.RequestStoreInformationStart:
            return {
                ...state
            };
        case Types.RequestStoreInformationEnd:
            return {
                ...state,
                datas: action.data
            }
        case Types.RequestStoreInformationError:
            return {
                ...state
            };
        default:
            return state;
    }

}
//店铺名称修改
export function ReduceStoreName(state = initalStoreName, action) {
    switch (action.type) {
        case REHYDRATE:
            //var incoming = action.payload.ReduceAddressManage;
            //if (incoming) return {...state, ...incoming}
            return state;
        case Types.RequestStoreNameStart:
            return {
                ...state
            };
        case Types.RequestStoreNameEnd:
            return {
                ...state,
                datas: action.data
            }
        case Types.RequestStoreNameError:
            return {
                ...state
            };
        default:
            return state;
    }

}

export function ReduceStoreIntroduction(state = initalStoreIntroduction, action) {
    switch (action.type) {
        case REHYDRATE:
            //var incoming = action.payload.ReduceAddressManage;
            //if (incoming) return {...state, ...incoming}
            return state;
        case Types.RequestStoreIntroductionStart:
            return {
                ...state
            };
        case Types.RequestStoreIntroductionEnd:
            return {
                ...state,
                datas: action.data
            }
        case Types.RequestStoreIntroductionError:
            return {
                ...state
            };
        default:
            return state;
    }

}

export function ReduceUpdateContact(state = initalUpdateContact, action) {
    switch (action.type) {
        case REHYDRATE:
            //var incoming = action.payload.ReduceAddressManage;
            //if (incoming) return {...state, ...incoming}
            return state;
        case Types.RequestUpdateContactStart:
            return {
                ...state
            };
        case Types.RequestUpdateContactEnd:
            return {
                ...state,
                datas: action.data
            }
        case Types.RequestUpdateContactError:
            return {
                ...state
            };
        default:
            return state;
    }

}


