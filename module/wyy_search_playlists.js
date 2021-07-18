const { search } = require('NeteaseCloudMusicApi');

module.exports = async () => {
  try {
    const songs = await search({
      keywords: '周深',
      type: 1000,
    });
    return {
      data: songs.body.result.playlists,
      updatedAt: Date.now(),
    };
  } catch (error) {
    return [];
  }
};
