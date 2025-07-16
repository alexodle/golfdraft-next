// To parse this data:
//
//   import { Convert, PGATourLeaderboardJSONReaderNextData2 } from "./file";
//
//   const pGATourLeaderboardJSONReaderNextData2 = Convert.toPGATourLeaderboardJSONReaderNextData2(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface PGATourLeaderboardJSONReaderNextData2 {
    props:                 Props;
    page:                  string;
    query:                 QueryArgsClass;
    buildId:               string;
    assetPrefix:           string;
    isFallback:            boolean;
    isExperimentalCompile: boolean;
    dynamicIds:            number[];
    gssp:                  boolean;
    locale:                string;
    locales:               string[];
    defaultLocale:         string;
    scriptLoader:          any[];
}

export interface Props {
    pageProps: PageProps;
    __N_SSP:   boolean;
}

export interface PageProps {
    pageContext:     PageContext;
    tournament:      DatumElement;
    leaderboardId:   string;
    isOddsAvailable: boolean;
    dehydratedState: DehydratedState;
}

export interface DehydratedState {
    mutations: any[];
    queries:   QueryElement[];
}

export interface QueryElement {
    state:     State;
    queryKey:  Array<QueryKeyClass | string>;
    queryHash: string;
}

export interface QueryKeyClass {
    R2025100?:        string;
    R2025472?:        string;
    S2025008?:        string;
    H2025022?:        string;
    Y2025010?:        string;
    id?:              null | string;
    leaderboardId?:   string;
    shouldSubscribe?: boolean;
    tournamentId?:    null | string;
    odds?:            boolean;
    tourCode?:        string;
    year?:            null;
    eventQuery?:      null;
    sponsor?:         string;
    tour?:            string;
}

export interface State {
    data:               DatumElement[] | DataClass;
    dataUpdateCount:    number;
    dataUpdatedAt:      number;
    error:              null;
    errorUpdateCount:   number;
    errorUpdatedAt:     number;
    fetchFailureCount:  number;
    fetchFailureReason: null;
    fetchMeta:          null;
    isInvalidated:      boolean;
    status:             Status;
    fetchStatus:        FetchStatus;
}

export interface DatumElement {
    id:                     string;
    tournamentName:         string;
    tournamentLogo:         string[];
    tournamentLocation:     string;
    tournamentStatus:       string;
    roundStatusDisplay:     string;
    roundDisplay:           string;
    roundStatus:            string;
    roundStatusColor:       string;
    currentRound:           number;
    timezone:               string;
    pdfUrl:                 null;
    seasonYear:             string;
    displayDate:            string;
    country:                string;
    state:                  string;
    city:                   string;
    scoredLevel:            ScorLevel;
    infoPath:               null;
    events:                 any[];
    courses:                Course[];
    weather:                Weather;
    ticketsURL:             null | string;
    tournamentSiteURL:      null | string;
    formatType:             string;
    features:               string[];
    conductedByLabel:       null | string;
    conductedByLink:        null | string;
    beautyImage:            string;
    hideRolexClock:         boolean;
    hideSov:                boolean;
    headshotBaseUrl:        null;
    rightRailConfig:        null;
    shouldSubscribe:        boolean;
    ticketsEnabled:         boolean;
    useTournamentSiteURL:   boolean;
    beautyImageAsset:       Asset;
    disabledScorecardTabs:  any[];
    leaderboardTakeover:    boolean;
    tournamentCategoryInfo: null;
    tournamentLogoAsset:    Asset[];
}

export interface Asset {
    imageOrg:  ImageOrg;
    imagePath: string;
}

export enum ImageOrg {
    PgatourProd = "pgatour-prod",
}

export interface Course {
    id:           string;
    courseName:   string;
    courseCode:   string;
    hostCourse:   boolean;
    scoringLevel: ScorLevel;
    __typename?:  string;
}

export enum ScorLevel {
    Basic = "BASIC",
    Stats = "STATS",
}

export interface Weather {
    logo:              string;
    logoDark:          string;
    logoAccessibility: LogoAccessibility;
    tempF:             string;
    tempC:             string;
    condition:         string;
    windDirection:     WeatherWindDirection;
    windSpeedMPH:      string;
    windSpeedKPH:      string;
    precipitation:     string;
    humidity:          string;
    logoAsset:         Asset;
    logoDarkAsset:     Asset;
}

export enum LogoAccessibility {
    Deckorators = "deckorators",
}

export enum WeatherWindDirection {
    NorthWest = "NORTH_WEST",
    South = "SOUTH",
    SouthEast = "SOUTH_EAST",
}

export interface DataClass {
    id?:                          string;
    tournamentName?:              string;
    tournamentLogo?:              string[];
    tournamentLocation?:          string;
    tournamentStatus?:            string;
    roundStatusDisplay?:          string;
    roundDisplay?:                string;
    roundStatus?:                 string;
    roundStatusColor?:            string;
    currentRound?:                number;
    timezone?:                    string;
    pdfUrl?:                      null;
    seasonYear?:                  string;
    displayDate?:                 string;
    country?:                     string;
    state?:                       string;
    city?:                        string;
    scoredLevel?:                 ScorLevel;
    infoPath?:                    null;
    events?:                      any[];
    courses?:                     Course[];
    weather?:                     Weather;
    ticketsURL?:                  null | string;
    tournamentSiteURL?:           null | string;
    formatType?:                  string;
    features?:                    string[];
    conductedByLabel?:            null | string;
    conductedByLink?:             null | string;
    beautyImage?:                 string;
    hideRolexClock?:              boolean;
    hideSov?:                     boolean;
    headshotBaseUrl?:             null;
    rightRailConfig?:             null;
    shouldSubscribe?:             boolean;
    ticketsEnabled?:              boolean;
    useTournamentSiteURL?:        boolean;
    beautyImageAsset?:            Asset;
    disabledScorecardTabs?:       any[];
    leaderboardTakeover?:         boolean;
    tournamentCategoryInfo?:      null;
    tournamentLogoAsset?:         Asset[];
    __typename?:                  string;
    tournamentId?:                string;
    leaderboardRoundHeader?:      RoundHeader;
    players?:                     Array<PurplePlayer | string> | Aon;
    messages?:                    any[];
    rounds?:                      Round[];
    isPlayoffActive?:             boolean;
    scorecardEnabled?:            boolean;
    profileEnabled?:              boolean;
    subEvent?:                    boolean;
    leaderboardFeatures?:         LeaderboardFeature[];
    standingsEnabled?:            boolean;
    standingsHeader?:             string;
    disableOdds?:                 boolean;
    disableBettingProfileColumn?: boolean;
    disableLeaderboard?:          boolean;
    odds?:                        boolean | Aon;
    informationSections?:         InformationSection[];
    oddsToWinId?:                 string;
    oddsEnabled?:                 boolean;
    tourCode?:                    string;
    standingsConfiguration?:      StandingsConfiguration[];
    title?:                       string;
    projectedTitle?:              string;
    season?:                      string;
    description?:                 string;
    detailCopy?:                  string;
    logo?:                        string;
    options?:                     string;
    projectedLive?:               boolean;
    fixedHeaders?:                number;
    columnHeaders?:               string[];
    tournamentPills?:             TournamentPill[];
    yearPills?:                   YearPill[];
    rankingsHeader?:              string;
    winner?:                      null;
    message?:                     string;
    partner?:                     null;
    partnerLink?:                 null;
    sponsor?:                     string;
    logoUrl?:                     string;
    logoDarkUrl?:                 string;
    type?:                        string;
    countryCode?:                 string;
    coverageType?:                CoverageType[];
    sponsorLink?:                 string;
    sponsorLogo?:                 string;
    sponsorLogoDark?:             string;
    sponsorLogoAsset?:            Asset;
    sponsorLogoDarkAsset?:        Asset;
    modalSponsorLogoAsset?:       Asset;
    modalSponsorLogoDarkAsset?:   Asset;
    modalSponsorLogo?:            string;
    modalSponsorLogoDark?:        string;
    accessibilityText?:           LogoAccessibility;
    hourly?:                      Hourly[];
    daily?:                       Daily[];
    config?:                      Config;
    homepage?:                    Aon;
    liveLeaderboard?:             Aon;
    leaderboard?:                 Aon;
    leaderboardOdds?:             Aon;
    leaderboardProbability?:      Aon;
    leaderboardShotDetails?:      Aon;
    leaderboardCutline?:          Aon;
    leaderboardRow50?:            Aon;
    leaderboardFavorites?:        null;
    cupLeaderboardGroup?:         Aon;
    cupLeaderboardSingles?:       Aon;
    playerProfile?:               Aon;
    playerProfileBio?:            Aon;
    playerProfileResults?:        Aon;
    playerProfileStats?:          Aon;
    scorecard?:                   Aon;
    playoffScorecard?:            Aon;
    webPlayerStories?:            Aon;
    webTopicStories?:             Aon;
    teeTimes?:                    Aon;
    cupTeeTimesGroup?:            Aon;
    cupTeeTimesSingles?:          Aon;
    tournament?:                  Aon;
    tournamentSection?:           Aon;
    sidebarTicker?:               Aon;
    groupStageLeaderboard?:       Aon;
    groupStageStandings?:         Aon;
    knockoutLeaderboard?:         Aon;
    groupScorecard?:              Aon;
    schedule?:                    Aon;
    aon?:                         Aon;
    totalPlayCup?:                null;
    totalplaycupSection?:         null;
    schwabCup?:                   null;
    schwabcupSection?:            null;
    fedexCup?:                    Aon;
    fedexcupSection?:             Aon;
    fortinetCup?:                 null;
    fortinetcupSection?:          null;
    the25pointsList?:             null;
    the25Section?:                null;
    comcastTop10?:                Aon;
    stats?:                       Aon;
    statsSection?:                Aon;
    studios?:                     null;
    news?:                        Aon;
    newsArticles?:                Aon;
    rsm?:                         Aon;
    rsmSection?:                  Aon;
    golfBet?:                     Aon;
    university?:                  Aon;
    comcastSection?:              Aon;
    aonSection?:                  Aon;
    training?:                    Aon;
    playerScorecard?:             Aon;
    yahooLeaderboard?:            Aon;
    tourcast?:                    Aon;
    payneStewartaward?:           Aon;
    dpwtRankings?:                Aon;
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
    containerSmall:    Desktop;
    containerMedium:   Desktop;
    containerLarge:    Desktop | null;
    sizes:             null;
    playerSponsorship: boolean | null;
}

export interface Desktop {
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

export interface CoverageType {
    __typename:   string;
    id:           string;
    streamTitle:  string;
    roundNumber:  number;
    channelTitle: string;
    roundDisplay: string;
    startTime:    number;
    endTime:      number;
    promoImage:   null;
    promoImages:  string[];
    liveStatus:   string;
    network:      Network;
}

export interface Network {
    id:                  string;
    networkName:         string;
    backgroundColor:     string;
    backgroundColorDark: string;
    networkLogo:         string;
    networkLogoDark:     string;
    priorityNum:         number;
    url:                 string;
    iOSLink:             string;
    appleAppStore:       string;
    androidLink:         string;
    googlePlayStore:     string;
    simulcast:           boolean;
    simulcastUrl:        null;
    streamUrl:           string;
    iosStreamUrl:        string;
    androidStreamUrl:    string;
}

export interface Daily {
    title:         string;
    condition:     string;
    windDirection: string;
    windSpeedKPH:  string;
    windSpeedMPH:  string;
    humidity:      string;
    precipitation: string;
    temperature:   DailyTemperature;
}

export interface DailyTemperature {
    __typename: string;
    minTempC:   string;
    minTempF:   string;
    maxTempC:   string;
    maxTempF:   string;
}

export interface Hourly {
    title:         string;
    condition:     Condition;
    windDirection: HourlyWindDirection;
    windSpeedKPH:  string;
    windSpeedMPH:  string;
    humidity:      string;
    precipitation: string;
    temperature:   HourlyTemperature;
}

export enum Condition {
    DayMostlyCloudy = "DAY_MOSTLY_CLOUDY",
    DayPartlyCloudy = "DAY_PARTLY_CLOUDY",
}

export interface HourlyTemperature {
    __typename: TemperatureTypename;
    tempC:      TempC;
    tempF:      string;
}

export enum TemperatureTypename {
    StandardWeatherTemp = "StandardWeatherTemp",
}

export enum TempC {
    The13C = "13°C",
}

export enum HourlyWindDirection {
    North = "NORTH",
    NorthEast = "NORTH_EAST",
    NorthWest = "NORTH_WEST",
}

export interface InformationSection {
    title:         Title;
    sponsorImages: SponsorImage[] | null;
    items:         Item[];
}

export interface Item {
    __typename:   Title;
    title:        string;
    icon?:        string;
    text?:        null;
    subText?:     null | string;
    iconUrl?:     null;
    key?:         string;
    description?: string;
}

export enum Title {
    Abbreviations = "Abbreviations",
    Legend = "Legend",
}

export interface SponsorImage {
    logo:              string;
    logoDark:          string;
    accessibilityText: string;
    link:              null | string;
}

export interface LeaderboardFeature {
    __typename:          string;
    name:                string;
    leaderboardFeatures: string;
    new:                 boolean;
    tooltipText:         string;
    tooltipTitle:        string;
}

export enum RoundHeader {
    R1 = "R1",
}

export interface PurplePlayer {
    __typename?:           PlayerTypename;
    id?:                   string;
    leaderboardSortOrder?: number;
    player?:               FluffyPlayer;
    scoringData?:          ScoringData;
    playerId?:             string;
    odds?:                 string;
    oddsSort?:             number;
    oddsDirection?:        OddsDirection;
    optionId?:             string;
}

export enum PlayerTypename {
    PlayerRowV3 = "PlayerRowV3",
}

export enum OddsDirection {
    Constant = "CONSTANT",
    Down = "DOWN",
    Up = "UP",
}

export interface FluffyPlayer {
    id:                             string;
    firstName:                      string;
    lastName:                       string;
    amateur:                        boolean;
    displayName:                    string;
    abbreviations:                  Abbreviations;
    abbreviationsAccessibilityText: AbbreviationsAccessibilityText;
    country:                        string;
    countryFlag:                    string;
    shortName:                      string;
    lineColor:                      LineColor;
    tourBound:                      boolean;
    bettingProfile?:                string;
}

export enum Abbreviations {
    A = "(a)",
    Empty = "",
}

export enum AbbreviationsAccessibilityText {
    Empty = "",
    PlayerIsAnAmateur = "Player is an amateur",
}

export enum LineColor {
    The0084Ff = "#0084FF",
}

export interface ScoringData {
    position:                  Position;
    total:                     Total;
    totalSort:                 number;
    thru:                      string;
    thruSort:                  number;
    score:                     string;
    scoreSort:                 number;
    teeTime:                   number;
    courseId:                  string;
    groupNumber:               number;
    currentRound:              number;
    backNine:                  boolean;
    roundHeader:               RoundHeader;
    rounds:                    Position[];
    movementDirection:         OddsDirection;
    movementAmount:            string;
    movementSort:              number;
    playerState:               PlayerState;
    rankingMovement:           OddsDirection;
    rankingMovementAmount:     string;
    rankingMovementAmountSort: number;
    totalStrokes:              Position;
    totalStrokesSort:          number;
    roundDisplaySort:          null[];
    official:                  string;
    officialSort:              number;
    projected:                 string;
    projectedSort:             number;
    hasStoryContent:           boolean;
    storyContentRounds:        any[];
    roundStatus:               string;
    rankLogoLight?:            string;
    rankLogoDark?:             string;
}

export enum PlayerState {
    NotStarted = "NOT_STARTED",
}

export enum Position {
    Empty = "-",
}

export enum Total {
    E = "E",
}

export interface Round {
    roundNumber: number;
    displayText: string;
}

export interface StandingsConfiguration {
    displayName: string;
    statId:      string;
    season:      number;
}

export interface TournamentPill {
    tournamentId: string;
    displayName:  string;
}

export interface YearPill {
    year:          number;
    displaySeason: string;
}

export enum FetchStatus {
    Idle = "idle",
}

export enum Status {
    Success = "success",
}

export interface PageContext {
    locale:                   string;
    pagePath:                 string;
    tourCode:                 string;
    partnerId:                null;
    tournaments:              PageContextTournament[];
    clientIp:                 string;
    countryCode:              string;
    isEmbeddedWebView:        boolean;
    queryArgs:                QueryArgsClass;
    activeTournamentOverride: null;
    universalTournaments:     string[];
    bypassObsoleteCheck:      boolean;
    tourMobileNav:            TourMobileNav[];
    tourNavFooter:            TourNavFooter;
    tourNavHeader:            TourMobileNav[];
    tourSwitcher:             TourSwitcher[];
    coverageTournament:       string[];
    backgroundOverride:       BackgroundOverride;
    homeNavIconOverride:      HomeNavIconOverride;
    searchQuickLinks:         SearchQuickLinks;
    seasons:                  Seasons;
    favoriteInteractivity:    FavoriteInteractivity;
    locationFavorites:        LocationFavorites;
}

export interface BackgroundOverride {
    R: BackgroundOverrideR;
    H: BackgroundOverrideH;
    S: BackgroundOverrideH;
}

export interface BackgroundOverrideH {
    enabled: boolean;
    wings:   string;
}

export interface BackgroundOverrideR {
    enabled:      boolean;
    takeoverType: string;
    wings:        string;
    styles:       Styles;
}

export interface Styles {
    headerBackground:       string;
    footerBackground:       string;
    pageBackground:         string;
    pageBackgroundSize:     number;
    headerTextColors:       ErTextColors;
    footerTextColors:       ErTextColors;
    opacity:                number;
    backgroundRailGradient: boolean;
}

export interface ErTextColors {
    default:  string;
    hover:    string;
    selected: string;
}

export interface FavoriteInteractivity {
    enabled:               boolean;
    minimumPromptInterval: number;
    leaderboardScorecard:  LeaderboardScorecard;
    playerProfile:         LeaderboardScorecard;
}

export interface LeaderboardScorecard {
    enabled:          boolean;
    timePeriod:       number;
    interactionCount: number;
}

export interface HomeNavIconOverride {
    R: HomeNavIconOverrideR;
    H: HomeNavIconOverrideH;
    S: HomeNavIconOverrideH;
}

export interface HomeNavIconOverrideH {
    enabled:     boolean;
    homeNavIcon: string;
}

export interface HomeNavIconOverrideR {
    enabled:     boolean;
    homeNavIcon: string;
    desktop:     Desktop;
    mobile:      Desktop;
}

export interface LocationFavorites {
    enabled:               boolean;
    minimumPromptInterval: number;
    interactivityPeriod:   number;
    countryCode:           string;
    favorites:             any[];
}

export interface QueryArgsClass {
    year:           string;
    tournamentName: string;
    tournamentId:   string;
    tab:            string[];
}

export interface SearchQuickLinks {
    R: HElement[];
    S: HElement[];
    H: HElement[];
    Y: HElement[];
}

export interface HElement {
    key:         string;
    url:         string;
    displayText: string;
    newTab:      boolean;
}

export interface Seasons {
    R: SeasonsH;
    S: SeasonsH;
    H: SeasonsH;
    Y: SeasonsH;
}

export interface SeasonsH {
    standings: number;
    stats:     number;
    schedule:  number;
}

export interface TourMobileNav {
    key:    string;
    link?:  string;
    label?: string;
    image?: string;
    menu?:  TourMobileNav[];
}

export interface TourNavFooter {
    navLists:           LegalNav[];
    legalNav:           LegalNav[];
    socialNav:          TourMobileNav[];
    legalText:          LegalText;
    secondaryLegalText: LegalText;
}

export interface LegalNav {
    key:  string;
    menu: TourMobileNav[];
}

export interface LegalText {
    key:   string;
    label: string;
}

export interface TourSwitcher {
    id?:      string;
    label:    string;
    code:     string;
    logoUrl:  string;
    external: boolean;
    link?:    string;
}

export interface PageContextTournament {
    id:            string;
    leaderboardId: string;
    tourCode:      string;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toPGATourLeaderboardJSONReaderNextData2(json: string): PGATourLeaderboardJSONReaderNextData2 {
        return cast(JSON.parse(json), r("PGATourLeaderboardJSONReaderNextData2"));
    }

    public static pGATourLeaderboardJSONReaderNextData2ToJson(value: PGATourLeaderboardJSONReaderNextData2): string {
        return JSON.stringify(uncast(value, r("PGATourLeaderboardJSONReaderNextData2")), null, 2);
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
    "PGATourLeaderboardJSONReaderNextData2": o([
        { json: "props", js: "props", typ: r("Props") },
        { json: "page", js: "page", typ: "" },
        { json: "query", js: "query", typ: r("QueryArgsClass") },
        { json: "buildId", js: "buildId", typ: "" },
        { json: "assetPrefix", js: "assetPrefix", typ: "" },
        { json: "isFallback", js: "isFallback", typ: true },
        { json: "isExperimentalCompile", js: "isExperimentalCompile", typ: true },
        { json: "dynamicIds", js: "dynamicIds", typ: a(0) },
        { json: "gssp", js: "gssp", typ: true },
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
        { json: "tournament", js: "tournament", typ: r("DatumElement") },
        { json: "leaderboardId", js: "leaderboardId", typ: "" },
        { json: "isOddsAvailable", js: "isOddsAvailable", typ: true },
        { json: "dehydratedState", js: "dehydratedState", typ: r("DehydratedState") },
    ], false),
    "DehydratedState": o([
        { json: "mutations", js: "mutations", typ: a("any") },
        { json: "queries", js: "queries", typ: a(r("QueryElement")) },
    ], false),
    "QueryElement": o([
        { json: "state", js: "state", typ: r("State") },
        { json: "queryKey", js: "queryKey", typ: a(u(r("QueryKeyClass"), "")) },
        { json: "queryHash", js: "queryHash", typ: "" },
    ], false),
    "QueryKeyClass": o([
        { json: "R2025100", js: "R2025100", typ: u(undefined, "") },
        { json: "R2025472", js: "R2025472", typ: u(undefined, "") },
        { json: "S2025008", js: "S2025008", typ: u(undefined, "") },
        { json: "H2025022", js: "H2025022", typ: u(undefined, "") },
        { json: "Y2025010", js: "Y2025010", typ: u(undefined, "") },
        { json: "id", js: "id", typ: u(undefined, u(null, "")) },
        { json: "leaderboardId", js: "leaderboardId", typ: u(undefined, "") },
        { json: "shouldSubscribe", js: "shouldSubscribe", typ: u(undefined, true) },
        { json: "tournamentId", js: "tournamentId", typ: u(undefined, u(null, "")) },
        { json: "odds", js: "odds", typ: u(undefined, true) },
        { json: "tourCode", js: "tourCode", typ: u(undefined, "") },
        { json: "year", js: "year", typ: u(undefined, null) },
        { json: "eventQuery", js: "eventQuery", typ: u(undefined, null) },
        { json: "sponsor", js: "sponsor", typ: u(undefined, "") },
        { json: "tour", js: "tour", typ: u(undefined, "") },
    ], false),
    "State": o([
        { json: "data", js: "data", typ: u(a(r("DatumElement")), r("DataClass")) },
        { json: "dataUpdateCount", js: "dataUpdateCount", typ: 0 },
        { json: "dataUpdatedAt", js: "dataUpdatedAt", typ: 0 },
        { json: "error", js: "error", typ: null },
        { json: "errorUpdateCount", js: "errorUpdateCount", typ: 0 },
        { json: "errorUpdatedAt", js: "errorUpdatedAt", typ: 0 },
        { json: "fetchFailureCount", js: "fetchFailureCount", typ: 0 },
        { json: "fetchFailureReason", js: "fetchFailureReason", typ: null },
        { json: "fetchMeta", js: "fetchMeta", typ: null },
        { json: "isInvalidated", js: "isInvalidated", typ: true },
        { json: "status", js: "status", typ: r("Status") },
        { json: "fetchStatus", js: "fetchStatus", typ: r("FetchStatus") },
    ], false),
    "DatumElement": o([
        { json: "id", js: "id", typ: "" },
        { json: "tournamentName", js: "tournamentName", typ: "" },
        { json: "tournamentLogo", js: "tournamentLogo", typ: a("") },
        { json: "tournamentLocation", js: "tournamentLocation", typ: "" },
        { json: "tournamentStatus", js: "tournamentStatus", typ: "" },
        { json: "roundStatusDisplay", js: "roundStatusDisplay", typ: "" },
        { json: "roundDisplay", js: "roundDisplay", typ: "" },
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
        { json: "scoredLevel", js: "scoredLevel", typ: r("ScorLevel") },
        { json: "infoPath", js: "infoPath", typ: null },
        { json: "events", js: "events", typ: a("any") },
        { json: "courses", js: "courses", typ: a(r("Course")) },
        { json: "weather", js: "weather", typ: r("Weather") },
        { json: "ticketsURL", js: "ticketsURL", typ: u(null, "") },
        { json: "tournamentSiteURL", js: "tournamentSiteURL", typ: u(null, "") },
        { json: "formatType", js: "formatType", typ: "" },
        { json: "features", js: "features", typ: a("") },
        { json: "conductedByLabel", js: "conductedByLabel", typ: u(null, "") },
        { json: "conductedByLink", js: "conductedByLink", typ: u(null, "") },
        { json: "beautyImage", js: "beautyImage", typ: "" },
        { json: "hideRolexClock", js: "hideRolexClock", typ: true },
        { json: "hideSov", js: "hideSov", typ: true },
        { json: "headshotBaseUrl", js: "headshotBaseUrl", typ: null },
        { json: "rightRailConfig", js: "rightRailConfig", typ: null },
        { json: "shouldSubscribe", js: "shouldSubscribe", typ: true },
        { json: "ticketsEnabled", js: "ticketsEnabled", typ: true },
        { json: "useTournamentSiteURL", js: "useTournamentSiteURL", typ: true },
        { json: "beautyImageAsset", js: "beautyImageAsset", typ: r("Asset") },
        { json: "disabledScorecardTabs", js: "disabledScorecardTabs", typ: a("any") },
        { json: "leaderboardTakeover", js: "leaderboardTakeover", typ: true },
        { json: "tournamentCategoryInfo", js: "tournamentCategoryInfo", typ: null },
        { json: "tournamentLogoAsset", js: "tournamentLogoAsset", typ: a(r("Asset")) },
    ], false),
    "Asset": o([
        { json: "imageOrg", js: "imageOrg", typ: r("ImageOrg") },
        { json: "imagePath", js: "imagePath", typ: "" },
    ], false),
    "Course": o([
        { json: "id", js: "id", typ: "" },
        { json: "courseName", js: "courseName", typ: "" },
        { json: "courseCode", js: "courseCode", typ: "" },
        { json: "hostCourse", js: "hostCourse", typ: true },
        { json: "scoringLevel", js: "scoringLevel", typ: r("ScorLevel") },
        { json: "__typename", js: "__typename", typ: u(undefined, "") },
    ], false),
    "Weather": o([
        { json: "logo", js: "logo", typ: "" },
        { json: "logoDark", js: "logoDark", typ: "" },
        { json: "logoAccessibility", js: "logoAccessibility", typ: r("LogoAccessibility") },
        { json: "tempF", js: "tempF", typ: "" },
        { json: "tempC", js: "tempC", typ: "" },
        { json: "condition", js: "condition", typ: "" },
        { json: "windDirection", js: "windDirection", typ: r("WeatherWindDirection") },
        { json: "windSpeedMPH", js: "windSpeedMPH", typ: "" },
        { json: "windSpeedKPH", js: "windSpeedKPH", typ: "" },
        { json: "precipitation", js: "precipitation", typ: "" },
        { json: "humidity", js: "humidity", typ: "" },
        { json: "logoAsset", js: "logoAsset", typ: r("Asset") },
        { json: "logoDarkAsset", js: "logoDarkAsset", typ: r("Asset") },
    ], false),
    "DataClass": o([
        { json: "id", js: "id", typ: u(undefined, "") },
        { json: "tournamentName", js: "tournamentName", typ: u(undefined, "") },
        { json: "tournamentLogo", js: "tournamentLogo", typ: u(undefined, a("")) },
        { json: "tournamentLocation", js: "tournamentLocation", typ: u(undefined, "") },
        { json: "tournamentStatus", js: "tournamentStatus", typ: u(undefined, "") },
        { json: "roundStatusDisplay", js: "roundStatusDisplay", typ: u(undefined, "") },
        { json: "roundDisplay", js: "roundDisplay", typ: u(undefined, "") },
        { json: "roundStatus", js: "roundStatus", typ: u(undefined, "") },
        { json: "roundStatusColor", js: "roundStatusColor", typ: u(undefined, "") },
        { json: "currentRound", js: "currentRound", typ: u(undefined, 0) },
        { json: "timezone", js: "timezone", typ: u(undefined, "") },
        { json: "pdfUrl", js: "pdfUrl", typ: u(undefined, null) },
        { json: "seasonYear", js: "seasonYear", typ: u(undefined, "") },
        { json: "displayDate", js: "displayDate", typ: u(undefined, "") },
        { json: "country", js: "country", typ: u(undefined, "") },
        { json: "state", js: "state", typ: u(undefined, "") },
        { json: "city", js: "city", typ: u(undefined, "") },
        { json: "scoredLevel", js: "scoredLevel", typ: u(undefined, r("ScorLevel")) },
        { json: "infoPath", js: "infoPath", typ: u(undefined, null) },
        { json: "events", js: "events", typ: u(undefined, a("any")) },
        { json: "courses", js: "courses", typ: u(undefined, a(r("Course"))) },
        { json: "weather", js: "weather", typ: u(undefined, r("Weather")) },
        { json: "ticketsURL", js: "ticketsURL", typ: u(undefined, u(null, "")) },
        { json: "tournamentSiteURL", js: "tournamentSiteURL", typ: u(undefined, u(null, "")) },
        { json: "formatType", js: "formatType", typ: u(undefined, "") },
        { json: "features", js: "features", typ: u(undefined, a("")) },
        { json: "conductedByLabel", js: "conductedByLabel", typ: u(undefined, u(null, "")) },
        { json: "conductedByLink", js: "conductedByLink", typ: u(undefined, u(null, "")) },
        { json: "beautyImage", js: "beautyImage", typ: u(undefined, "") },
        { json: "hideRolexClock", js: "hideRolexClock", typ: u(undefined, true) },
        { json: "hideSov", js: "hideSov", typ: u(undefined, true) },
        { json: "headshotBaseUrl", js: "headshotBaseUrl", typ: u(undefined, null) },
        { json: "rightRailConfig", js: "rightRailConfig", typ: u(undefined, null) },
        { json: "shouldSubscribe", js: "shouldSubscribe", typ: u(undefined, true) },
        { json: "ticketsEnabled", js: "ticketsEnabled", typ: u(undefined, true) },
        { json: "useTournamentSiteURL", js: "useTournamentSiteURL", typ: u(undefined, true) },
        { json: "beautyImageAsset", js: "beautyImageAsset", typ: u(undefined, r("Asset")) },
        { json: "disabledScorecardTabs", js: "disabledScorecardTabs", typ: u(undefined, a("any")) },
        { json: "leaderboardTakeover", js: "leaderboardTakeover", typ: u(undefined, true) },
        { json: "tournamentCategoryInfo", js: "tournamentCategoryInfo", typ: u(undefined, null) },
        { json: "tournamentLogoAsset", js: "tournamentLogoAsset", typ: u(undefined, a(r("Asset"))) },
        { json: "__typename", js: "__typename", typ: u(undefined, "") },
        { json: "tournamentId", js: "tournamentId", typ: u(undefined, "") },
        { json: "leaderboardRoundHeader", js: "leaderboardRoundHeader", typ: u(undefined, r("RoundHeader")) },
        { json: "players", js: "players", typ: u(undefined, u(a(u(r("PurplePlayer"), "")), r("Aon"))) },
        { json: "messages", js: "messages", typ: u(undefined, a("any")) },
        { json: "rounds", js: "rounds", typ: u(undefined, a(r("Round"))) },
        { json: "isPlayoffActive", js: "isPlayoffActive", typ: u(undefined, true) },
        { json: "scorecardEnabled", js: "scorecardEnabled", typ: u(undefined, true) },
        { json: "profileEnabled", js: "profileEnabled", typ: u(undefined, true) },
        { json: "subEvent", js: "subEvent", typ: u(undefined, true) },
        { json: "leaderboardFeatures", js: "leaderboardFeatures", typ: u(undefined, a(r("LeaderboardFeature"))) },
        { json: "standingsEnabled", js: "standingsEnabled", typ: u(undefined, true) },
        { json: "standingsHeader", js: "standingsHeader", typ: u(undefined, "") },
        { json: "disableOdds", js: "disableOdds", typ: u(undefined, true) },
        { json: "disableBettingProfileColumn", js: "disableBettingProfileColumn", typ: u(undefined, true) },
        { json: "disableLeaderboard", js: "disableLeaderboard", typ: u(undefined, true) },
        { json: "odds", js: "odds", typ: u(undefined, u(true, r("Aon"))) },
        { json: "informationSections", js: "informationSections", typ: u(undefined, a(r("InformationSection"))) },
        { json: "oddsToWinId", js: "oddsToWinId", typ: u(undefined, "") },
        { json: "oddsEnabled", js: "oddsEnabled", typ: u(undefined, true) },
        { json: "tourCode", js: "tourCode", typ: u(undefined, "") },
        { json: "standingsConfiguration", js: "standingsConfiguration", typ: u(undefined, a(r("StandingsConfiguration"))) },
        { json: "title", js: "title", typ: u(undefined, "") },
        { json: "projectedTitle", js: "projectedTitle", typ: u(undefined, "") },
        { json: "season", js: "season", typ: u(undefined, "") },
        { json: "description", js: "description", typ: u(undefined, "") },
        { json: "detailCopy", js: "detailCopy", typ: u(undefined, "") },
        { json: "logo", js: "logo", typ: u(undefined, "") },
        { json: "options", js: "options", typ: u(undefined, "") },
        { json: "projectedLive", js: "projectedLive", typ: u(undefined, true) },
        { json: "fixedHeaders", js: "fixedHeaders", typ: u(undefined, 0) },
        { json: "columnHeaders", js: "columnHeaders", typ: u(undefined, a("")) },
        { json: "tournamentPills", js: "tournamentPills", typ: u(undefined, a(r("TournamentPill"))) },
        { json: "yearPills", js: "yearPills", typ: u(undefined, a(r("YearPill"))) },
        { json: "rankingsHeader", js: "rankingsHeader", typ: u(undefined, "") },
        { json: "winner", js: "winner", typ: u(undefined, null) },
        { json: "message", js: "message", typ: u(undefined, "") },
        { json: "partner", js: "partner", typ: u(undefined, null) },
        { json: "partnerLink", js: "partnerLink", typ: u(undefined, null) },
        { json: "sponsor", js: "sponsor", typ: u(undefined, "") },
        { json: "logoUrl", js: "logoUrl", typ: u(undefined, "") },
        { json: "logoDarkUrl", js: "logoDarkUrl", typ: u(undefined, "") },
        { json: "type", js: "type", typ: u(undefined, "") },
        { json: "countryCode", js: "countryCode", typ: u(undefined, "") },
        { json: "coverageType", js: "coverageType", typ: u(undefined, a(r("CoverageType"))) },
        { json: "sponsorLink", js: "sponsorLink", typ: u(undefined, "") },
        { json: "sponsorLogo", js: "sponsorLogo", typ: u(undefined, "") },
        { json: "sponsorLogoDark", js: "sponsorLogoDark", typ: u(undefined, "") },
        { json: "sponsorLogoAsset", js: "sponsorLogoAsset", typ: u(undefined, r("Asset")) },
        { json: "sponsorLogoDarkAsset", js: "sponsorLogoDarkAsset", typ: u(undefined, r("Asset")) },
        { json: "modalSponsorLogoAsset", js: "modalSponsorLogoAsset", typ: u(undefined, r("Asset")) },
        { json: "modalSponsorLogoDarkAsset", js: "modalSponsorLogoDarkAsset", typ: u(undefined, r("Asset")) },
        { json: "modalSponsorLogo", js: "modalSponsorLogo", typ: u(undefined, "") },
        { json: "modalSponsorLogoDark", js: "modalSponsorLogoDark", typ: u(undefined, "") },
        { json: "accessibilityText", js: "accessibilityText", typ: u(undefined, r("LogoAccessibility")) },
        { json: "hourly", js: "hourly", typ: u(undefined, a(r("Hourly"))) },
        { json: "daily", js: "daily", typ: u(undefined, a(r("Daily"))) },
        { json: "config", js: "config", typ: u(undefined, r("Config")) },
        { json: "homepage", js: "homepage", typ: u(undefined, r("Aon")) },
        { json: "liveLeaderboard", js: "liveLeaderboard", typ: u(undefined, r("Aon")) },
        { json: "leaderboard", js: "leaderboard", typ: u(undefined, r("Aon")) },
        { json: "leaderboardOdds", js: "leaderboardOdds", typ: u(undefined, r("Aon")) },
        { json: "leaderboardProbability", js: "leaderboardProbability", typ: u(undefined, r("Aon")) },
        { json: "leaderboardShotDetails", js: "leaderboardShotDetails", typ: u(undefined, r("Aon")) },
        { json: "leaderboardCutline", js: "leaderboardCutline", typ: u(undefined, r("Aon")) },
        { json: "leaderboardRow50", js: "leaderboardRow50", typ: u(undefined, r("Aon")) },
        { json: "leaderboardFavorites", js: "leaderboardFavorites", typ: u(undefined, null) },
        { json: "cupLeaderboardGroup", js: "cupLeaderboardGroup", typ: u(undefined, r("Aon")) },
        { json: "cupLeaderboardSingles", js: "cupLeaderboardSingles", typ: u(undefined, r("Aon")) },
        { json: "playerProfile", js: "playerProfile", typ: u(undefined, r("Aon")) },
        { json: "playerProfileBio", js: "playerProfileBio", typ: u(undefined, r("Aon")) },
        { json: "playerProfileResults", js: "playerProfileResults", typ: u(undefined, r("Aon")) },
        { json: "playerProfileStats", js: "playerProfileStats", typ: u(undefined, r("Aon")) },
        { json: "scorecard", js: "scorecard", typ: u(undefined, r("Aon")) },
        { json: "playoffScorecard", js: "playoffScorecard", typ: u(undefined, r("Aon")) },
        { json: "webPlayerStories", js: "webPlayerStories", typ: u(undefined, r("Aon")) },
        { json: "webTopicStories", js: "webTopicStories", typ: u(undefined, r("Aon")) },
        { json: "teeTimes", js: "teeTimes", typ: u(undefined, r("Aon")) },
        { json: "cupTeeTimesGroup", js: "cupTeeTimesGroup", typ: u(undefined, r("Aon")) },
        { json: "cupTeeTimesSingles", js: "cupTeeTimesSingles", typ: u(undefined, r("Aon")) },
        { json: "tournament", js: "tournament", typ: u(undefined, r("Aon")) },
        { json: "tournamentSection", js: "tournamentSection", typ: u(undefined, r("Aon")) },
        { json: "sidebarTicker", js: "sidebarTicker", typ: u(undefined, r("Aon")) },
        { json: "groupStageLeaderboard", js: "groupStageLeaderboard", typ: u(undefined, r("Aon")) },
        { json: "groupStageStandings", js: "groupStageStandings", typ: u(undefined, r("Aon")) },
        { json: "knockoutLeaderboard", js: "knockoutLeaderboard", typ: u(undefined, r("Aon")) },
        { json: "groupScorecard", js: "groupScorecard", typ: u(undefined, r("Aon")) },
        { json: "schedule", js: "schedule", typ: u(undefined, r("Aon")) },
        { json: "aon", js: "aon", typ: u(undefined, r("Aon")) },
        { json: "totalPlayCup", js: "totalPlayCup", typ: u(undefined, null) },
        { json: "totalplaycupSection", js: "totalplaycupSection", typ: u(undefined, null) },
        { json: "schwabCup", js: "schwabCup", typ: u(undefined, null) },
        { json: "schwabcupSection", js: "schwabcupSection", typ: u(undefined, null) },
        { json: "fedexCup", js: "fedexCup", typ: u(undefined, r("Aon")) },
        { json: "fedexcupSection", js: "fedexcupSection", typ: u(undefined, r("Aon")) },
        { json: "fortinetCup", js: "fortinetCup", typ: u(undefined, null) },
        { json: "fortinetcupSection", js: "fortinetcupSection", typ: u(undefined, null) },
        { json: "the25pointsList", js: "the25pointsList", typ: u(undefined, null) },
        { json: "the25Section", js: "the25Section", typ: u(undefined, null) },
        { json: "comcastTop10", js: "comcastTop10", typ: u(undefined, r("Aon")) },
        { json: "stats", js: "stats", typ: u(undefined, r("Aon")) },
        { json: "statsSection", js: "statsSection", typ: u(undefined, r("Aon")) },
        { json: "studios", js: "studios", typ: u(undefined, null) },
        { json: "news", js: "news", typ: u(undefined, r("Aon")) },
        { json: "newsArticles", js: "newsArticles", typ: u(undefined, r("Aon")) },
        { json: "rsm", js: "rsm", typ: u(undefined, r("Aon")) },
        { json: "rsmSection", js: "rsmSection", typ: u(undefined, r("Aon")) },
        { json: "golfBet", js: "golfBet", typ: u(undefined, r("Aon")) },
        { json: "university", js: "university", typ: u(undefined, r("Aon")) },
        { json: "comcastSection", js: "comcastSection", typ: u(undefined, r("Aon")) },
        { json: "aonSection", js: "aonSection", typ: u(undefined, r("Aon")) },
        { json: "training", js: "training", typ: u(undefined, r("Aon")) },
        { json: "playerScorecard", js: "playerScorecard", typ: u(undefined, r("Aon")) },
        { json: "yahooLeaderboard", js: "yahooLeaderboard", typ: u(undefined, r("Aon")) },
        { json: "tourcast", js: "tourcast", typ: u(undefined, r("Aon")) },
        { json: "payneStewartaward", js: "payneStewartaward", typ: u(undefined, r("Aon")) },
        { json: "dpwtRankings", js: "dpwtRankings", typ: u(undefined, r("Aon")) },
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
        { json: "containerSmall", js: "containerSmall", typ: r("Desktop") },
        { json: "containerMedium", js: "containerMedium", typ: r("Desktop") },
        { json: "containerLarge", js: "containerLarge", typ: u(r("Desktop"), null) },
        { json: "sizes", js: "sizes", typ: null },
        { json: "playerSponsorship", js: "playerSponsorship", typ: u(true, null) },
    ], false),
    "Desktop": o([
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
    "CoverageType": o([
        { json: "__typename", js: "__typename", typ: "" },
        { json: "id", js: "id", typ: "" },
        { json: "streamTitle", js: "streamTitle", typ: "" },
        { json: "roundNumber", js: "roundNumber", typ: 0 },
        { json: "channelTitle", js: "channelTitle", typ: "" },
        { json: "roundDisplay", js: "roundDisplay", typ: "" },
        { json: "startTime", js: "startTime", typ: 0 },
        { json: "endTime", js: "endTime", typ: 0 },
        { json: "promoImage", js: "promoImage", typ: null },
        { json: "promoImages", js: "promoImages", typ: a("") },
        { json: "liveStatus", js: "liveStatus", typ: "" },
        { json: "network", js: "network", typ: r("Network") },
    ], false),
    "Network": o([
        { json: "id", js: "id", typ: "" },
        { json: "networkName", js: "networkName", typ: "" },
        { json: "backgroundColor", js: "backgroundColor", typ: "" },
        { json: "backgroundColorDark", js: "backgroundColorDark", typ: "" },
        { json: "networkLogo", js: "networkLogo", typ: "" },
        { json: "networkLogoDark", js: "networkLogoDark", typ: "" },
        { json: "priorityNum", js: "priorityNum", typ: 0 },
        { json: "url", js: "url", typ: "" },
        { json: "iOSLink", js: "iOSLink", typ: "" },
        { json: "appleAppStore", js: "appleAppStore", typ: "" },
        { json: "androidLink", js: "androidLink", typ: "" },
        { json: "googlePlayStore", js: "googlePlayStore", typ: "" },
        { json: "simulcast", js: "simulcast", typ: true },
        { json: "simulcastUrl", js: "simulcastUrl", typ: null },
        { json: "streamUrl", js: "streamUrl", typ: "" },
        { json: "iosStreamUrl", js: "iosStreamUrl", typ: "" },
        { json: "androidStreamUrl", js: "androidStreamUrl", typ: "" },
    ], false),
    "Daily": o([
        { json: "title", js: "title", typ: "" },
        { json: "condition", js: "condition", typ: "" },
        { json: "windDirection", js: "windDirection", typ: "" },
        { json: "windSpeedKPH", js: "windSpeedKPH", typ: "" },
        { json: "windSpeedMPH", js: "windSpeedMPH", typ: "" },
        { json: "humidity", js: "humidity", typ: "" },
        { json: "precipitation", js: "precipitation", typ: "" },
        { json: "temperature", js: "temperature", typ: r("DailyTemperature") },
    ], false),
    "DailyTemperature": o([
        { json: "__typename", js: "__typename", typ: "" },
        { json: "minTempC", js: "minTempC", typ: "" },
        { json: "minTempF", js: "minTempF", typ: "" },
        { json: "maxTempC", js: "maxTempC", typ: "" },
        { json: "maxTempF", js: "maxTempF", typ: "" },
    ], false),
    "Hourly": o([
        { json: "title", js: "title", typ: "" },
        { json: "condition", js: "condition", typ: r("Condition") },
        { json: "windDirection", js: "windDirection", typ: r("HourlyWindDirection") },
        { json: "windSpeedKPH", js: "windSpeedKPH", typ: "" },
        { json: "windSpeedMPH", js: "windSpeedMPH", typ: "" },
        { json: "humidity", js: "humidity", typ: "" },
        { json: "precipitation", js: "precipitation", typ: "" },
        { json: "temperature", js: "temperature", typ: r("HourlyTemperature") },
    ], false),
    "HourlyTemperature": o([
        { json: "__typename", js: "__typename", typ: r("TemperatureTypename") },
        { json: "tempC", js: "tempC", typ: r("TempC") },
        { json: "tempF", js: "tempF", typ: "" },
    ], false),
    "InformationSection": o([
        { json: "title", js: "title", typ: r("Title") },
        { json: "sponsorImages", js: "sponsorImages", typ: u(a(r("SponsorImage")), null) },
        { json: "items", js: "items", typ: a(r("Item")) },
    ], false),
    "Item": o([
        { json: "__typename", js: "__typename", typ: r("Title") },
        { json: "title", js: "title", typ: "" },
        { json: "icon", js: "icon", typ: u(undefined, "") },
        { json: "text", js: "text", typ: u(undefined, null) },
        { json: "subText", js: "subText", typ: u(undefined, u(null, "")) },
        { json: "iconUrl", js: "iconUrl", typ: u(undefined, null) },
        { json: "key", js: "key", typ: u(undefined, "") },
        { json: "description", js: "description", typ: u(undefined, "") },
    ], false),
    "SponsorImage": o([
        { json: "logo", js: "logo", typ: "" },
        { json: "logoDark", js: "logoDark", typ: "" },
        { json: "accessibilityText", js: "accessibilityText", typ: "" },
        { json: "link", js: "link", typ: u(null, "") },
    ], false),
    "LeaderboardFeature": o([
        { json: "__typename", js: "__typename", typ: "" },
        { json: "name", js: "name", typ: "" },
        { json: "leaderboardFeatures", js: "leaderboardFeatures", typ: "" },
        { json: "new", js: "new", typ: true },
        { json: "tooltipText", js: "tooltipText", typ: "" },
        { json: "tooltipTitle", js: "tooltipTitle", typ: "" },
    ], false),
    "PurplePlayer": o([
        { json: "__typename", js: "__typename", typ: u(undefined, r("PlayerTypename")) },
        { json: "id", js: "id", typ: u(undefined, "") },
        { json: "leaderboardSortOrder", js: "leaderboardSortOrder", typ: u(undefined, 0) },
        { json: "player", js: "player", typ: u(undefined, r("FluffyPlayer")) },
        { json: "scoringData", js: "scoringData", typ: u(undefined, r("ScoringData")) },
        { json: "playerId", js: "playerId", typ: u(undefined, "") },
        { json: "odds", js: "odds", typ: u(undefined, "") },
        { json: "oddsSort", js: "oddsSort", typ: u(undefined, 3.14) },
        { json: "oddsDirection", js: "oddsDirection", typ: u(undefined, r("OddsDirection")) },
        { json: "optionId", js: "optionId", typ: u(undefined, "") },
    ], false),
    "FluffyPlayer": o([
        { json: "id", js: "id", typ: "" },
        { json: "firstName", js: "firstName", typ: "" },
        { json: "lastName", js: "lastName", typ: "" },
        { json: "amateur", js: "amateur", typ: true },
        { json: "displayName", js: "displayName", typ: "" },
        { json: "abbreviations", js: "abbreviations", typ: r("Abbreviations") },
        { json: "abbreviationsAccessibilityText", js: "abbreviationsAccessibilityText", typ: r("AbbreviationsAccessibilityText") },
        { json: "country", js: "country", typ: "" },
        { json: "countryFlag", js: "countryFlag", typ: "" },
        { json: "shortName", js: "shortName", typ: "" },
        { json: "lineColor", js: "lineColor", typ: r("LineColor") },
        { json: "tourBound", js: "tourBound", typ: true },
        { json: "bettingProfile", js: "bettingProfile", typ: u(undefined, "") },
    ], false),
    "ScoringData": o([
        { json: "position", js: "position", typ: r("Position") },
        { json: "total", js: "total", typ: r("Total") },
        { json: "totalSort", js: "totalSort", typ: 0 },
        { json: "thru", js: "thru", typ: "" },
        { json: "thruSort", js: "thruSort", typ: 0 },
        { json: "score", js: "score", typ: "" },
        { json: "scoreSort", js: "scoreSort", typ: 0 },
        { json: "teeTime", js: "teeTime", typ: 0 },
        { json: "courseId", js: "courseId", typ: "" },
        { json: "groupNumber", js: "groupNumber", typ: 0 },
        { json: "currentRound", js: "currentRound", typ: 0 },
        { json: "backNine", js: "backNine", typ: true },
        { json: "roundHeader", js: "roundHeader", typ: r("RoundHeader") },
        { json: "rounds", js: "rounds", typ: a(r("Position")) },
        { json: "movementDirection", js: "movementDirection", typ: r("OddsDirection") },
        { json: "movementAmount", js: "movementAmount", typ: "" },
        { json: "movementSort", js: "movementSort", typ: 0 },
        { json: "playerState", js: "playerState", typ: r("PlayerState") },
        { json: "rankingMovement", js: "rankingMovement", typ: r("OddsDirection") },
        { json: "rankingMovementAmount", js: "rankingMovementAmount", typ: "" },
        { json: "rankingMovementAmountSort", js: "rankingMovementAmountSort", typ: 0 },
        { json: "totalStrokes", js: "totalStrokes", typ: r("Position") },
        { json: "totalStrokesSort", js: "totalStrokesSort", typ: 0 },
        { json: "roundDisplaySort", js: "roundDisplaySort", typ: a(null) },
        { json: "official", js: "official", typ: "" },
        { json: "officialSort", js: "officialSort", typ: 0 },
        { json: "projected", js: "projected", typ: "" },
        { json: "projectedSort", js: "projectedSort", typ: 0 },
        { json: "hasStoryContent", js: "hasStoryContent", typ: true },
        { json: "storyContentRounds", js: "storyContentRounds", typ: a("any") },
        { json: "roundStatus", js: "roundStatus", typ: "" },
        { json: "rankLogoLight", js: "rankLogoLight", typ: u(undefined, "") },
        { json: "rankLogoDark", js: "rankLogoDark", typ: u(undefined, "") },
    ], false),
    "Round": o([
        { json: "roundNumber", js: "roundNumber", typ: 0 },
        { json: "displayText", js: "displayText", typ: "" },
    ], false),
    "StandingsConfiguration": o([
        { json: "displayName", js: "displayName", typ: "" },
        { json: "statId", js: "statId", typ: "" },
        { json: "season", js: "season", typ: 0 },
    ], false),
    "TournamentPill": o([
        { json: "tournamentId", js: "tournamentId", typ: "" },
        { json: "displayName", js: "displayName", typ: "" },
    ], false),
    "YearPill": o([
        { json: "year", js: "year", typ: 0 },
        { json: "displaySeason", js: "displaySeason", typ: "" },
    ], false),
    "PageContext": o([
        { json: "locale", js: "locale", typ: "" },
        { json: "pagePath", js: "pagePath", typ: "" },
        { json: "tourCode", js: "tourCode", typ: "" },
        { json: "partnerId", js: "partnerId", typ: null },
        { json: "tournaments", js: "tournaments", typ: a(r("PageContextTournament")) },
        { json: "clientIp", js: "clientIp", typ: "" },
        { json: "countryCode", js: "countryCode", typ: "" },
        { json: "isEmbeddedWebView", js: "isEmbeddedWebView", typ: true },
        { json: "queryArgs", js: "queryArgs", typ: r("QueryArgsClass") },
        { json: "activeTournamentOverride", js: "activeTournamentOverride", typ: null },
        { json: "universalTournaments", js: "universalTournaments", typ: a("") },
        { json: "bypassObsoleteCheck", js: "bypassObsoleteCheck", typ: true },
        { json: "tourMobileNav", js: "tourMobileNav", typ: a(r("TourMobileNav")) },
        { json: "tourNavFooter", js: "tourNavFooter", typ: r("TourNavFooter") },
        { json: "tourNavHeader", js: "tourNavHeader", typ: a(r("TourMobileNav")) },
        { json: "tourSwitcher", js: "tourSwitcher", typ: a(r("TourSwitcher")) },
        { json: "coverageTournament", js: "coverageTournament", typ: a("") },
        { json: "backgroundOverride", js: "backgroundOverride", typ: r("BackgroundOverride") },
        { json: "homeNavIconOverride", js: "homeNavIconOverride", typ: r("HomeNavIconOverride") },
        { json: "searchQuickLinks", js: "searchQuickLinks", typ: r("SearchQuickLinks") },
        { json: "seasons", js: "seasons", typ: r("Seasons") },
        { json: "favoriteInteractivity", js: "favoriteInteractivity", typ: r("FavoriteInteractivity") },
        { json: "locationFavorites", js: "locationFavorites", typ: r("LocationFavorites") },
    ], false),
    "BackgroundOverride": o([
        { json: "R", js: "R", typ: r("BackgroundOverrideR") },
        { json: "H", js: "H", typ: r("BackgroundOverrideH") },
        { json: "S", js: "S", typ: r("BackgroundOverrideH") },
    ], false),
    "BackgroundOverrideH": o([
        { json: "enabled", js: "enabled", typ: true },
        { json: "wings", js: "wings", typ: "" },
    ], false),
    "BackgroundOverrideR": o([
        { json: "enabled", js: "enabled", typ: true },
        { json: "takeoverType", js: "takeoverType", typ: "" },
        { json: "wings", js: "wings", typ: "" },
        { json: "styles", js: "styles", typ: r("Styles") },
    ], false),
    "Styles": o([
        { json: "headerBackground", js: "headerBackground", typ: "" },
        { json: "footerBackground", js: "footerBackground", typ: "" },
        { json: "pageBackground", js: "pageBackground", typ: "" },
        { json: "pageBackgroundSize", js: "pageBackgroundSize", typ: 0 },
        { json: "headerTextColors", js: "headerTextColors", typ: r("ErTextColors") },
        { json: "footerTextColors", js: "footerTextColors", typ: r("ErTextColors") },
        { json: "opacity", js: "opacity", typ: 3.14 },
        { json: "backgroundRailGradient", js: "backgroundRailGradient", typ: true },
    ], false),
    "ErTextColors": o([
        { json: "default", js: "default", typ: "" },
        { json: "hover", js: "hover", typ: "" },
        { json: "selected", js: "selected", typ: "" },
    ], false),
    "FavoriteInteractivity": o([
        { json: "enabled", js: "enabled", typ: true },
        { json: "minimumPromptInterval", js: "minimumPromptInterval", typ: 0 },
        { json: "leaderboardScorecard", js: "leaderboardScorecard", typ: r("LeaderboardScorecard") },
        { json: "playerProfile", js: "playerProfile", typ: r("LeaderboardScorecard") },
    ], false),
    "LeaderboardScorecard": o([
        { json: "enabled", js: "enabled", typ: true },
        { json: "timePeriod", js: "timePeriod", typ: 0 },
        { json: "interactionCount", js: "interactionCount", typ: 0 },
    ], false),
    "HomeNavIconOverride": o([
        { json: "R", js: "R", typ: r("HomeNavIconOverrideR") },
        { json: "H", js: "H", typ: r("HomeNavIconOverrideH") },
        { json: "S", js: "S", typ: r("HomeNavIconOverrideH") },
    ], false),
    "HomeNavIconOverrideH": o([
        { json: "enabled", js: "enabled", typ: true },
        { json: "homeNavIcon", js: "homeNavIcon", typ: "" },
    ], false),
    "HomeNavIconOverrideR": o([
        { json: "enabled", js: "enabled", typ: true },
        { json: "homeNavIcon", js: "homeNavIcon", typ: "" },
        { json: "desktop", js: "desktop", typ: r("Desktop") },
        { json: "mobile", js: "mobile", typ: r("Desktop") },
    ], false),
    "LocationFavorites": o([
        { json: "enabled", js: "enabled", typ: true },
        { json: "minimumPromptInterval", js: "minimumPromptInterval", typ: 0 },
        { json: "interactivityPeriod", js: "interactivityPeriod", typ: 0 },
        { json: "countryCode", js: "countryCode", typ: "" },
        { json: "favorites", js: "favorites", typ: a("any") },
    ], false),
    "QueryArgsClass": o([
        { json: "year", js: "year", typ: "" },
        { json: "tournamentName", js: "tournamentName", typ: "" },
        { json: "tournamentId", js: "tournamentId", typ: "" },
        { json: "tab", js: "tab", typ: a("") },
    ], false),
    "SearchQuickLinks": o([
        { json: "R", js: "R", typ: a(r("HElement")) },
        { json: "S", js: "S", typ: a(r("HElement")) },
        { json: "H", js: "H", typ: a(r("HElement")) },
        { json: "Y", js: "Y", typ: a(r("HElement")) },
    ], false),
    "HElement": o([
        { json: "key", js: "key", typ: "" },
        { json: "url", js: "url", typ: "" },
        { json: "displayText", js: "displayText", typ: "" },
        { json: "newTab", js: "newTab", typ: true },
    ], false),
    "Seasons": o([
        { json: "R", js: "R", typ: r("SeasonsH") },
        { json: "S", js: "S", typ: r("SeasonsH") },
        { json: "H", js: "H", typ: r("SeasonsH") },
        { json: "Y", js: "Y", typ: r("SeasonsH") },
    ], false),
    "SeasonsH": o([
        { json: "standings", js: "standings", typ: 0 },
        { json: "stats", js: "stats", typ: 0 },
        { json: "schedule", js: "schedule", typ: 0 },
    ], false),
    "TourMobileNav": o([
        { json: "key", js: "key", typ: "" },
        { json: "link", js: "link", typ: u(undefined, "") },
        { json: "label", js: "label", typ: u(undefined, "") },
        { json: "image", js: "image", typ: u(undefined, "") },
        { json: "menu", js: "menu", typ: u(undefined, a(r("TourMobileNav"))) },
    ], false),
    "TourNavFooter": o([
        { json: "navLists", js: "navLists", typ: a(r("LegalNav")) },
        { json: "legalNav", js: "legalNav", typ: a(r("LegalNav")) },
        { json: "socialNav", js: "socialNav", typ: a(r("TourMobileNav")) },
        { json: "legalText", js: "legalText", typ: r("LegalText") },
        { json: "secondaryLegalText", js: "secondaryLegalText", typ: r("LegalText") },
    ], false),
    "LegalNav": o([
        { json: "key", js: "key", typ: "" },
        { json: "menu", js: "menu", typ: a(r("TourMobileNav")) },
    ], false),
    "LegalText": o([
        { json: "key", js: "key", typ: "" },
        { json: "label", js: "label", typ: "" },
    ], false),
    "TourSwitcher": o([
        { json: "id", js: "id", typ: u(undefined, "") },
        { json: "label", js: "label", typ: "" },
        { json: "code", js: "code", typ: "" },
        { json: "logoUrl", js: "logoUrl", typ: "" },
        { json: "external", js: "external", typ: true },
        { json: "link", js: "link", typ: u(undefined, "") },
    ], false),
    "PageContextTournament": o([
        { json: "id", js: "id", typ: "" },
        { json: "leaderboardId", js: "leaderboardId", typ: "" },
        { json: "tourCode", js: "tourCode", typ: "" },
    ], false),
    "ImageOrg": [
        "pgatour-prod",
    ],
    "ScorLevel": [
        "BASIC",
        "STATS",
    ],
    "LogoAccessibility": [
        "deckorators",
    ],
    "WeatherWindDirection": [
        "NORTH_WEST",
        "SOUTH",
        "SOUTH_EAST",
    ],
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
    "Condition": [
        "DAY_MOSTLY_CLOUDY",
        "DAY_PARTLY_CLOUDY",
    ],
    "TemperatureTypename": [
        "StandardWeatherTemp",
    ],
    "TempC": [
        "13°C",
    ],
    "HourlyWindDirection": [
        "NORTH",
        "NORTH_EAST",
        "NORTH_WEST",
    ],
    "Title": [
        "Abbreviations",
        "Legend",
    ],
    "RoundHeader": [
        "R1",
    ],
    "PlayerTypename": [
        "PlayerRowV3",
    ],
    "OddsDirection": [
        "CONSTANT",
        "DOWN",
        "UP",
    ],
    "Abbreviations": [
        "(a)",
        "",
    ],
    "AbbreviationsAccessibilityText": [
        "",
        "Player is an amateur",
    ],
    "LineColor": [
        "#0084FF",
    ],
    "PlayerState": [
        "NOT_STARTED",
    ],
    "Position": [
        "-",
    ],
    "Total": [
        "E",
    ],
    "FetchStatus": [
        "idle",
    ],
    "Status": [
        "success",
    ],
};
