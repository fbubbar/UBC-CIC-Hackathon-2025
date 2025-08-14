// Mock career analysis data for demonstration purposes
export interface CareerRecommendation {
  title: string;
  onetCode: string;
  matchScore: number;
  riasecProfile: string;
  description: string;
  tags: string[];
  medianSalary: string;
  growthOutlook: string;
  education: string;
  skills: string[];
  workEnvironment: string;
  keyTasks: string[];
  careerPath: {
    entryLevel: string;
    midLevel: string;
    seniorLevel: string;
  };
  relatedCareers: string[];
}

export interface MockAnalysisResult {
  personalityType: string;
  personalityDescription: string;
  riasecScores: {
    realistic: number;
    investigative: number;
    artistic: number;
    social: number;
    enterprising: number;
    conventional: number;
  };
  topRecommendations: CareerRecommendation[];
  summary: string;
}

export function generateMockCareerAnalysis(formData: {
  firstName: string;
  lastName: string;
  email: string;
  questionnaireResponses: string[];
  softSkills: string[];
  careerProspects: string[];
}): MockAnalysisResult {
  // Analyze questionnaire responses to determine personality type
  const responses = formData.questionnaireResponses;
  const agreeCount = responses.filter(r => r === 'Agree').length;
  const neutralCount = responses.filter(r => r === 'Neutral').length;
  
  // Simple scoring based on responses
  let personalityType = "The Builder";
  let primaryRiasec = "realistic";
  
  if (agreeCount >= 10) {
    personalityType = "The Innovator";
    primaryRiasec = "investigative";
  } else if (formData.careerProspects.some(p => p.toLowerCase().includes('art') || p.toLowerCase().includes('creative') || p.toLowerCase().includes('design'))) {
    personalityType = "The Creative";
    primaryRiasec = "artistic";
  } else if (formData.softSkills.some(s => s.toLowerCase().includes('communication') || s.toLowerCase().includes('leadership'))) {
    personalityType = "The Helper";
    primaryRiasec = "social";
  }

  // Generate RIASEC scores
  const baseScores = {
    realistic: Math.floor(Math.random() * 40) + 30,
    investigative: Math.floor(Math.random() * 40) + 30,
    artistic: Math.floor(Math.random() * 40) + 30,
    social: Math.floor(Math.random() * 40) + 30,
    enterprising: Math.floor(Math.random() * 40) + 30,
    conventional: Math.floor(Math.random() * 40) + 30,
  };

  // Boost primary type
  baseScores[primaryRiasec as keyof typeof baseScores] += 20;

  const careerRecommendations: CareerRecommendation[] = [
    {
      title: "Software Developer",
      onetCode: "15-1252.00",
      matchScore: 92,
      riasecProfile: "Investigative-Realistic",
      description: "Design, develop, and maintain software applications and systems. Create efficient, scalable solutions to complex technical problems while collaborating with cross-functional teams.",
      tags: ["Technology", "Problem Solving", "Innovation"],
      medianSalary: "$110,000 - $160,000",
      growthOutlook: "Faster than average (8-12%)",
      education: "Bachelor's degree in Computer Science or related field",
      skills: ["Programming", "Algorithm Design", "Database Management", "Version Control", "Testing", "Debugging"],
      workEnvironment: "Office setting, remote work options, collaborative team environment",
      keyTasks: [
        "Write and test code for software applications",
        "Collaborate with designers and product managers",
        "Debug and optimize existing systems",
        "Research new technologies and frameworks",
        "Participate in code reviews and technical discussions"
      ],
      careerPath: {
        entryLevel: "Junior Developer / Software Engineer I",
        midLevel: "Senior Developer / Tech Lead",
        seniorLevel: "Principal Engineer / Engineering Manager"
      },
      relatedCareers: ["Data Scientist", "DevOps Engineer", "Product Manager", "UI/UX Designer"]
    },
    {
      title: "UX/UI Designer",
      onetCode: "27-1021.00",
      matchScore: 88,
      riasecProfile: "Artistic-Investigative",
      description: "Create intuitive, visually appealing, and user-friendly digital experiences by combining design principles with user research and testing.",
      tags: ["Design", "User Research", "Creativity"],
      medianSalary: "$85,000 - $130,000",
      growthOutlook: "Faster than average (5-8%)",
      education: "Bachelor's degree in Design, HCI, or related field",
      skills: ["User Research", "Prototyping", "Visual Design", "Interaction Design", "Usability Testing", "Design Systems"],
      workEnvironment: "Creative studio environment, cross-functional collaboration, user-focused culture",
      keyTasks: [
        "Conduct user research and usability testing",
        "Create wireframes, prototypes, and high-fidelity designs",
        "Collaborate with developers and product teams",
        "Develop and maintain design systems",
        "Present design concepts to stakeholders"
      ],
      careerPath: {
        entryLevel: "Junior UX Designer / UI Designer",
        midLevel: "Senior UX Designer / Lead Designer",
        seniorLevel: "Design Director / Head of Design"
      },
      relatedCareers: ["Product Manager", "Front-end Developer", "Design Researcher", "Brand Designer"]
    },
    {
      title: "Data Scientist",
      onetCode: "15-2051.00",
      matchScore: 85,
      riasecProfile: "Investigative-Conventional",
      description: "Analyze complex data sets to extract insights, build predictive models, and drive data-driven decision making across organizations.",
      tags: ["Analytics", "Machine Learning", "Statistics"],
      medianSalary: "$120,000 - $180,000",
      growthOutlook: "Much faster than average (15-20%)",
      education: "Master's degree in Data Science, Statistics, or related field",
      skills: ["Statistical Analysis", "Machine Learning", "Data Visualization", "SQL", "Python/R", "Big Data Technologies"],
      workEnvironment: "Data-driven organizations, research-focused environment, cross-functional collaboration",
      keyTasks: [
        "Collect and clean large datasets",
        "Build and validate predictive models",
        "Create data visualizations and reports",
        "Communicate findings to non-technical stakeholders",
        "Collaborate with engineers to deploy models"
      ],
      careerPath: {
        entryLevel: "Data Analyst / Junior Data Scientist",
        midLevel: "Senior Data Scientist / ML Engineer",
        seniorLevel: "Principal Data Scientist / Head of Data Science"
      },
      relatedCareers: ["Business Analyst", "Software Engineer", "Research Scientist", "Product Manager"]
    }
  ];

  const personalityDescriptions = {
    "The Builder": "Practical, hands-on, and results-oriented. You excel at creating tangible solutions and working with tools, systems, and processes.",
    "The Innovator": "Analytical, curious, and research-minded. You thrive on solving complex problems and discovering new knowledge through systematic investigation.",
    "The Creative": "Imaginative, expressive, and driven to design, perform, or craft original works that inspire and engage others.",
    "The Helper": "Empathetic, communicative, and motivated to support, teach, and improve the lives of others through meaningful relationships.",
    "The Leader": "Persuasive, ambitious, and focused on influencing others to achieve goals and drive organizational success.",
    "The Organizer": "Detail-oriented, systematic, and skilled at managing data, processes, and administrative tasks with precision and efficiency."
  };

  return {
    personalityType,
    personalityDescription: personalityDescriptions[personalityType as keyof typeof personalityDescriptions],
    riasecScores: baseScores,
    topRecommendations: careerRecommendations,
    summary: `Based on your assessment responses, you demonstrate strong ${primaryRiasec} tendencies with complementary skills in other areas. Your interests in ${formData.careerProspects.join(', ')} and skills in ${formData.softSkills.join(', ')} align well with careers that combine ${primaryRiasec} work with collaborative problem-solving. The recommended careers offer excellent growth potential and match your personality profile.`
  };
}