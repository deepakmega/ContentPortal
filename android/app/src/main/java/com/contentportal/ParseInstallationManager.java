package com.contentportal;
import android.app.Activity;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Bundle;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.parse.Parse;
import com.parse.ParseException;
import com.parse.ParseInstallation;
import com.parse.ParsePushBroadcastReceiver;
import com.parse.SaveCallback;

import org.json.JSONException;
import org.json.JSONObject;

/**
 * Created by Deepak on 12/29/2015.
 */
public class ParseInstallationManager  extends ReactContextBaseJavaModule {

    public ParseInstallationManager(ReactApplicationContext reactContext){
        super(reactContext);
    }

    @Override
    public String getName() {
        return "ParseAndroid";
    }

    @ReactMethod
    public void registerDevice(final Callback errorCallback, final Callback successCallback){

//        ParseInstallation.getCurrentInstallation().saveInBackground(new SaveCallback() {
//            @Override
//            public void done(ParseException e) {
//                String deviceToken = (String) ParseInstallation.getCurrentInstallation().get("deviceToken");
//                successCallback.invoke(deviceToken);
//            }
//        });

        GCMClientManager manager = new GCMClientManager(MainActivity.getMainParent(),MainActivity.getMainParent().getString(R.string.project_number));
        manager.registerIfNeeded(new GCMClientManager.RegistrationCompletedHandler() {
            @Override
            public void onSuccess(String registrationId, boolean isNewRegistration) {
                //String deviceToken = (String) ParseInstallation.getCurrentInstallation().get("deviceToken");
                successCallback.invoke(registrationId);
            }
        });
    }

    /**
     * Emit JavaScript events.
     */
    private void sendEvent(
            String eventName,
            Object params
    ) {
        getReactApplicationContext()
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }
}
