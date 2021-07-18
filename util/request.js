const axios = require('axios');
const xml2js = require('xml2js').parseString;
const StringHelper = require('./StringHelper');

function handleXml(data) {
  return new Promise((resolve) => {
    const handleObj = (obj) => {
      Object.keys(obj).forEach((k) => {
        const v = obj[k];
        if ((typeof v).toLowerCase() === 'object' && v instanceof Array && v.length === 1) {
          const [val] = v;
          // eslint-disable-next-line no-param-reassign
          obj[k] = val;
        }
        if ((typeof obj[k]).toLowerCase() === 'object') {
          handleObj(obj[k]);
        }
      });
    };

    xml2js(data, (err, result) => {
      handleObj(result);
      resolve(result);
    });
  });
}

const request = async (inputObj, opts = {}) => {
  try {
    let obj = inputObj;
    if (typeof obj === 'string') {
      obj = {
        url: obj,
        data: {},
      };
    }
    obj.method = obj.method || 'get';

    const { url, data } = obj;

    if (obj.method === 'get') {
      obj.url = StringHelper.changeUrlQuery(data, url);
      delete obj.data;
    }

    obj.headers = obj.headers || {};
    obj.xsrfCookieName = 'XSRF-TOKEN';
    obj.withCredentials = true;

    const res = await axios(obj);

    if (opts.dataType === 'xml') {
      return handleXml(res.data.replace(/(<!--)|(-->)/g, ''));
    }

    if (opts.dataType === 'raw') {
      return res.data;
    }

    if (typeof res.data === 'string') {
      res.data = res.data.replace(/callback\(|MusicJsonCallback\(|jsonCallback\(|\)$/g, '');
      return JSON.parse(res.data);
    }

    return res.data;
  } catch (err) {
    return {
      result: 400,
      errMsg: `系统异常：${err.message}`,
    };
  }
};

module.exports = request;
