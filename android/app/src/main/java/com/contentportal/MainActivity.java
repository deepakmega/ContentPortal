package com.contentportal;

import android.app.Activity;
import android.os.Bundle;
import android.view.KeyEvent;

import com.facebook.react.LifecycleState;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactRootView;
import com.facebook.react.modules.core.DefaultHardwareBackBtnHandler;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.github.xinthink.rnmk.ReactMaterialKitPackage;
import com.parse.ParseInstallation;

public class MainActivity extends Activity implements DefaultHardwareBackBtnHandler {

    private ReactInstanceManager mReactInstanceManager;
    private ReactRootView mReactRootView;

    private static Activity mainParent;

    public static Activity getMainParent(){
        return mainParent;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        mainParent = this;
        super.onCreate(savedInstanceState);
        mReactRootView = new ReactRootView(this);

        mReactInstanceManager = ReactInstanceManager.builder()
                .setApplication(getApplication())
                .setBundleAssetName("index.android.bundle")
                .setJSMainModuleName("index.android")
                .addPackage(new MainReactPackage())
                .addPackage(new ParseInstallationPackage())
                .addPackage(new ParseGCMPackage())
                .addPackage(new ReactMaterialKitPackage())
                .setUseDeveloperSupport(BuildConfig.DEBUG)
                .setInitialLifecycleState(LifecycleState.RESUMED)
                .build();

        mReactRootView.startReactApplication(mReactInstanceManager, "ContentPortal", null);
        ParseInstallation.getCurrentInstallation().saveInBackground();
        setContentView(mReactRootView);
        this.processPushBundle();
    }

    @Override
    public boolean onKeyUp(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_MENU && mReactInstanceManager != null) {
            mReactInstanceManager.showDevOptionsDialog();
            return true;
        }
        return super.onKeyUp(keyCode, event);
    }

    @Override
    public void onBackPressed() {
      if (mReactInstanceManager != null) {
        mReactInstanceManager.onBackPressed();
      } else {
        super.onBackPressed();
      }
    }

    @Override
    public void invokeDefaultOnBackPressed() {
      super.onBackPressed();
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
