import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// firebase
import { collection, getDocs, query } from 'firebase/firestore';
import { firestore } from '../../firebase';

// components
import PlayerList from '../playerList/PlayerList';

// utils
import { capitalizeFirstLetters } from '../../utils/stringFunctions/StringFunctions';

// css
import './TeamList.css';

const TeamList = ({ setSelectedTeam = () => null }) => {
  // states
  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);

  // ref
  const teamListRef = useRef();

  // navigator
  const navigate = useNavigate();

  useEffect(() => {
    // load teams
    getTeamsWithPlayers()
      .then((retrievedTeams) => {
        setTeams(retrievedTeams);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error getting teams with players: ', error);
        navigate('/error');
      });
  }, []);

  const onTeamClick = (team) => {
    event.stopPropagation();
    if (teamListRef.current) {
      teamListRef.current.scrollTop = 0;
    }
    setPlayers(team.players);
    const playerListDiv = document.getElementById('player-list');
    playerListDiv.classList.add('active');
    const unselectedTeams = teams.filter((t) => t.name !== team.name);
    setSelectedTeam(unselectedTeams, team);
  };

  return (
    <div id="team-list" ref={teamListRef}>
      {!loading && (
        <ul>
          {teams.map((team) => (
            <li key={team.name}>
              <button type="button" onClick={() => onTeamClick(team)}>
                <img src={team.picture} alt="team-crest" />
                <span>{capitalizeFirstLetters(team.name)}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      <PlayerList players={players} />
    </div>
  );
};

export default TeamList;

const getTeamsWithPlayers = async () => {
  // get all teams
  const teamsCollection = collection(firestore, 'teams');
  const teamsQuery = query(teamsCollection);
  const teamsSnapshot = await getDocs(teamsQuery);

  // make array of promises to get players data concurrently
  const teamsPromises = teamsSnapshot.docs.map(async (teamDoc) => {
    // team data
    const teamName = teamDoc.id;
    const teamData = teamDoc.data();

    // get players subcollection in team
    const playersCollection = collection(
      firestore,
      `teams/${teamName}/players`,
    );
    const playersQuery = query(playersCollection);
    const playersSnapshot = await getDocs(playersQuery);

    // return team and players data
    const players = playersSnapshot.docs.map((playerDoc) => ({
      ...playerDoc.data(),
      docId: playerDoc.id,
    }));
    return {
      name: teamName,
      ...teamData,
      players,
    };
  });

  // await all promises
  const teams = await Promise.all(teamsPromises);

  return teams;
};
