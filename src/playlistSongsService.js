const { Pool } = require('pg');

class PlaylistSongsService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylistNameById(Id) {
    const query = {
      text: 'SELECT name FROM playlists WHERE id = $1',
      values: [Id],
    };

    const result = await this._pool.query(query);

    return result.rows[0].name;
  }

  async getPlaylistSongs(playlistId) {
    const resultPlaylistQuery = {
      text: 'SELECT id, name FROM playlists WHERE id = $1',
      values: [playlistId],
    };

    const resultQuery = {
      text: `SELECT songs.id, songs.title, songs.performer
      FROM songs
      JOIN playlist_songs
      ON songs.id = playlist_songs.song_id
      WHERE playlist_songs.playlist_id = $1`,
      values: [playlistId],
    };

    const resultPlaylist = await this._pool.query(resultPlaylistQuery);
    const result = await this._pool.query(resultQuery);

    return { ...resultPlaylist.rows[0], songs: result.rows };
  }
}

module.exports = PlaylistSongsService;
