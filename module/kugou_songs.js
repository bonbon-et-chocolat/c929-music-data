const { KUGOU } = require('../util/Constants');

const singerId = KUGOU.SINGER_ID;

function getSongTitle(filename) {
  return filename.replace(/^.*-\s/, '');
}

async function getSongs(request) {
  const url = 'http://mobilecdnbj.kugou.com/api/v3/singer/song';
  const query = {
    singerid: singerId,
    page: 1,
    pagesize: 100,
    sorttype: 0,
    area_code: 1,
  };

  const { data } = await request({
    url,
    method: 'get',
    data: query,
  });
  return data.info.map(({
    // eslint-disable-next-line camelcase
    filename, album_id, album_audio_id, audio_id, hash,
  }, index) => ({
    index: index + 1,
    title: getSongTitle(filename),
    album_id,
    album_audio_id,
    audio_id,
    hash,
  }));
}

async function getSongRankTop(request, songIds = [{
  album_audio_id: 38641536,
}, {
  album_audio_id: 264086632,
}]) {
  const url = 'https://gateway.kugou.com/container/v1/rank/top';
  const query = {
    appid: 1005,
    clienttime: Date.now(),
    clientver: 10359,
    data: songIds,
    key: '',
    mid: '147210170508080006059062317931575972186',
  };

  const { data } = await request({
    url,
    method: 'post',
    data: query,
    headers: {
      'x-router': 'kmr.service.kugou.com',
    },
  });
  return data;
}

module.exports = async (query, request) => {
  const songs = await getSongs(request);

  // eslint-disable-next-line camelcase
  const [a, b, c, d, e] = songs.map(({ album_audio_id }) => ({ album_audio_id }));
  const rank = await getSongRankTop(request, [a, b, c, d, e]);

  return {
    data: {
      songs,
      rank,
    },
    updatedAt: Date.now(),
  };
};
