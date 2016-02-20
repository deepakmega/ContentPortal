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
        <MyWebView
          startInLoadingState={true}
          style={styles.content}
          url={reqUrl}
          onScrollChange={this.onWebViewScroll}
          renderLoading={this.renderLoadingView}
          />
        <View style={styles.toolbar}>
          <View style={{padding:7, width: 80}}>
            <MKButton
              backgroundColor={MKColor.Teal}
              shadowRadius={2}
              shadowOffset={{width:0, height:2}}
              shadowOpacity={.7}
              shadowColor="black"
              onPress={this._onPressBackButton}
              style={{height:40}}
              >
              <View style={{padding:7}}>
              <Text pointerEvents="none"
                    style={{color: 'white', fontWeight: 'bold', textAlign: 'center'}}>
                Back
              </Text>
              </View>
            </MKButton>
          </View>
        </View>
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
  renderVideoControl() {
    var TouchableElement = TouchableHighlight;
    if (Platform.OS === 'android') {
      TouchableElement = TouchableNativeFeedback;
    }
    return (
      <View style={styles.container}>
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
  loadingcontainer: {
    flex: 1,
    justifyContent: 'center',
    borderRadius: 8,
    borderColor: '#000000'
  },
});


module.exports = StoryScreen;
