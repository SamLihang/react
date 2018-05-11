/**
 * Created by Administrator on 2017/7/1.
 */
import * as Types from './Types';
import {fetchUploadImages} from '../services/UploadImagesServices';
import {fetchLoadUploadImages} from '../services/UploadImagesServices';

//加载图片 
export function ActionLoadUploadImages() {
    return (dispatch) => {
        dispatch({'type': Types.RequestUpImagesStart});
        fetchLoadUploadImages().then((ret) => {
            dispatch({'type': Types.RequestUpImagesEnd, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestUpImagesError, error: e});
        });
    }
}

//上传图片
export function ActionUploadImages(list) {
    return (dispatch) => {
        dispatch({'type': Types.RequestUploadCertificateStart});
        fetchUploadImages(list).then((ret) => {
            dispatch({'type': Types.RequestUploadCertificateEnd, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestUploadCertificateError, error: e});
        });
    }
}
