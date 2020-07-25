"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.existPreference = exports.updatePreference = exports.getPreferences = void 0;
const preferences = {
  flag: '$',
  title: 'Bot Admin Discord',
  color: '#7c66c6'
};

const getPreferences = () => {
  return preferences;
};

exports.getPreferences = getPreferences;

const existPreference = parameter => {
  return !!preferences[parameter];
};

exports.existPreference = existPreference;

const updatePreference = (parameter, value) => {
  preferences[parameter] = value;
};

exports.updatePreference = updatePreference;