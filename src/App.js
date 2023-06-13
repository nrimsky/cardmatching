import React, { useState, useEffect } from 'react';
import Card from './components/Card';
import './App.css'
import { generateDeck, generateRule, isCorrectMatch } from './lib/helpers';

const MAX_ROUNDS = 64;
const CONSECUTIVE_CORRECT_ANSWERS = 10;

function App() {
  const [cards, setCards] = useState([]);
  const [rule, setRule] = useState();
  const [results, setResults] = useState([]);
  const [refIdx, setRefIdx] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [message, setMessage] = useState('   ');
  const [roundsCompleted, setRoundsCompleted] = useState(0);

  useEffect(() => {
    startNewRound();
  }, []);

  const startNewRound = () => {
    const newRule = generateRule();
    setRule(newRule);
    const cards = generateDeck(newRule);
    setCards(cards);
    setStartTime(Date.now()); // Set the start time when a new rule is generated
    setRefIdx(results.length);
  }

  useEffect(() => {
    if (results.length - refIdx >= 10) {
      const last10 = results.slice(results.length - CONSECUTIVE_CORRECT_ANSWERS, results.length);
      // Were all correct?
      if (last10.every(result => result.isCorrect)) {
        startNewRound();
        setRoundsCompleted(prevRoundsCompleted => prevRoundsCompleted + 1);
      }
    }
  }, [results, refIdx]);

  useEffect(() => {
    // Fade message after 2 seconds
    const messageTimer = setTimeout(() => {
      setMessage('   ');
    }, 1000);

    return () => {
      clearTimeout(messageTimer);
    };
  }, [message]);

  const handleCardClick = (card) => {

    const isCorrectMatchCard = isCorrectMatch(card, cards[cards.length - 1], rule);
    const timeElapsed = Date.now() - startTime;

    setResults(prevResults => {
      const newResults = [...prevResults, {
        isCorrect: isCorrectMatchCard,
        timeElapsed: timeElapsed / 1000,
        rule: rule,
      }];
      return newResults;
    });

    setMessage(isCorrectMatchCard ? 'Correct!' : 'Incorrect!');

    const newDeck = generateDeck(rule);
    setCards(newDeck);

    setStartTime(Date.now());
  };

  useEffect(() => {
    // dvnk maps to 0123 for the 4 cards
    // we have onPress listeners for keys d v n k
    const handleKeyPress = (event) => {
      const key = event.key;
      if (key === 'd') {
        handleCardClick(cards[0]);
      } else if (key === 'v') {
        handleCardClick(cards[1]);
      } else if (key === 'n') {
        handleCardClick(cards[2]);
      } else if (key === 'k') {
        handleCardClick(cards[3]);
      }
    };

    document.addEventListener('keypress', handleKeyPress);

    return () => {
      document.removeEventListener('keypress', handleKeyPress);
    };
  }, [cards]);


  const exportResults = () => {
    const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = "results.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  if (roundsCompleted >= MAX_ROUNDS) {
    return (
      <div className='game'>
        <h1>Task Finished</h1>
        <p>All rounds completed.</p>
        <button className='export' onClick={exportResults}>Export results</button>
      </div>
    );
  }

  return (
    <div className='game'>
      <h1>Card Sorting Task</h1>
      <div className='top-cards'>

        {cards.slice(0, 4).map((card, index) => (
          <div className='card-wrapper' key={index} >
            <Card {...card} id={index} isSelectable={true} onClick={() => handleCardClick(card)} />
            <span className='letter'>{['d', 'v', 'n', 'k'][index]}</span>
          </div>
        ))}

      </div>
      <div className='bottom-card'>
        <Card {...cards[cards.length - 1]} />
      </div>
      <p className={message.includes('Correct') ? 'message success' : 'message error'}>{message}</p>
      <button className='export' onClick={exportResults}>Export results</button>
    </div>
  );
}

export default App;
