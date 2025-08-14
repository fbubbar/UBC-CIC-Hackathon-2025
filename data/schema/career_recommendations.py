"""Schema for LLM Call #1: Career Path Recommendations"""

from typing import List, Literal
from pydantic import BaseModel, Field


class RiasecType(BaseModel):
    code: Literal['R', 'I', 'A', 'S', 'E', 'C']  # Realistic, Investigative, Artistic, Social, Enterprising, Conventional
    name: str
    description: str
    strength: int = Field(ge=1, le=5)  # 1-5 scale


class PotentialSalary(BaseModel):
    timeframe: str  # e.g., "after 5 years"
    amount: int  # annual salary in USD


class MatchingInterests(BaseModel):
    riasec_codes: List[str]  # Which RIASEC types match
    match_strength: int = Field(ge=1, le=5)  # 1-5 scale


class CareerPath(BaseModel):
    id: str
    title: str
    onet_code: str  # O*NET SOC code (e.g., "27-2011.00")
    short_description: str  # 2-3 sentences
    potential_salary: PotentialSalary
    matching_interests: MatchingInterests
    match_reasoning: str  # Brief explanation of why this matches the user


class UserPersonality(BaseModel):
    summary: str  # Brief personality summary
    riasec_types: List[RiasecType]  # Dominant interest types


class CareerRecommendationsOutput(BaseModel):
    user_personality: UserPersonality
    career_paths: List[CareerPath]