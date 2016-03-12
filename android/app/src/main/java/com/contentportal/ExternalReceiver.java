package com.contentportal;

import android.content.Context;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.util.Log;

import com.urbanairship.push.BaseIntentReceiver;
import com.urbanairship.push.PushMessage;

/**
 * Created by Deepak on 2/23/2016.
 */
public class ExternalReceiver extends BaseIntentReceiver {

    private static final String TAG = "ExternalReceiver";

    public ExternalReceiver(){
        super();
    }

    @Override
    protected void onChannelRegistrationSucceeded(@NonNull Context context, @NonNull String channelId) {
        Log.i(TAG, "Channel registration updated. Channel ID: " + channelId + ".");

//        Intent intent = new Intent(UAirshipPlugin.ACTION_CHANNEL_REGISTRATION);
//        LocalBroadcastManager.getInstance(context).sendBroadcast(intent);
    }

    @Override
    protected void onChannelRegistrationFailed(@NonNull Context context) {
        Log.i(TAG, "Channel registration failed.");

//        Intent intent = new Intent(UAirshipPlugin.ACTION_CHANNEL_REGISTRATION)
//                .putExtra(UAirshipPlugin.EXTRA_ERROR, true);
//
//        LocalBroadcastManager.getInstance(context).sendBroadcast(intent);
    }

    @Override
    protected void onPushReceived(@NonNull Context context, @NonNull PushMessage pushMessage, int notificationId) {
        Log.i(TAG, "Received push notification. Alert: " + pushMessage.getAlert() + ". Notification ID: " + notificationId);

        String message = pushMessage.getAlert();

        Bundle bundle = pushMessage.getPushBundle();

//        Intent intent = new Intent(UAirshipPlugin.ACTION_PUSH_RECEIVED)
//                .putExtra(UAirshipPlugin.EXTRA_PUSH, message)
//                .putExtra(UAirshipPlugin.EXTRA_NOTIFICATION_ID, notificationId);
//
//        LocalBroadcastManager.getInstance(context).sendBroadcast(intent);

        if(bundle!=null){
            ParseGCMModule.sendExtras(bundle);
        }

    }

    @Override
    protected void onBackgroundPushReceived(@NonNull Context context, @NonNull PushMessage pushMessage) {
        Log.i(TAG, "Received background push message: " + pushMessage);

//        Intent intent = new Intent(UAirshipPlugin.ACTION_PUSH_RECEIVED)
//                .putExtra(UAirshipPlugin.EXTRA_PUSH, message);
//
//        LocalBroadcastManager.getInstance(context).sendBroadcast(intent);
        Bundle bundle = pushMessage.getPushBundle();

        if(bundle!=null){
            ParseGCMModule.sendExtras(bundle);
        }
    }

    @Override
    protected boolean onNotificationOpened(@NonNull Context context, @NonNull PushMessage pushMessage, int i) {
        Log.i(TAG, "User clicked notification. Alert: " + pushMessage.getAlert());

//        UAirshipPlugin.launchPushMessage = message;
//        UAirshipPlugin.launchNotificationId = notificationId;
        Bundle bundle = pushMessage.getPushBundle();
        if(bundle!=null){
            ParseGCMModule.sendExtras(bundle);
        }
        return false;
    }

    @Override
    protected boolean onNotificationActionOpened(@NonNull Context context, @NonNull PushMessage pushMessage, int notificationId, @NonNull String buttonId, boolean isForeground) {
        Log.i(TAG, "User clicked notification button. Button ID: " + buttonId + " Alert: " + pushMessage.getAlert());

//        UAirshipPlugin.launchPushMessage = message;
//        UAirshipPlugin.launchNotificationId = notificationId;

        return false;
    }
}
