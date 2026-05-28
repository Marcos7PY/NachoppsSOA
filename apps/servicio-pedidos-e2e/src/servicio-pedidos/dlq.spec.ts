import * as amqp from 'amqplib';

describe('Dead Letter Queue (DLQ)', () => {
  it('debería confirmar que la DLQ existe y está atada al DLX', async () => {
    const connection = await amqp.connect(process.env.RABBITMQ_URI || 'amqp://nachopps:nachopps_secret@localhost:5672');
    const channel = await connection.createChannel();

    const dlqName = 'dlq.servicio_pedidos_queue';

    // Verificamos que al enviar al DLX, llega a la DLQ
    channel.publish('NACHOPPS_DLX', dlqName, Buffer.from(JSON.stringify({ toxic: true })));

    // Esperar a que el mensaje llegue
    await new Promise(resolve => setTimeout(resolve, 1000));

    const msg = await channel.get(dlqName, { noAck: true });
    expect(msg).toBeTruthy();
    if (msg) {
      const content = JSON.parse(msg.content.toString());
      expect(content.toxic).toBe(true);
    }

    await channel.close();
    await connection.close();
  });
});
