import { TourneyConfig } from "../../models";

export type Thru = number | null;
export type Score = number | 'MC' | null;

export interface UpdateGolfer {
  scores: Score[];
  golfer: string;
  day: number;
  thru: Thru;
}

export interface ReaderResult {
  par: number;
  golfers: UpdateGolfer[];
}

export interface Reader {
  run: (config: TourneyConfig, url: string) => Promise<ReaderResult>;
}
