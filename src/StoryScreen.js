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

var VideoPlayer = require('./utils/VideoPlayer')

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
        <MyWebView
          startInLoadingState={true}
          style={styles.content}
          url={reqUrl}
          onScrollChange={this.onWebViewScroll}/>
        <View style={styles.toolbar}>
          <TouchableElement onPress={this._onPressBackButton}>
            <View style={styles.actionsContainer}>
                <View style={styles.actionItem}>
                  <Text style={styles.title}>Back</Text>
                </View>
            </View>
          </TouchableElement>
        </View>
      </View>
    );
  },
  renderVideoControl() {
    var TouchableElement = TouchableHighlight;
    if (Platform.OS === 'android') {
      TouchableElement = TouchableNativeFeedback;
    }
    return (
      <View style={styles.container}>
        <VideoPlayer/>
        <View style={styles.toolbar}>
          <TouchableElement onPress={this._onPressBackButton}>
            <View style={styles.actionsContainer}>
                <View style={styles.actionItem}>
                  <Text style={styles.title}>Back</Text>
                </View>
            </View>
          </TouchableElement>
        </View>
      </View>
    );
  },

  render: function() {
    return (
      <View style={styles.container}>
      {this.renderWebViewControl()}
    </View>
    );
  }
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
    backgroundColor: '#F5FCFF',
  },
  content: {
    flex: 1,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top:56,
  },
  actionsContainer: {
    height: 56,
    paddingTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
});


module.exports = StoryScreen;
