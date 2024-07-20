import React from 'react';

// utils
import { capitalizeFirstLetters } from '../../utils/stringFunctions/StringFunctions';

const PlayerCard = ({ player }) => (
  <div className="player-card">
    <div className="player-card-left">
      <img src={player.picture} alt={player.name} />
    </div>
    <div className="player-card-right">
      <span>{capitalizeFirstLetters(player.name)}</span>
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
  </div>
);

export default PlayerCard;
