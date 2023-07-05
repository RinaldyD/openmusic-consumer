class PlaylistListener {
  constructor(playlistSongsService, mailSender) {
    this._playlistSongsService = playlistSongsService;
    this._mailSender = mailSender;

    this.listen = this.listen.bind(this);
  }

  async listen(message) {
    try {
      const { playlistId, targetEmail } = JSON.parse(
        message.content.toString()
      );

      const playlistName = await this._playlistSongsService.getPlaylistNameById(
        playlistId
      );
      const playlist = await this._playlistSongsService.getPlaylistSongs(
        playlistId
      );

      const result = await this._mailSender.sendEmail(
        targetEmail,
        playlistName,
        JSON.stringify(playlist)
      );
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = PlaylistListener;
