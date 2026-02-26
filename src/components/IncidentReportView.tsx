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
    <div className="absolute inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Simplified Card (Natural Height) */}
      <div className="relative z-10 w-full max-w-sm bg-[#1F2937] border border-gray-700 rounded-2xl shadow-2xl p-6 flex flex-col gap-5">

        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold text-white">Incident Report</h2>
            {report.risk_level && (
              <span
                className="text-xs px-2 py-1 rounded-full w-fit font-medium"
                style={{
                  backgroundColor: currentRisk.bg,
                  color: currentRisk.text,
                }}
              >
                {report.risk_level} Risk · {report.risk_score}/100
              </span>
            )}
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white transition-colors">
            <div className="h-5 w-5"><XIcon /></div>
          </button>
        </div>

        {/* Summary Text (Allows natural wrapping) */}
        {analysis?.incident_summary && (
          <div className="text-sm text-gray-300 leading-relaxed">
            {analysis.incident_summary}
          </div>
        )}

        {/* Footer Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={onExportClick}
            disabled={isExporting || report.status !== 'completed'}
            className="flex-1 bg-[#9FB7A4] text-black font-medium py-2.5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isExporting ? 'Generating...' : 'Export PDF'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-700 text-white font-medium py-2.5 rounded-xl hover:bg-gray-600 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
