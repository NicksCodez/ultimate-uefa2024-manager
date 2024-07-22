import React, { useEffect, useState } from 'react';

// components
import PageHeader from '../../pageHeader/PageHeader';
import PlayerSelector from '../playerSelector/PlayerSelector';

// utils
import { capitalizeFirstLetters } from '../../../utils/stringFunctions/StringFunctions';
import { computerSelectTeam } from '../../../utils/gameLoop/computerSelectTeam';

// css
import './PlayerSelection.css';

const PlayerSelection = ({ onSelect, onBack, userTeam, computerTeams }) => {
  const [players, setPlayers] = useState(null);
  const [playerOpponent, setPlayerOpponent] = useState(null);
  const [computerPairings, setComputerPairings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [computerSelectedTeam, setComputerSelectedTeam] = useState(null);

  useEffect(() => {
    // on component load choose user's opponent and draw pairs from remaining teams

    if (!Array.isArray(computerTeams)) {
      throw new Error('Computer teams is not an array');
    }

    if (computerTeams.length === 0) {
      throw new Error('Computer teams is empty');
    }

    // choose user's opponent
    const randomIndex = Math.floor(Math.random() * computerTeams.length);
    setPlayerOpponent(computerTeams[randomIndex]);
    const computedTeam = computerSelectTeam(computerTeams[randomIndex].players);
    setComputerSelectedTeam(computedTeam);

    // make computer pairings from remaining teams
    const remainingTeams = computerTeams.slice(0);
    remainingTeams.splice(randomIndex, 1);
    setComputerPairings(drawTeams(remainingTeams));
    setLoading(false);
    console.log({ userTeam }, { computerTeams });
  }, []);

  useEffect(
    () => {
      console.log({ playerOpponent }, { computerPairings }, { userTeam });
    },
    [playerOpponent, computerPairings],
    { userTeam },
  );

  // page header components and functions
  const rightElement = (
    <button
      type="button"
      className="general-button confirm-button"
      disabled={players === null || hasNullKeys(players)}
      onClick={() =>
        onSelect(
          players,
          computerSelectedTeam,
          computerPairings,
          playerOpponent,
        )
      }
    >
      Confirm
    </button>
  );

  return (
    <div id="player-selection">
      <PageHeader
        title="Player Selection"
        onBackClick={onBack}
        rightElement={rightElement}
      />
      {!loading && (
        <div id="player-selection-main">
          <h3>
            {capitalizeFirstLetters(userTeam.name)} VS{' '}
            {capitalizeFirstLetters(playerOpponent.name)}&#33;
          </h3>
          <PlayerSelector
            possiblePlayers={userTeam.players}
            setParentPlayers={setPlayers}
          />
        </div>
      )}
    </div>
  );
};

export default PlayerSelection;

const drawTeams = (teams) => {
  //! function assumes even number of teams
  const shuffledTeams = shuffleArray([...teams]);

  // Create pairs
  const pairs = {};
  let pairNumber = 0;
  for (let i = 0; i < shuffledTeams.length - 1; i += 2) {
    // firebase does not support nested arrays
    pairs[`pair${pairNumber}`] = [shuffledTeams[i], shuffledTeams[i + 1]];
    pairNumber++;
    // pairs.push([shuffledTeams[i], shuffledTeams[i + 1]]);
  }
  return pairs;
};

const shuffleArray = (array) => {
  const shuffledArray = array.slice();
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

const hasNullKeys = (obj) => Object.values(obj).some((value) => value === null);
