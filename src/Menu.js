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
  MKSwitch,
  MKIconToggle
} = MaterialKit;

var SubscribedCategoriesArray = new Array();

var Menu = React.createClass({
  propTypes: {
   onDone:   React.PropTypes.func
  },
  mixins: [ParseReact.Mixin],
  getInitialState: function(){
    StorageHelper.get("categories").then((value) =>{
          this.setState({"categories": value});
    });
    StorageHelper.get("subscribedCategories").then((value) =>{
          SubscribedCategoriesArray = value.slice();
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
    if (typeof this.props.onDone === 'function') {
      // Closes the menu by parent method
      this.props.onDone();
    }
  },

  subscribe: function(){
    // Close menu view
    StorageHelper.save("subscribedCategories", SubscribedCategoriesArray);
    this.doneHandler();
    ParseSubscribeChannel.subscribe(SubscribedCategoriesArray);
  },

  toggleSubscription: function(categoryId, toggleState: Object){
    if(toggleState.checked === true){
      if(!(SubscribedCategoriesArray.indexOf(categoryId) > -1)){
        SubscribedCategoriesArray.push(categoryId);
      }
    }
    else {
      if(SubscribedCategoriesArray.indexOf(categoryId) > -1){
        SubscribedCategoriesArray.splice(SubscribedCategoriesArray.indexOf(categoryId),1);
      }
    }
  },

  checkIfSubscribed: function(categoryId){
    return (SubscribedCategoriesArray.indexOf(categoryId) > -1);
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
  render: function() {
    console.log("renderCalled");
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
                console.log("mapped");
                return(
                  <View key={category.CategoryId} style={{padding: 5, paddingTop: 15, paddingLeft: 15, paddingRight: 15, flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={styles.subText}><Icon name="face" style={{paddingRight: 10}} size={18}/>{category.Name}</Text>
                    <View style={{flex:1, flexDirection: 'row', justifyContent: 'flex-end', paddingRight:15}}>
                      <MKIconToggle checked={this.checkIfSubscribed(category.CategoryId)} style={{width:0, height:0, }} onCheckedChange={(state) => {this.toggleSubscription(category.CategoryId, state)}}>
                        <Text style={styles.subText, styles.toggleYes} pointerEvents="none">No</Text>
                        <Text style={styles.subText, styles.toggleNo} state_checked={true} pointerEvents="none">Yes</Text>
                      </MKIconToggle>
                    </View>
                    <Text style={styles.subText, {textAlign: 'right', paddingLeft: 15}}>55</Text>
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
                    style={styles.button}>
                Done
              </Text>
            </MKButton>
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
  switch: {
   marginTop: 2,
   // marginBottom: 5,
 },
 subText: {
  fontSize: 18,
  color: '#FFF'
 },
 toggleYes: {
  color: '#FFF'
 },
 toggleNo: {
  color: '#1caf9a'
 },
 button: {
  color: 'white',
  textAlign: 'center',
  fontWeight: 'bold',
  fontSize:22,
  padding:5
 }
});

module.exports = Menu;
