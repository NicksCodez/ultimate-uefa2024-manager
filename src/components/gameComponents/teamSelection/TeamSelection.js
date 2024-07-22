import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// components
import PageHeader from '../../pageHeader/PageHeader';
import TeamList from '../../teamList/TeamList';

// css
import './TeamSelection.css';

const TeamSelection = ({ onSelect }) => {
  const [team, setTeam] = useState(null);
  const [computerTeams, setComputerTeams] = useState(null);
  const [promptVisible, setPromptVisible] = useState(false);

  // PageHeader functions and components
  const rightElement = (
    <button
      type="button"
      className="general-button confirm-button"
      disabled={team === null}
      onClick={() => onSelect(computerTeams, team)}
    >
      Confirm
    </button>
  );

  const onBackClick = () => {
    // when left button is clicked I want to go back to choosing teams or quit the game depending whether I have chosen a team or not
    if (team) {
      setTeam(null);
      const playerListDiv = document.getElementById('player-list');
      playerListDiv.classList.remove('active');
    } else {
      setPromptVisible(true);
    }
  };

  return (
    <div id="team-selection">
      <PageHeader
        title="Select team"
        backButtonClass={team ? '' : 'general-button danger-button'}
        backButtonText={team ? null : 'Quit'}
        noBackButtonIcon={team === null}
        onBackClick={onBackClick}
        rightElement={rightElement}
      />
      <TeamList
        setSelectedTeam={(unselectedTeams, selectedTeam) => {
          setComputerTeams(unselectedTeams);
          setTeam(selectedTeam);
        }}
      />
      <div
        id="prompt-quit-game"
        className={` ${promptVisible ? '' : 'fade-out'}`}
      >
        <div className="prompt-wrapper">
          <p>Are you sure you want to quit the game?</p>
          <div className="buttons">
            <Link to="/home" className="general-button danger-button">
              Yes
            </Link>
            <button
              type="button"
              className="general-button confirm-button"
              onClick={() => setPromptVisible(false)}
            >
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamSelection;
