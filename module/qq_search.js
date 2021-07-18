module.exports = async (query, request) => {
  const {
    pageNo = 1,
    pageSize = 20,
    key,
    t, // 0：单曲，2：歌单，7：歌词，8：专辑，9：歌手，12：mv
  } = query;
  const url = 'http://c.y.qq.com/soso/fcgi-bin/client_search_cp';

  const data = {
    format: 'json', // 返回json格式
    n: pageSize, // 一页显示多少条信息
    p: pageNo, // 第几页
    w: key, // 搜索关键词
    cr: 1, // 不知道这个参数什么意思，但是加上这个参数你会对搜索结果更满意的
    g_tk: 5381,
    t,
  };

  const result = await request({
    url,
    method: 'get',
    data,
    headers: {
      Referer: 'https://y.qq.com',
    },
  });
  return {
    data: result,
    updatedAt: Date.now(),
  };
};
