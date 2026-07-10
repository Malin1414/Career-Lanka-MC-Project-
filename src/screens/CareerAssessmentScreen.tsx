import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  Alert,
  StatusBar,
} from 'react-native';
import { Theme } from '../utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

const QUESTIONS = [
  {
    category: 'FIELD OF STUDY',
    question: 'What area of technology or business interests you the most?',
    proTip: 'Think about what modules you voluntarily read about outside of your university syllabus.',
    options: [
      {
        icon: 'code-slash-outline',
        title: 'Software Development',
        desc: 'Writing code, designing application logic, and building mobile or web apps.'
      },
      {
        icon: 'analytics-outline',
        title: 'Artificial Intelligence & Data',
        desc: 'Training machine learning models, cleaning data datasets, and extracting business insights.'
      },
      {
        icon: 'cloud-outline',
        title: 'Cloud & Network Infrastructure',
        desc: 'Configuring servers, maintaining cloud pipelines (AWS/Azure), and securing network gates.'
      },
      {
        icon: 'color-palette-outline',
        title: 'UI/UX & Creative Execution',
        desc: 'Designing user interfaces, conducting user research, and wireframing user journeys.'
      }
    ]
  },
  {
    category: 'WORKPLACE CULTURE',
    question: 'What type of work setting matches your lifestyle?',
    proTip: 'Consider the balance between isolation and collaborative teamwork.',
    options: [
      {
        icon: 'home-outline',
        title: 'Global Remote Teams',
        desc: 'Working from home for foreign companies with flexible asynchronous schedules.'
      },
      {
        icon: 'rocket-outline',
        title: 'Fast-Paced Startups',
        desc: 'Wearing multiple hats, working on rapid deployments, and high growth potential.'
      },
      {
        icon: 'business-outline',
        title: 'Established Tech Giants',
        desc: 'Structured roles at top firms (e.g. WSO2, Sysco LABS, Virtusa) with stable career paths.'
      },
      {
        icon: 'people-outline',
        title: 'Digital Agencies & Consultancies',
        desc: 'Working on diverse projects for multiple clients, adapting to fast turnarounds.'
      }
    ]
  },
  {
    category: 'WORK ENVIRONMENT', // Question 3 matches mockup 4!
    question: 'What type of work activities make you feel most energized and productive?',
    proTip: "Choose the activity where you often find yourself in a 'flow state,' losing track of time while working.",
    options: [
      {
        icon: 'laptop-outline',
        title: 'Technical Problem Solving',
        desc: 'Writing code, analyzing complex data systems, and debugging architecture.'
      },
      {
        icon: 'flask-outline',
        title: 'Research & Analysis',
        desc: 'Gathering insights, conducting scientific trials, and validating hypotheses.'
      },
      {
        icon: 'create-outline',
        title: 'Creative Execution',
        desc: 'Designing visual interfaces, crafting brand narratives, and ideation.'
      },
      {
        icon: 'bar-chart-outline',
        title: 'Leadership & Strategy',
        desc: 'Managing teams, defining product roadmaps, and stakeholder communication.'
      }
    ]
  },
  {
    category: 'CODE EXPOSURE',
    question: 'What is your primary experience level with programming?',
    proTip: 'Select the area where you write the most clean and self-reliant code.',
    options: [
      {
        icon: 'server-outline',
        title: 'Strong Backend & Logic',
        desc: 'Proficient in backend languages like Python, Java, Node.js, C++ and writing APIs.'
      },
      {
        icon: 'phone-portrait-outline',
        title: 'Strong Frontend & Mobile',
        desc: 'Experienced in layout design with JavaScript, React Native, HTML/CSS, or Flutter.'
      },
      {
        icon: 'list-circle-outline',
        title: 'Data Wrangling',
        desc: 'Experienced in querying databases using SQL, or analyzing datasets in Python (Pandas).'
      },
      {
        icon: 'ban-outline',
        title: 'Minimal Coding / Business',
        desc: 'Prefer high-level design, scrum management, product alignment, or QA testing.'
      }
    ]
  },
  {
    category: 'COLLABORATION STYLE',
    question: 'How do you usually contribute to group projects at university?',
    proTip: 'Be honest about your natural default role in student groups.',
    options: [
      {
        icon: 'bug-outline',
        title: 'Core Code Implementer',
        desc: 'Writing the main algorithms, resolving compilation conflicts, and merging branches.'
      },
      {
        icon: 'search-outline',
        title: 'Research & Stack Advisor',
        desc: 'Reading documentation, comparing tools, and finding architectural templates.'
      },
      {
        icon: 'brush-outline',
        title: 'UI Designer & Presenter',
        desc: 'Designing UI slides, writing copy, and presenting findings during project vivas.'
      },
      {
        icon: 'calendar-outline',
        title: 'Project Coordinator',
        desc: 'Assigning sub-tasks, managing schedules, and making sure files are submitted on time.'
      }
    ]
  },
  {
    category: 'STUDY FOCUS',
    question: 'Which university modules did you find most engaging?',
    proTip: 'Think of classes where you felt the content was natural and easy to grasp.',
    options: [
      {
        icon: 'git-branch-outline',
        title: 'Data Structures & OOP',
        desc: 'Understanding logical hierarchy, pointer networks, and data sorting algorithms.'
      },
      {
        icon: 'layers-outline',
        title: 'DBMS & Systems Design',
        desc: 'Modeling entity relationships, normalizing tables, and architectural patterns.'
      },
      {
        icon: 'globe-outline',
        title: 'Web & Mobile Engineering',
        desc: 'Building client-server portals, responsive views, and integrating state APIs.'
      },
      {
        icon: 'shield-checkmark-outline',
        title: 'Networks & Cybersecurity',
        desc: 'Analyzing IP packets, configuring firewalls, and studying cryptographic schemes.'
      }
    ]
  },
  {
    category: 'THINKING PATTERN',
    question: 'When faced with a complex bug or system crash, what is your first instinct?',
    proTip: 'Select the response that describes your immediate reaction under pressure.',
    options: [
      {
        icon: 'hammer-outline',
        title: 'Inspect Log Trace',
        desc: 'Placing debug print breakpoints and analyzing error stacks step-by-step.'
      },
      {
        icon: 'globe-outline',
        title: 'Search Community forums',
        desc: 'Searching online solutions (Stack Overflow, GitHub threads) for similar issue patterns.'
      },
      {
        icon: 'refresh-outline',
        title: 'Re-evaluate Code Architecture',
        desc: 'Re-routing data logic flow or writing clean simpler functions from scratch.'
      },
      {
        icon: 'help-buoy-outline',
        title: 'Consult Peer Team',
        desc: 'Pair programming, consulting a senior teammate, or explaining the bug to trigger insights.'
      }
    ]
  },
  {
    category: 'KNOWLEDGE ACQUISITION',
    question: 'How do you prefer to pick up new technical skills?',
    proTip: 'Different roles require different skill acquisition pathways.',
    options: [
      {
        icon: 'construct-outline',
        title: 'Building Side Projects',
        desc: 'Learning by coding, making templates, and deploying small apps directly.'
      },
      {
        icon: 'play-outline',
        title: 'Video walkthroughs',
        desc: 'Following structured tutorials on YouTube, Coursera, or Udemy.'
      },
      {
        icon: 'document-text-outline',
        title: 'Reading Technical Specs',
        desc: 'Browsing official documentation libraries, Git wikis, and developer reference pages.'
      },
      {
        icon: 'code-outline',
        title: 'Open Source Contributions',
        desc: 'Reading other engineers code, submitting pull requests, and getting reviewed.'
      }
    ]
  },
  {
    category: 'FUTURE OUTLOOK',
    question: 'Where do you see yourself in 3 years after graduation?',
    proTip: 'Imagine your ideal day-to-day work tasks in the intermediate future.',
    options: [
      {
        icon: 'medal-outline',
        title: 'Senior Technical Engineer',
        desc: 'Leading product coding, writing microservices, and debugging core architecture.'
      },
      {
        icon: 'briefcase-outline',
        title: 'Technical Product Lead',
        desc: 'Defining product features, bridging user demands, and guiding the sprint team.'
      },
      {
        icon: 'color-palette-outline',
        title: 'UI/UX Design Architect',
        desc: 'Standardizing typography systems, building mockups, and reviewing usability tests.'
      },
      {
        icon: 'shield-outline',
        title: 'Cloud Security Consultant',
        desc: 'Auditing system safety, deploying cloud containers, and managing database encryption.'
      }
    ]
  },
  {
    category: 'INDUSTRY ALIGNMENT',
    question: 'Which Sri Lankan sector matches your undergraduate career goals?',
    proTip: 'This helps map you to local hiring entities in the market.',
    options: [
      {
        icon: 'code-working-outline',
        title: 'Software Exports',
        desc: 'Working at dedicated software houses (99x, Codegen, IFS) on export services.'
      },
      {
        icon: 'radio-outline',
        title: 'Telecom & ISP Giants',
        desc: 'Joining enterprise systems teams at telecom providers like Dialog and SLT.'
      },
      {
        icon: 'cash-outline',
        title: 'FinTech & Digital Banking',
        desc: 'Implementing secure payment APIs, online banking systems, and blockchain networks.'
      },
      {
        icon: 'cube-outline',
        title: 'R&D Innovation Labs',
        desc: 'Joining experimental research hubs or pursuing postgraduate assistantships.'
      }
    ]
  }
];

export default function CareerAssessmentScreen({ navigation }: any) {
  const { saveAssessment } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(Array(10).fill(-1));

  const handleSelectOption = (optionIndex: number) => {
    const updated = [...selectedAnswers];
    updated[currentStep] = optionIndex;
    setSelectedAnswers(updated);
  };

  const handleNext = () => {
    if (selectedAnswers[currentStep] === -1) {
      Alert.alert('Selection Required', 'Please select one option to continue.');
      return;
    }

    if (currentStep < 9) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      navigation.goBack();
    }
  };

  const handleSubmit = async () => {
    // Check if all answered
    if (selectedAnswers.includes(-1)) {
      Alert.alert('Incomplete Assessment', 'Please answer all questions before submitting.');
      return;
    }

    // Map selected index to option text to create compiled answers
    const answersTextArray = QUESTIONS.map((q, idx) => {
      const selectedIndex = selectedAnswers[idx];
      return `${q.category}: ${q.options[selectedIndex].title}`;
    });

    const answersPayload = {
      interests: answersTextArray[0] + ', ' + answersTextArray[1],
      programming_skills: answersTextArray[3] + ', ' + answersTextArray[7],
      soft_skills: answersTextArray[4],
      favourite_subjects: answersTextArray[5],
      preferred_working_style: answersTextArray[2],
      career_interests: answersTextArray[8] + ', ' + answersTextArray[9]
    };

    const { success } = await saveAssessment(answersPayload);

    if (success) {
      navigation.replace('AIProcessing', { assessmentAnswers: answersPayload });
    } else {
      Alert.alert('Submission Error', 'Failed to store assessment details. Please try again.');
    }
  };

  const activeQuestionInfo = QUESTIONS[currentStep];
  const progressPercent = ((currentStep + 1) / 10) * 100;
  const currentSelection = selectedAnswers[currentStep];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Theme.colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Skill Assessment</Text>
        <Text style={styles.stepIndicator}>Question {currentStep + 1} of 10</Text>
      </View>

      {/* Progress Bar Container */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
        </View>
        <View style={styles.progressLabelRow}>
          <Text style={styles.progressDesc}>Discover your ideal career path through AI-driven profiling.</Text>
          <Text style={styles.progressPercentText}>{Math.round(progressPercent)}% Complete</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Category capsule badge */}
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryBadgeText}>{activeQuestionInfo.category}</Text>
        </View>

        {/* Question Text */}
        <Text style={styles.questionText}>{activeQuestionInfo.question}</Text>

        {/* Options Stack */}
        <View style={styles.optionsContainer}>
          {activeQuestionInfo.options.map((opt, optIndex) => {
            const isSelected = currentSelection === optIndex;
            return (
              <TouchableOpacity
                key={optIndex}
                style={[
                  styles.optionCard,
                  isSelected && styles.optionCardSelected
                ]}
                onPress={() => handleSelectOption(optIndex)}
              >
                <View style={[
                  styles.optionIconWrapper,
                  isSelected && styles.optionIconWrapperSelected
                ]}>
                  <Ionicons 
                    name={opt.icon as any} 
                    size={22} 
                    color={isSelected ? '#0A0B0D' : Theme.colors.primary} 
                  />
                </View>
                
                <View style={styles.optionDetails}>
                  <Text style={[
                    styles.optionTitle,
                    isSelected && styles.optionTitleSelected
                  ]}>
                    {opt.title}
                  </Text>
                  <Text style={[
                    styles.optionDesc,
                    isSelected && styles.optionDescSelected
                  ]}>
                    {opt.desc}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Bottom Pro-tip info banner */}
      <View style={styles.proTipContainer}>
        <Ionicons name="bulb-outline" size={20} color={Theme.colors.primary} style={{ marginRight: 8, marginTop: 2 }} />
        <View style={{ flex: 1 }}>
          <Text style={styles.proTipTitle}>Pro-tip</Text>
          <Text style={styles.proTipText}>{activeQuestionInfo.proTip}</Text>
        </View>
      </View>

      {/* Footer Controls */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.navButton, styles.navButtonSecondary]}
          onPress={handleBack}
        >
          <Ionicons name="arrow-back-outline" size={16} color={Theme.colors.textSecondary} style={{ marginRight: 4 }} />
          <Text style={styles.navButtonTextSecondary}>Previous</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.navButton, styles.navButtonPrimary]}
          onPress={handleNext}
        >
          <Text style={styles.navButtonTextPrimary}>
            {currentStep === 9 ? 'Complete Analysis' : 'Next Question'}
          </Text>
          <Ionicons
            name={currentStep === 9 ? 'checkmark-done-outline' : 'arrow-forward-outline'}
            size={16}
            color="#0A0B0D"
            style={{ marginLeft: 6 }}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.lg,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 12 : 12,
    paddingBottom: Theme.spacing.md,
    backgroundColor: Theme.colors.background,
  },
  backBtn: {
    marginRight: Theme.spacing.md,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Theme.colors.text,
    flex: 1,
  },
  stepIndicator: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Theme.colors.textSecondary,
  },
  progressContainer: {
    backgroundColor: Theme.colors.background,
    paddingHorizontal: Theme.spacing.lg,
    paddingBottom: Theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: Theme.colors.border,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Theme.colors.primary, // Green accent matching mockup
    borderRadius: 3,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  progressDesc: {
    fontSize: 11,
    color: Theme.colors.textSecondary,
    flex: 1,
    marginRight: 12,
    lineHeight: 14,
  },
  progressPercentText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Theme.colors.primary,
  },
  scrollContainer: {
    padding: Theme.spacing.lg,
    paddingBottom: 20,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(5, 196, 143, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Theme.roundness.small,
    marginBottom: Theme.spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(5, 196, 143, 0.2)',
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Theme.colors.primary,
    letterSpacing: 0.5,
  },
  questionText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Theme.colors.text,
    lineHeight: 26,
    marginBottom: Theme.spacing.lg,
  },
  optionsContainer: {
    gap: 12,
  },
  optionCard: {
    flexDirection: 'row',
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.roundness.medium,
    padding: Theme.spacing.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    alignItems: 'center',
    ...Theme.shadows.small,
  },
  optionCardSelected: {
    borderColor: Theme.colors.primary,
    borderWidth: 1.5,
  },
  optionIconWrapper: {
    width: 42,
    height: 42,
    borderRadius: Theme.roundness.medium,
    backgroundColor: 'rgba(5, 196, 143, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.md,
  },
  optionIconWrapperSelected: {
    backgroundColor: Theme.colors.primary,
  },
  optionDetails: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Theme.colors.text,
    marginBottom: 2,
  },
  optionTitleSelected: {
    color: Theme.colors.text,
  },
  optionDesc: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    lineHeight: 16,
  },
  optionDescSelected: {
    color: Theme.colors.textSecondary,
  },
  proTipContainer: {
    flexDirection: 'row',
    backgroundColor: Theme.colors.card,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    borderRadius: Theme.roundness.medium,
    marginHorizontal: Theme.spacing.lg,
    marginBottom: Theme.spacing.md,
    padding: Theme.spacing.md,
    ...Theme.shadows.small,
  },
  proTipTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Theme.colors.text,
    marginBottom: 2,
  },
  proTipText: {
    fontSize: 11,
    color: Theme.colors.textSecondary,
    lineHeight: 15,
  },
  footer: {
    flexDirection: 'row',
    padding: Theme.spacing.md,
    backgroundColor: Theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.border,
    gap: 12,
  },
  navButton: {
    flex: 1,
    height: 44,
    borderRadius: Theme.roundness.medium,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  navButtonPrimary: {
    backgroundColor: Theme.colors.primary,
    ...Theme.shadows.small,
  },
  navButtonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  navButtonTextPrimary: {
    color: '#0A0B0D', // Dark text on green background
    fontWeight: 'bold',
    fontSize: 14,
  },
  navButtonTextSecondary: {
    color: Theme.colors.textSecondary,
    fontWeight: 'bold',
    fontSize: 14,
  },
});
