import { ArrowLeft, CheckCircle, AlertTriangle, ShieldCheck, Eye } from 'lucide-react';
import { useState } from 'react';

interface PhotoSecurityResultProps {
  imageUrl: string;
  isProtected: boolean;
  deepfakeScore: number; // 0-100, higher = more likely real
  onBack: () => void;
  onProtect?: () => void;
}

export function PhotoSecurityResult({ 
  imageUrl, 
  isProtected, 
  deepfakeScore,
  onBack,
  onProtect 
}: PhotoSecurityResultProps) {
  const [showDetails, setShowDetails] = useState(false);
  
  // Determine deepfake analysis result
  const isLikelyReal = deepfakeScore >= 70;
  const isSuspicious = deepfakeScore < 50;
  
  return (
    <div 
      className="min-h-screen relative overflow-y-auto"
      style={{
        background: '#FFF0F5'
      }}
    >
      {/* Header */}
      <div className="sticky top-0 z-20 pt-12 px-6 pb-5" style={{ background: '#FFF0F5' }}>
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95"
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              boxShadow: '0 2px 12px rgba(194, 167, 184, 0.2)',
            }}
          >
            <ArrowLeft className="w-5 h-5 text-gray-900" strokeWidth={2.5} />
          </button>
          
          <div className="flex-1 text-center">
            <h1 className="text-[20px] leading-[28px] text-gray-900 font-bold">
              Scan Report
            </h1>
          </div>
          
          <div className="w-11" /> {/* Spacer for balance */}
        </div>
      </div>

      <div className="px-6 pb-32">
        {/* Hero Image with Scanning Frame */}
        <div className="mb-6">
          <div 
            className="rounded-[28px] overflow-hidden relative"
            style={{
              background: 'white',
              boxShadow: '0 8px 32px rgba(194, 167, 184, 0.25)',
            }}
          >
            <div className="relative aspect-[4/3]">
              <img
                src={imageUrl}
                alt="Scanned photo"
                className="w-full h-full object-cover"
              />
              
              {/* Scanning Complete Overlay */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Corner Brackets - Darker rose pink */}
                <svg 
                  className="absolute top-4 left-4 w-8 h-8"
                  viewBox="0 0 32 32"
                  fill="none"
                >
                  <path 
                    d="M2 10V6C2 3.79086 3.79086 2 6 2H10" 
                    stroke="#B13A85" 
                    strokeWidth="3.5" 
                    strokeLinecap="round"
                  />
                </svg>
                <svg 
                  className="absolute top-4 right-4 w-8 h-8"
                  viewBox="0 0 32 32"
                  fill="none"
                >
                  <path 
                    d="M30 10V6C30 3.79086 28.2091 2 26 2H22" 
                    stroke="#B13A85" 
                    strokeWidth="3.5" 
                    strokeLinecap="round"
                  />
                </svg>
                <svg 
                  className="absolute bottom-4 left-4 w-8 h-8"
                  viewBox="0 0 32 32"
                  fill="none"
                >
                  <path 
                    d="M2 22V26C2 28.2091 3.79086 30 6 30H10" 
                    stroke="#B13A85" 
                    strokeWidth="3.5" 
                    strokeLinecap="round"
                  />
                </svg>
                <svg 
                  className="absolute bottom-4 right-4 w-8 h-8"
                  viewBox="0 0 32 32"
                  fill="none"
                >
                  <path 
                    d="M30 22V26C30 28.2091 28.2091 30 26 30H22" 
                    stroke="#B13A85" 
                    strokeWidth="3.5" 
                    strokeLinecap="round"
                  />
                </svg>
                
                {/* Scan Complete Badge - Deep emerald green */}
                <div 
                  className="absolute top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-full flex items-center gap-2"
                  style={{
                    background: '#059669',
                    boxShadow: '0 4px 16px rgba(5, 150, 105, 0.5)',
                  }}
                >
                  <CheckCircle className="w-4 h-4 text-white" strokeWidth={2.5} />
                  <span className="text-[13px] leading-[16px] text-white font-bold">
                    Scan Complete
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Primary Result Card - Privacy Shield */}
        <div 
          className="rounded-[24px] p-6 mb-4"
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 8px 32px rgba(139, 122, 127, 0.2)',
          }}
        >
          <div className="flex items-start gap-4 mb-4">
            <div 
              className="w-14 h-14 rounded-full flex items-center justify-center shrink-0"
              style={{
                background: isProtected 
                  ? 'linear-gradient(135deg, #059669 0%, #047857 100%)'
                  : 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                boxShadow: isProtected
                  ? '0 4px 16px rgba(5, 150, 105, 0.4)'
                  : '0 4px 16px rgba(245, 158, 11, 0.4)',
              }}
            >
              {isProtected ? (
                <ShieldCheck className="w-7 h-7 text-white" strokeWidth={2.5} />
              ) : (
                <AlertTriangle className="w-7 h-7 text-white" strokeWidth={2.5} />
              )}
            </div>
            
            <div className="flex-1">
              <h2 className="text-[18px] leading-[24px] mb-1 text-gray-900 font-bold">
                Privacy Shield
              </h2>
              <div className="flex items-center gap-2">
                {isProtected ? (
                  <>
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{
                        background: '#059669',
                        boxShadow: '0 0 0 3px rgba(5, 150, 105, 0.2)',
                      }}
                    />
                    <span className="text-[15px] leading-[20px] text-[#059669] font-bold">
                      Protected
                    </span>
                  </>
                ) : (
                  <>
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{
                        background: '#F59E0B',
                        boxShadow: '0 0 0 3px rgba(245, 158, 11, 0.2)',
                      }}
                    />
                    <span className="text-[15px] leading-[20px] text-[#F59E0B] font-bold">
                      Unprotected
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Protection Details */}
          <div 
            className="rounded-[18px] p-4 space-y-3"
            style={{
              background: isProtected 
                ? 'rgba(5, 150, 105, 0.08)'
                : 'rgba(245, 158, 11, 0.08)',
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[14px] leading-[20px] text-gray-700 font-semibold">
                Invisible Watermark
              </span>
              <div className="flex items-center gap-1.5">
                {isProtected ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-[#059669]" strokeWidth={2.5} />
                    <span className="text-[14px] leading-[20px] text-[#059669] font-bold">
                      Detected
                    </span>
                  </>
                ) : (
                  <span className="text-[14px] leading-[20px] text-gray-600 font-semibold">
                    Not found
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[14px] leading-[20px] text-gray-700 font-semibold">
                AI Cloak Defense
              </span>
              <div className="flex items-center gap-1.5">
                {isProtected ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-[#059669]" strokeWidth={2.5} />
                    <span className="text-[14px] leading-[20px] text-[#059669] font-bold">
                      Active
                    </span>
                  </>
                ) : (
                  <span className="text-[14px] leading-[20px] text-gray-600 font-semibold">
                    Inactive
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Info Message */}
          <p className="text-[13px] leading-[20px] mt-4 text-gray-700 font-medium">
            {isProtected 
              ? 'This photo is protected from unauthorized use and AI manipulation.'
              : 'This photo is vulnerable to manipulation and unauthorized distribution.'}
          </p>
        </div>

        {/* Secondary Insight Card - AI Deepfake Detector */}
        <div 
          className="rounded-[24px] p-6 mb-4"
          style={{
            background: 'rgba(255, 255, 255, 0.90)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 4px 24px rgba(139, 122, 127, 0.15)',
          }}
        >
          <div className="flex items-start gap-3 mb-4">
            <Eye className="w-5 h-5 shrink-0 mt-0.5 text-gray-800" strokeWidth={2.5} />
            <div className="flex-1">
              <h3 className="text-[16px] leading-[22px] mb-1 text-gray-900 font-bold">
                AI Deepfake Detector
                <span 
                  className="ml-2 text-[12px] px-2 py-0.5 rounded-full"
                  style={{
                    background: 'rgba(194, 167, 184, 0.2)',
                    color: '#7A4D66',
                    fontWeight: 600,
                  }}
                >
                  Beta
                </span>
              </h3>
              <p className="text-[13px] leading-[19px] text-gray-700 font-medium">
                Analysis of digital manipulation
              </p>
            </div>
          </div>

          {/* Score Display */}
          <div className="mb-3">
            <div className="flex items-end justify-between mb-2">
              <span className="text-[13px] leading-[18px] text-gray-700 font-semibold">
                Authenticity Score
              </span>
              <span 
                className="text-[24px] leading-[28px] font-black"
                style={{
                  color: isLikelyReal ? '#059669' : isSuspicious ? '#DC2626' : '#D97706',
                }}
              >
                {deepfakeScore}%
              </span>
            </div>

            {/* Progress Bar */}
            <div 
              className="h-3 rounded-full overflow-hidden"
              style={{
                background: 'rgba(161, 161, 175, 0.2)',
              }}
            >
              <div 
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${deepfakeScore}%`,
                  background: isLikelyReal 
                    ? 'linear-gradient(90deg, #059669 0%, #047857 100%)'
                    : isSuspicious
                    ? 'linear-gradient(90deg, #DC2626 0%, #B91C1C 100%)'
                    : 'linear-gradient(90deg, #D97706 0%, #B45309 100%)',
                  boxShadow: isLikelyReal 
                    ? '0 0 8px rgba(5, 150, 105, 0.5)'
                    : isSuspicious
                    ? '0 0 8px rgba(220, 38, 38, 0.5)'
                    : '0 0 8px rgba(217, 119, 6, 0.5)',
                }}
              />
            </div>
          </div>

          {/* Result Label */}
          <div 
            className="rounded-[16px] px-4 py-3 flex items-center gap-3"
            style={{
              background: isLikelyReal 
                ? 'rgba(5, 150, 105, 0.1)'
                : isSuspicious
                ? 'rgba(220, 38, 38, 0.1)'
                : 'rgba(217, 119, 6, 0.1)',
            }}
          >
            <div 
              className="w-2 h-2 rounded-full"
              style={{
                background: isLikelyReal ? '#059669' : isSuspicious ? '#DC2626' : '#D97706',
              }}
            />
            <span 
              className="text-[14px] leading-[20px] font-bold"
              style={{
                color: isLikelyReal ? '#047857' : isSuspicious ? '#B91C1C' : '#B45309',
              }}
            >
              {isLikelyReal 
                ? 'Likely Real Photo'
                : isSuspicious
                ? 'Suspicious Manipulation Detected'
                : 'Moderate Risk - Further Review Suggested'}
            </span>
          </div>

          {/* Show Details Toggle */}
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full mt-4 py-2 flex items-center justify-center gap-2 transition-all duration-300"
          >
            <span className="text-[13px] leading-[18px] text-gray-700 font-semibold">
              {showDetails ? 'Hide details' : 'View technical details'}
            </span>
            <svg 
              className={`w-4 h-4 transition-transform duration-300 ${showDetails ? 'rotate-180' : ''}`}
              fill="none" 
              viewBox="0 0 16 16"
            >
              <path 
                d="M4 6L8 10L12 6" 
                stroke="#374151" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Technical Details (Expandable) */}
          {showDetails && (
            <div 
              className="mt-4 pt-4 space-y-2"
              style={{
                borderTop: '1px solid rgba(194, 167, 184, 0.2)',
                animation: 'slideDown 0.3s ease-out',
              }}
            >
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-gray-700 font-semibold">Face Detection</span>
                <span className="text-gray-900 font-bold">Natural</span>
              </div>
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-gray-700 font-semibold">Edge Consistency</span>
                <span className="text-gray-900 font-bold">{deepfakeScore >= 70 ? 'High' : 'Low'}</span>
              </div>
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-gray-700 font-semibold">Lighting Analysis</span>
                <span className="text-gray-900 font-bold">{deepfakeScore >= 70 ? 'Consistent' : 'Inconsistent'}</span>
              </div>
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-gray-700 font-semibold">Compression Pattern</span>
                <span className="text-gray-900 font-bold">Normal</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Action Button - Fixed */}
      {!isProtected && onProtect && (
        <div 
          className="absolute bottom-0 left-0 right-0 p-6 pb-8"
          style={{
            background: 'linear-gradient(to top, #FFF0F5 0%, rgba(255, 240, 245, 0.95) 80%, transparent 100%)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <button
            onClick={onProtect}
            className="w-full py-5 rounded-[28px] text-white text-[16px] font-bold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: 'linear-gradient(135deg, #C2A7B8 0%, #D6B4B8 100%)',
              boxShadow: '0 8px 24px rgba(194, 167, 184, 0.5)',
            }}
          >
            Apply Protection Now
          </button>
        </div>
      )}

      {/* CSS Animations */}
      <style>{`
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
  );
}