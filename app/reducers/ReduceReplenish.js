import * as Types from '../actions/Types';

import {REHYDRATE} from 'redux-persist/constants'

const initalLaodCompanys = {};

const initalCompanys = {};

export function ReduceLoadReplenish(state = initalLaodCompanys, action) {
    switch (action.type) {
        case REHYDRATE:
            //var incoming = action.payload.ReduceProviders;
            //if (incoming) return {...state, ...incoming}
            return state;
        case Types.RequestLoadReplenishStart:
            return {
                ...state
            };
        case Types.RequestLoadReplenishEnd:
            return {
                ...state,
                datas: action.data,
                error: action.error
            };
        case Types.RequestLoadReplenishError:
            return {
                ...state
            };
        default:
            return state;
    }
}

export function ReduceReplenishCompanys(state = initalCompanys, action) {
    switch (action.type) {
        case REHYDRATE:
            //var incoming = action.payload.ReduceProviders;
            //if (incoming) return {...state, ...incoming}
            return state;
        case Types.RequestReplenishCompanysStart:
            return {
                ...state
            };
        case Types.RequestReplenishCompanysEnd:
            return {
                ...state,
                datas: action.data,
                error: action.error
            };
        case Types.RequestReplenishCompanysError:
            return {
                ...state
            };
        default:
            return state;
    }
}
