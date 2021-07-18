/* eslint-disable camelcase */
const { KUGOU } = require('../util/Constants');

const singerId = KUGOU.SINGER_ID;
// year listener, song count
async function getSingerInfo(request) {
  const url = 'http://mobilecdngz.kugou.com/api/v3/singer/info';
  const query = {
    singerid: singerId,
    singername: '周深',
    version: 10329,
    plat: 2,
    with_listener_index: 1,
  };

  const { data } = await request({
    url,
    method: 'get',
    data: query,
  });
  return data;
}

// fan count
async function getFans(request) {
  const url = 'https://gateway.kugou.com/api/v3/search/keyword_recommend_multi';
  const query = {
    apiver: 14,
    osversion: '6.0.1',
    plat: 0,
    nocorrect: 0,
    version: 0,
    userid: 0,
    keyword: '周深',
  };

  const { data } = await request({
    url,
    method: 'get',
    data: query,
    headers: {
      'x-router': 'msearch.kugou.com',
    },
  });
  return data.info[0].extra;
}

async function getSingerRank(request) {
  const url = 'http://mobilecdnbj.kugou.com/api/v5/singer/list';
  const query = {
    version: 9108,
    showtype: 1,
    plat: 0,
    sextype: 0,
    sort: 1,
    pagesize: 50,
    type: 0,
    page: 1,
    musician: 0,
  };
  const { data } = await request({
    url,
    method: 'get',
    data: query,
  });
  const singers = data.info;
  const index = singers.findIndex((x) => x.singername === '周深');
  const { heatoffset, heat } = singers[index];
  return {
    heatoffset, heat, heatrank: index + 1,
  };
}

module.exports = async (query, request) => {
  const [{
    year_listener,
  }, {
    singer_energy_rank,
    singer_fans_count,
  }, { heatoffset, heat, heatrank }] = await Promise.all([
    getSingerInfo(request),
    getFans(request),
    getSingerRank(request),
  ]);

  return {
    data: {
      year_listener,
      singer_energy_rank,
      singer_fans_count,
      heatoffset,
      heat,
      heatrank,
    },
    updatedAt: Date.now(),
  };
};
