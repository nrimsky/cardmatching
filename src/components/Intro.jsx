import React from "react";
import { useState, useEffect } from "react";
import { getTranslation } from "../lib/helpers";

export default function Intro({ onComplete, lang }) {
  const [textIndex, setTextIndex] = useState(0);
  const [code, setCode] = useState("");

  const handleNext = () => {
    if (textIndex < allText.length - 1) {
      setTextIndex(textIndex + 1);
    } else {
      onComplete(code);
    }
  };

  const allText = ["", getTranslation("INTRO_TEXT", lang), getTranslation("INSTRUCTIONS_2", lang), getTranslation("INSTRUCTIONS_4", lang)];

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
        <div className="intro-text">{getTranslation("ENTER_CODE", lang)}</div>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button onClick={handleNext}>{getTranslation("CONTINUE", lang)}</button>
      </div>
    );
  }

  return (
    <div className="intro">
      <div className="intro-text">
        <p>{allText[textIndex]}</p>
      </div>
      <p>{textIndex === 3 ? getTranslation("INSTRUCTIONS_5", lang): getTranslation("INSTRUCTIONS_3", lang)}</p>
    </div>
  );
}
