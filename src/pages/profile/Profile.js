import React, { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';

// firebase
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../../firebase';

// components
import PageHeader from '../../components/pageHeader/PageHeader';

// context
import { useAuth } from '../../contexts/authContext/AuthContext';

// css
import './Profile.css';

// assets
import DefaultProfile from '../../../assets/defaults/default_profile.png';

const Profile = () => {
  // component state
  const [userData, setUserData] = useState(null);
  const [userDataLoading, setUserDataLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // logged in user
  const { currentUser } = useAuth();

  // back click function
  const onBackClick = () => {
    navigate(-1);
  };

  useEffect(() => {
    if (!currentUser.isAnonymous) {
      getUserData(currentUser.uid)
        .then((data) => {
          setUserData(data);
          setUserDataLoading(false);
        })
        .catch((fetchError) =>
          console.error('error getting user data: ', fetchError),
        );
    } else {
      setUserDataLoading(false);
    }
  }, []);

  return (
    <div id="profile">
      {!currentUser && <Navigate to="/login" />}
      <PageHeader title="Profile" onBackClick={onBackClick} />
      {!userDataLoading && (
        <div id="profile-main">
          <div className="profile-card">
            <div className="profile-card-left">
              <img
                src={
                  !currentUser.isAnonymous
                    ? userData.profilePicUrl
                    : DefaultProfile
                }
                alt="user"
              />
            </div>
            <div className="profile-card-right">
              <div className="profile-card-name">
                {!currentUser.isAnonymous ? userData.name : 'Anon'}{' '}
              </div>
              <div className="profile-card-username">
                @{!currentUser.isAnonymous ? userData.username : 'anon'}{' '}
              </div>
            </div>
          </div>
          <Link to="/logout" className="authentication-button">
            Log out
          </Link>
        </div>
      )}
    </div>
  );
};

export default Profile;

const getUserData = async (uid) => {
  try {
    const userRef = doc(firestore, 'users', uid);
    const userDoc = await getDoc(userRef);
    return userDoc.data();
  } catch (error) {
    console.error('Error fetching user data: ', error);
  }
  return {};
};
