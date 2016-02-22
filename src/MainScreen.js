/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
  Platform,
  TouchableHighlight,
  TouchableOpacity,
  ScrollView,
  ViewPagerAndroid,
  LayoutAnimation,
  TouchableWithoutFeedback,
  PushNotificationIOS,
  AppStateIOS,
  Animated,
  IntentAndroid,
  LinkingIOS,
  Alert
} = React;

//var Icon = require('react-native-vector-icons/FontAwesome');
var WindowSize = Dimensions.get('window');
var MenuScreen=require('./Menu');
var ScrollPager = (Platform.OS === 'ios') ? ScrollView : ViewPagerAndroid;
var Icon = require('react-native-vector-icons/MaterialIcons');
var Parse = require('parse/react-native');
var ParseReact = require('parse-react/react-native');
var confModule = require('./Config');
var StorageHelper = require('./utils/AsyncStorageWrapper');
var ParseAndroidModule = require('./utils/ParseAndroidModule');
var LoadingIndicator = require('./utils/loading');
var ConnectinInfo = require('./utils/connectionInfo');
var mod = require('./utils/ParseGCMModule');
var Share = (Platform.OS === 'ios') ? require('react-native-activity-view') : require('react-native-share');
var LinkIntent = (Platform.OS === 'ios') ? LinkingIOS : IntentAndroid;
var ParseGCMModule = new mod();
const {getFontSize} = require('./utils/utils');
import {fonts, scalingFactors} from './utils/fonts';
var Config = new confModule();
Parse.serverURL = Config.PARSEURL;
Parse.initialize(
  Config.TOKEN,
  Config.APPKEY
);

var initialPageNo = 0;

var MainScreen = React.createClass({
  mixins: [ParseReact.Mixin],
  getInitialState: function() {
    StorageHelper.get("posts").then((value) =>{
          this.setState({"posts": value});
          if(value.length > 0){
            this.setState({"lastReadPostID": value[value.length-1].postId})
          }
    });

    if(Platform.OS==='ios'){
      //this.setState({"currentAppState": AppStateIOS.currentState});
    }
    else{
        ParseAndroidModule.registerDevice(
          (errMsg) => {
            console.log(errMsg);
          },
          (deviceToken) => {
            console.log(deviceToken);
            Parse.Cloud.run('createGCMPlatformEndpoint', { "deviceToken": deviceToken })
              .then(function(response) {
                if(response["code"] == 141) {
                    console.log(response);
                }
                else {
                  console.log("Registered in SNS: " + response);
                  StorageHelper.save("deviceEndpointARN", response);
                }
            });

            StorageHelper.save("deviceToken", deviceToken);
          });
    }

    return {
      menuHeight: 0.1,
      slideValue: new Animated.Value(0),
      canLoadMoreContent: true,
      isLoadingContent: false,
      hasNotification: false,
      notificationPostId: -1,
      currentAppState: AppStateIOS.currentState
    };
  },
  observe: function(props, state) {
    var listingQuery = (new Parse.Query('Post'));
    listingQuery = listingQuery.descending('createdAt');
    listingQuery = listingQuery.limit(300);
    return { listings: listingQuery };
  },
  componentWillMount(){
    console.log("componentWillMount called");
    // Animate creation
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);

    if(Platform.OS==='ios'){

   PushNotificationIOS.requestPermissions();
    var registerInstallation = function(data) {
      var url = "https://api.parse.com";
      url += "/1/installations";
      fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'X-Parse-Application-Id': Config.TOKEN,
          'X-Parse-REST-API-Key': Config.RESTKEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      }).then((response) => {
        console.log("response" + response.status);
        response.text();
      })
      .then((responseText) => {
        console.log(responseText);
      })
      .catch((error) => {
        console.warn(error);
      });

      console.log("register completed");
    };
    var that = this;
    PushNotificationIOS.addEventListener('register', function(token){
      console.log("register called");
      StorageHelper.save("deviceToken", token);
      registerInstallation({
        "deviceType": "ios",
        "deviceToken": token,
        "channels": ["global"],
      })
    });
    PushNotificationIOS.addEventListener('notification', function(notification){
      if(this.state.currentAppState == "active"){
      console.log("notification Recieved");
      console.log(notification);
      console.log(notification._data.postId);
      console.log(notification._data.message);
    }
    else{
      this.setState({hasNotification: true});
      this.setState({notificationPostId: notification._data.postId})
    }
    });
  }
  },
  componentWillUnmount: function() {
    if(Platform.OS==='ios'){
      AppStateIOS.removeEventListener('change', this._handleAppStateChange);
    }
  },
  _handleAppStateChange: function(currentAppState) {
    this.setState({ currentAppState, });
  },
  componentDidMount: function() {
    this.refs.loadingControl.startLoading();
    if(Platform.OS==='ios'){
      AppStateIOS.addEventListener('change', this._handleAppStateChange);
    }
    else{
      ParseGCMModule.RTPushNotificationListener(this.onNotification);
    }
  },
  onNotification: function(data){
    var jsonData = JSON.stringify(data);
    console.log("Received notification: " + jsonData);
    var response = JSON.parse(jsonData).payload;
    var message = response["message"];
    var postId = response["postId"];

    console.log("Message: " + message + " PostId: " + postId);
    //TODO: ios
    console.log(postId);
    this.setState({hasNotification: true});
    this.setState({notificationPostId: postId});
  },
  getInitPageNumber: function(postId){
    if(this.data.listings.length>0){
        for(var i=0; i< this.data.listings.length; i++){
          if(this.data.listings[i].postId == postId){
            initialPageNo = i;
            return initialPageNo;
          }
        }
      }

      return -1;
  },
  scrollToPage: function(page){
    var x = WindowSize.width * page;
    var y = 0;
    this.refs._scrollPager.scrollTo(x, y, false);
  },
  componentDidUpdate(){
    if(this.data.listings.length>0){
        StorageHelper.save("posts", this.data.listings);
        var notificationPostId = parseInt(this.state.notificationPostId);
        console.log("NotifictionPostID");
        console.log(this.state.notificationPostId);
        console.log(notificationPostId);
        var pageNo = this.getInitPageNumber(notificationPostId);
        if(this.state.hasNotification && notificationPostId > -1){
          if(Platform.OS==='ios'){
            console.log("ScrollToPage start");
            console.log(pageNo);
            scrollToPage(pageNo);
            console.log("ScrollToPage End");

          }else{
            console.log("Scrolling to:");
          console.log(pageNo);
          if(pageNo > -1){
            this.refs._scrollPager.setPage(pageNo);
          }
          this.setState({hasNotification: false});
        }
      }
    }
  },
  render: function() {
    if ( !this.pendingQueries().length == 0 ) {
      return this.renderLoadingView();
    }

    var scaled = StyleSheet.create({
      normal: {
        fontSize: WindowSize.width / scalingFactors.normal
      },
      heading: {
        fontSize: WindowSize.width / scalingFactors.heading
      }
    });

    var bindingData = this.data.listings.length > 0 ? this.data.listings : this.state.posts;
    // TODO: add no posts card if both are emtpy.
    // TODO: set to last postID

// if(data.listings.length>0){
//     for(var i=0; i< this.data.listings.length; i++){
//       if(this.data.listings[i].postId == this.state.lastReadPostID){
//         initialPageNo = this.data.listings - 1 - i;
//         break;
//       }
//     }
//   }

    return(
    <View style={styles.container}>

        <View style={styles.topMenuContainer} ref='_topMenu'>
          <Icon name="menu" style={{marginLeft: 10,textAlign:'center',}}  onPress={()=>{this.toggleMenu()}} size={26}/>
          <View style={{justifyContent: 'space-between' ,flexDirection: 'row'}}>
            <Icon name="skip-previous" style={{paddingRight: 20}} onPress={()=>{this.scrollToFirst()}} size={26} />
            <Icon name="more-vert" style={{paddingRight: 10}} size={26}/>
          </View>
        </View>

        <View style={{flex:1}}>
          <ScrollPager ref='_scrollPager' initialPage={initialPageNo} style={{flex:1}} showsHorizontalScrollIndicator={false} pagingEnabled={true} horizontal={true}>
            {
              bindingData.map(function(story: Object){
                return (
                  <View key={story.objectId} style={{flex:1,width: WindowSize.width, height: WindowSize.height-40}}>
                    <Image style={styles.image} resizeMode={Image.resizeMode.cover} source={{uri:story.image_url}}/>
                    <View style={styles.textContainer}>
                        <Text style={[styles.title, fonts.heading, scaled.heading]} numberOfLines={1}>
                          {story.title}
                        </Text>
                      <Text style={[styles.text, fonts.normal, scaled.normal]}  numberOfLines={10}>
                        {story.content}
                      </Text>
                    </View>
                    <View style= {{flex: .1, padding: 10}}>
                      <View style= {{borderTopWidth:1, flexDirection: 'row', justifyContent: 'space-between', padding: 5, paddingLeft:10, paddingRight:10}}>
                        <Text>By: {story.authorName}</Text>
                        <Text  onPress={()=>{this.selectStory(story)}} style={{color: '#07c'}}>more at {story.content_host}</Text>
                        <Icon name="share" style={{paddingRight: 10}} size={24} onPress={()=>{this.onShare(story)}}/>
                      </View>
                    </View>
                  </View>
                  );
              }, this)
            }
          </ScrollPager>

          <Animated.View style={[styles.toggleMenu, {height: this.state.menuHeight}]} >
            <MenuScreen onDone={this.toggleMenu}/>
          </Animated.View>
        </View>

      </View>
      );
  },
  renderLoadingView: function() {
    return (
      <View style= {[styles.container, {alignItems: 'center'}]}>
        <LoadingIndicator ref="loadingControl"/>
        <Text>
          Thinking thoughts...
        </Text>
      </View>
    );
  },
  onShare: function(story: Object) {
    if(Platform.OS==='ios'){
      Share.show({
      text: story.title,
      url: story.content_host,
      imageUrl: story.image_url,
    });
    }
    else{
      Share.open({
          share_text: story.content,
          share_URL: story.content_host,
          title: story.title
        },function(e) {
          console.log(e);
      });
    }
  },
  selectStory: function(story: Object){
    if(story.content_type === 1){
      LinkIntent.canOpenURL(story.content_url, (supported) => { if (!supported) { console.log('Can\'t handle url: ' + story.content_url); } else { LinkIntent.openURL(story.content_url); } });
    }else{
      this.props.navigator.push({
        title: story.title,
        name: 'story',
        story: story,
      });
    }
  },
  scrollToFirst : function(){
    if(Platform.OS==='ios'){
      this.refs._scrollPager.scrollTo(0,0);
    }
    else{
      this.refs._scrollPager.setPage(0);
    }
  },
  toggleMenu: function()
  {
    console.log("calling Toggle");
    LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
    if(this.state.menuHeight === 0.1){
      this.setState({menuHeight: WindowSize.height});
    }
    else{
      this.setState({menuHeight: 0.1});
    }
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderColor: '#000000'
  },
  textContainer: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 15,
  },
  text: {
    fontSize: 12,
    textAlign: 'left',
    color: '#141414',
    marginBottom: 5,
    marginTop: 15,
  },
  buttonContainer: {
    bottom: 0,
    flex: .2,
    width: WindowSize.width,
    backgroundColor: '#eee',
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    margin:3,
    flex: 1, height: 200,
    borderRadius: 4
  },
  scrollView: {
    backgroundColor: '#6A85B1',
    height: 300,
  },
  horizontalScrollView: {
    height: 120,
  },
  topMenuContainer:{
    backgroundColor: 'transparent',
    flex: .05,
    justifyContent: 'space-between',
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row'
  },
  toggleMenu:{
    position: 'absolute',
    left: 0,
    top: 0,
    width:WindowSize.width,
    height: WindowSize.height,
    backgroundColor: '#2b3643',
    opacity:0.95,
    padding:0,
    overflow:'hidden'
  }
});

module.exports = MainScreen;
