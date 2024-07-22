/* eslint-disable no-restricted-syntax */
/* eslint-disable import/prefer-default-export */
const computerSelectTeam = (availablePlayers) => {
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
    goalkeeper: ['Goalkeeper'],
    leftDefender: ['Defender'],
    centerLeftDefender: ['Defender'],
    centerRightDefender: ['Defender'],
    rightDefender: ['Defender'],
    leftMidfielder: ['Midfielder'],
    centerLeftMidfielder: ['Midfielder'],
    centerRightMidfielder: ['Midfielder'],
    rightMidfielder: ['Midfielder'],
    leftForward: ['Attacker'],
    rightForward: ['Attacker'],
  };

  // Helper function to get the best player for a position
  const getBestPlayerForPosition = (position, availablePlayers) => {
    const suitablePlayers = availablePlayers.filter((player) =>
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

export { computerSelectTeam };
