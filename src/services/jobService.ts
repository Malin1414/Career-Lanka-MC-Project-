export interface JobOpportunity {
  id: string;
  title: string;
  companyName: string;
  location: string;
  employmentType: string;
  careerCategory: string;
  postedDate: string;
  logoUrl?: string;
  description: string;
  externalUrl: string;
}

export const MOCK_JOBS: JobOpportunity[] = [
  {
    id: '1',
    title: 'Associate Software Engineer',
    companyName: 'WSO2',
    location: 'Colombo, Sri Lanka',
    employmentType: 'Full-time',
    careerCategory: 'Software Engineering',
    postedDate: '2 days ago',
    logoUrl: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?q=80&w=100&auto=format&fit=crop',
    description: 'Join our integration agile team. Work on core Java microservices, Kubernetes deployments, and cloud platform APIs.',
    externalUrl: 'https://www.linkedin.com/jobs/view/3784112345/',
  },
  {
    id: '2',
    title: 'React Native Developer',
    companyName: 'Sysco LABS',
    location: 'Colombo, Sri Lanka (Hybrid)',
    employmentType: 'Full-time',
    careerCategory: 'Mobile App Development',
    postedDate: '3 days ago',
    logoUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=100&auto=format&fit=crop',
    description: 'Looking for a passionate mobile developer to optimize our customer delivery platform app built with React Native and Redux.',
    externalUrl: 'https://www.indeed.com/viewjob?jk=8894ab12cd34ef56',
  },
  {
    id: '3',
    title: 'Junior Data Analyst',
    companyName: 'Axiata Digital Labs',
    location: 'Colombo, Sri Lanka',
    employmentType: 'Full-time',
    careerCategory: 'Data Science & Analytics',
    postedDate: '1 day ago',
    logoUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=100&auto=format&fit=crop',
    description: 'Transform complex business data into insights. Required proficiency in SQL, Python (Pandas/NumPy), and Power BI.',
    externalUrl: 'https://www.topjobs.lk/employer/JobAdvertisment.jsp?id=992837',
  },
  {
    id: '4',
    title: 'Cybersecurity Analyst',
    companyName: 'Virtusa',
    location: 'Colombo, Sri Lanka',
    employmentType: 'Full-time',
    careerCategory: 'Cybersecurity',
    postedDate: '4 days ago',
    logoUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=100&auto=format&fit=crop',
    description: 'Monitor network systems for security breaches. Respond to incident alerts, configure threat firewalls, and perform penetration tests.',
    externalUrl: 'https://www.glassdoor.com/job-listing/cybersecurity-analyst-virtusa-JV_IC3039757_KO0,22_KE23,30.htm',
  },
  {
    id: '5',
    title: 'Junior DevOps Engineer',
    companyName: '99x',
    location: 'Colombo, Sri Lanka (Remote)',
    employmentType: 'Full-time',
    careerCategory: 'Cloud & DevOps',
    postedDate: '5 days ago',
    logoUrl: 'https://images.unsplash.com/photo-1618401471353-b98aedd07871?q=80&w=100&auto=format&fit=crop',
    description: 'Help manage CI/CD deployment pipelines on AWS. Script automation workflows using Bash/Python and configure Docker containers.',
    externalUrl: 'https://www.xpressjobs.lk/Job/DevOps-Engineer-99x-10293',
  },
];

export const jobService = {
  getJobs: async (): Promise<JobOpportunity[]> => {
    // Simulated API call delay
    await new Promise((resolve) => setTimeout(resolve, 400));
    return MOCK_JOBS;
  },
};
