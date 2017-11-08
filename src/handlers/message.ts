import { Request, Response} from 'express';
import * as _ from 'lodash';
import * as autobind from 'protobind';

import { MessageActions } from '../actions';

export class MessageHandler {
  constructor(private readonly messageActions: MessageActions) {
    autobind(this);
  }

  public async newMessage(req: Request , res: Response): Promise<void> {
    const message = _.get(req.query, 'message');
    // const channelId = _.get(req.query, 'channelId');
    const isMentioned = _.get(req.query, 'isMentioned') === 'true' ? true : false;
    // const authorId = _.get(req.query, 'authorId');

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
