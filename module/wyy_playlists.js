/* eslint-disable camelcase */
const { playlist_detail } = require('NeteaseCloudMusicApi');

const HotPlaylists = [
  2129920743,
  3205269853,
  2507444104,
  50577102,
];

function formatPlaylist(results) {
  return results.map(({ id, name, playCount }) => ({
    title: name,
    playCount,
    listID: id,
  }));
}

module.exports = async (query) => {
  try {
    const promises = HotPlaylists.map((l) => playlist_detail({
      id: l,
    }));
    const results_raw = await Promise.all(promises);
    const playlists = results_raw.map((x) => x.body.playlist);
    if (query?.raw === false) {
      return playlists;
    }
    return formatPlaylist(playlists);
  } catch (error) {
    return {};
  }
};
