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

  const raw = result?.req_0?.data?.songList ?? [];
  const formatted = raw.map(({ songInfo }) => ({
    songmid: songInfo.mid,
    songid: songInfo.id,
    songname: songInfo.title,
    pay: songInfo.pay.pay_play,
    pubtime: songInfo.time_public,
    fnote: songInfo.fnote,
  }));
  return {
    data: formatted,
    updatedAt: Date.now(),
  };
};
