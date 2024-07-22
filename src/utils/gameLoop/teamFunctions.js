/* eslint-disable no-restricted-syntax */
/* eslint-disable import/prefer-default-export */
const computerSelectTeam = (originalPlayers) => {
  const availablePlayers = [...originalPlayers];
  const teamFormation = {
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
  };

  const positionCategories = {
    goalkeeper: ['goalkeeper'],
    leftDefender: ['defender'],
    centerLeftDefender: ['defender'],
    centerRightDefender: ['defender'],
    rightDefender: ['defender'],
    leftMidfielder: ['midfielder'],
    centerLeftMidfielder: ['midfielder'],
    centerRightMidfielder: ['midfielder'],
    rightMidfielder: ['midfielder'],
    leftForward: ['attacker'],
    rightForward: ['attacker'],
  };

  // Helper function to get the best player for a position
  const getBestPlayerForPosition = (position, available) => {
    const suitablePlayers = available.filter((player) =>
      positionCategories[position].includes(player.position),
    );

    if (suitablePlayers.length === 0) {
      return null;
    }

    // Sort players by relevant attributes for the position
    return suitablePlayers.sort((a, b) => {
      if (position.includes('Defender')) {
        return b.defence - a.defence;
      }
      if (position.includes('Midfielder')) {
        return b.passing + b.defence - (a.passing + a.defence);
      }
      if (position.includes('Forward')) {
        return b.shooting - a.shooting;
      } // Goalkeeper
      return b.defence - a.defence;
    })[0];
  };

  // Fill each position with the best available player
  for (const position of Object.keys(teamFormation)) {
    const bestPlayer = getBestPlayerForPosition(position, availablePlayers);
    if (bestPlayer) {
      teamFormation[position] = {
        player: bestPlayer,
        isOutOfPosition: !positionCategories[position].includes(
          bestPlayer.position,
        ),
      };
      // Remove the selected player from available players
      const index = availablePlayers.findIndex((p) => p.id === bestPlayer.id);
      availablePlayers.splice(index, 1);
    }
  }

  // If any positions are still empty, fill them with the best remaining players
  for (const position of Object.keys(teamFormation)) {
    if (!teamFormation[position] && availablePlayers.length > 0) {
      const bestRemainingPlayer = availablePlayers.sort(
        (a, b) =>
          b.defence +
          b.passing +
          b.shooting -
          (a.defence + a.passing + a.shooting),
      )[0];
      teamFormation[position] = {
        player: bestRemainingPlayer,
        isOutOfPosition: true,
      };
      // Remove the selected player from available players
      const index = availablePlayers.findIndex(
        (p) => p.id === bestRemainingPlayer.id,
      );
      availablePlayers.splice(index, 1);
    }
  }

  return teamFormation;
};

const createTeam = (teamFormation, teamName) => {
  let totalHandicap = 0;
  const players = [];

  Object.entries(teamFormation).forEach(([position, data]) => {
    const { player, isOutOfPosition } = data;

    players.push(player);

    if (isOutOfPosition) {
      totalHandicap++;
    }
  });

  return {
    name: teamName,
    players,
    handicap: totalHandicap,
  };
};

const getMatchWinner = (matchResult) => {
  const { score } = matchResult;
  console.log({ matchResult });
  const teamNames = Object.keys(score).filter((key) => key !== 'penalties');

  if (teamNames.length !== 2) {
    throw new Error('Expected exactly two teams');
  }

  const [team1, team2] = teamNames;
  const team1Score = score[team1];
  const team2Score = score[team2];

  if (team1Score > team2Score) {
    return team1;
  }
  if (team2Score > team1Score) {
    return team2;
  }
  if (score.penalties) {
    const team1Penalties = score.penalties[team1];
    const team2Penalties = score.penalties[team2];

    if (team1Penalties > team2Penalties) {
      return team1;
    }
    if (team2Penalties > team1Penalties) {
      return team2;
    }
  }
};

export { computerSelectTeam, createTeam, getMatchWinner };
