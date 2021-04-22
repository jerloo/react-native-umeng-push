package com.jerloo.reactnativeumengpush.help

import android.app.Application
import android.content.Context
import android.util.Log
import com.taobao.accs.ACCSClient
import com.taobao.accs.AccsClientConfig
import com.taobao.accs.utl.ALog
import com.taobao.agoo.TaobaoRegister
import com.umeng.commonsdk.UMConfigure
import com.umeng.commonsdk.utils.UMUtils
import com.umeng.message.IUmengRegisterCallback
import com.umeng.message.PushAgent

//import org.android.agoo.huawei.HuaWeiRegister
//import org.android.agoo.mezu.MeizuRegister
//import org.android.agoo.oppo.OppoRegister
//import org.android.agoo.vivo.VivoRegister
//import org.android.agoo.xiaomi.MiPushRegistar


/**
 * PushSDK集成帮助类
 */
object PushHelper {
    private val TAG = PushHelper::class.java.simpleName

    /**
     * 初始化。
     * 场景：用户已同意隐私政策协议授权时
     *
     * @param context 应用上下文
     */
    fun init(context: Context, appKey: String, channel: String, msgSecret: String) {
        // 在此处调用基础组件包提供的初始化函数 相应信息可在应用管理 -> 应用信息 中找到 http://message.umeng.com/list/apps
        // 参数一：当前上下文context；
        // 参数二：应用申请的Appkey；
        // 参数三：渠道名称；
        // 参数四：设备类型，必须参数，传参数为UMConfigure.DEVICE_TYPE_PHONE则表示手机；传参数为UMConfigure.DEVICE_TYPE_BOX则表示盒子；默认为手机；
        // 参数五：Push推送业务的secret 填充Umeng Message Secret对应信息
        UMConfigure.init(
                context,
                appKey,
                channel,
                UMConfigure.DEVICE_TYPE_PHONE,
                msgSecret
        )

        //获取消息推送实例
        val pushAgent = PushAgent.getInstance(context)
        //        pushAgent.setNotificationPlaySound(MsgConstant.NOTIFICATION_PLAY_SERVER); //服务端控制声音
//        pushAgent.setDisplayNotificationNumber(0);
        //注册推送服务，每次调用register方法都会回调该接口
        pushAgent.register(object : IUmengRegisterCallback {
            override fun onSuccess(deviceToken: String) {
                //注册成功会返回deviceToken deviceToken是推送消息的唯一标志
                Log.i(TAG, "deviceToken --> $deviceToken")
                //                pushAgent.setAlias("xxx", "wx", new UTrack.ICallBack() {
//                    @Override
//                    public void onMessage(boolean b, String s) {
//                        Log.i(TAG, "b:" + b + " s:" + s);
//                    }
//                });
            }

            override fun onFailure(errCode: String, errDesc: String) {
                Log.e(TAG, "u-push register failure：--> code:$errCode,desc:$errDesc")
            }
        })
        if (isMainProcess(context)) {
            registerDeviceChannel(context)
        }
    }

    /**
     * 注册设备推送通道（小米、华为等设备的推送）
     *
     * @param context 应用上下文
     */
    private fun registerDeviceChannel(context: Context) {
        //打印日志开关
        ALog.isPrintLog = true
        //小米通道，填写您在小米后台APP对应的xiaomi id和key
//        MiPushRegistar.register(context, PushConstants.MI_ID, PushConstants.MI_KEY)
        //华为，注意华为通道的初始化参数在minifest中配置
//        HuaWeiRegister.register(context.applicationContext as Application)
        //魅族，填写您在魅族后台APP对应的app id和key
//        MeizuRegister.register(context, PushConstants.MEI_ZU_ID, PushConstants.MEI_ZU_KEY)
        //OPPO，填写您在OPPO后台APP对应的app key和secret
//        OppoRegister.register(context, PushConstants.OPPO_KEY, PushConstants.OPPO_SECRET)
        //vivo，注意vivo通道的初始化参数在minifest中配置
//        VivoRegister.register(context)
    }

    /**
     * 是否运行在主进程
     *
     * @param context 应用上下文
     * @return true: 主进程；false: 子进程
     */
    fun isMainProcess(context: Context?): Boolean {
        return UMUtils.isMainProgress(context)
    }
}
