const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');

module.exports = {
  output: {
    path: join(__dirname, 'dist'),
    clean: true,
    ...(process.env.NODE_ENV !== 'production' && {
      devtoolModuleFilenameTemplate: '[absolute-resource-path]',
    }),
  },
  ignoreWarnings: [
    /Critical dependency: the request of a dependency is an expression/,
    /Failed to parse source map/,
  ],
  plugins: [
    new NxAppWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      main: './src/main.ts',
      tsConfig: './tsconfig.app.json',
      assets: ['./src/assets'],
      optimization: false,
      outputHashing: 'none',
      generatePackageJson: false,
      sourceMap: true,
      externalDependencies: [
        // Dependencias opcionales de @nestjs/microservices no instaladas
        'kafkajs',
        'mqtt',
        'nats',
        'ioredis',
        '@grpc/grpc-js',
        '@grpc/proto-loader',
        // Otras opcionales de NestJS
        'class-validator',
        'class-transformer',
        '@nestjs/websockets',
        '@nestjs/websockets/socket-module',
        'file-type',
      ],
    }),
  ],
};
