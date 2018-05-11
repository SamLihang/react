/**
 * Created by Administrator on 2017/5/25.
 */
import * as Types from "./Types";
import {fetchCustomer, fetchGetSalesOrderSettle,fetchOrderSettleList,fetchOrderSettleListDetail} from "../services/ShopDetailServices";


//店铺详情
export function ActionCustomer({bCompanyId:bCompanyId}) {
    return (dispatch) => {
        dispatch({'type': Types.RequestCustomerStart});
        fetchCustomer({bCompanyId:bCompanyId}).then((ret) => {
            dispatch({'type': Types.RequestCustomerEnd, datas: ret.data, error: ret.error});
        }).catch((e) => {
            dispatch({'type': Types.RequestCustomerError, error: e});
        });
    }
}

//账款管理
export function ActionGetSalesOrderSettle() {
    return (dispatch) => {
        dispatch({'type': Types.RequestGetSalesOrderSettleStart});
        fetchGetSalesOrderSettle().then((ret) => {
            dispatch({'type': Types.RequestGetSalesOrderSettleEnd, datas: ret.data, error: ret.error});
        }).catch((e) => {
            dispatch({'type': Types.RequestGetSalesOrderSettleError, error: e});
        });
    }
}
//结算列表
export function ActionOrderSettleList(bCompanyId,p) {
    return (dispatch) => {
        dispatch({'type': Types.RequestOrderSettleListStart});
        fetchOrderSettleList(bCompanyId,p).then((ret) => {
            dispatch({'type': Types.RequestOrderSettleListEnd, datas: ret.data, error: ret.error});
        }).catch((e) => {
            dispatch({'type': Types.RequestOrderSettleListError, error: e});
        });
    }
}

//账期详情
export function ActionOrderSettleListDetail(salesOrderSettleId) {
    return (dispatch) => {
        dispatch({'type': Types.RequestOrderSettleListDetailStart});
        fetchOrderSettleListDetail(salesOrderSettleId).then((ret) => {
            dispatch({'type': Types.RequestOrderSettleListDetailEnd, datas: ret.data, error: ret.error});
        }).catch((e) => {
            dispatch({'type': Types.RequestOrderSettleListDetailError, error: e});
        });
    }
}
