'use strict';

var React = require('react-native');
var Config = require('./../Config');
var StorageHelper = require('./AsyncStorageWrapper');
var {
  Platform,
} = React;

var ParseSubscribeChannel = {
  subscribe: function(subscribedCategories: Array) {

    switch (Platform.OS) {
      case 'ios':
        // TODO: IOS
        break;
      case 'android':
        this.subscribeCategory(subscribedCategories, false);
        break;
      default:
        break;
    }
  },
  subscribeCategory: function(subscribedCategories: Array, isIOS: boolean) {
    StorageHelper.get("deviceToken").then((value) => {
      if (isIOS) {

      } else {
        var data = {
          "deviceToken": value,
          "channels": subscribedCategories,
          "deviceType": "android",
          "pushType": "gcm",
        };
        this.registerInstallation(data);
      }
    });
  },
  registerInstallation: function(data) {
    console.log("registering");
    var url = "https://api.parse.com";
    url += "/1/installations";

    var header = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'X-Parse-Application-Id': Config.prototype.TOKEN,
        'X-Parse-REST-API-Key': Config.prototype.RESTKEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    };

    console.log(header);

    fetch(url, header)
      .then((response) => {
        console.log("response" + response.status);
        response.text();
      })
      .then((responseText) => {
        console.log(responseText);
      })
      .catch((error) => {
        console.warn(error);
      });

    console.log("registered");
  }
};


module.exports = ParseSubscribeChannel;
