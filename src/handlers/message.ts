import { Request, Response} from 'express';
import * as _ from 'lodash';
import * as autobind from 'protobind';

import { MessageActions } from '../actions';
import createLogger from '../lib/logger';

const LOG = createLogger('MessageHandler');

const BOT_CHATTER_CHANNEL_ID = '383364848068853760';

export class MessageHandler {
  constructor(private readonly messageActions: MessageActions) {
    autobind(this);
  }

  public async newMessage(req: Request , res: Response): Promise<void> {
    LOG.info(JSON.stringify(req.body));

    const message = req.body.message;
    const eventName = req.body.eventName;
    const isMentioned = _.get(req.body, 'isMentioned', false);
    // const authorId = _.get(req.body, 'authorId');

    const body: any = {};
    if (message) {
      // const channelId = _.get(req.body, 'channelId');
      body.message = await this.messageActions.handleMessage(message, isMentioned);
    } else if (eventName === 'presenceUpdate') {
      const gameName = req.body.gameName;
      const oldGameName = req.body.oldGameName;
      const username = req.body.username;
      // Only do this in the one channel.
      body.channelId = BOT_CHATTER_CHANNEL_ID;
      body.message = await this.messageActions.handlePresenceUpdate(username, gameName, oldGameName);
    }

    res.status(200);
    res.send(body);
  }
}
