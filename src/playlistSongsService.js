const { Pool } = require('pg');

class PlaylistSongsService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylistNameById(Id) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [Id],
    };

    const result = await this._pool.query(query);

    return result.rows[0];
  }

  async getPlaylistSongs(playlistId) {
    const resultPlaylistQuery = {
      text: 'SELECT id, name FROM playlists WHERE id = $1',
      values: [playlistId],
    };

    const resultPlaylist = await this._pool.query(resultPlaylistQuery);

    const resultSongsQuery = {
      text: `SELECT songs.id, songs.title, songs.performer
      FROM playlist_songs
      LEFT JOIN songs
      ON songs.id = playlist_songs.song_id
      WHERE playlist_songs.playlist_id = $1`,
      values: [playlistId],
    };

    const resultSongs = await this._pool.query(resultSongsQuery);

    return { ...resultPlaylist.rows[0], songs: resultSongs.rows };
  }
}

module.exports = PlaylistSongsService;
