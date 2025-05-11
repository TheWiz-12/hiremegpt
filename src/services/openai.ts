import OpenAI from 'openai';
import { toast } from 'react-toastify';

const createOpenAIClient = () => {
  try {
    return new OpenAI({
      //apiKey: "***REMOVED***proj-b12lkXsRWoe8Zyzbpor4aGf_syvSGpzVL036vGbvoXjRKoFY7vebDxwzUOwix_8V_5mXJ-GRMYT3BlbkFJCIYSNawzE30E_gUUl4n9GQQEohEvIQyg4ViQoNYKMmTDVq2HJDoyJ119gv_NyvKh_JnDRvYdwA",
      apiKey: import.meta.env.apiKey , 
      dangerouslyAllowBrowser: true
    });
  } catch (error) {
    console.error("Error initializing OpenAI client:", error);
    return null;
  }
};

const openai = createOpenAIClient();

// Enhanced mock responses with company-specific context
const getMockResumeAnalysis = (resumeText: string) => {
  const skills = resumeText.toLowerCase().includes('react') ? 'React' : 
                 resumeText.toLowerCase().includes('python') ? 'Python' : 'Software Development';
                 
  return `# Resume Analysis for ${skills} Position

## Strengths
- Strong technical background in ${skills}
- Clear project achievements and metrics
- Well-structured experience section

## Areas for Improvement
- Add more quantifiable results
- Enhance technical skills section
- Include relevant certifications

## Recommendations
1. Highlight leadership experiences
2. Add more industry-specific keywords
3. Include a portfolio link
4. Emphasize collaborative projects

This is a simulated analysis based on your resume content.`;
};

const getMockInterviewQuestions = (jobTitle: string, company: string, count: number) => {
  const companySpecificQuestions: Record<string, string[]> = {
    'google': [
      "Explain Google's MapReduce and how it works",
      "How would you improve Google's search algorithm?",
      "Describe a time you had to make a decision with incomplete information",
      "How would you design Google Drive?",
      "Explain the concept of Google's PageRank algorithm"
    ],
    'amazon': [
      "Tell me about a time you had to make a decision that wasn't popular",
      "How would you improve Amazon's recommendation system?",
      "Describe a situation where you had to handle multiple priorities",
      "How would you design Amazon's shopping cart system?",
      "Tell me about a time you had to deal with a difficult customer"
    ],
    'microsoft': [
      "How would you improve Microsoft Teams?",
      "Describe a time you had to learn a new technology quickly",
      "How would you design Xbox Live's gaming service?",
      "Tell me about a time you had to debug a critical issue",
      "How would you improve Windows' security features?"
    ],
    'default': [
      "Describe your most challenging project",
      "How do you handle tight deadlines?",
      "What's your approach to learning new technologies?",
      "How do you handle disagreements in a team?",
      "Where do you see yourself in 5 years?"
    ]
  };

  const baseQuestions = [
    `What interests you about working at ${company}?`,
    `How would you improve one of ${company}'s products?`,
    `Describe a project that aligns with ${company}'s mission`,
    `What's your experience with technologies used at ${company}?`,
    `How do you stay updated with industry trends relevant to ${company}?`
  ];

  const companyQuestions = companySpecificQuestions[company.toLowerCase()] || companySpecificQuestions.default;
  const allQuestions = [...baseQuestions, ...companyQuestions];
  
  // Generate role-specific technical questions
  const technicalQuestions = [
    `How would you design a scalable ${jobTitle} system?`,
    `What's your experience with technologies required for ${jobTitle}?`,
    `How do you ensure code quality in your ${jobTitle} projects?`,
    `Describe a challenging ${jobTitle} problem you solved`,
    `What's your approach to testing in ${jobTitle} projects?`
  ];

  const combinedQuestions = [...allQuestions, ...technicalQuestions]
    .sort(() => Math.random() - 0.5)
    .slice(0, count)
    .map((q, i) => `${i + 1}. ${q}`);

  return combinedQuestions.join('\n\n');
};

const getMockAnswerEvaluation = (answer: string, company: string) => {
  const answerLength = answer.length;
  const hasSpecificExamples = answer.toLowerCase().includes('for example') || answer.toLowerCase().includes('instance');
  const hasTechnicalTerms = answer.toLowerCase().includes('algorithm') || answer.toLowerCase().includes('system');

  return `## Answer Evaluation for ${company} Interview

### Strengths
${hasSpecificExamples ? '- Good use of specific examples\n' : ''}
${hasTechnicalTerms ? '- Strong technical explanation\n' : ''}
${answerLength > 200 ? '- Comprehensive response\n' : ''}
- Clear communication style

### Areas for Improvement
${answerLength < 100 ? '- Could provide more detail\n' : ''}
${!hasSpecificExamples ? '- Add specific examples from your experience\n' : ''}
${!hasTechnicalTerms ? '- Include more technical depth\n' : ''}
- Consider using the STAR method more explicitly

### Company-Specific Feedback
- Align response more with ${company}'s values and culture
- Reference relevant ${company} products or services
- Demonstrate knowledge of ${company}'s technical stack

### Next Steps
1. Practice structured responses using STAR method
2. Research ${company}'s recent projects and initiatives
3. Prepare follow-up questions about the role
4. Review ${company}'s technical documentation`;
};

const getMockResources = (jobTitle: string, company: string, skills: string[]) => {
  return `# Learning Resources for ${jobTitle} at ${company}

## Company-Specific Resources
- ${company} Engineering Blog
- ${company} Developer Documentation
- ${company} Tech Talks on YouTube
- ${company} Open Source Projects

## Technical Skills
${skills.map(skill => `
### ${skill}
- Online Courses: Coursera, Udemy specializations
- Documentation: Official ${skill} docs
- Practice: LeetCode, HackerRank problems
- Books: Latest ${skill} publications
`).join('\n')}

## Interview Preparation
- System Design: High Scalability Blog
- Coding: LeetCode Premium (${company}-specific questions)
- Behavioral: STAR method practice
- Culture: ${company} leadership principles

## Recommended Projects
1. Build a clone of a ${company} product
2. Contribute to ${company} open source
3. Create portfolio projects using ${company} technologies

## Communities
- ${company} Developer Forums
- Stack Overflow ${company} Tags
- Reddit r/${company.toLowerCase()}engineering
- LinkedIn ${company} Groups`;
};

export const analyzeResume = async (resumeText: string, targetRole: string, targetCompany: string) => {
  if (!openai) {
    toast.warning("Using AI simulation for resume analysis");
    return getMockResumeAnalysis(resumeText);
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are an expert HR professional and career coach specializing in technical roles at ${targetCompany}. Analyze resumes and provide detailed, actionable feedback for ${targetRole} positions.`
        },
        {
          role: "user",
          content: `Analyze this resume for a ${targetRole} position at ${targetCompany} and provide detailed feedback with specific improvements:\n\n${resumeText}`
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    return response.choices[0].message.content;
  } catch (error: any) {
    console.error("Error analyzing resume:", error);
    toast.warning("Using AI simulation for resume analysis");
    return getMockResumeAnalysis(resumeText);
  }
};

export const generateInterviewQuestions = async (
  jobTitle: string,
  company: string,
  resumeText: string,
  count: number = 25
) => {
  if (!openai) {
    toast.warning("Using AI simulation for interview questions");
    return getMockInterviewQuestions(jobTitle, company, count);
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are an expert technical interviewer at ${company}. Generate relevant interview questions based on the job title and resume provided. Include a mix of technical, behavioral, and company-specific questions.`
        },
        {
          role: "user",
          content: `Generate ${count} interview questions for a ${jobTitle} position at ${company} based on this resume:\n\n${resumeText}\n\nInclude technical questions, behavioral questions, and questions specific to ${company}'s culture and products.`
        }
      ],
      temperature: 0.8,
      max_tokens: 2000
    });

    return response.choices[0].message.content;
  } catch (error: any) {
    console.error("Error generating interview questions:", error);
    toast.warning("Using AI simulation for interview questions");
    return getMockInterviewQuestions(jobTitle, company, count);
  }
};

export const evaluateAnswer = async (
  question: string,
  answer: string,
  jobTitle: string,
  company: string
) => {
  if (!openai) {
    toast.warning("Using AI simulation for answer evaluation");
    return getMockAnswerEvaluation(answer, company);
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are an expert interviewer at ${company}. Evaluate candidate answers and provide detailed feedback aligned with ${company}'s standards and culture.`
        },
        {
          role: "user",
          content: `For a ${jobTitle} position at ${company}:\n\nQuestion: ${question}\n\nCandidate's Answer: ${answer}\n\nProvide detailed feedback including strengths, areas for improvement, and specific suggestions to better align with ${company}'s expectations.`
        }
      ],
      temperature: 0.7,
      max_tokens: 1500
    });

    return response.choices[0].message.content;
  } catch (error: any) {
    console.error("Error evaluating answer:", error);
    toast.warning("Using AI simulation for answer evaluation");
    return getMockAnswerEvaluation(answer, company);
  }
};

export const generateResources = async (
  jobTitle: string,
  company: string,
  skills: string[]
) => {
  const validSkills = Array.isArray(skills) ? skills : [];
  
  if (!openai || validSkills.length === 0) {
    toast.warning("Using AI simulation for learning resources");
    return getMockResources(jobTitle, company, validSkills.length > 0 ? validSkills : ['General Programming']);
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a career development expert specializing in preparing candidates for ${company}. Provide comprehensive learning resources and preparation materials.`
        },
        {
          role: "user",
          content: `Suggest detailed learning resources for someone preparing for a ${jobTitle} position at ${company} with the following skills: ${validSkills.join(", ")}. Include company-specific resources, technical preparation materials, and interview preparation guides.`
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    return response.choices[0].message.content;
  } catch (error: any) {
    console.error("Error generating resources:", error);
    toast.warning("Using AI simulation for learning resources");
    return getMockResources(jobTitle, company, validSkills);
  }
};