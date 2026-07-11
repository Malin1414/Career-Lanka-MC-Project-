import { UserProfile, AssessmentAnswers, RecommendedCareer } from '../types';

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

// Helper to clean and parse JSON from Gemini response
const parseGeminiResponse = (text: string) => {
  try {
    // Remove markdown code blocks if present (e.g., ```json ... ```)
    const cleanedJson = text.replace(/```json|```/g, '').trim();
    if (!cleanedJson) {
      throw new Error('Gemini returned an empty response.');
    }
    return JSON.parse(cleanedJson);
  } catch (error) {
    console.error('Failed to parse Gemini JSON:', text);
    throw new Error('AI response format was invalid. Please try again.');
  }
};

export const generateCareerRecommendations = async (
  profile: UserProfile,
  answers: AssessmentAnswers
): Promise<RecommendedCareer[]> => {
  try {
    const prompt = `
      You are an expert AI Career Guidance Counselor specializing in the Sri Lankan tech industry.
      Based on the following student profile and assessment answers, recommend the top 3 best-fit career trajectories.

      Student Profile:
      - Full Name: ${profile.full_name}
      - University: ${profile.university}
      - Degree: ${profile.degree_program}
      - Academic Year: ${profile.academic_year}
      - Current Skills: ${profile.skills?.join(', ') || 'None listed'}
      - Interests: ${profile.interests?.join(', ') || 'None listed'}

      Assessment Answers:
      - Interests: ${answers.interests}
      - Programming Skills: ${answers.programming_skills}
      - Soft Skills: ${answers.soft_skills}
      - Favourite Subjects: ${answers.favourite_subjects}
      - Preferred Working Style: ${answers.preferred_working_style}
      - Career Interests: ${answers.career_interests}

      Output MUST be a valid JSON array of objects matching this TypeScript interface. Do NOT include any text before or after the JSON array.
      interface RecommendedCareer {
        career_name: string;
        match_score: number;
        reason: string;
        required_skills: string[];
        future_demand: string;
        salary_range: string;
        description: string;
        required_degree: string;
        recommended_certifications: string[];
        career_roadmap: string[];
        job_demand: string;
        companies_hiring: string[];
        learning_resources: {
          title: string;
          provider: string;
          link: string;
        }[];
      }
    `;

    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          response_mime_type: "application/json",
        }
      })
    });

    const data = await response.json();

    if (data.error) {
      console.error('Gemini API returned an error:', data.error);
      throw new Error(data.error.message || 'Gemini API Error');
    }

    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return parseGeminiResponse(textResponse);
  } catch (error: any) {
    console.error('Gemini Career Recommendation Error:', error);
    throw error;
  }
};

export const generateJobMatch = async (
  profile: UserProfile,
  jobDescription: string
): Promise<{ match_score: number; reason: string; skill_gaps: string[] }> => {
  try {
    const prompt = `
      You are an AI Job Matching Engine. Compare the student's profile with the job description.

      Student Profile:
      - Skills: ${profile.skills?.join(', ') || 'None listed'}
      - Degree: ${profile.degree_program}

      Job Description:
      ${jobDescription}

      Calculate a Match Score (0-100%), provide a concise reason, and identify skill gaps.
      Return ONLY a JSON object:
      {
        "match_score": number,
        "reason": "string",
        "skill_gaps": ["string"]
      }
    `;

    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          response_mime_type: "application/json",
        }
      })
    });

    const data = await response.json();

    if (data.error) {
      console.error('Gemini API returned an error (Job Match):', data.error);
      return { match_score: 0, reason: "AI service unavailable", skill_gaps: [] };
    }

    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return parseGeminiResponse(textResponse);
  } catch (error) {
    console.error('Job Matching AI Error:', error);
    return { match_score: 0, reason: "Error calculating match", skill_gaps: [] };
  }
};

export const generateProfessionalSummary = async (profile: UserProfile): Promise<string> => {
  try {
    const prompt = `
      Generate a high-impact professional CV summary (2-3 sentences) for:
      Name: ${profile.full_name}
      Degree: ${profile.degree_program}
      Skills: ${profile.skills?.join(', ') || 'None'}
      Goal: ${profile.career_goal}

      Return ONLY the summary text.
    `;

    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || 'Professional student seeking opportunities.';
  } catch (error) {
    console.error('CV Summary AI Error:', error);
    return 'Professional student seeking opportunities.';
  }
};
