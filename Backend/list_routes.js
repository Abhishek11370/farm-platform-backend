const express = require('express');
const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('./dist/app.module');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const server = app.getHttpServer();
  const router = server._events.request._router;

  const availableRoutes = [];
  
  if (router && router.stack) {
    router.stack.forEach(layer => {
      if (layer.route) {
        availableRoutes.push({
          route: layer.route?.path,
          method: Object.keys(layer.route.methods)[0].toUpperCase(),
        });
      }
    });
  }
  
  console.log(`Total Routes: ${availableRoutes.length}`);
  // availableRoutes.forEach(route => console.log(`${route.method} ${route.route}`));
  await app.close();
}
bootstrap().catch(console.error);
