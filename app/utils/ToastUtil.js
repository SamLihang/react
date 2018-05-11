import {
  Alert,
  ToastAndroid,
  Platform
} from 'react-native';

export const toastShort = (content, isAlert) => {
    if(content==null){
        return;
    }
  if (isAlert || Platform.OS === 'ios') {
    Alert.alert(
      '提示',
      content.toString(),
        [{
            text: '确定'
        }]
    );
  } else {
    ToastAndroid.show(content.toString(), ToastAndroid.SHORT);
  }
};

export const toastLong = (content, isAlert) => {
  if (isAlert || Platform.OS === 'ios') {
    Alert.alert(
      '提示',
      content.toString(),
        [{
            text: '确定'
        }]
    );
  } else {
    ToastAndroid.show(content.toString(), ToastAndroid.LONG);
  }
};

export const confirm=(message,onConfirm,onCancle)=>{
    Alert.alert('提示',message,[
        {text:'取消',onPress:()=>onCancle()},
        {text:'确定',onPress:()=>onConfirm()}
    ])
}