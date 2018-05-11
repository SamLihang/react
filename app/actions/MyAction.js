/**
 * Created by Administrator on 2017/5/8.
 */
import {toastLong} from '../utils/ToastUtil'
import * as Types from './Types';
import {
    fetchMyAmount,
    fetchSendCode,
    fetchSetPayPassword,
    fetchAccountBank,
    fetchAccountInfo,
    fetchWithdrawalAdd,
    fetchRecharge,
    fetchUpdatePayPassword,
    fetchUpdatePassword,
    fetchUpdateSginPassword,
    fetchGetCustomer,
    fetchSellInfo,
    fetchCompanyDescription,
    fetchCompanyName,
    fetchContactName,
    fetchContactPhone,
    fetchBContactPhone,
    fetchSetDeliver,
    fetchSSBills,
    fetchDelivery,
    fetchSetReplenish,
    fetchCompanyImages,
} from '../services/MyServices';
import {BCLAlipay} from '../utils/RequestUtil';

//我的余额
export function ActionMyAmount() {
    return (dispatch) => {
        dispatch({'type': Types.RequestPurchaseMyAmountStart});
        fetchMyAmount().then((ret) => {
            dispatch({'type': Types.RequestPurchaseMyAmountEnd, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestPurchaseMyAmountError, error: e});
        });
    }
}

//验证码
export function ActionSendCode({phone}) {
    return (dispatch) => {
        dispatch({'type': Types.RequestPurchaseSendCodeStart});
        fetchSendCode({phone}).then((ret) => {
            dispatch({'type': Types.RequestPurchaseSendCodeEnd, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestPurchaseSendCodeError, error: e});
        });
    }
}

//返回验证码和设置密码
export function ActionPayPassword({code, payPassword}) {
    return (dispatch) => {
        dispatch({'type': Types.RequestPurchasePayPasswordStart});
        fetchSetPayPassword({code, payPassword}).then((ret) => {
            dispatch({'type': Types.RequestPurchasePayPasswordEnd, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestPurchasePayPasswordError, error: e});
        });
    }
}

//提现返回现金
export function ActionAccountBank({amount}) {
    return (dispatch) => {
        dispatch({'type': Types.RequestPurchaseAccountBankStart});
        fetchAccountBank({amount}).then((ret) => {
            dispatch({'type': Types.RequestPurchaseAccountBankEnd, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestPurchaseAccountBankError, error: e});
        });
    }
}

//没有账号提现页面的可用余额
export function ActionAccountInfo() {
    return (dispatch) => {
        dispatch({'type': Types.RequestPurchaseAccountInfoStart});
        fetchAccountInfo().then((ret) => {
            dispatch({'type': Types.RequestPurchaseAccountInfoEnd, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestPurchaseAccountInfoError, error: e});
        });
    }
}

//充值
export function ActionRecharge({payType, amount}) {
    return (dispatch) => {
        dispatch({'type': Types.RequestRechargeStart});
        fetchRecharge({payType, amount}).then((ret) => {
            if (ret.data != null) {
                BCLAlipay(ret.data, (code, message) => {
                    dispatch({'type': Types.RequestRechargeEnd, data: code, message: message});
                })
            } else {
                dispatch({'type': Types.RequestRechargeEnd, data: ret.data, message: ret.error});
            }
        }).catch((e) => {
            dispatch({'type': Types.RequestRechargeError, data: null, message: e});
        });
    }
}

//最终的确认提现
export function ActionWithdrawalAdd({accountType, withdrawAccount, withdrawName, withdrawBankName, openBankName, amount}) {
    return (dispatch) => {
        dispatch({'type': Types.RequestPurchaseWithdrawalAddStart});
        fetchWithdrawalAdd({
            accountType,
            withdrawAccount,
            withdrawName,
            withdrawBankName,
            openBankName,
            amount
        }).then((ret) => {
            dispatch({'type': Types.RequestPurchaseWithdrawalAddEnd, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestPurchaseWithdrawalAddError, error: e});
        });
    }
}

//返回验证码和修改支付密码
export function ActionUpdatePayPassword({code, payPassword}) {
    return (dispatch) => {
        dispatch({'type': Types.RequestUpdatePayPasswordStart});
        fetchUpdatePayPassword({code, payPassword}).then((ret) => {
            dispatch({'type': Types.RequestUpdatePayPasswordEnd, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestUpdatePayPasswordError, error: e});
        });
    }
}

//修改登录密码
export function ActionUpdatePassword({code, password}) {
    return (dispatch) => {
        dispatch({'type': Types.RequestUpdatePasswordStart});
        fetchUpdatePassword({code, password}).then((ret) => {
            dispatch({'type': Types.RequestUpdatePasswordEnd, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestUpdatePasswordError, error: e});
        });
    }
}

//修改验货密码
export function ActionUpdateSginPassword({code, signPassword}) {
    return (dispatch) => {
        dispatch({'type': Types.RequestUpdateSginPasswordStart});
        fetchUpdateSginPassword({code, signPassword}).then((ret) => {
            dispatch({'type': Types.RequestUpdateSginPasswordEnd, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestUpdateSginPasswordError, error: e});
        });
    }
}

//我的客户
export function ActionGetCustomer() {
    return (dispatch) => {
        dispatch({'type': Types.RequestGetCustomerStart});
        fetchGetCustomer().then((ret) => {
            dispatch({'type': Types.RequestGetCustomerEnd, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestGetCustomerError, error: e});
        });
    }
}

//卖家版店铺信息
export function ActionSellInfo() {
    return (dispatch) => {
        dispatch({'type': Types.RequestSellInfoStart});
        fetchSellInfo().then((ret) => {
            dispatch({'type': Types.RequestSellInfoEnd, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestSellInfoError, error: e});
        });
    }
}

//卖家版店铺简介
export function ActionCompanyDescription({companyDescription}) {
    return (dispatch) => {
        dispatch({'type': Types.RequestCompanyDescriptionStart});
        fetchCompanyDescription({companyDescription}).then((ret) => {
            dispatch({'type': Types.RequestCompanyDescriptionEnd, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestCompanyDescriptionError, error: e});
        });
    }
}

//卖家版照片信息
export function ActionCompanyImages({companyId}) {
    return (dispatch) => {
        dispatch({'type': Types.RequestCompanyImagesStart});
        fetchCompanyImages({companyId}).then((ret) => {
            dispatch({'type': Types.RequestCompanyImagesEnd, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestCompanyImagesError, error: e});
        });
    }
}

//卖家版修改店铺名称
export function ActionCompanyName({companyFullName}) {
    return (dispatch) => {
        dispatch({'type': Types.RequestCompanyNameStart});
        fetchCompanyName({companyFullName}).then((ret) => {
            dispatch({'type': Types.RequestCompanyNameEnd, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestCompanyNameError, error: e});
        });
    }
}

//卖家版修改联系人
export function ActionContactName({contactName}) {
    return (dispatch) => {
        dispatch({'type': Types.RequestContactNameStart});
        fetchContactName({contactName}).then((ret) => {
            dispatch({'type': Types.RequestContactNameEnd, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestContactNameError, error: e});
        });
    }
}

//卖家版修改联系电话
export function ActionContactPhone({phone, code}) {
    return (dispatch) => {
        dispatch({'type': Types.RequestContactphoneStart});
        fetchContactPhone({phone, code}).then((ret) => {
            dispatch({'type': Types.RequestContactphoneEnd, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestContactphoneError, error: e});
        });
    }
}

//买家版修改联系电话
export function ActionBContactPhone({phone, code}) {
    return (dispatch) => {
        dispatch({'type': Types.RequestBContactphoneStart});
        fetchBContactPhone({phone, code}).then((ret) => {
            dispatch({'type': Types.RequestBContactphoneEnd, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestBContactphoneError, error: e});
        });
    }
}

//卖家版配送费设置
export function ActionSetDeliver({companyId, startPrice, deliveryAmount, StartQuantity}) {
    return (dispatch) => {
        dispatch({'type': Types.RequestSetDeliverStart});
        fetchSetDeliver({
            companyId,
            startPrice,
            deliveryAmount,
            StartQuantity,
        }).then((ret) => {
            dispatch({'type': Types.RequestSetDeliverEnd, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestSetDeliverError, error: e});
        });
    }
}

//卖家版配送费请求
export function ActionDelivery(companyId) {
    return (dispatch) => {
        //dispatch({'type': Types.RequestDeliveryStart});
        fetchDelivery(companyId).then((ret) => {
            dispatch({'type': Types.RequestDeliveryEnd, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestDeliveryError, error: e});
        });
    }
}

//卖家账单
export function ActionSSBills({p, date}) {
    return (dispatch) => {
        dispatch({'type': Types.RequestSSBillsStart});
        fetchSSBills({p, date}).then((ret) => {
            dispatch({'type': Types.RequestSSBillsEnd, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestSSBillsError, error: e});
        });
    }
}

//卖家补货配送费设置
export function ActionSetReplenish({companyId, ReplenishStartPrice, ReplenishDeliveryAmount, ReplenishStartQuantity, ReplenishDistance, ReplenishAddRate}) {
    return (dispatch) => {
        dispatch({'type': Types.RequestSetReplenishStart});
        fetchSetReplenish({
            companyId,
            ReplenishStartPrice,
            ReplenishDeliveryAmount,
            ReplenishStartQuantity,
            ReplenishDistance,
            ReplenishAddRate
        }).then((ret) => {
            dispatch({'type': Types.RequestSetReplenishEnd, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestSetReplenishError, error: e});
        });
    }
}

