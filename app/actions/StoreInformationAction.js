/**
 * Created by Administrator on 2017/5/15.
 */
import {toastLong} from '../utils/ToastUtil'
import * as Types from './Types';
import {fetchStoreInformation,fetchStoreName,fetchStoreIntroduction} from '../services/StoreInformationServices';

export function ActionStoreInformation() {
    return (dispatch) => {
        dispatch({'type': Types.RequestStoreInformationStart});
        fetchStoreInformation().then((ret) => {
            dispatch({'type': Types.RequestStoreInformationEnd, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestStoreInformationError, error: e});
        });
    }
}

export function ActionStoreName() {
    return (dispatch) => {
        dispatch({'type': Types.RequestStoreNameStart});
        fetchStoreName().then((ret) => {
            dispatch({'type': Types.RequestStoreNameEnd, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestStoreNameError, error: e});
        });
    }
}

export function ActionStoreIntroduction() {
    return (dispatch) => {
        dispatch({'type': Types.RequestStoreIntroductionStart});
        fetchStoreIntroduction().then((ret) => {
            dispatch({'type': Types.RequestStoreIntroductionEnd, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestStoreIntroductionError, error: e});
        });
    }
}

export function ActionUpdateContact() {
    return (dispatch) => {
        dispatch({'type': Types.RequestUpdateContactStart});
        fetchUpdateContact().then((ret) => {
            dispatch({'type': Types.RequestUpdateContactEnd, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestUpdateContactError, error: e});
        });
    }
}