import { ArrowLeft, Sparkles, ChevronRight, Info } from 'lucide-react';
import { useState } from 'react';

interface LifeCopilotProps {
  onNavigate: (screen: string) => void;
}

type Message = {
  sender: 'ai' | 'user';
  text: string;
  stepCards?: StepCard[];
};

type StepCard = {
  title: string;
  description: string;
  priority: 'now' | 'soon' | 'later';
};

export function LifeCopilot({ onNavigate }: LifeCopilotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: "Hi there. I'm here to help you think through your next steps, at your own pace. What's on your mind today?"
    }
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [showQuickOptions, setShowQuickOptions] = useState(true);

  const quickOptions = [
    "I need to understand my options",
    "Help me prepare documents",
    "What should I do first?",
    "I'm not sure where to start"
  ];

  const handleSendMessage = (text?: string) => {
    const messageText = text || currentInput;
    if (!messageText.trim()) return;

    // Add user message
    const newMessages: Message[] = [...messages, { sender: 'user', text: messageText }];
    setMessages(newMessages);
    setCurrentInput('');
    setShowQuickOptions(false);

    // Simulate AI response with step cards
    setTimeout(() => {
      const aiResponse: Message = {
        sender: 'ai',
        text: "Let's take this one step at a time. Here's what we can work on together:",
        stepCards: [
          {
            title: "Possible options",
            description: "Understand what paths are available to you right now",
            priority: 'now'
          },
          {
            title: "What to prepare",
            description: "Documents and information that might be helpful",
            priority: 'soon'
          },
          {
            title: "What can wait",
            description: "Things you don't need to worry about immediately",
            priority: 'later'
          }
        ]
      };
      setMessages([...newMessages, aiResponse]);
    }, 1000);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'now':
        return '#C2A7B8';
      case 'soon':
        return '#D6B4B8';
      case 'later':
        return '#EEEAF0';
      default:
        return '#A1A1AF';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'now':
        return 'text-[#3A3A44]';
      case 'soon':
        return 'text-[#3A3A44]';
      case 'later':
        return 'text-[#6F6F7A]';
      default:
        return 'text-[#A1A1AF]';
    }
  };

  return (
    <div className="h-full bg-[#FAF8F6] flex flex-col">
      {/* Header */}
      <div className="pt-16 px-6 pb-4 bg-[#FAF8F6]">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate('dashboard')}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#6F6F7A] shadow-md"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl text-[#3A3A44]">Life Guide</h1>
            <p className="text-sm text-[#6F6F7A]">Taking it one step at a time</p>
          </div>
          <Sparkles className="w-6 h-6 text-[#C2A7B8]" />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((message, idx) => (
          <div key={idx}>
            <div
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  message.sender === 'user'
                    ? 'bg-[#C2A7B8] text-white rounded-br-sm'
                    : 'bg-white text-[#3A3A44] rounded-bl-sm shadow-sm'
                }`}
              >
                <p className="text-sm leading-relaxed">{message.text}</p>
              </div>
            </div>

            {/* Step Cards */}
            {message.stepCards && (
              <div className="mt-4 space-y-3 ml-2">
                {message.stepCards.map((card, cardIdx) => (
                  <button
                    key={cardIdx}
                    className="w-full bg-white rounded-2xl p-4 shadow-sm border border-[#C2A7B8]/20 hover:scale-[1.01] transition-transform text-left"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: getPriorityColor(card.priority) }}
                      >
                        <span className="text-white text-xs">
                          {cardIdx + 1}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h4 className={`text-sm mb-1 ${getPriorityText(card.priority)}`}>
                          {card.title}
                        </h4>
                        <p className="text-xs text-[#A1A1AF]">{card.description}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#A1A1AF] flex-shrink-0 mt-1" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Quick Options */}
        {showQuickOptions && (
          <div className="space-y-2">
            <p className="text-xs text-[#A1A1AF] ml-2">Quick options:</p>
            {quickOptions.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(option)}
                className="w-full bg-[#EEEAF0] text-[#3A3A44] rounded-2xl px-4 py-3 text-sm hover:bg-[#D6B4B8]/20 transition-colors text-left"
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {/* Disclaimer */}
        {messages.length > 2 && (
          <div className="bg-[#D6B4B8]/10 rounded-2xl p-4 flex gap-3 mt-6">
            <Info className="w-4 h-4 text-[#D6B4B8] flex-shrink-0 mt-0.5" />
            <p className="text-xs text-[#6F6F7A] leading-relaxed">
              This guidance is for informational purposes. For legal advice, please consult a qualified professional.
              You're always in control of your decisions.
            </p>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="px-6 pb-6 bg-[#FAF8F6] border-t border-[#C2A7B8]/20">
        <div className="flex gap-2 pt-4">
          <input
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Share what's on your mind..."
            className="flex-1 px-4 py-3 bg-white border border-[#C2A7B8]/20 rounded-2xl text-[#3A3A44] placeholder:text-[#A1A1AF] focus:outline-none focus:border-[#C2A7B8]"
          />
          <button
            onClick={() => handleSendMessage()}
            className="px-6 py-3 bg-[#C2A7B8] text-white rounded-2xl hover:bg-[#C2A7B8]/90 transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
