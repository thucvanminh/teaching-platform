const path = require('path');
const fs = require('fs');

let cachedApp;

async function bootstrap() {
  if (cachedApp) return cachedApp;

  const { NestFactory } = require('@nestjs/core');
  const { AppModule } = require('./dist/app.module');

  const app = await NestFactory.create(AppModule, { logger: false });
  app.enableCors({ origin: '*', credentials: true });
  app.setGlobalPrefix('api');
  await app.init();
  cachedApp = app;
  return app;
}

module.exports = async (req, res) => {
  const app = await bootstrap();
  const expressApp = app.getHttpAdapter().getInstance();
  return expressApp(req, res);
};
