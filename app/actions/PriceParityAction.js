import {toastLong} from '../utils/ToastUtil'
import * as Types from './Types';
import {fetchLoaderMarketPrices, fetchMarketPrices,fetchPriceTendency} from '../services/PriceParityServices';
//加载时有类别
export function ActionLoaderMarketPrices() {
    return (dispatch) => {
        dispatch({'type': Types.RequestPriceParityStart});
        fetchLoaderMarketPrices().then((ret) => {
            dispatch({'type': Types.RequestPriceParityEnd, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestPriceParityError, error: e});
        });
    }
}
//分页
export function ActionMarketPrices({pCategoryId, p, searchKey}) {
    return (dispatch) => {
        dispatch({'type': Types.RequestMarketPricesStart});
        fetchMarketPrices({pCategoryId, p, searchKey}).then((ret) => {
            dispatch({'type': Types.RequestMarketPricesEnd, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestMarketPricesError, error: e});
        });
    }
}
//价格走势
export function ActionPriceTendency({productGlobalId}) {
    return (dispatch) => {
        dispatch({'type': Types.RequestPriceTendencyStart});
        fetchPriceTendency({productGlobalId}).then((ret) => {
            dispatch({'type': Types.RequestPriceTendencyEnd, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestPriceTendencyError, error: e});
        });
    }
}