import * as Types from '../actions/Types';

import {REHYDRATE} from 'redux-persist/constants'

const initalLoaderProductPurchaseAmount = {};
//买家统计
const initalProductPurchaseAmount = {};

const initalPurchaseStatisticsChart = {};

// 卖家统计
const initalSellerPurchaseAmount = {};

const initalSellerStatisticsChart = {};

export function ReduceLoaderProductPurchaseAmount(state = initalLoaderProductPurchaseAmount, action) {
    switch (action.type) {
        case REHYDRATE:
            //var incoming = action.payload.ReduceLoderProducts;
            //if (incoming) return {...state, ...incoming}
            return state;
        case Types.RequestLoaderProductPurchaseAmountStart:
            return {
                ...state
            };
        case Types.RequestLoaderProductPurchaseAmountEnd:
            return {
                ...state,
                datas: action.data
            }
        case Types.RequestLoaderProductPurchaseAmountError:
            return {
                ...state
            };
        default:
            return state;
    }
}
//买家统计
export function ReduceProductPurchaseAmount(state = initalProductPurchaseAmount, action) {
    switch (action.type) {
        case REHYDRATE:
            //var incoming = action.payload.ReduceProduct;
            //if (incoming) return {...state, ...incoming}
            return state;
        case Types.RequestProductPurchaseAmountStart:
            return {
                ...state
            };
        case Types.RequestProductPurchaseAmountEnd:
            return {
                ...state,
                datas: action.data
            }
        case Types.RequestProductPurchaseAmountError:
            return {
                ...state
            };
        default:
            return state;
    }
}

export function ReducePurchaseStatisticsChart(state = initalPurchaseStatisticsChart, action) {
    switch (action.type) {
        case REHYDRATE:
            //var incoming = action.payload.ReduceProduct;
            //if (incoming) return {...state, ...incoming}
            return state;
        case Types.RequestPurchaseStatisticsChartStart:
            return {
                ...state
            };
        case Types.RequestPurchaseStatisticsChartEnd:
            return {
                ...state,
                datas: action.data
            }
        case Types.RequestPurchaseStatisticsChartError:
            return {
                ...state
            };
        default:
            return state;
    }
}

//卖家统计
export function ReduceSellerPurchaseAmount(state = initalSellerPurchaseAmount, action) {
    switch (action.type) {
        case REHYDRATE:
            //var incoming = action.payload.ReduceProduct;
            //if (incoming) return {...state, ...incoming}
            return state;
        case Types.RequestSellerPurchaseAmountStart:
            return {
                ...state
            };
        case Types.RequestSellerPurchaseAmountEnd:
            return {
                ...state,
                datas: action.data
            }
        case Types.RequestSellerPurchaseAmountError:
            return {
                ...state
            };
        default:
            return state;
    }
}

export function ReduceSellerStatisticsChart(state = initalSellerStatisticsChart, action) {
    switch (action.type) {
        case REHYDRATE:
            //var incoming = action.payload.ReduceProduct;
            //if (incoming) return {...state, ...incoming}
            return state;
        case Types.RequestSellerStatisticsChartStart:
            return {
                ...state
            };
        case Types.RequestSellerStatisticsChartEnd:
            return {
                ...state,
                datas: action.data
            }
        case Types.RequestSellerStatisticsChartError:
            return {
                ...state
            };
        default:
            return state;
    }
}