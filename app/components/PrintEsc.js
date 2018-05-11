/**
 * Created by Administrator on 2017/6/28.
 */
const _ = require('underscore');
const Util = require('./PrintUtil');
const iconv = require('iconv-lite');
import {Buffer} from 'buffer';
global.Buffer = Buffer;
import BluetoothSerial from 'react-native-bluetooth-serial';
const Common = {
    INIT: "1B 40",//初始化

    ALIGN_LEFT: "1B 61 00",//左对齐
    ALIGN_RIGHT: "1B 61 02",//居右对齐
    ALIGN_CENTER: "1B 61 01",//居中对齐

    Bold: "1b 45 01",   //粗体
    BoldCancel: "1b 45 00",//取消加粗模式
    DoubleHeightWidth: "1d 21 11",// 宽高加倍

    StandardASCII: "1b 4d 00",  // 标准的ASCII字体
    CompressedASCII: "1b 4d 01", // 压缩的ASCII字体
    DoubleWidth: "1d 21 10",// 宽加倍
    LineSpacingDefault: "0x1b 0x32",// 设置默认行间距

    /*ALIGN_LEFT: [0x1b, 0x61, 0x00],//左对齐
    ALIGN_RIGHT: [0x1b, 0x61, 0x02],//居右对齐
    ALIGN_CENTER: [0x1b, 0x61, 0x01],//居中对齐*/

    /*Bold: [0x1b, 0x45, 0x01],//粗体
    BoldCancel: [0x1b, 0x45, 0x00],//取消加粗模式
    DoubleHeightWidth: [0x1d, 0x21, 0x11],// 宽高加倍*/

    /*StandardASCII: [0x1b, 0x4d, 0x00],  // 标准的ASCII字体
    CompressedASCII: [0x1b, 0x4d, 0x01], // 压缩的ASCII字体
    DoubleWidth: [0x1d, 0x21, 0x10],// 宽加倍*/


    //LineSpacingDefault: [0x1b, 0x32],// 设置默认行间距

    UNDER_LINE: "1C 2D 01",//下划线

    PRINT_AND_NEW_LINE: '0D',//打印并换行

    FONT_SMALL: "1B 4D 01",//小号字体 9x17
    FONT_NORMAL: "1B 4D 00",//正常 12x24
    //FONT_BOLD: "1B 45 01",//粗体

    FONT_HEIGHT_TIMES: '1B 21 10',
    FONT_WIDTH_TIMES: '1B 21 20',
    FONT_HEIGHT_WIDTH_TIMES: '1B 21 30',

    SOUND: "1B 42 02 02" // 蜂鸣 2次/100ms
};

const Config = {
    wordNumber: 40 // 可打印的字数，对应80mm纸张
};

let writeTextToDevice, writeHexToDevice;

function _setBT(bt) {
    writeTextToDevice = bt.write;
    writeHexToDevice = bt.writeToDevice;
}

function setConfig(config) {
    Object.assign(Config, config);
}

function leftRight(left, right, wordNumber = Config.wordNumber) {
    return left + Util.getSpace(wordNumber - Util.getWordsLength(left) - Util.getWordsLength(right)) + right;
}

function keyValue(name, value, wordNumber = Config.wordNumber) {
    const nameLen = Util.getWordsLength(name);
    let vArr = [], temp = '';
    _.each(value, (v, i) => {
        const tvLen = Util.getWordsLength(temp + v);
        const diff = tvLen - (wordNumber - nameLen);
        if (diff <= 0) {
            temp += v;
            if (i === value.length - 1) {
                vArr.push(temp);
            }
        } else {
            if (Util.isChinese(v) && diff === 1) {
                temp += ' ';
            }
            vArr.push(temp);
            temp = v;
        }
    });
    return _.map(vArr, (v, i) => {
        if (i === 0) {
            return name + v;
        } else {
            return Util.getSpace(name.length) + v;
        }
    }).join('');
}

const ESC = {
    Common,
    Util: {
        leftRight,
        keyValue,
    },
    _setBT,
    setConfig,

    init(){
        var buf=new Buffer(2);
        buf[0]=0x1b;
        buf[1]=0x40;
        writeTextToDevice(buf);
        /*writeTextToDevice(Common.INIT);*/
    },
    printAndNewLine(){
        var buf=new Buffer(2);
        buf[0]=0x0d;
        buf[1]=0x0a;
        writeTextToDevice(buf);
        //writeTextToDevice(Common.PRINT_AND_NEW_LINE);
    },
    alignLeft(){
        //ALIGN_LEFT: "1B 61 00",//左对齐
        var buf=new Buffer(3);
        buf[0]=0x1b;
        buf[1]=0x60;
        buf[2]=0x00;
        writeTextToDevice(buf);
        writeTextToDevice(Common.ALIGN_LEFT);
    },
    alignCenter(){
        var buf=new Buffer(3);
        buf[0]=0x1b;
        buf[1]=0x61;
        buf[2]=0x01;
        writeTextToDevice(buf);
        //writeTextToDevice(Common.ALIGN_CENTER);
    },
    alignRight(){
        //ALIGN_RIGHT: "1B 61 02",//居右对齐
        var buf=new Buffer(3);
        buf[0]=0x1b;
        buf[1]=0x61;
        buf[2]=0x02;
        writeTextToDevice(buf);
        //writeTextToDevice(Common.ALIGN_RIGHT);
    },

    underline(){
        // UNDER_LINE: "1C 2D 01",//下划线
        var buf=new Buffer(3);
        buf[0]=0x1c;
        buf[1]=0x2d;
        buf[2]=0x01;
        writeTextToDevice(buf);
        //writeTextToDevice(Common.UNDER_LINE);
    },

    fontSmall(){
        writeTextToDevice(Common.FONT_SMALL);
    },
    fontNormal(){
        writeTextToDevice(Common.FONT_NORMAL);
    },
    fontBold(){
        //Bold: "1b 45 01",   //粗体

        var buf=new Buffer(3);
        buf[0]=0x1b;
        buf[1]=0x45;
        buf[2]=0x01;
        writeTextToDevice(buf);
        //writeTextToDevice(Common.Bold);
    },
    doubleHeightWidth(){
        //DoubleHeightWidth: "1d 21 11",  // 宽高加倍
        var buf=new Buffer(3);
        buf[0]=0x1d;
        buf[1]=0x21;
        buf[2]=0x11;
        writeTextToDevice(buf);
    },

    fontHeightTimes(){
        writeTextToDevice(Common.FONT_HEIGHT_TIMES);
    },
    fontHeightTimes(){
        writeTextToDevice(Common.FONT_WIDTH_TIMES);
    },
    fontHeightTimes(){
        writeTextToDevice(Common.FONT_HEIGHT_WIDTH_TIMES);
    },

    text(str){
        toWrite = iconv.encode(str, 'gbk');
        writeTextToDevice(toWrite)
    },

    sound(){
        writeTextToDevice(Common.SOUND);
    }
};

module.exports = ESC;