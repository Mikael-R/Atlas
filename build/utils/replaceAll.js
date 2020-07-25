"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

const replaceAll = (str, searchValues, replaceValue) => {
  for (const i in searchValues) {
    const searchRegex = new RegExp(searchValues[i]);
    str = str.split('').map(char => char.replace(searchRegex, replaceValue)).join('');
  }

  return str;
};

var _default = replaceAll;
exports.default = _default;