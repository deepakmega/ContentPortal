'use strict';

var React = require('react-native');
var Config = require('./../Config');
var StorageHelper = require('./AsyncStorageWrapper');
var Parse = require('parse/react-native');
var ParseReact = require('parse-react/react-native');

var {
  Platform,
} = React;

var ParseSubscribeChannel = {
  subscribe: function(subscribedCategories: Array) {

    switch (Platform.OS) {
      case 'ios':
        this.subscribeCategory(subscribedCategories, true);
        break;
      case 'android':
        this.subscribeChannels(subscribedCategories, false);
        break;
      default:
        break;
    }
  },
  subscribeChannels: function(subscribedCategories: Array, isIOS: boolean) {
    console.log("Subscribing: " + StorageHelper.get("deviceEndpointARN"));
    StorageHelper.get("deviceEndpointARN").then((value) => {
      console.log("EndpointARN: " + value);
      var data = {
        "endpointARN": value,
        "channels": JSON.stringify(subscribedCategories),
        "deviceType": "android",
        "pushType": isIOS ? "ios" : "gcm",
      };
      console.log("cat: " + subscribedCategories);
      Parse.Cloud.run('subscribeEndpointARN', data)
        .then(function(response) {
          if(response["code"] == 141) {
              console.log(response);
          }
          else {
            console.log(response["result"]);
          }
      });
    });
  },
  subscribeCategory: function(subscribedCategories: Array, isIOS: boolean) {
    StorageHelper.get("deviceToken").then((value) => {
      if (isIOS) {
        var data = {
          "deviceToken": value,
          "channels": subscribedCategories,
          "deviceType": "ios",
        };
        this.registerInstallation(data);

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
