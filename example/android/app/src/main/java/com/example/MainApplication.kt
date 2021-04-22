package com.example

import android.app.Application
import android.content.Context
import com.facebook.react.*
import com.facebook.soloader.SoLoader
import com.jerloo.reactnativeumengpush.RNUmengPushPackage
import com.jerloo.reactnativeumengpush.help.PushHelper
import com.jerloo.reactnativeumengpush.help.PushHelper.init
import com.jerloo.reactnativeumengpush.help.PushHelper.isMainProcess
import com.umeng.commonsdk.UMConfigure
import java.lang.reflect.InvocationTargetException


class MainApplication : Application(), ReactApplication {

    private val mReactNativeHost = object : ReactNativeHost(this) {
        override fun getUseDeveloperSupport(): Boolean {
            return BuildConfig.DEBUG
        }

        override fun getPackages(): List<ReactPackage> {
            val packages = PackageList(this).packages
            // Packages that cannot be autolinked yet can be added manually here, for example:
            // packages.add(MyReactNativePackage());
            packages.add(RNUmengPushPackage())
            return packages
        }

        override fun getJSMainModuleName(): String {
            return "index"
        }
    }

    override fun getReactNativeHost(): ReactNativeHost {
        return mReactNativeHost
    }

    override fun onCreate() {
        super.onCreate()
        SoLoader.init(this, false)
        initializeFlipper(this, reactNativeHost.reactInstanceManager)

        //日志开关
        UMConfigure.setLogEnabled(true);
        //预初始化
//        PushHelper.preInit(this);
        //正式初始化
//        initPushSDK();

        if (isMainProcess(this)) {
            Thread { init(applicationContext, "", "", "") }.start()
        }
    }

    /**
     * 初始化推送SDK，在用户隐私政策协议同意后，再做初始化
     */
//    private fun initPushSDK() {
//        /*
//         * 判断用户是否已同意隐私政策
//         * 当同意时，直接进行初始化；
//         * 当未同意时，待用户同意后，通过PushHelper.init(...)方法进行初始化。
//         */
//        val agreed: Boolean = MyPreferences.getInstance(this).hasAgreePrivacyAgreement()
//        if (agreed && isMainProcess(this)) {
//            //建议在线程中执行初始化
//            Thread { init(applicationContext) }.start()
//        }
//    }

    companion object {

        private fun initializeFlipper(context: Context, reactInstanceManager: ReactInstanceManager) {
            if (BuildConfig.DEBUG) {
                try {
                    val aClass = Class.forName("com.example.ReactNativeFlipper")
                    aClass
                            .getMethod("initializeFlipper", Context::class.java, ReactInstanceManager::class.java)
                            .invoke(null, context, reactInstanceManager)
                } catch (e: ClassNotFoundException) {
                    e.printStackTrace()
                } catch (e: NoSuchMethodException) {
                    e.printStackTrace()
                } catch (e: IllegalAccessException) {
                    e.printStackTrace()
                } catch (e: InvocationTargetException) {
                    e.printStackTrace()
                }
            }
        }
    }
}
