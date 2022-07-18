import { CompletedDraftPick, DraftPick, Golfer } from '../../../models';

export interface DraftProps {
  pickOrder: DraftPick[];
  isMyDraftPick: boolean;
  currentPick: DraftPick | null;
  draftPicks: CompletedDraftPick[];
  pickingForUsers: Set<number>;
  syncedPickList: number[] | null;
  pendingPickList: number[] | null;
  golfersRemaining: Record<number, Golfer>
}
