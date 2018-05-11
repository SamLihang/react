/**
 * Created by sencha on 2017/4/11.
 */
import {toastLong} from '../utils/ToastUtil'
import * as Types from './Types';
import {fetchLoadReplenishUrl, fetchReplenishCompanys} from '../services/ReplenishServices';

export function ActionLoadReplenish() {
    return (dispatch) => {
        dispatch({'type': Types.RequestLoadReplenishStart});
        fetchLoadReplenishUrl().then((ret) => {
            dispatch({'type': Types.RequestLoadReplenishEnd, data: ret.data, error: ret.error});
        }).catch((e) => {
            dispatch({'type': Types.RequestLoadReplenishError, error: e});
        });
    }
}

export function ActionReplenishCompanys(categoryId) {
    return (dispatch) => {
        dispatch({'type': Types.RequestReplenishCompanysStart});
        fetchReplenishCompanys(categoryId).then((ret) => {
            dispatch({'type': Types.RequestReplenishCompanysEnd, data: ret.data, error: ret.error});
        }).catch((e) => {
            dispatch({'type': Types.RequestReplenishCompanysError, error: e});
        });
    }
}
