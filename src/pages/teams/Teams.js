import React from 'react';
import { useNavigate } from 'react-router-dom';

// components
import PageHeader from '../../components/pageHeader/PageHeader';
import TeamList from '../../components/teamList/TeamList';

// css
import './Teams.css';

const Teams = () => {
  const navigate = useNavigate();

  const onBackClick = () => {
    const playerListDiv = document.getElementById('player-list');
    if (playerListDiv.classList.contains('active')) {
      playerListDiv.classList.remove('active');
    } else {
      navigate(-1);
    }
  };

  return (
    <div id="teams">
      <PageHeader title="Teams" onBackClick={onBackClick} />
      <TeamList />
    </div>
  );
};

export default Teams;
