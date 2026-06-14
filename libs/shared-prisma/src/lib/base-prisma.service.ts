import { OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createBasePrismaService<T extends new (...args: any[]) => any>(PrismaClientClass: T) {
  abstract class BasePrismaService extends PrismaClientClass implements OnModuleInit, OnModuleDestroy {
    abstract readonly serviceName: string;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(...args: any[]) {
      const connectionString = process.env.DATABASE_URL;
      if (!connectionString) {
        throw new Error('DATABASE_URL is not defined in the environment');
      }

      const pool = new Pool({ connectionString });
      const adapter = new PrismaPg(pool);
      super({ adapter, ...args[0] });
    }

    async onModuleInit() {
      await (this as unknown as { $connect(): Promise<void> }).$connect();
      const connectionString = process.env.DATABASE_URL ?? '';
      const dbName = connectionString.split('/').pop()?.split('?')[0] ?? 'desconocida';
      Logger.log(`Conectado a ${dbName} vía PrismaPg`, this.serviceName);
    }

    async onModuleDestroy() {
      await (this as unknown as { $disconnect(): Promise<void> }).$disconnect();
    }
  }

  return BasePrismaService;
}
