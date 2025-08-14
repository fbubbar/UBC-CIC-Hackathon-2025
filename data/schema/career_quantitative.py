"""Schema for LLM Call #2: Quantitative Career Data"""

from typing import List, Literal, Optional
from pydantic import BaseModel, Field


class ForecastPoint(BaseModel):
    year: int
    demand_level: int = Field(ge=1, le=5)  # 1-5 scale
    confidence: int = Field(ge=1, le=5)  # 1-5 scale


class DemandForecast(BaseModel):
    current_demand: int = Field(ge=1, le=5)  # 1-5 scale
    projected_growth: List[ForecastPoint]
    outlook: Literal['Declining', 'Stable', 'Growing', 'High Growth']
    reasoning: str  # Why this forecast


class SalaryPoint(BaseModel):
    experience: str  # e.g., "0-2 years", "5-10 years"
    low: int
    median: int
    high: int


class SalaryProgression(BaseModel):
    entry: SalaryPoint
    mid: SalaryPoint
    senior: SalaryPoint
    executive: Optional[SalaryPoint] = None


class GeographicSalary(BaseModel):
    state: str
    average_salary: int
    demand_level: int = Field(ge=1, le=5)  # 1-5 scale


class GeographicData(BaseModel):
    top_states: List[GeographicSalary]
    national_average: int


class Education(BaseModel):
    minimum_required: str
    preferred_level: str
    certifications: List[str]


class CareerQuantitativeOutput(BaseModel):
    career_title: str
    onet_code: str
    demand_forecast: DemandForecast
    salary_progression: SalaryProgression
    geographic_data: GeographicData
    education: Education