/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  BackAndroid,
  Text,
  View,
  Navigator,
  StyleSheet,
} = React;

var MainScreen = require('./src/MainScreen');
var TimerMixin = require('react-timer-mixin');
var StoryScreen = require('./src/StoryScreen');

var _navigator;
BackAndroid.addEventListener("hardwareBackPress", function(){
  if (_navigator && _navigator.getCurrentRoutes().length > 1){
    _navigator.pop();
    return true;
  }
  return false;
});

var ContentPortal = React.createClass({
  mixins: TimerMixin,
  RouteMapper: function(route, navigationOperations, onComponentRef){
    _navigator = navigationOperations;
    if(route.name === 'home'){
      return ( 
        <MainScreen navigator={navigationOperations}/>
        );
    } else if (route.name === 'story'){
      return (
          <StoryScreen
            style={{flex: 1}}
            navigator={navigationOperations}
            story={route.story} />
        );
    }
  },
  render: function() {
    var initialRoute = {name: 'home'};
    return (
        <Navigator
          style={styles.container}
          initialRoute={initialRoute}
          configureScene={() => Navigator.SceneConfigs.FadeAndroid}
          renderScene={this.RouteMapper}/>
      );
  },
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#000000'
  }
});

AppRegistry.registerComponent('ContentPortal', () => ContentPortal);