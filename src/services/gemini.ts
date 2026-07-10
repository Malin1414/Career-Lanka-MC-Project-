import { UserProfile, AssessmentAnswers, RecommendedCareer } from '../types';

// Predefined Career Path Pool
const CAREER_POOL: { [key: string]: RecommendedCareer } = {
  software_engineer: {
    career_name: 'Software Engineer',
    match_score: 95,
    reason: 'Your strong proficiency in logical reasoning and software engineering principles aligns perfectly with local software export houses and global remote teams. This path offers high immediate growth for your technical skillset.',
    required_skills: ['React / Next.js', 'Node.js', 'Python', 'Git & GitHub', 'REST APIs', 'SQL'],
    future_demand: 'Expected 24% growth in job openings by 2028 due to local digital transformation and foreign outsourcing expansion.',
    salary_range: 'LKR 120,000 - 250,000 / month',
    description: 'Design, write, test, and maintain code for software applications. Collaborate with product managers and other developers to build scalable client solutions.',
    required_degree: 'BSc Hons in Computer Science, Software Engineering, or Information Technology.',
    recommended_certifications: ['AWS Certified Developer - Associate', 'Oracle Certified Professional Java SE'],
    career_roadmap: [
      'Learn core programming, algorithms, and data structures.',
      'Build 2-3 full-stack portfolio projects using modern JS frameworks.',
      'Secure a software engineering internship (6 months).',
      'Obtain entry-level Associate Software Engineer position.',
      'Progress to Senior Developer and Tech Lead roles.'
    ],
    job_demand: 'High',
    companies_hiring: ['WSO2', 'Sysco LABS', 'Virtusa', '99x'],
    learning_resources: [
      { title: 'Responsive Web Design', provider: 'freeCodeCamp', link: 'https://www.freecodecamp.org/' },
      { title: 'Meta Front-End Developer', provider: 'Coursera', link: 'https://www.coursera.org/' }
    ]
  },
  data_scientist: {
    career_name: 'Data Scientist',
    match_score: 92,
    reason: 'Your preference for analytics, statistical logic, and Python indicates a natural aptitude for interpreting complex datasets into actionable business intelligence.',
    required_skills: ['Python', 'Pandas / NumPy', 'SQL', 'Machine Learning', 'Data Visualization', 'Tableau'],
    future_demand: 'High growth driven by fintech, retail analytics, and localized AI integrations in South Asia.',
    salary_range: 'LKR 150,000 - 300,000 / month',
    description: 'Analyze raw database logs, build machine learning forecasting models, and present visual dashboards to stakeholders to guide commercial choices.',
    required_degree: 'BSc Hons in Computer Science, Data Science, Statistics, or Mathematics.',
    recommended_certifications: ['Google Data Analytics Professional Certificate', 'Microsoft Certified: Azure Data Scientist Associate'],
    career_roadmap: [
      'Master statistics, SQL, and database entity design.',
      'Learn Python libraries (Pandas, Scikit-Learn) and model building.',
      'Build portfolio of data cleaning and regression projects.',
      'Secure Data Analyst or Junior Data Scientist internship.',
      'Progress to Senior Data Scientist and AI Researcher.'
    ],
    job_demand: 'High',
    companies_hiring: ['Octave (John Keells)', 'Axiata Digital Labs', 'Dialog Axiata', 'Pearson'],
    learning_resources: [
      { title: 'Google Data Analytics Certificate', provider: 'Coursera', link: 'https://www.coursera.org/' },
      { title: 'Python for Data Science', provider: 'freeCodeCamp', link: 'https://www.freecodecamp.org/' }
    ]
  },
  cloud_architect: {
    career_name: 'Cloud Architect',
    match_score: 89,
    reason: 'Your interest in networks, virtualization, and systems infrastructure aligns directly with deploying and securing enterprise cloud deployments.',
    required_skills: ['AWS Cloud', 'Docker', 'Kubernetes', 'Linux Systems', 'Terraform', 'CI/CD Pipelines'],
    future_demand: 'Cloud deployments are seeing exponential growth in Sri Lanka as firms migrate legacy database storage to hybrid hosting.',
    salary_range: 'LKR 180,000 - 350,000 / month',
    description: 'Design and implement server architectures in the cloud, manage automated code release pipelines, and optimize hosting cost and security.',
    required_degree: 'BSc Hons in Computer Networks, Computer Science, or Systems Engineering.',
    recommended_certifications: ['AWS Certified Solutions Architect - Associate', 'Certified Kubernetes Administrator (CKA)'],
    career_roadmap: [
      'Understand network routing protocols, DNS, and Linux CLI.',
      'Learn cloud virtualization core basics (AWS, Azure, or GCP).',
      'Build automation scripts using Docker and GitHub Actions.',
      'Join as a Junior Cloud Associate or DevOps Intern.',
      'Advance to Cloud Architect or Principal Site Reliability Engineer.'
    ],
    job_demand: 'High',
    companies_hiring: ['IFS Sri Lanka', 'Sysco LABS', 'Virtusa', 'Fortude'],
    learning_resources: [
      { title: 'AWS Cloud Practitioner Essentials', provider: 'Cisco Networking Academy', link: 'https://www.netacad.com/' },
      { title: 'Microsoft Azure Fundamentals (AZ-900)', provider: 'Microsoft Learn', link: 'https://learn.microsoft.com/' }
    ]
  },
  ui_ux_designer: {
    career_name: 'UI/UX Designer',
    match_score: 91,
    reason: 'Your strength in creative layout execution, user research empathy, and interface wireframing fits the profile of a digital product designer.',
    required_skills: ['Figma', 'Wireframing', 'User Research', 'Information Architecture', 'Prototyping', 'CSS/HTML Basics'],
    future_demand: 'Highly sought after as product companies emphasize localized accessibility, app usability, and user engagement metrics.',
    salary_range: 'LKR 90,000 - 180,000 / month',
    description: 'Gather user feedback, create high-fidelity design mockups, wireframe screen components, and conduct usability tests for mobile/web platforms.',
    required_degree: 'BSc Hons in Human-Computer Interaction, Design, IT, or Interactive Media.',
    recommended_certifications: ['Google UX Design Professional Certificate', 'Interaction Design Foundation Certification'],
    career_roadmap: [
      'Learn user-centered design principles and typography systems.',
      'Master Figma and build 3 comprehensive case study portfolios.',
      'Understand basic frontend layout properties (HTML/CSS layout values).',
      'Secure a UI/UX internship or associate designer slot.',
      'Progress to UX Architect and Lead Product Designer.'
    ],
    job_demand: 'High',
    companies_hiring: ['99x', 'Wavenet', 'Bhasha (Helakuru)', 'Codegen'],
    learning_resources: [
      { title: 'Google UX Design Certificate', provider: 'Coursera', link: 'https://www.coursera.org/' },
      { title: 'UX Design Course', provider: 'YouTube Resources', link: 'https://www.youtube.com/' }
    ]
  },
  cybersecurity_specialist: {
    career_name: 'Cybersecurity Analyst',
    match_score: 87,
    reason: 'Your awareness of network protocols and interest in ethical logic provide an excellent foundation for securing system gateways in Sri Lankan banking and IT sectors.',
    required_skills: ['Network Protocols', 'Ethical Hacking', 'Linux Security', 'Firewalls & VPNs', 'SIEM Tools', 'Penetration Testing'],
    future_demand: 'Explosive local demand driven by banking digitization and the central bank compliance guidelines on system safety.',
    salary_range: 'LKR 140,000 - 280,000 / month',
    description: 'Monitor system networks for anomalous intrusions, run network vulnerability assessments, deploy security fixes, and train teams on safety practices.',
    required_degree: 'BSc Hons in Cybersecurity, Computer Networks, or Computer Engineering.',
    recommended_certifications: ['CompTIA Security+', 'Certified Ethical Hacker (CEH)', 'CCNA Security'],
    career_roadmap: [
      'Learn TCP/IP routing, ports, and operating system mechanics.',
      'Obtain standard networking certifications (e.g. Cisco CCNA).',
      'Practice penetration testing in virtual lab spaces (TryHackMe).',
      'Join a SOC (Security Operations Center) team as a Junior Analyst.',
      'Progress to Senior Penetration Tester and CISO (Chief Security Officer).'
    ],
    job_demand: 'High',
    companies_hiring: ['Dialog Axiata', 'WSO2', 'Virtusa', 'KPMG Sri Lanka'],
    learning_resources: [
      { title: 'Introduction to Cybersecurity', provider: 'Cisco Networking Academy', link: 'https://www.netacad.com/' },
      { title: 'Cybersecurity Analyst Professional', provider: 'Coursera', link: 'https://www.coursera.org/' }
    ]
  },
  business_analyst: {
    career_name: 'Business Analyst',
    match_score: 85,
    reason: 'Your combination of soft skills, project management interests, and structural thinking bridges technical developers and client business goals.',
    required_skills: ['Requirement Gathering', 'Agile / Scrum', 'SQL Basics', 'UML Diagrams', 'Jira', 'Business Intelligence'],
    future_demand: 'Constant demand as foreign software firms expand client projects in Europe and Australia, requiring strong business analysts.',
    salary_range: 'LKR 100,000 - 200,000 / month',
    description: 'Meet with clients, draft software requirement specifications (SRS), model business flows, and run acceptance testing (UAT) with developers.',
    required_degree: 'BSc Hons in Information Systems, Business IT, or Management/CS.',
    recommended_certifications: ['IIBA Certified Business Analysis Assistant (ECBA)', 'Certified Scrum Product Owner (CSPO)'],
    career_roadmap: [
      'Learn software lifecycle models (Agile, Waterfall) and UML.',
      'Practice drawing flowcharts and database query schemas.',
      'Complete certifications in Scrum or Agile frameworks.',
      'Join as an Associate Business Analyst in an IT company.',
      'Advance to Lead Business Analyst or Product Manager.'
    ],
    job_demand: 'Medium',
    companies_hiring: ['Virtusa', 'LSEG (London Stock Exchange)', 'IFS Sri Lanka', ' Pearson'],
    learning_resources: [
      { title: 'Scrum Alliance Product Owner Prep', provider: 'Microsoft Learn', link: 'https://learn.microsoft.com/' },
      { title: 'Business Analysis Foundations', provider: 'Coursera', link: 'https://www.coursera.org/' }
    ]
  },
  mobile_developer: {
    career_name: 'Mobile Application Developer',
    match_score: 90,
    reason: 'Your interest in React Native, frontend development, and layouts aligns with building responsive Android/iOS applications.',
    required_skills: ['React Native', 'TypeScript', 'Flutter / Dart', 'Mobile UI Design', 'REST API Integration', 'Git'],
    future_demand: 'High demand as startups and banks prioritize app-first customer products.',
    salary_range: 'LKR 110,000 - 230,000 / month',
    description: 'Build native and cross-platform mobile apps, integrate REST APIs, publish to Play Store/App Store, and optimize interface responsiveness.',
    required_degree: 'BSc Hons in Computer Science, Software Engineering, or Information Technology.',
    recommended_certifications: ['Meta Android Developer Professional Certificate', 'Associate Android Developer (Google)'],
    career_roadmap: [
      'Learn CSS layouts, JavaScript ES6+, and state management (Redux).',
      'Build and run 3 mobile applications on emulator or device.',
      'Learn API integrations and mobile app publishing workflows.',
      'Secure Junior Mobile Developer internship or full time slot.',
      'Progress to Senior Mobile Architect and Tech Lead.'
    ],
    job_demand: 'High',
    companies_hiring: ['Bhasha (Helakuru)', '99x', 'Sysco LABS', 'Axiata Digital Labs'],
    learning_resources: [
      { title: 'Responsive Web Design', provider: 'freeCodeCamp', link: 'https://www.freecodecamp.org/' },
      { title: 'CS50 Mobile Development', provider: 'YouTube Resources', link: 'https://www.youtube.com/' }
    ]
  }
};

export const generateCareerRecommendations = async (
  profile: UserProfile,
  answers: AssessmentAnswers
): Promise<RecommendedCareer[]> => {
  // Artificial delay to simulate heavy AI processing
  await new Promise((res) => setTimeout(res, 2500));

  const interestsStr = (answers.interests || '').toLowerCase();
  const skillsStr = (answers.programming_skills || '').toLowerCase();

  const recommendations: RecommendedCareer[] = [];

  // Determine recommendations based on questionnaire selections
  if (interestsStr.includes('ai') || interestsStr.includes('data science') || skillsStr.includes('data')) {
    // Data Sci focused recommendations
    recommendations.push({ ...CAREER_POOL.data_scientist, match_score: 96 });
    recommendations.push({ ...CAREER_POOL.software_engineer, match_score: 88 });
    recommendations.push({ ...CAREER_POOL.cloud_architect, match_score: 85 });
    recommendations.push({ ...CAREER_POOL.ui_ux_designer, match_score: 72 });
    recommendations.push({ ...CAREER_POOL.business_analyst, match_score: 68 });
  } else if (interestsStr.includes('cloud') || interestsStr.includes('infrastructure') || skillsStr.includes('cloud')) {
    // Cloud / DevOps focused recommendations
    recommendations.push({ ...CAREER_POOL.cloud_architect, match_score: 95 });
    recommendations.push({ ...CAREER_POOL.cybersecurity_specialist, match_score: 90 });
    recommendations.push({ ...CAREER_POOL.software_engineer, match_score: 86 });
    recommendations.push({ ...CAREER_POOL.business_analyst, match_score: 74 });
    recommendations.push({ ...CAREER_POOL.mobile_developer, match_score: 70 });
  } else if (interestsStr.includes('ui/ux') || interestsStr.includes('creative') || interestsStr.includes('design')) {
    // Design / UI focused recommendations
    recommendations.push({ ...CAREER_POOL.ui_ux_designer, match_score: 96 });
    recommendations.push({ ...CAREER_POOL.mobile_developer, match_score: 88 });
    recommendations.push({ ...CAREER_POOL.software_engineer, match_score: 82 });
    recommendations.push({ ...CAREER_POOL.business_analyst, match_score: 80 });
    recommendations.push({ ...CAREER_POOL.data_scientist, match_score: 64 });
  } else {
    // Default / Software Development focused recommendations
    recommendations.push({ ...CAREER_POOL.software_engineer, match_score: 95 });
    recommendations.push({ ...CAREER_POOL.mobile_developer, match_score: 91 });
    recommendations.push({ ...CAREER_POOL.ui_ux_designer, match_score: 84 });
    recommendations.push({ ...CAREER_POOL.cloud_architect, match_score: 82 });
    recommendations.push({ ...CAREER_POOL.business_analyst, match_score: 78 });
  }

  return recommendations;
};
