import * as bodyParser from 'body-parser';
import * as express from 'express';

import { StatusHandler } from './handlers';
import * as config from './lib/config';
import createLogger from './lib/logger';

// I suck at types.
const Router: any = require('express-promise-router');

const PORT = process.env.PORT || 4000;
const LOG = createLogger('start');

if (config.isLocalDev()) {
  LOG.info(`----- Running in DEV mode -----`);
}

async function start(): Promise<void> {
  LOG.info('Starting game-recommending-bot');

  const statusHandler = new StatusHandler();

  const app: express.Application = express();
  // TODO: API Key middleware.
  app.use(bodyParser.urlencoded({
    extended: true,
    limit: '20mb',
  }));
  app.use(bodyParser.json({ limit: '20mb' }));

  // TODO: Pretty error middleware.

  const router = Router();
  // TODO: Make the handlers own the routes.
  router.get('/status', statusHandler.status);

  app.use(router);

  app.listen(PORT, () => {
    LOG.info(`Server started on port ${PORT}.`);
  });
}

start().catch((error: any) => {
  LOG.error(error);
});
