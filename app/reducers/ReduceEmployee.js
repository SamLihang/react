/*
 * Created by sencha on 2017/4/11.
 */
import * as Types from "../actions/Types";
import {REHYDRATE} from "redux-persist/constants";

const initialState = {
    isLoggedIn: false,
    currentEmployee: {},
    status: null,
};

const initialRegistState = {};

//登录
export function currentEmployee(state = initialState, action) {
    switch (action.type) {
        case REHYDRATE:
            let incoming = action.payload.ReduceEmployee;
            if (incoming) return {...state, ...incoming};
            return state;

        case Types.LoggerDoing:
            return {
                ...state,
                status: 'doing'
            };
        case Types.LoggedIn:
            return {
                ...state,
                isLoggedIn: true,
                currentEmployee: action.data.CurrentEmployee,
                token: action.data.token,
                status: 'done',
                error: action.error
            };
        case Types.LoggerOut:
            return {
                ...state,
                isLoggedIn: false,
                currentEmployee: {},
                token: null,
                status: null
            };
        case Types.LoggerError:
            return {
                ...state,
                isLoggedIn: false,
                currentEmployee: {},
                token: null,
                status: null
            };
        case Types.SetEmployee:
            return {
                ...state,
                currentEmployee: action.data,
            };
        default:
            return state;
    }
}

//注册
export function ReduceRegist(state = initialRegistState, action) {
    switch (action.type) {
        case REHYDRATE:
            var incoming = action.payload.ReduceRegist;
            if (incoming) return {...state, ...incoming}
            return state;
        case Types.RequestRegistStart:
            return {
                ...state
            };
        case Types.RequestRegistEnd:
            return {
                ...state,
                datas: action.data
            };
        case Types.RequestRegistError:
            return {
                ...state
            };
        default:
            return state;
    }

}


//忘记密码
const initialForgetPassword = {};

export function ReduceForgetPassword(state = initialForgetPassword, action) {
    switch (action.type) {
        case REHYDRATE:
            /* var incoming = action.payload.ReduceRegist;
             if (incoming) return {...state, ...incoming}*/
            return state;
        case Types.RequestForgetPasswordStart:
            return {
                ...state
            };
        case Types.RequestForgetPasswordEnd:
            return {
                ...state,
                datas: action.data
            }
        case Types.RequestForgetPasswordError:
            return {
                ...state
            };
        default:
            return state;
    }

}


//用户类型
const initialCompanyType = {};

export function ReduceCompanyType(state = initialCompanyType, action) {
    switch (action.type) {
        case 2:
            return {
                ...state,
                companyTypeId: 2
            };
        case 3:
            return {
                ...state,
                companyTypeId: 3
            };
        default:
            return {
                ...state
            };
    }

}