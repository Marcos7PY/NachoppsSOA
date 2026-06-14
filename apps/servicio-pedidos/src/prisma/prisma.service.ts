import { Injectable, INestApplication } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma';
import { createBasePrismaService } from '@org/shared-prisma';

const BasePrisma = createBasePrismaService(PrismaClient);

@Injectable()
export class PrismaService extends BasePrisma {
  override readonly serviceName = 'servicio-pedidos';

  enableShutdownHooks(app: INestApplication) {
    process.on('beforeExit', () => {
      app.close().catch(console.error);
    });
  }
}
