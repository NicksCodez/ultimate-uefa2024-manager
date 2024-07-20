import React from 'react';
import { useNavigate } from 'react-router-dom';

// components
import PageHeader from '../../components/homeMenu/pageHeader/PageHeader';
import TeamList from '../../components/teamList/TeamList';

const Teams = () => {
  const navigate = useNavigate();

  const onBackClick = () => {
    navigate(-1);
  };

  return (
    <div id="teams">
      <PageHeader title="Teams" onBackClick={onBackClick} />
      <TeamList />
    </div>
  );
};

export default Teams;
