/**
 * Created by Administrator on 2017/5/8.
 */
import {request} from "../utils/RequestUtil";

const PurchaseMyAmountUrl = '/ReactCompany/GetAccountInfo';
const PurchaseSendCodeUrl = '/ReactWithdrawal/SendCode';
const PurchaseSetPayPasswordUrl = '/ReactWithdrawal/SetPayPassword';
const PurchaseAccountBankUrl = '/ReactWithdrawal/GetWithdrawAccountBank';
const PurchaseGetAccountInfoUrl = '/ReactCompany/GetAccountInfo';
const PurchaseWithdrawalAddUrl = '/ReactWithdrawal/WithdrawalAdd';
const fetchRechargeUrl = '/ApiAccount/InsertReCharge';
const SetPayPasswordUrl = '/ReactWithdrawal/SetPayPassword';
const UpdatePasswordUrl = '/ReactCompany/UpdatePassword';
const UpdateSginPasswordUrl = '/ReactCompany/UpdateSginPassword';
const GetCustomerUrl = '/ReactCompany/GetCustomer';
const GetSellInfoUrl = '/ReactCompany/GetSellInfo';
const GetCompanyImagesUrl = '/BclCompany/CompanyImages';
const EditCompanyDescriptionUrl = '/ReactCompany/EditCompanyDescription';
const EditCompanyNameUrl = '/ReactCompany/EditCompanyName';
const EditContactNameUrl = '/ReactCompany/EditContactName';
const EditSCompanyPhoneUrl = '/reactCompany/EditScompanyPhone';
const EditBCompanyPhoneUrl = '/reactCompany/EditBcompanyPhone';
const upImageUrl = '/ReactCompany/Authenticate';
const SetDeliverUrl = '/BclCompany/EditCompanyParameter';
const SBillsUrl = '/ReactCompany/SBills';
const SelectDelivery = '/BclCompany/CompanyParameter';
const SetReplenishUrl='/ReactCompany/SetReplenishDeliveryInfo';
const CheckPhoneUrl='/BclLogin/CheckPhone';  //判断手机号是否已经注册的


// 我的余额
export const fetchMyAmount = () => {
    return request(PurchaseMyAmountUrl)
};

//判断手机号是否已经注册的  未注册才能获取验证码
export const fetchCheckPhone = ({loginNo}) => {
    return request(CheckPhoneUrl, {loginNo})
}

//获取验证码
export const fetchSendCode = ({phone}) => {
    return request(PurchaseSendCodeUrl, {phone})
};

//返回验证码和设置密码
export const fetchSetPayPassword = ({code, payPassword}) => {
    return request(PurchaseSetPayPasswordUrl, {code, payPassword})
};

//提现返回现金
export const fetchAccountBank = ({amount}) => {
    return request(PurchaseAccountBankUrl, {amount})
};

//没有账号提现页面的可用余额
export const fetchAccountInfo = () => {
    return request(PurchaseGetAccountInfoUrl)
};

//充值
export const fetchRecharge = ({payType, amount}) => {
    return request(fetchRechargeUrl, {
        payType, amount
    })
};

//最终的确认提现
export const fetchWithdrawalAdd = ({accountType, withdrawAccount, withdrawName, withdrawBankName, openBankName, amount}) => {
    return request(PurchaseWithdrawalAddUrl, {
        accountType,
        withdrawAccount,
        withdrawName,
        withdrawBankName,
        openBankName,
        amount
    })
};

//返回验证码和修改支付密码
export const fetchUpdatePayPassword = ({code, payPassword}) => {
    return request(SetPayPasswordUrl, {code, payPassword})
};

//修改登录密码
export const fetchUpdatePassword = ({code, password}) => {
    return request(UpdatePasswordUrl, {code, password})
};

//修改验货密码
export const fetchUpdateSginPassword = ({code, signPassword}) => {
    return request(UpdateSginPasswordUrl, {code, signPassword})
};

//我的客户
export const fetchGetCustomer = () => {
    return request(GetCustomerUrl)
};

//卖家版店铺信息
export const fetchSellInfo = () => {
    return request(GetSellInfoUrl)
};

//卖家版照片
export const fetchCompanyImages = ({companyId}) => {
    return request(GetCompanyImagesUrl, {companyId})
};

//卖家版店铺简介
export const fetchCompanyDescription = ({companyDescription}) => {
    return request(EditCompanyDescriptionUrl, {companyDescription})
};

//卖家版修改店铺名称
export const fetchCompanyName = ({companyFullName}) => {
    return request(EditCompanyNameUrl, {companyFullName})
};

//卖家版修改联系人
export const fetchContactName = ({contactName}) => {
    return request(EditContactNameUrl, {contactName})
};

//卖家版修改联系电话
export const fetchContactPhone = ({phone, code}) => {
    return request(EditSCompanyPhoneUrl, {phone, code})
};


//买家版修改联系电话
export const fetchBContactPhone = ({phone, code}) => {
    return request(EditBCompanyPhoneUrl, {phone, code})
};

//卖家版配送费设置
export const fetchSetDeliver = ({CompanyID,FreeDistance,StartPrice,StartQuantity,DeliveryAmount,ReplenishStartPrice,ReplenishDeliveryAmount,ReplenishStartQuantity,ReplenishDistance,ReplenishAddRate,}) => {
    return request(SetDeliverUrl, {
        CompanyID,
        FreeDistance,
        StartPrice,
        StartQuantity,
        DeliveryAmount,
        ReplenishStartPrice,
        ReplenishDeliveryAmount,
        ReplenishStartQuantity,
        ReplenishDistance,
        ReplenishAddRate,
    })
};

//卖家版配送费请求
export const fetchDelivery = (companyId) => {
    return request(SelectDelivery, {companyId})
};

//卖家账单
export const fetchSSBills = ({p, date}) => {
    return request(SBillsUrl, {p: p, date: date})
};

//卖家补货配送费
export const fetchSetReplenish = ({companyId, ReplenishStartPrice, ReplenishDeliveryAmount, ReplenishStartQuantity, ReplenishDistance, ReplenishAddRate}) => {
    return request(SetReplenishUrl, {
        companyId,
        ReplenishStartPrice,
        ReplenishDeliveryAmount,
        ReplenishStartQuantity,
        ReplenishDistance,
        ReplenishAddRate
    })
};