import React, { useEffect, useState } from 'react';

// css
import './PlayerSelection.css';

const PlayerSelection = ({ onSelect, userTeam }) => {
  const [players, setPlayers] = useState(null);

  useEffect(() => {
    console.log({ userTeam });
  }, []);

  return <div id="player-selection">Player Selection Stage</div>;
};

export default PlayerSelection;
