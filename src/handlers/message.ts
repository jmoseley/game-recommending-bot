import { Request, Response} from 'express';
import * as _ from 'lodash';
import * as autobind from 'protobind';

import { MessageActions } from '../actions';
import createLogger from '../lib/logger';

const LOG = createLogger('MessageHandler');

export class MessageHandler {
  constructor(private readonly messageActions: MessageActions) {
    autobind(this);
  }

  public async newMessage(req: Request , res: Response): Promise<void> {
    LOG.info(JSON.stringify(req.body));
    const message = _.get(req.body, 'message');
    // const channelId = _.get(req.body, 'channelId');
    const isMentioned = _.get(req.body, 'isMentioned', false);
    // const authorId = _.get(req.body, 'authorId');

    if (!message) {
      res.status(400).send('Message is required.');
      return;
    }

    const result = await this.messageActions.handleMessage(message, isMentioned);

    res.status(200);
    if (result) {
      res.send({ message: result });
    } else {
      res.send();
    }
  }
}
