import {toastLong} from '../utils/ToastUtil'
import * as Types from './Types';
import {
    fetchLoadPromotionProducts,
    fetchPromotionProducts,
    fetchPromotionProductDetail,
    fetchPostActiveProducts,
} from '../services/SellerPromotionServices';
export function ActionLoadPromotionProducts(IsPromotion) {
    return (dispatch) => {
        fetchLoadPromotionProducts(IsPromotion).then((ret) => {
            dispatch({'type': Types.RequestLoadPromotionProductsEnd, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestLoadPromotionProductsError, error: e});
        });
    }
}

export function ActionPromotionProducts({parentCategoryId, categoryId, p, IsPromotion, searchKey}) {
    return (dispatch) => {
        //dispatch({'type': Types.RequestActiveProductsStart});
        fetchPromotionProducts({parentCategoryId, categoryId, p, IsPromotion, searchKey}).then((ret) => {
            dispatch({'type': Types.RequestPromotionProductsEnd, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestPromotionProductsError, error: e});
        });
    }
}

export function ActionPromotionDetail(productGlobalId) {
    return (dispatch) => {
        dispatch({'type': Types.RequestSellerPromotionDetailStart});
        fetchPromotionProductDetail(productGlobalId).then((ret) => {
            dispatch({'type': Types.RequestSellerPromotionDetailEnd, data: ret.data, error: ret.error});
        }).catch((e) => {
            dispatch({'type': Types.RequestSellerPromotionDetailError, error: e});
        });
    }
}

export function ActionPostActiveProducts({productGlobalIds}) {
    return (dispatch) => {
        fetchPostActiveProducts({productGlobalIds}).then((ret) => {
            dispatch({'type': Types.RequestPostActiveProductsEnd, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestPostActiveProductsError, error: e});
        });
    }
}