// To parse this data:
//
//   import { Convert, PGATourLeaderboardJSONReaderNextData } from "./file";
//
//   const pGATourLeaderboardJSONReaderNextData = Convert.toPGATourLeaderboardJSONReaderNextData(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface PGATourLeaderboardJSONReaderNextData {
    props:         Props;
    page:          string;
    query:         Query;
    buildId:       string;
    isFallback:    boolean;
    gssp:          boolean;
    customServer:  boolean;
    locale:        string;
    locales:       string[];
    defaultLocale: string;
    scriptLoader:  any[];
}

export interface Props {
    pageProps: PageProps;
    __N_SSP:   boolean;
}

export interface PageProps {
    pageContext:                PageContext;
    tournament:                 PagePropsTournament;
    leaderboardId:              string;
    isOddsAvailable:            boolean;
    leaderboard:                Leaderboard;
    teeTimes:                   null;
    matchPlayLeaderboard:       null;
    matchPlayTeeTimes:          null;
    odds:                       null;
    field:                      null;
    tourcastTable:              null;
    courseStats:                null;
    pastResults:                null;
    overview:                   null;
    tourCupDetails:             TourCupDetails;
    tourCupDetailsKey:          string;
    teamStrokePlayLeaderboard:  null;
    recap:                      Recap;
    adConfig:                   PagePropsAdConfig;
    cupTournamentLeaderboard:   null;
    cupTournamentKey:           string;
    cupPlayOverviewLeaderboard: null;
    cupTournamentTeeTimes:      null;
    cupTournamentPastResults:   null;
}

export interface PagePropsAdConfig {
    adConfig: AdConfigAdConfig;
    tourCode: string;
}

export interface AdConfigAdConfig {
    config:                 Config;
    homepage:               Aon;
    liveLeaderboard:        Aon;
    leaderboard:            Aon;
    leaderboardProbability: Aon;
    leaderboardShotDetails: Aon;
    leaderboardCutline:     Aon;
    leaderboardRow50:       Aon;
    leaderboardFavorites:   null;
    cupLeaderboardGroup:    Aon;
    cupLeaderboardSingles:  Aon;
    playerProfile:          Aon;
    playerProfileBio:       Aon;
    playerProfileResults:   Aon;
    playerProfileStats:     Aon;
    scorecard:              Aon;
    playoffScorecard:       Aon;
    webPlayerStories:       Aon;
    odds:                   Aon;
    teeTimes:               Aon;
    cupTeeTimesGroup:       Aon;
    cupTeeTimesSingles:     Aon;
    tournament:             Aon;
    tournamentSection:      Aon;
    sidebarTicker:          Aon;
    groupStageLeaderboard:  Aon;
    groupStageStandings:    Aon;
    knockoutLeaderboard:    Aon;
    groupScorecard:         Aon;
    schedule:               Aon;
    aon:                    Aon;
    totalPlayCup:           null;
    totalplaycupSection:    null;
    schwabCup:              null;
    schwabcupSection:       null;
    fedexCup:               Aon;
    fedexcupSection:        Aon;
    fortinetCup:            null;
    fortinetcupSection:     null;
    the25pointsList:        null;
    the25Section:           null;
    comcastTop10:           Aon;
    stats:                  Aon;
    statsSection:           Aon;
    news:                   Aon;
    newsArticles:           Aon;
    rsm:                    Aon;
    rsmSection:             Aon;
    golfBet:                Aon;
    university:             Aon;
    players:                Aon;
    comcastSection:         Aon;
    aonSection:             Aon;
    training:               Aon;
    playerScorecard:        Aon;
    yahooLeaderboard:       Aon;
    tourcast:               Aon;
    payneStewartaward:      Aon;
    dpwtRankings:           Aon;
}

export interface Aon {
    __typename:   AonTypename;
    s1:           S1;
    s2:           string;
    uniqueId:     string;
    refresh:      number | null;
    actRefresh:   boolean | null;
    timedRefresh: boolean | null;
    injectAds:    null;
    rows:         Row[];
    adTest:       AdTest;
    environment:  null;
}

export enum AonTypename {
    AdTagConfig = "AdTagConfig",
}

export enum AdTest {
    EvolutionWeb = "evolution-web",
}

export interface Row {
    index:             number;
    pos:               Pos;
    fluid:             boolean | null;
    container:         null;
    containerSmall:    Container;
    containerMedium:   Container;
    containerLarge:    Container | null;
    sizes:             null;
    playerSponsorship: boolean | null;
}

export interface Container {
    width:  number;
    height: number;
}

export enum Pos {
    LBRow = "lb_row",
    LBRow2 = "lb_row2",
    Midcontent = "midcontent",
    Midcontent2 = "midcontent2",
    ScorecardBanner = "scorecard_banner",
    Tickerspon = "tickerspon",
    Top = "top",
}

export enum S1 {
    Pgatour = "pgatour",
    PgatourYahoo = "pgatour-yahoo",
}

export interface Config {
    adUnitId:          string;
    networkId:         string;
    fluid:             boolean;
    refresh:           number;
    actRefresh:        boolean;
    timedRefresh:      boolean;
    environment:       string;
    playerSponsorship: boolean;
    injectAds:         boolean;
}

export interface Leaderboard {
    __typename:             string;
    id:                     string;
    timezone:               string;
    tournamentId:           string;
    tourcastURL:            string;
    tourcastURLWeb:         string;
    leaderboardRoundHeader: LeaderboardRoundHeader;
    formatType:             string;
    players:                PlayerElement[];
    courses:                LeaderboardCourse[];
    messages:               any[];
    tournamentStatus:       string;
    rounds:                 Round[];
    isPlayoffActive:        boolean;
    scorecardEnabled:       boolean;
    profileEnabled:         boolean;
    subEvent:               boolean;
    leaderboardFeatures:    LeaderboardFeature[];
    standingsEnabled:       boolean;
    standingsHeader:        string;
}

export interface LeaderboardCourse {
    __typename?:  string;
    id:           string;
    courseName:   string;
    courseCode:   string;
    scoringLevel: string;
    hostCourse:   boolean;
}

export interface LeaderboardFeature {
    __typename:          string;
    name:                string;
    leaderboardFeatures: string;
    new:                 boolean;
    tooltipText:         string;
    tooltipTitle:        string;
}

export enum LeaderboardRoundHeader {
    R1 = "R-1",
    R2 = "R2",
    R4 = "R4",
}

export interface PlayerElement {
    __typename:           PlayerTypename;
    id:                   string;
    leaderboardSortOrder: number;
    player?:              PlayerPlayer;
    scoringData?:         ScoringData;
    displayText?:         string;
}

export enum PlayerTypename {
    InformationRow = "InformationRow",
    PlayerRowV3 = "PlayerRowV3",
}

export interface PlayerPlayer {
    id:                             string;
    firstName:                      string;
    lastName:                       string;
    amateur:                        boolean;
    displayName:                    string;
    abbreviations:                  string;
    abbreviationsAccessibilityText: string;
    country:                        string;
    countryFlag:                    string;
    shortName:                      string;
    lineColor:                      LineColor;
    tourBound:                      boolean;
}

export enum LineColor {
    The0084Ff = "#0084FF",
}

export interface ScoringData {
    position:                  string;
    total:                     string;
    totalSort:                 number;
    thru:                      string;
    thruSort:                  number;
    score:                     string;
    scoreSort:                 number;
    teeTime?:                  number;
    courseId:                  string;
    groupNumber:               number;
    currentRound:              number;
    oddsToWin?:                string;
    oddsSwing?:                MovementDirection;
    oddsOptionId?:             string;
    oddsSort?:                 number;
    backNine:                  boolean;
    roundHeader:               LeaderboardRoundHeader;
    rounds:                    string[];
    movementDirection:         MovementDirection;
    movementAmount:            string;
    playerState:               PlayerState;
    rankingMovement:           MovementDirection;
    rankingMovementAmount:     string;
    rankingMovementAmountSort: number;
    rankLogoLight?:            string;
    rankLogoDark?:             string;
    totalStrokes:              string;
    official:                  string;
    officialSort:              number;
    projected:                 string;
    projectedSort:             number;
    hasStoryContent:           boolean;
    storyContentRound:         number;
    storyContentRounds:        number[];
    roundStatus:               RoundStatus;
}

export enum MovementDirection {
    Constant = "CONSTANT",
    Down = "DOWN",
    Up = "UP",
}

export enum PlayerState {
    Active = "ACTIVE",
    BetweenRounds = "BETWEEN_ROUNDS",
    Complete = "COMPLETE",
    Withdrawn = "WITHDRAWN",
}

export enum RoundStatus {
    Empty = "",
    R2Completed = "R2 Completed",
    R4Completed = "R4 Completed",
}

export interface Round {
    roundNumber: number;
    displayText: string;
}

export interface PageContext {
    locale:                   string;
    tourCode:                 string;
    partnerId:                null;
    tournaments:              TournamentElement[];
    clientIp:                 string;
    countryCode:              string;
    isEmbeddedWebView:        boolean;
    queryArgs:                Query;
    activeTournamentOverride: null;
    universalTournaments:     string[];
    bypassObsoleteCheck:      boolean;
}

export interface Query {
}

export interface TournamentElement {
    id:            string;
    leaderboardId: string;
    tourCode:      string;
}

export interface Recap {
    tournamentId: string;
    durationDate: string;
    courses:      RecapCourse[];
    newsArticles: NewsArticle[];
    videos:       Video[];
}

export interface RecapCourse {
    id:      string;
    image:   string;
    name:    string;
    city:    string;
    state:   string;
    country: string;
    par:     string;
    yardage: string;
}

export interface NewsArticle {
    id:                   string;
    headline:             string;
    teaserHeadline:       string;
    teaserContent:        string;
    articleImage:         string;
    url:                  string;
    shareURL:             string;
    publishDate:          number;
    updateDate:           number;
    franchise:            string;
    franchiseDisplayName: string;
    sponsor:              null;
    brightcoveId:         string;
    externalLinkOverride: string;
}

export interface Video {
    category:             Category;
    categoryDisplayName:  CategoryDisplayName;
    created:              number;
    description:          string;
    descriptionNode:      any[];
    duration:             number;
    franchise:            Franchise;
    franchiseDisplayName: FranchiseDisplayName;
    holeNumber:           null | string;
    id:                   string;
    playerVideos:         PlayerVideo[];
    poster:               string;
    pubdate:              number;
    roundNumber:          string;
    shareUrl:             string;
    shotNumber:           null | string;
    startsAt:             number;
    thumbnail:            string;
    title:                string;
    tournamentId:         string;
    tourCode:             TourCode;
    year:                 string;
    accountId:            string;
    seqHoleNumber:        null | string;
    sponsor:              null;
    pinned:               boolean;
}

export enum Category {
    Competition = "competition",
}

export enum CategoryDisplayName {
    Competition = "Competition",
}

export enum Franchise {
    CompetitionHighlights = "competition#highlights",
}

export enum FranchiseDisplayName {
    Highlights = "Highlights",
}

export interface PlayerVideo {
    firstName: string;
    id:        string;
    lastName:  string;
    shortName: string;
}

export enum TourCode {
    Pgatour = "PGATOUR",
}

export interface TourCupDetails {
    id:              string;
    title:           string;
    projectedTitle:  string;
    season:          string;
    description:     string;
    detailCopy:      string;
    logo:            string;
    options:         string;
    projectedLive:   boolean;
    fixedHeaders:    number;
    columnHeaders:   string[];
    players:         any[];
    tournamentPills: TournamentPill[];
    yearPills:       YearPill[];
    rankingsHeader:  string;
    winner:          null;
    message:         string;
    partner:         null;
    partnerLink:     null;
}

export interface TournamentPill {
    tournamentId: string;
    displayName:  string;
}

export interface YearPill {
    year:          number;
    displaySeason: string;
}

export interface PagePropsTournament {
    id:                 string;
    tournamentName:     string;
    tournamentLogo:     string[];
    tournamentLocation: string;
    tournamentStatus:   string;
    roundStatusDisplay: string;
    roundDisplay:       LeaderboardRoundHeader;
    roundStatus:        string;
    roundStatusColor:   string;
    currentRound:       number;
    timezone:           string;
    pdfUrl:             null;
    seasonYear:         string;
    displayDate:        string;
    country:            string;
    state:              string;
    city:               string;
    scoredLevel:        string;
    infoPath:           null;
    events:             any[];
    courses:            LeaderboardCourse[];
    weather:            Weather;
    ticketsURL:         string;
    tournamentSiteURL:  string;
    formatType:         string;
    features:           string[];
    conductedByLabel:   null;
    conductedByLink:    null;
    beautyImage:        string;
}

export interface Weather {
    logo:              null;
    logoDark:          null;
    logoAccessibility: string;
    tempF:             string;
    tempC:             string;
    condition:         string;
    windDirection:     string;
    windSpeedMPH:      string;
    windSpeedKPH:      string;
    precipitation:     string;
    humidity:          string;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toPGATourLeaderboardJSONReaderNextData(json: string): PGATourLeaderboardJSONReaderNextData {
        return cast(JSON.parse(json), r("PGATourLeaderboardJSONReaderNextData"));
    }

    public static pGATourLeaderboardJSONReaderNextDataToJson(value: PGATourLeaderboardJSONReaderNextData): string {
        return JSON.stringify(uncast(value, r("PGATourLeaderboardJSONReaderNextData")), null, 2);
    }
}

function invalidValue(typ: any, val: any, key: any, parent: any = ''): never {
    const prettyTyp = prettyTypeName(typ);
    const parentText = parent ? ` on ${parent}` : '';
    const keyText = key ? ` for key "${key}"` : '';
    throw Error(`Invalid value${keyText}${parentText}. Expected ${prettyTyp} but got ${JSON.stringify(val)}`);
}

function prettyTypeName(typ: any): string {
    if (Array.isArray(typ)) {
        if (typ.length === 2 && typ[0] === undefined) {
            return `an optional ${prettyTypeName(typ[1])}`;
        } else {
            return `one of [${typ.map(a => { return prettyTypeName(a); }).join(", ")}]`;
        }
    } else if (typeof typ === "object" && typ.literal !== undefined) {
        return typ.literal;
    } else {
        return typeof typ;
    }
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = '', parent: any = ''): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val, key, parent);
    }

    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        const l = typs.length;
        for (let i = 0; i < l; i++) {
            const typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) {}
        }
        return invalidValue(typs, val, key, parent);
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases.map(a => { return l(a); }), val, key, parent);
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue(l("array"), val, key, parent);
        return val.map(el => transform(el, typ, getProps));
    }

    function transformDate(val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue(l("Date"), val, key, parent);
        }
        return d;
    }

    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue(l(ref || "object"), val, key, parent);
        }
        const result: any = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, key, ref);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps, key, ref);
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val, key, parent);
    }
    if (typ === false) return invalidValue(typ, val, key, parent);
    let ref: any = undefined;
    while (typeof typ === "object" && typ.ref !== undefined) {
        ref = typ.ref;
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
            : invalidValue(typ, val, key, parent);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
}

function l(typ: any) {
    return { literal: typ };
}

function a(typ: any) {
    return { arrayItems: typ };
}

function u(...typs: any[]) {
    return { unionMembers: typs };
}

function o(props: any[], additional: any) {
    return { props, additional };
}

function m(additional: any) {
    return { props: [], additional };
}

function r(name: string) {
    return { ref: name };
}

const typeMap: any = {
    "PGATourLeaderboardJSONReaderNextData": o([
        { json: "props", js: "props", typ: r("Props") },
        { json: "page", js: "page", typ: "" },
        { json: "query", js: "query", typ: r("Query") },
        { json: "buildId", js: "buildId", typ: "" },
        { json: "isFallback", js: "isFallback", typ: true },
        { json: "gssp", js: "gssp", typ: true },
        { json: "customServer", js: "customServer", typ: true },
        { json: "locale", js: "locale", typ: "" },
        { json: "locales", js: "locales", typ: a("") },
        { json: "defaultLocale", js: "defaultLocale", typ: "" },
        { json: "scriptLoader", js: "scriptLoader", typ: a("any") },
    ], false),
    "Props": o([
        { json: "pageProps", js: "pageProps", typ: r("PageProps") },
        { json: "__N_SSP", js: "__N_SSP", typ: true },
    ], false),
    "PageProps": o([
        { json: "pageContext", js: "pageContext", typ: r("PageContext") },
        { json: "tournament", js: "tournament", typ: r("PagePropsTournament") },
        { json: "leaderboardId", js: "leaderboardId", typ: "" },
        { json: "isOddsAvailable", js: "isOddsAvailable", typ: true },
        { json: "leaderboard", js: "leaderboard", typ: r("Leaderboard") },
        { json: "teeTimes", js: "teeTimes", typ: null },
        { json: "matchPlayLeaderboard", js: "matchPlayLeaderboard", typ: null },
        { json: "matchPlayTeeTimes", js: "matchPlayTeeTimes", typ: null },
        { json: "odds", js: "odds", typ: null },
        { json: "field", js: "field", typ: null },
        { json: "tourcastTable", js: "tourcastTable", typ: null },
        { json: "courseStats", js: "courseStats", typ: null },
        { json: "pastResults", js: "pastResults", typ: null },
        { json: "overview", js: "overview", typ: null },
        { json: "tourCupDetails", js: "tourCupDetails", typ: r("TourCupDetails") },
        { json: "tourCupDetailsKey", js: "tourCupDetailsKey", typ: "" },
        { json: "teamStrokePlayLeaderboard", js: "teamStrokePlayLeaderboard", typ: null },
        { json: "recap", js: "recap", typ: r("Recap") },
        { json: "adConfig", js: "adConfig", typ: r("PagePropsAdConfig") },
        { json: "cupTournamentLeaderboard", js: "cupTournamentLeaderboard", typ: null },
        { json: "cupTournamentKey", js: "cupTournamentKey", typ: "" },
        { json: "cupPlayOverviewLeaderboard", js: "cupPlayOverviewLeaderboard", typ: null },
        { json: "cupTournamentTeeTimes", js: "cupTournamentTeeTimes", typ: null },
        { json: "cupTournamentPastResults", js: "cupTournamentPastResults", typ: null },
    ], false),
    "PagePropsAdConfig": o([
        { json: "adConfig", js: "adConfig", typ: r("AdConfigAdConfig") },
        { json: "tourCode", js: "tourCode", typ: "" },
    ], false),
    "AdConfigAdConfig": o([
        { json: "config", js: "config", typ: r("Config") },
        { json: "homepage", js: "homepage", typ: r("Aon") },
        { json: "liveLeaderboard", js: "liveLeaderboard", typ: r("Aon") },
        { json: "leaderboard", js: "leaderboard", typ: r("Aon") },
        { json: "leaderboardProbability", js: "leaderboardProbability", typ: r("Aon") },
        { json: "leaderboardShotDetails", js: "leaderboardShotDetails", typ: r("Aon") },
        { json: "leaderboardCutline", js: "leaderboardCutline", typ: r("Aon") },
        { json: "leaderboardRow50", js: "leaderboardRow50", typ: r("Aon") },
        { json: "leaderboardFavorites", js: "leaderboardFavorites", typ: null },
        { json: "cupLeaderboardGroup", js: "cupLeaderboardGroup", typ: r("Aon") },
        { json: "cupLeaderboardSingles", js: "cupLeaderboardSingles", typ: r("Aon") },
        { json: "playerProfile", js: "playerProfile", typ: r("Aon") },
        { json: "playerProfileBio", js: "playerProfileBio", typ: r("Aon") },
        { json: "playerProfileResults", js: "playerProfileResults", typ: r("Aon") },
        { json: "playerProfileStats", js: "playerProfileStats", typ: r("Aon") },
        { json: "scorecard", js: "scorecard", typ: r("Aon") },
        { json: "playoffScorecard", js: "playoffScorecard", typ: r("Aon") },
        { json: "webPlayerStories", js: "webPlayerStories", typ: r("Aon") },
        { json: "odds", js: "odds", typ: r("Aon") },
        { json: "teeTimes", js: "teeTimes", typ: r("Aon") },
        { json: "cupTeeTimesGroup", js: "cupTeeTimesGroup", typ: r("Aon") },
        { json: "cupTeeTimesSingles", js: "cupTeeTimesSingles", typ: r("Aon") },
        { json: "tournament", js: "tournament", typ: r("Aon") },
        { json: "tournamentSection", js: "tournamentSection", typ: r("Aon") },
        { json: "sidebarTicker", js: "sidebarTicker", typ: r("Aon") },
        { json: "groupStageLeaderboard", js: "groupStageLeaderboard", typ: r("Aon") },
        { json: "groupStageStandings", js: "groupStageStandings", typ: r("Aon") },
        { json: "knockoutLeaderboard", js: "knockoutLeaderboard", typ: r("Aon") },
        { json: "groupScorecard", js: "groupScorecard", typ: r("Aon") },
        { json: "schedule", js: "schedule", typ: r("Aon") },
        { json: "aon", js: "aon", typ: r("Aon") },
        { json: "totalPlayCup", js: "totalPlayCup", typ: null },
        { json: "totalplaycupSection", js: "totalplaycupSection", typ: null },
        { json: "schwabCup", js: "schwabCup", typ: null },
        { json: "schwabcupSection", js: "schwabcupSection", typ: null },
        { json: "fedexCup", js: "fedexCup", typ: r("Aon") },
        { json: "fedexcupSection", js: "fedexcupSection", typ: r("Aon") },
        { json: "fortinetCup", js: "fortinetCup", typ: null },
        { json: "fortinetcupSection", js: "fortinetcupSection", typ: null },
        { json: "the25pointsList", js: "the25pointsList", typ: null },
        { json: "the25Section", js: "the25Section", typ: null },
        { json: "comcastTop10", js: "comcastTop10", typ: r("Aon") },
        { json: "stats", js: "stats", typ: r("Aon") },
        { json: "statsSection", js: "statsSection", typ: r("Aon") },
        { json: "news", js: "news", typ: r("Aon") },
        { json: "newsArticles", js: "newsArticles", typ: r("Aon") },
        { json: "rsm", js: "rsm", typ: r("Aon") },
        { json: "rsmSection", js: "rsmSection", typ: r("Aon") },
        { json: "golfBet", js: "golfBet", typ: r("Aon") },
        { json: "university", js: "university", typ: r("Aon") },
        { json: "players", js: "players", typ: r("Aon") },
        { json: "comcastSection", js: "comcastSection", typ: r("Aon") },
        { json: "aonSection", js: "aonSection", typ: r("Aon") },
        { json: "training", js: "training", typ: r("Aon") },
        { json: "playerScorecard", js: "playerScorecard", typ: r("Aon") },
        { json: "yahooLeaderboard", js: "yahooLeaderboard", typ: r("Aon") },
        { json: "tourcast", js: "tourcast", typ: r("Aon") },
        { json: "payneStewartaward", js: "payneStewartaward", typ: r("Aon") },
        { json: "dpwtRankings", js: "dpwtRankings", typ: r("Aon") },
    ], false),
    "Aon": o([
        { json: "__typename", js: "__typename", typ: r("AonTypename") },
        { json: "s1", js: "s1", typ: r("S1") },
        { json: "s2", js: "s2", typ: "" },
        { json: "uniqueId", js: "uniqueId", typ: "" },
        { json: "refresh", js: "refresh", typ: u(0, null) },
        { json: "actRefresh", js: "actRefresh", typ: u(true, null) },
        { json: "timedRefresh", js: "timedRefresh", typ: u(true, null) },
        { json: "injectAds", js: "injectAds", typ: null },
        { json: "rows", js: "rows", typ: a(r("Row")) },
        { json: "adTest", js: "adTest", typ: r("AdTest") },
        { json: "environment", js: "environment", typ: null },
    ], false),
    "Row": o([
        { json: "index", js: "index", typ: 0 },
        { json: "pos", js: "pos", typ: r("Pos") },
        { json: "fluid", js: "fluid", typ: u(true, null) },
        { json: "container", js: "container", typ: null },
        { json: "containerSmall", js: "containerSmall", typ: r("Container") },
        { json: "containerMedium", js: "containerMedium", typ: r("Container") },
        { json: "containerLarge", js: "containerLarge", typ: u(r("Container"), null) },
        { json: "sizes", js: "sizes", typ: null },
        { json: "playerSponsorship", js: "playerSponsorship", typ: u(true, null) },
    ], false),
    "Container": o([
        { json: "width", js: "width", typ: 0 },
        { json: "height", js: "height", typ: 0 },
    ], false),
    "Config": o([
        { json: "adUnitId", js: "adUnitId", typ: "" },
        { json: "networkId", js: "networkId", typ: "" },
        { json: "fluid", js: "fluid", typ: true },
        { json: "refresh", js: "refresh", typ: 0 },
        { json: "actRefresh", js: "actRefresh", typ: true },
        { json: "timedRefresh", js: "timedRefresh", typ: true },
        { json: "environment", js: "environment", typ: "" },
        { json: "playerSponsorship", js: "playerSponsorship", typ: true },
        { json: "injectAds", js: "injectAds", typ: true },
    ], false),
    "Leaderboard": o([
        { json: "__typename", js: "__typename", typ: "" },
        { json: "id", js: "id", typ: "" },
        { json: "timezone", js: "timezone", typ: "" },
        { json: "tournamentId", js: "tournamentId", typ: "" },
        { json: "tourcastURL", js: "tourcastURL", typ: "" },
        { json: "tourcastURLWeb", js: "tourcastURLWeb", typ: "" },
        { json: "leaderboardRoundHeader", js: "leaderboardRoundHeader", typ: r("LeaderboardRoundHeader") },
        { json: "formatType", js: "formatType", typ: "" },
        { json: "players", js: "players", typ: a(r("PlayerElement")) },
        { json: "courses", js: "courses", typ: a(r("LeaderboardCourse")) },
        { json: "messages", js: "messages", typ: a("any") },
        { json: "tournamentStatus", js: "tournamentStatus", typ: "" },
        { json: "rounds", js: "rounds", typ: a(r("Round")) },
        { json: "isPlayoffActive", js: "isPlayoffActive", typ: true },
        { json: "scorecardEnabled", js: "scorecardEnabled", typ: true },
        { json: "profileEnabled", js: "profileEnabled", typ: true },
        { json: "subEvent", js: "subEvent", typ: true },
        { json: "leaderboardFeatures", js: "leaderboardFeatures", typ: a(r("LeaderboardFeature")) },
        { json: "standingsEnabled", js: "standingsEnabled", typ: true },
        { json: "standingsHeader", js: "standingsHeader", typ: "" },
    ], false),
    "LeaderboardCourse": o([
        { json: "__typename", js: "__typename", typ: u(undefined, "") },
        { json: "id", js: "id", typ: "" },
        { json: "courseName", js: "courseName", typ: "" },
        { json: "courseCode", js: "courseCode", typ: "" },
        { json: "scoringLevel", js: "scoringLevel", typ: "" },
        { json: "hostCourse", js: "hostCourse", typ: true },
    ], false),
    "LeaderboardFeature": o([
        { json: "__typename", js: "__typename", typ: "" },
        { json: "name", js: "name", typ: "" },
        { json: "leaderboardFeatures", js: "leaderboardFeatures", typ: "" },
        { json: "new", js: "new", typ: true },
        { json: "tooltipText", js: "tooltipText", typ: "" },
        { json: "tooltipTitle", js: "tooltipTitle", typ: "" },
    ], false),
    "PlayerElement": o([
        { json: "__typename", js: "__typename", typ: r("PlayerTypename") },
        { json: "id", js: "id", typ: "" },
        { json: "leaderboardSortOrder", js: "leaderboardSortOrder", typ: 0 },
        { json: "player", js: "player", typ: u(undefined, r("PlayerPlayer")) },
        { json: "scoringData", js: "scoringData", typ: u(undefined, r("ScoringData")) },
        { json: "displayText", js: "displayText", typ: u(undefined, "") },
    ], false),
    "PlayerPlayer": o([
        { json: "id", js: "id", typ: "" },
        { json: "firstName", js: "firstName", typ: "" },
        { json: "lastName", js: "lastName", typ: "" },
        { json: "amateur", js: "amateur", typ: true },
        { json: "displayName", js: "displayName", typ: "" },
        { json: "abbreviations", js: "abbreviations", typ: "" },
        { json: "abbreviationsAccessibilityText", js: "abbreviationsAccessibilityText", typ: "" },
        { json: "country", js: "country", typ: "" },
        { json: "countryFlag", js: "countryFlag", typ: "" },
        { json: "shortName", js: "shortName", typ: "" },
        { json: "lineColor", js: "lineColor", typ: r("LineColor") },
        { json: "tourBound", js: "tourBound", typ: true },
    ], false),
    "ScoringData": o([
        { json: "position", js: "position", typ: "" },
        { json: "total", js: "total", typ: "" },
        { json: "totalSort", js: "totalSort", typ: 0 },
        { json: "thru", js: "thru", typ: "" },
        { json: "thruSort", js: "thruSort", typ: 0 },
        { json: "score", js: "score", typ: "" },
        { json: "scoreSort", js: "scoreSort", typ: 0 },
        { json: "teeTime", js: "teeTime", typ: u(undefined, 0) },
        { json: "courseId", js: "courseId", typ: "" },
        { json: "groupNumber", js: "groupNumber", typ: 0 },
        { json: "currentRound", js: "currentRound", typ: 0 },
        { json: "oddsToWin", js: "oddsToWin", typ: u(undefined, "") },
        { json: "oddsSwing", js: "oddsSwing", typ: u(undefined, r("MovementDirection")) },
        { json: "oddsOptionId", js: "oddsOptionId", typ: u(undefined, "") },
        { json: "oddsSort", js: "oddsSort", typ: u(undefined, 3.14) },
        { json: "backNine", js: "backNine", typ: true },
        { json: "roundHeader", js: "roundHeader", typ: r("LeaderboardRoundHeader") },
        { json: "rounds", js: "rounds", typ: a("") },
        { json: "movementDirection", js: "movementDirection", typ: r("MovementDirection") },
        { json: "movementAmount", js: "movementAmount", typ: "" },
        { json: "playerState", js: "playerState", typ: r("PlayerState") },
        { json: "rankingMovement", js: "rankingMovement", typ: r("MovementDirection") },
        { json: "rankingMovementAmount", js: "rankingMovementAmount", typ: "" },
        { json: "rankingMovementAmountSort", js: "rankingMovementAmountSort", typ: 0 },
        { json: "rankLogoLight", js: "rankLogoLight", typ: u(undefined, "") },
        { json: "rankLogoDark", js: "rankLogoDark", typ: u(undefined, "") },
        { json: "totalStrokes", js: "totalStrokes", typ: "" },
        { json: "official", js: "official", typ: "" },
        { json: "officialSort", js: "officialSort", typ: 0 },
        { json: "projected", js: "projected", typ: "" },
        { json: "projectedSort", js: "projectedSort", typ: 0 },
        { json: "hasStoryContent", js: "hasStoryContent", typ: true },
        { json: "storyContentRound", js: "storyContentRound", typ: 0 },
        { json: "storyContentRounds", js: "storyContentRounds", typ: a(0) },
        { json: "roundStatus", js: "roundStatus", typ: r("RoundStatus") },
    ], false),
    "Round": o([
        { json: "roundNumber", js: "roundNumber", typ: 0 },
        { json: "displayText", js: "displayText", typ: "" },
    ], false),
    "PageContext": o([
        { json: "locale", js: "locale", typ: "" },
        { json: "tourCode", js: "tourCode", typ: "" },
        { json: "partnerId", js: "partnerId", typ: null },
        { json: "tournaments", js: "tournaments", typ: a(r("TournamentElement")) },
        { json: "clientIp", js: "clientIp", typ: "" },
        { json: "countryCode", js: "countryCode", typ: "" },
        { json: "isEmbeddedWebView", js: "isEmbeddedWebView", typ: true },
        { json: "queryArgs", js: "queryArgs", typ: r("Query") },
        { json: "activeTournamentOverride", js: "activeTournamentOverride", typ: null },
        { json: "universalTournaments", js: "universalTournaments", typ: a("") },
        { json: "bypassObsoleteCheck", js: "bypassObsoleteCheck", typ: true },
    ], false),
    "Query": o([
    ], false),
    "TournamentElement": o([
        { json: "id", js: "id", typ: "" },
        { json: "leaderboardId", js: "leaderboardId", typ: "" },
        { json: "tourCode", js: "tourCode", typ: "" },
    ], false),
    "Recap": o([
        { json: "tournamentId", js: "tournamentId", typ: "" },
        { json: "durationDate", js: "durationDate", typ: "" },
        { json: "courses", js: "courses", typ: a(r("RecapCourse")) },
        { json: "newsArticles", js: "newsArticles", typ: a(r("NewsArticle")) },
        { json: "videos", js: "videos", typ: a(r("Video")) },
    ], false),
    "RecapCourse": o([
        { json: "id", js: "id", typ: "" },
        { json: "image", js: "image", typ: "" },
        { json: "name", js: "name", typ: "" },
        { json: "city", js: "city", typ: "" },
        { json: "state", js: "state", typ: "" },
        { json: "country", js: "country", typ: "" },
        { json: "par", js: "par", typ: "" },
        { json: "yardage", js: "yardage", typ: "" },
    ], false),
    "NewsArticle": o([
        { json: "id", js: "id", typ: "" },
        { json: "headline", js: "headline", typ: "" },
        { json: "teaserHeadline", js: "teaserHeadline", typ: "" },
        { json: "teaserContent", js: "teaserContent", typ: "" },
        { json: "articleImage", js: "articleImage", typ: "" },
        { json: "url", js: "url", typ: "" },
        { json: "shareURL", js: "shareURL", typ: "" },
        { json: "publishDate", js: "publishDate", typ: 0 },
        { json: "updateDate", js: "updateDate", typ: 0 },
        { json: "franchise", js: "franchise", typ: "" },
        { json: "franchiseDisplayName", js: "franchiseDisplayName", typ: "" },
        { json: "sponsor", js: "sponsor", typ: null },
        { json: "brightcoveId", js: "brightcoveId", typ: "" },
        { json: "externalLinkOverride", js: "externalLinkOverride", typ: "" },
    ], false),
    "Video": o([
        { json: "category", js: "category", typ: r("Category") },
        { json: "categoryDisplayName", js: "categoryDisplayName", typ: r("CategoryDisplayName") },
        { json: "created", js: "created", typ: 0 },
        { json: "description", js: "description", typ: "" },
        { json: "descriptionNode", js: "descriptionNode", typ: a("any") },
        { json: "duration", js: "duration", typ: 0 },
        { json: "franchise", js: "franchise", typ: r("Franchise") },
        { json: "franchiseDisplayName", js: "franchiseDisplayName", typ: r("FranchiseDisplayName") },
        { json: "holeNumber", js: "holeNumber", typ: u(null, "") },
        { json: "id", js: "id", typ: "" },
        { json: "playerVideos", js: "playerVideos", typ: a(r("PlayerVideo")) },
        { json: "poster", js: "poster", typ: "" },
        { json: "pubdate", js: "pubdate", typ: 0 },
        { json: "roundNumber", js: "roundNumber", typ: "" },
        { json: "shareUrl", js: "shareUrl", typ: "" },
        { json: "shotNumber", js: "shotNumber", typ: u(null, "") },
        { json: "startsAt", js: "startsAt", typ: 0 },
        { json: "thumbnail", js: "thumbnail", typ: "" },
        { json: "title", js: "title", typ: "" },
        { json: "tournamentId", js: "tournamentId", typ: "" },
        { json: "tourCode", js: "tourCode", typ: r("TourCode") },
        { json: "year", js: "year", typ: "" },
        { json: "accountId", js: "accountId", typ: "" },
        { json: "seqHoleNumber", js: "seqHoleNumber", typ: u(null, "") },
        { json: "sponsor", js: "sponsor", typ: null },
        { json: "pinned", js: "pinned", typ: true },
    ], false),
    "PlayerVideo": o([
        { json: "firstName", js: "firstName", typ: "" },
        { json: "id", js: "id", typ: "" },
        { json: "lastName", js: "lastName", typ: "" },
        { json: "shortName", js: "shortName", typ: "" },
    ], false),
    "TourCupDetails": o([
        { json: "id", js: "id", typ: "" },
        { json: "title", js: "title", typ: "" },
        { json: "projectedTitle", js: "projectedTitle", typ: "" },
        { json: "season", js: "season", typ: "" },
        { json: "description", js: "description", typ: "" },
        { json: "detailCopy", js: "detailCopy", typ: "" },
        { json: "logo", js: "logo", typ: "" },
        { json: "options", js: "options", typ: "" },
        { json: "projectedLive", js: "projectedLive", typ: true },
        { json: "fixedHeaders", js: "fixedHeaders", typ: 0 },
        { json: "columnHeaders", js: "columnHeaders", typ: a("") },
        { json: "players", js: "players", typ: a("any") },
        { json: "tournamentPills", js: "tournamentPills", typ: a(r("TournamentPill")) },
        { json: "yearPills", js: "yearPills", typ: a(r("YearPill")) },
        { json: "rankingsHeader", js: "rankingsHeader", typ: "" },
        { json: "winner", js: "winner", typ: null },
        { json: "message", js: "message", typ: "" },
        { json: "partner", js: "partner", typ: null },
        { json: "partnerLink", js: "partnerLink", typ: null },
    ], false),
    "TournamentPill": o([
        { json: "tournamentId", js: "tournamentId", typ: "" },
        { json: "displayName", js: "displayName", typ: "" },
    ], false),
    "YearPill": o([
        { json: "year", js: "year", typ: 0 },
        { json: "displaySeason", js: "displaySeason", typ: "" },
    ], false),
    "PagePropsTournament": o([
        { json: "id", js: "id", typ: "" },
        { json: "tournamentName", js: "tournamentName", typ: "" },
        { json: "tournamentLogo", js: "tournamentLogo", typ: a("") },
        { json: "tournamentLocation", js: "tournamentLocation", typ: "" },
        { json: "tournamentStatus", js: "tournamentStatus", typ: "" },
        { json: "roundStatusDisplay", js: "roundStatusDisplay", typ: "" },
        { json: "roundDisplay", js: "roundDisplay", typ: r("LeaderboardRoundHeader") },
        { json: "roundStatus", js: "roundStatus", typ: "" },
        { json: "roundStatusColor", js: "roundStatusColor", typ: "" },
        { json: "currentRound", js: "currentRound", typ: 0 },
        { json: "timezone", js: "timezone", typ: "" },
        { json: "pdfUrl", js: "pdfUrl", typ: null },
        { json: "seasonYear", js: "seasonYear", typ: "" },
        { json: "displayDate", js: "displayDate", typ: "" },
        { json: "country", js: "country", typ: "" },
        { json: "state", js: "state", typ: "" },
        { json: "city", js: "city", typ: "" },
        { json: "scoredLevel", js: "scoredLevel", typ: "" },
        { json: "infoPath", js: "infoPath", typ: null },
        { json: "events", js: "events", typ: a("any") },
        { json: "courses", js: "courses", typ: a(r("LeaderboardCourse")) },
        { json: "weather", js: "weather", typ: r("Weather") },
        { json: "ticketsURL", js: "ticketsURL", typ: "" },
        { json: "tournamentSiteURL", js: "tournamentSiteURL", typ: "" },
        { json: "formatType", js: "formatType", typ: "" },
        { json: "features", js: "features", typ: a("") },
        { json: "conductedByLabel", js: "conductedByLabel", typ: null },
        { json: "conductedByLink", js: "conductedByLink", typ: null },
        { json: "beautyImage", js: "beautyImage", typ: "" },
    ], false),
    "Weather": o([
        { json: "logo", js: "logo", typ: null },
        { json: "logoDark", js: "logoDark", typ: null },
        { json: "logoAccessibility", js: "logoAccessibility", typ: "" },
        { json: "tempF", js: "tempF", typ: "" },
        { json: "tempC", js: "tempC", typ: "" },
        { json: "condition", js: "condition", typ: "" },
        { json: "windDirection", js: "windDirection", typ: "" },
        { json: "windSpeedMPH", js: "windSpeedMPH", typ: "" },
        { json: "windSpeedKPH", js: "windSpeedKPH", typ: "" },
        { json: "precipitation", js: "precipitation", typ: "" },
        { json: "humidity", js: "humidity", typ: "" },
    ], false),
    "AonTypename": [
        "AdTagConfig",
    ],
    "AdTest": [
        "evolution-web",
    ],
    "Pos": [
        "lb_row",
        "lb_row2",
        "midcontent",
        "midcontent2",
        "scorecard_banner",
        "tickerspon",
        "top",
    ],
    "S1": [
        "pgatour",
        "pgatour-yahoo",
    ],
    "LeaderboardRoundHeader": [
        "R-1",
        "R2",
        "R4",
    ],
    "PlayerTypename": [
        "InformationRow",
        "PlayerRowV3",
    ],
    "LineColor": [
        "#0084FF",
    ],
    "MovementDirection": [
        "CONSTANT",
        "DOWN",
        "UP",
    ],
    "PlayerState": [
        "ACTIVE",
        "BETWEEN_ROUNDS",
        "COMPLETE",
        "WITHDRAWN",
    ],
    "RoundStatus": [
        "",
        "R2 Completed",
        "R4 Completed",
    ],
    "Category": [
        "competition",
    ],
    "CategoryDisplayName": [
        "Competition",
    ],
    "Franchise": [
        "competition#highlights",
    ],
    "FranchiseDisplayName": [
        "Highlights",
    ],
    "TourCode": [
        "PGATOUR",
    ],
};
