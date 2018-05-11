/**
 * Created by Administrator on 2017/5/19.
 */
import * as Types from './Types';
import {
    fetchSellerSalesOrders,
    fetchAcceptSalesOrder,
    fetchDeliverySalesOrder,
    fetchSalesOrderDetail,
    fetchProductDetail,
    fetchConfirmReceive,
    fetchAgreeToRefund,
    fetchRefusedToRefund,

} from '../services/SellerOrderServices';
import {BCLAlipay} from '../utils/RequestUtil';


export function ActionSellerSalesOrder1({p, t}) {
    return (dispatch) => {
        dispatch({'type': Types.RequestSellerSalesOrder1Start});
        fetchSellerSalesOrders({p, t}).then((ret) => {
            dispatch({'type': Types.RequestSellerSalesOrder1End, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestSellerSalesOrder1Error, error: e});
        });
    }
}

export function ActionSellerSalesOrder3({p, t}) {
    return (dispatch) => {
        dispatch({'type': Types.RequestSellerSalesOrder3Start});
        fetchSellerSalesOrders({p, t}).then((ret) => {
            dispatch({'type': Types.RequestSellerSalesOrder3End, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestSellerSalesOrder3Error, error: e});
        });
    }
}

export function ActionSellerSalesOrder5({p, t}) {
    return (dispatch) => {
        dispatch({'type': Types.RequestSellerSalesOrder5Start});
        fetchSellerSalesOrders({p, t}).then((ret) => {
            dispatch({'type': Types.RequestSellerSalesOrder5End, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestSellerSalesOrder5Error, error: e});
        });
    }
}

export function ActionSellerSalesOrder7({p, t}) {
    return (dispatch) => {
        dispatch({'type': Types.RequestSellerSalesOrder7Start});
        fetchSellerSalesOrders({p, t}).then((ret) => {
            dispatch({'type': Types.RequestSellerSalesOrder7End, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestSellerSalesOrder7Error, error: e});
        });
    }
}

//接单
export function ActionAcceptSalesOrder(salesOrderIds) {
    return (dispatch) => {
        dispatch({'type': Types.RequestAcceptSalesOrderStart});
        fetchAcceptSalesOrder(salesOrderIds).then((ret) => {
            dispatch({'type': Types.RequestAcceptSalesOrderEnd, datas: ret.data, error: ret.error});
        }).catch((e) => {
            dispatch({'type': Types.RequestAcceptSalesOrderError, error: e});
        });
    }
}

//发货
export function ActionDeliverySalesOrder(salesOrderIds) {
    return (dispatch) => {
        dispatch({'type': Types.RequestDeliverySalesOrderStart});
        fetchDeliverySalesOrder(salesOrderIds).then((ret) => {
            dispatch({'type': Types.RequestDeliverySalesOrderEnd, datas: ret.data, error: ret.error});
        }).catch((e) => {
            dispatch({'type': Types.RequestDeliverySalesOrderError, error: e});
        });
    }
}

//订单详情
export function ActionSalesOrderDetail(salesOrderId) {
    return (dispatch) => {
        dispatch({'type': Types.RequestSalesOrderDetailStart});
        fetchSalesOrderDetail(salesOrderId).then((ret) => {
            dispatch({'type': Types.RequestSalesOrderDetailEnd, datas: ret.data, error: ret.error});
        }).catch((e) => {
            dispatch({'type': Types.RequestSalesOrderDetailError, error: e});
        });
    }
}

//商品详情
export function ActionProductDetail(productGlobalId) {
    return (dispatch) => {
        dispatch({'type': Types.RequestSellerProductStart});
        fetchProductDetail(productGlobalId).then((ret) => {
            dispatch({'type': Types.RequestSellerProductEnd, datas: ret.data, error: ret.error});
        }).catch((e) => {
            dispatch({'type': Types.RequestSellerProductError, error: e});
        });
    }
}



//待接单加入待发货
export let UpdateSalesOrder3 = (Datas) => {
    return (dispatch) => {
        dispatch(UpdateSalesOrder3List(Datas));

    }
};
let UpdateSalesOrder3List = (Datas) => {
    return {
        type: Types.UpdateSalesOrder1,
        Datas,
    };
};

//卖家待接单 买家更新待接单
export let UpdatePurchaseOrders3 = (Datas) => {
    return (dispatch) => {
        dispatch(UpdatePurchaseOrders3List(Datas));

    }
};
let UpdatePurchaseOrders3List = (Datas) => {
    return {
        type: Types.UpdatePurchaseOrders3,
        Datas,
    };
};

//待发货加入待验货
export let UpdateSalesOrder5 = (Datas) => {
    return (dispatch) => {
        dispatch(UpdateSalesOrder5List(Datas));

    }
};
let UpdateSalesOrder5List = (Datas) => {
    return {
        type: Types.UpdateSalesOrder3,
        Datas,
    };
};

//下拉刷新订单列表1选中
export let UpdateSelectList1 = (Data) => {
    return (dispatch) => {
        dispatch(UpdateSellerSelectList1(Data));

    }
};
let UpdateSellerSelectList1 = (Data) => {
    return {
        type: Types.SellerSelectList1,
        Data,
    };
};

//下拉刷新订单列表7选中
export let UpdateSelectList7 = (Data) => {
    return (dispatch) => {
        dispatch(UpdateSellerSelectList7(Data));

    }
};
let UpdateSellerSelectList7 = (Data) => {
    return {
        type: Types.SellerSelectList7,
        Data,
    };
};

//确认收款
export function ActionConfirmReceive(salesOrderIds) {
    return (dispatch) => {
        dispatch({'type': Types.ConfirmReceiveStart});
        fetchConfirmReceive(salesOrderIds).then((ret) => {
            dispatch({'type': Types.ConfirmReceiveEnd, datas: ret.data, error: ret.error});
        }).catch((e) => {
            dispatch({'type': Types.ConfirmReceiveError, error: e});
        });
    }
}

//同意退款
export function ActionAgreeToRefund(serviceOrderIds, allAmounts, payType) {
    return (dispatch) => {
        dispatch({'type': Types.AgreeToRefundStart});
        fetchAgreeToRefund(serviceOrderIds, allAmounts, payType).then((ret) => {
            // 如果是支付宝支付那么就调用支付宝接口
            if (ret.data != null && ret.data.result > 0) {
                const {result, Msg} = ret.data;
                if (result == 3 && Msg.data) {
                    BCLAlipay(Msg.data, (code, message) => {
                        dispatch({
                            'type': Types.AgreeToRefundEnd,
                            datas: {code: code, time: new Date().getTime()},
                            message: message
                        });
                    })
                } else {
                    if(Msg.success==0){
                        dispatch({
                            'type': Types.AgreeToRefundEnd,
                            datas: {code: 1, time: new Date().getTime()},
                            message: "支付成功"
                        });
                    }else{
                        dispatch({
                            'type': Types.AgreeToRefundEnd,
                            datas: {code: 0, time: new Date().getTime(),message: Msg.message},
                            message: Msg.message
                        });
                    }

                }
            } else {
                dispatch({
                    'type': Types.AgreeToRefundEnd,
                    datas: {code: 0, time: new Date().getTime()},
                    message: ret.error
                });
            }

        }).catch((e) => {
            dispatch({'type': Types.AgreeToRefundError, error: e});
        });
    }
}

//拒绝退款
export function ActionRefusedToRefund(serviceOrderIds) {
    return (dispatch) => {
        dispatch({'type': Types.RefusedToRefundStart});
        fetchRefusedToRefund(serviceOrderIds).then((ret) => {
            dispatch({'type': Types.RefusedToRefundEnd, datas: ret.data, error: ret.error});
        }).catch((e) => {
            dispatch({'type': Types.RefusedToRefundError, error: e});
        });
    }
}