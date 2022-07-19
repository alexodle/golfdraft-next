import { isEmpty, keyBy, uniq } from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import { useGolfers } from '../../../data/golfers';
import { usePickListUpdater } from '../../../data/pickList';
import Loading from '../../../Loading';
import { Golfer } from '../../../models';
import { levenshteinAll } from '../../server/levenshteinDistance';
import GolferLogic from '../logic/GolferLogic';

const TEXTAREA_PLACEHOLDER = "Sergio Garcia\nPhil Mickelson\nTiger Woods\nDustin Johnson\nJason Day\n...";

export const FreeTextPickListEditor: React.FC<{
  onCancel: () => void;
}> = ({
  onCancel
}) => {
  const [matches, setMatches] = useState<Match[] | undefined>();
  const [text, setText] = useState<string>('');
  const pickListUpdater = usePickListUpdater();
  const { data: { golfers: allGolfers, getGolfer } = {} } = useGolfers();

  useEffect(() => {
    if (pickListUpdater?.isSuccess) {
      onCancel();
    }
  }, [onCancel, pickListUpdater?.isSuccess]);

  if (!pickListUpdater || !allGolfers) {
    return <Loading />;
  }

  const saveFreeText = () => {
    const names = cleanedGolfers(text);
    const matches = matchNames(names, allGolfers);

    if (matches.every(isExactMatch)) {
      setMatches(undefined);

      const pickList = matches.map(m => m.match.id);
      pickListUpdater.mutate({ pickList });
      return;
    }

    setMatches(matches);
  }

  if (matches) {
    return (
      <SuggestionSelectors
        matches={matches}
        onSave={(pickList) => {
          setMatches(undefined);
          pickListUpdater.mutate({ pickList });
        }}
        onCancel={onCancel}
        isDisabled={pickListUpdater.isLoading}
      />
    );
  }
  
  return (
    <div>
      <div className='text-right'>
        <span>
          <button
            className='btn btn-default'
            type='button'
            onClick={onCancel}
            disabled={pickListUpdater.isLoading}
          >Cancel</button>{" "}
        </span>
        <button
          className='btn btn-primary'
          type='button'
          disabled={pickListUpdater.isLoading || !text.trim().length}
          onClick={(ev) => {
            ev.preventDefault(); 
            saveFreeText();
          }}
        >Save</button>
      </div>
      <p>One golfer per line:</p>
      <textarea
        className='form-control'
        placeholder={TEXTAREA_PLACEHOLDER}
        disabled={pickListUpdater.isLoading}
        style={{ width: '100%', height: '30em', resize: 'vertical' }}
        onChange={(ev) => setText(ev.target.value)}
        value={text}
      />
    </div>
  );
}

export default FreeTextPickListEditor;

const SuggestionSelector: React.FC<{ 
  match: Match;
  selection?: Golfer;
  onSelectionChange: (g: Golfer) => void;
}> = ({
  match,
  selection,
  onSelectionChange
}) => {
  const [forceViewAll, setForceViewAll] = useState(false);
  const { data: { golfers: allGolfers, getGolfer } = {} } = useGolfers();

  const alphabeticalGolfers = useMemo(() => {
    return allGolfers?.sort() ?? [];
  }, [allGolfers]);

  const isViewingAll = forceViewAll || match.type === 'no_match';
  const options = isViewingAll ? alphabeticalGolfers : (match.type === 'suggestion' ? match.suggestions : undefined);
  if (options === undefined) {
    throw new Error('unexpected');
  }

  useEffect(() => {
    if (!selection && options.length) {
      onSelectionChange(options[0]);
    }
  });

  if (!selection) {
    // Hack to wait for caller to set our selection
    return null;
  }
  if (!allGolfers || !getGolfer) {
    return <Loading />;
  }

  return (
    <div key={match.given} className='panel panel-default'>
      <div className='panel-body'>

        <div className='row'>
          <div className='col-md-2'>
            <p><em>You entered:</em></p>
          </div>
          <div className='col-md-10'>
            <b>{match.given}</b>
          </div>
        </div>

        {!isViewingAll && (
          <section>
            <div className='row'>
              <div className='col-md-2'>
                <p><em>Did you mean:</em></p>
              </div>
              <div className='col-md-10'>
                <b>{GolferLogic.renderGolfer(selection)}</b>
              </div>
            </div>
            <p>
              <a 
                href="#" 
                onClick={(ev) => {
                  ev.preventDefault();
                  onSelectionChange(alphabeticalGolfers[0]);
                  setForceViewAll(true);
                }}
              >Nope</a></p>
          </section>
        )}

        {isViewingAll && (
          <section>
            {match.type === 'no_match' && (
              <p className='text-danger'><em>Could not find a potential match.. Please select golfer from list:</em></p>
            )}
            <select
              className='form-control'
              value={selection.id}
              onChange={(ev) => {
                onSelectionChange(getGolfer(+ev.target.value));
              }}
            >
              {alphabeticalGolfers.map(g => (
                <option key={g.id} value={g.id}>{GolferLogic.renderGolfer(g)}</option>
              ))}
            </select>
          </section>
        )}
      </div>
    </div>
  );
}

const SuggestionSelectors: React.FC<{
  matches: Match[];
  onSave: (pickList: number[]) => void;
  onCancel?: () => void;
  isDisabled: boolean;
}> = ({
  matches,
  onSave,
  onCancel,
  isDisabled
}) => {
  const [selections, setSelections] = useState<Record<number, Golfer>>([]);

  const pickList = useMemo(() => {
    const pl: number[] = [];
    for (let i = 0; i < matches.length; i++) {
      const match = matches[i];
      const pick = isExactMatch(match) ? match.match.id : selections[i]?.id;
      if (!pick) {
        return undefined;
      }
      pl.push(pick);
    }
    return pl;
  }, [matches, selections]);

  return (
    <div>
      <div className='text-right' style={{ marginBottom: '1em' }}>
        <button
          className='btn btn-default'
          type='button'
          onClick={onCancel}
          disabled={isDisabled}
        >Back</button>
      </div>
      <div className='alert alert-warning'>Could not find an exact name match for all golfers. Please verify the following matches are correct:</div>
      {matches.map((m, i) => {
        if (isExactMatch(m)) {
          return null;
        }
        return (
          <SuggestionSelector
            key={i}
            match={m}
            selection={selections[i]}
            onSelectionChange={(g) => {
              setSelections((curr) => ({ ...curr, [i]: g }))
            }}
          />
        );
      })}
      <div className='text-right'>
        <button
          className='btn btn-default'
          type='button'
          onClick={onCancel}
          disabled={isDisabled}
        >Back</button>
        <span> </span>
        <button
          className='btn btn-primary'
          type='button'
          disabled={isDisabled || !pickList?.length}
          onClick={(ev) => {
            ev.preventDefault();
            if (pickList) {
              onSave(pickList);
            }
          }}
        >Save</button>
      </div>
    </div>
  );
}

function cleanedGolfers(text: string) {
  return uniq(text
    .split('\n')
    .map(l => l.trim())
    .filter(g => !isEmpty(g)));
}

const MIN_COEFF = 0.5;

type NoMatch = {
  type: 'no_match';
  given: string;
} 

type MatchSuggestion = {
  type: 'suggestion';
  given: string;
  suggestions: Golfer[]; 
}

type ExactMatch = {
  type: 'match';
  given: string;
  match: Golfer;
}

type Match = NoMatch | MatchSuggestion | ExactMatch;

function isExactMatch(m: Match): m is ExactMatch {
  return m.type === 'match';
}

/** Attempts to match golfers based on name */
function matchNames(namesList: string[], golfers: Golfer[]): Match[] {
  const golfersByLcName = keyBy(golfers, g => g.name.toLowerCase());

  return namesList.map(name => {
    const exact = golfersByLcName[name.toLowerCase()];
    if (exact) {
      return { type: 'match', given: name, match: exact };
    }
  
    const inOrder = levenshteinAll(name, golfers, g => g.name);
    if (inOrder[0]?.coeff ?? 0 > MIN_COEFF) {
      return { type: 'suggestion', given: name, suggestions: inOrder.map(r => r.target) };
    }

    return { type: 'no_match', given: name };
  });
}
