/**
 * Created by Administrator on 2017/6/20.
 */
import React from "react";
import {StyleSheet, Text, View} from "react-native";
import {BCText, deviceHeight} from "../BaseComponent";
import {PullViewComponent} from "./PageComponent";
import gs from "../styles/MainStyles";

export default class Agreement extends PullViewComponent {
    //设置页面标题
    setTitle() {
        return "注册协议"
    }

    content() {
        return (
            <View style={[Styles.main, gs.bgc_fff]}>
                <View style={Styles.titleStyle}>
                    <BCText style={[gs.fts_14, {lineHeight:20,color:'#333'}]}>
                        用户须知
                    </BCText>
                    <BCText style={[gs.fts_14, {lineHeight:20,color:'#333'}]}>
                        甲方：供应商
                    </BCText>
                    <BCText style={[gs.fts_14, {lineHeight:20,color:'#333'}]}>
                        乙方：餐厅端
                    </BCText>
                    <BCText style={[gs.fts_14, {lineHeight:20,color:'#333'}]}>
                        丙方（平台方）：杭州牛郎网络科技有限公司
                    </BCText>
                </View>
                <View style={Styles.contentStyle}>
                    <BCText style={[gs.fts_14, {lineHeight:20,color:'#333'}]}>
                        甲乙丙三方本着互利、共同发展的原则，就甲方通过丙方
                        平台向乙方提供的农产品验收事宜，经协商达成一致共识：
                    </BCText>
                    <BCText style={[gs.fts_14, {lineHeight:20,color:'#333'}]}>
                        一、甲方应按约将乙方订购的农产品送货到乙方指定地点，
                        并提供随附的送货单，乙方应当面对到货的农产品进行验
                        收。
                    </BCText>
                    <BCText style={[gs.fts_14, {lineHeight:20,color:'#333'}]}>
                        二、乙方经检验发现到货农产品的品种、数量、质量等与
                        约定相符的，应在送货单上签字确认。乙方签收农产品后
                        ，农产品毁损、灭失的风险由乙方承担。
                    </BCText>
                    <BCText style={[gs.fts_14, {lineHeight:20,color:'#333'}]}>
                        三、乙方经检验发现到货农产品的品种、数量、质量等与
                        约定不符的，有权拒收有问题的农产品，并在送货单上写
                        明拒收的原因。如乙方无正当理由拒收的，应承担违约责
                        任，具体由甲乙双方另行协商。
                    </BCText>
                    <BCText style={[gs.fts_14, {lineHeight:20,color:'#333'}]}>
                        四、乙方下单后二十四小时内未验收的，视为乙方已经验
                        收通过到货的农产品，农产品毁损、灭失的风险由乙方承
                        担。
                    </BCText>
                    <BCText style={[gs.fts_14, {lineHeight:20,color:'#333'}]}>
                        五、订单产品的品种、数量、质量、金额等与约定不符的，
                        甲方应承担违约责任，具体由甲乙双方另行协商，一切与
                        丙方无关。
                    </BCText>
                    <BCText style={[gs.fts_14, {lineHeight:20,color:'#333'}]}>
                        六、在履行过程中发生争议的，由甲乙丙三方协商解决；
                        协商不成的，向丙方所在地人民法院起诉。
                    </BCText>
                </View>
            </View>
        )
    }


    WillMount() {
        this.setState({
            IsReceived: true
        })
    }
}

const Styles = StyleSheet.create({
    main: {
        flex: 1,
        height: deviceHeight,
    },
    titleStyle:{
        justifyContent:'center',
        alignItems:'center',
        paddingTop: 5
    },
    contentStyle: {
        paddingHorizontal: 15,
        paddingTop: 10
    }
})