'use strict';

var React = require('react-native');
var MaterialKit = require('react-native-material-kit');
var Icon = require('react-native-vector-icons/MaterialIcons');
var Parse = require('parse/react-native');
var ParseReact = require('parse-react/react-native');
var LoadingIndicator = require('./utils/loading');
var ParseSubscribeChannel = require('./utils/ParseSubscribeChannel');
var StorageHelper = require('./utils/AsyncStorageWrapper');
var {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  Switch
} = React;

const {
  MKButton,
  MKColor,
  MKSwitch
} = MaterialKit;

var SubscribedCategory = new Array();

var Menu = React.createClass({
  propTypes: {
   onDone:   React.PropTypes.func
  },
  mixins: [ParseReact.Mixin],
  getInitialState: function(){
    StorageHelper.get("categories").then((value) =>{
          this.setState({"categories": value});
    });
    return {
      isLoadingContent: false
    };
  },
  observe: function(props, state) {
    var listingQuery = (new Parse.Query('Category'));
    listingQuery = listingQuery.ascending('Order');
    return { listings: listingQuery };
  },
  componentDidUpdate(){
    if(this.data.listings.length>0){
        StorageHelper.save("categories", this.data.listings);
     }
  },
  doneHandler: function(e) {
    console.log("calling Toggle");
    if (typeof this.props.onDone === 'function') {
        this.props.onDone();
    }
  },
  renderLoadingView: function() {
    // <LoadingIndicator ref="loadingControl"/>
    return (
      <View style= {[styles.container, {alignItems: 'center'}]}>
        <Text>
          Loading categories..
        </Text>
      </View>
    );
  },

  toggleSubscription: function(subName: string, toggleState: Object){
    if(toggleState.checked === true){
      if(!(SubscribedCategory.indexOf(subName) > -1)){
        SubscribedCategory.push(subName);
      }
    }
    else {
      if(SubscribedCategory.indexOf(subName) > -1){
        SubscribedCategory.splice(SubscribedCategory.indexOf('subName'),1);
      }
    }
  },

  render: function() {
    if ( !this.pendingQueries().length == 0 ) {
      return this.renderLoadingView();
    }

    var bindingData = this.data.listings.length > 0 ? this.data.listings : this.state.categories;

	   return (
  		<View>
        <View style={{marginTop: 50, padding: 30, flexDirection: 'column'}}>
          <View style={{padding: 5, paddingTop: 15}}>
            <Text style={{color: '#FFF', fontSize:24}}>Categories</Text>
          </View>
          <View  style= {{borderTopWidth:1, borderColor: 'white', flexDirection: 'column'}}>
            {
              bindingData.map(function(category: Object){
                return(
                  <View key={category.CategoryId} style={{padding: 5, paddingTop: 15, paddingLeft: 15, paddingRight: 15, flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={{color: '#FFF', fontSize:18}}><Icon name="face" style={{paddingRight: 10}} size={18}/>{category.Name}</Text>
                      <MKSwitch
                        trackSize={30}
                        trackLength={52}
                        onColor="rgba(255,152,0,.3)"
                        thumbOnColor={MKColor.Orange}
                        rippleColor="rgba(255,152,0,.2)"
                        onCheckedChange={(state) => {this.toggleSubscription(category.SubscriptionName, state)}}
                          />
                    <Text style={{color: '#FFF', fontSize:18, textAlign: 'right', paddingLeft: 15}}>55</Text>
                  </View>
                );
              }, this)
            }
          </View>
          <View style={{justifyContent: 'center', paddingTop: 30}}>
            <MKButton
              style={{justifyContent: 'center'}}
              backgroundColor={MKColor.Teal}
              shadowRadius={2}
              shadowOffset={{width:0, height:2}}
              shadowOpacity={.7}
              cornerRadius={5}
              shadowColor="teal"
              onPress={() => {
                this.subscribe();
              }}
              >
              <Text pointerEvents="none"
                    style={{color: 'white',textAlign: 'center', fontWeight: 'bold', fontSize:22, padding:5}}>
                Done
              </Text>
            </MKButton>
          </View>
        </View>
      </View>
  		);
  },
  subscribe: function(){
    console.log(SubscribedCategory);
    this.doneHandler();
    ParseSubscribeChannel.subscribe(SubscribedCategory);
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
  switch: {
   marginTop: 2,
   // marginBottom: 5,
 },
});

module.exports = Menu;
