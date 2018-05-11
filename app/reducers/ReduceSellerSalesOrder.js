/**
 * Created by Administrator on 2017/5/19.
 */
import * as Types from '../actions/Types';

import {REHYDRATE} from 'redux-persist/constants'

const initialSellerSalesOrder1 = {};
const initialSellerSalesOrder3 = {};
const initialSellerSalesOrder5 = {};
const initialSellerSalesOrder7 = {};
const initialAcceptSalesOrder = {};
const initialDeliverySalesOrder = {};
const initialAgreeToRefund = {};
const initialRefusedToRefund = {};

//订单详情
const initialSalesOrderDetail = {};

//确认收款
const initialConfirmReceive = {};

export function ReduceSellerSalesOrder1(state = initialSellerSalesOrder1, action) {
    switch (action.type) {
        case REHYDRATE:
            //var incoming = action.payload.ReducePurchaseOrder;
            //if (incoming) return {...state, ...incoming}
            return state;
        case Types.RequestSellerSalesOrder1Start:
            return {
                ...state
            };
        case Types.RequestSellerSalesOrder1End:
            return {
                ...state,
                datas: action.data
            }
        case Types.RequestSellerSalesOrder1Error:
            return {
                ...state
            };
        //更新列表选中是否
        case Types.SellerSelectList1:
            state.datas.map((company, index) => {
                action.Data.map((obj, c) => {
                    if (company.SalesOrderId === obj.SalesOrderId) {
                        company.IsSelect = true;
                    }
                });
            });
            return Object.assign({}, state, {
                datas: state.datas,
            });
        default:
            return state;
    }
}

export function ReduceSellerSalesOrder3(state = initialSellerSalesOrder3, action) {
    switch (action.type) {
        case REHYDRATE:
            //var incoming = action.payload.ReducePurchaseOrder;
            //if (incoming) return {...state, ...incoming}
            return state;
        case Types.RequestSellerSalesOrder3Start:
            return {
                ...state
            };
        case Types.RequestSellerSalesOrder3End:
            return {
                ...state,
                datas: action.data
            }
        case Types.RequestSellerSalesOrder3Error:
            return {
                ...state
            };

        //更新待发货
        case Types.UpdateSalesOrder1:
            if (action.Datas.length > 0) {
                /* action.Datas.map((item, index) => {
                     state.datas.unshift(item);
                 });*/
            }
            return Object.assign({}, state, {
                datas: state.datas,
            });
        default:
            return state;
    }
}

export function ReduceSellerSalesOrder5(state = initialSellerSalesOrder5, action) {
    switch (action.type) {
        case REHYDRATE:
            //var incoming = action.payload.ReducePurchaseOrder;
            //if (incoming) return {...state, ...incoming}
            return state;
        case Types.RequestSellerSalesOrder5Start:
            return {
                ...state
            };
        case Types.RequestSellerSalesOrder5End:
            return {
                ...state,
                datas: action.data
            }
        case Types.RequestSellerSalesOrder5Error:
            return {
                ...state
            };
        //更新待发货
        case Types.UpdateSalesOrder3:
            if (action.Datas.length > 0) {
                action.Datas.map((item, index) => {
                    state.datas.push(item);
                });
            }
            return Object.assign({}, state, {
                datas: state.datas,
            });
        default:
            return state;
    }
}

export function ReduceSellerSalesOrder7(state = initialSellerSalesOrder7, action) {
    switch (action.type) {
        case REHYDRATE:
            //var incoming = action.payload.ReducePurchaseOrder;
            //if (incoming) return {...state, ...incoming}
            return state;
        case Types.RequestSellerSalesOrder7Start:
            return {
                ...state
            };
        case Types.RequestSellerSalesOrder7End:
            return {
                ...state,
                datas: action.data
            }
        case Types.RequestSellerSalesOrder7Error:
            return {
                ...state
            };
        //更新列表选中是否
        case Types.SellerSelectList7:
            state.datas.map((company, index) => {
                action.Data.map((obj, c) => {
                    if (company.SalesOrderId === obj.SalesOrderId) {
                        company.IsSelect = true;
                    }
                });
            });
            return Object.assign({}, state, {
                datas: state.datas,
            });
        default:
            return state;
    }
}

//接单
export function ReduceAcceptSalesOrder(state = initialAcceptSalesOrder, action) {
    switch (action.type) {
        case Types.RequestAcceptSalesOrderStart:
            return {
                ...state
            };
        case Types.RequestAcceptSalesOrderEnd:
            return {
                ...state,
                datas: action.datas,
                error: action.error
            }
        case Types.RequestAcceptSalesOrderError:

            return {
                ...state
            };
        default:
            return state;
    }
}

//发货
export function ReduceDeliverySalesOrder(state = initialDeliverySalesOrder, action) {
    switch (action.type) {
        case Types.RequestDeliverySalesOrderStart:
            return {
                ...state
            };
        case Types.RequestDeliverySalesOrderEnd:
            return {
                ...state,
                datas: action.datas,
                error: action.error
            }
        case Types.RequestDeliverySalesOrderError:

            return {
                ...state
            };
        default:
            return state;
    }
}

//订单详情
export function ReduceSalesOrderDetail(state = initialSalesOrderDetail, action) {
    switch (action.type) {
        case Types.RequestSalesOrderDetailStart:
            return {
                ...state
            };
        case Types.RequestSalesOrderDetailEnd:
            return {
                ...state,
                datas: action.datas,
                error: action.error
            }
        case Types.RequestSalesOrderDetailError:

            return {
                ...state
            };
        default:
            return state;
    }
}

//商品详情
const initialProductDetail = {};

export function ReduceSellerProductDetail(state = initialProductDetail, action) {
    switch (action.type) {
        case Types.RequestSellerProductStart:
            return {
                ...state
            };
        case Types.RequestSellerProductEnd:
            return {
                ...state,
                datas: action.datas,
                error: action.error
            }
        case Types.RequestSellerProductError:

            return {
                ...state
            };
        default:
            return state;
    }
}

//确认收款
export function ReduceConfirmReceive(state = initialConfirmReceive, action) {
    switch (action.type) {
        case Types.ConfirmReceiveStart:
            return {
                ...state
            };
        case Types.ConfirmReceiveEnd:
            return {
                ...state,
                datas: action.datas,
                error: action.error
            }
        case Types.ConfirmReceiveError:

            return {
                ...state
            };
        default:
            return state;
    }
}

//同意退款
export function ReduceAgreeToRefund(state = initialAgreeToRefund, action) {
    switch (action.type) {
        case Types.AgreeToRefundStart:
            return {
                ...state
            };
        case Types.AgreeToRefundEnd:
            return {
                ...state,
                datas: action.datas,
                error: action.error
            }
        case Types.AgreeToRefundError:
            return {
                ...state
            };
        default:
            return state;
    }
}

//拒绝退款
export function ReduceRefusedToRefund(state = initialRefusedToRefund, action) {
    switch (action.type) {
        case Types.RefusedToRefundStart:
            return {
                ...state
            };
        case Types.RefusedToRefundEnd:
            return {
                ...state,
                datas: action.datas,
                error: action.error
            }
        case Types.RefusedToRefundError:
            return {
                ...state
            };
        default:
            return state;
    }
}