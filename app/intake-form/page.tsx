"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./form.module.css";
import QuestionaireQ from "./QuestionaireQ";
import { generateMockCareerAnalysis } from "../../lib/mockCareerData";

export default function IntakeForm() {
  const router = useRouter();

  const questions = [
    "I see myself building kitchen cabinets",
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
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  /* 2. questionnaire responses */
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

  const validateCurrentPage = () => {
    switch (currentPage) {
      case 0:
        return (
          firstName.trim() !== "" &&
          lastName.trim() !== "" &&
          email.trim() !== ""
        );
      case 1:
        return userResponses[currentQuestion].trim() !== "";
      case 2:
        return softSkills.trim() !== "";
      case 3:
        return careerProspects.trim() !== "";
      default:
        return false;
    }
  };

  useEffect(() => {
    setNextPageEnabled(validateCurrentPage());
  }, [
    currentPage,
    firstName,
    lastName,
    email,
    resumeFile,
    userResponses,
    softSkills,
    careerProspects,
    currentQuestion,
  ]);

  const handleNext = () => {
    if (currentPage === 1) {
      // On questionnaire page
      if (currentQuestion < questions.length - 1) {
        // Move to next question
        setCurrentQuestion(currentQuestion + 1);
      } else {
        // All questions answered, move to next page
        setCurrentPage(currentPage + 1);
      }
    } else if (currentPage < 3) {
      // On other pages, move to next page
      setCurrentPage(currentPage + 1);
      if (currentPage === 0) {
        setCurrentQuestion(0);
      }
    }
  };

  const handleBack = () => {
    if (currentPage === 1) {
      // On questionnaire page
      if (currentQuestion > 0) {
        // Move to previous question
        setCurrentQuestion(currentQuestion - 1);
      } else {
        // On first question, go back to previous page
        setCurrentPage(currentPage - 1);
      }
    } else if (currentPage > 0) {
      // On other pages, move to previous page
      setCurrentPage(currentPage - 1);
    }
  };

  const handleSubmit = () => {
    // Create form data object
    const formData = {
      firstName,
      lastName,
      email,
      questionnaireResponses: userResponses,
      softSkills: softSkills.split(",").map((skill) => skill.trim()).filter(skill => skill),
      careerProspects: careerProspects.split(",").map((prospect) => prospect.trim()).filter(prospect => prospect),
    };

    console.log("Form data:", formData);

    // Generate mock career analysis
    const analysisResult = generateMockCareerAnalysis(formData);
    
    // Store results in localStorage for the results page
    localStorage.setItem('careerAnalysisResult', JSON.stringify(analysisResult));
    localStorage.setItem('userFormData', JSON.stringify(formData));

    // Navigate to results page
    router.push('/results');
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle arrow keys if not focused on an input
      if (document.activeElement?.tagName === "INPUT") {
        return;
      }

      const isLastPage = currentPage === 3;
      const isBackDisabled =
        currentPage === 0 || (currentPage === 1 && currentQuestion === 0);

      if (event.key === "ArrowRight") {
        event.preventDefault();
        if (nextPageEnabled) {
          if (isLastPage) {
            handleSubmit();
          } else {
            handleNext();
          }
        }
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        if (!isBackDisabled) {
          handleBack();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPage, currentQuestion, nextPageEnabled]);

  const isLastPage = currentPage === 3;
  const isBackDisabled =
    currentPage === 0 || (currentPage === 1 && currentQuestion === 0);

  return (
    <div className={styles.container}>
      {currentPage === 0 && (
        <div className={styles.formSection}>
          <div className={styles.inputRow}>
            <input
              className={`${styles.input} glass`}
              id="firstName"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              className={`${styles.input} glass`}
              id="lastName"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <input
            className={`${styles.input} glass`}
            id="email"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div style={{ fontSize: "1rem", color: "white" }}>
            Upload your resume
          </div>
          <input
            type="file"
            accept=".pdf"
            id="resumeUpload"
            placeholder="Upload your resume"
            style={{ height: "4rem" }}
            className={styles.fileInput}
            onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
          />
        </div>
      )}

      {currentPage === 1 && (
        <div id="questionnaire">
          <div className={styles.questionProgress}>
            Question {currentQuestion + 1} of {questions.length}
          </div>
          <QuestionaireQ
            question={questions[currentQuestion]}
            setUserResponse={(userResponse: string) =>
              setSpecificQuestionResponse(currentQuestion, userResponse)
            }
            currentResponse={userResponses[currentQuestion]}
          />
        </div>
      )}

      {currentPage === 2 && (
        <div>
          <input
            className={`${styles.input} glass`}
            id="softSkills"
            style={{ width: "30rem" }}
            placeholder="Type soft skills separated by commas"
            value={softSkills}
            onChange={(e) => setSoftSkills(e.target.value)}
          />
        </div>
      )}

      {currentPage === 3 && (
        <input
          className={`${styles.input} glass`}
          id="prospects"
          style={{ width: "30rem" }}
          placeholder="Type careers that interest you separated by commas"
          value={careerProspects}
          onChange={(e) => setCareerProspects(e.target.value)}
        />
      )}

      <div className={styles.buttonContainer}>
        <div
          className={`button glass ${isBackDisabled ? styles.disabled : ""}`}
          onClick={handleBack}
        >
          Back
        </div>
        <div
          className={`button glass ${!nextPageEnabled ? styles.disabled : ""}`}
          onClick={isLastPage ? handleSubmit : handleNext}
        >
          {isLastPage ? "Submit" : "Next"}
        </div>
      </div>
    </div>
  );
}
