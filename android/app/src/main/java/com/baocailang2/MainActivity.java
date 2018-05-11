package com.baocailang2;

import com.facebook.react.ReactActivity;
import cn.jpush.reactnativejpush.JPushPackage;
import com.rusel.RCTBluetoothSerial.RCTBluetoothSerialPackage;
import com.yunpeng.alipay.AlipayPackage;

import cn.jpush.android.api.JPushInterface;
import android.os.Bundle;
import android.content.Intent;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "baocailang2";
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        JPushInterface.init(this);
        if(!this.isTaskRoot()) {
            //判断该Activity是不是任务空间的源Activity，“非”也就是说是被系统重新实例化出来
            //如果你就放在launcher Activity中话，这里可以直接return了
            Intent mainIntent=getIntent();
            String action=mainIntent.getAction();
            if(mainIntent.hasCategory(Intent.CATEGORY_LAUNCHER) && action.equals(Intent.ACTION_MAIN)) {
                finish();
                return;//finish()之后该活动会继续执行后面的代码，你可以logCat验证，加return避免可能的exception
            }
        }
    }

    @Override
    protected void onPause() {
        super.onPause();
        JPushInterface.onPause(this);
    }

    @Override
    protected void onResume() {
        super.onResume();
        JPushInterface.onResume(this);
    }
}
