import React, { useState, useEffect } from 'react';
import Card from './components/Card';
import './App.css'
import { generateDeck, generateNewRule, isCorrectMatch, generateRule } from './lib/helpers';
import Intro from './components/Intro';

const MAX_ROUNDS = 64;
const CONSECUTIVE_CORRECT_ANSWERS = 10;

function App() {
  const [cards, setCards] = useState([]);
  const [rule, setRule] = useState(null);
  const [results, setResults] = useState([]);
  const [refIdx, setRefIdx] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [message, setMessage] = useState('   ');
  const [roundsCompleted, setRoundsCompleted] = useState(0);
  const [introFinished, setIntroFinished] = useState(false);
  const [lastRule, setLastRule] = useState(null);
  const [lastCorr, setLastCorr] = useState(null);
  const [lastCorrectCard, setLastCorrectCard] = useState(null);
  const [persevErrors, setPersevErrors] = useState(0);
  const [persev, setPersev] = useState(0);
  const [subnum, setSubnum] = useState(null);

  useEffect(() => {
    if (introFinished && startTime === null) {
      setStartTime(Date.now());
      startNewRound();
    }
  }, [introFinished]);

  useEffect(() => {
    if (lastRule !== null && rule !== lastRule) {
      setPersev(0);
    }
  }, [rule]);


  const startNewRound = () => {
    let newRule;
    if (rule) {
      newRule = generateNewRule(rule);
    } else {
      newRule = generateRule();
    }
    setRule(newRule);
    const cards = generateDeck(newRule);
    setCards(cards);
  }

  function shouldStartNewRound() {
    if (results.length - refIdx >= CONSECUTIVE_CORRECT_ANSWERS) {
      const last10 = results.slice(results.length - CONSECUTIVE_CORRECT_ANSWERS + 1, results.length);
      // Were all correct?
      if (last10.every(result => result.corr === 1)) {
        return true;
      }
    }
    return false;
  }


  useEffect(() => {
    // Fade message after 2 seconds
    const messageTimer = setTimeout(() => {
      setMessage('   ');
    }, 1000);

    return () => {
      clearTimeout(messageTimer);
    };
  }, [message]);

  const handleCardClick = (card, index) => {
    const isCorrectMatchCard = isCorrectMatch(card, cards[cards.length - 1], rule);
    const abstime = (Date.now() - startTime) / 1000;
    const timeElapsed = abstime - results[results.length - 1]?.abstime ?? 0;
    const persevError = !isCorrectMatchCard && lastRule !== null && isCorrectMatch(card, cards[cards.length - 1], lastRule);

    setResults(prevResults => {
      const newResults = [...prevResults, {
        subnum: subnum,
        trial: prevResults.length + 1,
        run: roundsCompleted + 1,
        rule: rule,
        color: card.color,
        shape: card.shape,
        number: card.number,
        resp: index + 1,
        corr: isCorrectMatchCard ? 1 : 0,
        lastrule: lastRule,
        last_corr: lastCorr,
        corr_col: lastCorrectCard?.color,
        corr_shape: lastCorrectCard?.shape,
        corr_num: lastCorrectCard?.number,
        persev: persev,
        persev_err: persevError ? 1 : 0,
        rt: timeElapsed,
        abstime: abstime,
      }];
      return newResults;
    });

    setLastRule(rule);
    setLastCorr(isCorrectMatchCard);
    setLastCorrectCard(cards[cards.length - 1]);
    setPersevErrors(persevErrors + (persevError ? 1 : 0));
    setPersev(persev + (isCorrectMatchCard ? 0 : 1));

    setMessage(isCorrectMatchCard ? 'Correct!' : 'Incorrect!');

    if (shouldStartNewRound()) {
      setRoundsCompleted(roundsCompleted + 1);
      startNewRound();
      setRefIdx(results.length);
    } else {
      const newDeck = generateDeck(rule);
      setCards(newDeck);
    }
  };


  useEffect(() => {
    // dvnk maps to 0123 for the 4 cards
    // we have onPress listeners for keys d v n k
    if (!introFinished) {
      return;
    }
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
  }, [cards, handleCardClick, introFinished]);

  const exportResults = () => {
    let csvContent = "subnum,trial,run,rule,color,shape,number,resp,corr,lastrule,last_corr,corr_col,corr_shape,corr_num,persev,persev_err,rt,abstime\n";
    results.forEach(function (rowArray) {
      let row = Object.values(rowArray).join(",");
      csvContent += row + "\r\n";
    });

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = "results.csv";
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

  if (!introFinished) {
    return <Intro onComplete={(code) => {
      setIntroFinished(true);
      setSubnum(code);
    }} />
  }

  return (
    <div className='game'>
      <h1>Card Sorting Task</h1>
      <div className='top-cards'>

        {cards.slice(0, 4).map((card, index) => (
          <div className='card-wrapper' key={index} >
            <Card {...card} id={index} isSelectable={true} onClick={() => handleCardClick(card, index)} />
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
