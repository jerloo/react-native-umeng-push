package com.jerloo.reactnativeumengpush

import android.app.Activity
import android.os.Handler
import android.os.Looper
import android.util.Log
import android.widget.Toast
import com.facebook.react.bridge.*
import com.umeng.message.MsgConstant
import com.umeng.message.PushAgent
import com.umeng.message.common.UmengMessageDeviceConfig
import com.umeng.message.common.inter.ITagManager


class RNUmengPushModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName() = "RNUmengPushModule"

    override fun getConstants(): MutableMap<String, Any> {
        return hashMapOf("count" to 1)
    }

    private val SUCCESS = 200
    private val ERROR = 0
    private val CANCEL = -1
    private val TAG: String = RNUmengPushModule::class.java.simpleName
    private val mSDKHandler: Handler = Handler(Looper.getMainLooper())
    private var context: ReactApplicationContext? = null
    private val isGameInited = false
    private var ma: Activity? = null
    private var mPushAgent: PushAgent? = null
    private val handler: Handler? = null

    init {
        mPushAgent = PushAgent.getInstance(reactContext)
    }

    fun initPushSDK(activity: Activity?) {
        ma = activity
    }

    private fun runOnMainThread(runnable: Runnable) {
        mSDKHandler.postDelayed(runnable, 0)
    }

    @ReactMethod
    fun addTag(tag: String?, successCallback: Callback) {
        mPushAgent?.tagManager?.addTags({ isSuccess, result ->
            if (isSuccess) {
                successCallback.invoke(SUCCESS, result.remain)
            } else {
                successCallback.invoke(ERROR, 0)
            }
        }, tag)
    }

    @ReactMethod
    fun deleteTag(tag: String?, successCallback: Callback) {
        mPushAgent?.tagManager?.deleteTags({ isSuccess, result ->
            Log.i(TAG, "isSuccess:$isSuccess")
            if (isSuccess) {
                successCallback.invoke(SUCCESS, result.remain)
            } else {
                successCallback.invoke(ERROR, 0)
            }
        }, tag)
    }

    @ReactMethod
    fun listTag(successCallback: Callback) {
        mPushAgent?.tagManager?.getTags { isSuccess, result ->
            mSDKHandler.post(Runnable {
                if (isSuccess) {
                    if (result != null) {
                        successCallback.invoke(SUCCESS, resultToList(result))
                    } else {
                        successCallback.invoke(ERROR, resultToList(result))
                    }
                } else {
                    successCallback.invoke(ERROR, resultToList(result))
                }
            })
        }
    }

    @ReactMethod
    fun addAlias(alias: String?, aliasType: String?, successCallback: Callback) {
        mPushAgent?.addAlias(alias, aliasType) { isSuccess, message ->
            Log.i(TAG, "isSuccess:$isSuccess,$message")
            Log.e("xxxxxx", "isuccess$isSuccess")
            if (isSuccess) {
                successCallback.invoke(SUCCESS)
            } else {
                successCallback.invoke(ERROR)
            }
        }
    }

    @ReactMethod
    fun addAliasType() {
        Toast.makeText(ma, "function will come soon", Toast.LENGTH_LONG)
    }

    @ReactMethod
    fun addExclusiveAlias(exclusiveAlias: String?, aliasType: String?, successCallback: Callback) {
        mPushAgent?.setAlias(exclusiveAlias, aliasType) { isSuccess, message ->
            Log.i(TAG, "isSuccess:$isSuccess,$message")
            if (java.lang.Boolean.TRUE == isSuccess) {
                successCallback.invoke(SUCCESS)
            } else {
                successCallback.invoke(ERROR)
            }
        }
    }

    @ReactMethod
    fun deleteAlias(alias: String?, aliasType: String?, successCallback: Callback) {
        mPushAgent?.deleteAlias(alias, aliasType) { isSuccess, s ->
            if (java.lang.Boolean.TRUE == isSuccess) {
                successCallback.invoke(SUCCESS)
            } else {
                successCallback.invoke(ERROR)
            }
        }
    }

    @ReactMethod
    fun appInfo(successCallback: Callback) {
        val pkgName = context!!.packageName
        val info = java.lang.String.format("""
    DeviceToken:%s
    SdkVersion:%s
    AppVersionCode:%s
    AppVersionName:%s
    """.trimIndent(),
                mPushAgent?.registrationId, MsgConstant.SDK_VERSION,
                UmengMessageDeviceConfig.getAppVersionCode(context), UmengMessageDeviceConfig.getAppVersionName(context))
        successCallback.invoke("应用包名:$pkgName\n$info")
    }

    private fun resultToMap(result: ITagManager.Result?): WritableMap? {
        val map: WritableMap = Arguments.createMap()
        if (result != null) {
            map.putString("status", result.status)
            map.putInt("remain", result.remain)
            map.putString("interval", result.interval.toString() + "")
            map.putString("errors", result.errors)
            map.putString("last_requestTime", result.last_requestTime.toString() + "")
            map.putString("jsonString", result.jsonString)
        }
        return map
    }

    private fun resultToList(result: List<String>?): WritableArray? {
        val list: WritableArray = Arguments.createArray()
        if (result != null) {
            for (key in result) {
                list.pushString(key)
            }
        }
        Log.e("xxxxxx", "list=$list")
        return list
    }
}
