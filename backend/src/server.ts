import { app } from './app.js';
import { env } from './env/env.js';

async function start() {
  try {
    await app.listen({
      port: env.PORT,
      host: '0.0.0.0'
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

start();