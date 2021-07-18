const { KUGOU } = require('../util/Constants');

function getSongTitle(filename) {
  return filename.replace(/^.*-\s/, '');
}
async function getChartSongs(chartID = 8888, request) {
  // chart meta
  const [meta, songs] = await Promise.all([
    request({
      url: 'http://mobilecdnbj.kugou.com/api/v3/rank/info',
      method: 'get',
      data: {
        version: 9108,
        rankid: chartID,
      },
    }),
    request({
      url: 'http://mobilecdnbj.kugou.com/api/v3/rank/song',
      method: 'get',
      data: {
        version: 9108,
        rankid: chartID,
        page: 1,
        pagesize: 500,
      },
    }),
  ]);
  let songList = [];
  let ts = null;
  if (songs.data && songs.data.info && typeof songs.data.info.map === 'function') {
    ts = songs.data.timestamp;
    songList = songs.data.info
      .map((song, index) => ({
        title: song.filename,
        rank: index + 1,
      }))
      .filter((song) => song.title.includes('周深'))
      .map((song) => {
        // eslint-disable-next-line no-param-reassign
        song.title = getSongTitle(song.title);
        return song;
      });
  }
  return {
    timestamp: ts,
    listID: chartID,
    title: meta.data.rankname,
    intro: meta.data.intro,
    ranktype: meta.data.ranktype,
    imgurl: meta.data.banner7url,
    song: songList,
  };
}

module.exports = async (query, request) => {
  const chartIds = query?.ids || Object.values(KUGOU.CHARTS);
  let results = await Promise.all(chartIds.map(async (id) => getChartSongs(id, request)));
  results = results.filter((chart) => chart.song.length > 0);
  return {
    timestamp: Date.now(),
    data: results,
  };
};
