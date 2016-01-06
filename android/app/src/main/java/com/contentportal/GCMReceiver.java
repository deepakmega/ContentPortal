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

import org.json.JSONException;
import org.json.JSONObject;

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
            if (ParseGCMModule.isOnForeground()) {
                extras.putBoolean("foreground", true);


            } else {
                extras.putBoolean("foreground", false);
                // Send a notification if there is a message
                //if (extras.getString("M") != null && extras.getString("M").length() != 0) {
                this.createNotification(context, extras);
                //}
            }
            ParseGCMModule.sendExtras(extras);
        }
    }

//    @Override
//    protected  void onPushOpen(Context context, Intent intent) {
//        Bundle extras = intent.getExtras();
//        if (extras != null) {
//            // if we are in the foreground, just surface the payload, else open the app
//            if (ParseGCMModule.isOnForeground()) {
//                extras.putBoolean("foreground", true);
//
//
//            } else {
//                extras.putBoolean("foreground", false);
//                ParseGCMModule.sendExtras(extras);
//                super.onPushOpen(context, intent);
//            }
//        }
//    }

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

        String message = null;
        String jsonData = extras.getString("com.parse.Data");
        JSONObject jsonObject;
        try {
            jsonObject = new JSONObject(jsonData);
            message = jsonObject.getString("message");
        } catch (JSONException e) {
            e.printStackTrace();
        }

//        Random random = new Random();
//        int contentIntentRequestCode = random.nextInt();
//        int deleteIntentRequestCode = random.nextInt();
//        Intent openIntent = new Intent("com.parse.push.intent.OPEN");
//        openIntent.putExtras(extras);
//        openIntent.setPackage(packageName);
//        Intent deleteIntent = new Intent("com.parse.push.intent.DELETE");
//        deleteIntent.putExtras(extras);
//        deleteIntent.setPackage(packageName);
//        PendingIntent pContentIntent = PendingIntent.getBroadcast(context, contentIntentRequestCode, openIntent, 134217728);
//        PendingIntent pDeleteIntent = PendingIntent.getBroadcast(context, deleteIntentRequestCode, deleteIntent, 134217728);

//        com.parse.NotificationCompat.Builder parseBuilder = new com.parse.NotificationCompat.Builder(context);
//
//        parseBuilder.setContentTitle(title).setContentText(alert).setTicker(tickerText).setSmallIcon(this.getSmallIconId(context, intent)).setLargeIcon(this.getLargeIcon(context, intent)).setContentIntent(pContentIntent).setDeleteIntent(pDeleteIntent).setAutoCancel(true).setDefaults(-1);
//        if(alert != null && alert.length() > 38) {
//            parseBuilder.setStyle((new com.parse.NotificationCompat.Builder.BigTextStyle()).bigText(alert));
//        }


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
