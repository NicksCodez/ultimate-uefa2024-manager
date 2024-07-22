/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMatchWinner } from '../../utils/gameLoop/teamFunctions';

const TournamentProgress = ({
  computerGames,
  winnerComputerTeams,
  results,
  playerTeamName,
  userTeam,
  onContinue,
  oldComputerTeams,
}) => {
  const [isRoundWon, setIsRoundWon] = useState(false);
  const [isTournamentWon, setIsTournamentWon] = useState(false);

  const newComputerTeams = oldComputerTeams.filter((team) =>
    winnerComputerTeams.includes(team.name),
  );

  useEffect(() => {
    const roundWon = getMatchWinner(results) === playerTeamName;
    const tournamentWon = !computerGames && roundWon;
    console.log(
      { roundWon },
      { tournamentWon },
      { userTeam },
      { newComputerTeams },
    );
    setIsRoundWon(roundWon);
    setIsTournamentWon(isTournamentWon);
  }, []);

  return (
    <div id="tournament-progress">
      {newComputerTeams && (
        <div id="tournament-progress-computer-games">
          <div>The following teams made it to the round finals:</div>
          {newComputerTeams && (
            <ul>
              {newComputerTeams.map((team, index) => (
                <li key={index}>{team.name}</li>
              ))}
            </ul>
          )}
        </div>
      )}
      <div id="tournament-progress-player">
        {isTournamentWon
          ? 'You are the best of the best'
          : isRoundWon
            ? 'Congratulations, you won the round and can go further!'
            : 'Sorry, gonna have to start all over again, pal'}
      </div>
      {isRoundWon && !isTournamentWon && (
        <button
          type="button"
          className="authentication-button"
          onClick={() => onContinue(newComputerTeams, userTeam)}
        >
          Continue
        </button>
      )}

      <Link to="/home" className="authentication-button">
        Home
      </Link>
    </div>
  );
};

export default TournamentProgress;
