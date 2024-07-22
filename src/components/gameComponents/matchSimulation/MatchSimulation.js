import React, { useEffect } from 'react';
import simulateMatch from '../../../utils/gameLoop/simulationFunctions';
import { createTeam } from '../../../utils/gameLoop/teamFunctions';

const MatchSimulation = ({
  onComplete,
  playerTeamName,
  userPlayers,
  computerTeamName,
  computerPlayers,
  computerPairings,
}) => {
  useEffect(() => {
    const { events, score } = simulateMatch(
      createTeam(userPlayers, playerTeamName),
      createTeam(computerPlayers, computerTeamName),
    );

    onComplete(events, score);
  }, []);

  return <div id="match-simulation">Match simulation</div>;
};

export default MatchSimulation;
