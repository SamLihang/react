/**
 * Created by Administrator on 2017/4/18.
 */
import * as Types from "./Types";
import {
    fetchCancelPurchaseOrder,
    fetchCheckPayPassword,
    fetchDetailsInspectionPurchaseOrder,
    fetchPaySuccess,
    fetchPrintPurchaseOrder,
    fetchPurchaseOrderConfirm,
    fetchPurchaseOrderDetail,
    fetchPurchaseOrders,
    fetchQuickSignPurchaseOrder,
    fetchSettleAccounts,
    fetchToPayPurchaseOrder,
    fetchSettleAmount,
    fetchConfirmPayUrl,
    fetchGetServiceorderdetail
} from "../services/PurchaseOrderServices";
import {BCLAlipay} from '../utils/RequestUtil';

export function ActionPurchaseOrders1({p, t}) {
    return (dispatch, getState) => {
        dispatch({'type': Types.RequestPurchaseOrders1Start});
        fetchPurchaseOrders({p, t}).then((ret) => {
            dispatch({'type': Types.RequestPurchaseOrders1End, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestPurchaseOrders1Error, error: e});
        });
    }
}


//买家订单详情
export function ActionPurchaseOrderDetail({purchaseOrderId}) {
    return (dispatch) => {
        dispatch({'type': Types.RequestPurchaseOrderDetailStart});
        fetchPurchaseOrderDetail({purchaseOrderId}).then((ret) => {
            dispatch({'type': Types.RequestPurchaseOrderDetailEnd, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestPurchaseOrderDetailError, error: e});
        });
    }
}

//买家订单详情的支付
export function ActionSettleAccount({purchaseOrderId, payType}) {
    return (dispatch) => {
        dispatch({'type': Types.RequestSettleAccountStart});
        fetchSettleAmount(purchaseOrderId, payType).then((ret) => {
            // 1(支付宝),2支付成功  0支付失败
            if (ret.data.result > 0) {
                const {result, order, AddressId} = ret.data;
                if (result == 1 && order) {
                    BCLAlipay(order, (code, message) => {
                        dispatch({'type': Types.RequestSettleAccountEnd, data: code, message: message});
                    })
                } else {
                    dispatch({'type': Types.RequestSettleAccountEnd, data: 1, message: "支付成功"});
                }
            } else {
                dispatch({'type': Types.RequestSettleAccountEnd, data: 0, message: ret.error});
            }
        }).catch((e) => {
            dispatch({'type': Types.RequestSettleAccountError, message: e});
        });
    }
}


//确认订单
export function ActionPurchaseOrderConfirm({shoppingCartIds}) {
    return (dispatch) => {
        dispatch({'type': Types.RequestPurchaseOrderConfirmStart});
        fetchPurchaseOrderConfirm({shoppingCartIds}).then((ret) => {
            dispatch({'type': Types.RequestPurchaseOrderConfirmEnd, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestPurchaseOrderConfirmError, error: e});
        });
    }
}


//确认订单的支付
export function ActionSettleAccounts({addressId, shoppingCartIds, payTypes, purchaseOrderMessageStrs}) {
    return (dispatch) => {
        dispatch({'type': Types.RequestSettleAccountsStart});
        fetchSettleAccounts(addressId, shoppingCartIds, payTypes, purchaseOrderMessageStrs).then((ret) => {
            if (ret.data.result > 0) {
                const {result, order, AddressId} = ret.data;
                if (result == 1 && order) {
                    BCLAlipay(order, (code, message) => {
                        dispatch({
                            'type': Types.RequestSettleAccountsEnd,
                            data: {code: code, time: new Date().getTime()},
                            message: message
                        });
                    })
                } else {
                    dispatch({
                        'type': Types.RequestSettleAccountsEnd,
                        data: {code: 1, time: new Date().getTime()},
                        message: "支付成功"
                    });
                }
            } else {
                dispatch({
                    'type': Types.RequestSettleAccountsEnd,
                    data: {code: 0, time: new Date().getTime()},
                    error: ret.error
                });
            }

        }).catch((e) => {
            dispatch({'type': Types.RequestSettleAccountsError, message: e});
        });
    }
}

export function ActionPurchaseOrders3({p, t}) {
    return (dispatch, getState) => {
        dispatch({'type': Types.RequestPurchaseOrders3Start});
        fetchPurchaseOrders({p, t}).then((ret) => {
            dispatch({'type': Types.RequestPurchaseOrders3End, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestPurchaseOrders3Error, error: e});
        });
    }
}

export function ActionPurchaseOrders4({p, t}) {
    return (dispatch, getState) => {
        dispatch({'type': Types.RequestPurchaseOrders4Start});
        fetchPurchaseOrders({p, t}).then((ret) => {
            dispatch({'type': Types.RequestPurchaseOrders4End, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestPurchaseOrders4Error, error: e});
        });
    }
}

export function ActionPurchaseOrders5({p, t}) {
    return (dispatch, getState) => {
        dispatch({'type': Types.RequestPurchaseOrders5Start});
        fetchPurchaseOrders({p, t}).then((ret) => {
            dispatch({'type': Types.RequestPurchaseOrders5End, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestPurchaseOrders5Error, error: e});
        });
    }
}

export function ActionPurchaseOrders7({p, t}) {
    return (dispatch, getState) => {
        dispatch({'type': Types.RequestPurchaseOrders7Start});
        fetchPurchaseOrders({p, t}).then((ret) => {
            dispatch({'type': Types.RequestPurchaseOrders7End, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestPurchaseOrders7Error, error: e});
        });
    }
}

// 支付成功
export function ActionPaySuccess(addressId) {
    return (dispatch) => {
        dispatch({'type': Types.RequestPurchasePaySuccessStart});
        fetchPaySuccess(addressId).then((ret) => {
            dispatch({'type': Types.RequestPurchasePaySuccessEnd, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestPurchasePaySuccessError, error: e});
        });
    }
}

//去支付
export function ActionToPayPurchaseOrder(purchaseOrderId) {
    return (dispatch) => {
        dispatch({'type': Types.RequestToPayPurchaseOrderStart});
        fetchToPayPurchaseOrder(purchaseOrderId).then((ret) => {
            dispatch({'type': Types.RequestToPayPurchaseOrderEnd, datas: ret.data, error: ret.error});
        }).catch((e) => {
            dispatch({'type': Types.RequestToPayPurchaseOrderError, error: e});
        });
    }
}

//取消订单
export function ActionCancelPurchaseOrder(purchaseOrderId) {
    return (dispatch) => {
        dispatch({'type': Types.RequestCancelPurchaseOrderStart});
        fetchCancelPurchaseOrder(purchaseOrderId).then((ret) => {
            dispatch({'type': Types.RequestCancelPurchaseOrderEnd, datas: ret.data, error: ret.error});
        }).catch((e) => {
            dispatch({'type': Types.RequestCancelPurchaseOrderError, error: e});
        });
    }
}

//快速签收（待验货）
export function ActionQuickSignPurchaseOrder(purchaseOrderId) {
    return (dispatch) => {
        dispatch({'type': Types.RequestQuickSignPurchaseOrderStart});
        fetchQuickSignPurchaseOrder(purchaseOrderId).then((ret) => {
            dispatch({'type': Types.RequestQuickSignPurchaseOrderEnd, datas: ret.data, error: ret.error});
        }).catch((e) => {
            dispatch({'type': Types.RequestQuickSignPurchaseOrderError, error: e});
        });
    }
}

//详情验货（待验货）
export function ActionDetailsInspectionPurchaseOrder(purchaseOrderStr) {
    return (dispatch) => {
        //dispatch({'type': Types.RequestDetailsInspectionPurchaseOrderStart});
        fetchDetailsInspectionPurchaseOrder(purchaseOrderStr).then((ret) => {
            dispatch({'type': Types.RequestDetailsInspectionPurchaseOrderEnd, datas: ret.data, error: ret.error});
        }).catch((e) => {
            dispatch({'type': Types.RequestDetailsInspectionPurchaseOrderError, error: e});
        });
    }
}

//打印（已完成）
export function ActionPrintPurchaseOrder({purchaseOrderIds}) {
    return (dispatch) => {
        dispatch({'type': Types.RequestPrintPurchaseOrderStart});
        fetchPrintPurchaseOrder({purchaseOrderIds}).then((ret) => {
            dispatch({'type': Types.RequestPrintPurchaseOrderEnd, datas: ret.data, error: ret.error});
        }).catch((e) => {
            dispatch({'type': Types.RequestPrintPurchaseOrderError, error: e});
        });
    }
}


//签收返回涮新页面
export let SignPurchaseOrders5 = (PurchaseOrderId) => {
    return dispatch => {
        dispatch(LoadPurchaseOrders5(PurchaseOrderId));
    }
};
let LoadPurchaseOrders5 = (PurchaseOrderId) => {
    return {
        type: Types.PurchaseOrders5Sign,
        PurchaseOrderId: PurchaseOrderId,
    }
};


export let selectOne = (PurchaseOrderID, isSelectOne) => {
    //console.log(PurchaseOrderID+'==================>'+isSelectOne)
    return dispatch => {
        dispatch(selectOnePurchaseOrders7(isSelectOne, PurchaseOrderID));
    }
}

//选择单个
let selectOnePurchaseOrders7 = (isSelectOne, PurchaseOrderID) => {
    return {
        type: Types.PurchaseOrders7SelectOne_List,
        isSelectOne: isSelectOne,
        PurchaseOrderID: PurchaseOrderID
    }
}
export let selectAll = (isSelectAll) => {
    return dispatch => {
        dispatch(selectAllPurchaseOrders7List(isSelectAll));
    }
}
//选择全部
let selectAllPurchaseOrders7List = (isSelectAll) => {
    return {
        type: Types.PurchaseOrders7SelectAll_List,
        isSelectAll: isSelectAll,

    }
}
//展开查看详情--已完成
export let openDetail7 = (PurchaseOrderID, isOpen) => {
    return dispatch => {
        dispatch(openDetailPurchaseOrders7(isOpen, PurchaseOrderID));
    }
};
let openDetailPurchaseOrders7 = (isOpen, PurchaseOrderID) => {
    return {
        type: Types.PurchaseOrders7OpenDetail,
        isOpen: isOpen,
        PurchaseOrderID: PurchaseOrderID,
    }
}

//展开查看详情--待验货
export let openDetail5 = (PurchaseOrderID, isOpen) => {
    return dispatch => {
        dispatch(openDetailPurchaseOrders5(isOpen, PurchaseOrderID));
    }
};
let openDetailPurchaseOrders5 = (isOpen, PurchaseOrderID) => {
    return {
        type: Types.PurchaseOrders5OpenDetail,
        isOpen: isOpen,
        PurchaseOrderID: PurchaseOrderID,
    }
};

//展开查看详情--待付款
export let openDetail4 = (PurchaseOrderID, isOpen) => {
    return dispatch => {
        dispatch(openDetailPurchaseOrders4(isOpen, PurchaseOrderID));
    }
};
let openDetailPurchaseOrders4 = (isOpen, PurchaseOrderID) => {
    return {
        type: Types.PurchaseOrders4OpenDetail,
        isOpen: isOpen,
        PurchaseOrderID: PurchaseOrderID,
    }
};

//展开查看详情---待接单
export let openDetail3 = (PurchaseOrderID, isOpen) => {
    return dispatch => {
        dispatch(openDetailPurchaseOrders3(isOpen, PurchaseOrderID));
    }
};
let openDetailPurchaseOrders3 = (isOpen, PurchaseOrderID) => {
    return {
        type: Types.PurchaseOrders3OpenDetail,
        isOpen: isOpen,
        PurchaseOrderID: PurchaseOrderID,
    }
};

//展开查看详情--待付款
export let openDetail1 = (PurchaseOrderID, isOpen) => {
    return dispatch => {
        dispatch(openDetailPurchaseOrders1(isOpen, PurchaseOrderID));
    }
};
let openDetailPurchaseOrders1 = (isOpen, PurchaseOrderID) => {
    return {
        type: Types.PurchaseOrders1OpenDetail,
        isOpen: isOpen,
        PurchaseOrderID: PurchaseOrderID,
    }
};

//展开查看详情--待付款
export let openOrderDetail = (PurchaseOrderID, isOpen) => {
    return dispatch => {
        dispatch(openPurchaseOrdersDetail(isOpen, PurchaseOrderID));
    }
};
//确定订单--展开查看详情
let openPurchaseOrdersDetail = (isOpen, CompanyId) => {
    return {
        type: Types.OpenPurchaseOrdersDetail,
        isOpen: isOpen,
        CompanyId: CompanyId,
    }
};

//订单详情页面的
export let openOrdersDetail = (PurchaseOrderID, isOpen) => {
    return dispatch => {
        dispatch(openPurchaseOrderDetail(isOpen, PurchaseOrderID));
    }
};
let openPurchaseOrderDetail = (isOpen, CompanyId) => {
    return {
        type: Types.OpenPurchaseOrderDetail,
        isOpen: isOpen,
        CompanyId: CompanyId,
    }
};


//验证支付密码是否正确
export function ActionCheckPayPassword({password}) {
    return (dispatch) => {
        dispatch({'type': Types.RequestCheckPayPasswordStart});
        fetchCheckPayPassword({password}).then((ret) => {
            dispatch({'type': Types.RequestCheckPayPasswordEnd, data: ret.data, error: ret.error});
        }).catch((e) => {
            dispatch({'type': Types.RequestCheckPayPasswordError, error: e});
        });
    }
}

//买家确认付款
export function ActionConfirmPay({purchaseOrderId}) {
    return (dispatch) => {
        dispatch({'type': Types.ConfirmPayStart});
        fetchConfirmPayUrl({purchaseOrderId}).then((ret) => {
            dispatch({'type': Types.ConfirmPaysEnd, data: ret.data, error: ret.error});
        }).catch((e) => {
            dispatch({'type': Types.ConfirmPayError, error: e});
        });
    }
}

//售后详情
export function ActionGetServiceorderdetail(data) {
    return (dispatch) => {
        dispatch({'type': Types.RequestGetServiceorderdetailStart});
        fetchGetServiceorderdetail(data).then((ret) => {
            dispatch({'type': Types.RequestGetServiceorderdetailEnd, data: ret.data, error: ret.error});
        }).catch((e) => {
            dispatch({'type': Types.RequestGetServiceorderdetailError, error: e});
        });
    }
}


