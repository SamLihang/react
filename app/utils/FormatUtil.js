export const formatDateString = (timestamp) => {
    const date = new Date(parseInt(timestamp) * 1000);
    const year = date.getFullYear();
    const month = parseInt(date.getMonth()) + 1;
    const day = date.getDate();
    return `${year}-${month}-${day}`;
};

export const formatStringWithHtml = (originString) => {
    const newString = originString.replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>');
    return newString;
};

//保留两位小数
export const toDecimal2 = (x) => {
    let f = parseFloat(x);
    if (isNaN(f)) {
        return '0';
    }
    f = Math.round(x * 10000000) / 10000000;
    //f = Math.floor(x * 100) / 100;
    let s = f.toString();
    let sindex=s.indexOf(".");
    if(sindex>0){
        if(s.substring(sindex+1,s.length)>2){
            s=s.substring(0,sindex+3);
        }
    }
    return s;
}

/**日期格式化
 * 用法：formaTime(item.CreateTime, "yyyy-MM-dd  hh:mm:ss")*/
export const formaTime = (str, format) => {
    let date = new Date(parseInt(str.replace("/Date(", "").replace(")/", ""), 10));
    return date.format(format);
};

//乘法函数
export const accMul = (arg1, arg2) => {
    let m = 0, s1 = arg1.toString(), s2 = arg2.toString();
    try {
        m += s1.split(".")[1].length;
    }
    catch (e) {
    }
    try {
        m += s2.split(".")[1].length;
    }
    catch (e) {
    }
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
};
//给Number类型增加一个mul方法，使用时直接用 .mul 即可完成计算
Number.prototype.mul = function (arg) {
    return accMul(arg, this);
};
export const accAdd = (arg1, arg2) => {
    let r1, r2, m, c;
    try {
        r1 = arg1.toString().split(".")[1].length;
    }
    catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
        r2 = 0;
    }
    c = Math.abs(r1 - r2);
    m = Math.pow(10, Math.max(r1, r2));
    if (c > 0) {
        var cm = Math.pow(10, c);
        if (r1 > r2) {
            arg1 = Number(arg1.toString().replace(".", ""));
            arg2 = Number(arg2.toString().replace(".", "")) * cm;
        } else {
            arg1 = Number(arg1.toString().replace(".", "")) * cm;
            arg2 = Number(arg2.toString().replace(".", ""));
        }
    } else {
        arg1 = Number(arg1.toString().replace(".", ""));
        arg2 = Number(arg2.toString().replace(".", ""));
    }
    return (arg1 + arg2) / m;
};