export {};

// const BOT_NAME = 'DraftBot';

// const NAME_TAG_RE = /@[a-z]* *[a-z]*$/i;
// const TAG_TO_NAME_RE = /~\[([^\]]+)\]/ig;
// const SPECIFIC_TAG = "~[{{name}}]";

// const ENTER_KEY = 13;
// const DOWN_KEY = 40;
// const UP_KEY = 38;

// let newMessageSound: HTMLAudioElement | undefined = undefined;
// try {
//   newMessageSound = new Audio(Assets.NEW_CHAT_MESSAGE_SOUND);
// } catch (e) {
//   // nodejs
// }

// interface AutoCompleteProps {
//   text: string;
//   allChoices: User[];
//   onChoose: ({ value: string }) => void;
// }

// interface AutoCompleteState {
//   selectedIndex: number;
// }

// class AutoComplete extends React.PureComponent<AutoCompleteProps, AutoCompleteState> {

//   constructor(props) {
//     super(props);
//     this.state = { selectedIndex: 0 };
//   }

//   componentWillUpdate(nextProps, nextState) {
//     const currentIndex = this.state.selectedIndex;
//     const newIndex = nextState.selectedIndex;
//     if (currentIndex !== newIndex) {
//       return;
//     }

//     const oldChoices = this._getChoices();
//     const newChoices = this._getChoices(nextProps);

//     if (
//       isEmpty(oldChoices) ||
//       isEmpty(newChoices) ||
//       !newChoices[currentIndex] ||
//       oldChoices[currentIndex].id !== newChoices[currentIndex].id
//     ) {

//       this.setState({ selectedIndex: 0 });
//     }
//   }

//   render() {
//     const choices = this._getChoices();

//     if (isEmpty(choices)) {
//       return null;
//     }

//     const selection = choices[this.state.selectedIndex].name;
//     return (
//       <form>
//         <select
//           ref='autocomplete'
//           className='form-control'
//           size={3}
//           value={selection}
//           onChange={this._onChange}
//           onClick={this._onClick}
//           onKeyUp={this._onKeyUp}
//         >
//           {choices.map(u => {
//             return (
//               <option key={u.id} value={u.name}>{u.name}</option>
//             );
//           })}
//         </select>
//       </form>
//     );
//   }

//   forceSelect() {
//     const choices = this._getChoices();
//     this.props.onChoose({ value: choices[this.state.selectedIndex].name });
//   }

//   forceDown() {
//     this._move(1);
//   }

//   forceUp() {
//     this._move(-1);
//   }

//   _onChange = (ev) => {
//     this.setState({ selectedIndex: ev.currentTarget.selectedIndex });
//   }

//   _move(n) {
//     const choices = this._getChoices();
//     const currentIndex = this.state.selectedIndex;
//     const newIndex = currentIndex + n;

//     if (newIndex < 0 || newIndex >= choices.length) {
//       return;
//     }

//     this.setState({ selectedIndex: newIndex });
//   }

//   _getChoices(props?: AutoCompleteProps) {
//     props = props || this.props;

//     const text = props.text.toLowerCase();
//     const choices = props.allChoices.filter(u => u.name.toLowerCase().startsWith(text));

//     return choices;
//   }

//   _onClick = (ev) => {
//     this.forceSelect();
//   }

//   _onKeyUp = (ev) => {
//     if (ev.keyCode === ENTER_KEY) {
//       this.forceSelect();
//     }
//   }

// };

// interface ChatRoomInputState {
//   text: string;
//   taggingText?: string;
// }

// class ChatRoomInput extends React.PureComponent<{}, ChatRoomInputState> {

//   constructor(props) {
//     super(props);
//     this.state = { text: '', taggingText: null };
//   }

//   render() {
//     const text = this.state.text;
//     const nameTag = this.state.taggingText;

//     return (
//       <div>
//         <form onSubmit={this._onSend}>
//           <div className='form-group chat-input-form'>
//             <span><input
//               ref='input'
//               className='form-control'
//               value={text}
//               onChange={this._onUpdateText}
//               onKeyUp={this._onKeyUp}
//             /></span>
//             <span><button type='submit' className='btn btn-default'>
//               Send
//             </button></span>
//           </div>
//           {!nameTag ? null : (
//             <AutoComplete
//               ref='nameTagger'
//               allChoices={sortBy(UserStore.getAll(), u => u.name)}
//               text={nameTag[0].substr(1)}
//               onChoose={this._onTag} />
//           )}
//         </form>
//       </div >
//     );
//   }

//   _focus() {
//     (this.refs.input as HTMLInputElement).focus();
//   }

//   _getNameTagger() {
//     return this.refs.nameTagger as AutoComplete;
//   }

//   _onKeyUp = (ev) => {
//     if (this.state.taggingText) {
//       if (ev.keyCode === UP_KEY) {
//         this._getNameTagger().forceUp();
//         ev.preventDefault();
//       } else if (ev.keyCode === DOWN_KEY) {
//         this._getNameTagger().forceDown();
//         ev.preventDefault();
//       }
//     }
//   }

//   _onUpdateText = (ev) => {
//     const newText = ev.target.value;
//     this.setState({
//       text: newText,
//       taggingText: newText.match(NAME_TAG_RE)
//     });
//   }

//   _onTag = (ev) => {
//     const newText = this.state.text.replace(NAME_TAG_RE, "~[" + ev.value + "] ");
//     this.setState({ text: newText, taggingText: null });

//     this._focus();
//   }

//   _onSend = (ev) => {
//     ev.preventDefault();

//     if (this.state.taggingText) {
//       this._getNameTagger().forceSelect();
//       return;
//     }

//     const text = this.state.text;
//     if (isEmpty(text)) return;

//     ChatActions.createMessage(text);
//     this.setState({ text: '', taggingText: null });

//     this._focus();
//   }

// };

// interface MessageProps {
//   text: string;
// }

// class Message extends React.PureComponent<MessageProps, {}> {

//   render() {
//     // Escape html BEFORE adding tags
//     const text = escape(this.props.text);

//     // Add tag html
//     const htmlStr = text.replace(TAG_TO_NAME_RE, function (match, name) {
//       const user = UserStore.getUserByName(name);
//       if (!user) {
//         return match;
//       } else {
//         return '<span class="user-tag label label-default">' + user.name + '</span>';
//       }
//     });

//     return (
//       <span dangerouslySetInnerHTML={{ __html: htmlStr }} />
//     );
//   }

// };

// const DEFAULT_PAGE_SIZE = 25;

// export interface ChatRoomProps {
//   enabled: boolean;
//   messages: ChatMessage[];
//   activeUsers: Indexed<string>;
//   currentUser: User;
// }

// export interface ChatRoomState {
//   pageIndex: number;
// }







// export const ChatRoom: React.FC<{ disabled?: boolean }> = ({ disabled = false }) => {


//   if (disabled) {
//     return (
//       <div className='row'>
//         <div className='col-md-12'>
//           <div className='panel panel-default chat-panel' ref='chatPanel'>
//             <div className='panel-body' ref='chatPanelBody'>
//               {this.renderBody()}
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }
  
//   return (
//     <GolfDraftPanel heading='Chat Room'>
//       <div className='chat-room-container'>
//         <div className='col-md-9'>
//           <div className='panel panel-default chat-panel' ref='chatPanel'>
//             <div className='panel-body' ref='chatPanelBody'>
//               {this.renderBody()}
//             </div>
//           </div>
//           {!messages ? null : (<ChatRoomInput />)}
//         </div>
//         <div className='col-md-3'>
//           <div className='panel panel-default'>
//             <div className='panel-body'>
//               <b>Online:</b>
//               <ul className='list-unstyled'>
//                 {map(this.props.activeUsers, uid => UserStore.getUser(uid).name)
//                   .sort()
//                   .map(name => (<li key={name}>{name}</li>))}
//               </ul>
//             </div>
//           </div>
//         </div>
//       </div>
//     </GolfDraftPanel>
//   );
// }

// export default ChatRoom;







// export default class ChatRoomOld extends React.PureComponent<ChatRoomProps, ChatRoomState> {

//   constructor(props) {
//     super(props);
//     this.state = { pageIndex: null };
//   }

//   componentDidMount() {
//     this.forceScroll();
//   }

//   componentDidUpdate(prevProps) {
//     // Don't process these until we have initially loaded messages
//     if (!prevProps.messages) {
//       if (this.props.messages) {
//         this.pageUp();
//         this.forceScroll();
//       }
//       return;
//     }

//     const prevMessagesLength = prevProps.messages ? prevProps.messages.length : 0;
//     const newMessagesLength = this.props.messages ? this.props.messages.length : 0;

//     if (newMessagesLength > prevMessagesLength) {
//       const myTagStr = SPECIFIC_TAG.replace("{{name}}", this.props.currentUser.name);
//       const addedMessages = this.props.messages.slice(prevMessagesLength, newMessagesLength);
//       const tagsMe = some(addedMessages, msg => msg.message.includes(myTagStr));
//       if (tagsMe) {
//         newMessageSound?.play();
//       }

//       this.forceScroll();
//     }
//   }

//   render() {
//     if (this.props.enabled) {
//       return this.renderEnabledChat();
//     } else {
//       return this.renderDisabledChat();
//     }
//   }

//   private renderEnabledChat() {
//     const messages = this.props.messages;
//     return (
//       <GolfDraftPanel heading='Chat Room'>
//         <div className='chat-room-container'>
//           <div className='col-md-9'>
//             <div className='panel panel-default chat-panel' ref='chatPanel'>
//               <div className='panel-body' ref='chatPanelBody'>
//                 {this.renderBody()}
//               </div>
//             </div>
//             {!messages ? null : (<ChatRoomInput />)}
//           </div>
//           <div className='col-md-3'>
//             <div className='panel panel-default'>
//               <div className='panel-body'>
//                 <b>Online:</b>
//                 <ul className='list-unstyled'>
//                   {map(this.props.activeUsers, uid => UserStore.getUser(uid).name)
//                     .sort()
//                     .map(name => (<li key={name}>{name}</li>))}
//                 </ul>
//               </div>
//             </div>
//           </div>
//         </div>
//       </GolfDraftPanel>
//     );
//   }

//   private renderDisabledChat() {
//     return (
//       <GolfDraftPanel heading='Chat Room'>
//         <div className='row'>
//           <div className='col-md-12'>
//             <div className='panel panel-default chat-panel' ref='chatPanel'>
//               <div className='panel-body' ref='chatPanelBody'>
//                 {this.renderBody()}
//               </div>
//             </div>
//           </div>
//         </div>
//       </GolfDraftPanel>
//     );
//   }

//   private onLoadMore = (ev) => {
//     ev.preventDefault();
//     this.pageUp();
//   }

//   private renderBody() {
//     const messages = this.props.messages;
//     if (!messages) {
//       return (<span>Loading...</span>);
//     } else if (isEmpty(messages)) {
//       return (<span>No messages. Be the first! Speak your mind.</span>);
//     } else {
//       const hasMoreMessages = this.state.pageIndex > 0;
//       return (
//         <div>
//           {!hasMoreMessages ? null : (
//             <div style={{ textAlign: 'center', paddingBottom: '0.5em' }}>
//               <a href='' onClick={this.onLoadMore}>Load more...</a>
//             </div>
//           )}
//           <dl className='chat-list dl-horizontal'>
//             {messages.slice(this.state.pageIndex).map((message, i) => {
//               const displayName = message.isBot ?
//                 BOT_NAME : UserStore.getUser(message.user).name;
//               const className = message.isBot ? 'bot-message' : '';
//               return [
//                 (
//                   <dt key={'dt' + i} className={className}>
//                     {displayName}<span className='message-date'>
//                       {" "}({moment(message.date).format('l LT')})
//                     </span>:
//                   </dt>
//                 ),
//                 (
//                   <dd key={'dd' + i} className={className}>
//                     <Message text={message.message} />
//                   </dd>
//                 )
//               ];
//             })}
//           </dl>
//         </div>
//       );
//     }
//   }

//   private pageUp() {
//     const currentIndex = this.state.pageIndex !== null ? this.state.pageIndex : this.props.messages.length - 1;
//     this.setState({ pageIndex: Math.max(0, currentIndex - DEFAULT_PAGE_SIZE) });
//   }

//   private forceScroll() {
//     const refs = this.refs;
//     (refs.chatPanel as HTMLDivElement).scrollTop = (refs.chatPanelBody as HTMLDivElement).offsetHeight;
//   }

// };
