/**
 * Created by Administrator on 2017/7/1.
 */
import * as Types from '../actions/Types';

import {REHYDRATE} from 'redux-persist/constants'

const initalLoadUploadImages = {};
const initalUploadImages = {};
//加载
export function ReduceLoadUploadImages(state = initalLoadUploadImages, action) {
    switch (action.type) {
        case REHYDRATE:
            //var incoming = action.payload.ReduceLoderProducts;
            //if (incoming) return {...state, ...incoming}
            return state;
        case Types.RequestUpImagesStart:
            return {
                ...state
            };
        case Types.RequestUpImagesEnd:
            return {
                ...state,
                datas: action.data
            }
        case Types.RequestUpImagesError:
            return {
                ...state
            };
        default:
            return state;
    }
}
//上传
export function ReduceUploadImages(state = initalUploadImages, action) {
    switch (action.type) {
        case REHYDRATE:
            return state;
        case Types.RequestUploadCertificateStart:
            return {
                ...state
            };
        case Types.RequestUploadCertificateEnd:
            return {
                ...state,
                datas: action.data
            }
        case Types.RequestUploadCertificateError:
            return {
                ...state
            };
        default:
            return state;
    }
}