import { fetch } from '../js/fetch';

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

export async function rawWgrReader(url: string): Promise<WgrEntry[]> {
  const wgrs: WgrEntry[] = [];

  const response = (await fetch(url)) as Response;
  return response.rankingsList.map((r) => ({
    name: r.player.fullName,
    wgr: r.rank,
  }));
}
