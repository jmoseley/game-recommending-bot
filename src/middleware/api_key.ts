import { NextFunction, Request, RequestHandler, Response } from 'express';

import createLogger from '../lib/logger';

const LOG = createLogger('ApiKeyMiddleware');

export function apiKey(apiKeyValue: string): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    const header = req.get('x-api-key');

    if (header !== apiKeyValue) {
      res.status(401).send(`No api key provided.`);
      return;
    }
    next();
  };
}
