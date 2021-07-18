// eslint-disable-next-line camelcase
const { artist_top_song } = require('NeteaseCloudMusicApi');
const { WYY } = require('../util/Constants');

module.exports = async () => {
  try {
    const songs = await artist_top_song({
      id: WYY.SINGER_ID,
    });
    return songs.body.songs.map(({ name, id, mv }, index) => ({
      rank: index + 1,
      title: name,
      id,
      mv,
    }));
  } catch (error) {
    return [];
  }
};
