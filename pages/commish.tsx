import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { GetServerSideProps, NextPage } from 'next';
import { useMemo, useState } from 'react';
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
import {
  useAllUsers,
  useCurrentUser,
  UserMapping,
  userUserMappingsMutationCommishOnly,
  useUserMappingsCommishOnly,
} from '../lib/data/users';
import DraftHistory from '../lib/legacy/js/components/DraftHistory';
import GolfDraftPanel from '../lib/legacy/js/components/GolfDraftPanel';
import Loading from '../lib/Loading';
import { GDUser } from '../lib/models';
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
  const sortedAllUsers = useMemo(() => {
    if (!allUsers) {
      return [];
    }
    return Object.values(allUsers).sort((a, b) => a.name.localeCompare(b.name));
  }, [allUsers]);

  const { data: user } = useCurrentUser();
  const { data: pickListUsers } = usePickListUsers();

  const { data: userMappings } = useUserMappingsCommishOnly();

  if (tourney && user && !tourney.commissioners?.find(({ userId }) => userId === user.id)) {
    return (
      <p>
        {`You are not a commisioner for tourney:`} <b>{tourney.name}</b>
      </p>
    );
  }

  if (
    !user ||
    !tourney ||
    !draftSettings ||
    !pickListUsers ||
    !autoPickUsers ||
    !allUsers ||
    !draftPicks ||
    !userMappings
  ) {
    return <Loading />;
  }

  const pendingUserMappings = userMappings.filter((m) => !m.userId);

  const lastPickIndex = draftPicks.findIndex(isPendingDraftPick);
  return (
    <>
      {pendingUserMappings.length > 0 && (
        <GolfDraftPanel heading={'Pending users'}>
          <p>
            These users signed up via email but their email has not been matched to their user yet. Match these ASAP.
          </p>
          <ul>
            {pendingUserMappings.map((m) => (
              <li key={m.profileId} className="list-unstyled">
                <UserMappingEntry userMapping={m} sortedUsers={sortedAllUsers} />
              </li>
            ))}
          </ul>
        </GolfDraftPanel>
      )}
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
          {sortedAllUsers.map((u) => {
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

const UserMappingEntry = ({ userMapping, sortedUsers }: { userMapping: UserMapping; sortedUsers: GDUser[] }) => {
  const userMappingsMutation = userUserMappingsMutationCommishOnly();
  const inputId = `user-mapping-${userMapping.profileId}`;

  return (
    <div className="form-check">
      <select
        id={inputId}
        className="form-input"
        disabled={userMappingsMutation.isLoading}
        value={userMapping.userId ?? undefined}
        onChange={(ev) => {
          userMappingsMutation.mutate({
            userId: ev.target.value !== undefined ? +ev.target.value : undefined,
            profileId: userMapping.profileId,
          });
        }}
      >
        <option value={undefined}>Select user</option>
        {sortedUsers.map((u) => {
          return (
            <option key={u.id} value={u.id}>
              {u.name} ({u.username})
            </option>
          );
        })}
      </select>
      <label className="form-check-label" htmlFor={inputId}>
        {userMapping.email}
      </label>
    </div>
  );
};

export const getServerSideProps = withAuth(async (props) => {
  return { props };
});

export default CommishPage;
