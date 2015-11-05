/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
   Text,
} = React;

var MainScreen = require('./src/MainScreen');

var ContentPortal = React.createClass({
  render: function() {
    return ( <MainScreen/>);
	},
});

AppRegistry.registerComponent('ContentPortal', () => ContentPortal);
