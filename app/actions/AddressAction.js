/**
 * Created by sencha on 2017/4/11.
 */
import {toastLong} from '../utils/ToastUtil'
import * as Types from './Types';
import {fetchAddress} from '../services/AddressServices';

export function ActionAddress() {
    return (dispatch) => {
        dispatch({'type': Types.RequestAddressManageStart});
        fetchAddress().then((ret) => {
            dispatch({'type': Types.RequestAddressManageEnd, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestAddressManageError, error: e});
        });
    }
}

export function ActionUpdateAddress() {
    return (dispatch) => {
        dispatch({'type': Types.RequestUpdateAddressManageStart});
        fetchAddress().then((ret) => {
            dispatch({'type': Types.RequestUpdateAddressManageEnd, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestUpdateAddressManageError, error: e});
        });
    }
}

export function ActionDeleteAddress() {
    return (dispatch) => {
        dispatch({'type': Types.RequestUpdateAddressManageStart});
        fetchAddress().then((ret) => {
            dispatch({'type': Types.RequestUpdateAddressManageEnd, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestUpdateAddressManageError, error: e});
        });
    }
}
