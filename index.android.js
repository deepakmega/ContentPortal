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
				<View style={styles.container}>
					<MainScreen navigator={navigationOperations}/>
				</View> 
				);
		} else if (route.name === 'story'){
			return (
				<View style={styles.container}>
				  <StoryScreen
				    style={{flex: 1}}
				    navigator={navigationOperations}
				    story={route.story} />
				</View>
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
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('ContentPortal', () => ContentPortal);
