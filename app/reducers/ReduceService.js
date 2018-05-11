/*
 * Created by sencha on 2017/8/8.
 */
import * as Types from '../actions/Types';

import {REHYDRATE} from 'redux-persist/constants'

const initalService = {};
const initalHistoryService ={};

export function ReduceServiceManage(state = initalService, action) {
    switch (action.type) {
        case REHYDRATE:
            return state;
        case Types.RequestServiceManageStart:
            return {
                ...state
            };
        case Types.RequestServiceManageEnd:
            return {
                ...state,
                datas: action.data
            }
        case Types.RequestServiceManageError:
            return {
                ...state
            };
        default:
            return state;
    }

}

export function ReduceHistoryServiceManage(state = initalHistoryService, action) {
    switch (action.type) {
        case REHYDRATE:
            return state;
        case Types.RequestHistoryServiceManageStart:
            return {
                ...state
            };
        case Types.RequestHistoryServiceManageEnd:
            return {
                ...state,
                datas: action.data
            }
        case Types.RequestHistoryServiceManageError:
            return {
                ...state
            };
        default:
            return state;
    }

}