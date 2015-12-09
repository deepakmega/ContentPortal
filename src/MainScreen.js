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
  ViewPagerAndroid,
  LayoutAnimation,
  TouchableWithoutFeedback,
  Animated
} = React;

//var Icon = require('react-native-vector-icons/FontAwesome');
var WindowSize = Dimensions.get('window');
var StoryScreen = require('./StoryScreen');
var ScrollPager = (Platform.OS === 'ios') ? ScrollView : ViewPagerAndroid;
var Icon = require('react-native-vector-icons/MaterialIcons');

var MainScreen = React.createClass({
  getInitialState: function() {    
    return {
      posts: INITIAL_DATA,
      post: false,
      currentPage: null,
      menuHeight: 1,
      slideValue: new Animated.Value(0),
    };
  },
  componentWillMount(){
    // Animate creation
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
  },
  render: function() {
    if ( !this.state.post ) {
      return this.renderLoadingView();
    }

    // Check if this is fixed in later versions of react native vector icons
    var lineHeight26 = this.calculateLineHeight(26);
    var lineHeight24 = this.calculateLineHeight(24);

    return(
    <View style={styles.container}>

        <View style={styles.topMenuContainer} ref='_topMenu'>
          <Icon name="menu" style={{marginLeft: 10,textAlign:'center', lineHeight:lineHeight26}}  onPress={()=>{this.toggleMenu()}} size={26}/>
          <View style={{justifyContent: 'space-between' ,flexDirection: 'row'}}>
            <Icon name="skip-previous" style={{paddingRight: 20, lineHeight:lineHeight26}} onPress={()=>{this.scrollToFirst()}} size={26} />
            <Icon name="more-vert" style={{paddingRight: 10, lineHeight:lineHeight26}} size={26}/>
          </View>
        </View>

        <View style={{flex:1}}>
        <ScrollPager ref='_scrollPager' style={{flex:1}} showsHorizontalScrollIndicator={false} pagingEnabled={true} horizontal={true}>
          {
            this.state.posts.map(function(story: Object){
              return (
                <View key={story.id} style={{flex:1,width: WindowSize.width, height: WindowSize.height-40}}>
                  <Image style={styles.image} resizeMode={Image.resizeMode.cover} source={{uri: this.findImageAttachment(story.custom_fields.image_url[0], story.attachments)}}/>
                  <View style={styles.textContainer}>
                      <Text style={styles.title}>
                        {story.title}
                      </Text>
                    <Text style={styles.text}>
                      {story.custom_fields.content[0]}
                    </Text>
                  </View>
                  <View style= {{flex: .1, padding: 10}}>
                    <View style= {{borderTopWidth:1, flexDirection: 'row', justifyContent: 'space-between', padding: 5, paddingLeft:10, paddingRight:10}}>
                      <Text>By: {story.author.name}</Text>
                      <Text  onPress={()=>{this.selectStory(story)}} style={{color: '#07c'}}>more at {story.custom_fields.content_host[0]}</Text>
                      <Icon name="share" style={{paddingRight: 10, marginTop:-10}} size={24}/>
                    </View>
                  </View>
                </View>
                );
            }, this)
          }
        </ScrollPager>

        <Animated.View style={[styles.toggleMenu, {height: this.state.menuHeight}]} >
          <View>
            <View style={{marginTop: 50, padding: 30, flexDirection: 'column'}}>
              <View style={{padding: 5, paddingTop: 15}}>
                <Text style={{color: '#FFF', fontSize:24}}>Categories</Text>
              </View>
              <View  style= {{borderTopWidth:1, borderColor: 'white', flexDirection: 'column'}}>  
                <TouchableHighlight onPress={this.handlePress} underlayColor="#1caf9a">
                  <View style={{padding: 5, paddingTop: 15, paddingLeft: 15, paddingRight: 15, flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={{color: '#FFF', fontSize:18}}><Icon name="face" style={{paddingRight: 10}} size={18}/> .NET</Text>
                    <Text style={{color: '#FFF', fontSize:18, textAlign: 'right'}}>55</Text>
                  </View>
                </TouchableHighlight>
                <TouchableHighlight onPress={this.handlePress} underlayColor="#1caf9a">
                  <View style={{padding: 5, paddingTop: 15, paddingLeft: 15, paddingRight: 15, flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={{color: '#FFF', fontSize:18}}><Icon name="fiber-new" style={{paddingRight: 10}} size={18}/> JAVA</Text>
                    <Text style={{color: '#FFF', fontSize:18, textAlign: 'right'}}>55</Text>
                  </View>
                </TouchableHighlight>
                <TouchableHighlight onPress={this.handlePress} underlayColor="#1caf9a">
                  <View style={{padding: 5, paddingTop: 15, paddingLeft: 15, paddingRight: 15, flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={{color: '#FFF', fontSize:18}}><Icon name="pets" style={{paddingRight: 10}} size={18}/> SQL</Text>
                    <Text style={{color: '#FFF', fontSize:18, textAlign: 'right'}}>55</Text>
                  </View>
                </TouchableHighlight>
                <TouchableHighlight onPress={this.handlePress} underlayColor="#1caf9a">
                  <View style={{padding: 5, paddingTop: 15, paddingLeft: 15, paddingRight: 15, flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={{color: '#FFF', fontSize:18}}><Icon name="language" style={{paddingRight: 10}} size={18}/> Web</Text>
                    <Text style={{color: '#FFF', fontSize:18, textAlign: 'right'}}>55</Text>
                  </View>
                </TouchableHighlight>
                <TouchableHighlight onPress={this.handlePress} underlayColor="#1caf9a">
                  <View style={{padding: 5, paddingTop: 15, paddingLeft: 15, paddingRight: 15, flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={{color: '#FFF', fontSize:18}}><Icon name="smartphone" style={{paddingRight: 10}} size={18}/> Mobile</Text>
                    <Text style={{color: '#FFF', fontSize:18, textAlign: 'right'}}>55</Text>
                  </View>
                </TouchableHighlight>
              </View>
            </View>
          </View>
        </Animated.View>
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
  scrollToFirst : function(){
    if(Platform.OS==='ios'){
      this.refs._scrollPager.scrollTo(0,0);
    }
    else{
      this.refs._scrollPager.setPage(0);
    }
  },
  calculateLineHeight : function(size: number){
    // Hack for react-native-vector-icons to align middle vertically. Use this to set the height & lineHeight property.
    if(Platform.OS==='ios'){
      return size;
    }
    else{
      return size * 2;
    }
  },
  toggleMenu: function()
  {
    console.log(this.state.menuToggle);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
    if(this.state.menuHeight === 1){
      this.setState({menuHeight: WindowSize.height});
    }
    else{
      this.setState({menuHeight: 1});
    }
  }
});


var Dimensions = require('Dimensions');

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
    color: '#333333',
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
  buttonText: {
    fontSize: 30,
    color: '#666666',
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
    padding:0
  }
});

module.exports = MainScreen;