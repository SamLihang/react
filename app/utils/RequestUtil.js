import {Platform} from "react-native";
import {toastShort} from './ToastUtil';
import Alipay from 'react-native-yunpeng-alipay'

// export const HOST = 'http://121.199.43.169:8993';
//export const HOST = 'http://192.168.1.8:65320';
//export const HOST =  'http://192.168.2.110:65320';
//export const HOST =  'http://192.168.1.3:65320';
// export const HOST = 'https://bcl.baocailang.com:8993';
export const  setting= {
    HOST: 'https://bcl.baocailang.com:8993'
    // HOST :  'http://121.199.43.169:8993'
    // HOST : 'http://192.168.2.22:65320'
    // HOST:'http://192.168.2.220:65320'
    // HOST:'http://192.168.2.110:65320'
}


export const request = (url, body, method = 'post') => {
    let isOk;
    // console.log(url, body)
    return new Promise((resolve, reject) => {
        let token = global.token || '';
        fetch(setting.HOST + url, {
            method,
            headers: {
                'isajax': 'true',
                'PrivateKey': '369984sebcl',
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                't': token
            },
            body: body ? JSON.stringify(body) : body
        }).then((response) => {
                if (response.ok) {
                    isOk = true;
                } else {
                    isOk = false;
                }
                return response.json()
            })
            .then((responseData) => {
                // console.log('返回',responseData)
                if (isOk) {
                    if (responseData.error) {
                        if (responseData.error.message === "无权限") {

                        } else {
                            toastShort(responseData.error.message)
                        }
                    }
                    resolve(responseData);
                } else {
                    reject(responseData);
                }
            })
            .catch((error) => {
                // console.log(error)
                //toastShort('请联系客服后继续操作')
                // toastShort(error.message)
                reject(error);
            });
    });
};
export const  settingNew= {
    HOST: 'https://bcl.baocailang.com:9999'
    // HOST :  'http://121.199.43.169:8993'

}

export const requestNew = (url, body, method = 'get') => {
    let isOk;
    // console.log(url, body)
    return new Promise((resolve, reject) => {
        fetch(settingNew.HOST + url, {
            method,
            body: body ? JSON.stringify(body) : body
        }).then((response) => {
            if (response.ok) {
                isOk = true;
            } else {
                isOk = false;
            }
            return response.json()
        })
            .then((responseData) => {
                // console.log('返回',responseData)
                if (isOk) {
                    if (responseData.error) {
                        if (responseData.error.message === "无权限") {

                        } else {
                            toastShort(responseData.error.message)
                        }
                    }
                    resolve(responseData);
                } else {
                    reject(responseData);
                }
            })
            .catch((error) => {
                reject(error);
            });
    });
};

export const uploadImage = (url, params) => {
    return new Promise(function (resolve, reject) {
        let token = global.token || '';
        let formData = new FormData();
        params.map((item, index) => {
            let file = {uri: item.path, type: 'application/octet-stream', name: 'image.jpg'};
            formData.append("file", file);
        });


        fetch(setting.HOST + url, {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data;charset=utf-8',
                'isajax': 'true',
                'PrivateKey': '369984sebcl',
                'Accept': 'application/json',
                't': token
            },
            body: formData,
        }).then((response) => response.json())
            .then((responseData) => {
                resolve(responseData);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

export const BCLAlipay = (payOrder, callback) => {
    let message = null;
    let code = 0;
    Alipay.pay(payOrder).then((ret) => {
            let data = null;
            if (Platform.OS === 'ios') {
                data = ret[0].resultStatus
            }
            else {
                var rets = ret.split(';');
                var str = rets[0];
                str = str.replace(/\{/g, "");
                str = str.replace(/\}/g, "");
                str = str.replace(/=/, ":");
                str = str.replace(/\w{12}:/, "");
                data = str;
            }

            if (data) {
                /*处理支付结果*/
                switch (data) {
                    case "9000":
                        code = 1;
                        message = '支付成功';
                        break;
                    case "8000":
                        message = '支付结果未知,请查询订单状态';
                        break;
                    case "4000":
                        message = '支付失败';
                        break;
                    case "5000":
                        message = '重复请求';
                        break;
                    case "6001":
                        message = '用户中途取消';
                        break;
                    case "6002":
                        message = '网络连接出错';
                        break;
                    case "6004":
                        message = '支付结果未知,请查询订单状态';
                        break;
                    default:
                        message = '其他失败原因';
                        break;
                }
            } else {
                message = '支付失败,请重试'
            }
            callback && callback(code, message)
        }, (err) => {
            message = '支付失败，请重新支付';
            callback && callback(code, message)
        }
    )
};
