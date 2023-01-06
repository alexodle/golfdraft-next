import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { GetServerSideProps, NextPage } from 'next';
import App from '../lib/App';
import { getActiveTourneyId } from '../lib/data/appState';
import {
  isPendingDraftPick,
  useAutoPickUsers,
  useAutoPickUsersMutation,
  useDraftPicks,
  useUndoLastPickMutation,
} from '../lib/data/draft';
import { useDraftSettings, useDraftSettingsMutation } from '../lib/data/draftSettings';
import { usePickListUsers } from '../lib/data/pickList';
import { useCurrentTourney } from '../lib/data/tourney';
import { useAllUsers, useCurrentUser } from '../lib/data/users';
import DraftHistory from '../lib/legacy/js/components/DraftHistory';
import GolfDraftPanel from '../lib/legacy/js/components/GolfDraftPanel';
import Loading from '../lib/Loading';
import { adminSupabase } from '../lib/supabase';
import { withAuth } from '../lib/util/withAuth';

type CommishPageProps = {
  activeTourneyId: number;
};

const CommishPage: NextPage<CommishPageProps> = ({ activeTourneyId }) => {
  return (
    <App tourneyId={activeTourneyId}>
      <InnerCommish />
    </App>
  );
};

const InnerCommish: React.FC = () => {
  const { data: tourney } = useCurrentTourney();

  const { data: draftSettings } = useDraftSettings();
  const draftSettingsMutation = useDraftSettingsMutation();

  const { data: draftPicks } = useDraftPicks();
  const undoLastPickMutation = useUndoLastPickMutation();

  const { data: autoPickUsers } = useAutoPickUsers();
  const autoPickUsersMutation = useAutoPickUsersMutation();

  const { data: allUsers } = useAllUsers();

  const user = useCurrentUser();
  const { data: pickListUsers } = usePickListUsers();

  if (!user || !tourney || !draftSettings || !pickListUsers || !autoPickUsers || !allUsers || !draftPicks) {
    return <Loading />;
  }

  if (!tourney.commissioners?.find(({ userId }) => userId === user.id)) {
    return (
      <p>
        {`You are not a commisioner for tourney:`} <b>{tourney.name}</b>
      </p>
    );
  }

  const lastPickIndex = draftPicks.findIndex(isPendingDraftPick);
  return (
    <>
      <GolfDraftPanel heading={draftSettings.draftHasStarted ? 'Draft STARTED' : 'Draft NOT STARTED'}>
        <button
          className="btn btn-default"
          disabled={draftSettingsMutation.isLoading}
          onClick={() => {
            draftSettingsMutation.mutate({ ...draftSettings, draftHasStarted: !draftSettings.draftHasStarted });
          }}
        >
          {draftSettings.draftHasStarted ? 'Unstart Draft' : 'Start Draft'}
        </button>
      </GolfDraftPanel>
      <GolfDraftPanel heading={draftSettings.isDraftPaused ? 'Draft PAUSED' : 'Draft NOT PAUSED'}>
        <button
          className="btn btn-default"
          disabled={draftSettingsMutation.isLoading}
          onClick={() => {
            draftSettingsMutation.mutate({ ...draftSettings, isDraftPaused: !draftSettings.isDraftPaused });
          }}
        >
          {draftSettings.isDraftPaused ? 'Unpause Draft' : 'Pause Draft'}
        </button>
      </GolfDraftPanel>
      <GolfDraftPanel heading={'Auto-picks'}>
        <ol>
          {Object.values(allUsers)
            .sort()
            .map((u) => {
              const isAutoPick = autoPickUsers.has(u.id);
              return (
                <li key={u.id} className="list-unstyled">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      id={`auto-pick-${u.id}`}
                      className="form-check-input"
                      disabled={autoPickUsersMutation.isLoading}
                      checked={isAutoPick}
                      onChange={() => autoPickUsersMutation.mutate({ userId: u.id, autoPick: !isAutoPick })}
                    />
                    <label className="form-check-label" htmlFor={`auto-pick-${u.id}`}>
                      {u.name}
                      {pickListUsers.has(u.id) && (
                        <span>
                          {' '}
                          <span className="label label-info info-label">PL</span>
                        </span>
                      )}
                    </label>
                  </div>
                </li>
              );
            })}
        </ol>
      </GolfDraftPanel>
      <GolfDraftPanel heading={'Pick History'}>
        <button
          className="btn btn-default"
          disabled={lastPickIndex < 0 || undoLastPickMutation.isLoading}
          onClick={() => {
            undoLastPickMutation.mutate();
          }}
        >
          {'Undo last pick'}
        </button>
        <DraftHistory />
      </GolfDraftPanel>
    </>
  );
};

export const getServerSideProps = withAuth(async (props) => {
  return { props };
});

export default CommishPage;
