import React, { useEffect, useState } from 'react';

const MatchSimulation = ({
  playerTeamName,
  userPlayers,
  computerTeamName,
  computerPlayers,
  computerPairings,
}) => {
  const [results, setResults] = useState(null);

  useEffect(() => {
    console.log(
      'matching loaded => ',
      { playerTeamName },
      { userPlayers },
      { computerTeamName },
      { computerPlayers },
      { computerPairings },
    );
  }, []);

  return <div id="math-simulation">Match simulation</div>;
};

export default MatchSimulation;
