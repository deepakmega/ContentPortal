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
} = React;

var MyWebView = (Platform.OS === 'ios') ? WebView : require('./WebView');

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
  fetchStroyDetail: function() {
    var reqUrl = 'http://google.com';
    this.setState({
      isLoading: true,
      detail: null,
    });
    fetch(reqUrl)
      .catch((error) => {
        this.setState({
          isLoading: false,
          detail: null,
        });
      })
      .then((responseData) => {
        this.setState({
          isLoading: false,
          detail: responseData,
        });
      })
      .done();
  },
  onWebViewScroll: function(event) {
    //console.log('ScrollY: ' + event);
    var scrollY = -event / PIXELRATIO;
    this.state.scrollValue.setValue(scrollY);
  },
  render: function() {

    // if (this.state.isLoading) {
    //   return (
    //     <View style={[styles.container, styles.center]}>
    //       <Text>
    //         Loading...
    //       </Text>
    //     </View>
    //   );
    // } else {
    //   if (this.state.detail) {
        var translateY = this.state.scrollValue.interpolate({
          inputRange: [0, HEADER_SIZE, HEADER_SIZE + 1], outputRange: [0, HEADER_SIZE, HEADER_SIZE]
        });
        // var html = '<!DOCTYPE html><html><head><link rel="stylesheet" type="text/css" href="'
        //   //+ this.state.detail.css[0]
        //   + '" /></head><body>' //+ this.state.detail.body
        //   + '</body></html>';
        console.log(this.props.story);
        var reqUrl = this.props.story.custom_fields.content_url[0];
        return (
          <View style={styles.container}>
            <MyWebView
              style={styles.content}
              url={reqUrl}
              onScrollChange={this.onWebViewScroll}/>
          </View>
        );
      // } else {
      //   return (
      //     <View style={[styles.container, styles.center]}>
      //       <Text>
      //         加载失败
      //       </Text>
      //     </View>
      //   );
      // }
    //}
  }
});

var styles = StyleSheet.create({
  toolbar: {
    backgroundColor: '#00a2ed',
    height: 56,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  },
  header: {
    height: HEADER_SIZE,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 56,
  },
  headerImage: {
    height: HEADER_SIZE,
    flexDirection: 'row',
    backgroundColor: '#DDDDDD',
  },
  titleContainer: {
    flex: 1,
    alignSelf: 'flex-end',
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: 'white',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top:56,
  },
});


module.exports = StoryScreen;