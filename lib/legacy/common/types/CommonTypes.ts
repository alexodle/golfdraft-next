// ==== Util types ====

export interface Indexed<T> {
  [id: number]: T;
}

export interface AppSettings {
  activeTourneyId: number;
  isDraftPaused: boolean;
  allowClock: boolean;
  draftHasStarted: boolean;
}

export interface User {
  id: number;
  name: string;
  username: string;
}

export interface DraftPick {
  pickNumber: number;
  timestampEpochMillis: number;
}

export interface DraftPickOrder {
  pickNumber: number;
}

export interface Golfer {
  id: number;
  name: string;
  wgr: number;
}

export interface PlayerDayScore {
  day: number;
  totalScore: number;
  golferScores: PlayerGolferDayScore[];
}

export interface PlayerGolferDayScore {
  golferId: number;
  score: number;
  thru: number | null;
  missedCut: boolean;
  scoreUsed: boolean;
}

export interface PlayerScore {
  playerId: number;
  totalScore: number;
  standing: number;
  isTied: boolean;
  dayScores: PlayerDayScore[];
}

export interface TourneyStandings {
  currentDay: number;
  worstScoresForDay: { day: number, golferId: number; score: number; }[],
  playerScores: PlayerScore[];
}

export interface ChatMessage {
  isBot?: boolean;
  message: string;
  epochMillis: number;
}

export interface Tourney {
  id: number;
  name: string;
  startDateEpochMillis: number;
  lastUpdatedEpochMillis: number;
}