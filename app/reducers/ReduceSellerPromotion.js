
import * as Types from '../actions/Types';

import {REHYDRATE} from 'redux-persist/constants'

const initialLoadPromotionProducts = {};
const initialPromotionProducts = {};
const initialPromotionDetail = {};
export function ReduceLoadPromotionProducts(state = initialLoadPromotionProducts, action) {
    switch (action.type) {
        case REHYDRATE:

            return state;
        case Types.RequestLoadPromotionProductsStart:
            return {
                ...state
            };
        case Types.RequestLoadPromotionProductsEnd:
            return {
                ...state,
                datas: action.data
            };
        case Types.RequestLoadPromotionProductsError:

            return {
                ...state
            };
        default:
            return state;
    }
}

export function ReducePromotionProduct(state = initialPromotionProducts, action) {
    switch (action.type) {
        case REHYDRATE:

            return state;
        case Types.RequestPromotionProductsStart:
            return {
                ...state
            };
        case Types.RequestPromotionProductsEnd:
            return {
                ...state,
                datas: action.data
            };
        case Types.RequestPromotionProductsError:

            return {
                ...state
            };
        default:
            return state;
    }
}
export function ReduceSellerPromotionDetail(state = initialPromotionDetail, action) {
    switch (action.type) {
        case REHYDRATE:

            return state;
        case Types.RequestSellerPromotionDetailStart:
            return {
                ...state
            };
        case Types.RequestSellerPromotionDetailEnd:
            return {
                ...state,
                datas: action.data
            };
        case Types.RequestSellerPromotionDetailError:

            return {
                ...state
            };
        default:
            return state;
    }
}