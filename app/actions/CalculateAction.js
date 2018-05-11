/**
 * Created by Administrator on 2017/4/18.
 */
import {toastLong} from '../utils/ToastUtil'
import * as Types from './Types';
import {fetchInsertOrUpdateShoppingCarts} from '../services/ShoppingCartServices'

export function Add({TotalCount, Items}) {
    return (dispatch) => {
        dispatch({'type': 'Add', e: {TotalCount, Items}});
        fetchInsertOrUpdateShoppingCarts({TotalCount, Items}).then((ret) => {
            dispatch({'type': Types.RequestInsertOrUpdateShoppingCartsEnd, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestInsertOrUpdateShoppingCartsError, error: e});
        });
    }
}

export function Reduce({TotalCount, Items}) {
    return {'type': 'Reduce', e: {TotalCount, Items}};
}
