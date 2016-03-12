'use strict';

var React = require('react-native');
var Config = require('./../Config');
var StorageHelper = require('./AsyncStorageWrapper');
var Parse = require('parse/react-native');
var ParseReact = require('parse-react/react-native');
var ParseAndroidModule = require('./ParseAndroidModule');

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
        this.subscribeChannels(subscribedCategories);
        break;
      default:
        break;
    }
  },
  subscribeChannels: function(subscribedCategories: Array, isIOS: boolean) {
    ParseAndroidModule.setTags(subscribedCategories);
  },
  enableNotification: function(enabled: boolean){
    ParseAndroidModule.setEnableNotification(enabled);
  },
  addEvent: function(eventName: string){
    ParseAndroidModule.addEvent(eventName);
  },
  addEventWithID: function(eventName: string, id: number){
    ParseAndroidModule.addEventWithID(eventName, id);
  }
};

module.exports = ParseSubscribeChannel;
