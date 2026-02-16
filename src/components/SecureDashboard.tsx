import { useState, useEffect } from 'react';
import svgPaths from "../imports/svg-j71c6cibbx";
import bgImage from "figma:asset/b9295fed79b66df1cd88744654b962a3acba64b6.png";

interface SecureDashboardProps {
  onNavigate: (screen: 'camouflage' | 'dashboard' | 'vault' | 'photo' | 'walk' | 'conversation' | 'copilot' | 'mylayak' | 'profile') => void;
}

export function SecureDashboard({ onNavigate }: SecureDashboardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [guardianExpanded, setGuardianExpanded] = useState(false);
  const [guardianActive, setGuardianActive] = useState(false);

  useEffect(() => {
    // Fade-in animation on mount
    setTimeout(() => setIsVisible(true), 50);
  }, []);

  return (
    <div className="h-full relative overflow-hidden">
      {/* Soft Pastel Gradient Background */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 25% 20%, rgba(255, 220, 230, 0.6) 0%, transparent 50%),
            radial-gradient(circle at 75% 30%, rgba(230, 210, 240, 0.5) 0%, transparent 50%),
            radial-gradient(circle at 50% 70%, rgba(200, 240, 220, 0.4) 0%, transparent 50%),
            linear-gradient(135deg, #FFE8F0 0%, #F8F0FB 50%, #F0FAF5 100%)
          `,
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Status Bar Space */}
        <div className="h-12"></div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-6 pb-24">
          {/* Header */}
          <div 
            className={`mb-6 transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
          >
            <div className="flex items-start justify-between relative z-10">
              <div className="flex-1">
                <h1 className="text-[32px] leading-[40px] tracking-[-0.4px] mb-1.5 text-[rgb(31,41,55)] font-bold">
                  Hi, User
                </h1>
                <p className="text-[16px] leading-[24px] text-gray-700 font-semibold">
                  How is your heart today?
                </p>
              </div>
              
              {/* Profile avatar - Glassmorphism circle matching calendar */}
              <button 
                onClick={() => onNavigate('profile')}
                className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95"
                style={{
                  background: 'rgba(255, 255, 255, 0.90)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  boxShadow: '0 2px 8px rgba(194, 167, 184, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.6)',
                }}
                aria-label="View profile"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="3.5" stroke="#374151" strokeWidth="2" fill="none" />
                  <path d="M6.5 19.5C6.5 16.5 8.5 14 12 14C15.5 14 17.5 16.5 17.5 19.5" stroke="#374151" strokeWidth="2" fill="none" />
                </svg>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-5 relative z-10">
            {/* Primary Action - AI Guardian Presence */}
            <div
              className={`w-full rounded-[24px] p-6 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(250, 245, 250, 0.9) 100%)',
                backdropFilter: 'blur(32px)',
                WebkitBackdropFilter: 'blur(32px)',
                boxShadow: '0 8px 32px rgba(194, 167, 184, 0.18), inset 0 1px 2px rgba(255, 255, 255, 0.9)',
                border: '1.5px solid rgba(255, 255, 255, 0.6)',
              }}
            >
              {/* Main Card Content */}
              <div className="flex items-start gap-4 mb-5">
                {/* Gradient Icon - Soft green-to-rose gradient with breathing animation */}
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center shrink-0 relative"
                  style={{
                    background: 'linear-gradient(135deg, #9FB7A4 0%, #D6B4B8 70%, #E8C8CC 100%)',
                    boxShadow: 'inset 0 2px 6px rgba(255, 255, 255, 0.5), 0 6px 24px rgba(194, 167, 184, 0.35)',
                    animation: 'breathe 3s ease-in-out infinite',
                  }}
                >
                  {/* Shield with sound wave icon */}
                  <svg className="w-7 h-7 block" fill="none" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <path 
                      d="M12 2L4 5v6.5c0 5.25 3.5 10.25 8 11.5 4.5-1.25 8-6.25 8-11.5V5l-8-3z" 
                      stroke="rgba(255, 255, 255, 0.95)" 
                      strokeWidth="1.8"
                      fill="none"
                    />
                    {/* Sound wave inside shield */}
                    <path d="M10 12v0" stroke="rgba(255, 255, 255, 0.95)" strokeWidth="2" strokeLinecap="round" />
                    <path d="M12 10v4" stroke="rgba(255, 255, 255, 0.95)" strokeWidth="2" strokeLinecap="round" />
                    <path d="M14 12v0" stroke="rgba(255, 255, 255, 0.95)" strokeWidth="2" strokeLinecap="round" />
                  </svg>

                  {/* Pulsing dot indicator when active */}
                  {guardianActive && (
                    <div 
                      className="absolute -top-1 -right-1 w-4 h-4 rounded-full"
                      style={{
                        background: '#9FB7A4',
                        boxShadow: '0 0 0 0 rgba(159, 183, 164, 0.7)',
                        animation: 'pulse-dot 2s ease-out infinite',
                      }}
                    />
                  )}
                </div>
                
                <div className="flex-1">
                  <h3 className="text-[19px] leading-[26px] mb-1 text-gray-800 font-bold">
                    AI Guardian Presence
                  </h3>
                  <p className="text-[14px] leading-[21px] mb-2 text-gray-700 font-medium">
                    Someone is with you now
                  </p>

                  {/* Status Indicator */}
                  <div className="flex items-center gap-2 mt-3">
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{
                        background: guardianActive ? '#9FB7A4' : 'rgba(165, 148, 154, 0.4)',
                        animation: guardianActive ? 'soft-pulse 2s ease-in-out infinite' : 'none',
                      }}
                    />
                    <span className="text-[12px] leading-[16px] text-gray-700 font-semibold">
                      {guardianActive ? 'Active' : 'On standby'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Primary Action Button */}
              <button
                onClick={() => {
                  setGuardianActive(!guardianActive);
                  if (!guardianActive) {
                    setGuardianExpanded(true);
                  }
                }}
                className="w-full py-3.5 rounded-full transition-all duration-300 active:scale-[0.98] mb-3"
                style={{
                  background: guardianActive 
                    ? 'linear-gradient(135deg, #9FB7A4 0%, #8DA895 100%)'
                    : 'linear-gradient(135deg, #C2A7B8 0%, #D6B4B8 100%)',
                  boxShadow: '0 4px 16px rgba(194, 167, 184, 0.3)',
                }}
              >
                <span 
                  className="text-[15px] leading-[20px]"
                  style={{ 
                    color: 'white',
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 600
                  }}
                >
                  {guardianActive ? 'Guardian Active' : 'Activate Guardian'}
                </span>
              </button>

              {/* Secondary micro-text */}
              <p 
                className="text-[11px] leading-[16px] text-center mb-4"
                style={{ 
                  color: '#B5A5AA',
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 400
                }}
              >
                Tap to simulate a safe presence
              </p>

              {/* Expandable Options */}
              {guardianExpanded && (
                <div 
                  className="space-y-2 pt-4"
                  style={{
                    borderTop: '1px solid rgba(194, 167, 184, 0.15)',
                    animation: 'slideDown 0.3s ease-out',
                  }}
                >
                  {/* Option 1: Simulated Call */}
                  <button
                    onClick={() => onNavigate('walk')}
                    className="w-full p-4 rounded-[16px] transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] text-left"
                    style={{
                      background: 'rgba(226, 198, 196, 0.12)',
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div 
                        className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                        style={{
                          background: 'linear-gradient(135deg, #E2C6C4 0%, #CAAAA6 100%)',
                          boxShadow: '0 2px 8px rgba(226, 198, 196, 0.3)',
                        }}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke="white" strokeWidth="2" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h4 
                          className="text-[14px] leading-[20px] mb-0.5"
                          style={{ 
                            color: '#374151',
                            fontFamily: "'DM Sans', sans-serif",
                            fontWeight: 600
                          }}
                        >
                          Simulated Call
                        </h4>
                        <p 
                          className="text-[12px] leading-[18px]"
                          style={{ 
                            color: '#4B5563',
                            fontFamily: "'DM Sans', sans-serif",
                            fontWeight: 400
                          }}
                        >
                          AI voice plays a realistic male presence
                        </p>
                      </div>
                    </div>
                  </button>

                  {/* Option 2: Silent Protection */}
                  <button
                    className="w-full p-4 rounded-[16px] transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] text-left"
                    style={{
                      background: 'rgba(159, 183, 164, 0.12)',
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div 
                        className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                        style={{
                          background: 'linear-gradient(135deg, #9FB7A4 0%, #8DA895 100%)',
                          boxShadow: '0 2px 8px rgba(159, 183, 164, 0.3)',
                        }}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="white" strokeWidth="2" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h4 
                          className="text-[14px] leading-[20px] mb-0.5"
                          style={{ 
                            color: '#374151',
                            fontFamily: "'DM Sans', sans-serif",
                            fontWeight: 600
                          }}
                        >
                          Silent Protection
                        </h4>
                        <p 
                          className="text-[12px] leading-[18px]"
                          style={{ 
                            color: '#4B5563',
                            fontFamily: "'DM Sans', sans-serif",
                            fontWeight: 400
                          }}
                        >
                          Discreet activation without visible alerts
                        </p>
                      </div>
                    </div>
                  </button>

                  {/* Option 3: Quick Exit */}
                  <button
                    onClick={() => onNavigate('camouflage')}
                    className="w-full p-4 rounded-[16px] transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] text-left"
                    style={{
                      background: 'rgba(194, 167, 184, 0.12)',
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div 
                        className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                        style={{
                          background: 'linear-gradient(135deg, #C2A7B8 0%, #D6B4B8 100%)',
                          boxShadow: '0 2px 8px rgba(194, 167, 184, 0.3)',
                        }}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4m7 14l5-5-5-5m5 5H9" stroke="white" strokeWidth="2" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h4 
                          className="text-[14px] leading-[20px] mb-0.5"
                          style={{ 
                            color: '#374151',
                            fontFamily: "'DM Sans', sans-serif",
                            fontWeight: 600
                          }}
                        >
                          Quick Exit
                        </h4>
                        <p 
                          className="text-[12px] leading-[18px]"
                          style={{ 
                            color: '#4B5563',
                            fontFamily: "'DM Sans', sans-serif",
                            fontWeight: 400
                          }}
                        >
                          Instantly switch back to normal mode
                        </p>
                      </div>
                    </div>
                  </button>

                  {/* Toggle Expansion */}
                  <button
                    onClick={() => setGuardianExpanded(false)}
                    className="w-full py-2 flex items-center justify-center gap-2 transition-all duration-300"
                  >
                    <span 
                      className="text-[12px] leading-[16px]"
                      style={{ 
                        color: '#B5A5AA',
                        fontFamily: "'DM Sans', sans-serif",
                        fontWeight: 500
                      }}
                    >
                      Show less
                    </span>
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 7.5L6 4.5L3 7.5" stroke="#B5A5AA" strokeWidth="1.5" />
                    </svg>
                  </button>
                </div>
              )}

              {/* Show More Button when collapsed */}
              {!guardianExpanded && (
                <button
                  onClick={() => setGuardianExpanded(true)}
                  className="w-full py-2 flex items-center justify-center gap-2 transition-all duration-300"
                >
                  <span 
                    className="text-[12px] leading-[16px]"
                    style={{ 
                      color: '#B5A5AA',
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 500
                    }}
                  >
                    More options
                  </span>
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 4.5L6 7.5L9 4.5" stroke="#B5A5AA" strokeWidth="1.5" />
                  </svg>
                </button>
              )}
            </div>

            {/* Secondary Actions Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Photo Privacy - Pink Gradient Icon */}
              <button
                onClick={() => onNavigate('photo')}
                className={`rounded-[18px] p-5 transition-all duration-700 delay-200 hover:scale-[1.02] active:scale-[0.98] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{ 
                  background: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 4px 16px rgba(139, 122, 143, 0.1), inset 0 1px 1px rgba(255, 255, 255, 0.8)',
                  border: '1.5px solid rgba(255, 255, 255, 0.9)',
                }}
              >
                <div className="flex flex-col items-center text-center justify-center" style={{ aspectRatio: '1' }}>
                  <div 
                    className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
                    style={{
                      background: 'linear-gradient(135deg, #E2C6C4 0%, #CAAAA6 100%)',
                      boxShadow: 'inset 0 2px 4px rgba(255, 255, 255, 0.4), 0 4px 16px rgba(226, 198, 196, 0.3)',
                    }}
                  >
                    <svg className="w-7 h-7 block" fill="none" viewBox="0 0 30 23">
                      <path d={svgPaths.p35296a00} fill="white" />
                    </svg>
                  </div>
                  <div>
                    <h4 
                      className="text-[15px] leading-[21px] mb-1"
                      style={{ 
                        color: '#374151',
                        fontFamily: "'DM Sans', sans-serif",
                        fontWeight: 600
                      }}
                    >
                      Photo Privacy
                    </h4>
                    <p 
                      className="text-[13px] leading-[18px]"
                      style={{ 
                        color: '#4B5563',
                        fontFamily: "'DM Sans', sans-serif",
                        fontWeight: 400
                      }}
                    >
                      Secure your photos
                    </p>
                  </div>
                </div>
              </button>

              {/* Evidence Vault - Green Gradient Icon */}
              <button
                onClick={() => onNavigate('vault')}
                className={`rounded-[18px] p-5 transition-all duration-700 delay-200 hover:scale-[1.02] active:scale-[0.98] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{ 
                  background: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 4px 16px rgba(139, 122, 143, 0.1), inset 0 1px 1px rgba(255, 255, 255, 0.8)',
                }}
              >
                <div className="flex flex-col items-center text-center justify-center" style={{ aspectRatio: '1' }}>
                  <div 
                    className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
                    style={{
                      background: 'linear-gradient(135deg, #9FB7A4 0%, #8DA895 100%)',
                      boxShadow: 'inset 0 2px 4px rgba(255, 255, 255, 0.4), 0 4px 16px rgba(159, 183, 164, 0.3)',
                    }}
                  >
                    <svg className="w-6 h-6 block" fill="none" viewBox="0 0 24 30" strokeLinecap="round" strokeLinejoin="round">
                      <path d={svgPaths.pda790f0} stroke="rgba(255, 255, 255, 0.95)" strokeWidth="1.7" />
                      <path d={svgPaths.p2efff90} stroke="rgba(255, 255, 255, 0.95)" strokeWidth="1.7" />
                    </svg>
                  </div>
                  <div>
                    <h4 
                      className="text-[15px] leading-[21px] mb-1"
                      style={{ 
                        color: '#374151',
                        fontFamily: "'DM Sans', sans-serif",
                        fontWeight: 600
                      }}
                    >
                      Evidence Vault
                    </h4>
                    <p 
                      className="text-[13px] leading-[18px]"
                      style={{ 
                        color: '#4B5563',
                        fontFamily: "'DM Sans', sans-serif",
                        fontWeight: 400
                      }}
                    >
                      Encrypted storage
                    </p>
                  </div>
                </div>
              </button>
            </div>

            {/* Wellness & Support Section */}
            <div className="space-y-3 pt-4">
              <h3 
                className="text-[13px] leading-[18px] tracking-[0.5px] uppercase px-1"
                style={{ 
                  color: '#6B7280',
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 600
                }}
              >
                Wellness & Support
              </h3>
              
              {/* Safe Conversations */}
              <button
                onClick={() => onNavigate('conversation')}
                className={`w-full rounded-[18px] p-5 transition-all duration-700 delay-300 hover:scale-[1.01] active:scale-[0.99] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{
                  background: 'rgba(255, 255, 255, 0.7)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 4px 16px rgba(139, 122, 143, 0.1), inset 0 1px 1px rgba(255, 255, 255, 0.8)',
                }}
              >
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      background: 'linear-gradient(135deg, #E2C6C4 0%, #CAAAA6 100%)',
                      boxShadow: 'inset 0 2px 4px rgba(255, 255, 255, 0.4), 0 4px 16px rgba(226, 198, 196, 0.25)',
                    }}
                  >
                    <svg className="w-5 h-5 block" fill="none" viewBox="0 0 20 20" strokeLinecap="round" strokeLinejoin="round">
                      <path d={svgPaths.p3dfb7600} stroke="rgba(255, 255, 255, 0.95)" strokeWidth="1.41667" />
                      <path d={svgPaths.pec9c4c0} stroke="rgba(255, 255, 255, 0.95)" strokeWidth="1.41667" />
                      <path d={svgPaths.p10c17e40} stroke="rgba(255, 255, 255, 0.95)" strokeWidth="1.41667" />
                      <path d={svgPaths.p24333a80} stroke="rgba(255, 255, 255, 0.95)" strokeWidth="1.41667" />
                    </svg>
                  </div>
                  <div className="flex-1 text-left">
                    <h4 
                      className="text-[16px] leading-[22px] mb-0.5"
                      style={{ 
                        color: '#374151',
                        fontFamily: "'DM Sans', sans-serif",
                        fontWeight: 600
                      }}
                    >
                      Safe Conversations
                    </h4>
                    <p 
                      className="text-[13px] leading-[19px]"
                      style={{ 
                        color: '#4B5563',
                        fontFamily: "'DM Sans', sans-serif",
                        fontWeight: 400
                      }}
                    >
                      Practice setting boundaries
                    </p>
                  </div>
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 16 16" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 12L10 8L6 4" stroke="#4B5563" strokeWidth="1.6" />
                  </svg>
                </div>
              </button>

              {/* MyLayak Aid */}
              <button
                onClick={() => onNavigate('mylayak')}
                className={`w-full rounded-[18px] p-5 transition-all duration-700 delay-400 hover:scale-[1.01] active:scale-[0.99] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{
                  background: 'rgba(255, 255, 255, 0.7)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 4px 16px rgba(139, 122, 143, 0.1), inset 0 1px 1px rgba(255, 255, 255, 0.8)',
                }}
              >
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      background: 'linear-gradient(135deg, #9FB7A4 0%, #8DA895 100%)',
                      boxShadow: 'inset 0 2px 4px rgba(255, 255, 255, 0.4), 0 4px 16px rgba(159, 183, 164, 0.25)',
                    }}
                  >
                    <svg className="w-5.5 h-5.5 block" fill="none" viewBox="0 0 22 22" strokeLinecap="round" strokeLinejoin="round">
                      <path d={svgPaths.p23a0100} stroke="rgba(255, 255, 255, 0.95)" strokeWidth="1.41667" />
                      <path d={svgPaths.pa632700} stroke="rgba(255, 255, 255, 0.95)" strokeWidth="1.41667" />
                      <path d="M2.30554 17.0417H15.1389" stroke="rgba(255, 255, 255, 0.95)" strokeWidth="1.41667" />
                    </svg>
                  </div>
                  <div className="flex-1 text-left">
                    <h4 
                      className="text-[16px] leading-[22px] mb-0.5"
                      style={{ 
                        color: '#374151',
                        fontFamily: "'DM Sans', sans-serif",
                        fontWeight: 600
                      }}
                    >
                      MyLayak Aid
                    </h4>
                    <p 
                      className="text-[13px] leading-[19px]"
                      style={{ 
                        color: '#4B5563',
                        fontFamily: "'DM Sans', sans-serif",
                        fontWeight: 400
                      }}
                    >
                      Financial assistance programs
                    </p>
                  </div>
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 16 16" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 12L10 8L6 4" stroke="#4B5563" strokeWidth="1.6" />
                  </svg>
                </div>
              </button>
            </div>

            {/* Daily Wellness Tip */}
            <div 
              className={`rounded-[18px] p-5 mt-4 transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ 
                background: 'rgba(255, 250, 250, 0.7)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 4px 16px rgba(226, 198, 196, 0.12), inset 0 1px 1px rgba(255, 255, 255, 0.7)',
              }}
            >
              <div className="flex items-start gap-4">
                <div 
                  className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, #E2C6C4 0%, #CAAAA6 100%)',
                    boxShadow: 'inset 0 2px 4px rgba(255, 255, 255, 0.4), 0 4px 12px rgba(226, 198, 196, 0.2)',
                  }}
                >
                  <svg className="w-5 h-5 block" fill="none" viewBox="0 0 20 20" strokeLinecap="round" strokeLinejoin="round">
                    <path d={svgPaths.p2de00380} stroke="rgba(255, 255, 255, 0.95)" strokeWidth="1.6" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 
                    className="text-[15px] leading-[21px] mb-1.5"
                    style={{ 
                      color: '#374151',
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 600
                    }}
                  >
                    Daily Wellness Tip
                  </h4>
                  <p 
                    className="text-[13px] leading-[21px]"
                    style={{ 
                      color: '#4B5563',
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 400
                    }}
                  >
                    Take a few deep breaths today. Remember, you're doing great and you deserve care.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CSS Animations */}
          <style>{`
            @keyframes breathe {
              0%, 100% {
                transform: scale(1);
                box-shadow: inset 0 2px 6px rgba(255, 255, 255, 0.5), 0 6px 24px rgba(194, 167, 184, 0.35);
              }
              50% {
                transform: scale(1.05);
                box-shadow: inset 0 2px 6px rgba(255, 255, 255, 0.6), 0 8px 32px rgba(194, 167, 184, 0.45);
              }
            }

            @keyframes pulse-dot {
              0% {
                box-shadow: 0 0 0 0 rgba(159, 183, 164, 0.7);
              }
              50% {
                box-shadow: 0 0 0 8px rgba(159, 183, 164, 0);
              }
              100% {
                box-shadow: 0 0 0 0 rgba(159, 183, 164, 0);
              }
            }

            @keyframes soft-pulse {
              0%, 100% {
                opacity: 1;
                transform: scale(1);
              }
              50% {
                opacity: 0.6;
                transform: scale(0.9);
              }
            }

            @keyframes slideDown {
              from {
                opacity: 0;
                transform: translateY(-10px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}</style>
        </div>
      </div>
    </div>
  );
}