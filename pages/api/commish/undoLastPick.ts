import {
  supabaseServerClient,
  withApiAuth
} from '@supabase/auth-helpers-nextjs';
import { getActiveTourneyId } from '../../../lib/data/appState';
import { undoLastPick } from '../../../lib/data/draft';
import { getTourney } from '../../../lib/data/tourney';
import { getCurrentUserServer } from '../../../lib/data/users';
import { adminSupabase } from '../../../lib/supabase';

export type UndoLastPickRequest = { tourneyId: number; }

export default withApiAuth(async function makePickApi(req, res) {
  if (req.method !== 'POST') {
    return res.status(404).end();
  }
  
  const supabase = supabaseServerClient({ req, res });
  const tourney = await getTourney(await getActiveTourneyId(supabase), supabase);

  const currentUser = await getCurrentUserServer({ req, res });
  if (currentUser === 'pending' || !tourney.commissioners?.find(({ userId }) => userId === currentUser.id)) {
    return res.status(401).json({ reason: 'User is not a commissioner' });
  }

  const undoLastPickReq = req.body as UndoLastPickRequest;
  const [isValid, issues] = validateUndoLastPickRequest(undoLastPickReq);
  if (!isValid) {
    res.status(400).json({ issues });
    return;
  }

  try {
    await undoLastPick(undoLastPickReq.tourneyId, adminSupabase());
  } catch (e) {
    res.status(500).json({ message: e instanceof Error ? e.message : 'unknown' });
  }

  res.status(200).end();
});

const undoLastPickValidations: [(dp: Partial<UndoLastPickRequest>) => boolean, string][] = [
  [(dp) => dp !== undefined && dp !== null, 'null request'],
  [(dp) => typeof dp.tourneyId === 'number', 'invalid tourney id'],
];

function validateUndoLastPickRequest(dp: UndoLastPickRequest): [boolean, string[]] {
  const issues = undoLastPickValidations.filter(([v]) => !v(dp)).map(([, issue]) => issue);
  return [issues.length === 0, issues];
}
