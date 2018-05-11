import {toastLong} from '../utils/ToastUtil'
import * as Types from './Types';
import {fetchLoaderProductPurchaseAmount, fetchProductPurchaseAmount} from '../services/ProductPurchaseAmountServices';
//加载时有类别
export function ActionLoaderProductPurchaseAmount() {
    return (dispatch) => {
        //dispatch({'type': Types.RequestPriceParityStart});
        fetchLoaderProductPurchaseAmount().then((ret) => {
            dispatch({'type': Types.RequestLoaderProductPurchaseAmountEnd, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestLoaderProductPurchaseAmountError, error: e});
        });
    }
}
//分页
export function ActionProductPurchaseAmount({parentCategoryId, p, searchKey}) {
    return (dispatch) => {
        dispatch({'type': Types.RequestProductPurchaseAmountStart});
        fetchProductPurchaseAmount({parentCategoryId, p, searchKey}).then((ret) => {
            dispatch({'type': Types.RequestProductPurchaseAmountEnd, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestProductPurchaseAmountError, error: e});
        });
    }
}