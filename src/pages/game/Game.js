import React from 'react';

// context
import { useAuth } from '../../contexts/authContext/AuthContext';

// components
import PromptLogin from '../../components/gameComponents/promptLogin/PromptLogin';
import GameLoop from '../../components/gameComponents/gameLoop/GameLoop';

// css
import './Game.css';

const Game = () => {
  const { loggedIn } = useAuth();

  return <div id="game">{!loggedIn ? <PromptLogin /> : <GameLoop />}</div>;
};

export default Game;
