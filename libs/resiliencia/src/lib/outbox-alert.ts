import { Logger } from '@nestjs/common';

const logger = new Logger('OutboxAlert');

/**
 * Enruta una alerta de outbox FAILED a un webhook Slack (plan 3.3) si está
 * configurado `SLACK_WEBHOOK_URL`. Fire-and-forget: nunca lanza para no
 * interferir con el procesamiento del outbox.
 */
export async function notifyOutboxFailed(
  producer: string,
  eventId: string,
  routingKey: string,
  attempts: number,
): Promise<void> {
  const url = process.env.SLACK_WEBHOOK_URL;
  if (!url) return;
  const servicio = producer.replace('servicio-', '');
  const text =
    `:rotating_light: *[OUTBOX_FAILED]* ${producer}: evento \`${eventId}\` ` +
    `(${routingKey}) marcado FAILED tras ${attempts} intentos.\n` +
    `Reprocesar: \`POST /${servicio}/outbox/${eventId}/retry\``;
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
  } catch (e) {
    logger.warn(`No se pudo enviar alerta Slack de outbox: ${(e as Error).message}`);
  }
}
