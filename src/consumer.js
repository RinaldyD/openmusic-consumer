require('dotenv').config();

const amqp = require('amqplib');
const PlaylistSongsService = require('./playlistSongsService');
const MailSender = require('./MailSender');
const PlaylistListener = require('./listener');

const init = async () => {
  console.log('consumer is running');
  const playlistSongsService = new PlaylistSongsService();
  const mailSender = new MailSender();
  const playlistListener = new PlaylistListener(
    playlistSongsService,
    mailSender
  );

  const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
  const channel = await connection.createChannel();

  await channel.assertQueue('export:test', {
    durable: true,
  });

  channel.consume('export:test', playlistListener.listen, {
    noAck: true,
  });
};

init();
