import {toastLong} from '../utils/ToastUtil'
import * as Types from './Types';
import {fetchLoaderAlwaysBuy, fetchAlwaysBuy} from '../services/AlwaysBuytServices';

export function ActionLoaderAlwaysBuy(p, categoryId, searchaKey) {
    return (dispatch) => {
        //dispatch({'type': Types.RequestAlwaysBuyStart});
        fetchLoaderAlwaysBuy(p, categoryId, searchaKey).then((ret) => {
            dispatch({'type': Types.RequestAlwaysBuyEnd, data: ret.data, error: ret.error});
        }).catch((e) => {
            dispatch({'type': Types.RequestAlwaysBuyError, error: e});
        });
    }
}

export function ActionAlwaysBuy(p, categoryId, searchaKey) {
    return (dispatch) => {
        //dispatch({'type': Types.RequestLoadAlwaysBuyStart});
        fetchAlwaysBuy(p, categoryId, searchaKey).then((ret) => {
            dispatch({'type': Types.RequestLoadAlwaysBuyEnd, data: ret.data, error: ret.error});
        }).catch((e) => {
            dispatch({'type': Types.RequestLoadAlwaysBuyError, error: e});
        });
    }
}
