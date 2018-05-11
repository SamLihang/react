/*
 * Created by sencha on 2017/4/11.
 */
import * as Types from '../actions/Types';

import {REHYDRATE} from 'redux-persist/constants'

const initalAddress = {};

export function ReduceAddressManage(state = initalAddress, action) {
    switch (action.type) {
        case REHYDRATE:
            //var incoming = action.payload.ReduceAddressManage;
            //if (incoming) return {...state, ...incoming}
            return state;
        case Types.RequestAddressManageStart:
            return {
                ...state
            };
        case Types.RequestAddressManageEnd:
            return {
                ...state,
                datas: action.data
            }
        case Types.RequestAddressManageError:
            return {
                ...state
            };
        default:
            return state;
    }

}

export function ReduceUpdateAddressManage(state = initalAddress, action) {
    switch (action.type) {
        case REHYDRATE:
            //var incoming = action.payload.ReduceAddressManage;
            //if (incoming) return {...state, ...incoming}
            return state;
        case Types.RequestUpdateAddressManageStart:
            return {
                ...state
            };
        case Types.RequestUpdateAddressManageEnd:
            return {
                ...state,
                datas: action.data
            }
        case Types.RequestUpdateAddressManageError:
            return {
                ...state
            };
        default:
            return state;
    }

}

export function ReduceDeleteAddressManage(state = initalAddress, action) {
    switch (action.type) {
        case REHYDRATE:
            //var incoming = action.payload.ReduceAddressManage;
            //if (incoming) return {...state, ...incoming}
            return state;
        case Types.RequestDeleteAddressManageStart:
            return {
                ...state
            };
        case Types.RequestDeleteAddressManageEnd:
            return {
                ...state,
                datas: action.data
            }
        case Types.RequestDeleteAddressManageError:
            return {
                ...state
            };
        default:
            return state;
    }

}