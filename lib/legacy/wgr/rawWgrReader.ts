type WgrEntry = Readonly<{
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
  const res = await fetch(url);
  const data: Response = await res.json();
  return data.rankingsList.map((r) => ({
    name: r.player.fullName,
    wgr: r.rank,
  }));
}
