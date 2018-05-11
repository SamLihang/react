import * as Types from '../actions/Types';

import {REHYDRATE} from 'redux-persist/constants'

const initalLoaderProduct = {};
const initalProduct = {};

export function ReduceLoaderAlwaysBuy(state = initalLoaderProduct, action) {
    switch (action.type) {
        case Types.RequestAlwaysBuyStart:
            return {
                ...state
            };
        case Types.RequestAlwaysBuyEnd:
            return {
                ...state,
                datas: action.data,
                error: action.error,
            };
        case Types.RequestAlwaysBuyError:
            return {
                ...state
            };
        default:
            return state;
    }
}

export function ReduceAlwaysBuy(state = initalProduct, action) {
    switch (action.type) {
        case Types.RequestLoadAlwaysBuyStart:
            return {
                ...state
            };
        case Types.RequestLoadAlwaysBuyEnd:
            return {
                ...state,
                datas: action.data,
                error: action.error
            };
        case Types.RequestLoadAlwaysBuyError:
            return {
                ...state
            };
        default:
            return state;
    }
}