import app from './server.js';
import  env  from './config/env.js';
import events from "events";

(globalThis as any).require = (id: string) => {
  if (id === "events") return events;
  throw new Error(`Dynamic require of '${id}' not supported`);
};

const start = async () => {
  try {
    await app.listen({ host: '0.0.0.0', port: env.PORT });
    app.log.info(`Server listening on ${env.PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
//"postinstall": "prisma generate && prisma migrate deploy && prisma db seed"