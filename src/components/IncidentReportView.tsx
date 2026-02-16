import { useState } from 'react'
import type { AIAnalysis, IncidentReport as IncidentReportType } from '../lib/supabase'
import { handleExportPDF, copyStatementOnly } from '../utils/generateForensicPDF'

interface IncidentReportViewProps {
  report: IncidentReportType
  onClose: () => void
  onBack?: () => void
}

// Helper components
function AlertIcon() {
  return (
    <svg className="block size-full" fill="none" viewBox="0 0 20 20">
      <path
        d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 12a1 1 0 110-2 1 1 0 010 2zm0-8a1 1 0 011 1v4a1 1 0 11-2 0V7a1 1 0 011-1z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg className="block size-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  )
}

function WarningIcon() {
  return (
    <svg className="block size-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg className="block size-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function DownloadIcon() {
  return (
    <svg className="block size-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l4-4m4 4V4" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg className="block size-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

function ChevronLeftIcon() {
  return (
    <svg className="block size-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  )
}

export function IncidentReportView({ report, onClose, onBack }: IncidentReportViewProps) {
  const [isExporting, setIsExporting] = useState(false)
  const analysis = report.ai_analysis as AIAnalysis

  const riskColors = {
    Low: { bg: 'rgba(159, 183, 164, 0.2)', text: '#9fb7a4', border: '#9fb7a4', bgSolid: 'rgba(159, 183, 164, 0.15)' },
    Medium: { bg: 'rgba(194, 167, 184, 0.2)', text: '#c2a7b8', border: '#c2a7b8', bgSolid: 'rgba(194, 167, 184, 0.15)' },
    High: { bg: 'rgba(214, 180, 184, 0.2)', text: '#d6b4b8', border: '#d6b4b8', bgSolid: 'rgba(214, 180, 184, 0.15)' },
    Critical: { bg: 'rgba(214, 120, 128, 0.2)', text: '#d67880', border: '#d67880', bgSolid: 'rgba(214, 120, 128, 0.15)' },
  }

  const currentRisk = riskColors[report.risk_level || 'Medium']

  // Use the imported handleExportPDF from utils
  // Note: Renaming local handler to avoid naming conflict
  const onExportClick = async () => {
    setIsExporting(true)
    try {
      await handleExportPDF(report)
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setIsExporting(false)
    }
  }

  // Separate function for copy-only (PDRM)
  const onCopyForEReporting = async () => {
    setIsExporting(true)
    try {
      await copyStatementOnly(report)
    } catch (error) {
      console.error('Copy failed:', error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      {/* The Window */}
      <div className="flex flex-col w-full max-w-sm bg-[#1F2937] rounded-2xl border border-gray-700 shadow-2xl max-h-[85vh] overflow-hidden">
        {/* 1. Header (Fixed) */}
        <div className="shrink-0 flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            {/* Back Button (when onBack is provided) */}
            {onBack && (
              <button
                onClick={onBack}
                className="h-8 w-8 rounded-full bg-[rgba(194,167,184,0.1)] flex items-center justify-center hover:bg-[rgba(194,167,184,0.2)] transition-colors shrink-0"
              >
                <div className="h-4 w-4 text-[#eaeaf0]">
                  <ChevronLeftIcon />
                </div>
              </button>
            )}

            {/* Small Icon - h-6 w-6 */}
            <div className="h-6 w-6 rounded-full bg-[rgba(159,183,164,0.15)] flex items-center justify-center shrink-0">
              <div className="h-3.5 w-3.5 text-[#9fb7a4]">
                <ShieldIcon />
              </div>
            </div>

            {/* Title Group */}
            <div className="flex-1 min-w-0">
              <h1 className="font-['Nunito',sans-serif] font-semibold text-[#eaeaf0] text-[15px] leading-tight">
                Incident Report
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                {report.risk_level && (
                  <span
                    className="px-2 py-0.5 rounded-md text-[10px] font-medium"
                    style={{
                      backgroundColor: currentRisk.bgSolid,
                      color: currentRisk.text
                    }}
                  >
                    {report.risk_level} Risk
                  </span>
                )}
                <span className="text-[#9fb7a4] text-[11px]">
                  {report.risk_score}/100
                </span>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-[rgba(194,167,184,0.1)] flex items-center justify-center hover:bg-[rgba(194,167,184,0.2)] transition-colors shrink-0"
          >
            <div className="h-4 w-4">
              <XIcon />
            </div>
          </button>
        </div>

        {/* 2. Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">

          {/* Section: Evidence Analysis */}
          {analysis?.evidence_analysis && (
            <div>
              <h2 className="font-['Nunito',sans-serif] font-semibold text-[#eaeaf0] text-[14px] mb-3">
                Evidence Analysis
              </h2>
              <div className="bg-[rgba(42,44,50,0.3)] rounded-xl p-3 border border-[rgba(194,167,184,0.15)]">
                <h3 className="font-['Nunito',sans-serif] font-medium text-[#a1a1af] text-[12px] mb-2">Visible Findings</h3>
                <ul className="space-y-1.5">
                  {analysis.evidence_analysis.visible_damage?.map((item, idx) => (
                    <li key={idx} className="font-['Nunito',sans-serif] font-normal text-[#eaeaf0] text-[12px] flex items-start gap-2">
                      <span className="text-[#9fb7a4] mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  )) || <li className="font-['Nunito',sans-serif] font-normal text-[#9fb7a4] text-[12px]">Visible indicators documented</li>}
                </ul>
              </div>
            </div>
          )}

          {/* Section: Legal Findings */}
          {analysis?.legal_findings && (
            <div>
              <h2 className="font-['Nunito',sans-serif] font-semibold text-[#eaeaf0] text-[14px] mb-3">
                Legal Findings
              </h2>
              <div className="bg-[rgba(42,44,50,0.3)] rounded-xl p-3 border border-[rgba(194,167,184,0.15)]">
                <div className="flex justify-between items-center py-2 border-b border-gray-800/50 mb-2">
                  <span className="font-['Nunito',sans-serif] font-normal text-[#a1a1af] text-[12px]">Evidence Strength</span>
                  <span className="font-['Nunito',sans-serif] font-semibold text-[#eaeaf0] text-[12px]">{analysis.legal_findings.evidence_strength}</span>
                </div>
                <div>
                  <h3 className="font-['Nunito',sans-serif] font-medium text-[#a1a1af] text-[12px] mb-2">Potential Charges</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.legal_findings.potential_charges.map((charge, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-[rgba(159,183,164,0.1)] border border-[rgba(159,183,164,0.2)] text-[#9fb7a4] text-[11px]"
                      >
                        {charge}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section: Recommended Actions */}
          {analysis?.recommended_actions && (
            <div>
              <h2 className="font-['Nunito',sans-serif] font-semibold text-[#eaeaf0] text-[14px] mb-3">
                Recommended Actions
              </h2>
              <div className="bg-[rgba(42,44,50,0.3)] rounded-xl p-3 border border-[rgba(194,167,184,0.15)]">
                <h3 className="font-['Nunito',sans-serif] font-medium text-[#a1a1af] text-[12px] mb-2">Immediate</h3>
                <ul className="space-y-2">
                  {analysis.recommended_actions.immediate?.map((action, idx) => (
                    <li key={idx} className="font-['Nunito',sans-serif] font-normal text-[#eaeaf0] text-[12px] flex items-start gap-2">
                      <span className="text-[#9fb7a4] shrink-0 mt-0.5 font-semibold">{idx + 1}.</span>
                      <span>{action}</span>
                    </li>
                  )) || (
                    <>
                      <li className="font-['Nunito',sans-serif] font-normal text-[#eaeaf0] text-[12px] flex items-start gap-2">
                        <span className="text-[#9fb7a4] shrink-0 mt-0.5 font-semibold">1.</span>
                        <span>Ensure personal safety</span>
                      </li>
                      <li className="font-['Nunito',sans-serif] font-normal text-[#eaeaf0] text-[12px] flex items-start gap-2">
                        <span className="text-[#9fb7a4] shrink-0 mt-0.5 font-semibold">2.</span>
                        <span>Document all evidence</span>
                      </li>
                      <li className="font-['Nunito',sans-serif] font-normal text-[#eaeaf0] text-[12px] flex items-start gap-2">
                        <span className="text-[#9fb7a4] shrink-0 mt-0.5 font-semibold">3.</span>
                        <span>Contact support services</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          )}

        </div>

        {/* 3. Footer (Fixed) */}
        <div className="shrink-0 p-4 border-t border-gray-800 flex gap-3">
          <button
            onClick={onExportClick}
            disabled={isExporting || report.status !== 'completed'}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#9fb7a4] hover:bg-[#8aa78f] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <div className="h-4 w-4">
              <DownloadIcon />
            </div>
            <span className="font-['Nunito',sans-serif] font-semibold text-[#1e1f23] text-[13px]">
              {isExporting ? 'Generating...' : 'Export PDF'}
            </span>
          </button>
          <button
            onClick={onCopyForEReporting}
            disabled={isExporting}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#003C8D] hover:bg-[#0056B3] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <div className="h-4 w-4">
              <svg className="block h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {/* 👇 换成这个干净的 Path */}
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" 
                />
              </svg>
            </div>
            <span className="font-['Nunito',sans-serif] font-semibold text-white text-[13px]">
              Copy for e-Reporting
            </span>
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl bg-[rgba(194,167,184,0.15)] hover:bg-[rgba(194,167,184,0.25)] border border-[rgba(194,167,184,0.3)] transition-all"
          >
            <span className="font-['Nunito',sans-serif] font-semibold text-[#eaeaf0] text-[13px]">
              Close
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
