package com.contentportal;
import android.app.Application;
import com.parse.Parse;
import com.parse.ParseInstallation;
import com.parse.PushService;
import com.urbanairship.UAirship;
import com.urbanairship.push.notifications.DefaultNotificationFactory;

/**
 * Created by Deepak on 12/23/2015.
 */
public class MainApplication extends Application {

    public MainApplication() {
    }

    @Override
    public void onCreate() {
        super.onCreate();
        UAirship.takeOff(this, new UAirship.OnReadyCallback() {
            @Override
            public void onAirshipReady(UAirship airship) {
                DefaultNotificationFactory notificationFactory;
                notificationFactory = new DefaultNotificationFactory(getApplicationContext());
                // Enable user notifications
                airship.getPushManager().setUserNotificationsEnabled(true);
            }
        });
    }
}
