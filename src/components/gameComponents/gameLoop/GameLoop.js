import React, { useEffect, useState } from 'react';

// firebase
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import {
  loadGameState,
  saveGameState,
} from '../../../utils/firebase/firebaseFunctions';

// context
import { useAuth } from '../../../contexts/authContext/AuthContext';
import { firestore } from '../../../firebase';

const GameLoop = ({ gameId = null }) => {
  const [gameState, setGameState] = useState(null);
  const [currentGameId, setCurrentGameId] = useState(gameId);
  const { currentUser } = useAuth();

  useEffect(() => {
    // initial game loading
    console.log({ currentUser });
    if (gameId) {
      console.log('We have a game id, trying to load game: ', { gameId });
      // if we have a game id, check if there is a game we can load to continue playing and use it if it exists
      const loadGame = async () => {
        // function to load game with id stored in currentGameId state and set current game state
        try {
          const savedState = await loadGameState(currentGameId);
          setGameState(
            savedState || {
              stage: 'team_selection',
              userId: currentUser.id,
              createdAt: serverTimestamp(),
              ended: false,
              won: false,
              lost: false,
              round: 1,
            },
          );
          console.log(
            'Successfully loaded game: ',
            { currentGameId },
            { savedState },
          );
        } catch (error) {
          console.error(
            'Failed to load game with error: ,',
            { currentGameId },
            error,
          );
          throw error;
        }
      };

      // actually loading the game
      try {
        loadGame();
      } catch (error) {
        console.error('Failed to load game: ', error);
      }
    } else {
      // we do not have a game id, so we make a new game
      console.log('We do not have a game id, trying to create a new game');
      const createGame = async (newGame) => {
        // function to create game document based on game object
        try {
          const gamesCollection = collection(firestore, 'games');
          const newGameRef = await addDoc(gamesCollection, newGame);
          const newGameId = newGameRef.id;
          setCurrentGameId(newGameId);
          setGameState(newGame);
          console.log(
            'Successfully created a new game: ',
            { newGameId },
            { newGame },
          );
        } catch (error) {
          console.error('Failed to create new game with error: ', error);
          throw error;
        }
      };

      // new game object
      const newGameState = {
        stage: 'team_selection',
        userId: currentUser.uid,
        createdAt: serverTimestamp(),
        ended: false,
        won: false,
        lost: false,
        round: 1,
      };

      // actually create new game
      try {
        createGame(newGameState);
      } catch (error) {
        console.error('Error creating game: ', error);
      }
    }
  }, [currentUser.uid]);

  useEffect(() => {
    console.log({ gameState });
    if (gameState) {
      try {
        saveGameState(currentGameId, gameState);
      } catch (error) {
        console.log('Error saving game state: ', error);
      }
    }
  }, [gameState, currentUser.uid]);

  const advanceStage = (newState) => {
    setGameState({ ...gameState, ...newState });
  };

  const renderCurrentStage = () => {
    switch (gameState?.stage) {
      // case 'team_selection':
      //   return <TeamSelection onSelect={(team) => advanceStage({ userTeam: team, stage: 'player_selection' })} />;
      // case 'player_selection':
      //   return <PlayerSelection onSelect={(players) => advanceStage({ userPlayers: players, stage: 'match_simulation' })} />;
      // case 'match_simulation':
      //   return <MatchSimulation onComplete={(results) => advanceStage({ matchResults: results, stage: 'results' })} />;
      // case 'results':
      //   return <ResultsDisplay results={gameState.matchResults} onContinue={() => advanceStage({ stage: 'tournament_progress' })} />;
      // case 'tournament_progress':
      //   return <TournamentProgress progress={gameState.tournamentProgress} onContinue={() => advanceStage({ stage: 'team_selection' })} />;
      default:
        return <div>Loading...</div>;
    }
  };

  return <div id="game-loop">{renderCurrentStage()}</div>;
};

export default GameLoop;
