import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL is not defined in the environment');
    }

    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    super({ adapter });
  }

  
  async $checkAndRecordIdempotencyKey(key: string): Promise<boolean> {
    return false; // Dummy implementation for now to pass build
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Conectado a la BD de Caja vía PrismaPg');
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
