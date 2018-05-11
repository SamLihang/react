/*
 * Created by sencha on 2017/4/11.
 */
import * as Types from '../actions/Types';

import {REHYDRATE} from 'redux-persist/constants'

const initalProviders = {};

const initalProvider = {}

export function ReduceProviders(state = initalProviders, action) {
    switch (action.type) {
        case REHYDRATE:
            //var incoming = action.payload.ReduceProviders;
            //if (incoming) return {...state, ...incoming}
            return state;
        case Types.RequestProvidersStart:
            return {
                ...state
            };
        case Types.RequestProvidersEnd:
            return {
                ...state,
                datas: action.data,
                error: action.error
            }
        case Types.RequestProvidersError:
            return {
                ...state
            };
        default:
            return state;
    }

}

export function ReduceProvider(state = initalProvider, action) {
    switch (action.type) {
        case REHYDRATE:
            //var incoming = action.payload.ReduceProvider;
            //if (incoming) return {...state, ...incoming}
            return state;
        case Types.RequestProviderStart:
            return {
                ...state
            };
        case Types.RequestProviderEnd:
            return {
                ...state,
                datas: action.data,
                error: action.error
            };
        case Types.RequestProviderError:
            return {
                ...state
            };
        default:
            return state;
    }

}