/**
 * Created by sencha on 2017/4/7.
 */
import {request} from '../utils/RequestUtil';
const loginUrl='/ApiLogin/Login';
const validityCodeUrl='/BclLogin/ValidityCode';
const registUrl='/BclLogin/Regist';
const forgetPasswordUrl='/ApiLogin/ForgetPassword';


//登陆
export const fetchLogin=({loginNo,password})=>{
    return request(loginUrl,{
        loginNo: loginNo,
        password: password
    })
};
//判断验证码
export const fetchValidityCode=({loginNo,code})=>{
    return request(validityCodeUrl,{
        loginNo: loginNo,
        code: code
    })
};
//注册
export const fetchRegist=({loginNo,password,payPassword,smsCode,address,X,Y,contactName,companyFullName,companyTypeId})=>{
    return request(registUrl,{
        loginNo:loginNo,
        password:password,
        payPassword:payPassword,
        address:address,
        smsCode:smsCode,
        X:X,
        Y:Y,
        contactName:contactName,
        companyFullName:companyFullName,
        companyTypeId:companyTypeId,
    })
};

//忘记密码
export const fetchForgetPassword=({loginNo,newPassword})=>{
    return request(forgetPasswordUrl,{loginNo, newPassword})
};
