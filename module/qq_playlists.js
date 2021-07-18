module.exports = async (query, request) => {
  const IDs = query.ids || [7503734031, 7520517030, 7039448240, 7337210245];
  const resultsRaw = await request({
    url: 'http://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg',
    data: {
      type: 1,
      utf8: 1,
      disstid: IDs,
      loginUin: 0,
    },
    headers: {
      Referer: 'https://y.qq.com/n/yqq/playlist',
    },
  });
  const results = resultsRaw.cdlist.map(({ visitnum, dissname, disstid }) => ({
    playCount: visitnum,
    name: dissname,
    id: disstid,
  }));
  return {
    data: results,
    updatedAt: Date.now(),
  };
};
