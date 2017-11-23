import * as _ from 'lodash';
import * as autobind from 'protobind';

import createLogger from '../lib/logger';
import SteamDetails, { IAppInfo } from '../lib/steam_details';
import SteamStore from '../lib/steam_store';

const LOG = createLogger('MessageActions');

const SUGESSTED_GAMES = [
  'Call of Duty',
  `PLAYERUNKNOWN'S BATTLEGROUNDS`,
  `Assassin's Creed Origins`,
  'Cuphead',
  'Divinity: Original Sin 2',
  'Rocket League',
  '.hack//G.U. Last Recode',
  'Total War: WARHAMMER II',
  'Wolfenstein II: The New Colossus',
  'Steam Link',
  'South Park: The Fractured But Whole',
  'Middle-earth: Shadow of War',
  'Counter-Strike: Global Offensive',
  'Spintires: MudRunner',
  'Black Desert Online',
  'Grand Theft Auto V',
  'Stick Fight: The Game',
  'Stardew Valley',
  'Sid Meier’s Civilization VI',
  'Rust',
  'Blood Bowl 2 - Legendary Edition',
  'ARK: Survival Evolved',
  'RimWorld',
];

const DISCORD_MENTION_REGEX = /<@\d+>/;

const TELL_ME_ABOUT_REGEX = /.*Tell me about (.+)\.?/i;

const HELP_REGEXES = [
  /.*what can you do\??.*/i,
  /.*help.*/i,
];

export class MessageActions {
  constructor(
    private readonly steamDetailsClient: SteamDetails,
    private readonly steamStore: SteamStore,
  ) {
    autobind(this);
  }

  public async handlePresenceUpdate(
    username: string,
    newGame: string,
    oldGame: string,
  ): Promise<string | null> {
    if (!newGame || newGame === oldGame) {
      return null;
    }

    const results = await this.steamStore.search(newGame);
    if (!results.length) {
      LOG.info(`No results found for '${newGame}'.`);
      return null;
    }

    // Let's try trusting the first result.
    return this.appendFormattedAppInfo(`@${username} just started playing ${newGame}!`, results[0]);
  }

  public async handleMessage(
    message: string,
    isMentioned: boolean,
  ): Promise<string | null> {
    // Check if this is a mention.
    if (!isMentioned) {
      LOG.info(`Not handling message that is not a mention: '${message}'`);
      return null;
    }

    // Strip out the mentions.
    message = message.replace(DISCORD_MENTION_REGEX, '').trim();
    LOG.info(`Handling message: '${message}'`);

    let response: string | null;
    try {
      response = await this.getResponse(message);
    } catch (error) {
      LOG.error(error);
      response = 'Whoops, there was an error.';
    }
    if (!response) {
      response = `I didn't understand that. Try 'help'`;
    }
    LOG.info(`Responding to message '${message}' with:\n${response}`);

    return response;

  }

  // TODO: Get some NLP up in here.
  // Get data from more than just steam.
  private async getResponse(message: string): Promise<string | null> {
    if (_.some(HELP_REGEXES, pattern => pattern.test(message))) {
      return `I can tell you about games. Try '@GameRecommendingBot Tell me about ${_.sample(SUGESSTED_GAMES)}'.`;
    }

    if (TELL_ME_ABOUT_REGEX.test(message)) {
      const match = TELL_ME_ABOUT_REGEX.exec(message);
      if (!match) {
        return null;
      }

      const gameTitle = match[1];

      const results = await this.steamStore.search(gameTitle);
      if (!results.length) {
        return `No results found for ${gameTitle}.`;
      }

      const response = `Here's what I found for '${gameTitle}' from Steam:`;
      return _.reduce(results, this.appendFormattedAppInfo, response);
    }
    return null;
  }

  private appendFormattedAppInfo(base: string, appInfo: IAppInfo): string {
    return `${base}\n\n${appInfo.name}:\n` +
      `Price: $${appInfo.priceCents / 100}\n` +
      `Categories: ${_.join(appInfo.categories, ', ')}\n` +
      `Active Players on Steam: ${appInfo.activePlayers}\n` +
      `${appInfo.link}`;
  }
}
