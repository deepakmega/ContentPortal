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

var REQUEST_URL = 'http://ec2-52-32-2-14.us-west-2.compute.amazonaws.com/ContentPortal/?json=get_posts&count=50';

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
  ViewPagerAndroid
} = React;

var ViewPager = require('react-native-viewpager');
var WindowSize = Dimensions.get('window');
var StoryScreen = require('./StoryScreen');
var ScrollPager = (Platform.OS === 'ios') ? ScrollView : ViewPagerAndroid;

var ds = new ViewPager.DataSource({
      pageHasChanged: (p1, p2) => p1 !== p2,
    });

var MainScreen = React.createClass({
  getInitialState: function() {
    
    return {
      posts: INITIAL_DATA,
      post: false,
      dataSource : ds.cloneWithPages(INITIAL_DATA),
      currentPage: null,
    };
  },

  render: function() {
    if ( !this.state.post ) {
      return this.renderLoadingView();
    }

    return(
      <ScrollPager style={{flex:1}} showsHorizontalScrollIndicator={false} pagingEnabled={true} horizontal={true}>
        {
          this.state.posts.map(function(story: Object){
            return (
              <View style={styles.container}>
                <Image style={styles.image} resizeMode={Image.resizeMode.stretch} source={{uri: this.findImageAttachment(story.custom_fields.image_url[0], story.attachments)}} />
                <View style={styles.textContainer}>
                  <TouchableHighlight onPress={()=>{this.selectStory(story)}}>
                    <Text style={styles.title}>
                      {story.title}
                    </Text>
                  </TouchableHighlight>
                  <Text style={styles.text}>
                    {story.custom_fields.content[0]}
                  </Text>
                </View>
              </View>
              );
          }, this)
        }
      </ScrollPager>
      );
  },
  _renderPost: function(story: Object,
    pageID: number|string,) {
    return (
      
        <View style={styles.container}>
          <Image style={styles.image} resizeMode={Image.resizeMode.stretch} source={{uri: this.findImageAttachment(story.custom_fields.image_url[0], story.attachments)}} />
          <View style={styles.textContainer}>
            <TouchableHighlight onPress={()=>{this.selectStory(story)}}>
              <Text style={styles.title}>
                {story.title}
              </Text>
            </TouchableHighlight>
            <Text style={styles.text}>
              {story.custom_fields.content[0]}
            </Text>
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
              dataSource: ds.cloneWithPages(responseData.posts),
          }, function(){
            TOTAL_POST_COUNT = responseData.count;
            this.setState({post: true},);
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
  selectStory: function(story: Object){
    story.read = true;
     // if (Platform.OS === 'ios') {
     //   this.props.navigator.push({
     //     title: story.title,
     //     component: StoryScreen,
     //     passProps: {story},
     //   });
     // } else {
      this.props.navigator.push({
        title: story.title,
        name: 'story',
        story: story,
      });
     //}
  },
  findImageAttachment : function(id: number, attachments: Array<Object>){
    var i = null;
    for (i = 0; attachments.length > i; i += 1) {
        if (attachments[i].id === parseInt(id)) {
            return attachments[i].url;
        }
    }
     
    return attachments[0].url;
  },
});


var Dimensions = require('Dimensions');
var windowSize = Dimensions.get('window');

var styles = StyleSheet.create({
  container: {
    flex: .8,
    justifyContent: 'center',    
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderRadius: 8,
    borderColor: '#000000',
    width: windowSize.width,
    height: windowSize.height-2,
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
    borderRadius: 4
  },
  scrollView: {
    backgroundColor: '#6A85B1',
    height: 300,
  },
  horizontalScrollView: {
    height: 120,
  },
});

module.exports = MainScreen;