import { fetchData } from '../scores_sync/util';

export type WgrEntry = Readonly<{
  name: string;
  wgr: number;
}>;

type Response = Readonly<{
  rankingsList: {
    player: {
      fullName: string;
    };
    rank: number;
  }[];
}>;

async function getJson(url: string): Promise<Response> {
  const data = await fetchData(url);
  const json = JSON.parse(data);
  return json;
}

export async function rawWgrReader(url: string): Promise<WgrEntry[]> {
  const wgrs: WgrEntry[] = [];

  const response = await getJson(url);

  return response.rankingsList.map((r) => ({
    name: r.player.fullName,
    wgr: r.rank,
  }));
}
