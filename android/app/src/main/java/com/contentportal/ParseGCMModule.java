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

import org.json.JSONException;
import org.json.JSONObject;

import java.util.Iterator;

/**
 * Created by Deepak on 1/2/2016.
 */
public class ParseGCMModule extends ReactContextBaseJavaModule {
    private static final String TAG = "" ;
    private static Bundle gCachedExtras;
    private static ParseGCMModule instance;

    public static ParseGCMModule instance(){
        return instance;
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
            JSONObject json = new JSONObject();
            try {
                json.put("message", "test msg");
            }
            catch (JSONException e){
                e.printStackTrace();
            }
            if (ParseGCMModule.instance != null) {
                ParseGCMModule.instance.sendJavascript(json);
            }
        }
    }

    private static JSONObject convertBundleToJson(Bundle extras)
    {
        JSONObject json = new JSONObject();
        try {
//            if (extras.containsKey("P")){
//                json = new JSONObject();
//                json.put("payload", extras.getString("P"));
//            }
//            else{
//                //String message = extras.getString("M");
//                //String newMsg = message.substring(message.indexOf("_", message.indexOf("_") + 1) + 1);
//                json.put("message", "test msg");
//            }
//
//            if (extras.containsKey("C")){
//                json.put("channel", extras.getString("C"));
//            }

            json.put("message", "test msg");

            Log.v(TAG, "extrasToJSON: " + json.toString());
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return json;

    }

    public void sendJavascript(JSONObject json) {
        try {
            String send = "";
            //String channel = json.getString("channel");
            try {

                WritableMap params = new WritableNativeMap();

                //JSONObject temp = new JSONObject(json.getString("payload"));
                JSONObject temp = new JSONObject("{message: 'test'}");

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
            } catch (JSONException ex) {
                WritableMap params = new WritableNativeMap();
                params.putString("message", json.getString("message"));
                params.putString("channel", json.getString("channel"));

//                if (queue != null){
//                    for (int id : this.queue.keySet()){
//                        OrtcClient cl = queue.get(id);
//                        if (cl != null && (cl.getIsConnected() && cl.isSubscribed(channel)))
//                        {
//                            gCachedExtras = null;
//                        }
//                    }
//                }
                if (gCachedExtras != null){
                    sendEvent(getReactApplicationContext(), "onPushNotification", params);
                    gCachedExtras = null;
                }

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
