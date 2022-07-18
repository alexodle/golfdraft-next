import {
  withApiAuth
} from '@supabase/auth-helpers-nextjs';
import { makePick } from '../../lib/data/draft';
import { getCurrentUserServer } from '../../lib/data/users';
import { CompletedDraftPick } from '../../lib/models';
import { adminSupabase } from '../../lib/supabase';

export type MakePickApiRequest =  Omit<CompletedDraftPick, 'timestampEpochMillis' | 'pickedByUserId'>;

export default withApiAuth(async function makePickApi(req, res) {
  if (req.method !== 'POST') {
    return res.status(404).end();
  }

  const currentUser = await getCurrentUserServer({ req, res });
  if (currentUser === 'pending') {
    return res.status(401).json({ reason: 'User is pending' });
  }

  const draftPick = req.body as MakePickApiRequest;
  const [isValid, issues] = validateDraftPick(draftPick);
  if (!isValid) {
    res.status(400).json({ issues });
    return;
  }
  
  const pick: CompletedDraftPick = { ...draftPick, pickedByUserId: currentUser.id, timestampEpochMillis: Date.now() };
  try {
    await makePick(pick, adminSupabase());
    res.json(pick);
  } catch (e) {
    res.status(500).json({ reason: (e instanceof Error && e.message) ?? 'unknown' });
  }
});

const draftPickValidations: [(dp: Partial<MakePickApiRequest>) => boolean, string][] = [
  [(dp) => dp !== undefined && dp !== null, 'null draft pick'],
  [(dp) => typeof dp.userId === 'number', 'invalid user id'],
  [(dp) => typeof dp.tourneyId === 'number', 'invalid tourney id'],
  [(dp) => typeof dp.clientTimestampEpochMillis === 'number' && !isNaN(new Date(dp.clientTimestampEpochMillis).getTime()), 'invalid clientTimestampEpochMillis'],
  [(dp) =>typeof dp.pickNumber === 'number', 'invalid pickNumber'],
  [(dp) =>typeof dp.golferId === 'number', 'invalid golferId'],
];

function validateDraftPick(dp: MakePickApiRequest): [boolean, string[]] {
  const issues = draftPickValidations.filter(([v]) => !v(dp)).map(([,issue]) => issue);
  return [issues.length === 0, issues];
}
