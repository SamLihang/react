/**
 * Created by sencha on 2017/4/1.
 *  * iphone6 手机 375*667
 */

import {Dimensions, AsyncStorage, NetInfo,PixelRatio} from 'react-native';

export const BASEPX = 360;
export const BASEHPX = 592;
export const deviceWidth = Dimensions.get('window').width;
export const deviceHeight = Dimensions.get('window').height;

export  const  version = '1.7.0';


export function px2dp(px) {
    return px * deviceWidth / BASEPX;
}
export function px2dpH(px) {
   // alert('deviceHeight'+deviceHeight)
    return px * deviceHeight / BASEHPX;
}

//////////////////////////// 适配方案 韩桂光


export const PIXEL_RATIO_160_1 =1; // mdpi for android
export const PIXEL_RATIO_240_1d5 =1.5; // hdp from android
export const PIXEL_RATIO_320_2 =2; // iphone4, 4s, 5, 5c, 5s, 6, 7; xhdpi from android
export const PIXEL_RATIO_480_3 =3; // iphone6p, 7p; xxhdpi for android,1080p
export const PIXEL_RATIO_560_3x5 =3.5; // larger from android

// 设置基准分辨率
export const BASE_PIXEL_RATIO =PIXEL_RATIO_480_3;

// 根据密度适配不同的分辨率,参数为dp
export function getDimensbyDP(length) {
    // 获取密度
    let ratio=PixelRatio.get();
    if (length== null) {
        length = 0;
    }
    let result= parseInt(length /(PIXEL_RATIO_480_3 /ratio));
    return length /(BASE_PIXEL_RATIO/ ratio);
}

// 根据密度适配不同的分辨率，参数为px
export function getFitPX(length) {
    // 获取密度
    let ratio=PixelRatio.get();

   // alert('ratio:'+ratio);
    //console.log('ratio比例:'+ratio)

    let dp= length/ ratio;
    return getDimensbyDP(dp);
}
//////////////////////////// 适配方案 韩桂光


export function setDatas(key, value, callback) {
    AsyncStorage.setItem(key, JSON.stringify(value), callback);
}

export function getDatas(key, callback) {
    AsyncStorage.getItem(key, (error, object) => {
        if (error) {
            //console.log('error:' + error.message);
            callback();
        }
        else {
            callback(JSON.parse(object));
        }
    })
}

export function updateDatas(key, value, callback) {
    return getDatas(key).then((datas) => {
        value = typeof value === 'string' ? value : Object.assign({}, value, value);
        return setDatas(key, value, callback);
    })
}

export function removeDatas(key, callback) {
    AsyncStorage.removeItem(key, callback);
}

export function substr(text, length) {
    if (!text) {
        return text;
    }
    if (text.length > length) {
        return text.substring(0, length - 3) + "..."
    }
    return text;
}

export function substr2(text, length) {
    if (!text) {
        return text;
    }
    if (text.length > length) {
        return text.substring(0, length) + "..."
    }
    return text;
}

export function deepCopy(obj) {
    let str, newobj = obj.constructor === Array ? [] : {};
    if (typeof obj !== 'object') {
        return;
    } else if (window.JSON) {
        str = JSON.stringify(obj), //系列化对象
            newobj = JSON.parse(str); //还原
    } else {
        for (let i in obj) {
            newobj[i] = typeof obj[i] === 'object' ?
                cloneObj(obj[i]) : obj[i];
        }
    }
    return newobj;
}

export function Today() {
    let Today = new Date();
    let str = Today.getFullYear() + "-" + (Today.getMonth() + 1 < 10 ? '0' + (Today.getMonth() + 1) : Today.getMonth() + 1) + "-" + (Today.getDate() > 9 ? Today.getDate() : '0' + Today.getDate());

    return str;
}

export function compareDate(start, end) {
    if (start == null || start.length == 0 || end == null || end.length == 0) {
        return 0;
    }

    let arr = start.split("-");
    let starttime = new Date(arr[0], parseInt(arr[1] - 1), arr[2]);
    let starttimes = starttime.getTime();

    let arrs = end.split("-");
    let endtime = new Date(arrs[0], parseInt(arrs[1] - 1), arrs[2]);
    let endtimes = endtime.getTime();

    let intervalTime = endtimes - starttimes;//两个日期相差的毫秒数 一天86400000毫秒
    let Inter_Days = ((intervalTime).toFixed(2) / 86400000) + 1;//加1，是让同一天的两个日期返回一天

    return Inter_Days;
}

export function betweenDate(start, num) {
    if (start == null || start.length == 0) {
        return 0;
    }

    let arr = start.split("-");
    let starttime = new Date(arr[0], parseInt(arr[1] - 1), arr[2]);
    let starttimes = starttime.getTime();

    let intervalTime = new Date(starttimes + num * 24 * 60 * 60 * 1000);

    Y = intervalTime.getFullYear() + '-';
    M = (intervalTime.getMonth() + 1 < 10 ? '0' + (intervalTime.getMonth() + 1) : intervalTime.getMonth() + 1) + '-';
    D = intervalTime.getDate() + '';
    h = intervalTime.getHours() + ':';
    m = intervalTime.getMinutes() + ':';
    s = intervalTime.getSeconds();

    return Y + M + D;
}

export function getDateStr(AddDayCount) {
    let dd = new Date();
    dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期
    let y = dd.getFullYear();
    let m = dd.getMonth() + 1 < 10 ? '0' + (dd.getMonth() + 1) : dd.getMonth() + 1;//获取当前月份的日期
    let d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate();
    return y + "-" + m + "-" + d;
}

export function showCountDown(endTime) {
    let now = new Date();
    let endDate = new Date(parseInt(endTime.replace("/Date(", "").replace(")/", ""), 10));

    if (now.getTime() > endDate.getTime()) {
        return '已到期';
        return false;
    }

    let leftTime = endDate.getTime() - now.getTime();
    let leftsecond = parseInt(leftTime / 1000);

    let day1 = Math.floor(leftsecond / (60 * 60 * 24));
    let hour = Math.floor((leftsecond - day1 * 24 * 60 * 60) / 3600);
    let minute = Math.floor((leftsecond - day1 * 24 * 60 * 60 - hour * 3600) / 60);
    let second = Math.floor(leftsecond - day1 * 24 * 60 * 60 - hour * 3600 - minute * 60);

    let text = day1 + "天" + hour + "小时" + minute + "分" + second + "秒";
    return text;
}

export const NOT_NETWORK = "网络不可用，请稍后再试";
export const TAG_NETWORK_CHANGE = "NetworkChange";

/***
 * 检查网络链接状态
 * @param callback
 */
export const checkNetworkState = (callback) => {
    NetInfo.isConnected.fetch().done(
        (isConnected) => {
            callback(isConnected);
        }
    );
}

/***
 * 移除网络状态变化监听
 * @param tag
 * @param handler
 */
export const removeEventListener = (tag, handler) => {
    NetInfo.isConnected.removeEventListener(tag, handler);
}

/***
 * 添加网络状态变化监听
 * @param tag
 * @param handler
 */
export const addEventListener = (tag, handler) => {
    NetInfo.isConnected.addEventListener(tag, handler);
}
