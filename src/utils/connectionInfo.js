'use strict';

var React = require('react-native');
const connectionInfo = React.createClass({
  getInitialState() {
     return {
       isConnected: null,
     };
   },
   componentDidMount: function() {
     NetInfo.isConnected.addEventListener( 'change', this._handleConnectivityChange );
      NetInfo.isConnected.fetch().done( (isConnected) => { this.setState({isConnected});
    } );
  },
  componentWillUnmount: function() {
    NetInfo.isConnected.removeEventListener( 'change', this._handleConnectivityChange );
  },
  _handleConnectivityChange: function(isConnected) {
    this.setState({ isConnected, });
  },
  isConnected: function(){
    return this.state.isConnected;
  },
  render: function() {}
});

module.exports = connectionInfo;
