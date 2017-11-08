import * as bodyParser from 'body-parser';
import * as express from 'express';

import * as actions from './actions';
import * as handlers from './handlers';
import * as config from './lib/config';
import createLogger from './lib/logger';
import SteamDetails from './lib/steam_details';
import SteamStore from './lib/steam_store';

// I suck at types.
const Router: any = require('express-promise-router');

const PORT = process.env.PORT || 4000;
const LOG = createLogger('start');

if (config.isLocalDev()) {
  LOG.info(`----- Running in DEV mode -----`);
}

async function start(): Promise<void> {
  LOG.info('Starting game-recommending-bot');
  if (!process.env.STEAM_API_KEY) {
    throw new Error('STEAM_API_KEY is required, exiting.');
  }
  const steamDetailsClient = new SteamDetails(process.env.STEAM_API_KEY as string);
  const steamStore = new SteamStore(steamDetailsClient);

  const messageActions = new actions.MessageActions(steamDetailsClient, steamStore);

  const statusHandler = new handlers.StatusHandler();
  const messageHandler = new handlers.MessageHandler(messageActions);

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
  router.get('/message/new', messageHandler.newMessage);

  app.use(router);

  app.listen(PORT, () => {
    LOG.info(`Server started on port ${PORT}.`);
  });
}

start().catch((error: any) => {
  LOG.error(error);
});
