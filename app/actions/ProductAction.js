/**
 * Created by sencha on 2017/4/11.
 */
import {toastLong} from '../utils/ToastUtil'
import * as Types from './Types';
import {
    fetchLoaderProducts,
    fetchProducts,
    fetchProductDetail,
    fetchLoadReplenishProducts,
    fetchReplenishProducts,
    fetchLoadMallProducts,
    fetchMallProducts,
    fetchLoadMallAd,
    fetchLoadMallAdPc,
    fetchLoadProviderProductsUrl,
    fetchSearchProduct,
    fetchClassifyList, //首页分类banner点击后跳转页面接口
    fetchClassifyListItems, //首页分类banner点击后跳转页面Items接口+购物车
} from '../services/ProductServices';

//采购
export function ActionLoaderProducts({productType, sCompanyId}) {
    return (dispatch) => {
        dispatch({'type': Types.RequestLoaderProductsStart});
        fetchLoaderProducts({productType, sCompanyId}).then((ret) => {
            //toastLong.alert(ret);
            //console.log('fetchLoaderProducts',ret)
            dispatch({'type': Types.RequestLoaderProductsEnd, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestLoaderProductsError, error: e});
        });
    }
}
export function ActionLoaderProductsByCategory({productType, sCompanyId, categoryId, parentCategoryId, productGlobalId}) {
    return (dispatch) => {
        dispatch({'type': Types.RequestLoaderProductsByCategoryStart});
        fetchLoadProviderProductsUrl({
            productType,
            sCompanyId,
            categoryId,
            parentCategoryId,
            productGlobalId
        }).then((ret) => {
            //toastLong.alert(ret);
            //console.log('fetchLoadProviderProductsUrl',ret)
            dispatch({'type': Types.RequestLoaderProductsByCategoryEnd, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestLoaderProductsByCategoryError, error: e});
        });
    }
}

//搜索
export function ActionSearchProduct({searchKey,p}) {
    return (dispatch) => {
        dispatch({'type': Types.RequestSearchProductStart});
        fetchSearchProduct({
            searchKey,
            p,
        }).then((ret) => {
            //toastLong.alert(ret);
            dispatch({'type': Types.RequestSearchProductEnd, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestSearchProductError, error: e});
        });
    }
}

//采购
export function ActionProducts({ProductGlobalId,productType, sCompanyId, priceGroupId, parentCategoryId, categoryId, p}) {
    return (dispatch) => {
        //dispatch({'type': Types.RequestProductsStart});
        fetchProducts({ProductGlobalId,productType, sCompanyId, priceGroupId, parentCategoryId, categoryId, p}).then((ret) => {
            dispatch({'type': Types.RequestProductsEnd, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestProductsError, error: e});
        });
    }
}

//商品详情
export function ActionProductDetail({productGlobalId, companyId, productType}) {
    return (dispatch) => {
        dispatch({'type': Types.RequestProductDetailStart});
        fetchProductDetail({productGlobalId, companyId, productType}).then((ret) => {
            dispatch({'type': Types.RequestProductDetailEnd, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestProductDetailError, error: e});
        });
    }
}


//补货
export function ActionLoadReplenishProducts({productType, sCompanyId}) {
    return (dispatch) => {
        dispatch({'type': Types.RequestLoadReplenishProductsStart});
        fetchLoadReplenishProducts({productType, sCompanyId}).then((ret) => {
            //toastLong.alert(ret);
            dispatch({'type': Types.RequestLoadReplenishProductsEnd, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestLoadReplenishProductsError, error: e});
        });
    }
}

//补货
export function ActionReplenishProducts({productType, sCompanyId, priceGroupId, parentCategoryId, categoryId, p}) {
    return (dispatch) => {
        //dispatch({'type': Types.RequestReplenishProductsStart});
        fetchReplenishProducts({productType, sCompanyId, priceGroupId, parentCategoryId, categoryId, p}).then((ret) => {
            dispatch({'type': Types.RequestReplenishProductsEnd, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestReplenishProductsError, error: e});
        });
    }
}

//自营
export function ActionLoadMallProducts(AreaId) {
    return (dispatch) => {
        dispatch({'type': Types.RequestLoadMallProductsStart});
        fetchLoadMallProducts(AreaId).then((ret) => {
            dispatch({'type': Types.RequestLoadMallProductsEnd, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestLoadMallProductsError, error: e});
        });
    }
}

//自营
export function ActionMallProducts({parentCategoryId, categoryId, p, searchKey}) {
    return (dispatch) => {
        //dispatch({'type': Types.RequestMallProductsStart});
        fetchMallProducts({parentCategoryId, categoryId, p, searchKey}).then((ret) => {
            dispatch({'type': Types.RequestMallProductsEnd, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestMallProductsError, error: e});
        });
    }
}

//自营广告
export function ActionLoadMallAd({type}) {
    return (dispatch) => {
        dispatch({'type': Types.RequestLoadMallADStart});
        fetchLoadMallAd({type}).then((ret) => {
            dispatch({'type': Types.RequestLoadMallADEnd, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestLoadMallADError, error: e});
        });
    }
}

//轮播
export function ActionLoadMallAdPC({type}) {
    return (dispatch) => {
        dispatch({'type': Types.RequestLoadMallADPcStart});
        fetchLoadMallAdPc({type}).then((ret) => {
            dispatch({'type': Types.RequestLoadMallADPcEnd, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestLoadMallADPcError, error: e});
        });
    }
}

//首页分类banner点击后跳转页面分类接口
export function ActionClassifyList({recommendId}) {
    return (dispatch) => {
        dispatch({'type': Types.RequestClassifyListStart});
        fetchClassifyList({recommendId}).then((ret) => {
            dispatch({'type': Types.RequestClassifyListEnd, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestClassifyListError, error: e});
        });
    }
}
//首页分类banner点击后跳转页面Items接口
export function ActionClassifyListItems({p,sCompanyId,productCategoryId,productChildCategoryId,searchKey}) {
    return (dispatch) => {
        dispatch({'type': Types.RequestClassifyListItemsStart});
        fetchClassifyListItems({p,sCompanyId,productCategoryId,productChildCategoryId,searchKey}).then((ret) => {
            dispatch({'type': Types.RequestClassifyListItemsEnd, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestClassifyListItemsError, error: e});
        });
    }
}



















