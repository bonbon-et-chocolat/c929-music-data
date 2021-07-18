module.exports = {
  toBoolean(val) {
    if (typeof val === 'boolean') return val;
    if (val === '') return val;
    return val === 'true' || val === '1';
  },
  cookieToJson(cookie) {
    if (!cookie) return {};
    const cookieArr = cookie.split(';');
    const obj = {};
    cookieArr.forEach((i) => {
      const [key, val] = i.split('=');
      obj[key] = val;
    });
    return obj;
  },
};
