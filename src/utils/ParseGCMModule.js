'use strict';

var React = require('react-native');
var NativeModules = React.NativeModules;
var parseGCMClient = NativeModules.ParseGCMModule;
var instances = 0;
class ParseGCMModule extends React.Component {
	id: String;
	constructor(props) {
    super(props);
		this.id = instances++;
	}

  RTPushNotificationListener(callBack: Function){
		console.log("RTPushNotificationListener called");
    require('RCTDeviceEventEmitter').addListener(
        'onPushNotification',
        callBack
      );
    parseGCMClient.checkForNotifications();
  }

  RTEventListener(notification, callBack: Function){
    console.log("notification listner called");
		var modNotification = String(this.id) + '-' + notification;
		var channelExists = RTEvents[modNotification];
		if (channelExists){
			this.RTRemoveEventListener(notification);
		}

		RTEvents[modNotification] = (
			require('RCTDeviceEventEmitter').addListener(
			  modNotification,
			  callBack
			)
		);
	}
}

module.exports = ParseGCMModule;
