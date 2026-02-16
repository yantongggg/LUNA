import { ArrowLeft, MapPin, Shuffle, Activity } from 'lucide-react';
import { useState } from 'react';

interface WalkWithMeProps {
  onNavigate: (screen: string) => void;
}

export function WalkWithMe({ onNavigate }: WalkWithMeProps) {
  const [shareLocation, setShareLocation] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  return (
    <div className="h-full min-h-screen relative overflow-hidden">
      {/* Soft Pastel Gradient Background */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          background: `
            radial-gradient(circle at 25% 20%, rgba(255, 220, 230, 0.6) 0%, transparent 50%),
            radial-gradient(circle at 75% 30%, rgba(230, 210, 240, 0.5) 0%, transparent 50%),
            radial-gradient(circle at 50% 70%, rgba(200, 240, 220, 0.4) 0%, transparent 50%),
            linear-gradient(135deg, #FFE8F0 0%, #F8F0FB 50%, #F0FAF5 100%)
          `,
        }}
      />
      
      {/* Header */}
      <div className="pt-16 px-6 pb-6 relative z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate('dashboard')}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95"
            style={{
              background: 'rgba(194, 167, 184, 0.35)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              boxShadow: '0 4px 12px rgba(194, 167, 184, 0.25), inset 0 1px 2px rgba(255, 255, 255, 0.3)',
              border: '1.5px solid rgba(194, 167, 184, 0.4)',
            }}
          >
            <ArrowLeft className="w-5 h-5" style={{ color: '#8B7A7F' }} />
          </button>
          <div className="flex-1">
            <h1 className="text-[28px] leading-[36px] tracking-[-0.4px] text-gray-900 font-bold">
              Walk With Me
            </h1>
            <p className="text-[15px] leading-[22px] mt-1 text-gray-700 font-semibold">
              Your safety companion
            </p>
          </div>
        </div>
      </div>

      {/* Content Container */}
      <div className="px-6 space-y-6 relative z-10">
        
        {/* Section 1: Walk With Me */}
        <div 
          className="rounded-[24px] p-8"
          style={{
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(24px)',
            boxShadow: '0 2px 20px rgba(139, 122, 143, 0.08)',
          }}
        >
          <h2 
            className="text-[22px] leading-[32px] mb-8"
            style={{ 
              color: '#8B7A7F',
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600
            }}
          >
            Walk With Me
          </h2>

          {/* Map Icon */}
          <div className="flex justify-center mb-10">
            <div 
              className="w-24 h-24 rounded-full flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #9FB7A4 0%, #8DA895 100%)',
                boxShadow: '0 8px 24px rgba(159, 183, 164, 0.3)',
              }}
            >
              <MapPin className="w-12 h-12 text-white" strokeWidth={2} />
            </div>
          </div>

          {/* Share Location Toggle */}
          <div className="flex items-center justify-between">
            <span 
              className="text-[17px] leading-[24px]"
              style={{ 
                color: '#8B7A7F',
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 500
              }}
            >
              Share Location
            </span>
            <button
              onClick={() => setShareLocation(!shareLocation)}
              className="relative w-[56px] h-[34px] rounded-full transition-all duration-300"
              style={{
                background: shareLocation 
                  ? 'linear-gradient(135deg, #9FB7A4 0%, #8DA895 100%)'
                  : 'rgba(165, 148, 154, 0.25)',
              }}
            >
              <div 
                className="absolute top-[3px] w-[28px] h-[28px] rounded-full transition-all duration-300"
                style={{
                  left: shareLocation ? '25px' : '3px',
                  background: 'white',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.15)',
                }}
              />
            </button>
          </div>
        </div>

        {/* Section 2: Home Presence */}
        <div 
          className="rounded-[24px] p-8"
          style={{
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(24px)',
            boxShadow: '0 2px 20px rgba(139, 122, 143, 0.08)',
          }}
        >
          <h2 
            className="text-[22px] leading-[32px] mb-8"
            style={{ 
              color: '#8B7A7F',
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600
            }}
          >
            Home Presence
          </h2>

          {/* Central Start Button */}
          <div className="flex justify-center mb-8">
            <button
              onClick={() => setIsSimulating(!isSimulating)}
              className="w-40 h-40 rounded-full flex items-center justify-center transition-all duration-300 active:scale-95"
              style={{
                background: isSimulating 
                  ? 'linear-gradient(135deg, #E2C6C4 0%, #CAAAA6 100%)'
                  : 'linear-gradient(135deg, #C2A7B8 0%, #D6B4B8 100%)',
                boxShadow: '0 8px 32px rgba(194, 167, 184, 0.35)',
              }}
            >
              <span 
                className="text-[24px] leading-[32px]"
                style={{ 
                  color: 'white',
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 600
                }}
              >
                {isSimulating ? 'Stop' : 'Start'}
              </span>
            </button>
          </div>

          {/* Sound Wave and Shuffle Row */}
          <div className="flex items-center justify-center gap-6">
            {/* Sound Wave Visualization */}
            <div className="flex items-center gap-1">
              {isSimulating ? (
                <>
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 rounded-full"
                      style={{
                        height: `${Math.random() * 32 + 16}px`,
                        background: 'linear-gradient(180deg, #C2A7B8 0%, #D6B4B8 100%)',
                        animation: `wave ${Math.random() * 0.5 + 0.6}s ease-in-out infinite alternate`,
                      }}
                    />
                  ))}
                </>
              ) : (
                <Activity className="w-8 h-8" style={{ color: '#C2A7B8' }} strokeWidth={2} />
              )}
            </div>

            {/* Shuffle/Dice Icon */}
            <button 
              className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95"
              style={{
                background: 'rgba(194, 167, 184, 0.15)',
              }}
            >
              <Shuffle className="w-6 h-6" style={{ color: '#C2A7B8' }} strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Info Text */}
        <p 
          className="text-[13px] leading-[20px] text-center px-4 pb-8"
          style={{ 
            color: '#A5949A',
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 400
          }}
        >
          Your trusted contacts will be notified of your safe arrival
        </p>
      </div>

      <style>{`
        @keyframes wave {
          0% { transform: scaleY(0.3); }
          100% { transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
}