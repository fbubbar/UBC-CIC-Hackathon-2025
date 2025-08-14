"use client";

import React, { useState } from "react";
import Link from "next/link";
import styles from "./form.module.css";
import QuestionaireQ from "./QuestionaireQ";

export default function IntakeForm() {
  const questions = [
    "I see myself build Kitchen Cabinets",
    "I see myself developing a new medicine",
    "I see myself studying ways to reduce water pollution.",
    "I see myself writing books or plays.",
    "I see myself writing books.",
    "I see myself playing a musical instrument.",
    "I see myself teaching someone how to exercise.",
    "I see myself helping people with personal or emotional problems.",
    "I see myself managing a retail store.",
    "I see myself buying and selling stocks.",
    "I see myself creating an extensive spreadsheet.",
    "I see myself proofreading other people's writing.",
    "It is important to me to have a nice office space.",
    "It is important to me to make lots of money.",
    "It is important to me to have a flexible work schedule.",
    "It is important to me to help others through my work.",
    "It is important to me to have opportunities for creativity.",
    "It is important to me to feel secure in my job.",
    "It is important to me to work with people I like and respect.",
  ];

  const [currentPage, setCurrentPage] = useState(0);
  const [nextPageEnabled, setNextPageEnabled] = useState(false);

  /* 1. basic responses */
  const [firstName, setFirstName] = useState("");
  const [resumseFile, setResumseFile] = useState(null);

  /* 2. questionaire responses */
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userResponses, setUserResponses] = useState(
    Array(questions.length).fill("")
  );

  /* 3. soft skills responses */
  const [softSkills, setSoftSkills] = useState("");

  /* 4. career prospects responses */
  const [careerProspects, setCareerProspects] = useState("");

  const setSpecificQuestionResponse = (
    questionIndex: number,
    userResponse: string
  ) => {
    const newUserResponse = [...userResponses];
    newUserResponse[questionIndex] = userResponse;
    setUserResponses(newUserResponse);
  };

  return (
    <div className={styles.container}>
      {currentPage === 0 && (
        <div className={styles.formSection}>
          <div className={styles.inputRow}>
            <input
              className={`${styles.input} glass`}
              id="firstName"
              placeholder="First Name"
            ></input>
            <input
              className={`${styles.input} glass`}
              id="lastName"
              placeholder="Last Name"
            ></input>
          </div>

          <input
            className={`${styles.input} glass`}
            id="email"
            placeholder="Email"
          ></input>
          <input
            type="file"
            accept=".pdf"
            id="resumeUpload"
            className={styles.fileInput}
          ></input>
        </div>
      )}
      {currentPage === 1 && (
        <div id="questionaire">
          <QuestionaireQ
            question={questions[currentQuestion]}
            setUserResponse={(userResponse: string) =>
              setSpecificQuestionResponse(currentQuestion, userResponse)
            }
          ></QuestionaireQ>
        </div>
      )}
      {currentPage === 2 && (
        <div>
          <input
            className={`${styles.input} glass`}
            id="softSkills"
            placeholder="Type soft skills separated by commas"
          ></input>
        </div>
      )}
      {currentPage === 3 && (
        <input
          className={`${styles.input} glass`}
          id="prospects"
          placeholder="Type careers that interest you separated by commas"
        ></input>
      )}
      <div className={styles.buttonContainer}>
        <div
          className={`button glass ${currentPage === 0 ? styles.disabled : ""}`}
          onClick={() => currentPage > 0 && setCurrentPage(currentPage - 1)}
        >
          Back
        </div>
        <div
          className={`button glass ${nextPageEnabled ? "" : styles.disabled}`}
          onClick={() => nextPageEnabled && setCurrentPage(currentPage + 1)}
        >
          Next
        </div>
      </div>
    </div>
  );
}
