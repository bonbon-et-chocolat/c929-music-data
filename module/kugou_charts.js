const ChartConfig = {
  // 酷狗飙升榜
  UP_CHART: 6666,
  // 酷狗TOP500
  TOP_CHART: 8888,
  // 酷狗专辑畅销榜
  BEST_SELL_CHART: 30946,
  // 酷狗雷达榜
  LD_CHART: 37361,
  // 网络红歌榜
  INFLUENCER_CHART: 23784,
  // DJ热歌榜
  DJ_CHART: 24971,
  // 会员专享热歌榜
  MENBER_CHART: 35811,
  // 华语新歌榜
  HY_NEW_CHART: 31308,
  // 欧美新歌榜
  OM_NEW_CHART: 31310,
  // 韩国新歌榜
  KOREA_NEW_CHART: 31311,
  // 日本新歌榜
  JAPAN_NEW_CHART: 31312,
  // 粤语新歌榜
  CANTO_NEW_CHART: 31313,
  // ACG新歌榜
  ACG_NEW_CHART: 33162,
  // 酷狗分享榜
  SHARE_CHART: 21101,
  // 酷狗说唱榜
  RAP_CHART: 44412,
  // 国风新歌榜
  CHINOISERIE_NEW_CHART: 33161,
  // 综艺新歌榜
  SHOW_CHART: 46910,
  // 影视金曲榜
  TV_CHART: 33163,
  // 欧美金曲榜
  OM_HOT_CHART: 33166,
  // 粤语金曲榜
  CANTO_HOT_CHART: 33165,
};
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
  const chartIds = query?.ids || Object.values(ChartConfig);
  let results = await Promise.all(chartIds.map(async (id) => getChartSongs(id, request)));
  results = results.filter((chart) => chart.song.length > 0);
  return {
    timestamp: Date.now(),
    data: results,
  };
};
