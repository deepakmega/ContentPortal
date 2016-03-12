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
var ScrollableTabView = require('react-native-scrollable-tab-view');

var LinkIntent = (Platform.OS === 'ios') ? LinkingIOS : IntentAndroid;
var ParseGCMModule = new mod();
const {getFontSize} = require('./utils/utils');
import {fonts, scalingFactors} from './utils/fonts';
import Button from 'apsl-react-native-button'

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
    });

    if(Platform.OS==='ios'){
      //this.setState({"currentAppState": AppStateIOS.currentState});
    }
    else{
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

    var message = data["payload"]["com.urbanairship.push.ALERT"];
    var postId = data["payload"]["postId"];

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
    console.log("componentDidUpdate");
    this.receiveDataCallback();
  },
  receiveDataCallback: function(){
    if(this.data.listings.length>0){
        StorageHelper.save("posts", this.data.listings);
        console.log("ComponentDidUpdate Called " + this.state.notificationPostId);
        var notificationPostId = parseInt(this.state.notificationPostId);
        console.log("NotifictionPostID: " + this.state.notificationPostId);
        console.log("Has notification: " + this.state.hasNotification);
        var pageNo = this.getInitPageNumber(notificationPostId);
        console.log("Page number: " + pageNo);
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
  receivedData: function() {
    //this.receiveDataCallback();
  },
  render: function() {
    if ( !this.pendingQueries().length == 0 ) {
      return this.renderLoadingView();
    }


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
          <Icon name="menu" style={{marginLeft: 10,textAlign:'center',color:'#ECAA5B'}}  onPress={()=>{this.toggleMenu()}} size={30}/>
          <Text style={{color:'#ECAA5B',fontFamily:'Roboto', fontWeight:'bold'}}>THINKING THOUGHTS</Text>
          <View style={{justifyContent: 'space-between' ,flexDirection: 'row'}}>
            <Icon name="skip-previous" style={{paddingRight: 20,color:'#ECAA5B'}} onPress={()=>{this.scrollToFirst()}} size={30} />
          </View>
        </View>

        <View style={{flex:1}}>
        <ScrollableTabView>
          <View id='test0' tabLabel="React" >
          <ScrollPager ref='_scrollPager' initialPage={initialPageNo} style={{flex:1}} showsHorizontalScrollIndicator={false} pagingEnabled={true} horizontal={true}>
            {
              bindingData.map(function(story: Object){
                return (
                  <View key={story.objectId} style={{flex:1,width: WindowSize.width, height: WindowSize.height-40}} renderToHardwareTextureAndroid={true}>
                    <Image style={styles.image} resizeMode={Image.resizeMode.cover} source={{uri:story.image_url}}>
                      <View style={styles.titleContainer}>
                        <Text style={styles.titleHost} numberOfLines={1}>
                          {story.content_host}
                        </Text>
                        <Text style={styles.title} numberOfLines={2}>
                          {story.title}
                        </Text>
                      </View>
                    </Image>
                    <View style={styles.textContainer}>
                      <Text style={[styles.text]}  numberOfLines={9}>
                        {story.content}
                      </Text>
                      <Text style= {{color:'#ECAA5B',paddingBottom:5}}>by {story.authorName}</Text>
                    </View>
                    <View style= {{flex: .2, padding: 10}}>
                      <View style= {{borderTopWidth:0, flexDirection: 'row', justifyContent: 'space-between', padding: 5, paddingLeft:15, paddingRight:15}}>
                        <Icon.Button name="favorite" iconStyle={{color:'#ECAA5B'}} style={styles.buttonStyle} onPress={this.loginWithFacebook}>
                           <Text style={styles.buttonText}>LIKE</Text>
                        </Icon.Button>
                        <Icon.Button name="import-contacts" iconStyle={{color:'#ECAA5B'}} style={styles.buttonStyle} onPress={()=>{this.selectStory(story)}}>
                           <Text style={styles.buttonText}>OPEN</Text>
                        </Icon.Button>
                        <Icon.Button name="share" iconStyle={{color:'#ECAA5B'}} style={styles.buttonStyle}  onPress={()=>{this.onShare(story)}}>
                           <Text style={styles.buttonText}>SHARE</Text>
                        </Icon.Button>
                      </View>
                    </View>
                  </View>
                  );
              }, this)
            }
          </ScrollPager>
          </View>
  </ScrollableTabView>
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
        <Text style={{color:'#ECAA5B'}}>
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
    backgroundColor: '#21212C',
    borderRadius: 8,
    borderColor: '#000000'
  },
  textContainer: {
    flex: 1,
    paddingLeft: 30,
    paddingRight: 30,
    flexDirection:'column',
  },
  title: {
    fontSize: 22,
    lineHeight:28,
    marginBottom: 15,
    color: '#FFFFFF',
    fontFamily:'Montserrat-Regular'
  },
  titleHost:{
    marginTop:10,
    fontSize: 12,
    textAlign: 'left',
    color: '#FFFFFF',
    fontFamily:'Montserrat-Regular',
    fontWeight:'normal'
  },
  titleContainer: {
    flex: 1,
    alignSelf: 'flex-end',
    flexDirection:'column',
    paddingLeft: 30,
    paddingRight: 30,
    backgroundColor: 'rgba(33,33,44,0.8)',
  },
  text: {
    fontSize: 12,
    textAlign: 'left',
    color: '#FFFFFF',
    marginBottom: 5,
    marginTop: 15,
    fontFamily:'Montserrat-Light',
    lineHeight:22,
    fontWeight:'normal'
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
    marginLeft:3,
    marginRight:3,
    flex: 1, height: 200,
    borderRadius: 4,
    flexDirection: 'row'
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
    flex: .08,
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
  },
  buttonStyle: {
    borderColor: 'white',
    backgroundColor: '#21212C',
    borderRadius: 5,
    borderWidth: 1,
  },
  buttonText:{
    fontSize: 12,
    textAlign: 'center',
    color:'white',
    fontFamily:'Montserrat-Regular',
  }
});

module.exports = MainScreen;
