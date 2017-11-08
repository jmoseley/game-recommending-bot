import * as _ from 'lodash';
import * as SteamApi from 'steam-api';

export interface IAppInfo {
  id: number;
  categories: string[];
  genres: string[];
  priceCents: number;
  name: string;
  activePlayers: number;
  link?: string;
}

export default class SteamDetails {
  public appApi: SteamApi.App;
  public userStatsApi: SteamApi.UserStats;

  constructor(steamApiKey: string) {
    this.appApi = new SteamApi.App(steamApiKey);
    this.userStatsApi = new SteamApi.UserStats(steamApiKey);
  }

  public async getAppInfo(id: number): Promise<IAppInfo | null> {
    if (!id) {
      return null;
    }

    const result = await this.appApi.appDetails(`${id}`);
    const activePlayers = await this.userStatsApi.GetNumberOfCurrentPlayers(`${id}`);

    return {
      activePlayers,
      categories: _.map(result.categories, 'description'),
      genres: _.map(result.genres, 'description'),
      id,
      link: `http://store.steampowered.com/app/${id}`,
      name: result.name,
      priceCents: result.price.final,
    };
  }

}
