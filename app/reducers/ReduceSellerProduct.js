/*
 * Created by sencha on 2017/4/11.
 */
import * as Types from '../actions/Types';

import {REHYDRATE} from 'redux-persist/constants'

const initialLoaderProduct = {};
const initialProducts = {};
const initialProductDetail = {};
const initialLoadActiveProducts = {};
const initialActiveProducts = {};
const initialPostActiveProducts = {};
const initialSellerReplenishProducts = {};
const initialSellerUpdateReplenishProducts = {};


export function ReduceSellerLodeProducts(state = initialLoaderProduct, action) {
    switch (action.type) {
        case REHYDRATE:
            //var incoming = action.payload.ReduceLoderProducts;
            //if (incoming) return {...state, ...incoming}
            return state;
        case Types.RequestLoadSellerProductsStart:
            return {
                ...state
            };
        case Types.RequestLoadSellerProductsEnd:
            return {
                ...state,
                datas: action.data
            };
        case Types.RequestLoadSellerProductsError:

            return {
                ...state
            };
        default:
            return state;
    }
}

export function ReduceSellerProduct(state = initialProducts, action) {
    switch (action.type) {
        case REHYDRATE:
            //var incoming = action.payload.ReduceProduct;
            //if (incoming) return {...state, ...incoming}
            return state;
        case Types.RequestSellerProductsStart:
            return {
                ...state
            };
        case Types.RequestSellerProductsEnd:
            return {
                ...state,
                datas: action.data
            };
        case Types.RequestSellerProductsError:
            return {
                ...state
            };
        default:
            return state;
    }
}

//商品规格价格组
export function ReduceSellerProductSpecPrices(state = initialProductDetail, action) {
    switch (action.type) {
        case REHYDRATE:
            //var incoming = action.payload.ReduceProduct;
            //if (incoming) return {...state, ...incoming}
            return state;
        case Types.RequestProductSpecPricesStart:
            return {
                ...state
            };
        case Types.RequestProductSpecPricesEnd:
            return {
                ...state,
                datas: action.data
            };
        case Types.RequestProductSpecPricesError:
            return {
                ...state
            };
        default:
            return state;
    }
}

//上下架
export function ReduceLoadActiveProducts(state = initialLoadActiveProducts, action) {
    switch (action.type) {
        case REHYDRATE:
            //var incoming = action.payload.ReduceLoderProducts;
            //if (incoming) return {...state, ...incoming}
            return state;
        case Types.RequestLoadActiveProductsStart:
            return {
                ...state
            };
        case Types.RequestLoadActiveProductsEnd:
            return {
                ...state,
                datas: action.data
            };
        case Types.RequestLoadActiveProductsError:

            return {
                ...state
            };
        default:
            return state;
    }
}

export function ReduceActiveProducts(state = initialActiveProducts, action) {
    switch (action.type) {
        case REHYDRATE:
            //var incoming = action.payload.ReduceProduct;
            //if (incoming) return {...state, ...incoming}
            return state;
        case Types.RequestActiveProductsStart:
            return {
                ...state
            };
        case Types.RequestActiveProductsEnd:
            return {
                ...state,
                datas: action.data
            };
        case Types.RequestActiveProductsError:
            return {
                ...state
            };
        default:
            return state;
    }
}

export function ReducePostActiveProducts(state = initialPostActiveProducts, action) {
    switch (action.type) {
        case REHYDRATE:
            //var incoming = action.payload.ReduceProduct;
            //if (incoming) return {...state, ...incoming}
            return state;
        case Types.RequestPostActiveProductsStart:
            return {
                ...state
            };
        case Types.RequestPostActiveProductsEnd:
            return {
                ...state,
                datas: action.data
            };
        case Types.RequestPostActiveProductsError:
            return {
                ...state
            };
        default:
            return state;
    }
}

//卖家补货
export function ReduceSellerReplenishProducts(state = initialSellerReplenishProducts, action) {
    switch (action.type) {
        case REHYDRATE:
            //var incoming = action.payload.ReduceProduct;
            //if (incoming) return {...state, ...incoming}
            return state;
        case Types.RequestSellerReplenishProductsStart:
            return {
                ...state
            };
        case Types.RequestSellerReplenishProductsEnd:
            return {
                ...state,
                datas: action.data
            };
        case Types.RequestSellerReplenishProductsError:
            return {
                ...state
            };
        default:
            return state;
    }
}

export function ReduceSellerUpdateReplenishProducts(state = initialSellerUpdateReplenishProducts, action) {
    switch (action.type) {
        case REHYDRATE:
            //var incoming = action.payload.ReduceProduct;
            //if (incoming) return {...state, ...incoming}
            return state;
        case Types.RequestSellerUpdateReplenishProductsStart:
            return {
                ...state
            };
        case Types.RequestSellerUpdateReplenishProductsEnd:
            return {
                ...state,
                datas: action.data
            };
        case Types.RequestSellerUpdateReplenishProductsError:
            return {
                ...state
            };
        default:
            return state;
    }
}

//商品信息
const initialEditDetail = {};

export function ReduceEditDetail(state = initialEditDetail, action) {
    switch (action.type) {
        case REHYDRATE:
            return state;
        case Types.RequestEditDetailStart:
            return {
                ...state
            };
        case Types.RequestEditDetailEnd:
            return {
                ...state,
                datas: action.data
            };
        case Types.RequestEditDetailError:
            return {
                ...state
            };
        default:
            return state;
    }
}
