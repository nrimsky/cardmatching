import React, { useState, useEffect } from 'react';
import Card from './components/Card';
import './App.css'
import { generateDeck, generateNewRule, isCorrectMatch, generateRule, getCorrectMatch } from './lib/helpers';
import Intro from './components/Intro';

const MAX_CLICKS = 64;
const CONSECUTIVE_CORRECT_ANSWERS = 10;

const FINISHED_TEXT = "You have now completed the task. Please download the results by clicking 'export results,' and email them to the investigator. Once you have downloaded your results, you may close this page and return to the survey.";

function App() {
  const [cards, setCards] = useState([]);
  const [rule, setRule] = useState(null);
  const [results, setResults] = useState([]);
  const [refIdx, setRefIdx] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [message, setMessage] = useState('   ');
  const [roundsCompleted, setRoundsCompleted] = useState(0);
  const [introFinished, setIntroFinished] = useState(false);
  const [subnum, setSubnum] = useState(null);
  const [selectedCardIndex, setSelectedCardIndex] = useState(null);
  const [lastRule, setLastRule] = useState(null);

  useEffect(() => {
    if (introFinished && startTime === null) {
      setStartTime(Date.now());
      startNewRound();
    }
  }, [introFinished]);


  const startNewRound = () => {
    setLastRule(rule);
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
    // Fade message after 1 second
    const messageTimer = setTimeout(() => {
      setMessage('   ');
    }, 1000);

    return () => {
      clearTimeout(messageTimer);
    };
  }, [message]);

  const handleCardClick = (card, index) => {
    setSelectedCardIndex(index);
    const isCorrectMatchCard = isCorrectMatch(card, cards[cards.length - 1], rule);
    const persevError = !isCorrectMatchCard && lastRule !== null && isCorrectMatch(card, cards[cards.length - 1], lastRule);
    const persev = (results[results.length-1]?.persev ?? 0) + (persevError ? 1: 0);
    const lastCorr = results[results.length]?.corr;
    const correctMatch = getCorrectMatch(cards[cards.length - 1], rule);
    const abstime = (Date.now() - startTime) / 1000;
    let timeElapsed;
    if (results.length > 0) {
      timeElapsed = abstime - results[results.length - 1]?.abstime ?? 0;
    } else {
      timeElapsed = abstime;
    }
    const resp = ['d', 'v', 'n', 'k'][index];
    setResults(prevResults => {
      const newResults = [...prevResults, {
        subnum: subnum,
        trial: prevResults.length + 1,
        run: roundsCompleted + 1,
        rule: rule,
        color: cards[cards.length - 1].color,
        shape: cards[cards.length - 1].shape,
        number: cards[cards.length - 1].number,
        resp: resp,
        corr: isCorrectMatchCard ? 1 : 0,
        last_corr: lastCorr,
        corr_col: correctMatch.color,
        corr_shape: correctMatch.shape,
        corr_num: correctMatch.number,
        persev: persev,
        persev_err: persevError ? 1 : 0,
        rt: timeElapsed,
        abstime: abstime,
      }];
      return newResults;
    });

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
    if (!introFinished) {
      return;
    }

    const handleKeyDown = (event) => {
      const key = event.key;
      let index;
      if (key === 'd') {
        index = 0;
      } else if (key === 'v') {
        index = 1;
      } else if (key === 'n') {
        index = 2;
      } else if (key === 'k') {
        index = 3;
      }
      if (index !== undefined) {
        handleCardClick(cards[index], index);
      }
    };

    const handleKeyUp = (event) => {
      setSelectedCardIndex(null);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [cards, introFinished]);

  const exportResults = () => {
    let csvContent = "subnum,trial,run,rule,color,shape,number,resp,corr,last_corr,corr_col,corr_shape,corr_num,persev,persev_err,rt,abstime\n";
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



  if (results.length >= MAX_CLICKS) {
    return (
      <div className='game'>
        <h1>Task Finished</h1>
        <p>{FINISHED_TEXT}</p>
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
            <Card {...card} id={index} isSelectable={true} onClick={() => handleCardClick(card, index)} isSelected={index === selectedCardIndex} />
            <span className='letter'>{['d', 'v', 'n', 'k'][index]}</span>
          </div>
        ))}

      </div>
      <div className='bottom-section'>
        <Card {...cards[cards.length - 1]} />
        <p className={message.includes('Correct') ? 'message success' : 'message error'}>{message}</p>
      </div>

      <button className='export' onClick={exportResults}>Export results</button>
    </div>
  );
}

export default App;
