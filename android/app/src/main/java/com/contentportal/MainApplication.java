package com.contentportal;
import android.app.Application;
import com.parse.Parse;
import com.parse.ParseInstallation;
import com.parse.PushService;

/**
 * Created by Deepak on 12/23/2015.
 */
public class MainApplication extends Application {

    public MainApplication() {
    }

    @Override
    public void onCreate() {
        super.onCreate();
        Parse.initialize(this, "OdALkZZtfT6ke8zNPxko1i6drkpzXvstw8noNTpm", "GmytnVpiK1p2awN7lndSTlr0TDOkMicGeM1biKce");
    }
}
