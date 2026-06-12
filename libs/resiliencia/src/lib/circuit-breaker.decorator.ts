import { Logger } from '@nestjs/common';
import CircuitBreaker from 'opossum';

export const CIRCUIT_BREAKER_REGISTRY = new Map<string, CircuitBreaker>();

export function CircuitBreakerOptions(options?: CircuitBreaker.Options) {
  return function (
    target: object,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    const breakerName = `${target.constructor.name}.${propertyKey}`;
    const logger = new Logger('CircuitBreaker');

    const defaultOptions: CircuitBreaker.Options = {
      timeout: 3000, 
      errorThresholdPercentage: 50, 
      resetTimeout: 30_000, 
      ...options,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    descriptor.value = async function (...args: any[]) {
      let breaker = CIRCUIT_BREAKER_REGISTRY.get(breakerName);
      
      if (!breaker) {
        // Envolvemos el método original, asegurando que `this` se mantenga
        const fn = originalMethod.bind(this);
        breaker = new CircuitBreaker(fn, defaultOptions);

        breaker.on('open', () => logger.warn(`Circuito ABIERTO en ${breakerName}. Rechazando peticiones.`));
        breaker.on('halfOpen', () => logger.log(`Circuito MEDIO ABIERTO en ${breakerName}. Probando conexión...`));
        breaker.on('close', () => logger.log(`Circuito CERRADO en ${breakerName}. Tráfico normal.`));
        breaker.on('fallback', () => logger.warn(`Fallback ejecutado en ${breakerName}`));

        CIRCUIT_BREAKER_REGISTRY.set(breakerName, breaker);
      }

      return breaker.fire(...args);
    };

    return descriptor;
  };
}
