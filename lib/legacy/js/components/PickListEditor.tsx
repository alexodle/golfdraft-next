import { isNumber, sortBy } from 'lodash';
import React, { useMemo, useState } from 'react';
import { useRemainingGolfers } from '../../../data/draft';
import { useGolfers } from '../../../data/golfers';
import { usePickList, usePickListUpdater } from '../../../data/pickList';
import Loading from '../../../Loading';
import GolferLogic from '../logic/GolferLogic';
import FreeTextPickListEditor from './FreeTextPickListEditor';

export const PickListEditor: React.FC<{ height?: string; preDraftMode?: boolean; }> = ({ height, preDraftMode = false }) => {
  const { data: syncedPickList, isLoading } = usePickList();
  const pickListUpdater = usePickListUpdater();

  const { data: { getGolfer } = {} } = useGolfers();

  const remainingGolfers = useRemainingGolfers();
  const remainingGolfersByWgr = useMemo(() => {
    return sortBy(Object.values(remainingGolfers ?? {}), (g => g.wgr ?? Infinity), (g => g.name)).map(g => g.id);
  }, [remainingGolfers]);

  const [pendingPickList, setPendingPickList] = useState<number[] | null>(null);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [draggingHoverIndex, setDraggingHoverIndex] = useState<number | null>(null);
  const [isFreeTextMode, setIsFreeTextMode] = useState<boolean>(false);

  if (isLoading || !pickListUpdater || !getGolfer) {
    return <Loading />;
  }

  if (isFreeTextMode || (preDraftMode && !syncedPickList?.length)) {
    return (
      <FreeTextPickListEditor
        onCancel={() => setIsFreeTextMode(false)}
      />
    );
  }

  const getDisplayPickList = (): number[] => {
    let displayPickList = pendingPickList ?? syncedPickList;
    if (!preDraftMode) {
      displayPickList = displayPickList ?? remainingGolfersByWgr;
    }
    return displayPickList ?? [];
  }
  const displayPickListOrig = getDisplayPickList();

  const newOrder = (fromIndex: number, toIndex: number): number[] => {
    const movingGolfer = displayPickListOrig[fromIndex];
    const copy = [...displayPickListOrig];

    copy.splice(fromIndex, 1);
    copy.splice(toIndex, 0, movingGolfer);

    return copy;
  }

  const move = (fromIndex: number, amount: number) => {
    setPendingPickList(newOrder(fromIndex, fromIndex + amount));
  }

  const unsavedChanges = !!pendingPickList?.length;
  const draggingGolferId = isNumber(draggingIndex) ? displayPickListOrig[draggingIndex] : null;

  let displayPickList = displayPickListOrig;
  if (draggingHoverIndex !== null && draggingIndex !== null) {
    displayPickList = newOrder(draggingIndex, draggingHoverIndex);
  }

  return (
    <section>

      <div className="row" style={{marginBottom: "1em"}}>
        <div className="col-md-12">
          {preDraftMode && (
            <span>
              <button
                className="btn btn-default"
                disabled={unsavedChanges}
                type="button"
                onClick={() => {
                  setPendingPickList(null);
                  setIsFreeTextMode(true);
                }}
              >Paste list</button>
            </span>
          )}
          <span className="pull-right">
            <button
              className="btn btn-default"
              disabled={!unsavedChanges}
              type="button"
              onClick={() => {
                setPendingPickList(null);
              }}
            >Reset</button>
            <span> </span>
            <button
              className="btn btn-default btn-primary"
              disabled={!unsavedChanges}
              type="button"
              onClick={async () => {
                if (!pendingPickList || !pickListUpdater) {
                  return;
                }
                await pickListUpdater.mutate({ pickList: pendingPickList });
                setPendingPickList(null);
              }}
            >Save</button>
          </span>
          {!unsavedChanges ? null : (
            <p><small>* Unsaved changes</small></p>
          )}
        </div>
      </div>
      <div className="row" style={{
        height: height || "100%",
        overflowY: "scroll"
      }}>
        <div className="col-md-12">
          <table className="table table-condensed table-striped">
            <thead></thead>
            <tbody
              onDragEnd={() => {
                setDraggingIndex(null);
                setDraggingHoverIndex(null);
                if (draggingIndex !== null && draggingHoverIndex !== null) {
                  setPendingPickList(newOrder(draggingIndex, draggingHoverIndex));
                }
              }}
            >
              {displayPickList.map((gid, i) => {
                const g = getGolfer(gid);
                return (
                  <tr
                    key={gid}
                    className={!draggingGolferId || draggingGolferId !== g.id ? "" : "info"}
                  >
                    <td
                      draggable
                      onDragStart={() => {
                        setDraggingIndex(i)
                      }}
                      onDragOver={() => {
                        setDraggingHoverIndex(i);
                      }}
                    >
                      <span className="hidden-xs">
                        <span className="hidden-xs glyphicon glyphicon-menu-hamburger text-muted" />
                        &nbsp;&nbsp;{i+1}.&nbsp;&nbsp;{GolferLogic.renderGolfer(g)}
                      </span>

                      <span className="visible-xs">
                        <ArrowLink arrowClass='glyphicon-arrow-up' onClick={() => move(i, -1)} isDisabled={i === 0} />
                        <span>&nbsp;</span>
                        <ArrowLink arrowClass='glyphicon-arrow-down' onClick={() => move(i, 1)} isDisabled={i === displayPickList.length - 1} />
                        &nbsp;&nbsp;{i+1}.&nbsp;&nbsp;{GolferLogic.renderGolfer(g)}
                      </span>

                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

const ArrowLink: React.FC<{
  isDisabled: boolean;
  arrowClass: string;
  onClick: () => void;
}> = ({
  isDisabled,
  arrowClass,
  onClick
}) => {
  if (isDisabled) {
    return (<span className={"text-muted glyphicon " + arrowClass} />);
  }
  return (
    <a href="#" onClick={(ev) => {
      ev.preventDefault();
      onClick();
    }}>
      <span className={"glyphicon " + arrowClass} />
    </a>
  );
}
