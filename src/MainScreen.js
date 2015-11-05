/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var INITIAL_DATA = [
  {title: 'Deep Thought #1', content: "If there's no 'there' there, where is it and what's there?"},
];

var TOTAL_POST_COUNT = 0;
var CURRENT_INDEX = 0;

var REQUEST_URL = 'http://ec2-52-32-2-14.us-west-2.compute.amazonaws.com/ContentPortal/?json=get_posts';

var React = require('react-native');
var {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
} = React;

var MainScreen = React.createClass({
  getInitialState: function() {
    return {
      posts: INITIAL_DATA,
      post: null,
    };
  },
  render: function() {
    if ( !this.state.post ) {
      return this.renderLoadingView();
    }
    return this.renderPost();
  },
  renderPost: function() {
    return (
      <View style={styles.container}>
        <Image style={styles.image} resizeMode={Image.resizeMode.stretch} source={{uri: this.state.post.image}} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>
            {this.state.post.title}
          </Text>
          <Text style={styles.text}>
            {this.state.post.content}
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableHighlight
            style={styles.button}
            underlayColor='#ccc'
            onPress={this.updatePostNext}
          >
            <Text style={styles.buttonText}>Next Possdfsdft</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  },
  componentDidMount: function() {
      this.fetchData();
  },
  fetchData: function() {
      fetch(REQUEST_URL)
      .then((response) => response.json())
      .then((responseData) => {
          this.setState({
              //post: { title: responseData.posts[1].title, content: responseData.posts[1].custom_fields.content[0], image: responseData.posts[1].attachments[0].url },
              posts: responseData.posts,
          }, function(){
            TOTAL_POST_COUNT = responseData.count;
            this.updatePostNext();
          });
      })
      .done();
  },
  renderLoadingView: function() {
    return (
      <View style={[styles.container, {alignItems: 'center'}]}>
        <Text>
          Thinking thoughts...
        </Text>
      </View>
    );
  },
  updatePostNext: function() {
      
      if(CURRENT_INDEX >= TOTAL_POST_COUNT)
      {
            CURRENT_INDEX=0;
      }

      this.setState({
              post: { title: this.state.posts[CURRENT_INDEX].title, content: this.state.posts[CURRENT_INDEX].custom_fields.content[0], image: this.state.posts[CURRENT_INDEX].attachments[0].url },
          });
      CURRENT_INDEX ++;
  },
});


var Dimensions = require('Dimensions');
var windowSize = Dimensions.get('window');

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',    
    backgroundColor: '#FFFFFF',
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
    color: '#333333',
    marginBottom: 5,
    marginTop: 15,
  },
  buttonContainer: {
    bottom: 0,
    flex: .2,
    width: windowSize.width,
    backgroundColor: '#eee',
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 30,
    color: '#666666',
  },
  image: {
    margin:2,
    flex: 1, height: 200,
  }
});

module.exports = MainScreen;
