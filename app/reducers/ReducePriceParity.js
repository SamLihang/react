import * as Types from '../actions/Types';

import {REHYDRATE} from 'redux-persist/constants'

const initalLoaderPriceParity = {};

const initalPriceParity = {};

const initalPriceTendency = {};

export function ReduceLoaderMarketPrices(state = initalLoaderPriceParity, action) {
    switch (action.type) {
        case REHYDRATE:
            //var incoming = action.payload.ReduceLoderProducts;
            //if (incoming) return {...state, ...incoming}
            return state;
        case Types.RequestPriceParityStart:
            return {
                ...state
            };
        case Types.RequestPriceParityEnd:
            return {
                ...state,
                datas: action.data
            }
        case Types.RequestPriceParityError:
            return {
                ...state
            };
        default:
            return state;
    }
}

export function ReduceMarketPrices(state = initalPriceParity, action) {
    switch (action.type) {
        case REHYDRATE:
            //var incoming = action.payload.ReduceProduct;
            //if (incoming) return {...state, ...incoming}
            return state;
        case Types.RequestMarketPricesStart:
            return {
                ...state
            };
        case Types.RequestMarketPricesEnd:
            return {
                ...state,
                datas: action.data
            }
        case Types.RequestMarketPricesError:
            return {
                ...state
            };
        default:
            return state;
    }
}

//价格走势图
export function ReducePriceTendency(state = initalPriceTendency, action) {
    switch (action.type) {
        case REHYDRATE:
            //var incoming = action.payload.ReduceProduct;
            //if (incoming) return {...state, ...incoming}
            return state;
        case Types.RequestPriceTendencyStart:
            return {
                ...state
            };
        case Types.RequestPriceTendencyEnd:
            return {
                ...state,
                datas: action.data
            }
        case Types.RequestPriceTendencyError:
            return {
                ...state
            };
        default:
            return state;
    }
}