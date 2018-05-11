/**
 * Created by Administrator on 2017/4/18.
 */
import {request} from '../utils/RequestUtil';

const PurchaseOrderUrl = '/ReactBuyerPurchaseOrder2/PurchaseOrders';
const PurchaseOrderDetailUrl = '/ReactBuyerPurchaseOrder2/PurchaseOrder';
const PurchaseOrderConfirmUrl = '/BclShoppingCart/ConfirmOrder2';
const SettleAccountsUrl = '/BclShoppingCart/SettleAccounts';  //购物车下订单接口


const PaySuccessUrl = '/ReactPurchaseOrderAddress/GetBuyReceiveAddres';


const CancelPurchaseOrderUrl = '/ReactBuyerPurchaseOrder2/CanclePurchaseOrder';
const QuickSignPurchaseOrderUrl = '/ReactBuyerPurchaseOrder2/QuickSignPurchaseOrder';
const DetailsInspectionPurchaseOrderUrl = '/ReactBuyerPurchaseOrder2/SignPurchaseOrder';
const PrintPurchaseOrderUrl = '/ReactBuyerPurchaseOrder2/PrintPurchaseOrder';
const ToPayPurchaseOrderUrl = '/ReactBuyerPurchaseOrder2/ToPayPurchaseOrder';
const CheckPayPasswordUrl = '/ReactShoppingCart2/CheckPayPassword';
const CheckSignPasswordUrl = '/ReactBuyerPurchaseOrder2/CheckSignPassword';
const ConfirmPayUrl = '/ReactBuyerPurchaseOrder2/ConfirmPay';


const PayTypeUrl = '/ReactCompany/GetProvider';
const ApplyServiceUrl = '/ReactServiceorder/addServiceorder';
const UploadImagesUrl = '/ReactCommon/CommonUploadImages';
const GetServiceorderdetailUrl = '/ReactServiceorder/GetServiceorderdetail';


//买家订单详情支付接口
const SettleAmountUrl = '/ReactBuyerPurchaseOrder/SettleAmount';


export const fetchPurchaseOrders = ({p, t}) => {
    return request(PurchaseOrderUrl, {p: p, t: t})
};

//买家订单详情
export const fetchPurchaseOrderDetail = ({purchaseOrderId}) => {
    return request(PurchaseOrderDetailUrl, {
        purchaseOrderId: purchaseOrderId
    })
};

//买家订单详情支付
export const fetchSettleAmount = (purchaseOrderId, payType) => {
    return request(SettleAmountUrl, {
        purchaseOrderId: purchaseOrderId,
        payType: payType,
    })
};


export const fetchPurchaseOrderConfirm = ({shoppingCartIds}) => {
    return request(PurchaseOrderConfirmUrl, {
        shoppingCartIds: shoppingCartIds
    })
};


export const fetchSettleAccounts = (addressId, shoppingCartIds, payTypes, purchaseOrderMessageStrs) => {
    return request(SettleAccountsUrl, {
        addressId: addressId,
        shoppingCartIds: shoppingCartIds,
        payTypes: payTypes,
        purchaseOrderMessageStrs: purchaseOrderMessageStrs
    })
};

export const fetchPaySuccess = ({addressId}) => {
    return request(PaySuccessUrl, {
        addressId: addressId
    })
};

//去支付
export const fetchToPayPurchaseOrder = (purchaseOrderId) => {
    return request(ToPayPurchaseOrderUrl, {
        purchaseOrderId: purchaseOrderId
    })
};

//取消订单
export const fetchCancelPurchaseOrder = (purchaseOrderId) => {
    return request(CancelPurchaseOrderUrl, {
        purchaseOrderId: purchaseOrderId
    })
};

//快速签收（待验货）
export const fetchQuickSignPurchaseOrder = (purchaseOrderId) => {
    return request(QuickSignPurchaseOrderUrl, {
        purchaseOrderId: purchaseOrderId
    })
};

//详情验货（待验货）
export const fetchDetailsInspectionPurchaseOrder = (purchaseOrderStr) => {
    return request(DetailsInspectionPurchaseOrderUrl, {
        purchaseOrderStr: purchaseOrderStr
    })
};
//打印（已完成）
export const fetchPrintPurchaseOrder = ({purchaseOrderIds}) => {
    return request(PrintPurchaseOrderUrl, {
        purchaseOrderIds: purchaseOrderIds
    })
};

//验证支付密码是否正确
export const fetchCheckPayPassword = ({password}) => {
    return request(CheckPayPasswordUrl, {password})
};

//验证验货密码是否正确
export const fetchCheckSignPassword = ({password}) => {
    return request(CheckSignPasswordUrl, {password})
};
//货到付款的确认付款
export const fetchConfirmPayUrl = ({purchaseOrderId}) => {
    return request(ConfirmPayUrl, {purchaseOrderId})
};

//确认页面判断支付类型
export const fetchConfirmPay = ({BCompanyId, SCompanyId}) => {
    return request(PayTypeUrl, {BCompanyId, SCompanyId})
};

//申请售后
export const fetchApplyService = (data) => {
    return request(ApplyServiceUrl, data)
};

//售后详情
export const fetchGetServiceorderdetail = (data) => {
    return request(GetServiceorderdetailUrl, data)
};