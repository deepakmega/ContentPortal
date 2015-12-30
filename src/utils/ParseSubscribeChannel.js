'use strict';

var React = require('react-native');
var confModule = require('./../Config');
var StorageHelper = require('./AsyncStorageWrapper');
var {
  Platform,
} = React;

var ParseSubscribeChannel = {
  subscribe: function(subscribedCategories: Array){

    switch(Platform.OS) {
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
  subscribeCategory: function(subscribedCategories: Array, isIOS: boolean){
    StorageHelper.get("deviceToken").then((value) =>{
      if(isIOS){

      }
      else{
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

      var token='OdALkZZtfT6ke8zNPxko1i6drkpzXvstw8noNTpm';
      var restkey='5gsip6PqUqICu2m1aak9e75heqISS4zYIV81EJcN';
      var header = {
        method:'POST',
        headers:{
          'Accept': 'application/json',
          'X-Parse-Application-Id': token,
          'X-Parse-REST-API-Key': restkey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)};

        console.log(header);

      fetch('https://api.parse.com/1/installations', header)
      .then((response) => {console.log("response"+ response);response.text();})
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
