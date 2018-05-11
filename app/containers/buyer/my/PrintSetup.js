/**
 * Created by Administrator on 2017/4/24.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    TextInput,
    ListView,
    ScrollView,
    ActivityIndicator,
    TouchableOpacity,
    Platform
} from 'react-native';
import {BCImage, BCTouchable, BCText, px2dp, deviceHeight, substr,} from '../../../BaseComponent';
import {PullViewComponent} from '../../PageComponent';
import gs from '../../../styles/MainStyles'
import BluetoothSerial from 'react-native-bluetooth-serial';
import {toastLong, toastShort} from './../../../utils/ToastUtil';
import {formaTime,toDecimal2} from '../../../utils/FormatUtil'
import ESC from './../../../components/PrintEsc';
//const {ESC} = BluetoothSerial;
const _ = require('underscore');
import {Buffer} from 'buffer';
global.Buffer = Buffer;
const iconv = require('iconv-lite');
const Button = ({title, onPress, style, textStyle}) =>
    <TouchableOpacity style={[Styles.button, style]} onPress={onPress}>
        <BCText style={[Styles.buttonText, textStyle]}>{title.toUpperCase()}</BCText>
    </TouchableOpacity>
global.BluetoothConnection = false;

//蓝牙列表
class DeviceList extends Component {
    static defaultProps = {
        Quantity: 0,
        devices: [],

    };
    static propTypes = {
        OnChange: React.PropTypes.func,
        SpecId: React.PropTypes.number,
        _UpdateRetailPrice: React.PropTypes.func,
    };

    constructor(props) {
        super(props);
        this.state = {
            devices: props.devices,
        }
    }

    dataSource = null;
    _TextInput = null;

    render() {
        let devices = this.props.devices;
        let connectedId = this.props.connectedId;
        let onDevicePress = this.props.onDevicePress;
        let showConnectedIcon = this.props.showConnectedIcon;
        /* ref={(c) => {
         if (c !== null) {
         this._TextInput = (c);
         }
         }}*/
        return (
            <ScrollView style={Styles.container}>
                <View >
                    {devices.map((device, i) => {
                        return (
                            <BCTouchable
                                key={device.id + '-' + i}
                                onPress={() => {
                                    onDevicePress(device);
                                    if (connectedId === device.id) {
                                    }
                                }}>
                                <View style={[Styles.itemListStyle, gs.bgc_fff]}>
                                    {showConnectedIcon
                                        ? (
                                            <View style={{marginLeft: px2dp(16)}}>
                                                {connectedId === device.id
                                                    ? (
                                                        <BCImage source={require('../../../imgs/Selectdevice.png')}/>
                                                    ) : null}
                                            </View>
                                        ) : null}
                                    <BCText
                                        style={[gs.fts_14, gs.c_3a3838, {marginLeft: px2dp(12)}]}>{device.name}{`<${device.id}>`}</BCText>
                                </View>

                            </BCTouchable>
                        )
                    })}
                </View>
            </ScrollView>

        )
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            //quantity: nextProps.Quantity,
        })
    }
}

export const print = (printDate)=>{
        printDate.map((item,index)=>{
            let PName=[];
            ESC._setBT(BluetoothSerial);
            // 一定要配置好
            const Config = {
                wordNumber: 40
            };
            ESC.setConfig(Config);

            ESC.init();
            ESC.alignCenter();
            ESC.fontBold();
            ESC.printAndNewLine();
            ESC.doubleHeightWidth();
            ESC.text('报菜郎-杭州');
            //ESC.text(printDate[0]);
            ESC.printAndNewLine();

            ESC.text('订单列表');
            ESC.printAndNewLine();

            ESC.text(_.times(Config.wordNumber, () => '-').join(''));
            ESC.init();
            ESC.printAndNewLine();
            //ESC.text('下单时间：2016-09-06 19:30:23');
            ESC.text('下单时间：'+formaTime(item.CreateTime, "yyyy-MM-dd hh:mm:ss"));
            ESC.printAndNewLine();
            item.OrderNo!==null?
                ESC.text('单据编号：'+item.OrderNo):
                ESC.text('单据编号：T2345-CGD-2017-01-14-00005');
            ESC.printAndNewLine();
            ESC.text('下单人员：'+item.CompanyName);
            //ESC.printAndNewLine();
            //ESC.text('采购经办：采购员A');
            ESC.printAndNewLine();
            item.Phone!==null?
                ESC.text('收货电话：'+item.Phone):
                ESC.text('收货电话：15201083760');
            ESC.printAndNewLine();
            ESC.text(ESC.Util.leftRight('收货地址：'+item.Address,'',40));
            ESC.printAndNewLine();
            ESC.text(_.times(Config.wordNumber, () => '-').join(''));
            ESC.printAndNewLine();

            ESC.text(
                ESC.Util.leftRight('名称','',16)
                +ESC.Util.leftRight('单价','',8)
                +ESC.Util.leftRight('数量','',8)
                +ESC.Util.leftRight('金额','',9)
            );

            item.Items.map((item,index)=>{
                let repeat=0;
                for(let i of PName){
                    if(i==item.ProductName){
                        repeat=1;
                    }
                }
                PName.push(item.ProductName);
                if(repeat==0){
                    ESC.text(_.times(Config.wordNumber/2, () => '-').join(' '));
                    ESC.printAndNewLine();
                    ESC.text(ESC.Util.leftRight(item.ProductName, '', 16));
                    if(item.ProductName.length>8&&item.Spec=="称重"){             //商品名称是否过长
                        ESC.printAndNewLine();
                    }
                }
                if(item.Spec!=="称重"){
                    ESC.printAndNewLine();
                    ESC.text(
                        ESC.Util.leftRight('','',2)
                        + ESC.Util.leftRight(item.Spec, '', 14)
                    );
                    if(item.Spec.length>7){
                        ESC.printAndNewLine();
                        ESC.text(ESC.Util.leftRight('','',16));
                    }
                    ESC.text(
                        ESC.Util.leftRight(''+item.Price, '', 8)
                        + ESC.Util.leftRight(toDecimal2(item.RealQuantity)+item.Unit,'',8)
                        //+isValidate? ESC.Util.leftRight(item.ActualQuantity+'/'+item.DisplayUnit ,'',6):ESC.Util.leftRight(item.RealQuantity+'/'+item.Unit ,'',6)
                        + ESC.Util.leftRight(toDecimal2(item.Price*item.RealQuantity),'',8)
                    );
                }else{
                    ESC.printAndNewLine();
                    ESC.text(
                        ESC.Util.leftRight('','',16)
                        +ESC.Util.leftRight(''+item.Price, '', 8)
                        + ESC.Util.leftRight(toDecimal2(item.RealQuantity)+item.Unit,'',8)
                        + ESC.Util.leftRight(toDecimal2(item.Price*item.RealQuantity),'',8)
                    )
                }



            });

            ESC.text(_.times(Config.wordNumber, () => '-').join(''));
            ESC.printAndNewLine();
            ESC.alignRight();
            //ESC.text('共2种商品');
            ESC.text('共'+item.Items.length+'件商品' );
            ESC.printAndNewLine();
            //ESC.text('合计：168元');
            ESC.text('合计：'+ item.ActualAmount+'元');
            ESC.printAndNewLine();

            ESC.printAndNewLine();
            ESC.printAndNewLine();
            ESC.printAndNewLine();
            ESC.printAndNewLine();
            ESC.printAndNewLine();
            ESC.printAndNewLine();
            ESC.sound();
            ESC.init();
        });
};

export default class PrintSetup extends PullViewComponent {
    //设置页面标题
    setTitle() {
        return "打印设置"
    }

    constructor(props) {
        super(props);
        this.state = {
            showPrint: false,
            isEnabled: false,
            discovering: true,
            devices: [],
            unpairedDevices: [],
            connected: false,
            section: 0,
            PrintData:[],
        }
    }

    /* toDevice(device,connectedId){
     return(
     <View style={[Styles.itemListStyle,gs.bgc_fff]}>
     <BCTouchable style={{marginLeft:px2dp(14)}}>
     <BCImage source={require('../../../imgs/Selectdevice.png')}/>
     </BCTouchable>
     <BCText style={[gs.fts_14,gs.c_3a3838,{marginLeft:px2dp(12)}]}>{device.name}{`<${device.id}>`}</BCText>
     </View>
     )
     }*/

    componentDidMount() {
        Platform.OS==="ios"?null:
        this.discoverUnpaired();
    }

    /**
     * [android]
     * request enable of bluetooth from user
     */
    requestEnable() {
        BluetoothSerial.requestEnable()
            .then((res) => this.setState({isEnabled: true}))
            .catch((err) => toastShort(err.message))
    }

    /**
     * [android]
     * enable bluetooth on device
     */
    enable() {
        BluetoothSerial.enable()
            .then((res) => this.setState({
                isEnabled: true,
                /*  section: 0*/
            }))
            .catch((err) => toastShort(err.message));
    }

    /**
     * [android]
     * disable bluetooth on device
     */
    disable() {
        BluetoothSerial.disable()
            .then((res) => this.setState({isEnabled: false, discovering: true}))
            .catch((err) => toastShort(err.message))
    }

    /**
     * [android]
     * toggle bluetooth
     */
    toggleBluetooth(value) {
        if (value === true) {
            this.enable()
        } else {
            this.disable()
        }
    }

    /**
     * [android]
     * Discover unpaired devices, works only in android
     */
    /* discoverUnpaired () {
     if (this.state.discovering) {
     return false
     } else {
     this.setState({ discovering: true })
     BluetoothSerial.discoverUnpairedDevices()
     .then((unpairedDevices) => {
     this.setState({ unpairedDevices, discovering: false })
     })
     .catch((err) => toastShort(err.message))
     }
     }*/
    discoverUnpaired() {
        //this.setState({ discovering: true });
        BluetoothSerial.discoverUnpairedDevices()
            .then((unpairedDevices) => {
                this.setState({unpairedDevices, discovering: false})
            })
            .catch((err) => toastShort(err.message))
    }

    /**
     * [android]
     * Discover unpaired devices, works only in android
     */
    cancelDiscovery() {
        if (this.state.discovering) {
            BluetoothSerial.cancelDiscovery()
                .then(() => {
                    this.setState({discovering: false})
                })
                .catch((err) => toastShort(err.message))
        }
    }

    /**
     * [android]
     * Pair device
     */
    pairDevice(device) {
        BluetoothSerial.pairDevice(device.id)
            .then((paired) => {
                if (paired) {
                    toastShort(`设备 ${device.name} 配对成功！`)
                    const devices = this.state.devices
                    devices.push(device)
                    this.setState({
                        devices,
                        unpairedDevices: this.state.unpairedDevices.filter((d) => d.id !== device.id)
                    })
                } else {
                    toastShort(`设备 ${device.name} 配对失败`)
                }
            })
            .catch((err) => toastShort(err.message))
    }

    /**
     * Connect to bluetooth device by id
     * @param  {Object} device
     */
    connect(device) {
        this.setState({connecting: true})
        BluetoothSerial.connect(device.id)
            .then((res) => {
                toastShort(`成功连接设备 ${device.name}`);
                BluetoothConnection = true;
                this.setState({device, connected: true, connecting: false})
            })
            .catch((err) => toastShort(err.message))
    }

    /**
     * Disconnect from bluetooth device
     */
    disconnect() {
        BluetoothSerial.disconnect()
            .then(() => {this.setState({connected: false});
                BluetoothConnection = false;
        })
            .catch((err) => toastShort(err.message))
    }

    /**
     * Toggle connection when we have active device
     * @param  {Boolean} value
     */
    toggleConnect(value) {
        if (value === true && this.state.device) {
            this.connect(this.state.device)
        } else {
            this.disconnect()
        }
    }

    /**
     * Write message to device
     * @param  {String} message
     */
    write(message) {
        if (!this.state.connected) {
            toastShort('You must connect to device first')
        }

        BluetoothSerial.write(message)
            .then((res) => {
                toastShort('Successfuly wrote to device')
                this.setState({connected: true})
            })
            .catch((err) => toastShort(err.message))
    }

    onDevicePress(device) {
        if (this.state.section === 0) {
            this.connect(device)
        } else {
            this.pairDevice(device)
        }
    }

    writePackets(message, packetSize = 64) {
        const toWrite = iconv.encode(message, 'gbk');
        const writePromises = []
        const packetCount = Math.ceil(toWrite.length / packetSize);

        for (var i = 0; i < packetCount; i++) {
            const packet = new Buffer(packetSize);
            packet.fill(' ');
            toWrite.copy(packet, 0, i * packetSize, (i + 1) * packetSize);
            writePromises.push(BluetoothSerial.write(packet))
        }

        Promise.all(writePromises)
            .then((result) => {
            })
    }

    // print() {
    //     const printDate=this.params;
    //     printDate.map((item,index)=>{
    //         let PName=[];
    //         ESC._setBT(BluetoothSerial);
    //         // 一定要配置好
    //         const Config = {
    //             wordNumber: 40
    //         };
    //         ESC.setConfig(Config);
    //
    //         ESC.init();
    //         ESC.alignCenter();
    //         ESC.fontBold();
    //         ESC.printAndNewLine();
    //         ESC.doubleHeightWidth();
    //         ESC.text('报菜郎-杭州');
    //         //ESC.text(printDate[0]);
    //         ESC.printAndNewLine();
    //
    //         ESC.text('订单列表');
    //         ESC.printAndNewLine();
    //
    //         ESC.text(_.times(Config.wordNumber, () => '-').join(''));
    //         ESC.init();
    //         ESC.printAndNewLine();
    //         //ESC.text('下单时间：2016-09-06 19:30:23');
    //         ESC.text('下单时间：'+formaTime(item.CreateTime, "yyyy-MM-dd hh:mm:ss"));
    //         ESC.printAndNewLine();
    //         item.OrderNo!==null?
    //             ESC.text('单据编号：'+item.OrderNo):
    //         ESC.text('单据编号：T2345-CGD-2017-01-14-00005');
    //         ESC.printAndNewLine();
    //         ESC.text('下单人员：'+item.CompanyName);
    //         //ESC.printAndNewLine();
    //         //ESC.text('采购经办：采购员A');
    //         ESC.printAndNewLine();
    //         item.Phone!==null?
    //             ESC.text('收货电话：'+item.Phone):
    //         ESC.text('收货电话：15201083760');
    //         ESC.printAndNewLine();
    //         ESC.text(ESC.Util.leftRight('收货地址：'+item.Address,'',40));
    //         ESC.printAndNewLine();
    //         ESC.text(_.times(Config.wordNumber, () => '-').join(''));
    //         ESC.printAndNewLine();
    //
    //         ESC.text(
    //             ESC.Util.leftRight('名称','',16)
    //             +ESC.Util.leftRight('单价','',8)
    //             +ESC.Util.leftRight('数量','',8)
    //             +ESC.Util.leftRight('金额','',9)
    //         )
    //
    //         // 商品开始
    //         /* ESC.text(
    //          ESC.Util.leftRight('大利(42斤/件)', '', 20)
    //          + ESC.Util.leftRight('84元/件', '', 11)
    //          + ESC.Util.leftRight('x1件', '总价：84元', 17)
    //          );*/
    //         //判断是否为同一种商品
    //         item.Items.map((item,index)=>{
    //             let repeat=0;
    //             for(let i of PName){
    //                 if(i==item.ProductName){
    //                     repeat=1;
    //                 }
    //             }
    //             PName.push(item.ProductName);
    //             if(repeat==0){
    //                 ESC.text(_.times(Config.wordNumber/2, () => '-').join(' '));
    //                 ESC.printAndNewLine();
    //                 ESC.text(ESC.Util.leftRight(item.ProductName, '', 16));
    //                 if(item.ProductName.length>8&&item.Spec=="称重"){             //商品名称是否过长
    //                     ESC.printAndNewLine();
    //                 }
    //             }
    //             if(item.Spec!=="称重"){
    //                 ESC.printAndNewLine();
    //                 ESC.text(
    //                     ESC.Util.leftRight('','',2)
    //                     + ESC.Util.leftRight(item.Spec, '', 14)
    //                 );
    //                 if(item.Spec.length>7){
    //                     ESC.printAndNewLine();
    //                     ESC.text(ESC.Util.leftRight('','',16));
    //                 }
    //                 ESC.text(
    //                     ESC.Util.leftRight(''+item.Price, '', 8)
    //                     + ESC.Util.leftRight(toDecimal2(item.RealQuantity)+item.Unit,'',8)
    //                     //+isValidate? ESC.Util.leftRight(item.ActualQuantity+'/'+item.DisplayUnit ,'',6):ESC.Util.leftRight(item.RealQuantity+'/'+item.Unit ,'',6)
    //                     + ESC.Util.leftRight(toDecimal2(item.Price*item.RealQuantity),'',8)
    //                 );
    //             }else{
    //                 ESC.printAndNewLine();
    //                 ESC.text(
    //                     ESC.Util.leftRight('','',16)
    //                     +ESC.Util.leftRight(''+item.Price, '', 8)
    //                     + ESC.Util.leftRight(toDecimal2(item.RealQuantity)+item.Unit,'',8)
    //                     + ESC.Util.leftRight(toDecimal2(item.Price*item.RealQuantity),'',8)
    //                 )
    //             }
    //
    //
    //             //+ ESC.Util.leftRight('小计：',item.Price*item.ActualQuantity , 1)
    //             //ESC.init();
    //             //ESC.alignRight();
    //             //ESC.text('小计：'+item.Price*item.ActualQuantity )
    //         });
    //
    //         // ESC.init();
    //         // ESC.printAndNewLine();
    //         // item.Remark!==null?
    //         //     ESC.text(item.Remark):
    //         // ESC.text('');
    //
    //         // 商品结束
    //
    //         // 商品开始
    //         /* ESC.text(
    //          ESC.Util.leftRight('大利(42斤/件)', '', 11)
    //          + ESC.Util.leftRight('84元/件', '', 11)
    //          + ESC.Util.leftRight('x1件', '总价：84元', 17)
    //          );*/
    //         //ESC.printAndNewLine();
    //         //ESC.text(' （3斤,1斤/斤,要新鲜的）+（5袋,5斤/袋,不要睡分太多的）');
    //
    //         // 商品结束
    //         ESC.text(_.times(Config.wordNumber, () => '-').join(''));
    //         ESC.printAndNewLine();
    //         ESC.alignRight();
    //         //ESC.text('共2种商品');
    //         ESC.text('共'+item.Items.length+'件商品' );
    //         ESC.printAndNewLine();
    //         //ESC.text('合计：168元');
    //         ESC.text('合计：'+ item.ActualAmount+'元');
    //         ESC.printAndNewLine();
    //
    //         ESC.printAndNewLine();
    //         ESC.printAndNewLine();
    //         ESC.printAndNewLine();
    //         ESC.printAndNewLine();
    //         ESC.printAndNewLine();
    //         ESC.printAndNewLine();
    //         ESC.sound();
    //         ESC.init();
    //     });
    //
    // }


    //显示打印机内容
    renderPrint() {
        return (
            <View style={[Styles.itemStyle, gs.bgc_fff,]}>
                <BCText style={[gs.fts_14, gs.c_3a3838, {marginLeft: px2dp(40)}]}>连接打印机</BCText>
                <BCTouchable onPress={() => {
                    this.onPrint(!this.state.isEnabled)
                }} style={{marginRight: px2dp(15)}}>
                    <BCImage
                        source={this.state.isEnabled ? require('../../../imgs/opens.png') : require('../../../imgs/Closes.png')}/>

                </BCTouchable>
            </View>
        )
    }


    onPrint(value) {
        Platform.OS==="ios"?
            this.setState({isEnabled: value, discovering: true}):
        this.toggleBluetooth(value);
        if (this.state.discovering) {
            Platform.OS==="ios"?null:
                this.discoverUnpaired();
        }
        Platform.OS==="ios"?null:
            this.discoverUnpaired();
    }

    content() {
        return (
            <View style={[Styles.main, gs.bgc_f2f1ef]}>
                {this.renderPrint()}
                {/*连接打印机后显示*/}
                {
                    this.state.isEnabled ?
                        <View>
                            <View style={[Styles.itemListStyle, gs.bgc_fff]}>
                                {
                                    this.state.devices.length>0 ?
                                        <DeviceList
                                            showConnectedIcon={this.state.section === 0}
                                            connectedId={this.state.device && this.state.device.id}
                                            devices={this.state.section === 0 ? this.state.devices : this.state.unpairedDevices}
                                            onDevicePress={(device) => {
                                                this.onDevicePress(device)
                                            }
                                            }/> : null

                                }


                                {/* <BCTouchable style={{marginLeft:px2dp(14)}}>
                                 <BCImage source={require('../../../imgs/Selectdevice.png')}/>
                                 </BCTouchable>
                                 <BCText style={[gs.fts_14,gs.c_3a3838,{marginLeft:px2dp(12)}]}>设备编号DURECT-95-HP</BCText>*/}
                            </View>
                            <View style={Styles.titleStyle}>
                                <BCText style={[gs.fts_13, gs.c_b7b7b7, {marginLeft: px2dp(13)}]}>选择设备</BCText>
                            </View>
                            <View style={{
                                backgroundColor: '#fff',
                                height: deviceHeight - px2dp(120),
                                width: "100%"
                            }}>
                                {
                                    Platform.OS==="ios"?
                                        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                                            <View>
                                                <BCText style={[gs.fts_14, gs.c_3a3838,]}>请前往APP Store下载GPrinter 软件</BCText>
                                            </View>
                                            <View style={{marginTop:px2dp(10)}}>
                                                <BCText style={[gs.fts_14, gs.c_3a3838,]}>下载后再连接设备打印</BCText>
                                            </View>
                                        </View>
                                        :
                                        this.state.discovering ?
                                            (
                                                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                                                    {
                                                        Platform.OS==="ios"? <ActivityIndicator animating color='#ff0000'
                                                                                                style={{marginBottom: 15}}
                                                        />:
                                                            <ActivityIndicator animating color='#ff0000'
                                                                               style={{marginBottom: 15}}
                                                            />
                                                    }
                                                    <View>
                                                        <BCText style={[gs.fts_14, gs.c_3a3838,]}>正在搜索附近蓝牙设备</BCText>
                                                    </View>
                                                    {/* <Button
                                                     textStyle={{ color: '#FFFFFF' }}
                                                     style={Styles.buttonRaised}
                                                     title='Cancel Discovery'
                                                     onPress={() => this.cancelDiscovery()} />*/}
                                                </View>
                                            ) : (
                                            <DeviceList
                                                showConnectedIcon={this.state.section === 0}
                                                connectedId={this.state.device && this.state.device.id}
                                                devices={this.state.section === 0 ? this.state.unpairedDevices : this.state.devices}
                                                onDevicePress={(device) => this.onDevicePress(device)}/>
                                        )}

                               {/* { Platform.OS==="ios"?null:
                                    this.discoverUnpaired()
                                }*/}
                               {/* <DeviceList
                                 showConnectedIcon={this.state.section === 0}
                                 connectedId={this.state.device && this.state.device.id}
                                 devices={this.state.section === 0 ?  this.state.unpairedDevices:this.state.devices}
                                 onDevicePress={(device) => this.onDevicePress(device)} />*/}

                            </View>
                        </View>
                        : null
                }
               {/* <View style={{alignSelf: 'flex-end', height: 52}}>
                    <ScrollView
                        horizontal
                        contentContainerStyle={Styles.fixedFooter}>
                        {Platform.OS === 'android' && this.state.section === 1
                            ? (
                                <Button
                                    title={this.state.discovering ? '... Discovering' : 'Discover devices'}
                                    onPress={this.discoverUnpaired.bind(this)}/>
                            ) : null}
                        {Platform.OS === 'android' && !this.state.isEnabled
                            ? (
                                <Button
                                    title='Request enable'
                                    onPress={() => this.requestEnable()}/>
                            ) : null}
                    </ScrollView>
                </View>*/}
            </View>
        )
    }

    Bottom() {
        const {isEnabled, devices,} = this.state;
        const data=this.state.PrintData;

        return (
            data.length&&isEnabled>0?
                <BCTouchable onPress={() => {
                    if(isEnabled){
                        //this.writePackets('采购单位：小农女供应链优先公司');
                        // this.print();
                        print(this.params);
                    }
                }}>
                    <View style={[gs.bgc_BaseColor,{
                        width: "100%",
                        height: px2dp(40),
                        //backgroundColor: "#fff",
                        alignItems: "center",
                        justifyContent: "center"
                    }]}>
                        <BCText style={[Styles.buttonText,{color:"#fff"}]}>打印</BCText>
                    </View>
                </BCTouchable>
                :null
        )
    }


    WillMount() {
        let data=this.params;
        let PrintData= this.state.PrintData;
        if(data!==undefined){
            PrintData=data;
        }

        Promise.all([
            BluetoothSerial.isEnabled(),
            BluetoothSerial.list()
        ])
            .then((values) => {
                const [isEnabled, devices] = values;
                /*  if(isEnabled===true){
                 this.discoverUnpaired();
                 }*/

                Platform.OS==="ios"?null:
                    this.discoverUnpaired();
                this.setState({isEnabled, devices,})
            });

        BluetoothSerial.on('bluetoothEnabled', () => {
            Platform.OS==="ios"?null:
                this.discoverUnpaired();
        })
        BluetoothSerial.on('bluetoothDisabled', () => {toastShort('关闭蓝牙');BluetoothConnection = false;})
        BluetoothSerial.on('error', (err) => console.log(`Error: ${err.message}`));
        // BluetoothSerial.on('connectionLost', () => {
        //     if (this.state.device) {
        //         toastShort(`已经从设备 ${this.state.device.name} 取消连接`)
        //     }
        //     this.setState({connected: false})
        // });

        // Platform.OS==="ios"? toastShort('ios只支持iOS 8以上'):
        //  null;

        this.setState({
            IsReceived: true,
            PrintData:PrintData
        })
    }

}

var Styles = StyleSheet.create({
    main: {
        flex: 1,
        height: deviceHeight,
    },
    itemStyle: {
        height: px2dp(48),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: px2dp(10),
        borderBottomWidth: 1,
        borderBottomColor: '#f2f1ef'
    },
    itemListStyle: {
        height: px2dp(48),
        flexDirection: 'row',
        alignItems: 'center',
    },
    titleStyle: {
        height: px2dp(43),
        justifyContent: 'center'
    },
    deviceIdStyle: {
        height: px2dp(130),
        justifyContent: 'center'
    },
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
        //minHeight:deviceHeight,
    },
    fixedFooter: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#ddd'
    },
    button: {
        height: 36,
        margin: 5,
        paddingHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonText: {
        color: '#7B1FA2',
        fontWeight: 'bold',
        fontSize: 14
    },
    buttonRaised: {
        backgroundColor: '#7B1FA2',
        borderRadius: 2,
        elevation: 2
    }
})