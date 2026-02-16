import { ArrowLeft, Heart, CheckCircle, ArrowRight } from 'lucide-react';
import { useState } from 'react';

interface MyLayakEligibilityProps {
  onNavigate: (screen: string) => void;
}

type Question = {
  id: string;
  text: string;
  options: string[];
};

type Program = {
  name: string;
  match: 'High' | 'Medium';
  description: string;
  nextStep: string;
};

export function MyLayakEligibility({ onNavigate }: MyLayakEligibilityProps) {
  const [step, setStep] = useState<'intro' | 'questions' | 'results'>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);

  const questions: Question[] = [
    {
      id: 'employment',
      text: 'What best describes your current situation?',
      options: [
        'Employed full-time',
        'Employed part-time',
        'Student',
        'Seeking opportunities',
        'Prefer not to say'
      ]
    },
    {
      id: 'support',
      text: 'Are you the primary caregiver in your household?',
      options: ['Yes', 'No', 'Shared responsibility', 'Prefer not to say']
    },
    {
      id: 'goals',
      text: 'What would help you most right now?',
      options: [
        'Education or training',
        'Healthcare support',
        'Housing assistance',
        'Financial stability',
        'Career development'
      ]
    }
  ];

  const programs: Program[] = [
    {
      name: 'Women Education Fund',
      match: 'High',
      description: 'Support for skill development and professional training',
      nextStep: 'Complete application form'
    },
    {
      name: 'Healthcare Assistance',
      match: 'High',
      description: 'Access to wellness and preventive care resources',
      nextStep: 'Review eligibility criteria'
    },
    {
      name: 'Career Pathway Program',
      match: 'Medium',
      description: 'Mentorship and job placement support',
      nextStep: 'Schedule consultation'
    }
  ];

  const handleAnswer = (answer: string) => {
    const newAnswers = { ...answers, [questions[currentQuestion].id]: answer };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 300);
    } else {
      setTimeout(() => {
        setStep('results');
        setShowResults(true);
      }, 500);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="h-full bg-[#FAF8F6]">
      {/* Header */}
      <div className="pt-16 px-6 pb-6">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => {
              if (step === 'questions' && currentQuestion > 0) {
                setCurrentQuestion(currentQuestion - 1);
              } else {
                onNavigate('dashboard');
              }
            }}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#6F6F7A] shadow-md"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl text-[#3A3A44]">MyLayak Aid</h1>
            <p className="text-sm text-[#6F6F7A]">Find support that fits you</p>
          </div>
          <Heart className="w-6 h-6 text-[#D6B4B8]" />
        </div>

        {/* Progress Bar */}
        {step === 'questions' && (
          <div className="w-full h-2 bg-[#EEEAF0] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#C2A7B8] to-[#D6B4B8] transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-6 pb-8">
        {step === 'intro' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-[#C2A7B8]/20">
              <div className="w-16 h-16 bg-[#D6B4B8]/20 rounded-2xl flex items-center justify-center mb-6">
                <Heart className="w-8 h-8 text-[#C2A7B8]" />
              </div>
              <h2 className="text-xl text-[#3A3A44] mb-3">
                Let's find the right support for you
              </h2>
              <p className="text-[#6F6F7A] leading-relaxed mb-6">
                Answer a few simple questions to discover programs and resources that might be helpful.
                All responses are private and confidential.
              </p>
              <button
                onClick={() => setStep('questions')}
                className="w-full py-4 bg-gradient-to-r from-[#C2A7B8] to-[#D6B4B8] text-white rounded-2xl shadow-lg hover:shadow-xl transition-all"
              >
                Get Started
              </button>
            </div>

            <div className="bg-[#9FB7A4]/10 rounded-2xl p-4 flex gap-3">
              <CheckCircle className="w-5 h-5 text-[#9FB7A4] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-[#3A3A44] mb-1">Your privacy matters</p>
                <p className="text-xs text-[#6F6F7A]">
                  Your answers help us match you with relevant programs. You can skip any question.
                </p>
              </div>
            </div>
          </div>
        )}

        {step === 'questions' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-[#C2A7B8]/20">
              <p className="text-xs text-[#A1A1AF] mb-4">
                Question {currentQuestion + 1} of {questions.length}
              </p>
              <h3 className="text-lg text-[#3A3A44] mb-6">
                {questions[currentQuestion].text}
              </h3>

              <div className="space-y-3">
                {questions[currentQuestion].options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(option)}
                    className="w-full px-4 py-4 bg-[#EEEAF0] text-[#3A3A44] rounded-2xl hover:bg-[#D6B4B8]/20 transition-all text-left border border-transparent hover:border-[#C2A7B8]/30"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 'results' && showResults && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-[#C2A7B8]/20">
              <div className="w-16 h-16 bg-[#9FB7A4]/20 rounded-2xl flex items-center justify-center mb-6">
                <CheckCircle className="w-8 h-8 text-[#9FB7A4]" />
              </div>
              <h2 className="text-xl text-[#3A3A44] mb-3">
                We found {programs.length} programs for you
              </h2>
              <p className="text-[#6F6F7A] leading-relaxed">
                Based on your responses, these resources might be helpful. Take your time reviewing them.
              </p>
            </div>

            {/* Program Cards */}
            <div className="space-y-4">
              {programs.map((program, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-3xl p-6 shadow-lg border border-[#C2A7B8]/20"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg text-[#3A3A44]">{program.name}</h3>
                    <div
                      className={`px-3 py-1 rounded-full text-xs ${
                        program.match === 'High'
                          ? 'bg-[#9FB7A4]/20 text-[#9FB7A4]'
                          : 'bg-[#D6B4B8]/20 text-[#D6B4B8]'
                      }`}
                    >
                      {program.match} Match
                    </div>
                  </div>

                  <p className="text-sm text-[#6F6F7A] mb-4">
                    {program.description}
                  </p>

                  <button className="w-full py-3 bg-[#EEEAF0] text-[#3A3A44] rounded-xl hover:bg-[#C2A7B8]/10 transition-colors flex items-center justify-between px-4">
                    <span className="text-sm">{program.nextStep}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                setStep('intro');
                setCurrentQuestion(0);
                setAnswers({});
                setShowResults(false);
              }}
              className="w-full py-4 bg-white border-2 border-[#C2A7B8]/30 text-[#3A3A44] rounded-2xl hover:bg-[#EEEAF0] transition-all"
            >
              Start Over
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
