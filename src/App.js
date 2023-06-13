import React, { useState, useEffect } from 'react';
import Card from './components/Card';
import './App.css'
import { generateDeck, generateRule, isCorrectMatch } from './lib/helpers';


function App() {
  const [cards, setCards] = useState([]);
  const [rule, setRule] = useState();
  const [results, setResults] = useState([{
    nCorrect: 0,
    nIncorrect: 0,
    timeElapsed: 0,
  }]);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    const newRule = generateRule();
    setRule(newRule);
    const cards = generateDeck(newRule);
    setCards(cards);
    setStartTime(Date.now()); // Set the start time when a new rule is generated
  }, []);

  useEffect(() => {
    const lastResult = results[results.length - 1];
    if (lastResult.nCorrect === 10) {
      const newRule = generateRule();
      setRule(newRule);
      const cards = generateDeck(newRule);
      setCards(cards);

      // Get the end time of the round
      const endTime = Date.now();

      // Calculate time elapsed in seconds
      const timeElapsed = (endTime - startTime) / 1000;

      // Push the timeElapsed to the lastResult and start a new round
      setResults(prevResults => {
        const newResults = [...prevResults];
        newResults[newResults.length - 1].timeElapsed = timeElapsed;
        return [...newResults, {
          nCorrect: 0,
          nIncorrect: 0,
          timeElapsed: null,
        }];
      });

      // Set the start time for the new round
      setStartTime(Date.now());
    }
  }, [results]);

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

  return (
    <div className='game'>
      <h1>Card matching exercise</h1>
      <p>Click on the top card that matches the bottom card</p>
      <div className='top-cards'>
        {cards.slice(0, 5).map((card, index) => (
          <Card {...card} id={index} isSelectable={true} key={index} onClick={() => {
            const isCorrectMatchCard = isCorrectMatch(card, cards[cards.length - 1], rule);
            console.log(isCorrectMatchCard, rule);
            if (isCorrectMatchCard) {
              setResults(prevResults => {
                const newResults = [...prevResults];
                newResults[newResults.length - 1].nCorrect++;
                return newResults;
              });
            } else {
              setResults(prevResults => {
                const newResults = [...prevResults];
                newResults[newResults.length - 1].nIncorrect++;
                return newResults;
              });
            }
            const newDeck = generateDeck(rule);
            setCards(newDeck);
          }} />
        ))}
      </div>
      <div className='bottom-card'>
        <Card {...cards[cards.length - 1]} />
      </div>
      <button className='export' onClick={exportResults}>Export results</button>
    </div>
  );
}

export default App;
