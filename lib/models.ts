export type AppState = Readonly<{
  id: 1
  activeTourneyId: number;
}>

export type Tourney = Readonly<{
  id: number;
  name: string;
  draftHasStarted: boolean;
  isDraftPaused: boolean;
  allowClock: boolean;
  startDateEpochMillis: number;
  lastUpdatedEpochMillis: number;
  commissioners?: { userId: number }[];
  /** TourneyConfig */
  config: string;
}>

export type TourneyConfig = Readonly<{
  name: string;
  startDate: string;
  par: number;
  scores: {
    type: string;
    url: string;
    nameMap: Record<string, string>;
  },
  draftOrder: string[];
  wgr: {
    url: string;
    nameMap: Record<string, string>;
  }
}>

export type DraftAutoPick = Readonly<{
  tourneyId: number;
  userId: number;
}>

export type GDUser = Readonly<{
  profileId: string;
  id: number;
  name: string;
  username: string;
}>

export type Golfer = Readonly<{
  id: number;
  tourneyId: number;
  name: string;
  wgr?: number;
}>

type BaseDraftPick = Readonly<{
  tourneyId: number;
  userId: number;
  pickNumber: number;
}>

export type PendingDraftPick = BaseDraftPick & Readonly<{
  golferId?: null;
  timestampEpochMillis?: null;
  clientTimestampEpochMillis?: null;
  pickedByUserId?: null;
}>

export type CompletedDraftPick = BaseDraftPick & Readonly<{
  golferId: number;
  timestampEpochMillis: number;
  clientTimestampEpochMillis: number;
  pickedByUserId: number;
}>

export type DraftPick = PendingDraftPick | CompletedDraftPick;

export type DraftPickList = Readonly<{
  tourneyId: number;
  userId: number;
  golferIds: number[];
}>

type BaseGolferScore = Readonly<{
  golferId: number;
  tourneyId: number;
  day: number;
  thru?: number;
}>

export type GolferScore = BaseGolferScore & Readonly<{
  scores: (number | 'MC' | null)[];
}>

export type DbGolferScore = BaseGolferScore & Readonly<{
  scores: string;
}>

export type GolferScoreOverride = { golferId: number } & Omit<Partial<GolferScore>, 'golferId'>;

export type DbGolferScoreOverride = { golferId: number } & Omit<Partial<DbGolferScore>, 'golferId'>;

type BaseTourneyStandings = Readonly<{
  tourneyId: number;
  currentDay?: number;
}>

export type TourneyStandings = BaseTourneyStandings & Readonly<{
  worstScoresForDay: WorstDayScore[];
}>

export type DbTourneyStandings = BaseTourneyStandings & Readonly<{
  /** WorstDayScore[]; */
  worstScoresForDay?: string;
}>

type BaseTourneyStandingPlayerScore = Readonly<{
  tourneyId: number;
  userId: number;
  totalScore: number;
  standing: number;
  isTied: boolean;
  currentDay?: number;
}>

export type TourneyStandingPlayerScore = BaseTourneyStandingPlayerScore & Readonly<{
  dayScores: TourneyStandingPlayerDayScore[];
}>

export type DbTourneyStandingPlayerScore = BaseTourneyStandingPlayerScore & Readonly<{
  /** DbTourneyStandingPlayerDayScore[] */
  dayScores: string;
}>

export type TourneyStandingPlayerDayScore = Readonly<{
  day: number;
  totalScore: number;
  golferScores: TourneyStandingGolferScore[];
}>

export type TourneyStandingGolferScore = Readonly<{
  golferId: number;
  score: number;
  thru: number | null;
  missedCut: boolean;
  scoreUsed: boolean;
}>

export type WorstDayScore = Readonly<{
  day: number; 
  golferId: number; 
  score: number;
}>

export type ChatMessage = Readonly<{
  tourneyId: string;
  userId: string;
  epochMillis: number;
  message: string;
}>;
