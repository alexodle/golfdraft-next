import cx from 'classnames';
import { sortBy } from 'lodash';
import React, { useMemo, useState } from 'react';
import { useDraftPicker, useRemainingGolfers } from '../../../data/draft';
import { useGolfers } from '../../../data/golfers';
import { usePickList, usePickListUsers } from '../../../data/pickList';
import { useAllUsers, useCurrentUser } from '../../../data/users';
import Loading from '../../../Loading';
import { PendingDraftPick } from '../../../models';
import constants from '../../common/constants';
import * as utils from '../../common/utils';
import GolferLogic from '../logic/GolferLogic';
import GolfDraftPanel from './GolfDraftPanel';

type SortKey = 'pickList' | 'wgr' | 'name';

export const DraftChooser: React.FC<{ currentPick: PendingDraftPick; onStopDraftingForUser: () => void }> = ({
  currentPick,
  onStopDraftingForUser,
}) => {
  const [sortKey, setSortKey] = useState<SortKey>('pickList');
  const [selectedGolferIdState, setSelectedGolferId] = useState<number | undefined>();
  const { pickMutation, autoPickMutation } = useDraftPicker();

  const golfersRemaining = useRemainingGolfers();
  const { data: currentUser } = useCurrentUser();
  const { data: allUsers } = useAllUsers();
  const { data: { golfers: allGolfers, getGolfer } = {} } = useGolfers();

  const { data: pickListUsers } = usePickListUsers();
  const { data: pickList } = usePickList();

  const isProxyPick = currentUser?.id !== currentPick.userId;

  const sortedGolfers = useMemo(() => {
    if (!golfersRemaining || !getGolfer) {
      return undefined;
    }

    if (sortKey === 'pickList' && pickList?.length) {
      if (isProxyPick) {
        // special case, we cannot show the full list if this a proxy pick
        return [];
      } else {
        return pickList.map((gid) => getGolfer(gid));
      }
    }

    return sortBy(golfersRemaining, [sortKey, 'name']);
  }, [sortKey, isProxyPick, pickList, golfersRemaining, getGolfer]);

  if (
    !allUsers ||
    !pickListUsers ||
    !golfersRemaining ||
    !currentUser ||
    pickList === undefined ||
    !allGolfers ||
    !sortedGolfers
  ) {
    return <Loading />;
  }

  const selectedGolferId = selectedGolferIdState ?? sortedGolfers[0]?.id;
  const showPickListOption = isProxyPick || (pickList?.length ?? 0) > 0;

  let header = null;
  if (!isProxyPick) {
    header = <h4>{`It's your turn. Make your pick.`}</h4>;
  } else {
    const userName = allUsers[currentPick.userId].name;
    header = (
      <section>
        <h4>Make a pick for: {userName}</h4>
        <p>
          <a
            href="#"
            onClick={(ev) => {
              ev.preventDefault();
              onStopDraftingForUser();
            }}
          >
            {`Stop making picks for ${userName}`}
          </a>
        </p>
      </section>
    );
  }

  return (
    <GolfDraftPanel heading="Draft Picker">
      {header}

      <div className="btn-group" role="group" aria-label="Sorting choices">
        <label>Make pick by:</label>
        <br />
        {!showPickListOption ? null : (
          <button
            type="button"
            className={cx({
              'btn btn-default': true,
              active: sortKey === 'pickList',
            })}
            onClick={() => setSortKey('pickList')}
          >
            {pickListUsers.has(currentPick.userId)
              ? 'Pick List'
              : `${utils.getOrdinal(constants.ABSENT_PICK_NTH_BEST_WGR)} Best WGR`}
          </button>
        )}
        <button
          type="button"
          className={cx({
            'btn btn-default': true,
            active: sortKey === 'name',
          })}
          onClick={() => setSortKey('name')}
        >
          First Name
        </button>
        <button
          type="button"
          className={cx({
            'btn btn-default': true,
            active: sortKey === 'wgr',
          })}
          onClick={() => setSortKey('wgr')}
        >
          World Golf Ranking
        </button>
      </div>

      <form role="form">
        {isProxyPick && sortKey === 'pickList' ? (
          <div style={{ marginTop: '1em' }}>
            <button
              className="btn btn-default btn-primary"
              disabled={autoPickMutation.isLoading}
              onClick={(ev) => {
                ev.preventDefault();
                autoPickMutation.mutate(currentPick);
              }}
            >
              Pick
            </button>
          </div>
        ) : (
          <div>
            <div className="form-group">
              <label htmlFor="golfersRemaining">Select your golfer:</label>
              <select
                id="golfersRemaining"
                value={selectedGolferId}
                onChange={(ev) => setSelectedGolferId(+ev.target.value)}
                size={10}
                className="form-control"
              >
                {sortedGolfers.map((g) => {
                  return (
                    <option key={g.id} value={g.id}>
                      {GolferLogic.renderGolfer(g)}
                    </option>
                  );
                })}
              </select>
            </div>
            <button
              className="btn btn-default btn-primary"
              disabled={pickMutation.isLoading}
              onClick={async (ev) => {
                ev.preventDefault();
                pickMutation.mutate({
                  pendingDraftPick: currentPick,
                  golferId: selectedGolferId,
                });
              }}
            >
              Pick
            </button>
          </div>
        )}
      </form>
    </GolfDraftPanel>
  );
};

export default DraftChooser;
