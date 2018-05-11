/**
 * Created by sencha on 2017/4/11.
 */
import {toastShort} from "../utils/ToastUtil";
import * as Types from "./Types";
import {fetchForgetPassword, fetchLogin, fetchRegist} from "../services/EmployeeServices";

let CurrentEmployee = {
    'Token': '',
    'LoginNo': null,//登陆账号
    'EmployeeName': '',//员工姓名
    'CompanyId': 0,//公司Id
    'LogoImage': '',
    'CompanyTypeId': '',
    'IsAudit': false//是否已审核
};

//登陆
export function ActionLogIn({loginNo, password}) {
    return (dispatch) => {
        dispatch({'type': Types.LoggerDoing});
        fetchLogin({loginNo, password}).then((ret) => {
            if (ret.data) {
                dispatch({'type': Types.LoggedIn, data: ret.data, error: ret.error});
            }
            else if (ret.error) {
                dispatch({'type': Types.LoggerError, error: ret.error});
            }
            //dispatch({'type': Types.LoggedIn, data: ret.data, error: ret.error});
        }).catch((e) => {
            //toastShort(e.message);
            dispatch({'type': Types.LoggerError, error: e});
        });
    }
}

//用来修改店铺名和判断是否设置了提现密码
export function ActionEmployee(currentEmployee) {
    return (dispatch) => {
        dispatch({'type': Types.SetEmployee, data: currentEmployee,});
    }
}

export function ActionLogError(opt) {
    return {
        'type': Types.LoggerError
    }
}

export function ActionLogDoing(opt) {
    return {
        'type': Types.LoggerDoing
    }
}


//退出登陆
export function ActionLogOut() {
    return {
        'type': Types.LoggerOut
    }
}

//注册
export function ActionRegist({loginNo, password, address, X, Y, contactName, companyFullName, companyTypeId}) {
    return (dispatch) => {
        dispatch({'type': Types.RequestRegistStart});
        fetchRegist({loginNo, password, address, X, Y, contactName, companyFullName, companyTypeId}).then((ret) => {
            dispatch({'type': Types.RequestRegistEnd, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestRegistError, error: e});
        });
    }
}

//忘记密码
export function ActionForgetPassword({loginNo, newPassword}) {
    return (dispatch) => {
        dispatch({'type': Types.RequestForgetPasswordStart});
        fetchForgetPassword({loginNo, newPassword}).then((ret) => {
            dispatch({'type': Types.RequestForgetPasswordEnd, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestForgetPasswordError, error: e});
        });
    }
}

//用户类型
//2卖家 3买家
export function ActionCompanyType(companyTypeId) {
    return (dispatch) => {
        dispatch({'type': companyTypeId});
    }
}