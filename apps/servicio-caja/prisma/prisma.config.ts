import { defineConfig } from '@prisma/config';

export default defineConfig({
  earlyAccess: true,
  studio: {
    adapter: undefined,
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
