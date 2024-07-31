import { capitalizeFirstLetters } from '../stringFunctions/StringFunctions';

/* eslint-disable no-restricted-syntax */
const simulateMatch = (team1, team2) => {
  const events = [];
  const score = { [team1.name]: 0, [team2.name]: 0 };

  const team1Ratings = calculateTeamRatings(team1);
  const team2Ratings = calculateTeamRatings(team2);

  // regular time
  simulatePeriod(
    90,
    team1,
    team2,
    team1Ratings,
    team2Ratings,
    score,
    events,
    0,
  );

  // check if score tied
  if (score[team1.name] === score[team2.name]) {
    events.push({
      eventType: 'EXTRA_TIME_START',
      eventText: 'The match ends in a draw. Moving to extra time!',
      actionTeam: null,
      scoreTeam1: score[team1.name],
      scoreTeam2: score[team2.name],
      minute: 90,
      isPenalty: false,
      isExtraTime: true,
      outcome: 'draw',
      nextStage: 'extra_time',
    });

    // first half of extra time
    simulatePeriod(
      15,
      team1,
      team2,
      team1Ratings,
      team2Ratings,
      score,
      events,
      90,
    );

    events.push({
      eventType: 'EXTRA_TIME_HALF',
      eventText: 'The first half of extra time ends',
      actionTeam: null,
      scoreTeam1: score[team1.name],
      scoreTeam2: score[team2.name],
      minute: 105,
      isPenalty: false,
      isExtraTime: true,
      outcome: 'draw',
      nextStage: 'extra_time',
    });
    // second half of extra time
    simulatePeriod(
      15,
      team1,
      team2,
      team1Ratings,
      team2Ratings,
      score,
      events,
      105,
    );

    // still tied, so go to penalties
    if (score[team1.name] === score[team2.name]) {
      events.push({
        eventType: 'EXTRA_TIME_END',
        eventText:
          'The score is still tied after extra time. Moving to penalty shootout!',
        actionTeam: null,
        scoreTeam1: score[team1.name],
        scoreTeam2: score[team2.name],
        minute: 120,
        isPenalty: false,
        isExtraTime: true,
        outcome: 'draw',
        nextStage: 'penalties',
      });
      const penaltyResult = simulatePenalties(team1, team2);
      events.push(...penaltyResult.events);
      score.penalties = penaltyResult.score;
    }
  }

  return { events, score };
};

const simulatePeriod = (
  duration,
  team1,
  team2,
  team1Ratings,
  team2Ratings,
  score,
  events,
  timeBefore,
) => {
  for (let minute = 1; minute <= duration; minute++) {
    if (Math.random() < 0.1) {
      // 10% chance of an event occurring each minute
      const event = generateEvent(
        team1,
        team2,
        team1Ratings,
        team2Ratings,
        score,
      );
      // events.push(`Minute ${minute}: ${event}`);
      events.push({ minute: minute + timeBefore, ...event });
    }
  }
};

const simulatePenalties = (team1, team2) => {
  const events = [];
  const score = { [team1.name]: 0, [team2.name]: 0 };
  const maxRounds = 5;

  const team1Shooters = team1.players.sort((a, b) => b.shooting - a.shooting);
  const team2Shooters = team2.players.sort((a, b) => b.shooting - a.shooting);

  const goalkeeper1 = team1.players.find((p) => p.position === 'goalkeeper');
  const goalkeeper2 = team2.players.find((p) => p.position === 'goalkeeper');

  const takeShot = (
    shooter,
    goalkeeper,
    shootingTeam,
    defendingTeam,
    round,
    isSuddenDeath = false,
  ) => {
    const baseChance = 0.75;
    const shooterFactor = shooter.shooting / 100;
    const goalkeeperFactor = goalkeeper.defence / 100;
    const randomFactor = Math.random() * 0.2 - 0.1;
    const successChance =
      baseChance + (shooterFactor - goalkeeperFactor) / 2 + randomFactor;
    const success = Math.random() < successChance;

    if (success) {
      score[shootingTeam.name]++;
      events.push({
        eventType: 'PENALTY_GOAL',
        eventText: `${shooter.name} scores for ${shootingTeam.name}! ${capitalizeFirstLetters(team1.name)} ${score[team1.name]} - ${score[team2.name]} ${capitalizeFirstLetters(team2.name)}`,
        actionTeam: shootingTeam.name,
        shooter: shooter.name,
        goalkeeper: goalkeeper.name,
        scoreTeam1: score[team1.name],
        scoreTeam2: score[team2.name],
        round,
        minute: 121,
        isPenalty: true,
        outcome: 'goal',
        isSuddenDeath,
      });
    } else {
      events.push({
        eventType: 'PENALTY_MISS',
        eventText: `${shooter.name} misses for ${shootingTeam.name}! Great save by ${goalkeeper.name}!`,
        actionTeam: shootingTeam.name,
        shooter: shooter.name,
        goalkeeper: goalkeeper.name,
        scoreTeam1: score[team1.name],
        scoreTeam2: score[team2.name],
        round,
        minute: 121,
        isPenalty: true,
        outcome: 'miss',
        isSuddenDeath,
      });
    }
    return success;
  };

  for (let round = 1; round <= maxRounds; round++) {
    const team1Shooter = team1Shooters[(round - 1) % team1Shooters.length];
    const team2Shooter = team2Shooters[(round - 1) % team2Shooters.length];

    takeShot(team1Shooter, goalkeeper2, team1, team2, round);

    if (score[team1.name] - score[team2.name] > maxRounds - round + 1) {
      events.push({
        eventType: 'PENALTY_SHOOTOUT_END',
        eventText: `${capitalizeFirstLetters(team1.name)} wins the penalty shootout!`,
        actionTeam: team1.name,
        scoreTeam1: score[team1.name],
        scoreTeam2: score[team2.name],
        round,
        minute: 121,
        isPenalty: true,
        outcome: 'final',
      });
      return { events, score };
    }

    takeShot(team2Shooter, goalkeeper1, team2, team1, round);

    if (round === maxRounds && score[team1.name] !== score[team2.name]) {
      const winner =
        score[team1.name] > score[team2.name] ? team1.name : team2.name;
      events.push({
        eventType: 'PENALTY_SHOOTOUT_END',
        eventText: `${winner} wins the penalty shootout!`,
        actionTeam: winner,
        scoreTeam1: score[team1.name],
        scoreTeam2: score[team2.name],
        round,
        minute: 121,
        isPenalty: true,
        outcome: 'final',
      });
      return { events, score };
    }
  }

  let round = maxRounds + 1;
  while (score[team1.name] === score[team2.name]) {
    const team1Shooter = team1Shooters[(round - 1) % team1Shooters.length];
    const team2Shooter = team2Shooters[(round - 1) % team2Shooters.length];

    takeShot(team1Shooter, goalkeeper2, team1, team2, round, true);
    if (score[team1.name] !== score[team2.name]) {
      takeShot(team2Shooter, goalkeeper1, team2, team1, round, true);
    }

    if (score[team1.name] !== score[team2.name]) {
      const winner =
        score[team1.name] > score[team2.name] ? team1.name : team2.name;
      events.push({
        eventType: 'PENALTY_SHOOTOUT_END',
        eventText: `${winner} wins the penalty shootout!`,
        actionTeam: winner,
        scoreTeam1: score[team1.name],
        scoreTeam2: score[team2.name],
        round,
        minute: 121,
        isPenalty: true,
        outcome: 'final',
        isSuddenDeath: true,
      });
      return { events, score };
    }
    round++;
  }
};

const generateEvent = (team1, team2, team1Ratings, team2Ratings, score) => {
  const team1OffensiveStrength =
    team1Ratings.offensiveRating /
    (team1Ratings.offensiveRating + team2Ratings.defensiveRating);
  const team2OffensiveStrength =
    team2Ratings.offensiveRating /
    (team2Ratings.offensiveRating + team1Ratings.defensiveRating);

  const eventTypes = [
    ['goal_team1', 0.1 * team1OffensiveStrength],
    ['goal_team2', 0.1 * team2OffensiveStrength],
    ['shot_on_goal_team1', 0.2 * team1OffensiveStrength],
    ['shot_on_goal_team2', 0.2 * team2OffensiveStrength],
    ['miss_team1', 0.1 * team1OffensiveStrength],
    ['miss_team2', 0.1 * team2OffensiveStrength],
    ['save_team1', 0.1 * team1Ratings.defensiveRating],
    ['save_team2', 0.1 * team2Ratings.defensiveRating],
    ['interception_team1', 0.1 * team1Ratings.defensiveRating],
    ['interception_team2', 0.1 * team2Ratings.defensiveRating],
  ];

  const eventType = weightedRandomChoice(eventTypes);

  // switch (eventType) {
  //   case 'goal_team1':
  //     score[team1.name]++;
  //     return `GOAL! ${capitalizeFirstLetters(team1.name)} scores! The score is now ${capitalizeFirstLetters(team1.name)} ${score[team1.name]} - ${score[team2.name]} ${capitalizeFirstLetters(team2.name)}`;
  //   case 'goal_team2':
  //     score[team2.name]++;
  //     return `GOAL! ${capitalizeFirstLetters(team2.name)} scores! The score is now ${capitalizeFirstLetters(team1.name)} ${score[team1.name]} - ${score[team2.name]} ${capitalizeFirstLetters(team2.name)}`;
  //   case 'shot_on_goal_team1':
  //     return `${capitalizeFirstLetters(team1.name)} takes a shot on goal!`;
  //   case 'shot_on_goal_team2':
  //     return `${capitalizeFirstLetters(team2.name)} takes a shot on goal!`;
  //   case 'miss_team1':
  //     return `${capitalizeFirstLetters(team1.name)} shoots but misses the target!`;
  //   case 'miss_team2':
  //     return `${capitalizeFirstLetters(team2.name)} shoots but misses the target!`;
  //   case 'save_team1':
  //     return `Great save by the ${capitalizeFirstLetters(team1.name)} goalkeeper!`;
  //   case 'save_team2':
  //     return `Great save by the ${capitalizeFirstLetters(team2.name)} goalkeeper!`;
  //   case 'interception_team1':
  //     return `${capitalizeFirstLetters(team1.name)} intercepts the ball in midfield!`;
  //   case 'interception_team2':
  //     return `${capitalizeFirstLetters(team2.name)} intercepts the ball in midfield!`;
  //   default:
  //     return `${capitalizeFirstLetters(team1.name)} intercepts the ball in midfield!`;
  // }
  switch (eventType) {
    case 'goal_team1':
      score[team1.name]++;
      return {
        eventType: 'GOAL',
        eventText: `GOAL! ${capitalizeFirstLetters(team1.name)} scores! The score is now ${capitalizeFirstLetters(team1.name)} ${score[team1.name]} - ${score[team2.name]} ${capitalizeFirstLetters(team2.name)}`,
        actionTeam: team1.name,
        scoreTeam1: score[team1.name],
        scoreTeam2: score[team2.name],
      };
    case 'goal_team2':
      score[team2.name]++;
      return {
        eventType: 'GOAL',
        eventText: `GOAL! ${capitalizeFirstLetters(team2.name)} scores! The score is now ${capitalizeFirstLetters(team1.name)} ${score[team1.name]} - ${score[team2.name]} ${capitalizeFirstLetters(team2.name)}`,
        actionTeam: team2.name,
        scoreTeam1: score[team1.name],
        scoreTeam2: score[team2.name],
      };
    case 'shot_on_goal_team1':
      return {
        eventType: 'SHOT_ON_GOAL',
        eventText: `${capitalizeFirstLetters(team1.name)} takes a shot on goal!`,
        actionTeam: team1.name,
        scoreTeam1: score[team1.name],
        scoreTeam2: score[team2.name],
      };
    case 'shot_on_goal_team2':
      return {
        eventType: 'SHOT_ON_GOAL',
        eventText: `${capitalizeFirstLetters(team2.name)} takes a shot on goal!`,
        actionTeam: team2.name,
        scoreTeam1: score[team1.name],
        scoreTeam2: score[team2.name],
      };
    case 'miss_team1':
      return {
        eventType: 'MISS',
        eventText: `${capitalizeFirstLetters(team1.name)} shoots but misses the target!`,
        actionTeam: team1.name,
        scoreTeam1: score[team1.name],
        scoreTeam2: score[team2.name],
      };
    case 'miss_team2':
      return {
        eventType: 'MISS',
        eventText: `${capitalizeFirstLetters(team2.name)} shoots but misses the target!`,
        actionTeam: team2.name,
        scoreTeam1: score[team1.name],
        scoreTeam2: score[team2.name],
      };
    case 'save_team1':
      return {
        eventType: 'SAVE',
        eventText: `Great save by the ${capitalizeFirstLetters(team1.name)} goalkeeper!`,
        actionTeam: team1.name,
        scoreTeam1: score[team1.name],
        scoreTeam2: score[team2.name],
      };
    case 'save_team2':
      return {
        eventType: 'SAVE',
        eventText: `Great save by the ${capitalizeFirstLetters(team2.name)} goalkeeper!`,
        actionTeam: team2.name,
        scoreTeam1: score[team1.name],
        scoreTeam2: score[team2.name],
      };
    case 'interception_team1':
      return {
        eventType: 'INTERCEPTION',
        eventText: `${capitalizeFirstLetters(team1.name)} intercepts the ball in midfield!`,
        actionTeam: team1.name,
        scoreTeam1: score[team1.name],
        scoreTeam2: score[team2.name],
      };
    case 'interception_team2':
      return {
        eventType: 'INTERCEPTION',
        eventText: `${capitalizeFirstLetters(team2.name)} intercepts the ball in midfield!`,
        actionTeam: team2.name,
        scoreTeam1: score[team1.name],
        scoreTeam2: score[team2.name],
      };
    default:
      return {
        eventType: 'INTERCEPTION',
        eventText: `${capitalizeFirstLetters(team1.name)} intercepts the ball in midfield!`,
        actionTeam: team1.name,
        scoreTeam1: score[team1.name],
        scoreTeam2: score[team2.name],
      };
  }
};

const calculateTeamRatings = (team) => {
  const offensiveRating =
    team.players
      .filter((p) => p.position === 'attacker' || p.position === 'midfielder')
      .reduce((sum, p) => sum + p.shooting + p.passing, 0) /
    (6 * 200); // normalize to 0-1

  const defensiveRating =
    team.players
      .filter((p) => p.position === 'defender' || p.position === 'goalkeeper')
      .reduce((sum, p) => sum + p.defence, 0) /
    (5 * 100); // normalize to 0-1

  // calculate handicap penalty
  const handicapPenalty = Math.max(1 - team.handicap * 0.2, 0.2); // 20% penalty per player out of position, maximum 80% handicap
  // apply handicap penalty to both ratings
  const adjustedOffensiveRating = offensiveRating * handicapPenalty;
  const adjustedDefensiveRating = defensiveRating * handicapPenalty;

  return {
    offensiveRating: adjustedOffensiveRating,
    defensiveRating: adjustedDefensiveRating,
  };
};

const weightedRandomChoice = (choices) => {
  const totalWeight = choices.reduce((sum, choice) => sum + choice[1], 0);
  let random = Math.random() * totalWeight;

  for (const [choice, weight] of choices) {
    random -= weight;
    if (random <= 0) {
      return choice;
    }
  }
};

export default simulateMatch;
