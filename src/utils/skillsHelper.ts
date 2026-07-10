import { AssessmentAnswers } from '../types';

export interface ExtractedSkills {
  technical: string[];
  soft: string[];
  languages: string[];
}

export function getSkillsFromAssessment(answers: AssessmentAnswers | null): ExtractedSkills {
  if (!answers) return { technical: [], soft: [], languages: [] };
  
  const technical: string[] = [];
  const soft: string[] = [];
  const languages: string[] = ['English', 'Sinhala']; // Default languages

  const prog = answers.programming_skills || '';
  const softStyle = answers.soft_skills || '';
  const favSubject = answers.favourite_subjects || '';

  // Extract from programming skills (Question 4 and 8)
  if (prog.includes('Backend') || prog.includes('logic')) {
    technical.push('Python', 'Java', 'Node.js', 'APIs', 'Backend Dev');
  }
  if (prog.includes('Frontend') || prog.includes('Mobile')) {
    technical.push('JavaScript', 'React Native', 'HTML/CSS', 'Flutter', 'Frontend Dev');
  }
  if (prog.includes('Data Wrangling') || prog.includes('SQL')) {
    technical.push('SQL', 'Pandas', 'Data Analysis');
  }
  if (prog.includes('Minimal') || prog.includes('Business')) {
    technical.push('QA Testing', 'Agile / Scrum', 'Product Alignment');
  }

  // Extract from knowledge acquisition / interests
  if (prog.includes('Side Projects') || prog.includes('deploy')) {
    technical.push('Git / GitHub', 'System Design');
  }
  if (prog.includes('Open Source') || prog.includes('pull')) {
    technical.push('Git / GitHub', 'Code Review');
  }

  // Extract from collaboration style (soft skills)
  if (softStyle.includes('Core Code') || softStyle.includes('algorithms')) {
    soft.push('Problem Solving', 'Critical Thinking');
  }
  if (softStyle.includes('Research') || softStyle.includes('documentation')) {
    soft.push('Technical Research', 'Self-Learning');
  }
  if (softStyle.includes('UI Designer') || softStyle.includes('Presenter')) {
    soft.push('Communication', 'Presentation', 'UI/UX Design');
  }
  if (softStyle.includes('Coordinator') || softStyle.includes('sub-tasks')) {
    soft.push('Teamwork', 'Leadership', 'Project Coordination');
  }

  // Extract from subjects (e.g., Networks -> Cybersecurity)
  if (favSubject.includes('Networks') || favSubject.includes('Cybersecurity')) {
    technical.push('Network Security', 'Firewalls', 'Cryptography');
  }
  if (favSubject.includes('DBMS') || favSubject.includes('database')) {
    technical.push('PostgreSQL', 'Database Design');
  }
  if (favSubject.includes('Data Structures') || favSubject.includes('OOP')) {
    technical.push('Data Structures', 'OOP');
  }

  // Make sure we have unique values
  return {
    technical: [...new Set(technical)],
    soft: [...new Set(soft)],
    languages
  };
}
