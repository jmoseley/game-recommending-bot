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

    const message = req.body.message;
    const eventName = req.body.eventName;
    // const channelId = _.get(req.body, 'channelId');
    const isMentioned = _.get(req.body, 'isMentioned', false);
    // const authorId = _.get(req.body, 'authorId');

    let result: any;
    if (message) {
      result = await this.messageActions.handleMessage(message, isMentioned);
    } else if (eventName === 'presenceUpdate') {
      const gameName = req.body.gameName;
      const oldGameName = req.body.oldGameName;
      const username = req.body.username;
      result = await this.messageActions.handlePresenceUpdate(username, gameName, oldGameName);
    }

    res.status(200);
    if (result) {
      res.send({ message: result });
    } else {
      res.send();
    }
  }
}
