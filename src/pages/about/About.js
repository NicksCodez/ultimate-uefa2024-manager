import React from 'react';
import { useNavigate } from 'react-router-dom';

// components
import PageHeader from '../../components/pageHeader/PageHeader';

// css
import './About.css';

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
            team pictures were downloaded from&nbsp;
            <a
              href="https://en.wikipedia.org/wiki/Main_Page"
              target="_blank"
              rel="noopener noreferrer"
            >
              Wikipedia
            </a>
            &nbsp;and the player pictures from&nbsp;
            <a
              href="https://www.uefa.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              the official UEFA website
            </a>
            . As for the player scores, I used&nbsp;
            <a
              href="https://www.futbin.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              EA FC 24 cards
            </a>
            &nbsp;as inspiration. To avoid boring manual data entry, I found two
            helpful datasets on Kaggle &#40;
            <a
              href="https://www.kaggle.com/datasets/damirdizdarevic/uefa-euro-2024-players"
              target="_blank"
              rel="noopener noreferrer"
            >
              one
            </a>
            &nbsp;and&nbsp;
            <a
              href="https://www.kaggle.com/datasets/stefanoleone992/ea-sports-fc-24-complete-player-dataset"
              target="_blank"
              rel="noopener noreferrer"
            >
              two
            </a>
            &#41;.
          </p>
        </section>
      </div>
    </div>
  );
};

export default About;
