/**
 * Created by sencha on 2017/4/11.
 */
import {toastLong} from '../utils/ToastUtil'
import * as Types from './Types';
import {fetchProvider, fetchProviders} from '../services/ProviderServices';

let Providers = [];
let Provider = {};

//
export function ActionProviders(searchKeyInput) {
    return (dispatch, getState) => {
        dispatch({'type': Types.RequestProvidersStart});
        fetchProviders({searchKeyInput}).then((ret) => {
            dispatch({'type': Types.RequestProvidersEnd, data: ret.data, error: ret.error});
        }).catch((e) => {
            dispatch({'type': Types.RequestProvidersError, error: e});
        });
    }
}

export function ActionProvider(bCompanyId, sCompanyId) {
    return (dispatch) => {
        dispatch({'type': Types.RequestProviderStart});
        fetchProvider({bCompanyId, sCompanyId}).then((ret) => {
            dispatch({'type': Types.RequestProviderEnd, data: ret.data, error: ret.error});
        }).catch((e) => {
            dispatch({'type': Types.RequestProviderError, error: e});
        });
    }
}
