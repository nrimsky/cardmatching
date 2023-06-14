import React from "react";
import { useState, useEffect } from "react";

const text =
  "You are about to take part in an experiment in which you need to categorise cards based on the pictures appearing on them. To begin, you will see four piles.";

const text2 =
  "Each pile has a different number, colour, and shape. A new card is displayed below the piles for which you will determine which pile each belongs to. From left to right, the piles correspond with 'd' 'v' 'n' then 'k.' Press the corresponding key to choose what pile each new card belongs in. The correct answer depends upon a rule, but you will not know what the rule is. But, we will tell you on each trial whether or not you were correct.";

const text3 =
  "Finally, the rule may change during the task, so when it does, you should figure out what the rule is as quickly as possible and change with it.";

const allText = ["", text, text2, text3];

export default function Intro({ onComplete }) {
  const [textIndex, setTextIndex] = useState(0);
  const [code, setCode] = useState("");

  const handleNext = () => {
    if (textIndex < allText.length - 1) {
      setTextIndex(textIndex + 1);
    } else {
      onComplete(code);
    }
  };

  useEffect(() => {
    if (textIndex > 0) {
      window.addEventListener("keydown", handleNext);
      return () => {
        window.removeEventListener("keydown", handleNext);
      };
    }
  }, [textIndex]);

  if (textIndex === 0) {
    return (
      <div className="intro">
        <div className="intro-text">Enter your code</div>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button onClick={handleNext}>Continue</button>
      </div>
    );
  }

  return (
    <div className="intro">
      <div className="intro-text">
        <p>{allText[textIndex]}</p>
      </div>
      <p>Press any key to {textIndex === 3 ? 'begin': 'continue'}</p>
    </div>
  );
}
