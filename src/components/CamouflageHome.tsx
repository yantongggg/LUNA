import { useState } from 'react';
import { User, Menu, Calendar as CalendarIcon, Plus, BarChart3, BookOpen, ArrowLeft, Trash2, Flower } from 'lucide-react';

interface CamouflageHomeProps {
  onUnlock: () => void;
}

export function CamouflageHome({ onUnlock }: CamouflageHomeProps) {
  const [showPinPad, setShowPinPad] = useState(false);
  const [pin, setPin] = useState('');
  const [currentView, setCurrentView] = useState<'home' | 'calendar'>('home');

  const handlePinPress = (num: string) => {
    const newPin = pin + num;
    setPin(newPin);
    
    // Correct PIN is 2468
    if (newPin === '2468') {
      setTimeout(() => {
        onUnlock();
      }, 300);
    } else if (newPin.length >= 4) {
      setTimeout(() => {
        setPin('');
      }, 300);
    }
  };

  const handleClear = () => {
    setPin('');
  };

  // Triple tap on V button to unlock PIN pad
  const [tapCount, setTapCount] = useState(0);
  const handleVTap = () => {
    const newCount = tapCount + 1;
    setTapCount(newCount);
    if (newCount === 3) {
      setShowPinPad(true);
      setTapCount(0);
    }
    setTimeout(() => setTapCount(0), 1000);
  };

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
      {currentView === 'home' ? (
        <div className="relative z-10 h-full flex flex-col">
          {/* Status Bar Space */}
          <div className="h-12"></div>

          {/* Header */}
          <div className="px-6 pb-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[15px] leading-[20px] mb-0.5 text-gray-700 font-semibold">
                  Hi, Good Morning
                </p>
                <h1 className="text-[28px] leading-[36px] tracking-tight text-gray-900 font-bold">
                  Victoria 👋
                </h1>
              </div>
              
              <div className="flex items-center gap-3">
                {/* V Button - Triple tap to unlock */}
                <button 
                  onClick={handleVTap}
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-95"
                  style={{
                    background: 'rgba(255, 255, 255, 0.90)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 2px 8px rgba(194, 167, 184, 0.2)',
                    border: '1px solid rgba(255, 255, 255, 0.5)',
                  }}
                >
                  <User className="w-5 h-5 text-gray-800" strokeWidth={2.5} />
                </button>
                
                <button 
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-95"
                  style={{
                    background: 'rgba(255, 255, 255, 0.6)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 2px 8px rgba(194, 167, 184, 0.15)',
                    border: '1px solid rgba(255, 255, 255, 0.5)',
                  }}
                >
                  <Menu className="w-5 h-5 text-gray-800" strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-6 pb-24">
            {/* Main Period Card */}
            <div 
              className="rounded-[28px] p-6 mb-4"
              style={{
                background: 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(40px)',
                boxShadow: '0 8px 24px rgba(194, 167, 184, 0.15), inset 0 1px 2px rgba(255, 255, 255, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.6)',
              }}
            >
              {/* Header with Flower Icon and Pill */}
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255, 200, 210, 0.6), rgba(255, 220, 230, 0.5))',
                    }}
                  >
                    <Flower className="w-5 h-5 text-gray-600" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h2 className="text-[22px] leading-[28px] tracking-tight text-gray-900 font-bold">
                      Period Day 5
                    </h2>
                    <p className="text-[14px] leading-[20px] text-gray-600 font-medium">
                      15 Dec
                    </p>
                  </div>
                </div>

                {/* Pill Badge */}
                <div 
                  className="px-4 py-2 rounded-full"
                  style={{
                    background: 'linear-gradient(135deg, #374151, #1F2937)',
                    color: 'white',
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 600,
                    fontSize: '14px',
                  }}
                >
                  5day
                </div>
              </div>

              {/* Cycle Length Chart */}
              <div className="mb-5">
                <div className="flex items-end justify-between h-32 gap-2">
                  {[
                    { month: 'Jul', days: 3, label: '3day' },
                    { month: 'Aug', days: 2, label: '2day' },
                    { month: 'Sep', days: 3, label: '3day' },
                    { month: 'Oct', days: 4, label: '4day' },
                    { month: 'Nov', days: 3, label: '3day' },
                    { month: 'Dec', days: 5, label: '5day', active: true },
                  ].map((item, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                      {/* Bar with pattern */}
                      <div className="relative w-full flex flex-col items-center">
                        {/* Label above bar */}
                        {item.label && (
                          <div 
                            className="mb-1.5 text-[11px] px-2 py-0.5 rounded-full whitespace-nowrap"
                            style={{
                              background: item.active 
                                ? 'linear-gradient(135deg, rgba(200, 160, 200, 0.3), rgba(220, 180, 220, 0.2))'
                                : 'rgba(0, 0, 0, 0.05)',
                              color: '#9B8E93',
                              fontFamily: "'DM Sans', sans-serif",
                              fontWeight: 500,
                            }}
                          >
                            {item.label}
                          </div>
                        )}
                        
                        {/* Bar */}
                        <div 
                          className="w-full rounded-full relative overflow-hidden"
                          style={{
                            height: `${item.days * 18}px`,
                            background: item.active 
                              ? 'linear-gradient(180deg, rgba(200, 160, 220, 0.8), rgba(180, 140, 200, 0.7))'
                              : 'rgba(0, 0, 0, 0.05)',
                          }}
                        >
                          {/* Diagonal stripe pattern */}
                          <div 
                            className="absolute inset-0 opacity-20"
                            style={{
                              backgroundImage: `repeating-linear-gradient(
                                45deg,
                                transparent,
                                transparent 4px,
                                rgba(255, 255, 255, 0.5) 4px,
                                rgba(255, 255, 255, 0.5) 8px
                              )`,
                            }}
                          />
                        </div>
                      </div>
                      
                      {/* Month label */}
                      <span className="text-[12px] text-gray-600 font-medium">
                        {item.month}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Edit Period Button */}
              <button 
                className="w-full py-3.5 rounded-full text-[15px] transition-all active:scale-98 flex items-center justify-center gap-2"
                style={{
                  background: 'rgba(255, 255, 255, 0.8)',
                  border: '1.5px solid rgba(194, 167, 184, 0.3)',
                  color: '#8B7A7F',
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 600,
                  boxShadow: '0 2px 8px rgba(194, 167, 184, 0.1)',
                }}
              >
                <span>Edit Period</span>
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(194, 167, 184, 0.15)' }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M11 2L13.5 4.5L5.5 12.5H3V10L11 2Z" stroke="#8B7A7F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </button>
            </div>

            {/* Quick Action Cards */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {/* Cycle Card */}
              <div 
                className="rounded-[24px] p-5 relative overflow-hidden cursor-pointer transition-all active:scale-98"
                style={{
                  background: 'linear-gradient(135deg, rgba(170, 184, 171, 0.6), rgba(180, 200, 190, 0.5))',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 4px 20px rgba(159, 183, 164, 0.2), inset 0 1px 2px rgba(255, 255, 255, 0.5)',
                  border: '1px solid rgba(255, 255, 255, 0.5)',
                }}
              >
                {/* Decorative leaf pattern */}
                <div 
                  className="absolute bottom-0 right-0 w-24 h-24 opacity-20"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 10 Q30 30 50 50 Q30 50 10 70 Q30 50 50 50 Q50 30 70 10 Q50 30 50 50 Q70 50 90 70 Q70 50 50 50Z' fill='white' opacity='0.3'/%3E%3C/svg%3E")`,
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                  }}
                />
                
                <div className="relative z-10">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
                    style={{
                      background: 'rgba(255, 255, 255, 0.5)',
                    }}
                  >
                    <Flower className="w-5 h-5" style={{ color: '#7B9B85' }} strokeWidth={2} />
                  </div>
                  <h3 
                    className="text-[18px] leading-[24px] mb-1"
                    style={{
                      color: '#6B8B75',
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 700,
                    }}
                  >
                    Cycle
                  </h3>
                  <p 
                    className="text-[14px] leading-[20px]"
                    style={{
                      color: '#8BA795',
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 400,
                    }}
                  >
                    20 Dec
                  </p>
                </div>
              </div>

              {/* Save Day Card */}
              <div 
                className="rounded-[24px] p-5 relative overflow-hidden cursor-pointer transition-all active:scale-98"
                style={{
                  background: 'linear-gradient(135deg, rgba(220, 180, 220, 0.6), rgba(230, 200, 230, 0.5))',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 4px 20px rgba(210, 198, 218, 0.2), inset 0 1px 2px rgba(255, 255, 255, 0.5)',
                  border: '1px solid rgba(255, 255, 255, 0.5)',
                }}
              >
                {/* Decorative leaf pattern */}
                <div 
                  className="absolute bottom-0 right-0 w-24 h-24 opacity-15"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 10 Q30 30 50 50 Q30 50 10 70 Q30 50 50 50 Q50 30 70 10 Q50 30 50 50 Q70 50 90 70 Q70 50 50 50Z' fill='white' opacity='0.3'/%3E%3C/svg%3E")`,
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                  }}
                />
                
                <div className="relative z-10">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
                    style={{
                      background: 'rgba(255, 255, 255, 0.5)',
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M6 10L8.5 12.5L14 7" stroke="#9B8BA5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3 
                    className="text-[18px] leading-[24px] mb-1"
                    style={{
                      color: '#8B7A95',
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 700,
                    }}
                  >
                    Safe day
                  </h3>
                  <p 
                    className="text-[14px] leading-[20px]"
                    style={{
                      color: '#A99BB3',
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 400,
                    }}
                  >
                    22 Dec
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Navigation */}
          <div 
            className="absolute bottom-0 left-0 right-0 px-6 pt-3 pb-6 safe-area-bottom"
            style={{
              background: 'rgba(255, 245, 250, 0.95)',
              backdropFilter: 'blur(20px)',
              borderTop: '1px solid rgba(194, 167, 184, 0.15)',
            }}
          >
            <div className="flex items-center justify-around relative">
              {/* Cycle */}
              <button className="flex flex-col items-center gap-1.5 transition-all active:scale-95">
                <Flower className="w-6 h-6" style={{ color: '#C2A7B8' }} strokeWidth={2} />
                <span 
                  className="text-[11px]"
                  style={{
                    color: '#C2A7B8',
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 600,
                  }}
                >
                  Cycle
                </span>
              </button>

              {/* Calendar */}
              <button 
                onClick={() => setCurrentView('calendar')}
                className="flex flex-col items-center gap-1.5 transition-all active:scale-95"
              >
                <CalendarIcon className="w-6 h-6" style={{ color: '#B5A5AA' }} strokeWidth={2} />
                <span 
                  className="text-[11px]"
                  style={{
                    color: '#B5A5AA',
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 500,
                  }}
                >
                  Calendar
                </span>
              </button>

              {/* Plus Button */}
              <button 
                className="w-14 h-14 rounded-full flex items-center justify-center transition-all active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, rgba(200, 180, 220, 0.8), rgba(180, 160, 200, 0.7))',
                  boxShadow: '0 4px 16px rgba(194, 167, 184, 0.3)',
                  marginTop: '-32px',
                }}
              >
                <Plus className="w-7 h-7 text-white" strokeWidth={2.5} />
              </button>

              {/* Reports */}
              <button className="flex flex-col items-center gap-1.5 transition-all active:scale-95">
                <BarChart3 className="w-6 h-6" style={{ color: '#B5A5AA' }} strokeWidth={2} />
                <span 
                  className="text-[11px]"
                  style={{
                    color: '#B5A5AA',
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 500,
                  }}
                >
                  Reports
                </span>
              </button>

              {/* Read */}
              <button className="flex flex-col items-center gap-1.5 transition-all active:scale-95">
                <BookOpen className="w-6 h-6" style={{ color: '#B5A5AA' }} strokeWidth={2} />
                <span 
                  className="text-[11px]"
                  style={{
                    color: '#B5A5AA',
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 500,
                  }}
                >
                  Read
                </span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Calendar View */
        <div className="relative z-10 h-full flex flex-col">
          {/* Status Bar Space */}
          <div className="h-12"></div>

          {/* Calendar Header */}
          <div className="px-6 pb-5">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setCurrentView('home')}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-95"
                style={{
                  background: 'rgba(255, 255, 255, 0.6)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 2px 8px rgba(194, 167, 184, 0.15)',
                  border: '1px solid rgba(255, 255, 255, 0.5)',
                }}
              >
                <ArrowLeft className="w-5 h-5" style={{ color: '#8B7A7F' }} strokeWidth={2} />
              </button>

              <h1 
                className="text-[22px] leading-[28px] tracking-tight"
                style={{
                  color: '#8B7A7F',
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 700,
                }}
              >
                Calendar
              </h1>

              <button 
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-95"
                style={{
                  background: 'rgba(255, 255, 255, 0.6)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 2px 8px rgba(194, 167, 184, 0.15)',
                  border: '1px solid rgba(255, 255, 255, 0.5)',
                }}
              >
                <Trash2 className="w-5 h-5" style={{ color: '#8B7A7F' }} strokeWidth={2} />
              </button>
            </div>
          </div>

          {/* Scrollable Calendars */}
          <div className="flex-1 overflow-y-auto px-6 pb-24">
            {/* November Calendar */}
            <div 
              className="rounded-[28px] p-6 mb-4"
              style={{
                background: 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(40px)',
                boxShadow: '0 8px 24px rgba(194, 167, 184, 0.15), inset 0 1px 2px rgba(255, 255, 255, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.6)',
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 
                  className="text-[20px] leading-[26px]"
                  style={{
                    color: '#8B7A7F',
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 600,
                  }}
                >
                  November
                </h2>
                <span 
                  className="text-[16px]"
                  style={{
                    color: '#B5A5AA',
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 500,
                  }}
                >
                  2024
                </span>
              </div>

              {/* Weekday Headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day, idx) => (
                  <div 
                    key={idx}
                    className="text-center text-[10px] py-2"
                    style={{
                      color: '#B5A5AA',
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 600,
                    }}
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* November Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 mb-4">
                {[null, null, null, null, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, null].map((day, i) => {
                  const isHighlighted = day === 15;
                  
                  return (
                    <div
                      key={i}
                      className="aspect-square flex items-center justify-center rounded-full text-[14px] transition-all"
                      style={{
                        background: isHighlighted 
                          ? 'linear-gradient(135deg, rgba(200, 180, 220, 0.8), rgba(180, 160, 200, 0.7))'
                          : 'transparent',
                        color: day ? (isHighlighted ? 'white' : '#8B7A7F') : 'transparent',
                        fontFamily: "'DM Sans', sans-serif",
                        fontWeight: isHighlighted ? 600 : 400,
                        boxShadow: isHighlighted ? '0 2px 8px rgba(194, 167, 184, 0.3)' : 'none',
                      }}
                    >
                      {day || ''}
                    </div>
                  );
                })}
              </div>

              {/* Edit Dates Button */}
              <button 
                className="w-full py-3 rounded-full text-[14px] transition-all active:scale-98 flex items-center justify-center gap-2"
                style={{
                  background: 'rgba(255, 255, 255, 0.8)',
                  border: '1.5px solid rgba(194, 167, 184, 0.3)',
                  color: '#8B7A7F',
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 600,
                  boxShadow: '0 2px 8px rgba(194, 167, 184, 0.1)',
                }}
              >
                <span>Edit Dates</span>
                <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'rgba(194, 167, 184, 0.15)' }}>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M11 2L13.5 4.5L5.5 12.5H3V10L11 2Z" stroke="#8B7A7F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </button>
            </div>

            {/* December Calendar */}
            <div 
              className="rounded-[28px] p-6 mb-4"
              style={{
                background: 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(40px)',
                boxShadow: '0 8px 24px rgba(194, 167, 184, 0.15), inset 0 1px 2px rgba(255, 255, 255, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.6)',
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 
                  className="text-[20px] leading-[26px]"
                  style={{
                    color: '#8B7A7F',
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 600,
                  }}
                >
                  December
                </h2>
                <span 
                  className="text-[16px]"
                  style={{
                    color: '#B5A5AA',
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 500,
                  }}
                >
                  2024
                </span>
              </div>

              {/* Weekday Headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day, idx) => (
                  <div 
                    key={idx}
                    className="text-center text-[10px] py-2"
                    style={{
                      color: '#B5A5AA',
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 600,
                    }}
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* December Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {[null, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, null, null, null].map((day, i) => {
                  const isDotted = day && (day === 1 || day === 2 || day === 3);
                  
                  return (
                    <div
                      key={i}
                      className="aspect-square flex items-center justify-center rounded-full text-[14px] transition-all"
                      style={{
                        border: isDotted ? '1.5px dashed rgba(194, 167, 184, 0.5)' : 'none',
                        color: day ? '#8B7A7F' : 'transparent',
                        fontFamily: "'DM Sans', sans-serif",
                        fontWeight: 400,
                      }}
                    >
                      {day || ''}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom Navigation - Same as home */}
          <div 
            className="absolute bottom-0 left-0 right-0 px-6 pt-3 pb-6"
            style={{
              background: 'rgba(255, 245, 250, 0.95)',
              backdropFilter: 'blur(20px)',
              borderTop: '1px solid rgba(194, 167, 184, 0.15)',
            }}
          >
            <div className="flex items-center justify-around relative">
              <button 
                onClick={() => setCurrentView('home')}
                className="flex flex-col items-center gap-1.5 transition-all active:scale-95"
              >
                <Flower className="w-6 h-6" style={{ color: '#B5A5AA' }} strokeWidth={2} />
                <span 
                  className="text-[11px]"
                  style={{
                    color: '#B5A5AA',
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 500,
                  }}
                >
                  Cycle
                </span>
              </button>

              <button className="flex flex-col items-center gap-1.5 transition-all active:scale-95">
                <CalendarIcon className="w-6 h-6" style={{ color: '#C2A7B8' }} strokeWidth={2} />
                <span 
                  className="text-[11px]"
                  style={{
                    color: '#C2A7B8',
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 600,
                  }}
                >
                  Calendar
                </span>
              </button>

              <button 
                className="w-14 h-14 rounded-full flex items-center justify-center transition-all active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, rgba(200, 180, 220, 0.8), rgba(180, 160, 200, 0.7))',
                  boxShadow: '0 4px 16px rgba(194, 167, 184, 0.3)',
                  marginTop: '-32px',
                }}
              >
                <Plus className="w-7 h-7 text-white" strokeWidth={2.5} />
              </button>

              <button className="flex flex-col items-center gap-1.5 transition-all active:scale-95">
                <BarChart3 className="w-6 h-6" style={{ color: '#B5A5AA' }} strokeWidth={2} />
                <span 
                  className="text-[11px]"
                  style={{
                    color: '#B5A5AA',
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 500,
                  }}
                >
                  Reports
                </span>
              </button>

              <button className="flex flex-col items-center gap-1.5 transition-all active:scale-95">
                <BookOpen className="w-6 h-6" style={{ color: '#B5A5AA' }} strokeWidth={2} />
                <span 
                  className="text-[11px]"
                  style={{
                    color: '#B5A5AA',
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 500,
                  }}
                >
                  Read
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PIN Pad Overlay */}
      {showPinPad && (
        <div 
          className="absolute inset-0 flex items-center justify-center z-50"
          style={{
            background: `
              radial-gradient(circle at 30% 40%, rgba(226, 198, 196, 0.3) 0%, transparent 60%),
              radial-gradient(circle at 70% 60%, rgba(210, 198, 218, 0.25) 0%, transparent 60%),
              linear-gradient(135deg, #FAF8F6 0%, #F5F0F3 100%)
            `,
            backdropFilter: 'blur(20px)',
          }}
        >
          <div className="w-full max-w-sm px-8">
            <div className="text-center mb-12">
              <h2 
                className="text-[28px] leading-[36px] mb-2"
                style={{
                  color: '#8B7A7F',
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 600,
                }}
              >
                Enter PIN
              </h2>
            </div>
            
            <div className="flex justify-center gap-5 mb-14">
              {[0, 1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${
                    idx < pin.length ? 'scale-100' : 'scale-90'
                  }`}
                  style={{
                    background: idx < pin.length 
                      ? 'linear-gradient(135deg, #D6B4B8, #C2A7B8)'
                      : 'transparent',
                    border: idx < pin.length ? 'none' : '2px solid rgba(194, 167, 184, 0.4)',
                    boxShadow: idx < pin.length ? '0 2px 8px rgba(214, 180, 184, 0.4)' : 'none',
                  }}
                />
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                <button
                  key={num}
                  onClick={() => handlePinPress(num)}
                  className="h-[70px] rounded-[24px] text-[28px] transition-all active:scale-95"
                  style={{
                    background: 'rgba(255, 255, 255, 0.6)',
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 4px 20px rgba(194, 167, 184, 0.1), inset 0 1px 2px rgba(255, 255, 255, 0.7)',
                    border: '1px solid rgba(255, 255, 255, 0.4)',
                    color: '#8B7A7F',
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 400,
                  }}
                >
                  {num}
                </button>
              ))}
              <div></div>
              <button
                onClick={() => handlePinPress('0')}
                className="h-[70px] rounded-[24px] text-[28px] transition-all active:scale-95"
                style={{
                  background: 'rgba(255, 255, 255, 0.6)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 4px 20px rgba(194, 167, 184, 0.1), inset 0 1px 2px rgba(255, 255, 255, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.4)',
                  color: '#8B7A7F',
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 400,
                }}
              >
                0
              </button>
              <button
                onClick={handleClear}
                className="h-[70px] rounded-[24px] text-[15px] transition-all active:scale-95"
                style={{
                  background: 'rgba(255, 255, 255, 0.5)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 4px 20px rgba(194, 167, 184, 0.08), inset 0 1px 2px rgba(255, 255, 255, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: '#B5A5AA',
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 500,
                }}
              >
                Clear
              </button>
            </div>

            <div className="text-center space-y-3">
              <button
                onClick={() => setShowPinPad(false)}
                className="w-full py-3.5 text-[16px] transition-opacity active:opacity-60"
                style={{
                  color: '#B5A5AA',
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 500,
                }}
              >
                Cancel
              </button>

              <p 
                className="text-[12px] leading-[18px]"
                style={{
                  color: '#C5B5BA',
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 400,
                }}
              >
                Hint: Try 2468
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}