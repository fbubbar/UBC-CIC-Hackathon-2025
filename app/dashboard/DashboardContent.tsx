"use client";

import { useState } from "react";
import Link from "next/link";
import "./dashboard.css";

interface JobData {
  title: string;
  tags: string[];
  description: string;
}

const DashboardContent = () => {
  const [currentView, setCurrentView] = useState<"cards" | "details">("cards");
  const [selectedJob, setSelectedJob] = useState<string>("product-marketing");
  const [expandedSections, setExpandedSections] = useState({
    getStarted: false,
    jobResources: false,
  });

  const jobsData: { [key: string]: JobData } = {
    "ui-ux-designer": {
      title: "UI/UX Designer",
      tags: ["Building", "Design", "Tech"],
      description:
        "A UI/UX designer creates intuitive, visually appealing, and user-friendly digital experiences by combining design principles with user research. They focus on understanding user needs, crafting wireframes and prototypes, and refining interfaces for both aesthetics and functionality. The goal is to ensure every interaction feels seamless and engaging.",
    },
    "product-manager": {
      title: "Product Manager",
      tags: ["Building", "Tech"],
      description:
        "A product manager guides a product's vision, strategy, and development from concept to launch. They act as the link between business, design, and engineering teams, prioritizing features based on user needs and company goals. The role centers on delivering products that solve problems, delight users, and drive business impact.",
    },
  };

  const handleJobSelect = (jobKey: string) => {
    setSelectedJob(jobKey);
    setCurrentView("details");
  };

  const handleBackToCards = () => {
    setCurrentView("cards");
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const currentJobData = jobsData[selectedJob];

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
          {currentView === "details" && (
            <button onClick={handleBackToCards} className="navItem navButton">
              <span>← Back to Jobs</span>
            </button>
          )}
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

      {currentView === "cards" ? (
        <main className="cardsMainContent">
          <div className="jobCardsGrid">
            <div
              className="jobCard glass"
              onClick={() => handleJobSelect("ui-ux-designer")}
            >
              <h3>UI/UX Designer</h3>
              <div className="tags">
                <span className="tag glass">Building</span>
                <span className="tag glass">Design</span>
                <span className="tag glass">Tech</span>
              </div>
              <p>
                A UI/UX designer creates intuitive, visually appealing, and
                user-friendly digital experiences by combining design principles
                with user research. They focus on understanding user needs,
                crafting wireframes and prototypes, and refining interfaces for
                both aesthetics and functionality. The goal is to ensure every
                interaction feels seamless and engaging.
              </p>
              <div className="cardArrow">→</div>
            </div>

            <div
              className="jobCard glass"
              onClick={() => handleJobSelect("product-manager")}
            >
              <h3>Product Manager</h3>
              <div className="tags">
                <span className="tag glass">Building</span>
                <span className="tag glass">Tech</span>
              </div>
              <p>
                A product manager guides a product's vision, strategy, and
                development from concept to launch. They act as the link between
                business, design, and engineering teams, prioritizing features
                based on user needs and company goals. The role centers on
                delivering products that solve problems, delight users, and
                drive business impact.
              </p>
              <div className="cardArrow">→</div>
            </div>
          </div>
        </main>
      ) : (
        <main className="mainContent">
          <div className="contentHeader">
            <h1>{currentJobData.title}</h1>
            <div className="tags">
              {currentJobData.tags.map((tag, index) => (
                <span key={index} className="tag glass">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <p className="jobDescription">{currentJobData.description}</p>

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
                        <stop
                          offset="100%"
                          stopColor="rgba(59, 130, 246, 0.1)"
                        />
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
                    <circle
                      cx="0"
                      cy="160"
                      r="4"
                      fill="rgba(59, 130, 246, 1)"
                    />
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
                        id="salaryGradientDetail"
                        x1="0%"
                        y1="0%"
                        x2="0%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="rgba(59, 130, 246, 0.4)" />
                        <stop
                          offset="100%"
                          stopColor="rgba(59, 130, 246, 0.1)"
                        />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 0 155 Q 200 100 400 80 L 400 200 L 0 200 Z"
                      fill="url(#salaryGradientDetail)"
                    />
                    <path
                      d="M 0 155 Q 200 100 400 80"
                      stroke="rgba(59, 130, 246, 1)"
                      strokeWidth="2"
                      fill="none"
                    />
                    <circle
                      cx="0"
                      cy="155"
                      r="4"
                      fill="rgba(59, 130, 246, 1)"
                    />
                    <circle
                      cx="200"
                      cy="100"
                      r="4"
                      fill="rgba(59, 130, 246, 1)"
                    />
                    <circle
                      cx="400"
                      cy="80"
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
                  Definitely fits people with a larger background in Business
                  and Marketing.
                </p>
              </div>
              <div className="opinionCard glass">
                <div className="cardHeader">
                  <span className="icon">👤</span>
                  <h4>LinkedIn</h4>
                </div>
                <p>
                  Many PMMs say the hardest part of the job isn't the
                  launch—it's getting cross-functional teams aligned beforehand.
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
                  <p>
                    Content for getting started with {currentJobData.title}...
                  </p>
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
                    Resources and tools for {currentJobData.title}{" "}
                    professionals...
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      )}
    </div>
  );
};

export default DashboardContent;
