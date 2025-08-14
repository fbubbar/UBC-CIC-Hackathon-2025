"""Schema for LLM Call #3: Qualitative Career Data & Pathway"""

from typing import List, Literal
from pydantic import BaseModel, Field


class WorkerTestimonial(BaseModel):
    quote: str
    sentiment: Literal['positive', 'neutral', 'negative']
    theme: str  # e.g., "work-life balance", "career growth"


class WorkExperience(BaseModel):
    typical_day: str
    work_environment: str
    challenges: List[str]
    rewards: List[str]
    testimonials: List[WorkerTestimonial]


class CurrentState(BaseModel):
    relevant_experience: List[str]
    skill_gaps: List[str]
    strengths: List[str]
    readiness_score: int = Field(ge=1, le=5)  # 1-5 scale


class PathwayStep(BaseModel):
    step: int
    title: str
    description: str
    timeframe: str  # e.g., "6 months", "1-2 years"
    priority: Literal['high', 'medium', 'low']
    resources: List[str]


class CareerPathway(BaseModel):
    user_current_state: CurrentState
    roadmap: List[PathwayStep]
    timeline: str  # Overall time estimate


class EducationResource(BaseModel):
    type: Literal['degree', 'bootcamp', 'online-course', 'certification']
    name: str
    provider: str
    duration: str
    cost: str  # e.g., "$5,000-10,000", "Free"
    relevance: int = Field(ge=1, le=5)  # 1-5 scale


class CertificationResource(BaseModel):
    name: str
    provider: str
    difficulty: Literal['beginner', 'intermediate', 'advanced']
    time_to_complete: str
    industry_recognition: int = Field(ge=1, le=5)  # 1-5 scale


class NetworkingResource(BaseModel):
    type: Literal['professional-org', 'conference', 'online-community']
    name: str
    description: str
    cost: str


class Resources(BaseModel):
    education: List[EducationResource]
    certifications: List[CertificationResource]
    networking: List[NetworkingResource]
    job_boards: List[str]


class AlternativeCareer(BaseModel):
    title: str
    onet_code: str
    similarity_reason: str
    transition_difficulty: Literal['easy', 'moderate', 'difficult']


class CareerQualitativeOutput(BaseModel):
    career_title: str
    onet_code: str
    summary: str  # LLM-generated comprehensive overview
    work_experience: WorkExperience
    career_pathway: CareerPathway
    resources: Resources
    alternative_careers: List[AlternativeCareer]