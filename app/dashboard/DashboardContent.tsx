"use client";

import { useState } from "react";
import Link from "next/link";
import "./dashboard.css";

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
      {isCard ? <CardView setIsCard={setIsCard} /> : <DashboardContent />}
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

const DashboardContent = () => {
  const [expandedSections, setExpandedSections] = useState({
    getStarted: false,
    jobResources: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="dashboardContainer">
      <aside className="sidebar glass">
        <div className="userProfile">
          <div className="userAvatar">
            <span>↗</span>
          </div>
          <div className="userInfo">
            <h3>Ali Hosseini</h3>
            <p>The Creative</p>
            <span>
              Imaginative, expressive, and driven to design, perform, or craft
              original works.
            </span>
          </div>
        </div>

        <nav className="navigation">
          <Link href="/" className="navItem">
            <span>Home</span>
            <span>↗</span>
          </Link>
          <Link href="/search" className="navItem">
            <span>Search Jobs</span>
            <span>↗</span>
          </Link>
          <Link href="/resources" className="navItem">
            <span>Resources</span>
            <span>↗</span>
          </Link>
          <Link href="/settings" className="navItem">
            <span>Settings</span>
            <span>↗</span>
          </Link>
        </nav>

        <div className="themeToggle">
          <button className="themeButton">🌙</button>
          <button className="themeButton">☀️</button>
        </div>
      </aside>

      <main className="mainContent">
        <div className="contentHeader">
          <h1>Product Marketing</h1>
          <div className="tags">
            <span className="tag glass">Marketing</span>
            <span className="tag glass">Building</span>
            <span className="tag glass">Design</span>
          </div>
        </div>

        <p className="jobDescription">
          Product marketing bridges the gap between a product and its target
          audience by defining its positioning, messaging, and go-to-market
          strategy. It involves understanding customer needs, analyzing market
          trends, and collaborating with product, sales, and marketing teams to
          drive adoption. The role focuses on ensuring the product's value is
          clearly communicated and resonates in the market to boost growth.
        </p>

        <div className="chartsContainer">
          <div className="chartCard glass">
            <h3>Demand Projection</h3>
            <div className="chartPlaceholder">
              <div className="chartArea">
                <svg viewBox="0 0 400 200" className="chartSvg">
                  <defs>
                    <linearGradient
                      id="demandGradient"
                      x1="0%"
                      y1="0%"
                      x2="0%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="rgba(59, 130, 246, 0.4)" />
                      <stop offset="100%" stopColor="rgba(59, 130, 246, 0.1)" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 0 160 Q 200 120 400 100 L 400 200 L 0 200 Z"
                    fill="url(#demandGradient)"
                  />
                  <path
                    d="M 0 160 Q 200 120 400 100"
                    stroke="rgba(59, 130, 246, 1)"
                    strokeWidth="2"
                    fill="none"
                  />
                  <circle cx="0" cy="160" r="4" fill="rgba(59, 130, 246, 1)" />
                  <circle
                    cx="200"
                    cy="110"
                    r="4"
                    fill="rgba(59, 130, 246, 1)"
                  />
                  <circle
                    cx="400"
                    cy="100"
                    r="4"
                    fill="rgba(59, 130, 246, 1)"
                  />
                </svg>
                <div className="chartLabels">
                  <span>2025</span>
                  <span>2030</span>
                  <span>2035</span>
                </div>
              </div>
            </div>
          </div>
          <div className="chartCard glass">
            <h3>Salary Projection</h3>
            <div className="chartPlaceholder">
              <div className="chartArea">
                <svg viewBox="0 0 400 200" className="chartSvg">
                  <defs>
                    <linearGradient
                      id="salaryGradient"
                      x1="0%"
                      y1="0%"
                      x2="0%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="rgba(59, 130, 246, 0.4)" />
                      <stop offset="100%" stopColor="rgba(59, 130, 246, 0.1)" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 0 155 Q 200 100 400 80 L 400 200 L 0 200 Z"
                    fill="url(#salaryGradient)"
                  />
                  <path
                    d="M 0 155 Q 200 100 400 80"
                    stroke="rgba(59, 130, 246, 1)"
                    strokeWidth="2"
                    fill="none"
                  />
                  <circle cx="0" cy="155" r="4" fill="rgba(59, 130, 246, 1)" />
                  <circle
                    cx="200"
                    cy="100"
                    r="4"
                    fill="rgba(59, 130, 246, 1)"
                  />
                  <circle cx="400" cy="80" r="4" fill="rgba(59, 130, 246, 1)" />
                </svg>
                <div className="chartLabels">
                  <span>2025</span>
                  <span>2030</span>
                  <span>2035</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="publicOpinion">
          <h2>Public Opinion</h2>
          <div className="opinionCards">
            <div className="opinionCard glass">
              <div className="cardHeader">
                <span className="icon">👤</span>
                <h4>Reddit</h4>
              </div>
              <p>
                This job is really hard for people pivoting from SWE roles.
                Definitely fits people with a larger background in Business and
                Marketing.
              </p>
            </div>
            <div className="opinionCard glass">
              <div className="cardHeader">
                <span className="icon">👤</span>
                <h4>LinkedIn</h4>
              </div>
              <p>
                Many PMMs say the hardest part of the job isn't the launch—it's
                getting cross-functional teams aligned beforehand.
              </p>
            </div>
            <div className="opinionCard glass">
              <div className="cardHeader">
                <span className="icon">👤</span>
                <h4>Other</h4>
              </div>
              <p>
                A lot of people underestimate how much data analysis goes into
                product marketing—it's not just about creative campaigns.
              </p>
            </div>
          </div>
        </section>

        <div className="expandableSections">
          <div className="expandableSection glass">
            <button
              className="sectionHeader"
              onClick={() => toggleSection("getStarted")}
            >
              <span className="expandIcon">+</span>
              <span>Get Started</span>
              <span>↗</span>
            </button>
            {expandedSections.getStarted && (
              <div className="sectionContent">
                <p>Content for getting started with Product Marketing...</p>
              </div>
            )}
          </div>

          <div className="expandableSection glass">
            <button
              className="sectionHeader"
              onClick={() => toggleSection("jobResources")}
            >
              <span className="expandIcon">+</span>
              <span>Job Resources</span>
              <span>↗</span>
            </button>
            {expandedSections.jobResources && (
              <div className="sectionContent">
                <p>
                  Resources and tools for Product Marketing professionals...
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
