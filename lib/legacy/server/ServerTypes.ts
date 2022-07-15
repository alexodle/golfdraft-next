
export interface BootstrapPayload {
  golfers: string;
  users: string;
  draft: string;
  tourneyStandings: string;
  tourney: string;
  appState: string;
  userPickList: string,
  pickListUsers: string;
  user: string;
  activeTourneyId: string;
  allTourneys: string;
  /** @deprecated */
  prod: boolean;
  /** @deprecated */
  cdnUrl: string;
} 

export interface DraftExport {
  draftPicks: {
    user: string,
    golfer: string,
    pickNumber: number 
  }[];
  chatMessages: {
    user: string,
    isBot: boolean,
    message: string,
    date: string
  }[];
}

export interface ChatExport {
}
