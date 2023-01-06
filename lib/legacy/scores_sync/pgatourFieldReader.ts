import { TourneyConfig } from '../../models';
import { Reader, ReaderResult, UpdateGolfer } from './Types';

function parseName(name: string): string {
  const parts = name.split(', ');
  return parts[parts.length - 1] + ' ' + parts.slice(0, parts.length - 1).join(', ');
}

function parseJson(json: string): UpdateGolfer[] {
  const parsedJson = JSON.parse(json);
  const golfers = parsedJson.Tournament.Players.map((p: any) => {
    const name = parseName(p.PlayerName);
    return {
      golfer: name,
      scores: [0, 0, 0, 0],
      thru: 0,
      day: 0,
    } as UpdateGolfer;
  });
  return golfers;
}

class PgaTourFieldReader implements Reader {
  async run(config: TourneyConfig, data: any): Promise<ReaderResult> {
    const golfers = parseJson(data);
    return {
      par: config.par,
      golfers,
    };
  }
}

export default new PgaTourFieldReader();
