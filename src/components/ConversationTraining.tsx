import { ArrowLeft, MessageCircle, Shield, AlertCircle, ChevronDown, ChevronUp, X, Sliders } from 'lucide-react';
import { useState } from 'react';
import svgPaths from "../imports/svg-dc2veddptv";
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface ConversationTrainingProps {
  onNavigate: (screen: string) => void;
}

type Scenario = {
  id: string;
  title: string;
  context: string;
  icon: string;
};

type Message = {
  sender: 'ai' | 'user';
  text: string;
};

type CoachingFeedback = {
  safety_score: number;
  coach_feedback: string;
  opponent_reply: string;
};

type FAQItem = {
  id: string;
  category: string;
  question: string;
  answer: string;
  emoji: string;
};

type SimulationSettings = {
  intensity: 'low' | 'medium' | 'high';
  personality: 'aggressive' | 'passive_aggressive' | 'gaslighting' | 'flirty' | 'subtle';
};

export function ConversationTraining({ onNavigate }: ConversationTrainingProps) {
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [simulationSettings, setSimulationSettings] = useState<SimulationSettings>({
    intensity: 'medium',
    personality: 'subtle'
  });
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [showCoaching, setShowCoaching] = useState(false);
  const [coachingFeedback, setCoachingFeedback] = useState<CoachingFeedback | null>(null);
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);

  const scenarios: Scenario[] = [
    {
      id: 'workplace',
      title: 'Workplace Conversation',
      context: 'A colleague keeps asking personal questions',
      icon: '💼'
    },
    {
      id: 'public',
      title: 'Public Interaction',
      context: 'Someone approaches you on the street',
      icon: '🚶‍♀️'
    },
    {
      id: 'social',
      title: 'Social Gathering',
      context: 'Uncomfortable situation at a party',
      icon: '🎉'
    }
  ];

  const startScenario = (scenarioId: string) => {
    // Clean state reset - clear all previous session data
    setSelectedScenario(scenarioId);
    setMessages([]);
    setShowCoaching(false);
    setCoachingFeedback(null);
    setCurrentInput('');
    setIsLoadingResponse(false);

    // Show setup modal
    setShowSetupModal(true);
  };

  const startSimulation = () => {
    setShowSetupModal(false);
    const initialMessages: Message[] = [
      {
        sender: 'ai',
        text: getInitialMessage(selectedScenario!, simulationSettings)
      }
    ];
    setMessages(initialMessages);
    setShowCoaching(false);
    setCoachingFeedback(null);
  };

  const getInitialMessage = (scenarioId: string, settings: SimulationSettings): string => {
    const { personality, intensity } = settings;

    const messagesByPersonality: Record<string, Record<string, string[]>> = {
      workplace: {
        subtle: [
          "Hi! I noticed you're working late again. Want to grab dinner together?",
          "Hey, you've been here so long. Thought maybe we could grab a bite after?"
        ],
        aggressive: [
          "You're still here? Come on, let's go get drinks. Don't be boring.",
          "Stop working so hard. You're coming with me whether you like it or not."
        ],
        passive_aggressive: [
          "I guess you're too busy to grab dinner with your coworkers. Some team player you are.",
          "Wow, working late again? Must be nice to have nothing better to do."
        ],
        gaslighting: [
          "You seemed really into me earlier. Did I imagine that? You're sending mixed signals.",
          "I'm just trying to be nice, but you keep acting like I'm doing something wrong. Are you always this difficult?"
        ],
        flirty: [
          "You know, you look really good when you're focused. Want to get out of here?",
          "I've been watching you work... impressive. How about we continue this over drinks at my place?"
        ]
      },
      public: {
        subtle: [
          "Hey there! You have such a beautiful smile. Can I buy you a drink?",
          "Excuse me, I couldn't help but notice you. You seem really interesting."
        ],
        aggressive: [
          "Hey! Where are you going? Come talk to me.",
          "What's your problem? I'm trying to be nice here. Stop walking away from me."
        ],
        passive_aggressive: [
          "Guess you're too good to talk to anyone. Whatever, I tried.",
          "Typical. Pretty girl who thinks she's too good for a conversation."
        ],
        gaslighting: [
          "You were giving me signals from across the street. Don't play innocent now.",
          "I'm not a stranger, we've met before. Don't you remember? You're acting crazy."
        ],
        flirty: [
          "Damn, you look incredible. What's a beautiful woman like you doing alone?",
          "Hey gorgeous, let me walk you home. A pretty woman like you shouldn't be alone."
        ]
      },
      social: {
        subtle: [
          "Come on, just one more drink! Don't be boring, everyone else is staying.",
          "You're not leaving already, right? The night's just getting started!"
        ],
        aggressive: [
          "You're not going anywhere. Sit back down and finish your drink.",
          "Don't be such a buzzkill. Everyone's having fun except you."
        ],
        passive_aggressive: [
          "I guess you don't care about being a good friend. Abandoning the group like this.",
          "Fine, leave. I can see how much you actually care about us."
        ],
        gaslighting: [
          "You're making a scene out of nothing. Everyone else is fine, why are you so sensitive?",
          "You were literally just having fun. Now you're acting weird. Did someone say something to you?"
        ],
        flirty: [
          "Come dance with me... unless you're scared of how good it'll feel.",
          "Let's go somewhere more private. I promise you'll have a great time."
        ]
      }
    };

    const scenarioMessages = messagesByPersonality[scenarioId]?.[personality] || messagesByPersonality[scenarioId]?.subtle || [];

    // Adjust based on intensity (low = first message, medium = random, high = more aggressive)
    if (intensity === 'low') {
      return scenarioMessages[0];
    } else if (intensity === 'high' && scenarioMessages.length > 1) {
      return scenarioMessages[scenarioMessages.length - 1];
    }
    // medium - return random message
    return scenarioMessages[Math.floor(Math.random() * scenarioMessages.length)] || scenarioMessages[0];
  };

  const handleSendMessage = async () => {
    if (!currentInput.trim() || isLoadingResponse) return;

    const userMessage = currentInput.trim();

    // Add user message
    const newMessages = [...messages, { sender: 'user' as const, text: userMessage }];
    setMessages(newMessages);
    setCurrentInput('');
    setIsLoadingResponse(true);

    try {
      // Sanitize conversation history - remove any messages with null/empty content
      const sanitizedHistory = messages.filter(msg => msg && msg.text && typeof msg.text === 'string' && msg.text.trim() !== '');

      // Call AI backend
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-7f9db486/conversation/respond`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({
            scenarioId: selectedScenario,
            userMessage,
            conversationHistory: sanitizedHistory,
            simulationSettings: {
              intensity: simulationSettings.intensity,
              personality: simulationSettings.personality
            }
          })
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('AI conversation error:', errorText);
        throw new Error(`Failed to get AI response: ${response.status}`);
      }

      const result = await response.json();

      // Debug logging - log the raw result
      console.log('RAW EDGE FUNCTION RESULT:', result);

      // Detect response format (new vs old) and extract accordingly
      let opponentReply: string;
      let safetyScore: number;
      let coachFeedback: string;

      // Check if it's the NEW format (opponent_reply, safety_score, coach_feedback)
      if (result.opponent_reply || result.safety_score !== undefined || result.coach_feedback) {
        console.log('Detected NEW API format');
        opponentReply = (result.opponent_reply && typeof result.opponent_reply === 'string' && result.opponent_reply.trim())
          ? result.opponent_reply.trim()
          : "I understand. Let's continue this conversation.";

        safetyScore = (typeof result.safety_score === 'number')
          ? result.safety_score
          : (parseInt(result.safety_score) || 5);

        coachFeedback = (result.coach_feedback && typeof result.coach_feedback === 'string' && result.coach_feedback.trim())
          ? result.coach_feedback.trim()
          : "Good effort! Keep practicing setting clear boundaries.";
      }
      // Otherwise, assume it's the OLD format (aiResponse, feedback.safetyLevel)
      else if (result.aiResponse || result.feedback) {
        console.log('Detected OLD API format');
        opponentReply = (result.aiResponse && typeof result.aiResponse === 'string' && result.aiResponse.trim())
          ? result.aiResponse.trim()
          : "I understand. Let's continue this conversation.";

        safetyScore = (result.feedback?.safetyLevel)
          ? convertSafetyLevelToScore(result.feedback.safetyLevel)
          : 5;

        coachFeedback = extractCoachFeedback(result.feedback);
      }
      // Fallback: completely unknown format
      else {
        console.warn('Unknown API response format, using defaults');
        opponentReply = "I understand. Let's continue this conversation.";
        safetyScore = 5;
        coachFeedback = "Good effort! Keep practicing setting clear boundaries.";
      }

      console.log('EXTRACTED VALUES:', { opponentReply, safetyScore, coachFeedback, format: result.opponent_reply ? 'new' : 'old' });

      // Add opponent's reply (AI response as character)
      const updatedMessages = [...newMessages, { sender: 'ai' as const, text: opponentReply }];
      setMessages(updatedMessages);

      // Show coaching feedback
      setCoachingFeedback({
        safety_score: safetyScore,
        coach_feedback: coachFeedback,
        opponent_reply: opponentReply
      });
      setShowCoaching(true);
    } catch (error) {
      console.error('Error calling AI conversation API:', error);

      // Fallback to basic response if AI fails
      const fallbackFeedback: CoachingFeedback = {
        safety_score: 5,
        coach_feedback: 'AI service temporarily unavailable. Try expressing your boundary clearly and firmly.',
        opponent_reply: "I understand. Let me know if you change your mind."
      };

      setCoachingFeedback(fallbackFeedback);
      setShowCoaching(true);

      setMessages([...newMessages, {
        sender: 'ai' as const,
        text: fallbackFeedback.opponent_reply
      }]);
    } finally {
      setIsLoadingResponse(false);
    }
  };

  const getSafetyColor = (score: number) => {
    if (score >= 8) return '#9FB7A4'; // Green - Excellent
    if (score >= 5) return '#E8C547'; // Yellow - Adequate
    return '#E57373'; // Red - Needs improvement
  };

  const getSafetyLabel = (score: number): string => {
    if (score >= 8) return 'Excellent!';
    if (score >= 5) return 'Good effort';
    return 'Needs work';
  };

  const getSafetyIcon = (score: number): string => {
    if (score >= 8) return '🌟';
    if (score >= 5) return '👍';
    return '💪';
  };

  // Helper function to convert safetyLevel to safety_score
  const convertSafetyLevelToScore = (safetyLevel: string): number => {
    switch (safetyLevel?.toLowerCase()) {
      case 'high':
        return 9;
      case 'medium':
        return 6;
      case 'low':
        return 3;
      default:
        return 5;
    }
  };

  // Helper function to extract coach feedback from old format
  const extractCoachFeedback = (feedback: any): string => {
    if (!feedback) return 'Good effort! Keep practicing setting clear boundaries.';

    // Try to get from suggestions array
    if (feedback.suggestions && Array.isArray(feedback.suggestions) && feedback.suggestions.length > 0) {
      // Join first 2 suggestions
      return feedback.suggestions.slice(0, 2).join(' ');
    }

    // Try boundary clarity
    if (feedback.boundaryClarity) {
      return feedback.boundaryClarity;
    }

    return 'Good effort! Keep practicing setting clear boundaries.';
  };

  // Helper function to clean markdown code blocks from AI response
  const cleanJsonResponse = (rawResponse: string): string => {
    if (!rawResponse || typeof rawResponse !== 'string') {
      return '';
    }

    let cleaned = rawResponse.trim();

    // Remove markdown code block markers: ```json and ```
    cleaned = cleaned.replace(/^```json\s*/i, '');
    cleaned = cleaned.replace(/^```\s*/i, '');
    cleaned = cleaned.replace(/\s*```$/g, '');

    // Remove any leading/trailing whitespace again
    cleaned = cleaned.trim();

    return cleaned;
  };

  const faqItems: FAQItem[] = [
    // Immediate Danger
    {
      id: 'danger-now',
      category: 'Immediate Danger',
      question: "I'm in danger right now. What should I do?",
      answer: "If you are in immediate danger, your safety comes first. If it is safe to do so, move to a public or well-lit place. Use the app's emergency button or trusted contacts feature to share your live location. If you can safely contact local emergency services, please do so as soon as possible.",
      emoji: '🚨'
    },
    {
      id: 'being-followed',
      category: 'Immediate Danger',
      question: "Someone is following me. What can I do discreetly?",
      answer: "Try to enter a crowded or secure place such as a shop, café, or building with staff. Keep your phone ready. You can activate Guardian Mode to share your location or trigger a simulated call to discourage the person following you.",
      emoji: '🚨'
    },
    {
      id: 'cant-talk',
      category: 'Immediate Danger',
      question: "I can't talk right now. Can the app help silently?",
      answer: "Yes. You can use silent emergency features such as location sharing, the dead-man switch, or predefined emergency gestures without speaking or typing.",
      emoji: '🚨'
    },
    // Guardian Features
    {
      id: 'guardian-mode',
      category: 'Guardian & Emergency Features',
      question: "How does Guardian Mode help me?",
      answer: "Guardian Mode can share your real-time location with trusted contacts and trigger simulated phone calls to help you appear accompanied or deter threats.",
      emoji: '📞'
    },
    {
      id: 'fake-call',
      category: 'Guardian & Emergency Features',
      question: "What is the fake call feature for?",
      answer: "It creates a realistic incoming call screen and voice to help you exit uncomfortable or unsafe situations without raising suspicion.",
      emoji: '📞'
    },
    {
      id: 'emergency-discrete',
      category: 'Guardian & Emergency Features',
      question: "Will anyone know I activated an emergency feature?",
      answer: "No visible notifications or alerts appear on your screen unless you choose to see them. Emergency actions are designed to be discreet.",
      emoji: '📞'
    },
    // Evidence & Safety
    {
      id: 'save-evidence',
      category: 'Evidence & Safety',
      question: "I need to save evidence but I'm scared it will be found.",
      answer: "You can use the Evidence Vault to securely store photos, audio, or documents. Once uploaded, the file is encrypted and removed from your phone's local storage.",
      emoji: '🔐'
    },
    {
      id: 'what-evidence',
      category: 'Evidence & Safety',
      question: "What kind of evidence should I keep?",
      answer: "You may store photos of injuries, threatening messages, voice recordings, financial documents, or any material that helps show what happened.",
      emoji: '🔐'
    },
    {
      id: 'evidence-access',
      category: 'Evidence & Safety',
      question: "Can anyone else access my evidence?",
      answer: "No. Only you can access your encrypted evidence using your secure unlock method.",
      emoji: '🔐'
    },
    // Emotional Support
    {
      id: 'feeling-scared',
      category: 'Emotional Support',
      question: "I feel scared, overwhelmed, or confused.",
      answer: "That's understandable. You are not weak for feeling this way. Try to take slow breaths and focus on staying safe right now. You can talk to me here, or use the voice diary to express what you're feeling.",
      emoji: '🧠'
    },
    {
      id: 'doubt-guilt',
      category: 'Emotional Support',
      question: "Is it normal to doubt myself or feel guilty?",
      answer: "Yes. Many people in stressful or abusive situations feel this way. What matters is your safety and well-being. You deserve help and support.",
      emoji: '🧠'
    },
    // Legal Help
    {
      id: 'is-abuse',
      category: 'Legal & Practical Help',
      question: "I'm being threatened or controlled. Is this abuse?",
      answer: "Threats, control over money, monitoring your movements, or forcing you to do things against your will can all be forms of abuse. You are not overreacting by seeking help.",
      emoji: '⚖️'
    },
    {
      id: 'legal-steps',
      category: 'Legal & Practical Help',
      question: "Can the app help me with legal steps?",
      answer: "Yes. The app can guide you on documenting incidents, preparing basic legal documents, and finding legal aid or support services.",
      emoji: '⚖️'
    },
    {
      id: 'debts',
      category: 'Legal & Practical Help',
      question: "I'm worried about debts or loans taken in my name.",
      answer: "You can store related documents securely and ask for guidance on disputing debts or seeking legal assistance.",
      emoji: '⚖️'
    },
    // Financial Support
    {
      id: 'no-money',
      category: 'Support & Resources',
      question: "I don't have money to leave my situation. What can I do?",
      answer: "You may be eligible for financial aid, NGO support, or assistance programs. The app can help match you with available resources based on your situation.",
      emoji: '💰'
    },
    {
      id: 'support-privacy',
      category: 'Support & Resources',
      question: "Will applying for support expose me?",
      answer: "No. Resource matching is private and designed to protect your identity and safety.",
      emoji: '💰'
    },
    // Privacy
    {
      id: 'phone-check',
      category: 'Privacy & Disguise',
      question: "What if someone checks my phone?",
      answer: "The app is designed to look like a normal lifestyle or wellness app. Sensitive features are hidden behind secure access methods.",
      emoji: '🕶️'
    },
    {
      id: 'quick-hide',
      category: 'Privacy & Disguise',
      question: "Can I quickly hide the app if I feel unsafe?",
      answer: "Yes. You can use the quick disguise gesture to instantly switch to a harmless screen such as weather or daily tips.",
      emoji: '🕶️'
    },
    // Reassurance
    {
      id: 'am-i-alone',
      category: 'Reassurance',
      question: "Am I alone in this?",
      answer: "No. You are not alone, and help is available. Even taking the step to ask a question here is a sign of strength.",
      emoji: '🤍'
    },
    {
      id: 'what-focus',
      category: 'Reassurance',
      question: "What should I focus on right now?",
      answer: "Your safety comes first. Take one step at a time. You don't need to solve everything today.",
      emoji: '🤍'
    }
  ];

  // Group FAQs by category
  const groupedFAQs = faqItems.reduce((acc, faq) => {
    if (!acc[faq.category]) {
      acc[faq.category] = [];
    }
    acc[faq.category].push(faq);
    return acc;
  }, {} as Record<string, FAQItem[]>);

  return (
    <div className="h-screen bg-gradient-to-b from-[#E8D4E0] via-[#D9DCCC] to-[#CFE4D5] overflow-hidden flex flex-col relative">
      {/* Header */}
      <div className="pt-16 px-6 pb-4 bg-transparent">
        <div className="flex items-center gap-4">
          <button
            onClick={() => selectedScenario ? setSelectedScenario(null) : onNavigate('dashboard')}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-[0px_4px_6px_0px_rgba(0,0,0,0.1),0px_2px_4px_0px_rgba(0,0,0,0.1)]"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 20 20">
              <path d={svgPaths.p33f6b680} stroke="#6F6F7A" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
              <path d="M15.8333 10H4.16667" stroke="#6F6F7A" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
            </svg>
          </button>
          <div className="flex-1">
            <h1 className="text-[24px] text-[#3A3A44] font-normal leading-[32px]">Safe Conversations</h1>
            <p className="text-[14px] text-[#6F6F7A] leading-[20px] font-normal">Practice setting boundaries</p>
          </div>
          <div className="w-6 h-6">
            <svg className="w-full h-full" fill="none" viewBox="0 0 24 24">
              <path d={svgPaths.p1a1dc120} stroke="#C2A7B8" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </div>
        </div>
      </div>

      {!selectedScenario ? (
        /* Scenario Selection */
        <div className="flex-1 overflow-y-auto px-6 pb-8">
          <p className="text-[#6F6F7A] text-[14px] mb-4 leading-[20px] font-normal w-[338px]">
            Choose a scenario to practice your responses in a safe space
          </p>
          
          {/* Scenario Cards */}
          <div className="space-y-[14px]">
            {scenarios.map((scenario, idx) => (
              <button
                key={scenario.id}
                onClick={() => startScenario(scenario.id)}
                className="w-full bg-white rounded-[24px] shadow-[0px_4px_6px_0px_rgba(0,0,0,0.1),0px_2px_4px_0px_rgba(0,0,0,0.1)] border-[0.883px] border-[rgba(194,167,184,0.2)] hover:scale-[1.01] transition-transform text-left"
                style={{ 
                  height: idx === 2 ? '101.767px' : '121.767px',
                  padding: '24.88px'
                }}
              >
                <div className="flex items-start gap-4">
                  <div className="text-[36px] leading-[40px] flex-shrink-0 w-[49.433px]">{scenario.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-[16px] text-[#3A3A44] font-semibold leading-[28px]">
                      {scenario.title}
                    </h3>
                    <p className="text-[14px] text-[#6F6F7A] leading-[20px] font-normal mt-1" style={{
                      width: idx === 2 ? '100%' : '218px'
                    }}>
                      {scenario.context}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Practice Space Info */}
          <div className="bg-[rgba(194,167,184,0.1)] rounded-[16px] mt-[32px] h-16 flex items-center px-4 gap-3">
            <div className="w-5 h-5 flex-shrink-0">
              <svg className="block w-full h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
                <g>
                  <path d={svgPaths.p147d8800} stroke="#C2A7B8" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                </g>
              </svg>
            </div>
            <p className="text-[12px] text-[#3A3A44] leading-[16px] font-normal w-[238px]">
              This is a practice space. You can try different responses without pressure or judgment.
            </p>
          </div>

          {/* FAQ Section */}
          <div className="mt-[32px]">
            <h2 className="text-[20px] text-[#3A3A44] font-semibold leading-[28px]">Emergency & Safety FAQ</h2>
            <p className="text-[#6F6F7A] text-[14px] mt-2 mb-5 leading-[20px] font-normal">
              Quick answers to common safety and support questions
            </p>
            
            <div className="space-y-3">
              {Object.keys(groupedFAQs).map((category) => (
                <div 
                  key={category} 
                  className="bg-white rounded-[16px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)] border-[0.883px] border-[rgba(194,167,184,0.1)] px-[21.767px] py-[21.767px]"
                  style={{ minHeight: '105.767px' }}
                >
                  <button
                    onClick={() => setExpandedFAQ(expandedFAQ === category ? null : category)}
                    className="w-full text-left"
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-[24px] flex-shrink-0 leading-[32px] w-[32.95px]">
                        {groupedFAQs[category][0].emoji}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-[#4A2E49] text-[16px] font-semibold leading-[16px] mb-1">
                          {category}
                        </h3>
                        <p className="text-[#9A9AAF] text-[14px] mb-1 leading-[20px] font-normal">
                          {groupedFAQs[category].length} questions
                        </p>
                        <div className="flex items-center gap-1 text-[#C2A7B8]">
                          <div className="w-4 h-4">
                            <svg className="block w-full h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                              <g>
                                <path 
                                  d={svgPaths.p1112dfa0}
                                  stroke="#C2A7B8" 
                                  strokeLinecap="round" 
                                  strokeLinejoin="round" 
                                  strokeWidth="1.33333"
                                  style={{
                                    transform: expandedFAQ === category ? 'rotate(180deg)' : 'none',
                                    transformOrigin: 'center',
                                    transition: 'transform 0.2s'
                                  }}
                                />
                              </g>
                            </svg>
                          </div>
                          <span className="text-[12px] leading-[16px] font-normal">
                            {expandedFAQ === category ? 'Hide Answers' : 'Show Answers'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                  
                  {expandedFAQ === category && (
                    <div className="mt-4 space-y-3 pt-4 border-t border-[#EEEAF0]">
                      {groupedFAQs[category].map((faq) => (
                        <div key={faq.id}>
                          <div className="bg-[#FAF8F6] rounded-2xl p-4">
                            <p className="text-sm text-[#3A3A44] font-medium mb-2 leading-[20px]">{faq.question}</p>
                            <p className="text-sm text-[#6F6F7A] leading-[20px]">{faq.answer}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="bg-[rgba(159,183,164,0.1)] rounded-[16px] p-4 flex gap-3 mt-4">
              <div className="w-5 h-5 flex-shrink-0">
                <svg className="w-full h-full" fill="none" viewBox="0 0 20 20">
                  <circle cx="10" cy="10" r="8.33333" stroke="#9FB7A4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                  <path d="M10 6.66667V10" stroke="#9FB7A4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                  <path d="M10 13.3333H10.0083" stroke="#9FB7A4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                </svg>
              </div>
              <div className="text-[12px] text-[#3A3A44] leading-[16px] font-normal flex-1">
                <p className="mb-1">Always stay calm and supportive. Never blame or question choices.</p>
                <p>Your safety comes first. Take one step at a time.</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Conversation Interface */
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden px-6 py-4 space-y-4">
            {messages.map((message, idx) => (
              <div
                key={idx}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.sender === 'user'
                      ? 'bg-[#C2A7B8] text-white rounded-br-sm'
                      : 'bg-white text-[#3A3A44] rounded-bl-sm'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
            ))}

            {/* Empty State Placeholder - when no messages and not loading */}
            {messages.length === 0 && !isLoadingResponse && !showCoaching && (
              <div className="flex flex-col items-center justify-center h-full py-12">
                <div className="w-16 h-16 bg-[#C2A7B8]/10 rounded-3xl flex items-center justify-center mb-4">
                  <Sliders className="w-8 h-8 text-[#C2A7B8]" />
                </div>
                <p className="text-[16px] text-[#3A3A44] font-medium text-center">
                  Configure your simulation to start...
                </p>
                <p className="text-[13px] text-[#6F6F7A] text-center mt-2">
                  Select intensity and personality settings
                </p>
              </div>
            )}

            {/* AI Thinking Indicator */}
            {isLoadingResponse && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-white text-[#3A3A44] rounded-bl-sm">
                  <div className="flex items-center gap-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-[#C2A7B8] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-[#C2A7B8] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-[#C2A7B8] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Real-time Coaching Widget */}
            {showCoaching && coachingFeedback && (
              <div className="bg-white rounded-3xl p-5 shadow-lg border border-[#C2A7B8]/20 mt-6 animate-in slide-in-from-bottom-4 duration-300">
                {/* Safety Score Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-sm"
                      style={{ backgroundColor: `${getSafetyColor(coachingFeedback.safety_score)}20` }}
                    >
                      {getSafetyIcon(coachingFeedback.safety_score)}
                    </div>
                    <div>
                      <p className="text-xs text-[#A1A1AF] font-medium">Safety Score</p>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold" style={{ color: getSafetyColor(coachingFeedback.safety_score) }}>
                          {coachingFeedback.safety_score}
                        </span>
                        <span className="text-sm text-[#A1A1AF]">/ 10</span>
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-medium ml-1"
                          style={{
                            backgroundColor: `${getSafetyColor(coachingFeedback.safety_score)}20`,
                            color: getSafetyColor(coachingFeedback.safety_score)
                          }}
                        >
                          {getSafetyLabel(coachingFeedback.safety_score)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Score Progress Bar */}
                <div className="mb-4">
                  <div className="h-2 bg-[#EEEAF0] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500 ease-out"
                      style={{
                        width: `${coachingFeedback.safety_score * 10}%`,
                        backgroundColor: getSafetyColor(coachingFeedback.safety_score)
                      }}
                    ></div>
                  </div>
                </div>

                {/* Coach Feedback */}
                <div className="bg-gradient-to-r from-[#FAF8F6] to-[#EEEAF0] rounded-2xl p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-[#C2A7B8]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Shield className="w-4 h-4 text-[#C2A7B8]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-[#A1A1AF] font-medium mb-1">Coach Insight</p>
                      <p className="text-sm text-[#3A3A44] leading-relaxed">
                        {coachingFeedback.coach_feedback}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Continue Button */}
                <button
                  onClick={() => {
                    setShowCoaching(false);
                    setCoachingFeedback(null);
                  }}
                  className="w-full py-3 bg-[#C2A7B8] text-white rounded-2xl hover:bg-[#C2A7B8]/90 transition-colors font-medium text-sm"
                >
                  Continue Conversation
                </button>
              </div>
            )}
          </div>

          {/* Input Area */}
          {!showCoaching && (
            <div className="sticky bottom-0 left-0 right-0 z-50 px-6 pt-4 pb-8 bg-white border-t border-[#C2A7B8]/20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
              <div className="flex gap-2 max-w-2xl mx-auto items-end">
                <input
                  type="text"
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your response..."
                  className="flex-1 px-4 py-3 bg-white border border-[#C2A7B8]/20 rounded-2xl text-[#3A3A44] placeholder:text-[#A1A1AF] focus:outline-none focus:border-[#C2A7B8] min-h-[48px]"
                  autoComplete="off"
                />
                <button
                  onClick={handleSendMessage}
                  className="px-6 py-3 bg-[#C2A7B8] text-white rounded-2xl hover:bg-[#C2A7B8]/90 transition-colors font-medium whitespace-nowrap min-h-[48px] flex items-center"
                >
                  Send
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Simulation Setup Modal - Bottom Sheet */}
      {showSetupModal && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end bg-black/60">
          {/* White Sheet - h-[85%] ensures only 85% height, leaving 15% dark backdrop visible */}
          <div className="w-full h-[85%] bg-white rounded-t-[2rem] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
            {/* Handle Bar */}
            <div className="flex justify-center pt-4 pb-2">
              <div className="w-12 h-1.5 bg-[#C2A7B8]/30 rounded-full" />
            </div>

            {/* Header - Fixed at top */}
            <div className="px-6 pb-4 border-b border-[#EEEAF0] flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#C2A7B8]/20 rounded-2xl flex items-center justify-center">
                    <Sliders className="w-5 h-5 text-[#C2A7B8]" />
                  </div>
                  <div>
                    <h2 className="text-[18px] text-[#3A3A44] font-semibold leading-[24px]">Customize Your Opponent</h2>
                    <p className="text-[13px] text-[#6F6F7A] leading-[18px]">Set the difficulty for this scenario</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowSetupModal(false);
                    setSelectedScenario(null);
                  }}
                  className="w-8 h-8 bg-[#EEEAF0] hover:bg-[#D9DCCC] rounded-full flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-[#6F6F7A]" />
                </button>
              </div>
            </div>

            {/* Scrollable Content Area - Middle */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
              {/* Intensity Level */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-[15px] text-[#3A3A44] font-semibold">Intensity Level</label>
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      simulationSettings.intensity === 'low'
                        ? 'bg-[#9FB7A4]/20 text-[#9FB7A4]'
                        : simulationSettings.intensity === 'medium'
                        ? 'bg-[#E8C547]/20 text-[#E8C547]'
                        : 'bg-[#E57373]/20 text-[#E57373]'
                    }`}
                  >
                    {simulationSettings.intensity.charAt(0).toUpperCase() + simulationSettings.intensity.slice(1)}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(['low', 'medium', 'high'] as const).map((level) => (
                    <button
                      key={level}
                      onClick={() => setSimulationSettings({ ...simulationSettings, intensity: level })}
                      className={`py-2.5 px-3 rounded-xl text-xs font-medium transition-all ${
                        simulationSettings.intensity === level
                          ? level === 'low'
                            ? 'bg-[#9FB7A4] text-white shadow-md'
                            : level === 'medium'
                            ? 'bg-[#E8C547] text-white shadow-md'
                            : 'bg-[#E57373] text-white shadow-md'
                          : 'bg-[#EEEAF0] text-[#6F6F7A] hover:bg-[#D9DCCC]'
                      }`}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-[#A1A1AF] mt-2">
                  {simulationSettings.intensity === 'low' && 'Gentle approach - easier to practice'}
                  {simulationSettings.intensity === 'medium' && 'Moderate pressure - realistic scenarios'}
                  {simulationSettings.intensity === 'high' && 'Intense situation - advanced practice'}
                </p>
              </div>

              {/* Personality Type */}
              <div>
                <label className="text-[15px] text-[#3A3A44] font-semibold mb-3 block">
                  Personality Type
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { id: 'subtle', label: 'Subtle', desc: 'Sneaky and manipulative', emoji: '🎭' },
                    { id: 'aggressive', label: 'Aggressive', desc: 'Direct and pushy', emoji: '😠' },
                    { id: 'passive_aggressive', label: 'Passive-Aggressive', desc: 'Guilt-tripping and subtle', emoji: '😏' },
                    { id: 'gaslighting', label: 'Gaslighting', desc: 'Confusing and reality-denying', emoji: '🌀' },
                    { id: 'flirty', label: 'Flirty/Inappropriate', desc: 'Crosses personal boundaries', emoji: '💋' }
                  ].map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSimulationSettings({ ...simulationSettings, personality: type.id as any })}
                      className={`p-3 rounded-xl text-left transition-all border-2 ${
                        simulationSettings.personality === type.id
                          ? 'border-[#C2A7B8] bg-[#C2A7B8]/10'
                          : 'border-[#EEEAF0] hover:border-[#C2A7B8]/30 hover:bg-[#FAF8F6]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl flex-shrink-0">{type.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[#3A3A44] truncate">{type.label}</p>
                          <p className="text-[11px] text-[#6F6F7A] truncate">{type.desc}</p>
                        </div>
                        {simulationSettings.personality === type.id && (
                          <div className="w-5 h-5 bg-[#C2A7B8] rounded-full flex items-center justify-center flex-shrink-0">
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor">
                              <path d="M20 6L9 17l-5-5" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer - Fixed at bottom */}
            <div className="p-6 bg-white border-t border-[#EEEAF0] flex-shrink-0">
              <button
                onClick={startSimulation}
                className="w-full py-3.5 bg-[#C2A7B8] hover:bg-[#C2A7B8]/90 text-white rounded-2xl font-semibold text-[15px] transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
              >
                Start Simulation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}