import React, { useState, useEffect } from "react";
import styles from "./form.module.css";

const QuestionaireQ = ({ question, setUserResponse, currentResponse }) => {
  const [selected, setSelected] = useState(currentResponse || "");

  useEffect(() => {
    setSelected(currentResponse || "");
  }, [currentResponse]);

  const handleButtonClick = (response) => {
    setSelected(response);
    setUserResponse(response);
  };

  return (
    <div className={styles.questionaireQ}>
      <div className={styles.question}>{question}</div>
      <div className={styles.buttons}>
        <div
          className={`button glass ${
            selected === "Disagree" ? "selected" : ""
          }`}
          onClick={() => handleButtonClick("Disagree")}
        >
          Disagree
        </div>
        <div
          className={`button glass ${selected === "Neutral" ? "selected" : ""}`}
          onClick={() => handleButtonClick("Neutral")}
        >
          Neutral
        </div>
        <div
          className={`button glass ${selected === "Agree" ? "selected" : ""}`}
          onClick={() => handleButtonClick("Agree")}
        >
          Agree
        </div>
      </div>
    </div>
  );
};

export default QuestionaireQ;
