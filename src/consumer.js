require('dotenv').config();

const amqp = require('amqplib');
const PlaylistSongsService = require('./playlistSongsService');
const MailSender = require('./MailSender');
const PlaylistListener = require('./listener');

const init = async () => {
  const playlistSongsService = new PlaylistSongsService();
  const mailSender = new MailSender();
  const playlistListener = new PlaylistListener(
    playlistSongsService,
    mailSender
  );

  const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
  const channel = await connection.createChannel();

  await channel.assertQueue('export:playlists', {
    durable: true,
  });

  channel.consume('export:playlists', playlistListener.listen, {
    noAck: true,
  });
};

init();
