/**
 * Created by sencha on 2017/8/8.
 */
import {toastLong} from '../utils/ToastUtil'
import * as Types from './Types';
import {fetchGetServiceorder} from '../services/ServiceServices';
import {fetchGetHistoryServiceOrder} from "../services/HistoryServiceServices"

export function ActionService(p) {
    return (dispatch) => {
        dispatch({'type': Types.RequestServiceManageStart});
        fetchGetServiceorder({p}).then((ret) => {
            dispatch({'type': Types.RequestServiceManageEnd, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestServiceManageError, error: e});
        });
    }
}

export function ActionHistoryService(p) {
    return (dispatch) => {
        dispatch({'type': Types.RequestHistoryServiceManageStart});
        fetchGetHistoryServiceOrder({p}).then((ret) => {
            dispatch({'type': Types.RequestHistoryServiceManageEnd, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestHistoryServiceManageError, error: e});
        });
    }
}