import { readFileSync } from 'fs';
import { parse } from '../scores_sync/pgaTourDotComScraper2';
import { UpdateGolfer } from '../scores_sync/Types';

const PAR = 72;

describe('PgaTourDotComScraper2Reader.parse', () => {
  let midroundGolfers: UpdateGolfer[];

  beforeAll(() => {
    const midroundHtml = readFileSync('lib/legacy/test/files/pga_tour_dot_com_2023_midround.html', {
      encoding: 'utf-8',
    }).toString();

    const { golfers } = parse(midroundHtml, PAR);
    midroundGolfers = golfers;
  });

  it('parses not started', () => {
    const notStarted = midroundGolfers.find((g) => g.golfer === 'Chad Ramey');
    expect(notStarted).toEqual({
      scores: [-8, 0, 0, 0],
      golfer: 'Chad Ramey',
      day: 2,
      thru: null,
    });
  });

  it('parses finished golfer', () => {
    const finished = midroundGolfers.find((g) => g.golfer === 'Ben Griffin');
    expect(finished).toEqual({
      scores: [-5, -1, 0, 0],
      golfer: 'Ben Griffin',
      day: 2,
      thru: 18,
    });
  });

  it('parses midround golfer', () => {
    const finished = midroundGolfers.find((g) => g.golfer === 'Wyndham Clark');
    expect(finished).toEqual({
      scores: [-3, -1, 0, 0],
      golfer: 'Wyndham Clark',
      day: 2,
      thru: 13,
    });
  });

  it('parses current day', () => {
    const minDay = Math.min(...midroundGolfers.map((g) => g.day));
    const maxDay = Math.max(...midroundGolfers.map((g) => g.day));
    expect(minDay).toEqual(2);
    expect(maxDay).toEqual(2);
  });
});
