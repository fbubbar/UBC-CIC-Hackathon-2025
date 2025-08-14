import React from "react";

const QuestionaireQ = ({ question, setUserResponse }) => {
  const [selected, setSelected] = useState("");
  const handleButtonClick = (response) => {
    setSelected(response);
    setUserResponse(response);
  };
  return (
    <div className={styles.questionaireQ}>
      <div className={styles.question}>{question}</div>
      <div className={styles.buttons}>
        {/*if selected, add selected class to button otherwise keep default*/}
        <div
          className={`button glass ${selected && "selected"}`}
          onClick={() => handleButtonClick("Disagree")}
        >
          Disagree
        </div>
        <div
          className={`button glass ${selected && "selected"}`}
          onClick={() => handleButtonClick("Neutral")}
        >
          Nuteral
        </div>
        <div
          className={`button glass ${selected && "selected"}`}
          onClick={() => handleButtonClick("Agree")}
        >
          Agree
        </div>
      </div>
    </div>
  );
};

export default QuestionaireQ;
