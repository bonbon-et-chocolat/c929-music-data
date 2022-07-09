module.exports = async (query, request) => {
  const {
    pageNo = 1,
    pageSize = 100,
    singerMid = '003fA5G40k6hKc',
  } = query;
  const url = 'http://u.y.qq.com/cgi-bin/musicu.fcg';

  const data = {
    req_0: {
      module: 'music.musichallSong.SongListInter',
      method: 'GetSingerSongList',
      param: {
        singerMid, begin: (pageNo - 1) * pageSize, num: pageSize, order: 1,
      },
    },
    comm: {
      ct: 6, cv: 80205,
    },
  };

  const result = await request({
    url,
    method: 'post',
    data,
    headers: {
      Referer: 'https://y.qq.com',
    },
  });
  return {
    data: result.req_0,
    updatedAt: Date.now(),
  };
};
