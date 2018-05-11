import {toastLong} from '../utils/ToastUtil'
import * as Types from './Types';
import {fetchLoaderWithdrawDetail} from '../services/WithdrawalDetailServices';
//加载时有类别
export function ActionLoaderWithdrawDetail(amount) {
    return (dispatch) => {
        dispatch({'type': Types.RequestWithdrawDetailStart});
        fetchLoaderWithdrawDetail(amount).then((ret) => {
            dispatch({'type': Types.RequestWithdrawDetailEnd, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestWithdrawDetailError, error: e});
        });
    }
}
