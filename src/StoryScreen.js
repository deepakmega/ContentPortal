'use strict';

var React = require('react-native');
var {
  PixelRatio,
  View,
  Text,
  Animated,
  Platform,
  WebView,
  StyleSheet,
  TouchableHighlight,
  TouchableNativeFeedback
} = React;

var MaterialKit = require('react-native-material-kit');
var Icon = require('react-native-vector-icons/MaterialIcons');

const {
  MKButton,
  MKColor,
  mdl
} = MaterialKit;

const SingleColorSpinner = mdl.Spinner.singleColorSpinner()
  .build();

//var WebViewAndroid = require('react-native-webview-android');
//var MyWebView = (Platform.OS === 'ios') ? WebView : WebViewAndroid;//require('./WebView');
var MyWebView = WebView;
var PIXELRATIO = PixelRatio.get();
var HEADER_SIZE = 200;

var StoryScreen = React.createClass({
  getInitialState: function() {
    return({
      isLoading: false,
      detail: null,
      scrollY: 0,
      scrollValue: new Animated.Value(0)
    });
  },
  componentDidMount: function() {
    //this.fetchStroyDetail();
    console.log("component mounted");

  },
  onWebViewScroll: function(event) {
    //console.log('ScrollY: ' + event);
    var scrollY = -event / PIXELRATIO;
    this.state.scrollValue.setValue(scrollY);
  },
  _onPressBackButton: function() {
    if (this.props.navigator) {
      this.props.navigator.pop();
    }
  },
  renderLoadingView: function() {
    return (
      <View style= {[styles.loadingcontainer, {alignSelf: 'center',alignItems: 'center'}]}>
        <SingleColorSpinner/>
      </View>
    );
  },

  renderWebViewControl() {
    var TouchableElement = TouchableHighlight;
    // if (Platform.OS === "android" && Platform.Version >= 23) {
    //         return (
    //             <TouchableNativeFeedback {...this.props} background={TouchableNativeFeedback.Ripple(this.props.pressColor)}>
    //                 {this.props.children}
    //             </TouchableNativeFeedback>
    //         );
    //     } else {
    //         return (
    //             <TouchableHighlight {...this.props} underlayColor={this.props.pressColor}>
    //                 {this.props.children}
    //             </TouchableHighlight>
    //         );
    //     }
    //
    //
    // if (Platform.OS === 'android') {
    //   TouchableElement = TouchableNativeFeedback;
    // }

    var translateY = this.state.scrollValue.interpolate({
      inputRange: [0, HEADER_SIZE, HEADER_SIZE + 1], outputRange: [0, HEADER_SIZE, HEADER_SIZE]
    });
    console.log(this.props.story);
    var reqUrl = this.props.story.content_url;
    return (
      <View style={styles.container}>
        <View style={styles.topMenuContainer} ref='_topMenu'>
          <Icon name="navigate-before" style={{marginLeft: 10,textAlign:'center',color:'#ECAA5B'}}  onPress={this._onPressBackButton} size={30}/>
          <Text style={{color:'#ECAA5B',fontFamily:'Roboto', fontWeight:'bold'}}>THINKING THOUGHTS</Text>
          <View style={{justifyContent: 'space-between' ,flexDirection: 'row'}}>
            
          </View>
        </View>
        <MyWebView
          startInLoadingState={true}
          style={styles.content}
          url={reqUrl}
          onScrollChange={this.onWebViewScroll}
          renderLoading={this.renderLoadingView}
          />
      </View>
    );
  },
  // <TouchableElement onPress={this._onPressBackButton}>
  //   <View style={styles.actionsContainer}>
  //       <View style={styles.actionItem}>
  //         <Text style={styles.title}>Back</Text>
  //       </View>
  //   </View>
  // </TouchableElement>

  render: function() {
    return (
      <View style={styles.container}>
      {this.renderWebViewControl()}
    </View>
    );
  }
});

var styles = StyleSheet.create({
  titleContainer: {
    flex: 1,
    alignSelf: 'flex-end',
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  backButtonText: {
    flex: 1,
    fontSize: 24,
    fontWeight: '500',
    color: 'black',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#21212C',
    borderRadius: 8,
    borderColor: '#000000'
  },
  topMenuContainer:{
    backgroundColor: 'transparent',
    flex: .08,
    justifyContent: 'space-between',
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row'
  },
  content: {
    flex: 1,
    backgroundColor: '#21212C',
  },
  actionsContainer: {
    height: 56,
    paddingTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingcontainer: {
    flex: 1,
    justifyContent: 'center',
    borderRadius: 8,
    borderColor: '#000000'
  },
});


module.exports = StoryScreen;
