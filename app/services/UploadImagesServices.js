/**
 * Created by Administrator on 2017/7/1.
 */
import {request} from '../utils/RequestUtil';
const UploadImageUrl = '/ReactCompany/Authenticate';
const loadUploadImageUrl = '/ReactCompany/LoadAuthenticate';
const loadUploadLogoUrl = '/ReactCompany/UpdateLogo';
const UploadCertificateUrl  = '/BclCompany/UploadCertificate';
export const fetchUploadImages = (list1,list2,list3) => {
    return request(UploadImageUrl,list1,list2,list3)
};
export const fetchLoadUploadImages = () => { 
    return request(loadUploadImageUrl)
};
export const fetchLoadUploadLogo = (list1) => {
    return request(loadUploadLogoUrl,list1)
};
export const fetchUploadCertificate = (path) => {
    return request(UploadCertificateUrl,path)
};
/*
export const fetchSettlementList = ({SCompanyId}) => {
    return request(SettlementListUrl, {SCompanyId})
};*/
