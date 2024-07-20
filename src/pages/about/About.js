import React from 'react';
import { useNavigate } from 'react-router-dom';

// components
import PageHeader from '../../components/homeMenu/pageHeader/PageHeader';

const About = () => {
  const navigate = useNavigate();

  const onBackClick = () => {
    navigate(-1);
  };

  return (
    <div id="about">
      <PageHeader title="About" onBackClick={onBackClick} />
      <div className="about-content">
        <section className="introduction">
          <h3>What is this website?</h3>
          <p>
            This is a simple football simulator app that uses the knockout stage
            of UEFA 2024 as inspiration, built for educational purposes. You can
            choose a team, select your players and hope to become the next
            champion!
          </p>
        </section>

        <section className="disclaimer">
          <h3>Disclaimer</h3>
          <p>
            I do not own any copyright to team or player names or pictures. The
            team pictures were downloaded from{' '}
            <a href="https://en.wikipedia.org/wiki/Main_Page">Wikipedia</a> and
            the player pictures from{' '}
            <a href="https://www.uefa.com/">the official UEFA website</a>. As
            for the player scores, I used{' '}
            <a href="https://www.futbin.com/">EA FC 24 cards</a> as inspiration.
          </p>
        </section>
      </div>
    </div>
  );
};

export default About;
