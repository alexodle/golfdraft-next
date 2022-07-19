export {};

// import React from 'react';
// import {Indexed, Tourney} from '../types/ClientTypes';
// import {orderBy} from 'lodash';

// interface TourneyHistoryProps {
//   activeTourneyId: string;
//   allTourneys: Indexed<Tourney>;
// }

// export class TourneyHistory extends React.Component<TourneyHistoryProps, {}> {

//   constructor(props) {
//     super(props);
//     this.state = {};
//   }

//   render() {
//     const sortedTourneys = orderBy(this.props.allTourneys, 'startDate', 'desc');
//     const {activeTourneyId} = this.props;
//     return (
//       <section>
//         <h1>Tourney history</h1>
//         <p><a href='/export'>Export all results</a></p>
//         <ol>
//           {sortedTourneys.map(t => {
//             if (t.id === activeTourneyId) {
//               return (<li key={t.id}><a href={`/${t.id}/`}><b>{t.name}</b></a></li>);
//             }
//             return (<li key={t.id}><a href={`/${t.id}/`}>{t.name}</a></li>);
//           })}
//         </ol>
//       </section>
//     );
//   }

// }