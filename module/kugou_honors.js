const md5 = require('md5');

const singerId = '169967';

async function getHonorWall(request) {
  const url = 'https://h5activity.kugou.com/v1/query_singer_honour_wall';
  const ts = Date.now();
  const HASH = 'NVPh5oo715z5DIWAeQlhMDsWXXQV4hwt';
  const original = `${HASH}clienttime=${ts}clientver=20000dfid=-mid=${ts}singer_id=169967srcappid=2919uuid=${ts}${HASH}`;
  const query = {
    singerId,
    srcappid: '2919',
    clientver: '20000',
    clienttime: ts,
    mid: ts,
    uuid: ts,
    dfid: '-',
    signature: md5(original).toUpperCase(),
  };

  return request({
    url,
    method: 'get',
    data: query,
  });
}
async function getHonors(request, result, hashMap, page) {
  const url = 'https://h5activity.kugou.com/v1/query_singer_honour_detail';
  const ts = Date.now();
  const HASH = 'NVPh5oo715z5DIWAeQlhMDsWXXQV4hwt';
  const original = `${HASH}clienttime=${ts}clientver=20000dfid=-mid=${ts}page=${page}singer_id=169967srcappid=2919uuid=${ts}${HASH}`;
  const query = {
    singerId,
    srcappid: '2919',
    clientver: '20000',
    page,
    clienttime: ts,
    mid: ts,
    uuid: ts,
    dfid: '-',
    signature: md5(original).toUpperCase(),
  };

  const records = await request({
    url,
    method: 'get',
    data: query,
  });

  const hasMore = records.data.info_list.length === 20;
  let cur = [];
  if (typeof records.data.info_list.map === 'function') {
    cur = records.data.info_list.map(({
      // eslint-disable-next-line camelcase
      src_type, highest_ranking, hash, audio_name, accumulated_days, album_id, album_audio_id,
    }) => ({
      src_type, highest_ranking, hash, audio_name, accumulated_days, album_id, album_audio_id,
    })).filter(({ hash }) => {
      const isNewEntry = hashMap[hash] !== true;
      // eslint-disable-next-line no-param-reassign
      hashMap[hash] = true;
      return isNewEntry;
    });
  }
  // eslint-disable-next-line no-param-reassign
  result = result.concat(cur);
  if (hasMore) {
    return getHonors(request, result, hashMap, page + 1);
  }
  return result;
}

module.exports = async (query, request) => {
  // meta
  const meta = await getHonorWall(request);
  const overview = meta.data.top500[0];
  // details
  const result = await getHonors(request, [], {}, 1);
  const updatedAt = Date.now();
  return {
    data: {
      overview,
      details: result,
      updatedAt,
    },
    tag: 'honors',
  };
};
