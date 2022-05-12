import * as CommonTypes from '../../common/types/CommonTypes';
import { Indexed } from '../../common/types/CommonTypes';
export type { Indexed };

export type Tourney = CommonTypes.Tourney;

export interface AppSettings extends CommonTypes.AppSettings {
  autoPickUsers: Indexed<number>;
}

export type User = CommonTypes.User;
export type IndexedUsers = Indexed<User>;

export interface DraftPick extends CommonTypes.DraftPick {
  userId: number;
  golferId: number;
  clientTimestampEpochMillis: number;
}

export interface DraftPickOrder extends CommonTypes.DraftPickOrder {
  userId: number;
}

export type Golfer = CommonTypes.Golfer;
export type IndexedGolfers = Indexed<Golfer>;

export type TourneyStandings = CommonTypes.TourneyStandings;

export interface ChatMessage extends CommonTypes.ChatMessage {
  userId?: number;
}

export interface Draft {
  picks: DraftPick[];
  pickOrder: DraftPickOrder[];
  serverTimestampEpochMillis: number;
  currentPick?: DraftPickOrder;
}

export interface BootstrapPayload {
  golfers: Golfer[];
  users: User[];
  draft: Draft;
  tourneyStandings: TourneyStandings;
  tourney: Tourney;
  userPickList: number[] | undefined;
  pickListUsers: number[];
  appState: AppSettings;
  user: User;
  activeTourneyId: number;
  allTourneys: Tourney[];
}
