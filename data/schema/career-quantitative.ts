// Schema for LLM Call #2: Quantitative Career Data

export interface CareerQuantitativeOutput {
  careerTitle: string;
  onetCode: string;
  demandForecast: {
    currentDemand: number; // 1-5 scale
    projectedGrowth: ForecastPoint[];
    outlook: 'Declining' | 'Stable' | 'Growing' | 'High Growth';
    reasoning: string; // Why this forecast
  };
  salaryProgression: {
    entry: SalaryPoint;
    mid: SalaryPoint;
    senior: SalaryPoint;
    executive?: SalaryPoint;
  };
  geographicData: {
    topStates: GeographicSalary[];
    nationalAverage: number;
  };
  education: {
    minimumRequired: string;
    preferredLevel: string;
    certifications: string[];
  };
}

export interface ForecastPoint {
  year: number;
  demandLevel: number; // 1-5 scale
  confidence: number; // 1-5 scale
}

export interface SalaryPoint {
  experience: string; // e.g., "0-2 years", "5-10 years"
  low: number;
  median: number;
  high: number;
}

export interface GeographicSalary {
  state: string;
  averageSalary: number;
  demandLevel: number; // 1-5 scale
}