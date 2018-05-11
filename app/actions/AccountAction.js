/**
 * Created by Administrator on 2017/5/15.
 */
import {toastLong} from '../utils/ToastUtil'
import * as Types from './Types';
import {
    fetchAccount,
    fetchSettlementList,
    fetchAccountDetail,
    fetchSettleAccountPays,
    fetchBBillsUrl
} from '../services/AccountServices';
import {BCLAlipay} from '../utils/RequestUtil';

export function ActionAccount() {
    return (dispatch) => {
        dispatch({'type': Types.RequestAccountPayStart});
        fetchAccount().then((ret) => {
            dispatch({'type': Types.RequestAccountPayEnd, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestAccountPayError, error: e});
        });
    }
}

export function ActionSettlementList(SCompanyId) {
    return (dispatch) => {
        dispatch({'type': Types.RequestSettlementListStart});
        fetchSettlementList(SCompanyId).then((ret) => {
            dispatch({'type': Types.RequestSettlementListEnd, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestSettlementListError, error: e});
        });
    }
}

export function ActionAccountDetail(PurchaseOrderSettleId) {
    return (dispatch) => {
        dispatch({'type': Types.RequestAccountDetailStart});
        fetchAccountDetail(PurchaseOrderSettleId).then((ret) => {
            dispatch({'type': Types.RequestAccountDetailEnd, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestAccountDetailError, error: e});
        });
    }
}

//账期支付
export function ActionAccounts({purchaseOrderSettleId, purchaseOrderIds, payType, amount}) {
    return (dispatch) => {
        dispatch({'type': Types.RequestAccountsStart});
        fetchSettleAccountPays({purchaseOrderSettleId, purchaseOrderIds, payType, amount}).then((ret) => {
            // 如果是支付宝支付那么就调用支付宝接口
            if (ret.data != null && ret.data.result > 0) {
                const {result, order, AddressId} = ret.data;
                if (result == 1 && order) {
                    BCLAlipay(order, (code, message) => {
                        dispatch({
                            'type': Types.RequestAccountsEnd,
                            data: {code: code, time: new Date().getTime()},
                            message: message
                        });
                    })
                } else {
                    dispatch({
                        'type': Types.RequestAccountsEnd,
                        data: {code: 1, time: new Date().getTime()},
                        message: "支付成功"
                    });
                }
            } else {
                dispatch({
                    'type': Types.RequestAccountsEnd,
                    data: {code: 0, time: new Date().getTime()},
                    message: ret.error
                });
            }
        }).catch((e) => {
            dispatch({'type': Types.RequestAccountsError, error: e});
        });
    }
}

//买家账单
export function ActionBBills({p, date}) {
    return (dispatch) => {
        dispatch({'type': Types.RequestBBillsStart});
        fetchBBillsUrl({p, date}).then((ret) => {
            dispatch({'type': Types.RequestBBillsEnd, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestBBillsError, error: e});
        });
    }
}