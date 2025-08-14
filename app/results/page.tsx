"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MockAnalysisResult, CareerRecommendation } from "../../lib/mockCareerData";
import "./results.css";

export default function Results() {
  const router = useRouter();
  const [analysisResult, setAnalysisResult] = useState<MockAnalysisResult | null>(null);
  const [userFormData, setUserFormData] = useState<any>(null);
  const [selectedCareer, setSelectedCareer] = useState<CareerRecommendation | null>(null);
  const [currentView, setCurrentView] = useState<"overview" | "career-detail">("overview");

  useEffect(() => {
    // Load data from localStorage
    const storedResult = localStorage.getItem('careerAnalysisResult');
    const storedFormData = localStorage.getItem('userFormData');
    
    if (storedResult && storedFormData) {
      setAnalysisResult(JSON.parse(storedResult));
      setUserFormData(JSON.parse(storedFormData));
    } else {
      // Redirect to intake form if no data
      router.push('/intake-form');
    }
  }, [router]);

  const handleCareerSelect = (career: CareerRecommendation) => {
    setSelectedCareer(career);
    setCurrentView("career-detail");
  };

  const handleBackToOverview = () => {
    setCurrentView("overview");
    setSelectedCareer(null);
  };

  if (!analysisResult || !userFormData) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your career analysis...</p>
      </div>
    );
  }

  return (
    <div className="results-container">
      {currentView === "overview" ? (
        <OverviewView 
          analysisResult={analysisResult}
          userFormData={userFormData}
          onCareerSelect={handleCareerSelect}
        />
      ) : (
        <CareerDetailView 
          career={selectedCareer!}
          onBack={handleBackToOverview}
        />
      )}
    </div>
  );
}

const OverviewView = ({ 
  analysisResult, 
  userFormData, 
  onCareerSelect 
}: { 
  analysisResult: MockAnalysisResult;
  userFormData: any;
  onCareerSelect: (career: CareerRecommendation) => void;
}) => {
  const riasecLabels = {
    realistic: "Realistic",
    investigative: "Investigative", 
    artistic: "Artistic",
    social: "Social",
    enterprising: "Enterprising",
    conventional: "Conventional"
  };

  return (
    <div className="overview-container">
      <header className="results-header">
        <div className="header-content">
          <Link href="/intake-form" className="back-link">
            ← Back to Form
          </Link>
          <h1>Your Career Analysis Results</h1>
          <p className="user-name">Hello, {userFormData.firstName} {userFormData.lastName}</p>
        </div>
      </header>

      <section className="personality-section glass">
        <div className="personality-card">
          <div className="personality-icon">
            {analysisResult.personalityType === "The Creative" && "🎨"}
            {analysisResult.personalityType === "The Builder" && "🔧"}
            {analysisResult.personalityType === "The Innovator" && "🔬"}
            {analysisResult.personalityType === "The Helper" && "🤝"}
            {analysisResult.personalityType === "The Leader" && "👑"}
            {analysisResult.personalityType === "The Organizer" && "📊"}
          </div>
          <h2>You are: {analysisResult.personalityType}</h2>
          <p className="personality-description">{analysisResult.personalityDescription}</p>
        </div>
      </section>

      <section className="riasec-section glass">
        <h3>Your Interest Profile (RIASEC)</h3>
        <div className="riasec-chart">
          {Object.entries(analysisResult.riasecScores).map(([key, value]) => (
            <div key={key} className="riasec-item">
              <div className="riasec-label">{riasecLabels[key as keyof typeof riasecLabels]}</div>
              <div className="riasec-bar">
                <div 
                  className="riasec-fill" 
                  style={{ width: `${value}%` }}
                ></div>
              </div>
              <span className="riasec-score">{value}%</span>
            </div>
          ))}
        </div>
      </section>

      <section className="summary-section glass">
        <h3>Analysis Summary</h3>
        <p>{analysisResult.summary}</p>
      </section>

      <section className="recommendations-section">
        <h3>Top Career Recommendations</h3>
        <div className="career-cards-grid">
          {analysisResult.topRecommendations.map((career, index) => (
            <div 
              key={index} 
              className="career-card glass"
              onClick={() => onCareerSelect(career)}
            >
              <div className="career-header">
                <h4>{career.title}</h4>
                <div className="match-score">
                  <span className="score-value">{career.matchScore}%</span>
                  <span className="score-label">Match</span>
                </div>
              </div>
              
              <div className="career-tags">
                {career.tags.map((tag, tagIndex) => (
                  <span key={tagIndex} className="tag">{tag}</span>
                ))}
              </div>
              
              <p className="career-description">{career.description}</p>
              
              <div className="career-details">
                <div className="detail-item">
                  <strong>Salary:</strong> {career.medianSalary}
                </div>
                <div className="detail-item">
                  <strong>Growth:</strong> {career.growthOutlook}
                </div>
                <div className="detail-item">
                  <strong>RIASEC:</strong> {career.riasecProfile}
                </div>
              </div>
              
              <div className="card-arrow">→</div>
            </div>
          ))}
        </div>
      </section>

      <section className="next-steps-section glass">
        <h3>Next Steps</h3>
        <div className="next-steps-grid">
          <Link href="/dashboard" className="next-step-card">
            <h4>Explore Dashboard</h4>
            <p>View detailed career information and market trends</p>
            <span>→</span>
          </Link>
          <div className="next-step-card">
            <h4>Save Results</h4>
            <p>Create an account to save and track your career journey</p>
            <span>→</span>
          </div>
          <div className="next-step-card">
            <h4>Get Resources</h4>
            <p>Find learning materials and job search tools</p>
            <span>→</span>
          </div>
        </div>
      </section>
    </div>
  );
};

const CareerDetailView = ({
  career,
  onBack
}: {
  career: CareerRecommendation;
  onBack: () => void;
}) => {
  return (
    <div className="career-detail-container">
      <header className="detail-header">
        <button onClick={onBack} className="back-button">
          ← Back to Results
        </button>
        <div className="career-title-section">
          <h1>{career.title}</h1>
          <div className="career-meta">
            <span className="onet-code">O*NET: {career.onetCode}</span>
            <div className="match-badge">
              <span>{career.matchScore}% Match</span>
            </div>
          </div>
        </div>
      </header>

      <div className="detail-content">
        <section className="career-overview glass">
          <h3>Overview</h3>
          <p>{career.description}</p>
          
          <div className="overview-stats">
            <div className="stat-item">
              <strong>Median Salary</strong>
              <span>{career.medianSalary}</span>
            </div>
            <div className="stat-item">
              <strong>Growth Outlook</strong>
              <span>{career.growthOutlook}</span>
            </div>
            <div className="stat-item">
              <strong>Education Required</strong>
              <span>{career.education}</span>
            </div>
            <div className="stat-item">
              <strong>Work Environment</strong>
              <span>{career.workEnvironment}</span>
            </div>
          </div>
        </section>

        <section className="key-tasks glass">
          <h3>Key Responsibilities</h3>
          <ul>
            {career.keyTasks.map((task, index) => (
              <li key={index}>{task}</li>
            ))}
          </ul>
        </section>

        <section className="required-skills glass">
          <h3>Required Skills</h3>
          <div className="skills-grid">
            {career.skills.map((skill, index) => (
              <span key={index} className="skill-tag">{skill}</span>
            ))}
          </div>
        </section>

        <section className="career-path glass">
          <h3>Career Progression</h3>
          <div className="path-timeline">
            <div className="path-stage">
              <div className="stage-marker">1</div>
              <div className="stage-content">
                <h4>Entry Level</h4>
                <p>{career.careerPath.entryLevel}</p>
              </div>
            </div>
            <div className="path-stage">
              <div className="stage-marker">2</div>
              <div className="stage-content">
                <h4>Mid Level</h4>
                <p>{career.careerPath.midLevel}</p>
              </div>
            </div>
            <div className="path-stage">
              <div className="stage-marker">3</div>
              <div className="stage-content">
                <h4>Senior Level</h4>
                <p>{career.careerPath.seniorLevel}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="related-careers glass">
          <h3>Related Careers</h3>
          <div className="related-careers-grid">
            {career.relatedCareers.map((relatedCareer, index) => (
              <div key={index} className="related-career-item">
                {relatedCareer}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};