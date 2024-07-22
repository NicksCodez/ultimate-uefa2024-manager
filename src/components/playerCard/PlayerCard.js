import React from 'react';

// utils
import { capitalizeFirstLetters } from '../../utils/stringFunctions/StringFunctions';

// css
import './PlayerCard.css';

const PlayerCard = ({
  player,
  onPlayerClick = () => {},
  showCursor = false,
}) => (
  <button
    type="button"
    className={`player-card ${showCursor ? 'cursor-pointer' : ''}`}
    onClick={() => onPlayerClick(player)}
  >
    <div className="player-card-left">
      <img src={player.picture} alt={player.name} />
    </div>
    <div className="player-card-right">
      <div className="player-name">{capitalizeFirstLetters(player.name)}</div>
      <div className="player-stats">
        <div className="player-stat">
          <span className="category">SHO:</span>{' '}
          <span className="score" data-testid="shooting-score">
            {player.shooting}
          </span>
        </div>
        <div className="player-stat">
          <span className="category">PAS:</span>{' '}
          <span className="score" data-testid="passing-score">
            {player.passing}
          </span>
        </div>
        <div className="player-stat">
          <span className="category">DEF:</span>{' '}
          <span className="score" data-testid="defence-score">
            {player.defence}
          </span>
        </div>
      </div>
    </div>
  </button>
);

export default PlayerCard;
