// ---------- Shared primitives ----------
export type CurrencyCode = "USD" | "EUR" | "GBP" | "AUD" | "CAD" | "JPY" | "INR" | string;
export type Unit =
  | "jobs"               // number of jobs
  | "openings"           // postings
  | "index"              // normalized demand index
  | "salary";            // currency amount

export type Percentile = 10 | 25 | 50 | 75 | 90;

export type SourceRef = {
  id: string;                  // globally unique in your system
  name: string;                // e.g., "O*NET", "BLS", "LinkedIn"
  url?: string;
  dataset?: string;            // e.g., table name, report id
  retrievedAt?: string;        // ISO8601
  notes?: string;
};

export type Provenance = {
  generatedBy: "llm" | "etl" | "manual";
  model?: string;              // e.g., "gpt-5-xyz"
  promptHash?: string;         // optional safety logging
  createdAt: string;           // ISO8601
  sources?: SourceRef[];       // citations supporting this datum
  confidence?: number;         // 0..1
};

// ---------- O*NET references ----------
export type OnetRef = {
  socCode: string;             // e.g., "15-1252.00"
  onetId?: string;             // if you store O*NET internal id
  title: string;               // occupation title from O*NET
};

// ---------- RIASEC / Career Personality ----------
export type RIASECDimension = "R" | "I" | "A" | "S" | "E" | "C";

export type CareerPersonality = {
  model: "RIASEC";
  scores: Record<RIASECDimension, number>; // 0..100 (normalize as you like)
  topDimensions: RIASECDimension[];        // sorted, e.g., ["I","A","S"]
  summary: string;                          // LLM-generated summary
  tags: string[];                           // human-readable interests ("Data analysis", "Helping people", etc.)
  evidence?: {
    fromOnboarding?: string[];              // selected interests / answers
    fromResume?: string[];                  // extracted keywords
  };
  provenance: Provenance;
};

// ---------- Dashboard shell ----------
export type ResultsDashboard = {
  userId: string;
  generatedAt: string;         // ISO8601
  locale?: string;             // e.g., "en-US"
  currency: CurrencyCode;
  personality: CareerPersonality;
  recommendedPaths: CareerPathCard[]; // exactly 3 for your flow
};

// ---------- Path (card) ----------
export type CareerPathCard = {
  id: string;                  // stable id in your system
  occupation: OnetRef;
  matchScore: number;          // 0..1 overall fit (interests + background)
  tagsMatched: string[];       // which user interests this path hits
  potentialSalaryAfter: {
    timeHorizonMonths: number; // “after X amount of time”
    amount: number;
    currency: CurrencyCode;
    percentiles?: Partial<Record<Percentile, number>>; // optional p10/50/90
    notes?: string;
    provenance?: Provenance;
  };
  shortSummary: string;        // 1–2 sentences for the card
  // prefetch minimal trend so the card can show a sparkline if desired:
  miniDemand?: TimeSeries & { lastObserved?: number; lastForecast?: number };
  details?: CareerPathDetails; // include when you fetch/open the card page
};

// ---------- Path (details page) ----------
export type CareerPathDetails = {
  title: string;               // usually occupation.title
  summary: string;             // LLM-generated
  demandForecasts: DemandBlock;
  payScale: PayScaleBlock;
  testimonials: TestimonialBlock;    // can be stubbed/fake for now
  journey: JourneyBlock;             // "How do I get there"
  resources: ResourceBlock;
};

// ---------- Demand forecasts ----------
export type TimePoint = {
  date: string;                // ISO8601 (YYYY-MM-DD)
  value: number;               // in the chosen Unit
  reasoning?: string;          // tooltip text (LLM), keep short
};

export type TimeSeries = {
  unit: Unit;
  seriesType: "observed" | "forecast";
  points: TimePoint[];
  source?: SourceRef;
  modelInfo?: {
    method: "ets" | "arima" | "xgboost" | "llm-assisted" | string;
    horizonMonths?: number;
  };
};

export type DemandBlock = {
  primaryUnit: Unit;           // e.g., "openings" or "index"
  observed: TimeSeries[];      // one or more (e.g., BLS historical)
  forecast: TimeSeries[];      // one or more forecast models
  notes?: string;
};

// ---------- Pay scale ----------
export type PayBand = {
  yearsExperience: number;     // 0, 1, 3, 5, 10, etc.
  currency: CurrencyCode;
  average?: number;            // ~p50
  low?: number;                // ~p10
  high?: number;               // ~p90
  source?: SourceRef;
};

export type PayScaleBlock = {
  bands: PayBand[];            // plotted over "course of career"
  assumptions?: string;        // LLM text, e.g., geo/industry assumptions
  provenance?: Provenance;
};

// ---------- Testimonials (placeholder / fakeable) ----------
export type Testimonial = {
  id: string;
  authorDisplay: string;       // "Mid-level Data Analyst"
  quote: string;
  isPlaceholder: boolean;      // true for now
};

export type TestimonialBlock = {
  items: Testimonial[];
};

// ---------- Journey / Plan ----------
export type JourneyBlock = {
  currentProfile: {
    summary: string;           // “based on resume and education…”
    resumeHighlights?: string[];
    education?: string[];
    skills?: string[];         // extracted skills
  };
  steps: JourneyStep[];        // ordered plan with dates
  projections?: {
    targetRole: OnetRef;
    targetDate?: string;
    expectedSalary?: number;
    currency?: CurrencyCode;
    notes?: string;
  };
};

export type JourneyStep = {
  id: string;
  title: string;               // “Earn Google Data Analytics Certificate”
  description: string;         // LLM-generated
  category: "course" | "certification" | "project" | "application" | "networking" | "experience" | "other";
  dueDate?: string;            // ISO8601
  estHours?: number;
  dependencies?: string[];     // other step ids
  resourceRefs?: string[];     // Resource.id
  completion?: {
    status: "not_started" | "in_progress" | "done" | "blocked";
    updatedAt?: string;
  };
  successCriteria?: string;    // measurable outcome to check off
  provenance: Provenance;
};

// ---------- Resources ----------
export type Resource = {
  id: string;
  type: "course" | "book" | "article" | "community" | "certification" | "tool" | "job-board" | "other";
  title: string;
  url: string;
  provider?: string;           // e.g., Coursera, AWS
  cost?: number;               // null => free
  currency?: CurrencyCode;
  timeToCompleteHours?: number;
  level?: "beginner" | "intermediate" | "advanced";
  tags?: string[];
  source?: SourceRef;
};

export type ResourceBlock = {
  items: Resource[];
};

