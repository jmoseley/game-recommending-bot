import * as _ from 'lodash';
import * as SteamApi from 'steam-api';

// Ug, types.
const SteamStoreClient = require('steam-store');

import SteamDetails, { IAppInfo } from './steam_details';

const store = new SteamStoreClient();

export default class SteamStore {
  constructor(private readonly steamDetailsClient: SteamDetails) {}

  public async search(term: string): Promise<IAppInfo[]> {
    const results = await store.steam('storeSearch', term);

    // Only return the top 5.
    return _.compact(await this.buildSearchResults(_.take(results, 5)));
  }

  private async buildSearchResults(
    partialResults: any[],
  ): Promise<Array<IAppInfo | null>> {
    return await Promise.all(_.map(
      partialResults,
      result => this.steamDetailsClient.getAppInfo(result.id),
    ));
  }
}
