/*
 * Created by sencha on 2017/4/11.
 */
import * as Types from '../actions/Types';

import {REHYDRATE} from 'redux-persist/constants'

const initialLoaderProduct = {};
const initialProducts = {};
const initialProductDetail = {};
const initialLoadReplenishProducts = {};
const initialReplenishProducts = {};
const initialLoadMallProducts = {};
const initialMallProducts = {};
const initialLoadMallAd={};
const initialLoadMallAdPc = {};
const initialSearchPage = {};

//采购
export function ReduceLoderProducts(state = initialLoaderProduct, action) {
    switch (action.type) {
        case REHYDRATE:
            //var incoming = action.payload.ReduceLoderProducts;
            //if (incoming) return {...state, ...incoming}
            return state;
        case Types.RequestLoaderProductsStart:
            return {
                ...state
            };
        case Types.RequestLoaderProductsEnd:
            return {
                ...state,
                datas: action.data
            }
        case Types.RequestLoaderProductsError:

            return {
                ...state
            };
        default:
            return state;
    }
}

export function ReduceLoaderProductsByCategory(state = initialLoaderProduct, action) {
    switch (action.type) {
        case REHYDRATE:
            //var incoming = action.payload.ReduceLoderProducts;
            //if (incoming) return {...state, ...incoming}
            return state;
        case Types.RequestLoaderProductsByCategoryStart:
            return {
                ...state
            };
        case Types.RequestLoaderProductsByCategoryEnd:
            return {
                ...state,
                datas: action.data
            }
        case Types.RequestLoaderProductsByCategoryError:

            return {
                ...state
            };
        default:
            return state;
    }
}

//首页搜索
export function ReduceSearchProduct(state = initialSearchPage, action) {
    switch (action.type) {
        case REHYDRATE:
            //var incoming = action.payload.ReduceLoderProducts;
            //if (incoming) return {...state, ...incoming}
            return state;
        case Types.RequestSearchProductStart:
            return {
                ...state
            };
        case Types.RequestSearchProductEnd:
            return {
                ...state,
                datas: action.data
            }
        case Types.RequestSearchProductError:

            return {
                ...state
            };
        default:
            return state;
    }
}

//采购
export function ReduceProduct(state = initialProducts, action) {
    switch (action.type) {
        case REHYDRATE:
            //var incoming = action.payload.ReduceProduct;
            //if (incoming) return {...state, ...incoming}
            return state;
        case Types.RequestProductsStart:
            return {
                ...state
            };
        case Types.RequestProductsEnd:
            return {
                ...state,
                datas: action.data
            }
        case Types.RequestProductsError:
            return {
                ...state
            };
        default:
            return state;
    }

}

//商品详情
export function ReduceProductDetail(state = initialProductDetail, action) {
    switch (action.type) {
        case REHYDRATE:
            //var incoming = action.payload.ReduceProduct;
            //if (incoming) return {...state, ...incoming}
            return state;
        case Types.RequestProductDetailStart:
            return {
                ...state
            };
        case Types.RequestProductDetailEnd:
            return {
                ...state,
                datas: action.data
            }
        case Types.RequestProductDetailError:
            return {
                ...state
            };
        default:
            return state;
    }

}

//补货
export function ReduceLoadReplenishProducts(state = initialLoadReplenishProducts, action) {
    switch (action.type) {
        case REHYDRATE:
            //var incoming = action.payload.ReduceLoderProducts;
            //if (incoming) return {...state, ...incoming}
            return state;
        case Types.RequestLoadReplenishProductsStart:
            return {
                ...state
            };
        case Types.RequestLoadReplenishProductsEnd:
            return {
                ...state,
                datas: action.data
            };
        case Types.RequestLoadReplenishProductsError:

            return {
                ...state
            };
        default:
            return state;
    }
}

//补货
export function ReduceReplenishProducts(state = initialReplenishProducts, action) {
    switch (action.type) {
        case REHYDRATE:
            //var incoming = action.payload.ReduceProduct;
            //if (incoming) return {...state, ...incoming}
            return state;
        case Types.RequestReplenishProductsStart:
            return {
                ...state
            };
        case Types.RequestReplenishProductsEnd:
            return {
                ...state,
                datas: action.data
            };
        case Types.RequestReplenishProductsError:
            return {
                ...state
            };
        default:
            return state;
    }
}

//自营
export function ReduceLoadMallProducts(state = initialLoadMallProducts, action) {
    switch (action.type) {
        case REHYDRATE:
            //var incoming = action.payload.ReduceLoderProducts;
            //if (incoming) return {...state, ...incoming}
            return state;
        case Types.RequestLoadMallProductsStart:
            return {
                ...state
            };
        case Types.RequestLoadMallProductsEnd:
            return {
                ...state,
                datas: action.data
            };
        case Types.RequestLoadMallProductsError:
            return {
                ...state
            };
        default:
            return state;
    }
}

//自营
export function ReduceMallProducts(state = initialMallProducts, action) {
    switch (action.type) {
        case REHYDRATE:
            //var incoming = action.payload.ReduceProduct;
            //if (incoming) return {...state, ...incoming}
            return state;
        case Types.RequestMallProductsStart:
            return {
                ...state
            };
        case Types.RequestMallProductsEnd:
            return {
                ...state,
                datas: action.data
            };
        case Types.RequestMallProductsError:
            return {
                ...state
            };
        default:
            return state;
    }
}
//自营广告
export function ReduceLoadMallAd(state = initialLoadMallAd, action) {
    switch (action.type) {
        case REHYDRATE:
            //var incoming = action.payload.ReduceLoderProducts;
            //if (incoming) return {...state, ...incoming}
            return state;
        case Types.RequestLoadMallADStart:
            return {
                ...state
            };
        case Types.RequestLoadMallADEnd:
            return {
                ...state,
                datas: action.data
            };
        case Types.RequestLoadMallADError:
            return {
                ...state
            };
        default:
            return state;
    }
}

export function ReduceLoadMallAdPc(state = initialLoadMallAdPc, action) {
    switch (action.type) {
        case REHYDRATE:
            return state;
        case Types.RequestLoadMallADPcStart:
            return {
                ...state
            };
        case Types.RequestLoadMallADPcEnd:
            return {
                ...state,
                datas: action.data
            };
        case Types.RequestLoadMallADPcError:
            return {
                ...state
            };
        default:
            return state;
    }
}

//首页分类banner点击后跳转页面接口
const initialClassifyList = {};
export function ReduceClassifyList(state = initialClassifyList, action) {
    switch (action.type) {
        case REHYDRATE:
            return state;
        case Types.RequestClassifyListStart:
            return {
                ...state
            };
        case Types.RequestClassifyListEnd:
            return {
                ...state,
                datas: action.data
            };
        case Types.RequestClassifyListError:
            return {
                ...state
            };
        default:
            return state;
    }
}
//首页分类banner点击后跳转页面Items接口+购物车
// const initialClassifyList = {};
// export function ReduceClassifyList(state = initialClassifyList, action) {
//     switch (action.type) {
//         case REHYDRATE:
//             return state;
//         case Types.RequestClassifyListStart:
//             return {
//                 ...state
//             };
//         case Types.RequestClassifyListEnd:
//             return {
//                 ...state,
//                 datas: action.data
//             };
//         case Types.RequestClassifyListError:
//             return {
//                 ...state
//             };
//         default:
//             return state;
//     }
// }







