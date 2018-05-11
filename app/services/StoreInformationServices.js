/**
 * Created by sencha on 2017/4/7.
 */
import {request} from '../utils/RequestUtil';
const StoreInformationUrl = '/ReactCompany/GetBuyInfo';
const StoreNameUrl = '/ReactCompany/EditCompanyName';
const StoreIntroductionUrl = '/ReactCompany/EditCompanyDescription';
const UpdateContactUrl = '/ReactCompany/EditContactName';
//店铺电话修改,参数 phone
const PhoneUrl = '/ReactCompany/EditCompanyPhone';

export const fetchStoreInformation = () => {
    return request(StoreInformationUrl, )
};
//修改店铺名称
export const fetchStoreName = ({companyFullName}) => {
    return request(StoreNameUrl, {companyFullName})
};
//修改店铺描述
export const fetchStoreIntroduction = ({companyDescription}) => {
    return request(StoreIntroductionUrl, {companyDescription})
};
//修改店铺联系人
export const fetchUpdateContact = ({contactName}) => {
    return request(UpdateContactUrl, {contactName})
};
