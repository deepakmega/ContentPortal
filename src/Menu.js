'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/MaterialIcons');
var {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
} = React;

var Menu = React.createClass({
 
  render: function() {
  	return (
  		<View>
            <View style={{marginTop: 50, padding: 30, flexDirection: 'column'}}>
              <View style={{padding: 5, paddingTop: 15}}>
                <Text style={{color: '#FFF', fontSize:24}}>Categories</Text>
              </View>
              <View  style= {{borderTopWidth:1, borderColor: 'white', flexDirection: 'column'}}>  
                <TouchableHighlight onPress={this.handlePress} underlayColor="#1caf9a">
                  <View style={{padding: 5, paddingTop: 15, paddingLeft: 15, paddingRight: 15, flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={{color: '#FFF', fontSize:18}}><Icon name="face" style={{paddingRight: 10}} size={18}/> .NET</Text>
                    <Text style={{color: '#FFF', fontSize:18, textAlign: 'right'}}>55</Text>
                  </View>
                </TouchableHighlight>
                <TouchableHighlight onPress={this.handlePress} underlayColor="#1caf9a">
                  <View style={{padding: 5, paddingTop: 15, paddingLeft: 15, paddingRight: 15, flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={{color: '#FFF', fontSize:18}}><Icon name="fiber-new" style={{paddingRight: 10}} size={18}/> JAVA</Text>
                    <Text style={{color: '#FFF', fontSize:18, textAlign: 'right'}}>55</Text>
                  </View>
                </TouchableHighlight>
                <TouchableHighlight onPress={this.handlePress} underlayColor="#1caf9a">
                  <View style={{padding: 5, paddingTop: 15, paddingLeft: 15, paddingRight: 15, flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={{color: '#FFF', fontSize:18}}><Icon name="pets" style={{paddingRight: 10}} size={18}/> SQL</Text>
                    <Text style={{color: '#FFF', fontSize:18, textAlign: 'right'}}>55</Text>
                  </View>
                </TouchableHighlight>
                <TouchableHighlight onPress={this.handlePress} underlayColor="#1caf9a">
                  <View style={{padding: 5, paddingTop: 15, paddingLeft: 15, paddingRight: 15, flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={{color: '#FFF', fontSize:18}}><Icon name="language" style={{paddingRight: 10}} size={18}/> Web</Text>
                    <Text style={{color: '#FFF', fontSize:18, textAlign: 'right'}}>55</Text>
                  </View>
                </TouchableHighlight>
                <TouchableHighlight onPress={this.handlePress} underlayColor="#1caf9a">
                  <View style={{padding: 5, paddingTop: 15, paddingLeft: 15, paddingRight: 15, flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={{color: '#FFF', fontSize:18}}><Icon name="smartphone" style={{paddingRight: 10}} size={18}/> Mobile</Text>
                    <Text style={{color: '#FFF', fontSize:18, textAlign: 'right'}}>55</Text>
                  </View>
                </TouchableHighlight>
              </View>
            </View>
          </View>
  		);
  },

});
var styles = StyleSheet.create({
  toolbar: {
    height: 56,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  },
});

module.exports = Menu;