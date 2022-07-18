import Link from 'next/link';
import React, { useState } from 'react';
import { useCurrentPick, useDraftPicks } from '../../../data/draft';
import { useCurrentTourney } from '../../../data/tourney';
import { useCurrentUser } from '../../../data/users';
import Loading from '../../../Loading';
import Assets from '../constants/Assets';
import AppPausedStatus from './AppPausedStatus';
import DraftChooser from './DraftChooser';
import DraftHistory from './DraftHistory';
import DraftPickOrderView from './DraftPickOrderView';
import DraftStatus from './DraftStatus';
import GolfDraftPanel from './GolfDraftPanel';

let myTurnSound: HTMLAudioElement | undefined = undefined;
let pickMadeSound: HTMLAudioElement | undefined = undefined;
try {
  myTurnSound = new Audio(Assets.MY_TURN_SOUND);
  pickMadeSound = new Audio(Assets.PICK_MADE_SOUND);
} catch (e) {
  // nodejs
}

export const DraftApp: React.FC = () => {
  const { data: tourney } = useCurrentTourney();
  const currentUser = useCurrentUser();

  const { data: draftPicks } = useDraftPicks();
  const currentPick = useCurrentPick();

  const [pickingForUsers, setPickingForUsers] = useState(new Set<number>());
  const [selectedUserId, setSelectedUserId] = useState<number | undefined>();

  if (!tourney || !draftPicks || !currentPick || !currentUser) {
    return <Loading />;
  }
  
  if (!tourney.draftHasStarted) {
    return <PreDraft />;
  }

  if (currentPick === 'none') {
    return <PostDraft />;
  }

  const isMyDraftPick = currentPick.userId === currentUser.id || pickingForUsers.has(currentPick.userId);

  return (
    <section className={'draft ' + (tourney.isDraftPaused ? 'draft-paused' : 'draft-active')}>
      {tourney.isDraftPaused ? <section className='app-paused-section'><AppPausedStatus /></section> : (
        <React.Fragment>
          <section className='chooser-section'>
            {!isMyDraftPick ? (
              <GolfDraftPanel heading='Draft Status'>
                <DraftStatus currentPick={currentPick} onDraftForUser={() => {
                  setPickingForUsers((curr) => new Set(curr).add(currentPick.userId))
                }} />
              </GolfDraftPanel>
            ) : (
                <DraftChooser
                  currentPick={currentPick}
                  onStopDraftingForUser={() => {
                    setPickingForUsers(curr => new Set([...curr].filter(uid => uid !== currentPick.userId)))
                  }}
                />
              )}
          </section>

          <section className='draft-clock-section'>
            <GolfDraftPanel heading={'Draft Clock'}>
              {/* <DraftClock
                draftPicks={draftPicks}
                isMyPick={isMyDraftPick}
                allowClock={allowClock}
              /> */}
              {<p>hihi TODO: Clock</p>}
            </GolfDraftPanel>
          </section>

        </React.Fragment>
      )}

      <section className='draft-order-section'>
        <GolfDraftPanel heading='Draft Order'>
          <DraftPickOrderView pickingForUsers={pickingForUsers} onUserSelected={(pid) => setSelectedUserId(pid)} />
        </GolfDraftPanel>
      </section>

      <section className='pick-list-section'>
        <GolfDraftPanel heading='Pick List'>
          {/* <PickListEditor
            golfersRemaining={golfersRemaining}
            syncedPickList={syncedPickListForEditor}
            pendingPickList={pendingPickListForEditor}
            height='29em'
          /> */}
          {<p>hihi TODO: PickListEditor</p>}
        </GolfDraftPanel>
      </section>


      <section className='chatroom-section'>
        <GolfDraftPanel heading='Chat Room'>
          {/* <ChatRoom
            currentUser={this.props.currentUser}
            messages={this.props.chatMessages}
            activeUsers={this.props.activeUsers}
            enabled={this.props.isViewingActiveTourney}
          /> */}
          {<p>hihi TODO: ChatRoom</p>}
        </GolfDraftPanel>
      </section>

      <section className='draft-history-section'>
        <DraftHistory selectedUserId={selectedUserId} />
      </section>

    </section>
  );
}

const PostDraft: React.FC = () => {
  const { data: tourney } = useCurrentTourney();

  if (!tourney) {
    return <Loading />;
  }

  return (
    <section>
      <div className='jumbotron'>
        <h1>The draft is over!</h1>
        <p><Link href={`/${tourney.id}`}>Check out the live leaderboard</Link></p>
      </div>

      <section>
        <GolfDraftPanel heading='Chat Room'>
          {/* <ChatRoom
            currentUser={this.props.currentUser}
            messages={this.props.chatMessages}
            activeUsers={this.props.activeUsers}
            enabled={this.props.isViewingActiveTourney}
          /> */}
          {<p>hihi TODO: ChatRoom</p>}
        </GolfDraftPanel>
      </section>

      <section>
        <DraftHistory />
      </section>

    </section>
  );
}

const PreDraft: React.FC = () => {
  return (
    <section>

      <div className='jumbotron'>
        <h1>Draft not started.</h1>
      </div>

      <section>
        <a id='InlinePickListEditor' />
        <GolfDraftPanel heading='Pick List Editor'>
          {/* <PickListEditor
            golfersRemaining={golfersRemaining}
            syncedPickList={syncedPickListForEditor}
            pendingPickList={pendingPickListForEditor}
            height='29em'
          /> */}
          {<p>hihi TODO: PickListEditor</p>}
        </GolfDraftPanel>
      </section>

      <section>
        <GolfDraftPanel heading='Chat Room'>
          {/* <ChatRoom
            currentUser={this.props.currentUser}
            messages={this.props.chatMessages}
            activeUsers={this.props.activeUsers}
            enabled={this.props.isViewingActiveTourney}
          /> */}
          {<p>hihi TODO: ChatRoom</p>}
        </GolfDraftPanel>
      </section>

    </section >
  );
}

export default DraftApp;
