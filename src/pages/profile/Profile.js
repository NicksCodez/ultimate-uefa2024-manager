import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';

// firebase
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../../firebase';

// components
import PageHeader from '../../components/pageHeader/PageHeader';

// context
import { useAuth } from '../../contexts/authContext/AuthContext';

// css
import './Profile.css';

const Profile = () => {
  // component state
  const [userData, setUserData] = useState(null);
  const [userDataLoading, setUserDataLoading] = useState(true);
  const [error, setError] = useState(null);

  // logged in user
  const { currentUser } = useAuth();

  useEffect(() => {
    getUserData(currentUser.uid)
      .then((data) => {
        setUserData(data);
        setUserDataLoading(false);
      })
      .catch((fetchError) =>
        console.error('error getting user data: ', fetchError),
      );
  }, []);

  return (
    <div id="profile">
      {!currentUser && <Navigate to="/login" />}
      <PageHeader title="Profile" />
      {!userDataLoading && (
        <div id="profile-main">
          <div className="profile-card">
            <div className="profile-card-left">
              <img src={userData.profilePicUrl} alt="user" />
            </div>
            <div className="profile-card-right">
              <div className="profile-card-name">{userData.name} </div>
              <div className="profile-card-username">@{userData.username} </div>
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
