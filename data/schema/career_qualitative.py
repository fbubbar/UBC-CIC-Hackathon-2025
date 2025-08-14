"""Revised Schema for LLM Call #3: Qualitative Career Data & Pathway

This schema has been adapted to better align with the structure of the input .txt files from O*NET data. Key changes and suggestions:
- Added dedicated models for extracting and structuring core O*NET sections like Tasks, Knowledge, Skills, Technology Skills/Tools, Tools Used, Work Context, Interests, and Related Occupations. This ensures the LLM can directly parse and output these in a structured way without losing fidelity.
- Enhanced WorkExperience to incorporate inferences from DESCRIPTION, TASKS, and WORK CONTEXT, while allowing LLM-generated qualitative elements like challenges, rewards, and testimonials (which can be synthesized or placeholder if no external data is available).
- Made CareerPathway more flexible: user_current_state is now optional (since user-specific data may not always be provided in the input). If no user data, the LLM can generate a general pathway.
- Integrated Resources with O*NET-specific tech skills and tools, while keeping room for LLM-generated education/certifications/networking suggestions.
- For AlternativeCareer, mapped directly to RELATED OCCUPATIONS, adding fields for onet_code (if available, else optional) and LLM-inferred similarity_reason/transition_difficulty.
- Added a top-level 'onet_data' field in CareerQualitativeOutput to house the structured O*NET extractions, separating raw/structured data from qualitative generations.
- General improvements: Added descriptions to fields for clarity, ensured scales are consistent with O*NET (e.g., importance 1-5, level 0-7), and used more precise types where possible.
"""

from typing import List, Literal, Optional
from pydantic import BaseModel, Field


class WorkerTestimonial(BaseModel):
    quote: str = Field(description="A direct or synthesized quote from a worker in this field.")
    sentiment: Literal['positive', 'neutral', 'negative'] = Field(description="Overall sentiment of the testimonial.")
    theme: str = Field(description="Key theme, e.g., 'work-life balance', 'creative fulfillment'.")


class WorkExperience(BaseModel):
    typical_day: str = Field(description="Description of a typical day, inferred from TASKS and DESCRIPTION.")
    work_environment: str = Field(description="Overview of the work setting, drawn from WORK CONTEXT.")
    challenges: List[str] = Field(description="Potential challenges, inferred from TASKS, WORK CONTEXT, etc.")
    rewards: List[str] = Field(description="Potential rewards, inferred from DESCRIPTION and INTERESTS.")
    testimonials: List[WorkerTestimonial] = Field(description="LLM-generated or sourced testimonials based on the occupation.")


class CurrentState(BaseModel):
    relevant_experience: List[str] = Field(description="User's relevant experiences; empty if no user data provided.")
    skill_gaps: List[str] = Field(description="Identified gaps based on SKILLS and KNOWLEDGE; general if no user data.")
    strengths: List[str] = Field(description="User's strengths aligning with the occupation; general if no user data.")
    readiness_score: int = Field(ge=1, le=5, description="1-5 readiness scale; default to 3 if no user data.")


class PathwayStep(BaseModel):
    step: int = Field(description="Sequential step number.")
    title: str = Field(description="Short title for the step.")
    description: str = Field(description="Detailed action or milestone.")
    timeframe: str = Field(description="Estimated timeframe, e.g., '3-6 months'.")
    priority: Literal['high', 'medium', 'low'] = Field(description="Priority level.")
    resources: List[str] = Field(description="Recommended resources for this step.")


class CareerPathway(BaseModel):
    user_current_state: Optional[CurrentState] = Field(default=None, description="Optional; omit if no user-specific input.")
    roadmap: List[PathwayStep] = Field(description="Step-by-step career roadmap, generated based on O*NET data.")
    timeline: str = Field(description="Overall estimated timeline to enter/advance in the career.")


class EducationResource(BaseModel):
    type: Literal['degree', 'bootcamp', 'online-course', 'certification'] = Field(description="Type of educational resource.")
    name: str = Field(description="Name of the program/course.")
    provider: str = Field(description="Provider or institution.")
    duration: str = Field(description="Estimated duration.")
    cost: str = Field(description="Cost range, e.g., 'Free', '$1,000-5,000'.")
    relevance: int = Field(ge=1, le=5, description="Relevance to the occupation on a 1-5 scale.")


class CertificationResource(BaseModel):
    name: str = Field(description="Certification name.")
    provider: str = Field(description="Issuing organization.")
    difficulty: Literal['beginner', 'intermediate', 'advanced'] = Field(description="Difficulty level.")
    time_to_complete: str = Field(description="Time to complete.")
    industry_recognition: int = Field(ge=1, le=5, description="Recognition level on a 1-5 scale.")


class NetworkingResource(BaseModel):
    type: Literal['professional-org', 'conference', 'online-community'] = Field(description="Type of networking resource.")
    name: str = Field(description="Name of the group/event/community.")
    description: str = Field(description="Brief description.")
    cost: str = Field(description="Associated cost, if any.")


class TechSkill(BaseModel):
    name: str = Field(description="Name of the technology skill or software.")
    tech_type: str = Field(description="Category, e.g., 'Video creation and editing software'.")


class ToolUsed(BaseModel):
    name: str = Field(description="Name of the tool.")
    tool_type: str = Field(description="Category, e.g., 'Digital cameras'.")


class Resources(BaseModel):
    education: List[EducationResource] = Field(description="Recommended education paths, inferred from KNOWLEDGE/SKILLS.")
    certifications: List[CertificationResource] = Field(description="Relevant certifications.")
    networking: List[NetworkingResource] = Field(description="Networking opportunities.")
    job_boards: List[str] = Field(description="Recommended job boards or sites.")
    technology_skills: List[TechSkill] = Field(description="Extracted from TECHNOLOGY SKILLS & TOOLS.")
    tools_used: List[ToolUsed] = Field(description="Extracted from TOOLS USED.")


class AlternativeCareer(BaseModel):
    title: str = Field(description="Career title from RELATED OCCUPATIONS.")
    onet_code: Optional[str] = Field(default=None, description="O*NET-SOC code if available.")
    similarity_reason: str = Field(description="Reason for similarity, e.g., 'Shared artistic interests'.")
    transition_difficulty: Literal['easy', 'moderate', 'difficult'] = Field(description="Ease of transitioning from the main career.")


class Task(BaseModel):
    description: str = Field(description="Task description from TASKS section.")


class KnowledgeItem(BaseModel):
    name: str = Field(description="Knowledge area name.")
    importance: float = Field(ge=1.0, le=5.0, description="Importance rating (1-5).")
    level: float = Field(ge=0.0, le=7.0, description="Level rating (0-7).")


class SkillItem(BaseModel):
    name: str = Field(description="Skill name.")
    importance: float = Field(ge=1.0, le=5.0, description="Importance rating (1-5).")
    level: float = Field(ge=0.0, le=7.0, description="Level rating (0-7).")


class WorkContextItem(BaseModel):
    key: str = Field(description="Work context key, e.g., 'Contact With Others'.")
    value: str = Field(description="Corresponding value, e.g., 'Constant contact with others'.")


class Interests(BaseModel):
    primary: str = Field(description="Primary RIASEC interest.")
    secondary: Optional[str] = Field(default=None, description="Secondary RIASEC interest.")
    tertiary: Optional[str] = Field(default=None, description="Tertiary RIASEC interest.")


class OnetData(BaseModel):
    description: str = Field(description="Full DESCRIPTION text.")
    tasks: List[Task] = Field(description="List of tasks.")
    knowledge: List[KnowledgeItem] = Field(description="Structured knowledge areas.")
    skills: List[SkillItem] = Field(description="Structured skills.")
    work_context: List[WorkContextItem] = Field(description="Key-value pairs from WORK CONTEXT.")
    interests: Interests = Field(description="RIASEC interests.")
    related_occupations: List[str] = Field(description="List of related occupation titles.")


class CareerQualitativeOutput(BaseModel):
    career_title: str = Field(description="Job Title from input.")
    onet_code: str = Field(description="O*NET-SOC Code.")
    summary: str = Field(description="LLM-generated comprehensive overview based on all sections.")
    onet_data: OnetData = Field(description="Structured extraction of O*NET data from the input.")
    work_experience: WorkExperience = Field(description="Qualitative work experience insights.")
    career_pathway: CareerPathway = Field(description="Generated career pathway.")
    resources: Resources = Field(description="Resources, including O*NET tech/tools.")
    alternative_careers: List[AlternativeCareer] = Field(description="Alternatives based on RELATED OCCUPATIONS.")