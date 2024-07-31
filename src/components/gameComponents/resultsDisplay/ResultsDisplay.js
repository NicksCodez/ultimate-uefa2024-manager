import React, { useEffect, useState } from 'react';

// utils
import { v4 as uuidv4 } from 'uuid';
import simulateMatch from '../../../utils/gameLoop/simulationFunctions';
import { capitalizeFirstLetters } from '../../../utils/stringFunctions/StringFunctions';
import {
  computerSelectTeam,
  createTeam,
  getMatchWinner,
} from '../../../utils/gameLoop/teamFunctions';

// components
import AnimatedEventDescription from '../animatedEventDescription/AnimatedEventDescription';

const ResultsDisplay = ({
  results,
  events,
  playerTeamName,
  userPlayers,
  computerTeamName,
  computerPlayers,
  computerPairings,
  onContinue,
}) => {
  // computer games states
  const [computerGames, setComputerGames] = useState(null);
  const [winnerComputerTeams, setWinnerComputerTeams] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    console.log({ results });
    // calculate computer games while user is enthralled by the realer-than-life football experience you have created

    const computerMatchResults = simulateComputerGames(computerPairings);
    console.log('\n\n\n', { computerMatchResults }, '\n\n\n');
    setComputerGames(computerMatchResults);
    const winningTeams = computerMatchResults.map((mr) => getMatchWinner(mr));
    console.log('\n\n\n', { winningTeams }, '\n\n\n');
    // if player lost, add team player was fighting against to this
    if (getMatchWinner({ score: results }) === computerTeamName) {
      winningTeams.push(computerTeamName);
    }
    setWinnerComputerTeams(winningTeams);
    setLoaded(true);

    console.log(
      'in results display ',
      { computerGames },
      { winnerComputerTeams },
      { results },
      { playerTeamName },
      { computerMatchResults },
      { winningTeams },
      { computerPairings },
    );
  }, []);

  useEffect(() => {
    console.log(
      'in results display --------------------- ',
      { computerGames },
      { winnerComputerTeams },
    );
  }, [computerGames, winnerComputerTeams]);

  return (
    <div id="results-display">
      <h3>
        {capitalizeFirstLetters(playerTeamName)} {results[playerTeamName]} -{' '}
        {results[computerTeamName]} {capitalizeFirstLetters(computerTeamName)}
      </h3>
      {results.penalties && (
        <h3>
          Penalties Score: {capitalizeFirstLetters(playerTeamName)}{' '}
          {results.penalties[playerTeamName]} -{' '}
          {results.penalties[computerTeamName]}{' '}
          {capitalizeFirstLetters(computerTeamName)}
        </h3>
      )}

      <div className="event-descriptions">
        {events.map((ev) => {
          const unique = uuidv4();
          return (
            <AnimatedEventDescription
              key={unique}
              id={unique}
              text={ev.eventText}
              minute={ev.minute}
              isPenalty={ev.isPenalty}
            />
          );
        })}
      </div>
      <button
        type="button"
        className="authentication-button"
        onClick={() =>
          onContinue(
            computerGames,
            winnerComputerTeams,
            results,
            playerTeamName,
          )
        }
      >
        Continue
      </button>
    </div>
  );
};

export default ResultsDisplay;

const simulateComputerGames = (computerPairings) => {
  const results = Object.entries(computerPairings).map(
    ([pairKey, [team1, team2]]) => {
      try {
        // npcs choose their npc teams
        const computedTeam1 = computerSelectTeam(team1.players);
        const computedTeam2 = computerSelectTeam(team2.players);

        // build npc's teams to work with simulateMatch
        const finalTeam1 = createTeam(computedTeam1, team1.name);
        const finalTeam2 = createTeam(computedTeam2, team2.name);

        // run simulation
        const { events, score } = simulateMatch(finalTeam1, finalTeam2);
        return { events, score };
      } catch (error) {
        console.error('Error simulating NPC matches ', { error });
      }
    },
  );
  console.log({ results });
  return results;
};
