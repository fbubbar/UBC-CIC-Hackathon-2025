// Schema for LLM Call #1: Career Path Recommendations

export interface CareerRecommendationsOutput {
  userPersonality: {
    summary: string; // Brief personality summary
    riasecTypes: RiasecType[]; // Dominant interest types
  };
  careerPaths: CareerPath[];
}

export interface RiasecType {
  code: 'R' | 'I' | 'A' | 'S' | 'E' | 'C'; // Realistic, Investigative, Artistic, Social, Enterprising, Conventional
  name: string;
  description: string;
  strength: number; // 1-5 scale
}

export interface CareerPath {
  id: string;
  title: string;
  onetCode: string; // O*NET SOC code (e.g., "27-2011.00")
  shortDescription: string; // 2-3 sentences
  potentialSalary: {
    timeframe: string; // e.g., "after 5 years"
    amount: number; // annual salary in USD
  };
  matchingInterests: {
    riasecCodes: string[]; // Which RIASEC types match
    matchStrength: number; // 1-5 scale
  };
  matchReasoning: string; // Brief explanation of why this matches the user
}