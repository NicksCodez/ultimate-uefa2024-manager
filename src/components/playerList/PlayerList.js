import React from 'react';

// components
import PlayerCard from '../playerCard/PlayerCard';

// utils
import { capitalizeFirstLetters } from '../../utils/stringFunctions/StringFunctions';

import './PlayerList.css';

const PlayerList = ({
  players,
  firstPosition,
  onPlayerClick = () => {},
  showCursor = false,
}) => {
  // sort players alphabetically without mutating original string
  const sortedPlayers = players
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name));

  // group players by position
  const groupedPlayers = sortedPlayers.reduce((acc, player) => {
    if (!acc[player.position]) {
      acc[player.position] = [];
    }
    acc[player.position].push(player);
    return acc;
  }, {});

  // default position group display order
  let positionOrder = ['attacker', 'midfielder', 'defender', 'goalkeeper'];

  // if valid firstPosition is specified, change position order
  if (positionOrder.includes(firstPosition)) {
    positionOrder = [
      firstPosition,
      ...positionOrder.filter((pos) => pos !== firstPosition),
    ];
  }

  return (
    <div id="player-list">
      {positionOrder.map(
        (position) =>
          groupedPlayers[position] && (
            <div key={position} className="position-group">
              <h3>{`${capitalizeFirstLetters(position)}s`}</h3>
              <ul>
                {groupedPlayers[position].map((player) => (
                  <li key={player.docId}>
                    <PlayerCard
                      player={player}
                      onPlayerClick={onPlayerClick}
                      showCursor={showCursor}
                    />
                  </li>
                ))}
              </ul>
            </div>
          ),
      )}
    </div>
  );
};

export default PlayerList;
