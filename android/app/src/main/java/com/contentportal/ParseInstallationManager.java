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
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.parse.Parse;
import com.parse.ParseException;
import com.parse.ParseInstallation;
import com.parse.ParsePushBroadcastReceiver;
import com.parse.SaveCallback;
import com.urbanairship.UAirship;
import com.urbanairship.analytics.CustomEvent;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashSet;
import java.util.Set;

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
        successCallback.invoke(UAirship.shared().getPushManager().getGcmToken());
    }

    @ReactMethod
    public void setTags(ReadableArray updatedTags){

        Set<String> tags = new HashSet<String>();
        for (int i = 0; i < updatedTags.size(); i++) {
            tags.add(updatedTags.getString(i));
        }

        UAirship.shared().getPushManager().setTags(tags);
    }

    @ReactMethod
    public void setEnableNotification(boolean enabled){
        UAirship.shared().getPushManager().setUserNotificationsEnabled(enabled);
    }

    @ReactMethod
    public void addEvent(String eventName) {
        // Create and name an event
        CustomEvent event = new CustomEvent.Builder(eventName).create();
        // Then record it
        UAirship.shared().getAnalytics().addEvent(event);
    }

    @ReactMethod
    public void addEventWithID(String eventName, int id) {
        // Create and name a simple event - and with a value
        CustomEvent event = new CustomEvent.Builder(eventName)
                .setEventValue(id)
                .create();

        // Record the event it
        UAirship.shared().getAnalytics().addEvent(event);
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
