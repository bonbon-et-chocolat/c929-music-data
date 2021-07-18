const { search } = require('NeteaseCloudMusicApi');

module.exports = async () => {
  try {
    const songs = await search({
      keywords: '周深',
      type: 1000,
    });
    return songs.body.result.playlists;
  } catch (error) {
    return [];
  }
};
