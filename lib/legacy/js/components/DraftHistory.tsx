import React from 'react';
import { isCompletedDraftPick, useDraftPicks } from '../../../data/draft';
import { useGolfers } from '../../../data/golfers';
import { useAllUsers } from '../../../data/users';
import Loading from '../../../Loading';
import GolferLogic from '../logic/GolferLogic';
import { GolfDraftPanel } from './GolfDraftPanel';

const DraftHistory: React.FC<{ selectedUserId?: number; onSelectionChange?: (pid?: number) => void }> = ({
  selectedUserId,
  onSelectionChange,
}) => {
  const { data: allDraftPicks } = useDraftPicks();
  const { data: allUsers } = useAllUsers();
  const { data: { getGolfer } = {} } = useGolfers();

  if (!allDraftPicks || !allUsers || !getGolfer) {
    return <Loading />;
  }

  let draftPicks = allDraftPicks.filter(isCompletedDraftPick).reverse();
  let heading: JSX.Element | string = 'Draft History';

  if (selectedUserId) {
    draftPicks = draftPicks.filter((dp) => dp.userId === selectedUserId);
    heading = (
      <span>
        <a href="#DraftHistory" onClick={() => onSelectionChange?.(undefined)}>
          Draft History
        </a>
        <span> - </span>
        {allUsers[selectedUserId].name}
      </span>
    );
  }

  return (
    <div>
      <a id="DraftHistory" />
      <GolfDraftPanel heading={heading}>
        {!selectedUserId ? null : (
          <p>
            <small>
              <b>Tip:</b> {'click "Draft History" (above) to view all picks again'}
            </small>
          </p>
        )}
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Pool User</th>
              <th>Golfer</th>
            </tr>
          </thead>
          <tbody>
            {draftPicks.map((p) => {
              const userName = allUsers[p.userId].name;
              return (
                <tr key={p.pickNumber}>
                  <td>{p.pickNumber}</td>
                  <td>
                    {selectedUserId ? (
                      userName
                    ) : (
                      <a href="#DraftHistory" onClick={() => onSelectionChange?.(p.userId)}>
                        {userName}
                      </a>
                    )}
                  </td>
                  <td>{GolferLogic.renderGolfer(getGolfer(p.golferId))}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </GolfDraftPanel>
    </div>
  );
};

export default DraftHistory;
