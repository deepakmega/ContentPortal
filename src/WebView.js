'use strict';

var React = require('react-native');
var {
  requireNativeComponent,
  PropTypes
} = React;

var ReactNativeViewAttributes = require('ReactNativeViewAttributes');

class ObservableWebView extends React.Component {
  constructor() {
    super();
    this._onChange = this._onChange.bind(this);
  }

  _onChange(event: Event) {
    if (!this.props.onScrollChange) {
      return;
    }
    this.props.onScrollChange(event.nativeEvent.ScrollY);
  }

  render() {
    return <RCTWebView {...this.props} onChange={this._onChange} />;
  }
}

ObservableWebView.propTypes = {
  url: PropTypes.string,
  html: PropTypes.string,
  css: PropTypes.string,
  onScrollChange: PropTypes.func,
};
// 
// ObservableWebView.viewConfig = {
//   uiViewClassName: 'RCTWebView',
//   validAttributes: ReactNativeViewAttributes.RKView
// };

var RCTWebView = requireNativeComponent('RCTWebView', ObservableWebView, {
  nativeOnly: {
    onChange: true,
    'scaleX': true,
    'scaleY': true,
    'translateY': true,
    'translateX': true,
    'rotation': true,
  }
});

module.exports = ObservableWebView;
