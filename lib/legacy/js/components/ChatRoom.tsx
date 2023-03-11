import { countBy } from 'lodash';
import moment from 'moment';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useActiveUsers } from '../../../ctx/ActiveUsersCtx';
import { useChatMessageMutation, useChatMessages } from '../../../data/chat';
import { useAllUsers } from '../../../data/users';
import Loading from '../../../Loading';
import { GDUser } from '../../../models';

const BOT_NAME = 'DraftBot';

export const ChatRoom = ({ disabled = false }: { disabled?: boolean }): React.ReactElement | null => {
  const messages = useChatMessages();
  const { activeUsers } = useActiveUsers();
  const { data: allUsers } = useAllUsers();

  const [ready, scrollPaneRef] = useScrollToBottom();

  if (!allUsers) {
    return <Loading />;
  }

  if (disabled) {
    return (
      <div className="row">
        <div className="col-md-12">
          <div
            className="panel panel-default chat-panel"
            style={{ visibility: !ready ? 'hidden' : undefined }}
            ref={scrollPaneRef}
          >
            <div className="panel-body">
              <ChatRoomBody />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const activeUserShortNames = asShortNames([...activeUsers].map((uid) => allUsers[uid]));

  return (
    <div className="chat-room-container">
      <div className="col-md-9">
        <div
          className="panel panel-default chat-panel"
          style={{ visibility: !ready ? 'hidden' : undefined }}
          ref={scrollPaneRef}
        >
          <div className="panel-body">
            <ChatRoomBody />
          </div>
        </div>
        {!messages ? null : <ChatRoomInput />}
      </div>
      <div className="col-md-3">
        <div className="panel panel-default">
          <div className="panel-body">
            <b>Online:</b>
            <ul className="list-unstyled">
              {activeUserShortNames.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

/** Returns a list of names using firstName, adding last initial if duplicates are found, and then adding the full last name if duplicates still exist */
const asShortNames = (users: GDUser[]): string[] => {
  const firstLast = users.map((u) => {
    return u.name.split(' ');
  });

  const byFirst = countBy(firstLast, ([first]) => first);
  const byFirstLastInitial = countBy(firstLast, ([first, last]) => `${first} ${last[0]}`);

  const shortNames = firstLast.map(([first, last]) => {
    if (byFirst[first] < 2) {
      return first;
    }

    const firstLastInitial = `${first} ${last[0]}`;
    if (byFirstLastInitial[firstLastInitial] < 2) {
      return firstLastInitial;
    }

    return `${first} ${last}`;
  });

  return shortNames.sort();
};

const ChatRoomBody = (): React.ReactElement => {
  const { data: messages } = useChatMessages();
  const { data: users } = useAllUsers();

  if (!messages || !users) {
    return <Loading />;
  }

  if (messages.length === 0) {
    return <span>No messages. Be the first!</span>;
  }

  return (
    <div>
      <dl className="chat-list dl-horizontal">
        {messages.map((message, i) => {
          const displayName = message.isBot ? BOT_NAME : users[message.userId].name;
          const className = message.isBot ? 'bot-message' : '';
          return (
            <React.Fragment key={i}>
              <dt className={className}>
                {displayName}
                <span className="message-date"> ({moment(message.createdAt).format('l LT')})</span>:
              </dt>
              <dd className={className}>{message.message}</dd>
            </React.Fragment>
          );
        })}
      </dl>
    </div>
  );
};

const ChatRoomInput = (): React.ReactElement => {
  const [text, setText] = useState('');
  const trimmedText = text.trim();
  const chatMessageMutation = useChatMessageMutation();
  return (
    <div>
      <form
        onSubmit={async (ev) => {
          ev.preventDefault();
          if (trimmedText.length === 0) {
            return;
          }
          try {
            await chatMessageMutation.mutateAsync(trimmedText);
            setText('');
          } catch (e) {
            // TODO failed message
          }
        }}
      >
        <div className="form-group chat-input-form">
          <span>
            <input type="text" className="form-control" value={text} onChange={(ev) => setText(ev.target.value)} />
          </span>
          <span>
            <button
              type="submit"
              className="btn btn-default"
              disabled={trimmedText.length === 0 && !chatMessageMutation.isLoading}
            >
              Send
            </button>
          </span>
        </div>
      </form>
    </div>
  );
};

const useScrollToBottom = () => {
  const [ready, setReady] = useState(false);
  const scrollPaneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scrollPaneRef.current || ready) {
      return;
    }

    setTimeout(() => {
      if (!scrollPaneRef.current || ready) {
        return;
      }

      scrollPaneRef.current.scrollTo(0, scrollPaneRef.current.scrollHeight);
      setReady(true);
    }, 500);
  }, [ready]);

  return [ready, scrollPaneRef] as const;
};

export default ChatRoom;
