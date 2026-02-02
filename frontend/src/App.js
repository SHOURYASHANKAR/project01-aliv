import React, { useEffect, useMemo, useState } from 'react';
import '@/App.css';

const blessings = [
  'Divine Focus',
  'Golden Calm',
  'Sacred Speed',
  'Royal Courage',
  'Mystic Wisdom',
  'Lucky Aura',
];

const getRandomBlessing = () => blessings[Math.floor(Math.random() * blessings.length)];

const getRandomChants = () => {
  const shuffled = [...blessings].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 4);
};

const App = () => {
  const [playerName, setPlayerName] = useState('Shourya');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBlessing, setCurrentBlessing] = useState(getRandomBlessing());
  const [choices, setChoices] = useState(getRandomChants());
  const [statusMessage, setStatusMessage] = useState('Prepare for the royal challenge!');

  const accuracy = useMemo(() => {
    if (score === 0 && !isPlaying) {
      return 0;
    }
    const maxScore = Math.max(score, 1);
    return Math.min(100, Math.round((score / maxScore) * 100));
  }, [isPlaying, score]);

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    if (timeLeft <= 0) {
      setIsPlaying(false);
      setStatusMessage('Time is up! Lodu Maharaj awaits your return.');
      setHighScore((prev) => Math.max(prev, score));
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isPlaying, score, timeLeft]);

  const refreshChoices = (nextBlessing = getRandomBlessing()) => {
    setCurrentBlessing(nextBlessing);
    const options = new Set(getRandomChants());
    options.add(nextBlessing);
    const mixed = Array.from(options).sort(() => Math.random() - 0.5).slice(0, 4);
    setChoices(mixed);
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setIsPlaying(true);
    setStatusMessage('Choose the right blessing to score!');
    refreshChoices(getRandomBlessing());
  };

  const handleChoice = (choice) => {
    if (!isPlaying) {
      return;
    }

    if (choice === currentBlessing) {
      setScore((prev) => prev + 5);
      setStatusMessage('Perfect! Lodu Maharaj is pleased.');
    } else {
      setTimeLeft((prev) => Math.max(prev - 2, 0));
      setStatusMessage('Oops! Try to regain the blessing.');
    }

    refreshChoices(getRandomBlessing());
  };

  return (
    <div className="game-app">
      <header className="game-hero">
        <p className="game-kicker">Lodu Maharaj by Shourya</p>
        <h1>Temple of Blessings</h1>
        <p>
          Match the divine blessing before the timer runs out. Earn points, keep the
          rhythm, and honor the Maharaj.
        </p>
      </header>

      <section className="game-panel">
        <div className="player-card">
          <label htmlFor="player-name">Player Name</label>
          <input
            id="player-name"
            value={playerName}
            onChange={(event) => setPlayerName(event.target.value)}
            placeholder="Your name"
          />
          <div className="player-stats">
            <div>
              <span>Score</span>
              <strong>{score}</strong>
            </div>
            <div>
              <span>High Score</span>
              <strong>{highScore}</strong>
            </div>
            <div>
              <span>Time</span>
              <strong>{timeLeft}s</strong>
            </div>
          </div>
        </div>

        <div className="game-stage">
          <div className="game-status">
            <span className="badge">{isPlaying ? 'Live' : 'Ready'}</span>
            <p>{statusMessage}</p>
          </div>

          <div className="challenge-card">
            <h2>Find this blessing</h2>
            <div className="blessing-name">{currentBlessing}</div>
          </div>

          <div className="choices-grid">
            {choices.map((choice) => (
              <button
                key={choice}
                type="button"
                className="choice-button"
                onClick={() => handleChoice(choice)}
                disabled={!isPlaying}
              >
                {choice}
              </button>
            ))}
          </div>
        </div>

        <aside className="game-sidebar">
          <div className="sidebar-card">
            <h3>How to play</h3>
            <ul>
              <li>Hit “Start Blessing” to begin a 30 second round.</li>
              <li>Pick the matching blessing name to score +5.</li>
              <li>Wrong picks cost 2 seconds.</li>
            </ul>
          </div>
          <div className="sidebar-card highlight">
            <h3>Player Focus</h3>
            <p>
              {playerName || 'The devotee'} has a precision of <strong>{accuracy}%</strong>. Keep
              the rhythm steady and aim for the high score.
            </p>
            <button type="button" className="primary-button" onClick={startGame}>
              {isPlaying ? 'Restart Blessing' : 'Start Blessing'}
            </button>
          </div>
        </aside>
      </section>
    </div>
  );
};

export default App;
