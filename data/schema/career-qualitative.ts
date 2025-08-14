// Schema for LLM Call #3: Qualitative Career Data & Pathway

export interface CareerQualitativeOutput {
  careerTitle: string;
  onetCode: string;
  summary: string; // LLM-generated comprehensive overview
  workExperience: {
    typicalDay: string;
    workEnvironment: string;
    challenges: string[];
    rewards: string[];
    testimonials: WorkerTestimonial[];
  };
  careerPathway: {
    userCurrentState: CurrentState;
    roadmap: PathwayStep[];
    timeline: string; // Overall time estimate
  };
  resources: {
    education: EducationResource[];
    certifications: CertificationResource[];
    networking: NetworkingResource[];
    jobBoards: string[];
  };
  alternativeCareers: AlternativeCareer[];
}

export interface WorkerTestimonial {
  quote: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  theme: string; // e.g., "work-life balance", "career growth"
}

export interface CurrentState {
  relevantExperience: string[];
  skillGaps: string[];
  strengths: string[];
  readinessScore: number; // 1-5 scale
}

export interface PathwayStep {
  step: number;
  title: string;
  description: string;
  timeframe: string; // e.g., "6 months", "1-2 years"
  priority: 'high' | 'medium' | 'low';
  resources: string[];
}

export interface EducationResource {
  type: 'degree' | 'bootcamp' | 'online-course' | 'certification';
  name: string;
  provider: string;
  duration: string;
  cost: string; // e.g., "$5,000-10,000", "Free"
  relevance: number; // 1-5 scale
}

export interface CertificationResource {
  name: string;
  provider: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  timeToComplete: string;
  industry_recognition: number; // 1-5 scale
}

export interface NetworkingResource {
  type: 'professional-org' | 'conference' | 'online-community';
  name: string;
  description: string;
  cost: string;
}

export interface AlternativeCareer {
  title: string;
  onetCode: string;
  similarityReason: string;
  transitionDifficulty: 'easy' | 'moderate' | 'difficult';
}