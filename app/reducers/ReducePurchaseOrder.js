/**
 * Created by Administrator on 2017/4/18.
 */
import * as Types from "../actions/Types";

import {REHYDRATE} from "redux-persist/constants";

const initialPurchaseOrder1 = {
    PurchaseOrderID: 0,    //单个商品ID
    isOpen: false,         //展开查看详情
};
const initialPurchaseOrderType3 = {
    PurchaseOrderID: 0,    //单个商品ID
    isOpen: false,         //展开查看详情
};
const initialPurchaseOrderType4 = {
    PurchaseOrderID: 0,    //单个商品ID
    isOpen: false,         //展开查看详情
};
const initialPurchaseOrderType5 = {
    PurchaseOrderID: 0,    //单个商品ID
    isOpen: false,         //展开查看详情
};
const initialPurchaseOrderType7 = {
    //全选的状态
    isSelectAll: false,
    //单选一个
    isSelectOne: false,
    //单个商品ID
    PurchaseOrderID: 0,
    //已选择的商品数组
    selectPurchaseOrders7Arr: [],
    //所有商品数组
    allPurchaseOrders7Arr: [],
    //展开查看详情
    isOpen: false,
};
//订单详情
const initialPurchaseOrderDetail = {};

//确认订单
const initialPurchaseOrderConfirm = {};

//支付成功
const initialPurchasePaysuccess = {};

//取消订单
const initialCancelPurchaseOrder = {};
//快速签收（待验货）
const initialQuickSignPurchaseOrder = {};
//快速签收（待验货）
const initialDetailsInspectionPurchaseOrder = {};
//打印（已完成）
const initialPrintPurchaseOrder = {};
//去支付
const initialToPayPurchaseOrder = {};
//确认付款
const initialActionConfirmPay = {};

const initialGetServiceorderdetail = {};


export function ReducePurchaseOrders1(state = initialPurchaseOrder1, action) {
    switch (action.type) {
        case REHYDRATE:
            //var incoming = action.payload.ReducePurchaseOrder;
            //if (incoming) return {...state, ...incoming}
            return state;
        case Types.RequestPurchaseOrders1Start:
            return {
                ...state
            };
        case Types.RequestPurchaseOrders1End:
            return {
                ...state,
                datas: action.data
            }
        case Types.RequestPurchaseOrders1Error:
            return {
                ...state
            };
        //展开查看全部详情
        case Types.PurchaseOrders1OpenDetail:
            state.datas.map((object, i) => {
                if (object.PurchaseOrderId === action.PurchaseOrderID) {
                    object.IsOpen = action.isOpen;
                }
            });
            return Object.assign({}, state, {
                datas: state.datas,
                isOpen: action.isOpen,
            });
        default:
            return state;
    }

}

export function ReducePurchaseOrders3(state = initialPurchaseOrderType3, action) {
    switch (action.type) {
        case REHYDRATE:
            //var incoming = action.payload.ReducePurchaseOrder;
            //if (incoming) return {...state, ...incoming}
            return state;
        case Types.RequestPurchaseOrders3Start:
            return {
                ...state
            };
        case Types.RequestPurchaseOrders3End:
            return {
                ...state,
                datas: action.data
            }
        case Types.RequestPurchaseOrders3Error:
            return {
                ...state
            };
        //展开查看全部详情
        case Types.PurchaseOrders3OpenDetail:
            state.datas.map((object, i) => {
                if (object.PurchaseOrderId === action.PurchaseOrderID) {
                    object.IsOpen = action.isOpen;
                }
            });
            return Object.assign({}, state, {
                datas: state.datas,
                isOpen: action.isOpen,
            });
        //更新买家待接单
        case Types.UpdatePurchaseOrders3:
            state.datas.map((object, i) => {
                if (object.PurchaseOrderId === action.PurchaseOrderID) {
                    //object.IsOpen = action.isOpen;
                }
            });
            return Object.assign({}, state, {
                datas: state.datas,
            });

        default:
            return state;
    }

}

export function ReducePurchaseOrders4(state = initialPurchaseOrderType4, action) {
    switch (action.type) {
        case REHYDRATE:
            //var incoming = action.payload.ReducePurchaseOrder;
            //if (incoming) return {...state, ...incoming}
            return state;
        case Types.RequestPurchaseOrders4Start:
            return {
                ...state
            };
        case Types.RequestPurchaseOrders4End:
            return {
                ...state,
                datas: action.data
            }
        case Types.RequestPurchaseOrders4Error:
            return {
                ...state
            };
        //展开查看全部详情
        case Types.PurchaseOrders3OpenDetail:
            state.datas.map((object, i) => {
                if (object.PurchaseOrderId === action.PurchaseOrderID) {
                    object.IsOpen = action.isOpen;
                }
            });
            return Object.assign({}, state, {
                datas: state.datas,
                isOpen: action.isOpen,
            });
        default:
            return state;
    }

}

export function ReducePurchaseOrders5(state = initialPurchaseOrderType5, action) {
    switch (action.type) {
        case REHYDRATE:
            //var incoming = action.payload.ReducePurchaseOrder;
            //if (incoming) return {...state, ...incoming}
            return state;
        case Types.RequestPurchaseOrders5Start:
            return {
                ...state
            };
        case Types.RequestPurchaseOrders5End:
            return {
                ...state,
                datas: action.data
            }
        case Types.RequestPurchaseOrders5Error:
            return {
                ...state
            };
        //展开查看全部详情
        case Types.PurchaseOrders5OpenDetail:
            state.datas.map((object, i) => {
                if (object.PurchaseOrderId === action.PurchaseOrderID) {
                    object.IsOpen = action.isOpen;
                }
            });
            return Object.assign({}, state, {
                datas: state.datas,
                isOpen: action.isOpen,
            });
        //签收返回涮新页面
        case Types.PurchaseOrders5Sign:
            state.datas.map((object, i) => {
                if (object.PurchaseOrderId === action.PurchaseOrderId) {
                    state.datas.slice(i, 1)
                }
            });
            return Object.assign({}, state, {
                datas: state.datas,
            });

        default:
            return state;
    }

}

export function ReducePurchaseOrders7(state = initialPurchaseOrderType7, action) {
    switch (action.type) {
        case REHYDRATE:
            //var incoming = action.payload.ReducePurchaseOrder;
            //if (incoming) return {...state, ...incoming}
            return state;
        case Types.RequestPurchaseOrders7Start:
            return {
                ...state
            };
        case Types.RequestPurchaseOrders7End:
            action.data.map((object, i) => {
                state.allPurchaseOrders7Arr.push(object);
                //state.selectPurchaseOrders7Arr.push(object);
            });
            return Object.assign({}, state, {
                datas: action.data,
                isSelectAll: false,

            })
        case Types.RequestPurchaseOrders7Error:
            return {
                ...state
            };
        //全选全部
        case Types.PurchaseOrders7SelectAll_List:
            state.selectPurchaseOrders7Arr = [];
            state.datas.forEach(function (object) {
                object.IsSelect = action.isSelectAll;
                if (action.isSelectAll === true) {
                    state.selectPurchaseOrders7Arr.push(object);

                } else if (action.isSelectAll === false) {
                    state.selectPurchaseOrders7Arr.pop(object);
                }
            }, this);
            return Object.assign({}, state, {
                datas: state.datas,
                isSelectAll: action.isSelectAll,
                isSelectOne: action.isSelectAll,
            });
        //单选一个
        case Types.PurchaseOrders7SelectOne_List:
            state.datas.map((object, i) => {
                if (object.PurchaseOrderId == action.PurchaseOrderID) {
                    object.IsSelect = action.isSelectOne;
                }
                // console.log(state.selectPurchaseOrders7Arr.indexOf(object))
                if (action.isSelectOne === true) {
                    if (object.PurchaseOrderId === action.PurchaseOrderID) {
                        state.selectPurchaseOrders7Arr.push(object);
                    }
                } else {
                    if (object.PurchaseOrderId === action.PurchaseOrderID) {
                        state.selectPurchaseOrders7Arr.splice(state.selectPurchaseOrders7Arr.indexOf(object), 1)
                    }
                }
                state.isSelectAll = state.allPurchaseOrders7Arr.length == state.selectPurchaseOrders7Arr.length;
            });
            return Object.assign({}, state, {
                datas: state.datas,
                isSelectAll: state.isSelectAll,
                isSelectOne: action.isSelectOne,
            });
        //展开查看全部详情
        case Types.PurchaseOrders7OpenDetail:
            state.datas.map((object, i) => {
                if (object.PurchaseOrderId === action.PurchaseOrderID) {
                    object.IsOpen = action.isOpen;
                }
            });
            return Object.assign({}, state, {
                datas: state.datas,
                isOpen: action.isOpen,
            });

        default:
            return state;
    }

}

//买家订单详情
export function ReducePurchaseOrderDetail(state = initialPurchaseOrderDetail, action) {
    switch (action.type) {
        case REHYDRATE:
            //var incoming = action.payload.ReducePurchaseOrderDetail;
            //if (incoming) return {...state, ...incoming}
            return state;
        case Types.RequestPurchaseOrderDetailStart:
            return {
                ...state
            };
        case Types.RequestPurchaseOrderDetailEnd:
            return {
                ...state,
                datas: action.data
            }
        case Types.RequestPurchaseOrderDetailError:
            return {
                ...state
            };
        //展开查看全部详情
        case Types.OpenPurchaseOrderDetail:
            if (state.datas) {
                let object = state.datas;
                if (object.BCompanyId === action.CompanyId) {
                    object.IsOpen = action.isOpen;
                }
            }
            return Object.assign({}, state, {
                datas: state.datas,
                isOpen: action.isOpen,
            });
        default:
            return state;
    }

}

//买家订单详情支付
export function ReduceSettleAccount(state = {}, action) {
    switch (action.type) {
        case Types.RequestSettleAccountStart:
            return {
                ...state
            };
        case Types.RequestSettleAccountEnd:
            return {
                ...state,
                datas: action.data,
                error: action.message
            };
        case Types.RequestSettleAccountError:
            return {
                ...state
            };
        default:
            return state;
    }

}

//确认订单
export function ReducePurchaseOrderConfirm(state = initialPurchaseOrderConfirm, action) {
    switch (action.type) {
        case REHYDRATE:
            //var incoming = action.payload.ReducePurchaseOrderConfirm;
            //if (incoming) return {...state, ...incoming}
            return state;
        case Types.RequestPurchaseOrderConfirmStart:
            return {
                ...state
            };
        case Types.RequestPurchaseOrderConfirmEnd:
            return {
                ...state,
                datas: action.data
            }
        case Types.RequestPurchaseOrderConfirmError:
            return {
                ...state
            }
        default:
            return state;
    }

}

//去结算
export function ReduceSettleAccounts(state = {}, action) {
    switch (action.type) {
        case Types.RequestSettleAccountsStart:
            return {
                ...state
            };
        case Types.RequestSettleAccountsEnd:
            return {
                ...state,
                datas: action.data,
                error: action.error,
                message: action.message
            };
        case Types.RequestSettleAccountsError:
            return {
                ...state
            };
        default:
            return state;
    }

}

//支付成功
export function ReducePurchasePaySuccess(state = initialPurchasePaysuccess, action) {
    switch (action.type) {
        case REHYDRATE:
            var incoming = action.payload.ReducePurchasePaySuccess;
            if (incoming) return {...state, ...incoming}
            return state;
        case Types.RequestPurchasePaySuccessStart:
            return {
                ...state
            };
        case Types.RequestPurchasePaySuccessEnd:
            return {
                ...state,
                datas: action.data
            }
        case Types.RequestPurchasePaySuccessError:
            return {
                ...state
            };
        default:
            return state;
    }

}

//去支付
export function ReduceToPayPurchaseOrder(state = initialToPayPurchaseOrder, action) {
    switch (action.type) {
        case Types.RequestToPayPurchaseOrderStart:
            return {
                ...state
            };
        case Types.RequestToPayPurchaseOrderEnd:
            return {
                ...state,
                datas: action.datas,
                error: action.error
            }
        case Types.RequestToPayPurchaseOrderError:

            return {
                ...state
            };
        default:
            return state;
    }
}

//取消订单
export function ReduceCancelPurchaseOrder(state = initialCancelPurchaseOrder, action) {
    switch (action.type) {
        case Types.RequestCancelPurchaseOrderStart:
            return {
                ...state
            };
        case Types.RequestCancelPurchaseOrderEnd:
            return {
                ...state,
                datas: action.datas,
                error: action.error
            }
        case Types.RequestCancelPurchaseOrderError:

            return {
                ...state
            };
        default:
            return state;
    }
}

//快速签收（待验货）
export function ReduceQuickSignPurchaseOrder(state = initialQuickSignPurchaseOrder, action) {
    switch (action.type) {
        case Types.RequestQuickSignPurchaseOrderStart:
            return {
                ...state
            };
        case Types.RequestQuickSignPurchaseOrderEnd:
            return {
                ...state,
                datas: action.datas,
                error: action.error
            }
        case Types.RequestQuickSignPurchaseOrderError:

            return {
                ...state
            };
        default:
            return state;
    }
}

//详情验货（待验货）
export function ReduceDetailsInspectionPurchaseOrder(state = initialDetailsInspectionPurchaseOrder, action) {
    switch (action.type) {
        case Types.RequestDetailsInspectionPurchaseOrderStart:
            return {
                ...state
            };
        case Types.RequestDetailsInspectionPurchaseOrderEnd:
            return {
                ...state,
                datas: action.datas,
                error: action.error
            }
        case Types.RequestDetailsInspectionPurchaseOrderError:

            return {
                ...state
            };
        default:
            return state;
    }
}

//打印（已完成）
export function ReducePrintPurchaseOrder(state = initialPrintPurchaseOrder, action) {
    switch (action.type) {
        case Types.RequestPrintPurchaseOrderStart:
            return {
                ...state
            };
        case Types.RequestPrintPurchaseOrderEnd:
            return {
                ...state,
                datas: action.datas,
                error: action.error
            }
        case Types.RequestPrintPurchaseOrderError:

            return {
                ...state
            };
        default:
            return state;
    }
}


//验证支付密码是否正确
const initialCheckPayPassword = {};

export function ReduceCheckPayPassword(state = initialCheckPayPassword, action) {
    switch (action.type) {
        case Types.RequestCheckPayPasswordStart:
            return {
                ...state
            };
        case Types.RequestCheckPayPasswordEnd:
            return {
                ...state,
                datas: action.data,
                error: action.error
            }
        case Types.RequestCheckPayPasswordError:
            return {
                ...state
            }
        default:
            return state;
    }

}

//确认付款
export function ReduceConfirmPay(state = initialActionConfirmPay, action) {
    switch (action.type) {
        case Types.ConfirmPayStart:
            return {
                ...state
            };
        case Types.ConfirmPaysEnd:
            return {
                ...state,
                datas: action.data,
                error: action.error
            };
        case Types.ConfirmPayError:
            return {
                ...state
            }
        default:
            return state;
    }

}

//售后详情
export function ReduceGetServiceorderdetail(state = initialGetServiceorderdetail, action) {
    switch (action.type) {
        case Types.RequestGetServiceorderdetailStart:
            return {
                ...state
            };
        case Types.RequestGetServiceorderdetailEnd:
            return {
                ...state,
                datas: action.data,
                error: action.error
            };
        case Types.RequestGetServiceorderdetailError:
            return {
                ...state
            }
        default:
            return state;
    }

}