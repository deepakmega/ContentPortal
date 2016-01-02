package com.contentportal;

import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.NotificationCompat;
import android.util.Log;

import com.parse.ParsePushBroadcastReceiver;

import java.util.Random;

/**
 * Created by Deepak on 1/2/2016.
 */
public class GCMReceiver extends ParsePushBroadcastReceiver{
    private static final String TAG = "GcmReceiver";
    private static  Bundle gCachedExtras;
    public GCMReceiver(){
        super();
    }
    @Override
    protected void onPushReceive(Context context, Intent intent) {
        // Extract the payload from the message
        Bundle extras = intent.getExtras();
        if (extras != null) {
            // if we are in the foreground, just surface the payload, else post it to the statusbar
//            if (RealtimeMessagingAndroid.isOnForeground()) {
//                extras.putBoolean("foreground", true);
//
//            } else {
                //extras.putBoolean("foreground", false);
                // Send a notification if there is a message
                //if (extras.getString("M") != null && extras.getString("M").length() != 0) {
                    this.createNotification(context, extras);
                //}
            //}
            ParseGCMModule.sendExtras(extras);
        }
    }
    public void createNotification(Context context, Bundle extras)
    {
        NotificationManager mNotificationManager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
        String appName = getAppName(context);

        String packageName = context.getPackageName();
        Intent launchIntent = context.getPackageManager().getLaunchIntentForPackage(packageName);
        Class className = launchIntent.getComponent().getClass();

        Intent notificationIntent =  context.getPackageManager().getLaunchIntentForPackage(packageName);
        notificationIntent.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        notificationIntent.putExtra("pushBundle", extras);

        PendingIntent contentIntent = PendingIntent.getActivity(context, 0, notificationIntent, PendingIntent.FLAG_UPDATE_CURRENT);

        int defaults = Notification.DEFAULT_ALL;

        if (extras.getString("defaults") != null) {
            try {
                defaults = Integer.parseInt(extras.getString("defaults"));
            } catch (NumberFormatException e) {}
        }

        String channel = extras.getString("C");
        String message = extras.getString("message");

        NotificationCompat.Builder mBuilder =
                (NotificationCompat.Builder) new NotificationCompat.Builder(context)
                       .setDefaults(defaults)
                       .setSmallIcon(context.getApplicationInfo().icon)
                       .setWhen(System.currentTimeMillis())
                       .setContentTitle(context.getString(context.getApplicationInfo().labelRes))
                       .setContentIntent(contentIntent)
                       .setAutoCancel(true);


        if (message != null) {
            mBuilder.setContentText(message);
        } else {
            mBuilder.setContentText("<missing message content>");
        }

        int notId = 0;

        try {
            notId = new Random().nextInt();
        }
        catch(NumberFormatException e) {
            Log.e(TAG, "Number format exception - Error parsing Notification ID: " + e.getMessage());
        }
        catch(Exception e) {
            Log.e(TAG, "Number format exception - Error parsing Notification ID" + e.getMessage());
        }

        mNotificationManager.notify(appName, notId, mBuilder.build());
    }



    private static String getAppName(Context context)
    {
        CharSequence appName =
                context
                        .getPackageManager()
                        .getApplicationLabel(context.getApplicationInfo());

        return (String)appName;
    }
}
