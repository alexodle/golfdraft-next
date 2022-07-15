export interface AppState {
  activeTourneyId: number;
}

export interface Tourney {
  id: number;
  name: string;
  draftHasStarted: boolean;
  isDraftPaused: boolean;
  allowClock: boolean;
  currentDay?: number;
  worstScoresForDay: number[];
  /** TourneyConfig */
  config: string;
}

export interface TourneyConfig {
  par: { type: Number, default: -1 },
  scoresSync: {
    syncType: String,
    url: String,
    nameMap: [{ src: String, dest: String }],
  },
  draftOrder: [String],
  wgr: {
    url: String,
    nameMap: [{ src: String, dest: String }],
  }
}

export interface DraftAutoPick {
  tourneyId: number;
  userId: number;
  autoPick: boolean;
}

export interface User {
  id: number;
  name: string;
  lastActivity?: Date;
}

export interface Golfer {
  id: number;
  tourneyId: number;
  name: string;
  wgr?: number;
}

export interface DraftPickOrder {
  tourneyId: number;
  pickNumber: number;
  userId: number;
}

export interface DraftPick {
  tourneyId: number;
  userId: number;
  golferId: number;
  pickNumber: number;
  timestamp: Date;
}

export interface DraftPickList {
  tourneyId: number;
  userId: number;
  golferIdPickList: string[];
}

export interface GolferScore {
  golferId: string;
  day: number;
  thru?: number;
  scores: string;
}

export interface TourneyStandings {
  tourneyId: number;
  playerId: number;
  totalScore: number;
  standing: number;
  isTied: number;
}

export interface TourneyStandingScores {
  tourneyId: number;
  playerId: number;
  day: number;
  totalScore: number;

  /** TourneyStandingGolferScore[] */
  golferScores: string;
}

export interface TourneyStandingGolferScore {
  golferId: number;
  score: number;
  thru: number;
  missedCut: boolean;
  scoreUsed: boolean;
}
