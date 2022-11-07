import { NestFactory } from '@nestjs/core';
// import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

// // eslint-disable-next-line @typescript-eslint/no-var-requires
// const cookieSession = require('cookie-session');

import { setupApp } from './setup-app';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.use(
  //   cookieSession({
  //     keys: ['sdfasfd'],
  //   }),
  // );
  // app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  setupApp(app);
  await app.listen(3000);
}
bootstrap();
