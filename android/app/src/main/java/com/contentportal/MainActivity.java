package com.contentportal;

import android.app.Activity;
import android.os.Bundle;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.github.xinthink.rnmk.ReactMaterialKitPackage;

import java.util.Arrays;
import java.util.List;

import cl.json.RNSharePackage;

public class MainActivity extends ReactActivity {

    private ReactInstanceManager mReactInstanceManager;
    private static Activity mainParent;

    public static Activity getMainParent(){
        return mainParent;
    }

    @Override
    protected  void onCreate(Bundle savedInstanceState) {
        mainParent = this;
        super.onCreate(savedInstanceState);
        this.processPushBundle();
    }

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "ContentPortal";
    }

    /**
     * Returns whether dev mode should be enabled.
     * This enables e.g. the dev menu.
     */
    @Override
    protected boolean getUseDeveloperSupport() {
        return BuildConfig.DEBUG;
    }

    /**
     * A list of packages used by the app. If the app uses additional views
     * or modules besides the default ones, add more packages here.
     */
    @Override
    protected List<ReactPackage> getPackages() {
        return Arrays.<ReactPackage>asList(
            new MainReactPackage(),
                new ParseInstallationPackage(),
                new ParseGCMPackage(),
                new ReactMaterialKitPackage(),
                new RNSharePackage());
    }

    @Override
    protected void onPause() {
        super.onPause();

        if (mReactInstanceManager != null) {
            mReactInstanceManager.onPause();
        }

        if (ParseGCMModule.isOnForeground() == true) {
            ParseGCMModule.setIsOnForeground(false);
        }
    }

    @Override
    protected void onResume() {
        super.onResume();

        if (mReactInstanceManager != null) {
            mReactInstanceManager.onResume(this, this);
        }

        if (ParseGCMModule.isOnForeground() == false) {
            ParseGCMModule.setIsOnForeground(true);
        }
    }

    private void processPushBundle()
    {
        Bundle extras = getIntent().getExtras();

        if (extras != null)	{
            Bundle originalExtras = extras.getBundle("pushBundle");

            originalExtras.putBoolean("foreground", false);
            ParseGCMModule.sendExtras(originalExtras);
        }
    }
}
