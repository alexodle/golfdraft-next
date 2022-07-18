import { Tourney, AppState, DraftPick, CompletedDraftPick, Golfer, GDUser, TourneyStandings, TourneyStandingPlayerScore } from "../../../models";

export interface AppSettings extends Omit<AppState, 'id'> {
  autoPickUsers: Record<number, number>;
}

export interface Draft {
  picks: CompletedDraftPick[];
  pickOrder: DraftPick[];
  serverTimestampEpochMillis: number;
  currentPick: DraftPick | null;
}

export interface BootstrapPayload {
  golfers: Golfer[];
  users: GDUser[];
  draft: Draft;
  tourneyStandings: TourneyStandings & { standings: TourneyStandingPlayerScore[] };
  tourney: Tourney;
  userPickList: number[] | null;
  pickListUsers: number[];
  appState: AppSettings;
  user: GDUser;
  activeTourneyId: number;
  allTourneys: Pick<Tourney, 'id' | 'name' | 'startDateEpochMillis'>[];
}
