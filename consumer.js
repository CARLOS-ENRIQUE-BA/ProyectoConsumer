import { connect as _connect } from 'amqplib';
import fetch from 'node-fetch';

const rabbitSettings = {
  protocol: "amqp",
  hostname: "44.216.12.148",
  port: 5672,
  username: "llaverito",
  password: "sainz097",
};

async function connect() {
  const queue = 'InitialEvent';
  try {
    const conn = await _connect(rabbitSettings);
    console.log('Conexión exitosa');
    const channel = await conn.createChannel();
    console.log('Canal creado exitosamente');

    channel.consume(queue, async (msn) => {
      const messageContent = msn.content.toString();
      console.log(messageContent);
      try {
        const response = await fetch('http://44.216.12.148:3003/products/', {
          method: 'POST',
          body: messageContent,
          headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
          console.log('Mensaje enviado a la API');
        } else {
          console.error('Error al enviar mensaje');
        }
      } catch (error) {
        console.error('Error al llamar la API', error);
      }
      channel.ack(msn);
    });

  } catch (error) {
    console.error('Error:', error);
  }
}

connect();