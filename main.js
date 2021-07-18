/* eslint-disable global-require */
const fs = require('fs');
const path = require('path');
const request = require('./util/request');
const { cookieToJson } = require('./util/index');

const obj = {};
fs.readdirSync(path.join(__dirname, 'module'))
  .reverse()
  .forEach((file) => {
    if (!file.endsWith('.js')) return;
    // eslint-disable-next-line import/no-dynamic-require
    const fileModule = require(path.join(__dirname, 'module', file));
    obj[file.split('.').shift()] = function addCookie(data = {}) {
      if (typeof data.cookie === 'string') {
        // eslint-disable-next-line no-param-reassign
        data.cookie = cookieToJson(data.cookie);
      }
      return fileModule(
        {
          ...data,
          cookie: data.cookie ? data.cookie : {},
        },
        request,
      );
    };
  });

module.exports = obj;
