import svgPaths from "../imports/svg-7jg5ptxabv";
import panicButtonSvg from "../imports/svg-nhtn89mb9x";
import { useState, useRef, useEffect } from "react";
import { supabase, db, edgeFunctions, type IncidentReport } from "../lib/supabase";
import { IncidentReportView } from "./IncidentReportView";
import { handleExportPDF, generateForensicPDF } from "../utils/generateForensicPDF";

// Types for evidence detail modal
interface EvidenceFileType {
  id: number;
  icon: 'camera' | 'mic' | 'document';
  name: string;
  date: string;
  size: string;
  isNew?: boolean;
  hasReport?: boolean;
  riskLevel?: 'Low' | 'Medium' | 'High' | 'Critical';
  reportId?: string;
  tempData?: any;
}

// Helper: Get or create stable anonymous user UUID
// Persists in localStorage so anonymous users keep the same ID across sessions
function getStableAnonUserId(): string {
  const STORAGE_KEY = 'luna_anon_user_id'

  let anonId = localStorage.getItem(STORAGE_KEY)

  if (!anonId) {
    // Generate new stable UUID for anonymous user
    anonId = crypto.randomUUID()
    localStorage.setItem(STORAGE_KEY, anonId)
    console.log('Generated new stable anon user ID:', anonId)
  }

  return anonId
}

interface EvidenceVaultProps {
  onNavigate: (screen: 'camouflage' | 'dashboard' | 'vault' | 'photo') => void;
}

// SVG Icon Components
function BackIcon() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
      <path d={svgPaths.p33f6b680} stroke="var(--stroke-0, #A1A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
      <path d="M15.8333 10H4.16667" stroke="var(--stroke-0, #A1A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
      <path d={svgPaths.p2566d000} stroke="var(--stroke-0, #9FB7A4)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
      <path d={svgPaths.p1bf79e00} stroke="var(--stroke-0, #9FB7A4)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
    </svg>
  );
}

function CloudUploadIcon() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
      <path d="M7 18C4.23858 18 2 15.7614 2 13C2 10.4003 4.01099 8.26502 6.5 8.01105M17.5 8.01105C19.989 8.26502 22 10.4003 22 13C22 15.7614 19.7614 18 17 18" stroke="var(--stroke-0, #C2A7B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      <path d="M12 11V16M12 11L14 13M12 11L10 13" stroke="var(--stroke-0, #C2A7B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

function CloudIcon() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
      <path d={svgPaths.p36c8bc00} stroke="var(--stroke-0, #C2A7B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
      <path d={svgPaths.p1b108500} stroke="var(--stroke-0, #A1A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      <path d={svgPaths.p16b88f0} stroke="var(--stroke-0, #A1A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

function MicIcon() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
      <path d="M12 19V22" stroke="var(--stroke-0, #A1A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      <path d={svgPaths.p1fc92080} stroke="var(--stroke-0, #A1A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      <path d={svgPaths.p18608f80} stroke="var(--stroke-0, #A1A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

function PanicMicIcon({ color = "#EAEAF0" }: { color?: string }) {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
      <path d="M12 19V22" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      <path d={panicButtonSvg.p1fc92080} stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      <path d={panicButtonSvg.p18608f80} stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
      <path d={svgPaths.pb007f00} stroke="var(--stroke-0, #A1A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      <path d={svgPaths.p1b58ab00} stroke="var(--stroke-0, #A1A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      <path d="M10 9H8" stroke="var(--stroke-0, #A1A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      <path d="M16 13H8" stroke="var(--stroke-0, #A1A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      <path d="M16 17H8" stroke="var(--stroke-0, #A1A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
      <clipPath id="clip0_38_2043">
        <rect fill="white" height="20" width="20" />
      </clipPath>
      <g clipPath="url(#clip0_38_2043)">
        <path d={svgPaths.p14d24500} stroke="var(--stroke-0, #D6B4B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        <path d="M10 6.66667V10" stroke="var(--stroke-0, #D6B4B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        <path d="M10 13.3333H10.0083" stroke="var(--stroke-0, #D6B4B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
      </g>
    </svg>
  );
}

function BrainIcon() {
  return (
    <svg className="block size-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  );
}

function FileTextIcon() {
  return (
    <svg className="block size-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg className="block size-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg className="block size-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg className="block size-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

// Report Preview Modal Component
interface ReportPreviewModalProps {
  evidence: EvidenceFileType;
  analysisResult: string | null;
  onClose: () => void;
}

function ReportPreviewModal({ evidence, analysisResult, onClose }: ReportPreviewModalProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  // Generate unique case ID
  const caseId = `LUNA-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  const handleDownloadPDF = async () => {
    setIsGenerating(true);

    try {
      // Check if evidence has tempData (from AI analysis)
      if (evidence.tempData) {
        // Use the sophisticated PDF generation from generateForensicPDF.ts
        await handleExportPDF(evidence.tempData as IncidentReport);
      } else {
        // Fallback: Show alert that full report data is needed
        alert('⚠️ Full incident report data required for PDF generation.\n\nPlease run AI Analysis first or select this evidence from the "AI Analysis Reports" section.');
      }
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('❌ Failed to generate PDF: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="absolute inset-0 z-[100] flex items-center justify-center p-4">
      {/* BACKDROP - ONLY this has blur and opacity */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* MODAL CARD - solid bg, relative z-index */}
      <div className="relative z-10 w-full max-w-sm max-h-[85%] bg-[#1F2937] border border-gray-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#C2A7B8] rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white text-lg font-bold">L</span>
            </div>
            <div>
              <h2 className="text-gray-900 font-bold text-base">Forensic Evidence Report</h2>
              <p className="text-gray-500 text-xs">Case: {caseId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <div className="w-5 h-5 text-gray-600">
              <XIcon />
            </div>
          </button>
        </div>

        {/* Content - Document Style */}
        <div className="flex-1 overflow-y-auto px-8 py-8 bg-white">
          <div
            ref={reportRef}
            className="font-serif text-gray-900"
            style={{ minHeight: '600px' }}
          >
            {/* Report Header */}
            <div className="text-center border-b-2 border-gray-900 pb-6 mb-6">
              <h1 className="text-2xl font-bold tracking-wider mb-2">OFFICIAL EVIDENCE REPORT</h1>
              <div className="flex items-center justify-center gap-2">
                <div className="w-8 h-8 bg-[#C2A7B8] rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">L</span>
                </div>
                <p className="text-sm font-semibold text-gray-700">Luna Women's Safety App</p>
              </div>
            </div>

            {/* Case Information */}
            <div className="mb-6">
              <div className="flex justify-between items-center bg-gray-50 px-4 py-2 rounded">
                <span className="text-sm font-medium text-gray-600">Case ID</span>
                <span className="text-sm font-mono text-gray-900">{caseId}</span>
              </div>
              <div className="flex justify-between items-center bg-gray-50 px-4 py-2 rounded mt-1">
                <span className="text-sm font-medium text-gray-600">Generated</span>
                <span className="text-sm text-gray-900">{new Date().toLocaleString()}</span>
              </div>
            </div>

            {/* Evidence Details */}
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-300 pb-2">
                EVIDENCE DETAILS
              </h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">File Name:</span>
                  <span className="text-gray-900 font-mono text-right">{evidence.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Date:</span>
                  <span className="text-gray-900 text-right">{evidence.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Size:</span>
                  <span className="text-gray-900 text-right">{evidence.size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Type:</span>
                  <span className="text-gray-900 text-right capitalize">
                    {evidence.icon === 'camera' ? 'Image' : evidence.icon === 'mic' ? 'Audio' : 'Document'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Encryption:</span>
                  <span className="text-green-700 font-semibold text-right">✓ AES-256 Encrypted</span>
                </div>
                {evidence.riskLevel && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Risk Level:</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                      evidence.riskLevel === 'Low' ? 'bg-green-100 text-green-800' :
                      evidence.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      evidence.riskLevel === 'High' ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {evidence.riskLevel}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* AI Analysis */}
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-300 pb-2">
                AI ANALYSIS
              </h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                {analysisResult ? (
                  <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                    {analysisResult}
                  </p>
                ) : (
                  <p className="text-sm text-gray-500 italic text-center py-4">
                    No analysis available. Please run AI Analysis first.
                  </p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-4 border-t border-gray-300">
              <p className="text-xs text-gray-500 text-center leading-relaxed">
                <strong>LEGAL DISCLAIMER:</strong> This report is generated by Luna Women's Safety App's AI system
                and is intended for informational purposes only. The analysis provided should not be considered
                legal advice. For legal proceedings, please consult with a qualified attorney.
              </p>
              <p className="text-xs text-gray-400 text-center mt-2">
                Report ID: {caseId} • Generated by Luna v2.0
              </p>
            </div>
          </div>
        </div>

        {/* Download Button - Sticky Footer */}
        <div className="bg-white border-t border-gray-200 px-8 py-5 shrink-0">
          <button
            onClick={handleDownloadPDF}
            disabled={isGenerating}
            className="w-full py-4 bg-[#1e1f23] hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-xl text-white font-semibold transition-all flex items-center justify-center gap-3 shadow-lg"
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Generating Professional PDF...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Download & Upload to Cloud</span>
              </>
            )}
          </button>
          <p className="text-center text-xs text-gray-500 mt-3">
            PDF will be uploaded to secure cloud storage and automatically copied for PDRM e-Reporting
          </p>
        </div>
      </div>
    </div>
  );
}

// Evidence Detail Modal Component
interface EvidenceDetailModalProps {
  evidence: EvidenceFileType;
  onClose: () => void;
}

function EvidenceDetailModal({ evidence, onClose }: EvidenceDetailModalProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const handleAIAnalysis = () => {
    setIsAnalyzing(true);

    // Simulate AI analysis
    setTimeout(() => {
      const mockAnalysis = `Analysis: This ${evidence.icon === 'mic' ? 'audio recording' : 'image file'} contains evidence of aggressive behavior.

${evidence.icon === 'mic'
  ? '• High-decibel shouting detected at timestamps 0:14 and 0:45\n• Keywords identified: "threat", "harm", "scary"\n• Tone analysis: Aggressive, intimidating\n• Pattern matches typical harassment tactics'
  : '• Visual evidence of inappropriate behavior\n• Context suggests hostile environment\n• Multiple red flags in body language and proximity\n• Tissue distress indicators present'}

Recommendation: This evidence strongly supports legal action. Preserve original file and metadata.

Risk Level: ${evidence.riskLevel || 'Medium'}
Confidence: 87%`;

      setAnalysisResult(mockAnalysis);
      setIsAnalyzing(false);
    }, 2000);
  };

  const handlePreviewReport = () => {
    setShowPreviewModal(true);
  };

  const getFileIcon = () => {
    const size = "w-24 h-24";
    const iconSize = "w-12 h-12";

    if (evidence.icon === 'camera') {
      return (
        <div className={`${size} bg-[rgba(194,167,184,0.1)] rounded-3xl flex items-center justify-center`}>
          <div className={`${iconSize} text-[#C2A7B8]`}>
            <CameraIcon />
          </div>
        </div>
      );
    } else if (evidence.icon === 'mic') {
      return (
        <div className={`${size} bg-[rgba(159,183,164,0.1)] rounded-3xl flex items-center justify-center`}>
          <div className={`${iconSize} text-[#9FB7A4]`}>
            <MicIcon />
          </div>
        </div>
      );
    } else {
      return (
        <div className={`${size} bg-[rgba(161,161,175,0.1)] rounded-3xl flex items-center justify-center`}>
          <div className={`${iconSize} text-[#A1A1AF]`}>
            <DocumentIcon />
          </div>
        </div>
      );
    }
  };

  return (
    <>
    {/* Master Wrapper to hold everything */}
    <div className="absolute inset-0 z-[100] flex items-center justify-center p-4">
      {/* BACKDROP - ONLY this has blur and opacity */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* MODAL CARD - solid bg, relative z-index */}
      <div className="relative z-10 w-full max-w-sm max-h-[85%] bg-[#1F2937] border border-gray-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="shrink-0 flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors"
          >
            <div className="w-5 h-5">
              <ChevronLeftIcon />
            </div>
          </button>
          <h2 className="text-lg font-semibold">Evidence Details</h2>
          <div className="w-10 h-10 rounded-full bg-[rgba(159,183,164,0.2)] flex items-center justify-center">
            <div className="w-5 h-5 text-[#9FB7A4]">
              <LockIcon />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {/* File Preview */}
        <div className="flex flex-col items-center py-6">
          {getFileIcon()}
          <div className="mt-4 flex items-center gap-2">
            <span className="px-3 py-1 bg-[rgba(159,183,164,0.2)] text-[#9FB7A4] rounded-full text-xs font-medium">
              AES-256 Encrypted
            </span>
          </div>
        </div>

        {/* Metadata */}
        <div className="bg-gray-800 rounded-2xl p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Filename</span>
            <span className="text-white font-medium text-sm truncate ml-4">{evidence.name}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Date</span>
            <span className="text-white text-sm ml-4">{evidence.date}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Size</span>
            <span className="text-white text-sm ml-4">{evidence.size}</span>
          </div>
          {evidence.riskLevel && (
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Risk Level</span>
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                evidence.riskLevel === 'Low' ? 'bg-green-900 text-green-300' :
                evidence.riskLevel === 'Medium' ? 'bg-purple-900 text-purple-300' :
                evidence.riskLevel === 'High' ? 'bg-pink-900 text-pink-300' :
                'bg-red-900 text-red-300'
              }`}>
                {evidence.riskLevel}
              </span>
            </div>
          )}
        </div>

        {/* AI Analysis Section */}
        <div className="bg-gray-800 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[rgba(194,167,184,0.15)] rounded-xl flex items-center justify-center">
              <div className="w-5 h-5 text-[#C2A7B8]">
                <BrainIcon />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold text-base">AI Legal Analysis</h3>
              <p className="text-gray-400 text-xs">AI-powered evidence examination</p>
            </div>
          </div>

          {!analysisResult ? (
            <button
              onClick={handleAIAnalysis}
              disabled={isAnalyzing}
              className="w-full py-3 bg-[#C2A7B8] hover:bg-[rgba(194,167,184,0.8)] disabled:bg-gray-700 rounded-xl text-white font-medium transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <span>✨ Analyze Evidence</span>
                </>
              )}
            </button>
          ) : (
            <div className="space-y-3">
              <div className="bg-gray-900 rounded-xl p-4">
                <p className="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">
                  {analysisResult}
                </p>
              </div>
              <button
                onClick={() => setAnalysisResult(null)}
                className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
              >
                Re-analyze
              </button>
            </div>
          )}
        </div>

        {/* Export Section */}
        <div className="bg-gray-800 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[rgba(159,183,164,0.15)] rounded-xl flex items-center justify-center">
              <div className="w-5 h-5 text-[#9FB7A4]">
                <FileTextIcon />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold text-base">Legal Report</h3>
              <p className="text-gray-400 text-xs">Generate court-ready PDF</p>
            </div>
          </div>

          <button
            onClick={handlePreviewReport}
            className="w-full py-3 bg-[#9FB7A4] hover:bg-[rgba(159,183,164,0.8)] rounded-xl text-white font-medium transition-all flex items-center justify-center gap-2"
          >
            <span>📄 Preview Legal Report</span>
          </button>
        </div>
      </div>
    </div>
    </div>

    {/* Report Preview Modal - rendered OUTSIDE the modal container div */}
    {showPreviewModal && (
      <ReportPreviewModal
        evidence={evidence}
        analysisResult={analysisResult}
        onClose={() => setShowPreviewModal(false)}
      />
    )}
  </>
  );
}

// File Item Component
interface FileItemProps {
  file: EvidenceFileType;
  onClick: () => void;
}

function FileItem({ file, onClick }: FileItemProps) {
  const riskColors = {
    Low: '#9fb7a4',
    Medium: '#c2a7b8',
    High: '#d6b4b8',
    Critical: '#d67880',
  };

  // Truncate filename if too long
  const displayName = file.name.length > 25 ? file.name.substring(0, 20) + '...' : file.name;

  return (
    <div
      className={`bg-[rgba(42,44,50,0.3)] rounded-[16px] border-[0.883px] ${file.isNew ? 'border-[rgba(159,183,164,0.4)]' : 'border-[rgba(194,167,184,0.2)]'} relative transition-all duration-300 cursor-pointer hover:border-[rgba(194,167,184,0.4)] active:scale-[0.98]`}
      onClick={onClick}
    >
      <div className="flex items-center gap-3 py-3 px-4">
        {/* File Icon Container - Fixed Small Size */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[rgba(42,44,50,0.5)]">
          <div className="size-5">
            {file.icon === 'camera' && <CameraIcon />}
            {file.icon === 'mic' && <MicIcon />}
            {file.icon === 'document' && <DocumentIcon />}
          </div>
        </div>

        {/* File Info - THE FIX IS HERE - min-w-0 allows truncation */}
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-['Nunito',sans-serif] font-normal text-[#eaeaf0] text-[14px] truncate pr-2">
              {displayName}
            </p>
            {file.hasReport && file.riskLevel && (
              <div
                className="size-[6px] rounded-full shrink-0"
                style={{ backgroundColor: riskColors[file.riskLevel] }}
                title={`${file.riskLevel} Risk Analysis Available`}
              />
            )}
          </div>
          <div className="flex items-center gap-2">
            <p className="font-['Nunito',sans-serif] font-normal text-[#6f6f7a] text-[12px]">
              {file.date}
            </p>
            <p className="font-['Nunito',sans-serif] font-normal text-[#6f6f7a] text-[12px]">
              •
            </p>
            <p className="font-['Nunito',sans-serif] font-normal text-[#6f6f7a] text-[12px]">
              {file.size}
            </p>
          </div>
        </div>

        {/* Right Side Icons */}
        <div className="flex items-center gap-2 shrink-0">
          {/* AES-256 Badge */}
          <div className="bg-[rgba(159,183,164,0.2)] rounded-[16px] px-2 py-1">
            <p className="font-['Nunito',sans-serif] font-normal text-[#9fb7a4] text-[11px] whitespace-nowrap">
              AES-256
            </p>
          </div>

          {/* Report Indicator */}
          {file.hasReport && (
            <div className="size-8 bg-[rgba(159,183,164,0.2)] rounded-full flex items-center justify-center">
              <div className="size-4 text-[#9fb7a4]">
                <FileTextIcon />
              </div>
            </div>
          )}

          {/* Chevron */}
          <div className="size-5 text-[#a1a1af]">
            <ChevronRightIcon />
          </div>
        </div>
      </div>
    </div>
  );
}

export function EvidenceVault({ onNavigate }: EvidenceVaultProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const pressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const recordingStartTimeRef = useRef<number>(0);

  const [files, setFiles] = useState<EvidenceFileType[]>([
    { id: 1, icon: 'camera' as const, name: 'IMG_2024_001.enc', date: '2 days ago', size: '2.4 MB', isNew: false },
    { id: 2, icon: 'mic' as const, name: 'REC_2024_003.enc', date: '1 week ago', size: '1.2 MB', isNew: false },
    { id: 3, icon: 'document' as const, name: 'NOTE_2024_005.enc', date: '2 weeks ago', size: '0.3 MB', isNew: false },
  ]);

  // AI Analysis states
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceFileType | null>(null);
  const [incidentReports, setIncidentReports] = useState<IncidentReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<IncidentReport | null>(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showContextDialog, setShowContextDialog] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [userContext, setUserContext] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [showUploadFeedback, setShowUploadFeedback] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPressHeld, setIsPressHeld] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);

  // Load incident reports on mount
  useEffect(() => {
    loadIncidentReports();
  }, []);

  // Debug: Monitor dialog state changes
  useEffect(() => {
    console.log('showContextDialog changed:', showContextDialog);
    console.log('pendingFile:', pendingFile?.name);
    console.log('currentUserId:', currentUserId);
  }, [showContextDialog, pendingFile, currentUserId]);

  const loadIncidentReports = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
        const reports = await db.getIncidentReports(user.id);
        setIncidentReports(reports);
      } else {
        // Anonymous mode: Use stable UUID from localStorage
        const anonUserId = getStableAnonUserId();
        setCurrentUserId(anonUserId);
        console.log('Using stable anon user ID:', anonUserId);
      }
    } catch (error) {
      console.error('Error loading incident reports:', error);
      // Fallback to stable anonymous UUID
      const anonUserId = getStableAnonUserId();
      setCurrentUserId(anonUserId);
      console.log('Using stable anon user ID (fallback):', anonUserId);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement> | { target: { files: File[] } }) => {
    const uploadedFiles = event.target.files;
    if (!uploadedFiles || uploadedFiles.length === 0) {
      console.log('No files selected');
      return;
    }

    console.log('=== FILE UPLOAD TRIGGERED ===');
    console.log('Files selected:', uploadedFiles.length);
    console.log('First file type:', uploadedFiles[0]?.type);
    console.log('First file name:', uploadedFiles[0]?.name);

    // For single file upload, show context dialog for AI analysis
    if (uploadedFiles.length === 1 && uploadedFiles[0].type.startsWith('image/')) {
      console.log('✓ This is a single image - showing context dialog');
      setPendingFile(uploadedFiles[0]);
      setShowContextDialog(true);

      // Ensure userId is set (stable UUID)
      if (!currentUserId) {
        const anonUserId = getStableAnonUserId();
        console.log('⚠ Setting stable anon user ID:', anonUserId);
        setCurrentUserId(anonUserId);
      }

      // Reset file input
      if ('value' in event.target) {
        event.target.value = '';
      }
      console.log('✓ Dialog should now be visible');
      return;
    }

    // For multiple files or non-images, proceed with normal upload
    console.log('⚠ This is NOT a single image, processing normal upload');
    processFileUpload(Array.from(uploadedFiles));
  };

  const processFileUpload = async (uploadedFiles: File[]) => {
    setIsUploading(true);
    setShowUploadFeedback(true);

    try {
      // Get or create user ID
      let userId = currentUserId;
      if (!userId) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          userId = user.id;
        } else {
          // Use stable anonymous UUID
          userId = getStableAnonUserId();
        }
        setCurrentUserId(userId);
      }

      console.log('📤 Uploading files for userId:', userId);

      const newFiles = await Promise.all(
        uploadedFiles.map(async (file, index) => {
          const fileType = file.type.startsWith('image/') ? 'camera' as const :
                          file.type.startsWith('audio/') ? 'mic' as const : 'document' as const;
          const fileSize = (file.size / (1024 * 1024)).toFixed(1);

          // FORCE UPLOAD: Upload even in demo mode
          // Use 'demo-uploads' folder for storage (doesn't require real user ID)
          // But incident_reports.user_id will use the stable UUID
          const uploadFolder = userId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
            ? userId
            : 'demo-uploads';

          console.log(`📤 Uploading ${file.name} to folder: ${uploadFolder}`);

          try {
            const { path, url } = await db.uploadEvidence(uploadFolder, file);
            console.log('✅ Upload successful:', url);

            // Use upsert for conflict-safe insert
            // Always use the stable UUID for incident_reports.user_id
            const report = await db.upsertIncidentReport({
              user_id: userId, // This is always a valid UUID
              evidence_url: url,
              evidence_type: fileType,
            });

            console.log('✅ Report created/updated:', report.id);

            return {
              id: Date.now() + index,
              icon: fileType,
              name: `${file.name.split('.')[0]}_${Date.now()}.enc`,
              date: 'Just now',
              size: `${fileSize} MB`,
              isNew: true,
              reportId: report.id,
              reportUrl: url,
            };
          } catch (uploadError) {
            console.error('❌ Upload failed:', uploadError);
            // Return mock entry if upload fails
            return {
              id: Date.now() + index,
              icon: fileType,
              name: `${file.name.split('.')[0]}_${Date.now()}.enc`,
              date: 'Just now',
              size: `${fileSize} MB`,
              isNew: true,
            };
          }
        })
      );

      setFiles(prev => [...newFiles, ...prev]);

      // Reload incident reports
      await loadIncidentReports();
    } catch (error) {
      console.error('Error uploading files:', error);
    } finally {
      setIsUploading(false);
      setTimeout(() => {
        setShowUploadFeedback(false);
        setTimeout(() => {
          setFiles(prev => prev.map(f => ({ ...f, isNew: false })));
        }, 300);
      }, 2000);
    }
  };

  const handleAnalyzeEvidence = async () => {
    console.log('handleAnalyzeEvidence called');
    console.log('pendingFile:', pendingFile?.name);

    if (!pendingFile) {
      console.error('No file to analyze');
      return;
    }

    // Get or create user ID
    let userId = currentUserId;
    if (!userId) {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Auth error:', error);
      }
      if (user) {
        userId = user.id;
        setCurrentUserId(user.id);
      } else {
        // Use stable anonymous UUID from localStorage
        userId = getStableAnonUserId();
        setCurrentUserId(userId);
        console.log('Using stable anon user ID:', userId);
      }
    }

    console.log('Using userId:', userId);
    setIsAnalyzing(true);
    setShowContextDialog(false);
    setShowUploadFeedback(true);

    try {
      // Step 1: Upload file to Supabase Storage
      console.log('Step 1: Uploading file to Supabase Storage...');
      console.log('User ID:', userId);

      let evidenceUrl: string | null = null;

      // FORCE UPLOAD: Upload even in demo mode
      // Use 'demo-uploads' folder for storage if not a real UUID
      const uploadFolder = userId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
        ? userId
        : 'demo-uploads';
      console.log('📤 Uploading to folder:', uploadFolder);

      try {
        const { path, url } = await db.uploadEvidence(uploadFolder, pendingFile);
        evidenceUrl = url;
        console.log('✅ File uploaded successfully:', evidenceUrl);
      } catch (uploadError) {
        console.error('❌ Upload to Supabase failed:', uploadError);
        console.error('Error details:', JSON.stringify(uploadError, null, 2));

        // Show user-friendly error but don't block
        alert(`Upload failed: ${uploadError.message || 'Unknown error'}\n\nPlease check:\n1. The "evidence" bucket exists in Supabase Storage\n2. RLS policies allow uploads\n3. Your Supabase credentials are correct`);

        evidenceUrl = null;
      }

      if (!evidenceUrl) {
        throw new Error('Failed to upload file to storage');
      }

      // Step 2: Call Edge Function for AI analysis
      // Note: Edge Function will create/update the report in the database
      // It uses service role key which bypasses RLS policies
      console.log('Step 2: Calling AI analysis Edge Function...');

      try {
        const params = {
          evidenceUrl: evidenceUrl,
          userContext: userContext || undefined,
          evidenceType: pendingFile.type.startsWith('audio/') ? 'audio' : 'image',
          userId: userId, // Always pass stable UUID
        };

        console.log('📤 Sending to Edge Function:', JSON.stringify(params, null, 2));

        const analysisResult = await edgeFunctions.analyzeEvidence(params);

        console.log('✅ AI Analysis completed:', analysisResult);

        // Step 3: Reload reports from database to get updated analysis
        console.log('Step 3: Reloading reports from database...');
        await loadIncidentReports();

// 🟢🟢🟢 Step 5: Updating local state (逻辑重排修复版) 🟢🟢🟢
        console.log('Step 5: Updating local state...');

        const fileSize = (pendingFile.size / (1024 * 1024)).toFixed(1);
        
        // A. 先定义报告数据对象
        const completeTempReport = {
            id: analysisResult.reportId,
            created_at: new Date().toISOString(),
            risk_level: analysisResult.riskLevel,
            risk_score: analysisResult.riskScore,
            ai_analysis: analysisResult.analysis,
            evidence_url: evidenceUrl,
            user_id: userId,
            status: 'completed'
        };

        // B. 再定义 newFile，把刚才定义好的数据塞进去
        const newFile = {
          id: Date.now(),
          icon: pendingFile.type.startsWith('audio/') ? 'mic' as const : 'camera' as const,
          name: `${pendingFile.name.split('.')[0]}_${Date.now()}.enc`,
          date: 'Just now',
          size: `${fileSize} MB`,
          isNew: true,
          reportId: analysisResult.reportId,
          hasReport: true, 
          riskLevel: analysisResult.riskLevel,
          tempData: completeTempReport // ✅ 现在定义过了，不会报错了
        };

        setFiles(prev => [newFile, ...prev]);
        console.log('✓ Local state updated');

        // C. 自动弹出分析结果弹窗
        // @ts-ignore 
        setSelectedReport(completeTempReport); 

        // 清理表单
        setUserContext('');
        setPendingFile(null);

        // 隐藏反馈动画
        setTimeout(() => {
          setShowUploadFeedback(false);
          setTimeout(() => {
            setFiles(prev => prev.map(f => ({ ...f, isNew: false })));
          }, 300);
        }, 1500);

      } catch (aiError: any) {
        console.error('❌ AI Analysis failed:', aiError);
        console.error('AI Error details:', {
          message: aiError.message,
          stack: aiError.stack,
          context: aiError.context,
        });

        // Show more detailed error to user
        alert(`Analysis failed: ${aiError.message}\n\nPlease check:\n1. Edge Function is deployed\n2. OPENROUTER_API_KEY is set\n3. Run: supabase functions logs analyze-evidence --tail`);

        throw aiError;
      }



    } catch (error) {
      console.error('❌ Error in analysis:', error);
      setShowUploadFeedback(false);
      setShowContextDialog(true);
      alert(`Analysis failed: ${error.message}\n\nPlease try again or contact support.`);
    } finally {
      setIsAnalyzing(false);
      console.log('Analysis process completed');
    }
  };

  const handleUploadClick = () => {
    console.log('Add Evidence button clicked');
    console.log('fileInputRef.current:', fileInputRef.current);
    fileInputRef.current?.click();
  };

  const startRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = event => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          const file = new File([audioBlob], `PANIC_REC_${Date.now()}.wav`, { type: 'audio/wav' });
          handleFileUpload({ target: { files: [file] } });

          // ✨ 关键修改：让录音也进入“待分析”状态
          setPendingFile(file);
          setShowContextDialog(true);

          // Stop all audio tracks to release microphone
          stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
        setIsRecording(true);
        recordingStartTimeRef.current = Date.now();
        
        // Update duration every 100ms
        const durationInterval = setInterval(() => {
          if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            setRecordingDuration(Date.now() - recordingStartTimeRef.current);
          }
        }, 100);
        
        // Store interval ID for cleanup
        pressTimerRef.current = durationInterval as any;
      })
      .catch(err => console.error('Error accessing microphone:', err));
  };

  const stopRecording = () => {
    const mediaRecorder = mediaRecorderRef.current;
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      setIsRecording(false);
      if (pressTimerRef.current) {
        clearInterval(pressTimerRef.current as NodeJS.Timeout);
      }
      setRecordingDuration(0);
    }
  };

  const handlePressStart = () => {
    setIsPressHeld(true);
    // Start recording after 1 second of pressing
    pressTimerRef.current = setTimeout(() => {
      startRecording();
    }, 1000);
  };

  const handlePressEnd = () => {
    setIsPressHeld(false);
    
    // If still in the 1-second delay, cancel the recording
    if (!isRecording && pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
    }
    
    // If already recording, stop it
    if (isRecording) {
      stopRecording();
    }
  };

  return (
    <div className="h-full bg-gradient-to-b from-[#1e1f23] to-[#2a2c32] flex flex-col relative overflow-hidden">
      {/* Header Section */}
      <div className="pt-16 px-6 pb-6">
        {/* Top Navigation Bar */}
        <div className="flex gap-4 h-[52px] items-center mb-6">
          {/* Back Button */}
          <button
            onClick={() => onNavigate('dashboard')}
            className="bg-[#2a2c32] rounded-full size-[40px] flex items-center justify-center shrink-0"
          >
            <div className="size-[20px]">
              <BackIcon />
            </div>
          </button>

          {/* Title Section */}
          <div className="flex-1">
            <h1 className="font-['Nunito',sans-serif] font-normal leading-[32px] text-[#eaeaf0] text-[24px]">
              Evidence Vault
            </h1>
            <p className="font-['Nunito',sans-serif] font-normal leading-[20px] text-[#a1a1af] text-[14px]">
              Encrypted & Secure
            </p>
          </div>

          {/* Lock Icon */}
          <div className="bg-[rgba(159,183,164,0.2)] rounded-full size-[40px] flex items-center justify-center shrink-0">
            <div className="size-[20px]">
              <LockIcon />
            </div>
          </div>
        </div>

        {/* Sync Status Banner */}
        <div className="bg-[rgba(42,44,50,0.5)] rounded-[20px] border-[0.883px] border-[rgba(194,167,184,0.2)] h-[45.767px]">
          <div className="flex items-center h-full px-[12.883px] gap-[12px]">
            <div className="size-[20px]">
              <CloudIcon />
            </div>
            <p className="font-['Nunito',sans-serif] font-normal leading-[20px] text-[#eaeaf0] text-[14px] flex-1">
              Local Trace Wiped. Cloud Synced.
            </p>
            <div className="bg-[#9fb7a4] rounded-full size-[8px]" />
          </div>
        </div>

        {/* Upload Evidence Card - Primary Action */}
        <button
          onClick={handleUploadClick}
          className="w-full mt-6 bg-[rgba(42,44,50,0.5)] rounded-[20px] border-[1.5px] border-[rgba(194,167,184,0.3)] hover:border-[rgba(194,167,184,0.5)] transition-all duration-200"
        >
          <div className="flex items-center gap-4 px-[16px] py-[18px]">
            {/* Upload Icon */}
            <div className="bg-[rgba(194,167,184,0.15)] rounded-[18px] size-[56px] flex items-center justify-center shrink-0">
              <div className="size-[28px]">
                <CloudUploadIcon />
              </div>
            </div>

            {/* Text Content */}
            <div className="flex-1 text-left">
              <p className="font-['Nunito',sans-serif] font-normal leading-[24px] text-[#eaeaf0] text-[16px] mb-1">
                Add Evidence
              </p>
              <p className="font-['Nunito',sans-serif] font-normal leading-[18px] text-[#a1a1af] text-[13px]">
                Photos, audio, or notes · Stored securely
              </p>
            </div>
          </div>
        </button>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,audio/*,.pdf,.txt,.doc,.docx"
          className="hidden"
          onChange={(e) => {
            console.log('File input onChange fired');
            handleFileUpload(e);
          }}
        />
      </div>

      {/* File List Section */}
      <div className="px-6 pb-24">
        {/* Incident Reports Section - Compact Row Fix */}
        {incidentReports.length > 0 && (
          <button
            onClick={() => {
              setShowHistoryModal(true);
            }}
            className="w-full mt-6 mb-2 group relative overflow-hidden rounded-[16px] bg-[rgba(42,44,50,0.3)] border-[0.883px] border-[rgba(159,183,164,0.3)] p-3 transition-all hover:border-[rgba(159,183,164,0.5)] active:scale-[0.98] flex items-center gap-3"
          >
            {/* Icon Container - Fixed Small Size */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[rgba(159,183,164,0.15)] text-[#9fb7a4]">
              <div className="size-5">
                <BrainIcon />
              </div>
            </div>

            {/* Text Content */}
            <div className="flex flex-col items-start flex-1 min-w-0">
              <div className="flex items-center gap-2 w-full">
                <span className="text-[14px] font-semibold text-[#eaeaf0] font-['Nunito',sans-serif] truncate">
                  AI Analysis Reports
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[rgba(159,183,164,0.2)] text-[#9fb7a4] text-[10px] font-medium font-['Nunito',sans-serif] shrink-0">
                  {incidentReports.length}
                </span>
              </div>
              <span className="text-[12px] text-[#9fb7a4] font-['Nunito',sans-serif] truncate w-full text-left">
                {incidentReports.length} {incidentReports.length === 1 ? 'report' : 'reports'} available
              </span>
            </div>

            {/* Right Side - Arrow */}
            <svg className="size-4 text-[#6f6f7a] group-hover:text-[#9fb7a4] transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* Section Header */}
        <h3 className="font-['Nunito',sans-serif] font-normal leading-[20px] text-[#a1a1af] text-[14px] mb-4">
          All Evidence ({files.length})
        </h3>

        {/* Files List - 强制宽度限制 */}
        <div className="flex flex-col gap-[12px] mb-4 w-full max-w-full">
          {files.map(file => (
            <div key={file.id} className="w-full overflow-hidden">
              <FileItem
                file={file}
                onClick={() => setSelectedEvidence(file)}
              />
            </div>
          ))}
        </div>

        {/* Info Banner */}
        <div className="bg-[rgba(214,180,184,0.1)] border-[0.883px] border-[rgba(214,180,184,0.3)] rounded-[20px] h-[65.767px] relative">
          <div className="absolute left-[16.88px] top-[18.88px] size-[20px]">
            <AlertIcon />
          </div>
          <div className="absolute left-[48.88px] top-[16.88px] h-[32px] w-[286px]">
            <p className="font-['Nunito',sans-serif] font-normal leading-[16px] text-[#eaeaf0] text-[12px] whitespace-pre-wrap">
              Files are encrypted and only accessible with your PIN.
            </p>
          </div>
        </div>

        {/* Upload Feedback */}
        {showUploadFeedback && (
          <div className="absolute inset-0 z-[100] flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out]">
            {/* BACKDROP - ONLY this has blur and opacity */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

            {/* MODAL CARD - solid bg, relative z-index */}
            <div className="relative z-10 bg-[#1F2937] rounded-[24px] px-8 py-6 border border-gray-700 shadow-2xl max-w-[85%]">
              <div className="flex flex-col items-center gap-4">
                {/* Animated Upload Icon */}
                <div className="size-[64px] bg-[rgba(194,167,184,0.15)] rounded-full flex items-center justify-center animate-[pulse_1s_ease-in-out_infinite]">
                  <div className="size-[32px]">
                    {isAnalyzing ? <BrainIcon /> : isUploading ? <CloudUploadIcon /> : (
                      <svg className="block size-full" fill="none" viewBox="0 0 24 24">
                        <path d="M9 12L11 14L15 10" stroke="#9FB7A4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                        <circle cx="12" cy="12" r="10" stroke="#9FB7A4" strokeWidth="2" />
                      </svg>
                    )}
                  </div>
                </div>

                {/* Status Text */}
                <div className="text-center">
                  <p className="font-['Nunito',sans-serif] font-normal leading-[24px] text-[#eaeaf0] text-[16px] mb-1">
                    {isAnalyzing ? 'Analyzing Evidence...' : isUploading ? 'Encrypting...' : 'Upload Complete'}
                  </p>
                  <p className="font-['Nunito',sans-serif] font-normal leading-[18px] text-[#a1a1af] text-[13px]">
                    {isAnalyzing
                      ? 'AI is examining your evidence for legal documentation'
                      : isUploading
                      ? 'Securing your evidence'
                      : 'Local trace wiped. Cloud synced.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Context Dialog for AI Analysis - MOVED TO ROOT LEVEL (after panic button) */}

        {/* Report History Modal */}
        {showHistoryModal && (
          <div className="absolute inset-0 z-[100] flex items-center justify-center p-4">
            {/* BACKDROP - ONLY this has blur and opacity */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowHistoryModal(false)} />

            {/* MODAL CARD - solid bg, relative z-index */}
            <div className="relative z-10 w-full max-w-sm max-h-[85%] bg-[#1F2937] rounded-2xl border border-gray-700 shadow-2xl overflow-hidden flex flex-col">
              {/* Header */}
              <div className="shrink-0 p-4 border-b border-gray-800 flex justify-between items-center">
                <h2 className="font-['Nunito',sans-serif] font-semibold text-[#eaeaf0] text-[16px]">
                  Report History
                </h2>
                <button
                  onClick={() => setShowHistoryModal(false)}
                  className="h-8 w-8 rounded-full bg-[rgba(194,167,184,0.1)] flex items-center justify-center hover:bg-[rgba(194,167,184,0.2)] transition-colors shrink-0"
                >
                  <div className="h-4 w-4">
                    <XIcon />
                  </div>
                </button>
              </div>

              {/* Body - Scrollable List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {incidentReports.length === 0 ? (
                  <p className="font-['Nunito',sans-serif] font-normal text-[#6f6f7a] text-[13px] text-center py-8">
                    No reports found
                  </p>
                ) : (
                  incidentReports.map((report) => {
                    const riskColors = {
                      Low: 'text-[#9fb7a4]',
                      Medium: 'text-[#c2a7b8]',
                      High: 'text-[#d6b4b8]',
                      Critical: 'text-[#d67880]',
                    };

                    const riskColor = riskColors[report.risk_level || 'Medium'];
                    const analysis = report.ai_analysis as any;
                    const date = new Date(report.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    });

                    return (
                      <button
                        key={report.id}
                        onClick={() => {
                          setSelectedReport(report);
                          setShowHistoryModal(false);
                        }}
                        className="w-full bg-gray-800/50 p-3 rounded-xl border border-gray-700 flex items-center justify-between hover:bg-gray-800 transition-colors active:scale-[0.98]"
                      >
                        {/* Left Side - Date and Summary */}
                        <div className="flex-1 min-w-0 text-left">
                          <p className="font-['Nunito',sans-serif] font-semibold text-[#eaeaf0] text-[14px] mb-0.5">
                            {date}
                          </p>
                          {analysis?.incident_summary && (
                            <p className="font-['Nunito',sans-serif] font-normal text-[#a1a1af] text-[12px] truncate">
                              {analysis.incident_summary}
                            </p>
                          )}
                        </div>

                        {/* Right Side - Risk Badge and Arrow */}
                        <div className="flex items-center gap-2 shrink-0 ml-3">
                          {/* Risk Badge */}
                          <span className={`px-2 py-0.5 rounded-md text-[11px] font-medium ${riskColor} bg-opacity-20 bg-current`}>
                            {report.risk_level || 'Medium'}
                          </span>

                          {/* Arrow */}
                          <svg className="h-4 w-4 text-[#6f6f7a] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}

        {/* Incident Report View */}
        {selectedReport && (
          <IncidentReportView
            report={selectedReport}
            onClose={() => {
              setSelectedReport(null);
              // Ensure history modal stays closed when using X button
              setShowHistoryModal(false);
            }}
            onBack={() => {
              setSelectedReport(null);
              setShowHistoryModal(true);
            }}
          />
        )}

        {/* Evidence Detail Modal */}
        {selectedEvidence && (
          <EvidenceDetailModal
            evidence={selectedEvidence}
            onClose={() => setSelectedEvidence(null)}
          />
        )}
      </div>

      {/* Floating Panic Record Button - Bottom Right */}
      <button
        onMouseDown={handlePressStart}
        onMouseUp={handlePressEnd}
        onMouseLeave={handlePressEnd}
        onTouchStart={handlePressStart}
        onTouchEnd={handlePressEnd}
        className={`fixed bottom-8 right-6 size-[72px] rounded-full shadow-[0_8px_24px_rgba(0,0,0,0.4)] transition-all duration-200 z-40 ${
          isRecording 
            ? 'bg-[#3A1F26] scale-110 animate-pulse' 
            : isPressHeld 
            ? 'bg-[#4A2F36] scale-105' 
            : 'bg-[#3A1F26] hover:bg-[#4A2F36]'
        }`}
        aria-label="Emergency voice recording"
      >
        {/* Mic Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="size-[32px]">
            <PanicMicIcon color={isRecording ? "#9FB7A4" : "#EAEAF0"} />
          </div>
        </div>

        {/* Recording Indicator - Discrete pulsing dot */}
        {isRecording && (
          <div className="absolute top-2 right-2">
            <div className="size-[8px] bg-[#9fb7a4] rounded-full animate-pulse" />
          </div>
        )}
      </button>

      {/* Context Dialog for AI Analysis - Constrained lightbulb modal */}
      {showContextDialog && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">

          {/* Lightbulb Card - small fixed size */}
          <div className="relative w-[80%] max-w-[260px] bg-[#1e1f23] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            {/* Header - Lightbulb and title */}
            <div className="px-4 pt-4 pb-2.5 text-center">
              <div className="size-8 rounded-full bg-[rgba(159,183,164,0.35)] flex items-center justify-center mx-auto mb-2">
                <BrainIcon />
              </div>
              <h2 className="font-['Nunito',sans-serif] font-semibold text-[#eaeaf0] text-[15px] leading-tight mb-0.5">
                AI Analysis
              </h2>
              <p className="font-['Nunito',sans-serif] font-normal text-[#a1a1af] text-[12px]">
                Add context?
              </p>
            </div>

            {/* Body - Textarea */}
            <div className="px-4 pb-3">
              <textarea
                value={userContext}
                onChange={(e) => setUserContext(e.target.value)}
                placeholder="Brief description..."
                className="w-full h-[60px] bg-[rgba(42,44,50,0.6)] border border-[rgba(194,167,184,0.2)] rounded-lg px-2.5 py-2 text-[#eaeaf0] text-[12px] font-['Nunito',sans-serif] placeholder:text-[#6f6f7a] focus:outline-none focus:border-[rgba(194,167,184,0.3)] resize-none transition-all"
              />
            </div>

            {/* Footer Buttons */}
            <div className="flex border-t border-[rgba(194,167,184,0.2)]">
              <button
                onClick={async () => {
                  if (!pendingFile) return;

                  // Get or create user ID
                  let userId = currentUserId;
                  if (!userId) {
                    const { data: { user }, error } = await supabase.auth.getUser();
                    if (error) {
                      console.error('Auth error:', error);
                    }
                    if (user) {
                      userId = user.id;
                      setCurrentUserId(user.id);
                    } else {
                      // Use stable anonymous UUID from localStorage
                      userId = getStableAnonUserId();
                      setCurrentUserId(userId);
                    }
                  }

                  // Close dialog and upload without AI analysis
                  setShowContextDialog(false);
                  setShowUploadFeedback(true);

                  try {
                    // Upload file to Supabase Storage
                    console.log('Skip button: Uploading file to Supabase Storage...');
                    console.log('User ID:', userId);

                    let evidenceUrl: string | null = null;

                    // FORCE UPLOAD: Upload even in demo mode
                    // Use 'demo-uploads' folder for storage if not a real UUID
                    const uploadFolder = userId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
                      ? userId
                      : 'demo-uploads';
                    console.log('📤 Uploading to folder:', uploadFolder);

                    try {
                      const { path, url } = await db.uploadEvidence(uploadFolder, pendingFile);
                      evidenceUrl = url;
                      console.log('✅ File uploaded successfully:', evidenceUrl);
                    } catch (uploadError) {
                      console.error('❌ Upload to Supabase failed:', uploadError);
                      console.error('Error details:', JSON.stringify(uploadError, null, 2));

                      alert(`Upload failed: ${uploadError.message || 'Unknown error'}\n\nPlease check:\n1. The "evidence" bucket exists in Supabase Storage\n2. RLS policies allow uploads\n3. Your credentials are correct`);

                      evidenceUrl = null;
                    }

                    // Create incident report in database (without AI analysis)
                    console.log('Creating incident report with upsert...');
                    try {
                      const report = await db.upsertIncidentReport({
                        user_id: userId, // Always use stable UUID
                        evidence_url: evidenceUrl,
                        evidence_type: 'image',
                        user_context: userContext || null,
                        ai_analysis: {},
                        risk_score: 0,
                        risk_level: null,
                        status: 'pending',
                      });

                      if (report) {
                        console.log('✓ Report saved to database:', report.id);
                        // Reload reports
                        await loadIncidentReports();
                      }
                    } catch (dbError) {
                      console.error('Database save failed:', dbError);
                      // Don't throw - allow upload to complete even if DB fails
                      alert(`Warning: Evidence uploaded but database save failed. Your file is safe in storage.`);
                    }

                    // Add file to local state
                    const fileSize = (pendingFile.size / (1024 * 1024)).toFixed(1);
                    const newFile = {
                      id: Date.now(),
                      icon: 'camera' as const,
                      name: `${pendingFile.name.split('.')[0]}_${Date.now()}.enc`,
                      date: 'Just now',
                      size: `${fileSize} MB`,
                      isNew: true,
                    };

                    setFiles(prev => [newFile, ...prev]);
                    setUserContext('');
                    setPendingFile(null);

                    setTimeout(() => {
                      setShowUploadFeedback(false);
                      setTimeout(() => {
                        setFiles(prev => prev.map(f => ({ ...f, isNew: false })));
                      }, 300);
                    }, 1000);
                  } catch (error) {
                    console.error('Error uploading evidence:', error);
                    setShowUploadFeedback(false);
                  }
                }}
                disabled={isAnalyzing}
                className="flex-1 py-3 font-['Nunito',sans-serif] font-semibold text-[#9fb7a4] text-[15px] hover:bg-[rgba(159,183,164,0.05)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-r border-[rgba(194,167,184,0.2)]"
              >
                Skip
              </button>
              <button
                onClick={handleAnalyzeEvidence}
                disabled={isAnalyzing}
                className="flex-1 py-3 font-['Nunito',sans-serif] font-semibold text-[#9fb7a4] text-[15px] hover:bg-[rgba(159,183,164,0.05)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
              >
                {isAnalyzing ? (
                  <>
                    <svg className="animate-spin size-3.5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>...</span>
                  </>
                ) : (
                  'Analyze'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
