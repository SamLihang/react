/**
 * Created by Administrator on 2017/5/8.
 */
import * as Types from '../actions/Types';
import {REHYDRATE} from 'redux-persist/constants'

//我的余额
const initalPurchaseMyAmount = {};
export function ReducePurchaseMyAmount(state=initalPurchaseMyAmount, action){
    switch(action.type){
        case REHYDRATE:
            var incoming = action.payload.ReducePurchaseMyAmount;
            if (incoming) return {...state, ...incoming}
            return state;
        case Types.RequestPurchaseMyAmountStart:
            return {
                ...state
            };
        case Types.RequestPurchaseMyAmountEnd:
            return {
                ...state,
                datas:action.data
            }
        case Types.RequestPurchaseMyAmountError:
            return {
                ...state
            };
        default:
            return state;
    }

}

//设置提现密码
const initalPurchaseSendCode = {};
export function ReducePurchaseSendCode(state=initalPurchaseSendCode, action){
    switch(action.type){
        case REHYDRATE:
            var incoming = action.payload.ReducePurchaseSendCode;
            if (incoming) return {...state, ...incoming}
            return state;
        case Types.RequestPurchaseSendCodeStart:
            return {
                ...state
            };
        case Types.RequestPurchaseSendCodeEnd:
            return {
                ...state,
                datas:action.data
            }
        case Types.RequestPurchaseSendCodeError:
            return {
                ...state
            };
        default:
            return state;
    }

}

//返回验证码和设置密码
const initalPurchasePayPassword = {};
export function ReducePurchasPayPassword(state=initalPurchasePayPassword, action){
    switch(action.type){
        case REHYDRATE:
            var incoming = action.payload.ReducePurchasPayPassword;
            if (incoming) return {...state, ...incoming}
            return state;
        case Types.RequestPurchasePayPasswordStart:
            return {
                ...state
            };
        case Types.RequestPurchasePayPasswordEnd:
            return {
                ...state,
                datas:action.data
            }
        case Types.RequestPurchasePayPasswordError:
            return {
                ...state
            };
        default:
            return state;
    }

}

//提现返回现金
const initalPurchaseAccountBank = {};
export function ReducePurchasAccountBank(state=initalPurchaseAccountBank, action){
    switch(action.type){
        case REHYDRATE:
            var incoming = action.payload.ReducePurchasAccountBank;
            if (incoming) return {...state, ...incoming}
            return state;
        case Types.RequestPurchaseAccountBankStart:
            return {
                ...state
            };
        case Types.RequestPurchaseAccountBankEnd:
            return {
                ...state,
                datas:action.data
            }
        case Types.RequestPurchaseAccountBankError:
            return {
                ...state
            };
        default:
            return state;
    }

}

//没有账号提现页面的可用余额
const initalPurchaseAccountInfo = {};
export function ReducePurchasAccountInfo(state=initalPurchaseAccountInfo, action){
    switch(action.type){
        case REHYDRATE:
            //var incoming = action.payload.ReducePurchasAccountInfo;
           //if (incoming) return {...state, ...incoming}
            return state;
        case Types.RequestPurchaseAccountInfoStart:
            return {
                ...state
            };
        case Types.RequestPurchaseAccountInfoEnd:
            return {
                ...state,
                datas:action.data
            }
        case Types.RequestPurchaseAccountInfoError:
            return {
                ...state
            };
        default:
            return state;
    }

}

//最终的确认提现
const initalPurchaseWithdrawalAdd={};
export function ReducePurchasWithdrawalAdd(state=initalPurchaseWithdrawalAdd, action){
    switch(action.type){
         case REHYDRATE:
            // var incoming = action.payload.ReducePurchasWithdrawalAdd;
            // if (incoming) return {...state, ...incoming}
            return state;
        case Types.RequestPurchaseWithdrawalAddStart:
            return {
                ...state
            };
        case Types.RequestPurchaseWithdrawalAddEnd:
            return {
                ...state,
                datas:action.data
            }
        case Types.RequestPurchaseWithdrawalAddError:
            return {
                ...state
            };
        default:
            return state;
    }

}

//充值
export function ReduceRecharge(state={}, action){
    switch(action.type){
        case Types.RequestRechargeStart:
            return {
                ...state
            };
        case Types.RequestRechargeEnd:
            return {
                ...state,
                data:action.data,
                message:action.message
            }
        case Types.RequestRechargeError:
            return {
                ...state
            };
        default:
            return state;
    }

}

//返回验证码和设置支付密码
const initalUpdatePayPassword = {};
export function ReduceUpdatePayPassword(state=initalUpdatePayPassword, action){
    switch(action.type){
        case Types.RequestUpdatePayPasswordStart:
            return {
                ...state
            };
        case Types.RequestUpdatePayPasswordEnd:
            return {
                ...state,
                datas:action.data
            }
        case Types.RequestUpdatePayPasswordError:
            return {
                ...state
            };
        default:
            return state;
    }

}

//修改登录密码
const initalUpdatePassword = {};
export function ReduceUpdatePassword(state=initalUpdatePassword, action){
    switch(action.type){
        case Types.RequestUpdatePasswordStart:
            return {
                ...state
            };
        case Types.RequestUpdatePasswordEnd:
            return {
                ...state,
                datas:action.data
            }
        case Types.RequestUpdatePasswordError:
            return {
                ...state
            };
        default:
            return state;
    }

}

//修改验货密码
const initalUpdateSginPassword = {};
export function ReduceUpdateSginPassword(state=initalUpdateSginPassword, action){
    switch(action.type){
        case Types.RequestUpdateSginPasswordStart:
            return {
                ...state
            };
        case Types.RequestUpdateSginPasswordEnd:
            return {
                ...state,
                datas:action.data
            }
        case Types.RequestUpdateSginPasswordError:
            return {
                ...state
            };
        default:
            return state;
    }

}

//我的客户
const initalGetCustomer = {};
export function ReduceGetCustomer(state=initalGetCustomer, action){
    switch(action.type){
        case Types.RequestGetCustomerStart:
            return {
                ...state
            };
        case Types.RequestGetCustomerEnd:
            return {
                ...state,
                datas:action.data
            }
        case Types.RequestGetCustomerError:
            return {
                ...state
            };
        default:
            return state;
    }

}

//卖家版店铺信息
const initalSellInfo = {};
export function ReduceSellInfo(state=initalSellInfo, action){
    switch(action.type){
        case Types.RequestSellInfoStart:
            return {
                ...state
            };
        case Types.RequestSellInfoEnd:
            return {
                ...state,
                datas:action.data
            }
        case Types.RequestSellInfoError:
            return {
                ...state
            };
        default:
            return state;
    }

}

//卖家版店铺简介
const initalCompanyDescription = {};
export function ReduceCompanyDescription(state = initalCompanyDescription, action) {
    switch (action.type) {
        case REHYDRATE:
            //var incoming = action.payload.ReduceAddressManage;
            //if (incoming) return {...state, ...incoming}
            return state;
        case Types.RequestCompanyDescriptionStart:
            return {
                ...state
            };
        case Types.RequestCompanyDescriptionEnd:
            return {
                ...state,
                datas: action.data
            }
        case Types.RequestCompanyDescriptionError:
            return {
                ...state
            };
        default:
            return state;
    }

}

//卖家版店铺简介
const initalCompanyName = {};
export function ReduceCompanyName(state = initalCompanyName, action) {
    switch (action.type) {
        case REHYDRATE:
            //var incoming = action.payload.ReduceAddressManage;
            //if (incoming) return {...state, ...incoming}
            return state;
        case Types.RequestCompanyNameStart:
            return {
                ...state
            };
        case Types.RequestCompanyNameEnd:
            return {
                ...state,
                datas: action.data
            }
        case Types.RequestCompanyNameError:
            return {
                ...state
            };
        default:
            return state;
    }

}

//卖家版修改联系人
const initalContactName = {};
export function ReduceContactName(state = initalContactName, action) {
    switch (action.type) {
        case REHYDRATE:
            //var incoming = action.payload.ReduceAddressManage;
            //if (incoming) return {...state, ...incoming}
            return state;
        case Types.RequestContactNameStart:
            return {
                ...state
            };
        case Types.RequestContactNameEnd:
            return {
                ...state,
                datas: action.data
            }
        case Types.RequestContactNameError:
            return {
                ...state
            };
        default:
            return state;
    }

}

//卖家版修改联系电话
const initalContactPhone = {};
export function ReduceContactPhone(state = initalContactPhone, action) {
    switch (action.type) {
        case REHYDRATE:
            //var incoming = action.payload.ReduceAddressManage;
            //if (incoming) return {...state, ...incoming}
            return state;
        case Types.RequestContactphoneStart:
            return {
                ...state
            };
        case Types.RequestContactphoneEnd:
            return {
                ...state,
                datas: action.data
            }
        case Types.RequestContactphoneError:
            return {
                ...state
            };
        default:
            return state;
    }

}

//卖家版获取照片
const initalCompanyImages = {};
export function ReduceCompanyImages(state = initalCompanyImages, action) {
    switch (action.type) {
        case REHYDRATE:
            //var incoming = action.payload.ReduceAddressManage;
            //if (incoming) return {...state, ...incoming}
            return state;
        case Types.RequestCompanyImagesStart:
            return {
                ...state
            };
        case Types.RequestCompanyImagesEnd:
            return {
                ...state,
                datas: action.data
            }
        case Types.RequestCompanyImagesError:
            return {
                ...state
            };
        default:
            return state;
    }
}

//买家版修改联系电话
const initalBContactPhone = {};
export function ReduceBContactPhone(state = initalBContactPhone, action) {
    switch (action.type) {
        case REHYDRATE:
            //var incoming = action.payload.ReduceAddressManage;
            //if (incoming) return {...state, ...incoming}
            return state;
        case Types.RequestBContactphoneStart:
            return {
                ...state
            };
        case Types.RequestBContactphoneEnd:
            return {
                ...state,
                datas: action.data
            }
        case Types.RequestBContactphoneError:
            return {
                ...state
            };
        default:
            return state;
    }

}

//卖家版配送费设置
const initalSetDeliver = {};
export function ReduceSetDeliver(state = initalSetDeliver, action) {
    switch (action.type) {
        case REHYDRATE:
            //var incoming = action.payload.ReduceAddressManage;
            //if (incoming) return {...state, ...incoming}
            return state;
        case Types.RequestSetDeliverStart:
            return {
                ...state
            };
        case Types.RequestSetDeliverEnd:
            return {
                ...state,
                datas: action.data
            }
        case Types.RequestSetDeliverError:
            return {
                ...state
            };
        default:
            return state;
    }

}

//卖家版配送费请求
const initalDelivery = {};
export function ReduceDelivery(state = initalDelivery, action) {
    switch (action.type) {
        case REHYDRATE:
            //var incoming = action.payload.ReduceAddressManage;
            //if (incoming) return {...state, ...incoming}
            return state;
        case Types.RequestDeliveryStart:
            return {
                ...state
            };
        case Types.RequestDeliveryEnd:
            return {
                ...state,
                datas: action.data
            }
        case Types.RequestDeliveryError:
            return {
                ...state
            };
        default:
            return state;
    }

}


//卖家补货配送费设置
const initalSetReplenish = {};
export function ReduceSetReplenish(state = initalSetReplenish, action) {
    switch (action.type) {
        case REHYDRATE:
            //var incoming = action.payload.ReduceAddressManage;
            //if (incoming) return {...state, ...incoming}
            return state;
        case Types.RequestSetReplenishStart:
            return {
                ...state
            };
        case Types.RequestSetReplenishEnd:
            return {
                ...state,
                datas: action.data
            }
        case Types.RequestSetReplenishError:
            return {
                ...state
            };
        default:
            return state;
    }

}