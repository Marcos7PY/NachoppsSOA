/** Metadatos opcionales en eventos de dominio. */
export interface EventMetadata {
  correlationId?: string;
  occurredAt: string;
  producer?: string;
}

/**
 * Formato estándar de mensaje NestJS RMQ + publicador interno.
 * @see ADR-004, ADR-007
 */
export interface DomainEventEnvelope<TPayload> {
  pattern: string;
  data: TPayload;
  metadata?: EventMetadata;
}

export function createEventEnvelope<TPayload>(
  pattern: string,
  data: TPayload,
  producer?: string,
): DomainEventEnvelope<TPayload> {
  return {
    pattern,
    data,
    metadata: {
      occurredAt: new Date().toISOString(),
      producer,
    },
  };
}
