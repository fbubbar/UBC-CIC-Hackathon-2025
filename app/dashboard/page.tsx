"use client";

import { useState } from "react";
import Link from "next/link";
import "./dashboard.css";
import DashboardContent from "./DashboardContent";

export default function Dashboard() {
  const jobOutput = {
    career_title: {
      type: "string",
      description: "Job Title from input.",
    },
    onet_code: {
      type: "string",
      description: "O*NET-SOC Code.",
    },
    summary: {
      type: "string",
      description:
        "LLM-generated comprehensive overview based on all sections.",
    },
    onet_data: {
      type: "object",
      description: "Structured extraction of O*NET data from the input.",
      schema: "OnetData",
    },
    work_experience: {
      type: "object",
      description: "Qualitative work experience insights.",
      schema: "WorkExperience",
    },
    career_pathway: {
      type: "object",
      description: "Generated career pathway.",
      schema: "CareerPathway",
    },
    resources: {
      type: "object",
      description: "Resources, including O*NET tech/tools.",
      schema: "Resources",
    },
    alternative_careers: {
      type: "array",
      description: "Alternatives based on RELATED OCCUPATIONS.",
      items: "AlternativeCareer",
    },
  };

  const userOutputer = {
    job_output: jobOutput,
  };

  const [isCard, setIsCard] = useState(true);

  return (
    <div className="min-h-screen bg-gray-100">
      {isCard ? (
        <CardView setIsCard={setIsCard} />
      ) : (
        <DashboardContent></DashboardContent>
      )}
    </div>
  );
}

const CardView = ({ setIsCard }: { setIsCard: (isCard: boolean) => void }) => {
  return (
    <div className="cardViewContainer">
      <div style={{ fontSize: "2rem" }}>You are:</div>
      <img className="cardViewImage" src="/creative.png" alt="The Creative" />
      <div className="glass button" onClick={() => setIsCard(false)}>
        begin your journey
      </div>
    </div>
  );
};
