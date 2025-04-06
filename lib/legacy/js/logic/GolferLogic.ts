import { Golfer } from '../../../models';
import constants from '../../common/constants';

const UNKNOWN_WGR = constants.UNKNOWN_WGR;

export default class GolferLogic {
  static renderGolfer(g: Golfer, { excludeWgr = false }: { excludeWgr?: boolean; } = {}): string {
    const wgrDisplay = excludeWgr || !g.wgr || g.wgr === UNKNOWN_WGR ? '' : ' (WGR: ' + g.wgr + ')';
    const invalidDisplay = g.invalid ? '[WD] ' : '';
    return invalidDisplay + g.name + wgrDisplay;
  }
}
