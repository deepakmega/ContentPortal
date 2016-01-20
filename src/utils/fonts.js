// src/styles/fonts.js
import {
  StyleSheet
}
from 'react-native';
var fonts = StyleSheet.create({
  normal: {
    fontSize: 12,

    fontStyle: 'normal',
    fontWeight: '300'
  },
  heading: {
    fontSize: 18,

    color: '#141414',
    fontStyle: 'normal',
    fontWeight: '700'
  },
  big: {
    fontSize: 24,
    alignSelf: 'center',

  }
});
var scalingFactors = {
  normal: 28,
  heading: 18
};
module.exports = {
  fonts, scalingFactors
};
