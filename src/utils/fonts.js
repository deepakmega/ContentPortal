// src/styles/fonts.js
import {
  StyleSheet
}
from 'react-native';
var fonts = StyleSheet.create({
  normal: {
    fontSize: 12,
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: '300'
  },
  heading: {
    fontSize: 18,
    fontFamily: 'Roboto',
    color: '#141414',
    fontStyle: 'normal',
    fontWeight: '700'
  },
  big: {
    fontSize: 24,
    alignSelf: 'center',
    fontFamily: 'Roboto'
  }
});
var scalingFactors = {
  normal: 28,
  heading: 18
};
module.exports = {
  fonts, scalingFactors
};
