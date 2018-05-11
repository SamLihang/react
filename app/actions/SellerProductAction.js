import {toastLong} from '../utils/ToastUtil'
import * as Types from './Types';
import {
    fetchLoaderProducts,
    fetchProducts,
    fetchProductSpecPrices,
    fetchLoadActiveProducts,
    fetchActiveProducts,
    fetchPostActiveProducts,
    fetchSellerReplenishProducts,
    fetchSellerUpdateReplenishProducts,
    fetchEditDetail,
} from '../services/SellerProductServices';

export function ActionLoaderProducts() {
    return (dispatch) => {
        //dispatch({'type': Types.RequestLoadSellerProductsStart});
        fetchLoaderProducts().then((ret) => {
            dispatch({'type': Types.RequestLoadSellerProductsEnd, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestLoadSellerProductsError, error: e});
        });
    }
}

export function ActionProducts({parentCategoryId, categoryId, p}) {
    return (dispatch) => {
        //dispatch({'type': Types.RequestSellerProductsStart});
        fetchProducts({parentCategoryId, categoryId, p}).then((ret) => {
            dispatch({'type': Types.RequestSellerProductsEnd, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestSellerProductsError, error: e});
        });
    }
}

//商品详情
export function ActionProductSpecPrices(productGlobalId) {
    return (dispatch) => {
        //dispatch({'type': Types.RequestProductSpecPricesStart});
        fetchProductSpecPrices(productGlobalId).then((ret) => {
            dispatch({'type': Types.RequestProductSpecPricesEnd, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestProductSpecPricesError, error: e});
        });
    }
}

//上下架
export function ActionLoadActiveProducts(isActive) {
    return (dispatch) => {
        //dispatch({'type': Types.RequestLoadActiveProductsStart});
        fetchLoadActiveProducts(isActive).then((ret) => {
            dispatch({'type': Types.RequestLoadActiveProductsEnd, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestLoadActiveProductsError, error: e});
        });
    }
}

export function ActionActiveProducts({parentCategoryId, categoryId, p, isActive, searchKey}) {
    return (dispatch) => {
        //dispatch({'type': Types.RequestActiveProductsStart});
        fetchActiveProducts({parentCategoryId, categoryId, p, isActive, searchKey}).then((ret) => {
            dispatch({'type': Types.RequestActiveProductsEnd, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestActiveProductsError, error: e});
        });
    }
}

export function ActionPostActiveProducts({productGlobalIds, isActive}) {
    return (dispatch) => {
        //dispatch({'type': Types.RequestPostActiveProductsStart});
        fetchPostActiveProducts({productGlobalIds, isActive}).then((ret) => {
            dispatch({'type': Types.RequestPostActiveProductsEnd, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestPostActiveProductsError, error: e});
        });
    }
}

//卖家补货
export function ActionSellerReplenishProducts({parentCategoryId, categoryId, p, IsReplenish, searchKey}) {
    return (dispatch) => {
        //dispatch({'type': Types.RequestSellerReplenishProductsStart});
        fetchSellerReplenishProducts({parentCategoryId, categoryId, p, IsReplenish, searchKey}).then((ret) => {
            dispatch({'type': Types.RequestSellerReplenishProductsEnd, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestSellerReplenishProductsError, error: e});
        });
    }
}

export function ActionSellerUpdateReplenishProducts({productGlobalIds, IsReplenish}) {
    return (dispatch) => {
        //dispatch({'type': Types.RequestSellerUpdateReplenishProductsStart});
        fetchSellerUpdateReplenishProducts({productGlobalIds, IsReplenish}).then((ret) => {
            dispatch({'type': Types.RequestSellerUpdateReplenishProductsEnd, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestSellerUpdateReplenishProductsError, error: e});
        });
    }
}

//我的商品 编辑商品信息
export function ActionEditDetail(productGlobalId) {
    return (dispatch) => {
        //dispatch({'type': Types.RequestLoadSellerProductsStart});
        fetchEditDetail(productGlobalId).then((ret) => {
            dispatch({'type': Types.RequestEditDetailEnd, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestEditDetailError, error: e});
        });
    }
}

