package com.contentportal;

import android.os.Bundle;
import android.support.annotation.Nullable;
import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.parse.ParsePush;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.Iterator;
import java.util.Set;

/**
 * Created by Deepak on 1/2/2016.
 */
public class ParseGCMModule extends ReactContextBaseJavaModule {
    private static final String TAG = "" ;
    private static Bundle gCachedExtras;
    private static ParseGCMModule instance;
    private static boolean isOnForeground;

    public static ParseGCMModule instance(){
        return instance;
    }
    public static void setIsOnForeground(boolean isOnForeground){
        ParseGCMModule.isOnForeground = isOnForeground;
    }

    public static boolean isOnForeground(){
        return ParseGCMModule.isOnForeground;
    }


    @ReactMethod
    public void checkForNotifications(){
        if (gCachedExtras != null){
            sendExtras(gCachedExtras);
            gCachedExtras = null;
        }
    }
    
    public ParseGCMModule(ReactApplicationContext reactContext){
        super(reactContext);
        ParseGCMModule.instance = this;
    }

    public static void sendExtras(Bundle extras) {
        if (extras != null) {
            gCachedExtras = extras;

            if (ParseGCMModule.instance != null && MainActivity.getMainParent() != null) {
                ParseGCMModule.instance.sendJavascript(convertBundleToJson(gCachedExtras));
            }
        }
    }

    private static JSONObject convertBundleToJson(Bundle extras)
    {
        JSONObject jsonObject = new JSONObject();
        Set<String> keys = extras.keySet();
        for (String key : keys) {
            try {
                // json.put(key, bundle.get(key)); see edit below
                jsonObject.put(key, JSONObject.wrap(extras.get(key)));
            } catch(JSONException e) {
                //Handle exception here
                e.printStackTrace();
            }
        }
        Log.v(TAG, "extrasToJSON: " + jsonObject.toString());
        return jsonObject;
    }

    public void sendJavascript(JSONObject json) {
        try {
            String send = "";
            //String channel = json.getString("channel");
            try {

                WritableMap params = new WritableNativeMap();

                JSONObject temp = json;

                Iterator<String> iter = temp.keys();
                while (iter.hasNext()) {
                    String key = iter.next();
                    try {
                        params.putString(key, temp.getString(key));
                    } catch (JSONException e) {
                        // Something went wrong!
                    }
                }
                WritableMap toSend = new WritableNativeMap();
                toSend.putMap("payload", params);
                sendEvent(getReactApplicationContext(), "onPushNotification", toSend);
                gCachedExtras = null;
            } catch (Exception ex) {
                WritableMap params = new WritableNativeMap();
                params.putString("message", "New article arrived.");
                if (gCachedExtras != null){
                    sendEvent(getReactApplicationContext(), "onPushNotification", params);
                    gCachedExtras = null;
                }
                Log.i(TAG, "sendJavascript error: ");

            }

            Log.i(TAG, "sendJavascript: " + send);

        } catch (Exception e) {
            Log.e(TAG, "sendJavascript: JSON exception");
        }
    }

    private void sendEvent(ReactContext reactContext,
                           String eventName,
                           @Nullable Object params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }

    @Override
    public String getName() {
        return "ParseGCMModule";
    }
}
