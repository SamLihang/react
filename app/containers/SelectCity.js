/**
 * Created by xujz on 2017/11/25.
 */
import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Image,
    Platform,
    TouchableOpacity,
    TextInput,
    ScrollView,
    InteractionManager,
    ListView,
    AsyncStorage,
    Dimensions

} from 'react-native';
import PageComponent, {PullViewComponent} from './PageComponent';
import BaseComponent, {deviceWidth, px2dp, BCText, BCImage, BCTouchable, substr, deviceHeight,NavigationOptions} from '../BaseComponent';
import gs from '../styles/MainStyles';
import {connect} from "react-redux";
import {ActionCities} from "../actions/BuyerIndexAction";
import BCNavigator from '../components/BCNavigator'
/*import Toast, {DURATION} from 'react-native-easy-toast';*/

import _ from 'lodash';
//这是利用lodash的range和数组的map画出26个英文字母
const letters = _
    .range('A'.charCodeAt(0), 'Z'.charCodeAt(0) + 1)
    .map(n => String.fromCharCode(n).substr(0))
_.pull(letters, 'O', 'V')//去掉o和V,这两个下面没有城市
let city = [];//城市的数组

const SECTIONHEIGHT = 30;
const ROWHEIGHT = 40;
var that;
var totalheight = [];//每个字母对应的城市和字母的总高度

const CityList = {
    "CITIES": [
        {
            "code": "110100",
            "name": "北京11111",
            "name_en": "Beijing"
        },
        {
            "code": "120100",
            "name": "天津",
            "name_en": "Tianjin"
        },
        {
            "code": "130100",
            "name": "石家庄",
            "name_en": "Shijiazhuang Shi"
        },
        {
            "code": "130200",
            "name": "唐山",
            "name_en": "Tangshan Shi"
        },
        {
            "code": "130300",
            "name": "秦皇岛",
            "name_en": "Qinhuangdao Shi"
        },
        {
            "code": "130400",
            "name": "邯郸",
            "name_en": "Handan Shi"
        },
        {
            "code": "130500",
            "name": "邢台",
            "name_en": "Xingtai Shi"
        },
        {
            "code": "130600",
            "name": "保定123",
            "name_en": "Baoding Shi"
        },
        {
            "code": "130700",
            "name": "张家口",
            "name_en": "Zhangjiakou Shi "
        },
        {
            "code": "130800",
            "name": "承德",
            "name_en": "Chengde Shi"
        },
        {
            "code": "130900",
            "name": "沧州",
            "name_en": "Cangzhou Shi"
        },
        {
            "code": "131000",
            "name": "廊坊",
            "name_en": "Langfang Shi"
        },
        {
            "code": "131100",
            "name": "衡水",
            "name_en": "Hengshui Shi "
        },
        {
            "code": "140100",
            "name": "太原",
            "name_en": "Taiyuan Shi"
        },
        {
            "code": "140200",
            "name": "大同",
            "name_en": "Datong Shi "
        },
        {
            "code": "140300",
            "name": "阳泉",
            "name_en": "Yangquan Shi"
        },
        {
            "code": "140400",
            "name": "长治",
            "name_en": "Changzhi Shi"
        },
        {
            "code": "140500",
            "name": "晋城",
            "name_en": "Jincheng Shi "
        },
        {
            "code": "140600",
            "name": "朔州",
            "name_en": "Shuozhou Shi "
        },
        {
            "code": "140700",
            "name": "晋中",
            "name_en": "Jinzhong Shi"
        },
        {
            "code": "140800",
            "name": "运城",
            "name_en": "Yuncheng Shi"
        },
        {
            "code": "140900",
            "name": "忻州",
            "name_en": "Xinzhou Shi"
        },
        {
            "code": "141000",
            "name": "临汾",
            "name_en": "Linfen Shi"
        },
        {
            "code": "141100",
            "name": "吕梁",
            "name_en": "Lvliang Shi"
        },
        {
            "code": "150100",
            "name": "呼和浩特",
            "name_en": "Hohhot Shi"
        },
        {
            "code": "150200",
            "name": "包头",
            "name_en": "Baotou Shi "
        },
        {
            "code": "150300",
            "name": "乌海",
            "name_en": "Wuhai Shi"
        },
        {
            "code": "150400",
            "name": "赤峰",
            "name_en": "Chifeng (Ulanhad)Shi"
        },
        {
            "code": "150500",
            "name": "通辽",
            "name_en": "Tongliao Shi"
        },
        {
            "code": "150600",
            "name": "鄂尔多斯",
            "name_en": "Eerduosi Shi"
        },
        {
            "code": "150700",
            "name": "呼伦贝尔",
            "name_en": "Hulunbeier Shi "
        },
        {
            "code": "150800",
            "name": "巴彦淖尔",
            "name_en": "Bayannaoer Shi"
        },
        {
            "code": "150900",
            "name": "乌兰察布",
            "name_en": "Wulanchabu Shi"
        },
        {
            "code": "152200",
            "name": "兴安盟",
            "name_en": "Hinggan Meng"
        },
        {
            "code": "152500",
            "name": "锡林郭勒盟",
            "name_en": "Xilin Gol Meng"
        },
        {
            "code": "152900",
            "name": "阿拉善盟",
            "name_en": "Alxa Meng"
        },
        {
            "code": "210100",
            "name": "沈阳",
            "name_en": "Shenyang Shi"
        },
        {
            "code": "210200",
            "name": "大连",
            "name_en": "Dalian Shi"
        },
        {
            "code": "210300",
            "name": "鞍山",
            "name_en": "AnShan Shi"
        },
        {
            "code": "210400",
            "name": "抚顺",
            "name_en": "Fushun Shi"
        },
        {
            "code": "210500",
            "name": "本溪",
            "name_en": "Benxi Shi"
        },
        {
            "code": "210600",
            "name": "丹东",
            "name_en": "Dandong Shi"
        },
        {
            "code": "210700",
            "name": "锦州",
            "name_en": "Jinzhou Shi"
        },
        {
            "code": "210800",
            "name": "营口",
            "name_en": "Yingkou Shi"
        },
        {
            "code": "210900",
            "name": "阜新",
            "name_en": "Fuxin Shi"
        },
        {
            "code": "211000",
            "name": "辽阳",
            "name_en": "Liaoyang Shi"
        },
        {
            "code": "211100",
            "name": "盘锦",
            "name_en": "Panjin Shi"
        },
        {
            "code": "211200",
            "name": "铁岭",
            "name_en": "Tieling Shi"
        },
        {
            "code": "211300",
            "name": "朝阳",
            "name_en": "Chaoyang Shi"
        },
        {
            "code": "211400",
            "name": "葫芦岛",
            "name_en": "Huludao Shi"
        },
        {
            "code": "220100",
            "name": "长春",
            "name_en": "Changchun Shi "
        },
        {
            "code": "220200",
            "name": "吉林",
            "name_en": "Jilin Shi "
        },
        {
            "code": "220300",
            "name": "四平",
            "name_en": "Siping Shi"
        },
        {
            "code": "220400",
            "name": "辽源",
            "name_en": "Liaoyuan Shi"
        },
        {
            "code": "220500",
            "name": "通化",
            "name_en": "Tonghua Shi"
        },
        {
            "code": "220600",
            "name": "白山",
            "name_en": "Baishan Shi"
        },
        {
            "code": "220700",
            "name": "松原",
            "name_en": "Songyuan Shi"
        },
        {
            "code": "220800",
            "name": "白城",
            "name_en": "Baicheng Shi"
        },
        {
            "code": "222400",
            "name": "延边朝鲜族自治州",
            "name_en": "Yanbian Chosenzu Zizhizhou"
        },
        {
            "code": "230100",
            "name": "哈尔滨",
            "name_en": "Harbin Shi"
        },
        {
            "code": "230200",
            "name": "齐齐哈尔",
            "name_en": "Qiqihar Shi"
        },
        {
            "code": "230300",
            "name": "鸡西",
            "name_en": "Jixi Shi"
        },
        {
            "code": "230400",
            "name": "鹤岗",
            "name_en": "Hegang Shi"
        },
        {
            "code": "230500",
            "name": "双鸭山",
            "name_en": "Shuangyashan Shi"
        },
        {
            "code": "230600",
            "name": "大庆",
            "name_en": "Daqing Shi"
        },
        {
            "code": "230700",
            "name": "伊春",
            "name_en": "Yichun Shi"
        },
        {
            "code": "230800",
            "name": "佳木斯",
            "name_en": "Jiamusi Shi"
        },
        {
            "code": "230900",
            "name": "七台河",
            "name_en": "Qitaihe Shi"
        },
        {
            "code": "231000",
            "name": "牡丹江",
            "name_en": "Mudanjiang Shi"
        },
        {
            "code": "231100",
            "name": "黑河",
            "name_en": "Heihe Shi"
        },
        {
            "code": "231200",
            "name": "绥化",
            "name_en": "Suihua Shi"
        },
        {
            "code": "232700",
            "name": "大兴安岭地区",
            "name_en": "Da Hinggan Ling Diqu"
        },
        {
            "code": "310100",
            "name": "上海",
            "name_en": "Shanghai"
        },
        {
            "code": "320100",
            "name": "南京",
            "name_en": "Nanjing Shi"
        },
        {
            "code": "320200",
            "name": "无锡",
            "name_en": "Wuxi Shi"
        },
        {
            "code": "320300",
            "name": "徐州",
            "name_en": "Xuzhou Shi"
        },
        {
            "code": "320400",
            "name": "常州",
            "name_en": "Changzhou Shi"
        },
        {
            "code": "320500",
            "name": "苏州",
            "name_en": "Suzhou Shi"
        },
        {
            "code": "320600",
            "name": "南通",
            "name_en": "Nantong Shi"
        },
        {
            "code": "320700",
            "name": "连云港",
            "name_en": "Lianyungang Shi"
        },
        {
            "code": "320800",
            "name": "淮安",
            "name_en": "Huai,an Xian"
        },
        {
            "code": "320900",
            "name": "盐城",
            "name_en": "Yancheng Shi"
        },
        {
            "code": "321000",
            "name": "扬州",
            "name_en": "Yangzhou Shi"
        },
        {
            "code": "321100",
            "name": "镇江",
            "name_en": "Zhenjiang Shi"
        },
        {
            "code": "321200",
            "name": "泰州",
            "name_en": "Taizhou Shi"
        },
        {
            "code": "321300",
            "name": "宿迁",
            "name_en": "Suqian Shi"
        },
        {
            "code": "330100",
            "name": "杭州",
            "name_en": "Hangzhou Shi"
        },
        {
            "code": "330200",
            "name": "宁波",
            "name_en": "Ningbo Shi"
        },
        {
            "code": "330300",
            "name": "温州",
            "name_en": "Wenzhou Shi"
        },
        {
            "code": "330400",
            "name": "嘉兴",
            "name_en": "Jiaxing Shi"
        },
        {
            "code": "330500",
            "name": "湖州",
            "name_en": "Huzhou Shi "
        },
        {
            "code": "330600",
            "name": "绍兴",
            "name_en": "Shaoxing Shi"
        },
        {
            "code": "330700",
            "name": "金华",
            "name_en": "Jinhua Shi"
        },
        {
            "code": "330800",
            "name": "衢州",
            "name_en": "Quzhou Shi"
        },
        {
            "code": "330900",
            "name": "舟山",
            "name_en": "Zhoushan Shi"
        },
        {
            "code": "331000",
            "name": "台州",
            "name_en": "Taizhou Shi"
        },
        {
            "code": "331100",
            "name": "丽水",
            "name_en": "Lishui Shi"
        },
        {
            "code": "340100",
            "name": "合肥",
            "name_en": "Hefei Shi"
        },
        {
            "code": "340200",
            "name": "芜湖",
            "name_en": "Wuhu Shi"
        },
        {
            "code": "340300",
            "name": "蚌埠",
            "name_en": "Bengbu Shi"
        },
        {
            "code": "340400",
            "name": "淮南",
            "name_en": "Huainan Shi"
        },
        {
            "code": "340500",
            "name": "马鞍山",
            "name_en": "Ma,anshan Shi"
        },
        {
            "code": "340600",
            "name": "淮北",
            "name_en": "Huaibei Shi"
        },
        {
            "code": "340700",
            "name": "铜陵",
            "name_en": "Tongling Shi"
        },
        {
            "code": "340800",
            "name": "安庆",
            "name_en": "Anqing Shi"
        },
        {
            "code": "341000",
            "name": "黄山",
            "name_en": "Huangshan Shi"
        },
        {
            "code": "341100",
            "name": "滁州",
            "name_en": "Chuzhou Shi"
        },
        {
            "code": "341200",
            "name": "阜阳",
            "name_en": "Fuyang Shi"
        },
        {
            "code": "341300",
            "name": "宿州",
            "name_en": "Suzhou Shi"
        },
        {
            "code": "341400",
            "name": "巢湖",
            "name_en": "Chaohu Shi"
        },
        {
            "code": "341500",
            "name": "六安",
            "name_en": "Liu,an Shi"
        },
        {
            "code": "341600",
            "name": "亳州",
            "name_en": "Bozhou Shi"
        },
        {
            "code": "341700",
            "name": "池州",
            "name_en": "Chizhou Shi"
        },
        {
            "code": "341800",
            "name": "宣城",
            "name_en": "Xuancheng Shi"
        },
        {
            "code": "350100",
            "name": "福州",
            "name_en": "Fuzhou Shi"
        },
        {
            "code": "350200",
            "name": "厦门",
            "name_en": "Xiamen Shi"
        },
        {
            "code": "350300",
            "name": "莆田",
            "name_en": "Putian Shi"
        },
        {
            "code": "350400",
            "name": "三明",
            "name_en": "Sanming Shi"
        },
        {
            "code": "350500",
            "name": "泉州",
            "name_en": "Quanzhou Shi"
        },
        {
            "code": "350600",
            "name": "漳州",
            "name_en": "Zhangzhou Shi"
        },
        {
            "code": "350700",
            "name": "南平",
            "name_en": "Nanping Shi"
        },
        {
            "code": "350800",
            "name": "龙岩",
            "name_en": "Longyan Shi"
        },
        {
            "code": "350900",
            "name": "宁德",
            "name_en": "Ningde Shi"
        },
        {
            "code": "360100",
            "name": "南昌",
            "name_en": "Nanchang Shi"
        },
        {
            "code": "360200",
            "name": "景德镇",
            "name_en": "Jingdezhen Shi"
        },
        {
            "code": "360300",
            "name": "萍乡",
            "name_en": "Pingxiang Shi"
        },
        {
            "code": "360400",
            "name": "九江",
            "name_en": "Jiujiang Shi"
        },
        {
            "code": "360500",
            "name": "新余",
            "name_en": "Xinyu Shi"
        },
        {
            "code": "360600",
            "name": "鹰潭",
            "name_en": "Yingtan Shi"
        },
        {
            "code": "360700",
            "name": "赣州",
            "name_en": "Ganzhou Shi"
        },
        {
            "code": "360800",
            "name": "吉安",
            "name_en": "Ji,an Shi"
        },
        {
            "code": "360900",
            "name": "宜春",
            "name_en": "Yichun Shi"
        },
        {
            "code": "361000",
            "name": "抚州",
            "name_en": "Wuzhou Shi"
        },
        {
            "code": "361100",
            "name": "上饶",
            "name_en": "Shangrao Shi"
        },
        {
            "code": "370100",
            "name": "济南",
            "name_en": "Jinan Shi"
        },
        {
            "code": "370200",
            "name": "青岛",
            "name_en": "Qingdao Shi"
        },
        {
            "code": "370300",
            "name": "淄博",
            "name_en": "Zibo Shi"
        },
        {
            "code": "370400",
            "name": "枣庄",
            "name_en": "Zaozhuang Shi"
        },
        {
            "code": "370500",
            "name": "东营",
            "name_en": "Dongying Shi"
        },
        {
            "code": "370600",
            "name": "烟台",
            "name_en": "Yantai Shi"
        },
        {
            "code": "370700",
            "name": "潍坊",
            "name_en": "Weifang Shi"
        },
        {
            "code": "370800",
            "name": "济宁",
            "name_en": "Jining Shi"
        },
        {
            "code": "370900",
            "name": "泰安",
            "name_en": "Tai,an Shi"
        },
        {
            "code": "371000",
            "name": "威海",
            "name_en": "Weihai Shi"
        },
        {
            "code": "371100",
            "name": "日照",
            "name_en": "Rizhao Shi"
        },
        {
            "code": "371200",
            "name": "莱芜",
            "name_en": "Laiwu Shi"
        },
        {
            "code": "371300",
            "name": "临沂",
            "name_en": "Linyi Shi"
        },
        {
            "code": "371400",
            "name": "德州",
            "name_en": "Dezhou Shi"
        },
        {
            "code": "371500",
            "name": "聊城",
            "name_en": "Liaocheng Shi"
        },
        {
            "code": "371600",
            "name": "滨州",
            "name_en": "Binzhou Shi"
        },
        {
            "code": "371700",
            "name": "菏泽",
            "name_en": "Heze Shi"
        },
        {
            "code": "410100",
            "name": "郑州",
            "name_en": "Zhengzhou Shi"
        },
        {
            "code": "410200",
            "name": "开封",
            "name_en": "Kaifeng Shi"
        },
        {
            "code": "410300",
            "name": "洛阳",
            "name_en": "Luoyang Shi"
        },
        {
            "code": "410400",
            "name": "平顶山",
            "name_en": "Pingdingshan Shi"
        },
        {
            "code": "410500",
            "name": "安阳",
            "name_en": "Anyang Shi"
        },
        {
            "code": "410600",
            "name": "鹤壁",
            "name_en": "Hebi Shi"
        },
        {
            "code": "410700",
            "name": "新乡",
            "name_en": "Xinxiang Shi"
        },
        {
            "code": "410800",
            "name": "焦作",
            "name_en": "Jiaozuo Shi"
        },
        {
            "code": "410900",
            "name": "濮阳",
            "name_en": "Puyang Shi"
        },
        {
            "code": "411000",
            "name": "许昌",
            "name_en": "Xuchang Shi"
        },
        {
            "code": "411100",
            "name": "漯河",
            "name_en": "Luohe Shi"
        },
        {
            "code": "411200",
            "name": "三门峡",
            "name_en": "Sanmenxia Shi"
        },
        {
            "code": "411300",
            "name": "南阳",
            "name_en": "Nanyang Shi"
        },
        {
            "code": "411400",
            "name": "商丘",
            "name_en": "Shangqiu Shi"
        },
        {
            "code": "411500",
            "name": "信阳",
            "name_en": "Xinyang Shi"
        },
        {
            "code": "411600",
            "name": "周口",
            "name_en": "Zhoukou Shi"
        },
        {
            "code": "411700",
            "name": "驻马店",
            "name_en": "Zhumadian Shi"
        },
        {
            "code": "420100",
            "name": "武汉",
            "name_en": "Wuhan Shi"
        },
        {
            "code": "420200",
            "name": "黄石",
            "name_en": "Huangshi Shi"
        },
        {
            "code": "420300",
            "name": "十堰",
            "name_en": "Shiyan Shi"
        },
        {
            "code": "420500",
            "name": "宜昌",
            "name_en": "Yichang Shi"
        },
        {
            "code": "420600",
            "name": "襄阳",
            "name_en": "Xiangfan Shi"
        },
        {
            "code": "420700",
            "name": "鄂州",
            "name_en": "Ezhou Shi"
        },
        {
            "code": "420800",
            "name": "荆门",
            "name_en": "Jingmen Shi"
        },
        {
            "code": "420900",
            "name": "孝感",
            "name_en": "Xiaogan Shi"
        },
        {
            "code": "421000",
            "name": "荆州",
            "name_en": "Jingzhou Shi"
        },
        {
            "code": "421100",
            "name": "黄冈",
            "name_en": "Huanggang Shi"
        },
        {
            "code": "421200",
            "name": "咸宁",
            "name_en": "Xianning Xian"
        },
        {
            "code": "421300",
            "name": "随州",
            "name_en": "Suizhou Shi"
        },
        {
            "code": "422800",
            "name": "恩施土家族苗族自治州",
            "name_en": "Enshi Tujiazu Miaozu Zizhizhou"
        },
        {
            "code": "429000",
            "name": "省直辖县级行政区划",
            "name_en": "shengzhixiaxianjixingzhengquhua"
        },
        {
            "code": "430100",
            "name": "长沙",
            "name_en": "Changsha Shi"
        },
        {
            "code": "430200",
            "name": "株洲",
            "name_en": "Zhuzhou Shi"
        },
        {
            "code": "430300",
            "name": "湘潭",
            "name_en": "Xiangtan Shi"
        },
        {
            "code": "430400",
            "name": "衡阳",
            "name_en": "Hengyang Shi"
        },
        {
            "code": "430500",
            "name": "邵阳",
            "name_en": "Shaoyang Shi"
        },
        {
            "code": "430600",
            "name": "岳阳",
            "name_en": "Yueyang Shi"
        },
        {
            "code": "430700",
            "name": "常德",
            "name_en": "Changde Shi"
        },
        {
            "code": "430800",
            "name": "张家界",
            "name_en": "Zhangjiajie Shi"
        },
        {
            "code": "430900",
            "name": "益阳",
            "name_en": "Yiyang Shi"
        },
        {
            "code": "431000",
            "name": "郴州",
            "name_en": "Chenzhou Shi"
        },
        {
            "code": "431100",
            "name": "永州",
            "name_en": "Yongzhou Shi"
        },
        {
            "code": "431200",
            "name": "怀化",
            "name_en": "Huaihua Shi"
        },
        {
            "code": "431300",
            "name": "娄底",
            "name_en": "Loudi Shi"
        },
        {
            "code": "433100",
            "name": "湘西土家族苗族自治州",
            "name_en": "Xiangxi Tujiazu Miaozu Zizhizhou "
        },
        {
            "code": "440100",
            "name": "广州",
            "name_en": "Guangzhou Shi"
        },
        {
            "code": "440200",
            "name": "韶关",
            "name_en": "Shaoguan Shi"
        },
        {
            "code": "440300",
            "name": "深圳",
            "name_en": "Shenzhen Shi"
        },
        {
            "code": "440400",
            "name": "珠海",
            "name_en": "Zhuhai Shi"
        },
        {
            "code": "440500",
            "name": "汕头",
            "name_en": "Shantou Shi"
        },
        {
            "code": "440600",
            "name": "佛山",
            "name_en": "Foshan Shi"
        },
        {
            "code": "440700",
            "name": "江门",
            "name_en": "Jiangmen Shi"
        },
        {
            "code": "440800",
            "name": "湛江",
            "name_en": "Zhanjiang Shi"
        },
        {
            "code": "440900",
            "name": "茂名",
            "name_en": "Maoming Shi"
        },
        {
            "code": "441200",
            "name": "肇庆",
            "name_en": "Zhaoqing Shi"
        },
        {
            "code": "441300",
            "name": "惠州",
            "name_en": "Huizhou Shi"
        },
        {
            "code": "441400",
            "name": "梅州",
            "name_en": "Meizhou Shi"
        },
        {
            "code": "441500",
            "name": "汕尾",
            "name_en": "Shanwei Shi"
        },
        {
            "code": "441600",
            "name": "河源",
            "name_en": "Heyuan Shi"
        },
        {
            "code": "441700",
            "name": "阳江",
            "name_en": "Yangjiang Shi"
        },
        {
            "code": "441800",
            "name": "清远",
            "name_en": "Qingyuan Shi"
        },
        {
            "code": "441900",
            "name": "东莞",
            "name_en": "Dongguan Shi"
        },
        {
            "code": "442000",
            "name": "中山",
            "name_en": "Zhongshan Shi"
        },
        {
            "code": "445100",
            "name": "潮州",
            "name_en": "Chaozhou Shi"
        },
        {
            "code": "445200",
            "name": "揭阳",
            "name_en": "Jieyang Shi"
        },
        {
            "code": "445300",
            "name": "云浮",
            "name_en": "Yunfu Shi"
        },
        {
            "code": "450100",
            "name": "南宁",
            "name_en": "Nanning Shi"
        },
        {
            "code": "450200",
            "name": "柳州",
            "name_en": "Liuzhou Shi"
        },
        {
            "code": "450300",
            "name": "桂林",
            "name_en": "Guilin Shi"
        },
        {
            "code": "450400",
            "name": "梧州",
            "name_en": "Wuzhou Shi"
        },
        {
            "code": "450500",
            "name": "北海",
            "name_en": "Beihai Shi"
        },
        {
            "code": "450600",
            "name": "防城港",
            "name_en": "Fangchenggang Shi"
        },
        {
            "code": "450700",
            "name": "钦州",
            "name_en": "Qinzhou Shi"
        },
        {
            "code": "450800",
            "name": "贵港",
            "name_en": "Guigang Shi"
        },
        {
            "code": "450900",
            "name": "玉林",
            "name_en": "Yulin Shi"
        },
        {
            "code": "451000",
            "name": "百色",
            "name_en": "Baise Shi"
        },
        {
            "code": "451100",
            "name": "贺州",
            "name_en": "Hezhou Shi"
        },
        {
            "code": "451200",
            "name": "河池",
            "name_en": "Hechi Shi"
        },
        {
            "code": "451300",
            "name": "来宾",
            "name_en": "Laibin Shi"
        },
        {
            "code": "451400",
            "name": "崇左",
            "name_en": "Chongzuo Shi"
        },
        {
            "code": "460100",
            "name": "海口",
            "name_en": "Haikou Shi"
        },
        {
            "code": "460200",
            "name": "三亚",
            "name_en": "Sanya Shi"
        },
        {
            "code": "469000",
            "name": "省直辖县级行政区划",
            "name_en": "shengzhixiaxianjixingzhengquhua"
        },
        {
            "code": "500100",
            "name": "重庆",
            "name_en": "Chongqing"
        },
        {
            "code": "510100",
            "name": "成都",
            "name_en": "Chengdu Shi"
        },
        {
            "code": "510300",
            "name": "自贡",
            "name_en": "Zigong Shi"
        },
        {
            "code": "510400",
            "name": "攀枝花",
            "name_en": "Panzhihua Shi"
        },
        {
            "code": "510500",
            "name": "泸州",
            "name_en": "Luzhou Shi"
        },
        {
            "code": "510600",
            "name": "德阳",
            "name_en": "Deyang Shi"
        },
        {
            "code": "510700",
            "name": "绵阳",
            "name_en": "Mianyang Shi"
        },
        {
            "code": "510800",
            "name": "广元",
            "name_en": "Guangyuan Shi"
        },
        {
            "code": "510900",
            "name": "遂宁",
            "name_en": "Suining Shi"
        },
        {
            "code": "511000",
            "name": "内江",
            "name_en": "Neijiang Shi"
        },
        {
            "code": "511100",
            "name": "乐山",
            "name_en": "Leshan Shi"
        },
        {
            "code": "511300",
            "name": "南充",
            "name_en": "Nanchong Shi"
        },
        {
            "code": "511400",
            "name": "眉山",
            "name_en": "Meishan Shi"
        },
        {
            "code": "511500",
            "name": "宜宾",
            "name_en": "Yibin Shi"
        },
        {
            "code": "511600",
            "name": "广安",
            "name_en": "Guang,an Shi"
        },
        {
            "code": "511700",
            "name": "达州",
            "name_en": "Dazhou Shi"
        },
        {
            "code": "511800",
            "name": "雅安",
            "name_en": "Ya,an Shi"
        },
        {
            "code": "511900",
            "name": "巴中",
            "name_en": "Bazhong Shi"
        },
        {
            "code": "512000",
            "name": "资阳",
            "name_en": "Ziyang Shi"
        },
        {
            "code": "513200",
            "name": "阿坝藏族羌族自治州",
            "name_en": "Aba(Ngawa) Zangzu Qiangzu Zizhizhou"
        },
        {
            "code": "513300",
            "name": "甘孜藏族自治州",
            "name_en": "Garze Zangzu Zizhizhou"
        },
        {
            "code": "513400",
            "name": "凉山彝族自治州",
            "name_en": "Liangshan Yizu Zizhizhou"
        },
        {
            "code": "520100",
            "name": "贵阳",
            "name_en": "Guiyang Shi"
        },
        {
            "code": "520200",
            "name": "六盘水",
            "name_en": "Liupanshui Shi"
        },
        {
            "code": "520300",
            "name": "遵义",
            "name_en": "Zunyi Shi"
        },
        {
            "code": "520400",
            "name": "安顺",
            "name_en": "Anshun Xian"
        },
        {
            "code": "522200",
            "name": "铜仁地区",
            "name_en": "Tongren Diqu"
        },
        {
            "code": "522300",
            "name": "黔西南布依族苗族自治州",
            "name_en": "Qianxinan Buyeizu Zizhizhou"
        },
        {
            "code": "522400",
            "name": "毕节地区",
            "name_en": "Bijie Diqu"
        },
        {
            "code": "522600",
            "name": "黔东南苗族侗族自治州",
            "name_en": "Qiandongnan Miaozu Dongzu Zizhizhou"
        },
        {
            "code": "522700",
            "name": "黔南布依族苗族自治州",
            "name_en": "Qiannan Buyeizu Miaozu Zizhizhou"
        },
        {
            "code": "530100",
            "name": "昆明",
            "name_en": "Kunming Shi"
        },
        {
            "code": "530300",
            "name": "曲靖",
            "name_en": "Qujing Shi"
        },
        {
            "code": "530400",
            "name": "玉溪",
            "name_en": "Yuxi Shi"
        },
        {
            "code": "530500",
            "name": "保山",
            "name_en": "Baoshan Shi"
        },
        {
            "code": "530600",
            "name": "昭通",
            "name_en": "Zhaotong Shi"
        },
        {
            "code": "530700",
            "name": "丽江",
            "name_en": "Lijiang Shi"
        },
        {
            "code": "530800",
            "name": "普洱",
            "name_en": "Simao Shi"
        },
        {
            "code": "530900",
            "name": "临沧",
            "name_en": "Lincang Shi"
        },
        {
            "code": "532300",
            "name": "楚雄彝族自治州",
            "name_en": "Chuxiong Yizu Zizhizhou"
        },
        {
            "code": "532500",
            "name": "红河哈尼族彝族自治州",
            "name_en": "Honghe Hanizu Yizu Zizhizhou"
        },
        {
            "code": "532600",
            "name": "文山壮族苗族自治州",
            "name_en": "Wenshan Zhuangzu Miaozu Zizhizhou"
        },
        {
            "code": "532800",
            "name": "西双版纳傣族自治州",
            "name_en": "Xishuangbanna Daizu Zizhizhou"
        },
        {
            "code": "532900",
            "name": "大理白族自治州",
            "name_en": "Dali Baizu Zizhizhou"
        },
        {
            "code": "533100",
            "name": "德宏傣族景颇族自治州",
            "name_en": "Dehong Daizu Jingpozu Zizhizhou"
        },
        {
            "code": "533300",
            "name": "怒江傈僳族自治州",
            "name_en": "Nujiang Lisuzu Zizhizhou"
        },
        {
            "code": "533400",
            "name": "迪庆藏族自治州",
            "name_en": "Deqen Zangzu Zizhizhou"
        },
        {
            "code": "540100",
            "name": "拉萨",
            "name_en": "Lhasa Shi"
        },
        {
            "code": "542100",
            "name": "昌都地区",
            "name_en": "Qamdo Diqu"
        },
        {
            "code": "542200",
            "name": "山南地区",
            "name_en": "Shannan Diqu"
        },
        {
            "code": "542300",
            "name": "日喀则地区",
            "name_en": "Xigaze Diqu"
        },
        {
            "code": "542400",
            "name": "那曲地区",
            "name_en": "Nagqu Diqu"
        },
        {
            "code": "542500",
            "name": "阿里地区",
            "name_en": "Ngari Diqu"
        },
        {
            "code": "542600",
            "name": "林芝地区",
            "name_en": "Nyingchi Diqu"
        },
        {
            "code": "610100",
            "name": "西安",
            "name_en": "Xi,an Shi"
        },
        {
            "code": "610200",
            "name": "铜川",
            "name_en": "Tongchuan Shi"
        },
        {
            "code": "610300",
            "name": "宝鸡",
            "name_en": "Baoji Shi"
        },
        {
            "code": "610400",
            "name": "咸阳",
            "name_en": "Xianyang Shi"
        },
        {
            "code": "610500",
            "name": "渭南",
            "name_en": "Weinan Shi"
        },
        {
            "code": "610600",
            "name": "延安",
            "name_en": "Yan,an Shi"
        },
        {
            "code": "610700",
            "name": "汉中",
            "name_en": "Hanzhong Shi"
        },
        {
            "code": "610800",
            "name": "榆林",
            "name_en": "Yulin Shi"
        },
        {
            "code": "610900",
            "name": "安康",
            "name_en": "Ankang Shi"
        },
        {
            "code": "611000",
            "name": "商洛",
            "name_en": "Shangluo Shi"
        },
        {
            "code": "620100",
            "name": "兰州",
            "name_en": "Lanzhou Shi"
        },
        {
            "code": "620200",
            "name": "嘉峪关",
            "name_en": "Jiayuguan Shi"
        },
        {
            "code": "620300",
            "name": "金昌",
            "name_en": "Jinchang Shi"
        },
        {
            "code": "620400",
            "name": "白银",
            "name_en": "Baiyin Shi"
        },
        {
            "code": "620500",
            "name": "天水",
            "name_en": "Tianshui Shi"
        },
        {
            "code": "620600",
            "name": "武威",
            "name_en": "Wuwei Shi"
        },
        {
            "code": "620700",
            "name": "张掖",
            "name_en": "Zhangye Shi"
        },
        {
            "code": "620800",
            "name": "平凉",
            "name_en": "Pingliang Shi"
        },
        {
            "code": "620900",
            "name": "酒泉",
            "name_en": "Jiuquan Shi"
        },
        {
            "code": "621000",
            "name": "庆阳",
            "name_en": "Qingyang Shi"
        },
        {
            "code": "621100",
            "name": "定西",
            "name_en": "Dingxi Shi"
        },
        {
            "code": "621200",
            "name": "陇南",
            "name_en": "Longnan Shi"
        },
        {
            "code": "622900",
            "name": "临夏回族自治州",
            "name_en": "Linxia Huizu Zizhizhou "
        },
        {
            "code": "623000",
            "name": "甘南藏族自治州",
            "name_en": "Gannan Zangzu Zizhizhou"
        },
        {
            "code": "630100",
            "name": "西宁",
            "name_en": "Xining Shi"
        },
        {
            "code": "632100",
            "name": "海东地区",
            "name_en": "Haidong Diqu"
        },
        {
            "code": "632200",
            "name": "海北藏族自治州",
            "name_en": "Haibei Zangzu Zizhizhou"
        },
        {
            "code": "632300",
            "name": "黄南藏族自治州",
            "name_en": "Huangnan Zangzu Zizhizhou"
        },
        {
            "code": "632500",
            "name": "海南藏族自治州",
            "name_en": "Hainan Zangzu Zizhizhou"
        },
        {
            "code": "632600",
            "name": "果洛藏族自治州",
            "name_en": "Golog Zangzu Zizhizhou"
        },
        {
            "code": "632700",
            "name": "玉树藏族自治州",
            "name_en": "Yushu Zangzu Zizhizhou"
        },
        {
            "code": "632800",
            "name": "海西蒙古族藏族自治州",
            "name_en": "Haixi Mongolzu Zangzu Zizhizhou"
        },
        {
            "code": "640100",
            "name": "银川",
            "name_en": "Yinchuan Shi"
        },
        {
            "code": "640200",
            "name": "石嘴山",
            "name_en": "Shizuishan Shi"
        },
        {
            "code": "640300",
            "name": "吴忠",
            "name_en": "Wuzhong Shi"
        },
        {
            "code": "640400",
            "name": "固原",
            "name_en": "Guyuan Shi"
        },
        {
            "code": "640500",
            "name": "中卫",
            "name_en": "Zhongwei Shi"
        },
        {
            "code": "650100",
            "name": "乌鲁木齐",
            "name_en": "Urumqi Shi"
        },
        {
            "code": "650200",
            "name": "克拉玛依",
            "name_en": "Karamay Shi"
        },
        {
            "code": "652100",
            "name": "吐鲁番地区",
            "name_en": "Turpan Diqu"
        },
        {
            "code": "652200",
            "name": "哈密地区",
            "name_en": "Hami(kumul) Diqu"
        },
        {
            "code": "652300",
            "name": "昌吉回族自治州",
            "name_en": "Changji Huizu Zizhizhou"
        },
        {
            "code": "652700",
            "name": "博尔塔拉蒙古自治州",
            "name_en": "Bortala Monglo Zizhizhou"
        },
        {
            "code": "652800",
            "name": "巴音郭楞蒙古自治州",
            "name_en": "bayinguolengmengguzizhizhou"
        },
        {
            "code": "652900",
            "name": "阿克苏地区",
            "name_en": "Aksu Diqu"
        },
        {
            "code": "653000",
            "name": "克孜勒苏柯尔克孜自治州",
            "name_en": "Kizilsu Kirgiz Zizhizhou"
        },
        {
            "code": "653100",
            "name": "喀什地区",
            "name_en": "Kashi(Kaxgar) Diqu"
        },
        {
            "code": "653200",
            "name": "和田地区",
            "name_en": "Hotan Diqu"
        },
        {
            "code": "654000",
            "name": "伊犁哈萨克自治州",
            "name_en": "Ili Kazak Zizhizhou"
        },
        {
            "code": "654200",
            "name": "塔城地区",
            "name_en": "Tacheng(Qoqek) Diqu"
        },
        {
            "code": "654300",
            "name": "阿勒泰地区",
            "name_en": "Altay Diqu"
        },
        {
            "code": "659000",
            "name": "自治区直辖县级行政区划",
            "name_en": "zizhiquzhixiaxianjixingzhengquhua"
        }
    ]
};
//模拟数据
var DATA_JSON = {
    "allCityList": [{
        "name": "阿坝123",
        "spellName": "aba",
        "id": 5780,
        "fullname": "四川/阿坝",
        "sortLetters": "a"
    }, {
        "name": "阿克苏111111111",
        "spellName": "akesudi",
        "id": 6474,
        "fullname": "新疆/阿克苏",
        "sortLetters": "a"
    }, {
        "name": "阿拉善",
        "spellName": "alashanmeng",
        "id": 3862,
        "fullname": "内蒙古/阿拉善",
        "sortLetters": "a"
    }, {
        "name": "阿勒泰",
        "spellName": "aletaidi",
        "id": 6542,
        "fullname": "新疆/阿勒泰",
        "sortLetters": "a"
    }, {
        "name": "阿里",
        "spellName": "alidi",
        "id": 6134,
        "fullname": "西藏/阿里",
        "sortLetters": "a"
    }, {
        "name": "安康",
        "spellName": "ankang",
        "id": 6248,
        "fullname": "陕西/安康",
        "sortLetters": "a"
    }, {
        "name": "安庆",
        "spellName": "anqing",
        "id": 4482,
        "fullname": "安徽/安庆",
        "sortLetters": "a"
    }, {
        "name": "鞍山",
        "spellName": "anshan",
        "id": 3898,
        "fullname": "辽宁/鞍山",
        "sortLetters": "a"
    }, {
        "name": "安顺",
        "spellName": "anshun",
        "id": 5861,
        "fullname": "贵州/安顺",
        "sortLetters": "a"
    }, {
        "name": "安阳",
        "spellName": "anyang",
        "id": 4966,
        "fullname": "河南/安阳",
        "sortLetters": "a"
    }, {
        "name": "白城",
        "spellName": "baicheng",
        "id": 4041,
        "fullname": "吉林/白城",
        "sortLetters": "b"
    }, {
        "name": "百色",
        "spellName": "baise",
        "id": 5527,
        "fullname": "广西/百色",
        "sortLetters": "b"
    }, {
        "name": "白沙",
        "spellName": "baishalizuz",
        "id": 5582,
        "fullname": "海南/白沙",
        "sortLetters": "b"
    }, {
        "name": "白山",
        "spellName": "baishan",
        "id": 4028,
        "fullname": "吉林/白山",
        "sortLetters": "b"
    }, {
        "name": "白银",
        "spellName": "baiyin",
        "id": 6279,
        "fullname": "甘肃/白银",
        "sortLetters": "b"
    }, {
        "name": "蚌埠",
        "spellName": "bangbu",
        "id": 4452,
        "fullname": "安徽/蚌埠",
        "sortLetters": "b"
    }, {
        "name": "保定",
        "spellName": "baoding",
        "id": 3545,
        "fullname": "河北/保定",
        "sortLetters": "b"
    }, {
        "name": "宝鸡",
        "spellName": "baoji",
        "id": 6169,
        "fullname": "陕西/宝鸡",
        "sortLetters": "b"
    }, {
        "name": "保山",
        "spellName": "baoshan",
        "id": 5961,
        "fullname": "云南/保山",
        "sortLetters": "b"
    }, {
        "name": "保亭",
        "spellName": "baotinglizu",
        "id": 5585,
        "fullname": "海南/保亭",
        "sortLetters": "b"
    }, {
        "name": "包头",
        "spellName": "baotou",
        "id": 3770,
        "fullname": "内蒙古/包头",
        "sortLetters": "b"
    }, {
        "name": "巴彦淖尔",
        "spellName": "bayannaoerm",
        "id": 3854,
        "fullname": "内蒙古/巴彦淖尔",
        "sortLetters": "b"
    }, {
        "name": "巴音郭楞",
        "spellName": "bayinguolen",
        "id": 6501,
        "fullname": "新疆/巴音郭楞",
        "sortLetters": "b"
    }, {
        "name": "巴中",
        "spellName": "bazhong",
        "id": 5770,
        "fullname": "四川/巴中",
        "sortLetters": "b"
    }, {
        "name": "北海",
        "spellName": "beihai",
        "id": 5501,
        "fullname": "广西/北海",
        "sortLetters": "b"
    }, {
        "name": "北京",
        "spellName": "beijing",
        "id": 6550,
        "fullname": "北京/北京",
        "sortLetters": "b"
    }, {
        "name": "本溪",
        "spellName": "benxi",
        "id": 3914,
        "fullname": "辽宁/本溪",
        "sortLetters": "b"
    }, {
        "name": "毕节地",
        "spellName": "bijiedi",
        "id": 5879,
        "fullname": "贵州/毕节地",
        "sortLetters": "b"
    }, {
        "name": "滨州",
        "spellName": "binzhou",
        "id": 4867,
        "fullname": "山东/滨州",
        "sortLetters": "b"
    }, {
        "name": "博尔塔拉",
        "spellName": "boertala",
        "id": 6520,
        "fullname": "新疆/博尔塔拉",
        "sortLetters": "b"
    }, {
        "name": "沧州",
        "spellName": "cangzhou",
        "id": 3601,
        "fullname": "河北/沧州",
        "sortLetters": "c"
    }, {
        "name": "长春",
        "spellName": "changchun",
        "id": 3987,
        "fullname": "吉林/长春",
        "sortLetters": "c"
    }, {
        "name": "常德",
        "spellName": "changde",
        "id": 5235,
        "fullname": "湖南/常德",
        "sortLetters": "c"
    }, {
        "name": "昌都",
        "spellName": "changdudi",
        "id": 6090,
        "fullname": "西藏/昌都",
        "sortLetters": "c"
    }, {
        "name": "昌吉",
        "spellName": "changji",
        "id": 6511,
        "fullname": "新疆/昌吉",
        "sortLetters": "c"
    }, {
        "name": "昌江",
        "spellName": "changjiangl",
        "id": 5581,
        "fullname": "海南/昌江",
        "sortLetters": "c"
    }, {
        "name": "长沙",
        "spellName": "changsha",
        "id": 5174,
        "fullname": "湖南/长沙",
        "sortLetters": "c"
    }, {
        "name": "长治",
        "spellName": "changzhi",
        "id": 3667,
        "fullname": "山西/长治",
        "sortLetters": "c"
    }, {
        "name": "常州",
        "spellName": "changzhou",
        "id": 4309,
        "fullname": "江苏/常州",
        "sortLetters": "c"
    }, {
        "name": "巢湖",
        "spellName": "chaohu",
        "id": 4526,
        "fullname": "安徽/巢湖",
        "sortLetters": "c"
    }, {
        "name": "朝阳",
        "spellName": "chaoyang",
        "id": 3979,
        "fullname": "辽宁/朝阳",
        "sortLetters": "c"
    }, {
        "name": "潮州",
        "spellName": "chaozhou",
        "id": 5436,
        "fullname": "广东/潮州",
        "sortLetters": "c"
    }, {
        "name": "承德",
        "spellName": "chengde",
        "id": 3589,
        "fullname": "河北/承德",
        "sortLetters": "c"
    }, {
        "name": "成都",
        "spellName": "chengdu",
        "id": 5630,
        "fullname": "四川/成都",
        "sortLetters": "c"
    }, {
        "name": "澄迈",
        "spellName": "chengmai",
        "id": 5578,
        "fullname": "海南/澄迈",
        "sortLetters": "c"
    }, {
        "name": "郴州",
        "spellName": "chenzhou",
        "id": 5257,
        "fullname": "湖南/郴州",
        "sortLetters": "c"
    }, {
        "name": "赤峰",
        "spellName": "chifeng",
        "id": 3784,
        "fullname": "内蒙古/赤峰",
        "sortLetters": "c"
    }, {
        "name": "池州",
        "spellName": "chizhou",
        "id": 4545,
        "fullname": "安徽/池州",
        "sortLetters": "c"
    }, {
        "name": "重庆",
        "spellName": "chongqing",
        "id": 5587,
        "fullname": "重庆/重庆",
        "sortLetters": "c"
    }, {
        "name": "崇左",
        "spellName": "chongzuo",
        "id": 5563,
        "fullname": "广西/崇左",
        "sortLetters": "c"
    }, {
        "name": "楚雄",
        "spellName": "chuxiong",
        "id": 6031,
        "fullname": "云南/楚雄",
        "sortLetters": "c"
    }, {
        "name": "滁州",
        "spellName": "chuzhou",
        "id": 4502,
        "fullname": "安徽/滁州",
        "sortLetters": "c"
    }, {
        "name": "大理",
        "spellName": "dali",
        "id": 6042,
        "fullname": "云南/大理",
        "sortLetters": "d"
    }, {
        "name": "大连",
        "spellName": "dalian",
        "id": 3887,
        "fullname": "辽宁/大连",
        "sortLetters": "d"
    }, {
        "name": "丹东",
        "spellName": "dandong",
        "id": 3921,
        "fullname": "辽宁/丹东",
        "sortLetters": "d"
    }, {
        "name": "大庆",
        "spellName": "daqing",
        "id": 4120,
        "fullname": "黑龙江/大庆",
        "sortLetters": "d"
    }, {
        "name": "大同",
        "spellName": "datong",
        "id": 3651,
        "fullname": "山西/大同",
        "sortLetters": "d"
    }, {
        "name": "大兴安岭",
        "spellName": "daxinganlin",
        "id": 4194,
        "fullname": "黑龙江/大兴安岭",
        "sortLetters": "d"
    }, {
        "name": "达州",
        "spellName": "dazhou",
        "id": 5746,
        "fullname": "四川/达州",
        "sortLetters": "d"
    }, {
        "name": "德宏",
        "spellName": "dehong",
        "id": 6055,
        "fullname": "云南/德宏",
        "sortLetters": "d"
    }, {
        "name": "德阳",
        "spellName": "deyang",
        "id": 5671,
        "fullname": "四川/德阳",
        "sortLetters": "d"
    }, {
        "name": "德州",
        "spellName": "dezhou",
        "id": 4846,
        "fullname": "山东/德州",
        "sortLetters": "d"
    },  {
        "name": "东莞",
        "spellName": "dongwan",
        "id": 5380,
        "fullname": "广东/东莞",
        "sortLetters": "d"
    },  {
        "name": "鄂尔多斯",
        "spellName": "eerduosi",
        "id": 3806,
        "fullname": "内蒙古/鄂尔多斯",
        "sortLetters": "e"
    }, {
        "name": "恩施",
        "spellName": "enshi",
        "id": 5162,
        "fullname": "湖北/恩施",
        "sortLetters": "e"
    }, {
        "name": "鄂州",
        "spellName": "ezhou",
        "id": 5129,
        "fullname": "湖北/鄂州",
        "sortLetters": "e"
    }, {
        "name": "防城港",
        "spellName": "fangchengga",
        "id": 5506,
        "fullname": "广西/防城港",
        "sortLetters": "f"
    }, {
        "name": "佛山",
        "spellName": "foshan",
        "id": 5390,
        "fullname": "广东/佛山",
        "sortLetters": "f"
    }, {
        "name": "抚顺",
        "spellName": "fushun",
        "id": 3906,
        "fullname": "辽宁/抚顺",
        "sortLetters": "f"
    }, {
        "name": "阜新",
        "spellName": "fuxin",
        "id": 3955,
        "fullname": "辽宁/阜新",
        "sortLetters": "f"
    }, {
        "name": "阜阳",
        "spellName": "fuyang",
        "id": 4511,
        "fullname": "安徽/阜阳",
        "sortLetters": "f"
    }, {
        "name": "抚州",
        "spellName": "fuzhou",
        "id": 4718,
        "fullname": "江西/抚州",
        "sortLetters": "f"
    }, {
        "name": "福州",
        "spellName": "fuzhou",
        "id": 4558,
        "fullname": "福建/福州",
        "sortLetters": "f"
    }, {
        "name": "甘南",
        "spellName": "gannan",
        "id": 6349,
        "fullname": "甘肃/甘南",
        "sortLetters": "g"
    }, {
        "name": "赣州",
        "spellName": "ganzhou",
        "id": 4677,
        "fullname": "江西/赣州",
        "sortLetters": "g"
    }, {
        "name": "甘孜",
        "spellName": "ganzi",
        "id": 5794,
        "fullname": "四川/甘孜",
        "sortLetters": "g"
    }, {
        "name": "广安",
        "spellName": "guangan",
        "id": 5740,
        "fullname": "四川/广安",
        "sortLetters": "g"
    }, {
        "name": "广元",
        "spellName": "guangyuan",
        "id": 5688,
        "fullname": "四川/广元",
        "sortLetters": "g"
    }, {
        "name": "广州",
        "spellName": "guangzhou",
        "id": 5308,
        "fullname": "广东/广州",
        "sortLetters": "g"
    }, {
        "name": "贵港",
        "spellName": "guigang",
        "id": 5516,
        "fullname": "广西/贵港",
        "sortLetters": "g"
    }, {
        "name": "桂林",
        "spellName": "guilin",
        "id": 5475,
        "fullname": "广西/桂林",
        "sortLetters": "g"
    }, {
        "name": "贵阳",
        "spellName": "guiyang",
        "id": 5831,
        "fullname": "贵州/贵阳",
        "sortLetters": "g"
    }, {
        "name": "果洛",
        "spellName": "guoluo",
        "id": 6398,
        "fullname": "青海/果洛",
        "sortLetters": "g"
    }, {
        "name": "固原",
        "spellName": "guyuan",
        "id": 6436,
        "fullname": "宁夏/固原",
        "sortLetters": "g"
    }, {
        "name": "哈尔滨",
        "spellName": "haerbin",
        "id": 4056,
        "fullname": "黑龙江/哈尔滨",
        "sortLetters": "h"
    }, {
        "name": "海北",
        "spellName": "haibei",
        "id": 6382,
        "fullname": "青海/海北",
        "sortLetters": "h"
    }, {
        "name": "海东",
        "spellName": "haidongdi",
        "id": 6375,
        "fullname": "青海/海东",
        "sortLetters": "h"
    }, {
        "name": "海口",
        "spellName": "haikou",
        "id": 5570,
        "fullname": "海南/海口",
        "sortLetters": "h"
    }, {
        "name": "海南",
        "spellName": "hainan",
        "id": 6392,
        "fullname": "青海/海南",
        "sortLetters": "h"
    }, {
        "name": "海西",
        "spellName": "haixi",
        "id": 6412,
        "fullname": "青海/海西",
        "sortLetters": "h"
    }, {
        "name": "哈密",
        "spellName": "hamidi",
        "id": 6461,
        "fullname": "新疆/哈密",
        "sortLetters": "h"
    }, {
        "name": "邯郸",
        "spellName": "handan",
        "id": 3505,
        "fullname": "河北/邯郸",
        "sortLetters": "h"
    }, {
        "name": "杭州",
        "spellName": "hangzhou",
        "id": 4337,
        "fullname": "浙江/杭州",
        "sortLetters": "h"
    }, {
        "name": "汉中",
        "spellName": "hanzhong",
        "id": 6223,
        "fullname": "陕西/汉中",
        "sortLetters": "h"
    }, {
        "name": "亳州",
        "spellName": "haozhou",
        "id": 4540,
        "fullname": "安徽/亳州",
        "sortLetters": "h"
    }, {
        "name": "漯河",
        "spellName": "he",
        "id": 4990,
        "fullname": "河南/漯河",
        "sortLetters": "h"
    },  {
        "name": "河池",
        "spellName": "hechi",
        "id": 5544,
        "fullname": "广西/河池",
        "sortLetters": "h"
    }, {
        "name": "合肥",
        "spellName": "hefei",
        "id": 4436,
        "fullname": "安徽/合肥",
        "sortLetters": "h"
    }, {
        "name": "鹤岗",
        "spellName": "hegang",
        "id": 4092,
        "fullname": "黑龙江/鹤岗",
        "sortLetters": "h"
    }, {
        "name": "黑河",
        "spellName": "heihe",
        "id": 4176,
        "fullname": "黑龙江/黑河",
        "sortLetters": "h"
    }, {
        "name": "衡水",
        "spellName": "hengshui",
        "id": 3629,
        "fullname": "河北/衡水",
        "sortLetters": "h"
    }, {
        "name": "衡阳",
        "spellName": "hengyang",
        "id": 5200,
        "fullname": "湖南/衡阳",
        "sortLetters": "h"
    }, {
        "name": "菏泽",
        "spellName": "heze",
        "id": 4875,
        "fullname": "山东/菏泽",
        "sortLetters": "h"
    }, {
        "name": "贺州",
        "spellName": "hezhou",
        "id": 5539,
        "fullname": "广西/贺州",
        "sortLetters": "h"
    }, {
        "name": "红河",
        "spellName": "honghe",
        "id": 6013,
        "fullname": "云南/红河",
        "sortLetters": "h"
    }, {
        "name": "淮安",
        "spellName": "huaian",
        "id": 4253,
        "fullname": "江苏/淮安",
        "sortLetters": "h"
    }, {
        "name": "淮北",
        "spellName": "huaibei",
        "id": 4472,
        "fullname": "安徽/淮北",
        "sortLetters": "h"
    }, {
        "name": "怀化",
        "spellName": "huaihua",
        "id": 5281,
        "fullname": "湖南/怀化",
        "sortLetters": "h"
    }, {
        "name": "淮南",
        "spellName": "huainan",
        "id": 4460,
        "fullname": "安徽/淮南",
        "sortLetters": "h"
    }, {
        "name": "黄冈",
        "spellName": "huanggang",
        "id": 5141,
        "fullname": "湖北/黄冈",
        "sortLetters": "h"
    }, {
        "name": "黄南",
        "spellName": "huangnan",
        "id": 6387,
        "fullname": "青海/黄南",
        "sortLetters": "h"
    }, {
        "name": "黄山",
        "spellName": "huangshan",
        "id": 4494,
        "fullname": "安徽/黄山",
        "sortLetters": "h"
    }, {
        "name": "惠州",
        "spellName": "huizhou",
        "id": 5369,
        "fullname": "广东/惠州",
        "sortLetters": "h"
    }, {
        "name": "葫芦岛",
        "spellName": "huludao",
        "id": 3936,
        "fullname": "辽宁/葫芦岛",
        "sortLetters": "h"
    }, {
        "name": "呼伦贝尔",
        "spellName": "hulunbeier",
        "id": 3815,
        "fullname": "内蒙古/呼伦贝尔",
        "sortLetters": "h"
    }, {
        "name": "吉安",
        "spellName": "jian",
        "id": 4695,
        "fullname": "江西/吉安",
        "sortLetters": "j"
    }, {
        "name": "江门",
        "spellName": "jiangmen",
        "id": 5382,
        "fullname": "广东/江门",
        "sortLetters": "j"
    }, {
        "name": "焦作",
        "spellName": "jiaozuo",
        "id": 4936,
        "fullname": "河南/焦作",
        "sortLetters": "j"
    }, {
        "name": "嘉兴",
        "spellName": "jiaxing",
        "id": 4375,
        "fullname": "浙江/嘉兴",
        "sortLetters": "j"
    }, {
        "name": "揭阳",
        "spellName": "jieyang",
        "id": 5440,
        "fullname": "广东/揭阳",
        "sortLetters": "j"
    }, {
        "name": "吉林",
        "spellName": "jilin",
        "id": 3998,
        "fullname": "吉林/吉林",
        "sortLetters": "j"
    }, {
        "name": "济南",
        "spellName": "jinan",
        "id": 4741,
        "fullname": "山东/济南",
        "sortLetters": "j"
    },  {
        "name": "景德镇",
        "spellName": "jingdezhen",
        "id": 4651,
        "fullname": "江西/景德镇",
        "sortLetters": "j"
    }, {
        "name": "荆门",
        "spellName": "jingmen",
        "id": 5123,
        "fullname": "湖北/荆门",
        "sortLetters": "j"
    }, {
        "name": "荆州",
        "spellName": "jingzhou",
        "id": 5100,
        "fullname": "湖北/荆州",
        "sortLetters": "j"
    }, {
        "name": "金华",
        "spellName": "jinhua",
        "id": 4394,
        "fullname": "浙江/金华",
        "sortLetters": "j"
    }, {
        "name": "济宁",
        "spellName": "jining",
        "id": 4818,
        "fullname": "山东/济宁",
        "sortLetters": "j"
    }, {
        "name": "晋中",
        "spellName": "jinzhong",
        "id": 3692,
        "fullname": "山西/晋中",
        "sortLetters": "j"
    }, {
        "name": "锦州",
        "spellName": "jinzhou",
        "id": 3928,
        "fullname": "辽宁/锦州",
        "sortLetters": "j"
    }, {
        "name": "九江",
        "spellName": "jiujiang",
        "id": 4660,
        "fullname": "江西/九江",
        "sortLetters": "j"
    }, {
        "name": "酒泉",
        "spellName": "jiuquan",
        "id": 6314,
        "fullname": "甘肃/酒泉",
        "sortLetters": "j"
    }, {
        "name": "鸡西",
        "spellName": "jixi",
        "id": 4110,
        "fullname": "黑龙江/鸡西",
        "sortLetters": "j"
    }, {
        "name": "开封",
        "spellName": "kaifeng",
        "id": 4898,
        "fullname": "河南/开封",
        "sortLetters": "k"
    }, {
        "name": "喀什",
        "spellName": "kashidi",
        "id": 6484,
        "fullname": "新疆/喀什",
        "sortLetters": "k"
    }, {
        "name": "克拉玛依",
        "spellName": "kelamayi",
        "id": 6451,
        "fullname": "新疆/克拉玛依",
        "sortLetters": "k"
    }, {
        "name": "昆明",
        "spellName": "kunming",
        "id": 5927,
        "fullname": "云南/昆明",
        "sortLetters": "k"
    }, {
        "name": "莱芜",
        "spellName": "laiwu",
        "id": 4830,
        "fullname": "山东/莱芜",
        "sortLetters": "l"
    }, {
        "name": "廊坊",
        "spellName": "langfang",
        "id": 3618,
        "fullname": "河北/廊坊",
        "sortLetters": "l"
    }, {
        "name": "兰州",
        "spellName": "lanzhou",
        "id": 6267,
        "fullname": "甘肃/兰州",
        "sortLetters": "l"
    }, {
        "name": "拉萨",
        "spellName": "lasa",
        "id": 6070,
        "fullname": "西藏/拉萨",
        "sortLetters": "l"
    },  {
        "name": "凉山",
        "spellName": "liangshan",
        "id": 5813,
        "fullname": "四川/凉山",
        "sortLetters": "l"
    }, {
        "name": "连云港",
        "spellName": "lianyungang",
        "id": 4245,
        "fullname": "江苏/连云港",
        "sortLetters": "l"
    }, {
        "name": "聊城",
        "spellName": "liaocheng",
        "id": 4858,
        "fullname": "山东/聊城",
        "sortLetters": "l"
    }, {
        "name": "辽阳",
        "spellName": "liaoyang",
        "id": 3963,
        "fullname": "辽宁/辽阳",
        "sortLetters": "l"
    }, {
        "name": "辽源",
        "spellName": "liaoyuan",
        "id": 4015,
        "fullname": "吉林/辽源",
        "sortLetters": "l"
    }, {
        "name": "丽江",
        "spellName": "lijiang",
        "id": 5999,
        "fullname": "云南/丽江",
        "sortLetters": "l"
    }, {
        "name": "临沧",
        "spellName": "lincangdi",
        "id": 5990,
        "fullname": "云南/临沧",
        "sortLetters": "l"
    }, {
        "name": "临汾",
        "spellName": "linfen",
        "id": 3730,
        "fullname": "山西/临汾",
        "sortLetters": "l"
    }, {
        "name": "陵水",
        "spellName": "lingshuiliz",
        "id": 5584,
        "fullname": "海南/陵水",
        "sortLetters": "l"
    }, {
        "name": "临夏",
        "spellName": "linxia",
        "id": 6358,
        "fullname": "甘肃/临夏",
        "sortLetters": "l"
    }, {
        "name": "临沂",
        "spellName": "linyi",
        "id": 4833,
        "fullname": "山东/临沂",
        "sortLetters": "l"
    }, {
        "name": "林芝",
        "spellName": "linzhidi",
        "id": 6142,
        "fullname": "西藏/林芝",
        "sortLetters": "l"
    }, {
        "name": "丽水",
        "spellName": "lishui",
        "id": 4426,
        "fullname": "浙江/丽水",
        "sortLetters": "l"
    }, {
        "name": "六安",
        "spellName": "liuan",
        "id": 4532,
        "fullname": "安徽/六安",
        "sortLetters": "l"
    }, {
        "name": "六盘水",
        "spellName": "liupanshui",
        "id": 5842,
        "fullname": "贵州/六盘水",
        "sortLetters": "l"
    }, {
        "name": "柳州",
        "spellName": "liuzhou",
        "id": 5464,
        "fullname": "广西/柳州",
        "sortLetters": "l"
    }],
    "bcode": 0
};

class SelectCity extends PageComponent {
    constructor(props) {
        super(props);
        var getSectionData = (dataBlob, sectionID) => {
            return dataBlob[sectionID];
        };
        var getRowData = (dataBlob, sectionID, rowID) => {
            return dataBlob[rowID];
        };
        this.state = {
            dataSource: new ListView.DataSource({
                getRowData: getRowData,
                getSectionHeaderData: getSectionData,
                rowHasChanged: (row1, row2) => row1 !== row2,
                sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
            }),
            isSearch: true,
            show: false,
            value: "",
            maskShow:false,
            Data:[],
            searchData:[],
            hotCityId:true,
        }
        that = this;
    }

    renderRow(rowData, rowId) {
        return (
            <BCTouchable
                key={rowId}
                style={{height: ROWHEIGHT, justifyContent: 'center', paddingLeft: px2dp(24),}}
                onPress={() => {

                    that.changeData(rowData)

                }}>
                <View style={styles.rowdata}><BCText style={styles.rowdatatext}>{rowData.AreaName}</BCText></View>
            </BCTouchable>
        )
    }

    renderSectionHeader = (sectionData, sectionID) => {
        return (
            <View>
                {sectionData=='A'?
                <View >
                    <View style={[gs.bgc_fff, {height: px2dp(30), justifyContent: 'center'}]}>
                        <BCText style={[gs.fts_15, {color: '#666666', marginLeft: px2dp(17), marginTop: px2dp(8)}]}>热门城市</BCText>
                    </View>
                    <View style={styles.hotCity }>
                        {
                            // ['北京', '上海', '广州', '重庆', '深圳', '天津', '杭州', '苏州', '武汉',]
                            this.state.hotCities.map((item, index) => {
                                return (
                                    <BCTouchable key={index} style={[gs.bgc_fff, styles.hotView]} onPress={() => {
                                        that.changeData(item)
                                    }}>
                                        <BCText style={[gs.fts_15, {color: "#000"}]}>
                                            {item.AreaName}
                                        </BCText>
                                    </BCTouchable>
                                );
                            })
                        }
                    </View>
                </View>:null}
                <View style={{height: SECTIONHEIGHT, justifyContent: 'center', }}>
                    <BCText style={{color: '#c4c4c4', fontWeight: 'bold', marginLeft: px2dp(17)}}>
                        {sectionData}
                    </BCText>
                </View>
            </View>
        )
    }
    // render ringht index Letters  右侧字母
    renderLetters(letter, index) {
        return (
            <BCTouchable key={index} activeOpacity={0.6} onPress={() => {
                this.scrollTo(index)
            }}>
                <View style={[styles.letter]}>
                    <BCText style={styles.letterText}>{letter}</BCText>
                </View>
            </BCTouchable>
        )
    }

    //回调改变显示的市
    changeData = (cityName) => {
        const {navigation} = this.props;
        navigation.state.params.changeCity(cityName);
        navigation.state.params.callBack();
        navigation.goBack();
    }

    //touch right indexLetters, scroll the left
    scrollTo = (index) => {
        let position = 0;
        for (let i = 0; i < index; i++) {
            position += totalheight[i]
        }
        this._listView.scrollTo({
            y: position
        })

    }

    maks() {
        return (
            this.state.isSearch ? (
                <View style={[styles.maks, gs.bgc_000]}><BCText
                    style={{color: '#ff0000'}}>fff</BCText></View>
            ) : (null)
        )
    }

    //获取value值调用的方法
    getValue() {
        let Data=this.state.Data;
        let value=this.state.value;
        let searchArray=[]
        for(var i=0;i<Data.length;i++){
            if(value==Data[i].AreaName||
                value.substr(0,1)==Data[i].AreaName.substr(0,1)||
                value.toLowerCase()==Data[i].FullSpell||
                value==Data[i].FullSpell||
                value==Data[i].SimpleSpell||
                value.toLowerCase()==Data[i].SimpleSpell||
                value==Data[i].SimpleSpell.substr(0,1)||
                value.toLowerCase()==Data[i].SimpleSpell.substr(0,1)
            ){
                searchArray.push({AreaName:Data[i].AreaName,AreaId:Data[i].AreaId})
            }
        }
        this.setState({
            show: true,
            value: this.state.value,
            maskShow:true,
            searchData:searchArray,
        });

    }

    //隐藏
    onHide(val) {
        this.setState({
            show: false,
            value: val
        });
    }

    onBack() {
        const {navigation} = this.props;
        if (navigator) {
            navigation.goBack();
        }
    }

    onSearch() {
        this.setState({
            isSearch: !this.state.isSearch,
            showMaks: true,
        });
    }
    onCancel(){
        this.setState({
            isSearch: !this.state.isSearch,
            show: false,
        });
    }
    onShow() {
        this.setState({showMaks: true});
    }

    //头部搜索
    renderTop(){
        return(
            <View>
                {
                    this.state.isSearch ?
                        <View style={[styles.navigator, gs.bgc_f9f9f9, gs.bdc_bdbdbd]}>
                            <TouchableOpacity activeOpacity={0.3} style={[styles.leftButton]}
                                              onPress={() => this.onBack()}>
                                <Image source={require('../imgs/Return.png')}></Image>
                            </TouchableOpacity>
                            <BCTouchable style={styles.searchBox} onPress={() => this.onSearch()}>
                                <BCImage style={styles.seacrhIcon} source={require('../imgs/search.png')}/>
                                <BCText style={[styles.searchBar, gs.fts_14,]}>输入城市名或首字母</BCText>
                            </BCTouchable>
                        </View> :
                        <View style={[styles.navigator, gs.bgc_f9f9f9, gs.bdc_bdbdbd]}>
                            <View style={styles.searchBox1}>
                                <BCTouchable activeOpacity={0.9}>
                                    <BCImage style={styles.searchIcon} source={require('../imgs/search.png')}/>
                                </BCTouchable>
                                <TextInput
                                    autoFocus={true}
                                    returnKeyType="search"
                                    placeholder="输入城市名或首字母"
                                    placeholderTextColor="#b7b7b7"
                                    underlineColorAndroid='transparent'
                                    style={[styles.searchBar1, gs.fts_14,]}
                                    ref="inputText"
                                    value={this.state.value}
                                    onChangeText={(text) => {
                                        this.state.value = text;
                                        this.getValue()
                                    }}
                                />
                            </View>
                            <BCTouchable activeOpacity={0.3} style={styles.rightButton} onPress={() => this.onCancel()}>
                                <BCText style={[gs.c_BaseColor, gs.fts_15]}>取消</BCText>
                            </BCTouchable>
                        </View>
                }
            </View>
        )
    }
    //搜索结果
    renderSearch(){
        return(
            <View>
                {this.state.show ?
                    <ScrollView style={[styles.result, gs.bgc_fff]}>
                        {this.state.searchData.map((item,index)=>{
                            return(
                            <BCTouchable style={[styles.row, ]} onPress={() => {this.onHide(item);that.changeData(item)}}>
                                <View style={[styles.border, {borderBottomColor: "#e3e3e3"}]}>
                                    <BCText style={[gs.fts_14, gs.c_3a3838, {width: deviceWidth - px2dp(39)}]}>{substr(item.AreaName, 23)}</BCText>
                                </View>
                            </BCTouchable>
                            )
                        })}
                    </ScrollView>
                    // <View style={[styles.result, gs.bgc_fff]}>
                    //     <BCTouchable style={[styles.row, ]} onPress={() => {this.onHide('北京');that.changeData('北京')}}>
                    //         <View style={[styles.border, {borderBottomColor: "#e3e3e3"}]}>
                    //             <BCText numberOfLines={1}
                    //                     style={[gs.fts_14, gs.c_3a3838, {width: deviceWidth - px2dp(39)}]}>{substr('北京', 23)}</BCText>
                    //         </View>
                    //     </BCTouchable>
                    //     <BCTouchable style={[styles.row, gs.bgc_fff,]} onPress={() => {this.onHide('杭州');that.changeData('杭州')}}>
                    //         <View style={[styles.border, {borderBottomColor: "#e3e3e3"}]}>
                    //             <BCText
                    //                 style={[gs.fts_14, gs.c_3a3838, {width: deviceWidth - px2dp(39)}]}>{substr(this.state.value + '杭州', 23)}</BCText>
                    //         </View>
                    //     </BCTouchable>
                    // </View>
                    : null
                }
            </View>
        )
    }

    render() {
        return (
            <View style={{height: deviceHeight, marginBottom: px2dp(10)}}>
                {this.renderTop()}
                {/*{
                    this.state.maskShow?
                        <View style={[styles.maks, gs.bgc_000]}></View>
                        : null
                }*/}
                {this.renderSearch()}

                {/*<View style={[{height: px2dp(40), justifyContent: "center",backgroundColor:'#fff'}]}>*/}
                    {/*<BCText style={[gs.fts_15, gs.c_666, {marginLeft: px2dp(17)}]}>定位城市</BCText>*/}
                {/*</View>*/}
                {/*<View style={[gs.bgc_fff, {height: px2dp(40), alignItems: "center", flexDirection: "row"}]}>*/}
                    {/*<BCText style={[gs.fts_15, {marginLeft: px2dp(17), color: "#000"}]}>杭州</BCText>*/}
                    {/*<BCTouchable><BCText style={[gs.fts_14, gs.c_888, {marginLeft: px2dp(10)}]}>GPS定位</BCText></BCTouchable>*/}
                {/*</View>*/}
                <View style={{ height: deviceHeight- (Platform.OS === 'ios' ? px2dp(65):px2dp(45))-px2dp(25)}}>
                <ListView
                    contentContainerStyle={styles.contentContainer}
                    ref={listView => this._listView = listView}
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow.bind(this)}
                    renderSectionHeader={this.renderSectionHeader}
                    enableEmptySections={true}
                    initialListSize={500}
                />
                </View>
                <View style={[styles.letters,{marginTop:-px2dp(22)}]}>
                    {letters.map((letter, index) => this.renderLetters(letter, index))}
                </View>
                {/*<View style={{width:'100%',height:Platform.OS=='ios'?px2dp(50):px2dp(26)}}/>*/}
            </View>
        );
    }

    WillMount() {
        const {dispatch} = this.props;
        dispatch(ActionCities());
    }
    WillReceive(nextProps){
        if (nextProps.ReduceCities.datas !== null && nextProps.ReduceCities.datas !== this.props.ReduceCities.datas) {
            const {ReduceCities} = nextProps;
            let Provinces = ReduceCities.datas;
            let Cities=[]
            Provinces.map((item,index)=>{
                for(var i=0;i<item.Children.length;i++){
                    Cities.push(item.Children[i])
                }
            })
            this.state.Data=Cities;

            let Data=this.state.Data;
            let city=[];
            for (let j = 0; j < letters.length; j++) {                      //letters
                let each = []
                for (let i = 0; i < Data.length; i++) {                   // CityList.CITIES.length
                    if (letters[j] == Data[i].SimpleSpell.toUpperCase().substr(0, 1)) {       //CityList.CITIES[i].name_en
                        each.push({AreaName:Data[i].AreaName,AreaId:Data[i].AreaId});
                    }
                }
                let _city = {}
                _city.index = letters[j]
                _city.name = each
                city.push(_city)
            }
            let hotCities=[]
            for(let i=0;i<Data.length;i++){
                if (Data[i].IsHot){
                    hotCities.push({AreaName:Data[i].AreaName,AreaId:Data[i].AreaId});
                }
            }

            var dataBlob = {};    //字母
            var sectionIDs = [];
            var rowIDs = [];

            for (let ii = 0; ii < city.length; ii++) {
                var sectionName = 'Section ' + ii;
                sectionIDs.push(sectionName)
                dataBlob[sectionName] = letters[ii]
                rowIDs[ii] = [];

                for (let j = 0; j < city[ii].name.length; j++) {
                    var rowName = ii + '-' + j;
                    rowIDs[ii].push(rowName)
                    dataBlob[rowName] = city[ii].name[j]
                }
                //计算每个字母和下面城市的总高度，递增放到数组中
                // var eachheight = this.props.sectionHeight+this.props.rowHeight*newcity.length
                var eachheight = SECTIONHEIGHT + ROWHEIGHT * city[ii].name.length
                totalheight.push(eachheight)
            }
            this.setState({
                dataSource: this.state.dataSource.cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs),
                hotCities:hotCities
            })
        }
    }

};

const styles = StyleSheet.create({
    container: {
        // paddingTop: 50,
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#F4F4F4',
        // paddingTop: Platform.OS === 'ios' ? 20 : 0,  // 处理iOS状态栏
    },
    listContainner: {
        height: deviceHeight,
        marginBottom: 10
    },
    contentContainer: {
        width: deviceWidth,
        // height: deviceHeight- (Platform.OS === 'ios' ? px2dp(65):px2dp(45)),
        backgroundColor: 'white',
    },
    letters: {
        position: 'absolute',
        height: deviceHeight,
        top: Platform.OS === 'ios' ? px2dp(82) : px2dp(35),
        bottom: 0,
        right: 4,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
    },
    letter: {
        height: deviceHeight * 3.3 / 100,
        width: deviceWidth * 3 / 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    letterText: {
        textAlign: 'center',
        fontSize: deviceHeight * 1.1 / 50,
        color: "#00C164",
    },
    rowdata: {
        borderBottomColor: '#e3e3e3',
        borderBottomWidth: 0.5,
        height: ROWHEIGHT,
        justifyContent: 'center',
    },
    rowdatatext: {
        color: '#000',
    },
    //hotCity
    hotCity: {
        flexDirection: "row",
        flexWrap: "wrap",
        backgroundColor: "#fff",

    },
    hotView: {
        width: px2dp(88),
        height: px2dp(30),
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: px2dp(16),
        marginTop: px2dp(12),
        borderStyle: "solid",
        borderWidth: 0.5,
        borderColor: "#dcdcdc"
    },
    //搜索
    navigator: {
        height: Platform.OS === 'ios' ? px2dp(65) : px2dp(45),
        //justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: Platform.OS === 'ios' ? px2dp(28) : px2dp(8),
        borderBottomWidth: 1
    },
    leftButton: {
        width: px2dp(41),
        height: px2dp(36),
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingLeft: px2dp(10),

    },
    searchBox: {
        width: px2dp(300),
        height: px2dp(28),
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'nowrap',
        borderRadius: px2dp(14),
        backgroundColor: '#ececec',
        marginRight: px2dp(deviceWidth - 341),
    },
    searchBar: {
        color: '#aea9a9'
    },
    seacrhIcon: {
        width: px2dp(16),
        height: px2dp(17),
        marginRight: px2dp(7)
    },

    rightButton: {
        width: px2dp(51),
        alignItems: 'center',
        height: px2dp(28),
        marginRight: px2dp(10),
        justifyContent: "center",
    },
    searchBox1: {
        width: px2dp(280),
        height: px2dp(28),
        alignItems: 'center',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        borderRadius: px2dp(14),
        backgroundColor: '#ececec',
        marginLeft: px2dp(15),

    },
    searchBar1: {
        color: '#aea9a9',
        marginLeft: px2dp(6),
        padding: 0,
        width: '80%',
    },
    searchIcon: {
        width: px2dp(16),
        height: px2dp(17),
        marginLeft: px2dp(8)
    },

    maks: {
        position: 'absolute',
        left: 0,
        top: Platform.OS === 'ios' ? px2dp(65) : px2dp(45),
        bottom: 0,
        width: deviceWidth,
        height: deviceHeight,
        opacity: 0.3,
        zIndex:1
    },

    //搜索
    result: {
        height: deviceHeight- (Platform.OS === 'ios' ? px2dp(65):px2dp(45))-px2dp(25),
        marginTop: 1,
        borderColor: '#ccc',
        borderTopWidth: 1,
        paddingBottom:px2dp(500),
        backgroundColor:"#fff"
    },
    item: {
        fontSize: 16,
        padding: 5,
        paddingTop: 10,
        paddingBottom: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderTopWidth: 0,
    },
    row: {
        height: px2dp(40),
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: px2dp(16)
    },
    border: {
        width: deviceWidth - px2dp(39),
        borderBottomWidth: px2dp(1),
        height: px2dp(39),
        justifyContent: "center",
        borderBottomColor: "#fff",
        marginLeft: px2dp(10)
    },
});

function mapStateToProps(store) {
    return {
        ReduceCities: store.ReduceCities,
    }
}
const connectSelectCity = connect(mapStateToProps)(SelectCity);
connectSelectCity.navigationOptions = NavigationOptions;
export default connectSelectCity;

