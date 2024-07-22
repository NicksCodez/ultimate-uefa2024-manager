import React, { useEffect, useState } from 'react';

// css
import './PlayerSelector.css';

import DefaultPicture from '../../../../assets/defaults/default_profile.png';
import PlayerList from '../../playerList/PlayerList';

const PlayerSelector = ({ possiblePlayers, setParentPlayers }) => {
  // component state
  // const availablePlayers = useRef([...possiblePlayers]);
  const [availablePlayers, setAvailablePlayers] = useState([
    ...possiblePlayers,
  ]);

  const [teamFormation, setTeamFormation] = useState({
    goalkeeper: null,
    leftDefender: null,
    centerLeftDefender: null,
    centerRightDefender: null,
    rightDefender: null,
    leftMidfielder: null,
    centerLeftMidfielder: null,
    centerRightMidfielder: null,
    rightMidfielder: null,
    leftForward: null,
    rightForward: null,
  });

  useEffect(() => {
    setParentPlayers(teamFormation);
  }, [teamFormation]);

  const selectPlayerForPosition = (positionId, playerId) => {
    const player = availablePlayers.find((p) => p.docId === playerId);
    if (!player) {
      console.error('Player not found');
      return;
    }

    // remove player from available players
    const playerIndex = availablePlayers.findIndex((p) => p.docId === playerId);
    setAvailablePlayers((prevPlayers) => {
      const updatedPlayers = prevPlayers.filter(
        (_, index) => index !== playerIndex,
      );

      return updatedPlayers;
    });

    // if there was a player in this position before, add them back to available players
    if (teamFormation[positionId]) {
      setAvailablePlayers((prevPlayers) => [
        ...prevPlayers,
        teamFormation[positionId].player,
      ]);
    }

    // assign player to the position
    setTeamFormation((prevFormation) => ({
      ...prevFormation,
      [positionId]: {
        player,
        isOutOfPosition: player.position !== getPositionCategory(positionId),
      },
    }));
  };

  // player list state
  const [showPlayerList, setShowPlayerList] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);

  const renderPositionButton = (position, label) => {
    const player = teamFormation[position]?.player;
    return (
      <div className="button-wrapper">
        <button
          type="button"
          onClick={() =>
            setupPlayerList(position, setShowPlayerList, setSelectedPosition)
          }
          className={`position-button ${player ? 'selected' : ''}`}
        >
          <img
            src={player?.picture || DefaultPicture}
            alt={player?.name || 'player'}
            className="player-image"
          />
        </button>
        <div className="position-label">{label}</div>
        <div className="player-name">{player?.name}</div>
      </div>
    );
  };

  const handlePlayerClick = (player) => {
    // function passed down to PlayerCard component,
    selectPlayerForPosition(selectedPosition, player.docId);
    setShowPlayerList(false);
  };

  useEffect(() => {
    const playerList = document.getElementById('player-list');
    if (showPlayerList) {
      playerList.classList.add('active');
    } else {
      playerList.classList.remove('active');
    }
  }, [showPlayerList]);

  return (
    <div id="player-selector">
      <div id="player-selector-wrapper">
        <div className="position-row forwards">
          {renderPositionButton('leftForward', 'LF')}
          {renderPositionButton('rightForward', 'RF')}
        </div>

        <div className="position-row midfielders">
          {renderPositionButton('leftMidfielder', 'LM')}
          {renderPositionButton('centerLeftMidfielder', 'CM')}
          {renderPositionButton('centerRightMidfielder', 'CM')}
          {renderPositionButton('rightMidfielder', 'RM')}
        </div>

        <div className="position-row defenders">
          {renderPositionButton('leftDefender', 'LB')}
          {renderPositionButton('centerLeftDefender', 'CB')}
          {renderPositionButton('centerRightDefender', 'CB')}
          {renderPositionButton('rightDefender', 'RB')}
        </div>

        <div className="position-row goalkeeper">
          {renderPositionButton('goalkeeper', 'GK')}
        </div>
      </div>
      <PlayerList
        players={availablePlayers}
        firstPosition={getPositionCategory(selectedPosition || 'aForward')}
        onPlayerClick={handlePlayerClick}
        showCursor
      />
    </div>
  );
};

export default PlayerSelector;

const setupPlayerList = (position, setShowPlayerList, setSelectedPosition) => {
  setSelectedPosition(position);
  setShowPlayerList(true);
};

const getPositionCategory = (positionId) => {
  if (positionId === 'goalkeeper') return 'goalkeeper';
  if (positionId.includes('Defender')) return 'defender';
  if (positionId.includes('Midfielder')) return 'midfielder';
  if (positionId.includes('Forward')) return 'attacker';
};
