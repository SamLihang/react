/**
 * Created by sencha on 2017/4/7.
 */
import {request} from '../utils/RequestUtil';

const AccountUrl = '/ReactPurchaseOrderSettle/PurchaseOrderSettlesBuy';
const SettlementListUrl = '/ReactPurchaseOrderSettle/PurchaseOrderSettlesList';
const AccountDetailUrl = '/ReactPurchaseOrderSettle/PurchaseOrderSettlesDetail';
const BBillsUrl = '/ReactCompany/BBillsNew';
const UpDateOrderOfflinePayUrl = '/PurchaseOrder/UpdatePurchaseOrderOfflinePayCategory'; //现金+支票

const UpDateOrderOfflinePaySellUrl = '/PurchaseOrder/UpdateSellOrderOfflinePayCategory '; //卖家确认收款

//账期支付
const SettleAccountsUrl = '/ReactPurchaseOrderSettle/SettleAccounts';

export const fetchAccount = () => {
    return request(AccountUrl,)
};
export const fetchSettlementList = ({SCompanyId}) => {
    return request(SettlementListUrl, {SCompanyId})
};

export const fetchAccountDetail = ({PurchaseOrderSettleId}) => {
    return request(AccountDetailUrl, {PurchaseOrderSettleId})
};

//账期支付
export const fetchSettleAccountPays = ({purchaseOrderSettleId, purchaseOrderIds, payType, amount}) => {
    return request(SettleAccountsUrl, {
        purchaseOrderSettleId: purchaseOrderSettleId,
        purchaseOrderIds: purchaseOrderIds,
        payType: payType,
        amount: amount
    })
};

//账单
export const fetchBBillsUrl = ({p, date}) => {
    return request(BBillsUrl, {p: p, date: date})
};
//账期支付（现金+支票）
export const fetchUpDateOrderOfflinePay = ({purchaseOrderSettleId, purchaseOrderIds, payType, amount}) => {
    return request(UpDateOrderOfflinePayUrl, {
        purchaseOrderSettleId: purchaseOrderSettleId,
        purchaseOrderIds: purchaseOrderIds,
        payType: payType,
        amount: amount
    })
};

//卖家确认收款（现金+支票）
export const fetchUpDateOrderOfflineSellPay = ({salesOrderSettleId, salesOrderId, payType, amount}) => {
    return request(UpDateOrderOfflinePaySellUrl, {
        salesOrderSettleId: salesOrderSettleId,
        salesOrderId: salesOrderId,
        payType: payType,
        amount: amount
    })
};