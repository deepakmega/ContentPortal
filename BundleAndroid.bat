curl "http://localhost:8081/index.android.bundle?platform=android" -dev=false -o "android/app/src/main/assets/index.android.bundle"

REM react-native bundle --platform android --dev false --entry-file index.android.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res/