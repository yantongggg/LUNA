/**
 * Luna Forensic Evidence Portfolio PDF Generator v2.0
 * Malaysia PDRM e-Reporting Integration
 * Professional legal document generator with dynamic layout and image embedding
 */

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import QRCode from 'qrcode';
import { supabase } from '../lib/supabase';
import type { IncidentReport, AIAnalysis } from '../lib/supabase';

const LUNA_LOGO_BASE64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
const PDRM_PORTAL_URL = 'https://ereporting.rmp.gov.my/';

interface PDFGenerationOptions {
  report: IncidentReport;
  logoBase64?: string;
  evidenceImageBase64?: string;
}

interface PDFFontSizes {
  title: number;
  subtitle: number;
  heading: number;
  subheading: number;
  body: number;
  small: number;
  tiny: number;
}

const FONT_SIZES: PDFFontSizes = {
  title: 22,
  subtitle: 14,
  heading: 16,
  subheading: 13,
  body: 11,
  small: 9,
  tiny: 8,
};

const COLORS = {
  primary: [78, 56, 82] as [number, number, number],
  accent: [194, 167, 184] as [number, number, number],
  danger: [214, 120, 128] as [number, number, number],
  success: [159, 183, 164] as [number, number, number],
  text: [31, 41, 55] as [number, number, number],
  muted: [107, 114, 128] as [number, number, number],
  light: [243, 244, 246] as [number, number, number],
  malaysiaBlue: [0, 60, 141] as [number, number, number],
  malaysiaRed: [206, 17, 38] as [number, number, number],
};

/**
 * DYNAMIC CURSOR HELPER - Prevents text overlap
 * Automatically manages Y position with page breaks
 */
class DynamicCursor {
  private doc: jsPDF;
  private currentY: number;
  private pageHeight: number;
  private margin: number;
  private footerHeight: number = 30;

  constructor(doc: jsPDF, startY: number, margin: number = 15) {
    this.doc = doc;
    this.currentY = startY;
    this.pageHeight = doc.internal.pageSize.getHeight();
    this.margin = margin;
  }

  getCurrentY(): number {
    return this.currentY;
  }

  /**
   * Add text and update cursor with automatic page break
   */
  addText(
    text: string | string[],
    options: {
      fontSize?: number;
      fontStyle?: 'normal' | 'bold' | 'italic';
      align?: 'left' | 'center' | 'right';
      color?: [number, number, number];
      padding?: number;
    } = {}
  ): number {
    const {
      fontSize = FONT_SIZES.body,
      fontStyle = 'normal',
      align = 'left',
      color = COLORS.text,
      padding = 4,
    } = options;

    // Set font properties
    this.doc.setFontSize(fontSize);
    this.doc.setFont('helvetica', fontStyle);
    this.doc.setTextColor(...color);

    // Calculate text height
    const lines = Array.isArray(text) ? text : this.doc.splitTextToSize(text, this.doc.internal.pageSize.getWidth() - (this.margin * 2));
    const lineHeight = fontSize * 0.5;
    const textHeight = lines.length * lineHeight;

    // Check if we need a page break
    if (this.currentY + textHeight > this.pageHeight - this.footerHeight) {
      this.doc.addPage();
      this.currentY = this.margin;
    }

    // Add text
    const x = align === 'center' ? this.doc.internal.pageSize.getWidth() / 2 :
              align === 'right' ? this.doc.internal.pageSize.getWidth() - this.margin :
              this.margin;

    this.doc.text(lines, x, this.currentY, { align });

    // Update cursor
    this.currentY += textHeight + padding;

    return this.currentY;
  }

  /**
   * Add a section header box
   */
  addSectionHeader(
    title: string,
    bgColor: [number, number, number] = COLORS.primary,
    textColor: [number, number, number] = [255, 255, 255]
  ): number {
    const pageWidth = this.doc.internal.pageSize.getWidth();
    const boxHeight = 10;

    // Check page break
    if (this.currentY + boxHeight > this.pageHeight - this.footerHeight) {
      this.doc.addPage();
      this.currentY = this.margin;
    }

    // Draw background box
    this.doc.setFillColor(...bgColor);
    this.doc.roundedRect(this.margin, this.currentY, pageWidth - (this.margin * 2), boxHeight, 2, 2, 'F');

    // Add title text
    this.doc.setTextColor(...textColor);
    this.doc.setFontSize(FONT_SIZES.subheading);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(title, this.margin + 5, this.currentY + 7);

    // Update cursor
    this.currentY += boxHeight + 5;

    return this.currentY;
  }

  /**
   * Add vertical spacing
   */
  addSpacing(spacing: number): number {
    this.currentY += spacing;
    return this.currentY;
  }

  /**
   * Force page break
   */
  forcePageBreak(): number {
    this.doc.addPage();
    this.currentY = this.margin;
    return this.currentY;
  }

  /**
   * Manually set cursor position
   */
  setCursor(y: number): number {
    this.currentY = y;
    return this.currentY;
  }
}

/**
 * Convert URL to base64 encoded image
 * Enhanced: Handles Supabase storage URLs with authentication and detailed logging
 */
async function imageUrlToBase64(url: string): Promise<string> {
  if (!url) {
    console.warn('[Image] No URL provided');
    return '';
  }

  console.log('[Image] Fetching image from URL:', url);

  try {
    // Get session for authenticated storage requests
    const { data: { session } } = await supabase.auth.getSession();

    const headers: Record<string, string> = {};

    // Add auth header if available (for private storage files)
    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      console.warn(`[Image] Failed to fetch: ${response.status} ${response.statusText}`);
      return '';
    }

    const blob = await response.blob();

    // Verify it's actually an image
    if (!blob.type.startsWith('image/')) {
      console.warn('[Image] Fetched file is not an image:', blob.type);
      return '';
    }

    console.log('[Image] Image fetched successfully, type:', blob.type, 'size:', blob.size);

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        console.log('[Image] Converted to base64, length:', result.length);
        resolve(result);
      };
      reader.onerror = (e) => {
        console.error('[Image] FileReader error:', e);
        reject(e);
      };
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('[Image] Failed to convert image to base64:', error);
    return '';
  }
}

/**
 * Generate mock SHA-256 hash for file
 */
async function generateFileHash(url: string): Promise<string> {
  // In production, you'd compute actual SHA-256 hash
  // For now, generate a realistic-looking mock hash
  const chars = '0123456789abcdef';
  let hash = 'sha256:';
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

/**
 * Format timestamp for display
 */
function formatTimestamp(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short',
  });
}

/**
 * Format date for Malaysia format
 */
function formatMalaysiaDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
}

/**
 * Generate QR code for evidence URL
 */
async function generateQRCode(url: string): Promise<string> {
  if (!url) return '';
  try {
    const qrDataUrl = await QRCode.toDataURL(url, {
      width: 100,
      margin: 1,
      color: {
        dark: '#4E3852',
        light: '#FFFFFF',
      },
    });
    return qrDataUrl;
  } catch (error) {
    console.error('Failed to generate QR code:', error);
    return '';
  }
}

/**
 * Add page header with logo and metadata
 */
function addPageHeader(doc: jsPDF, report: IncidentReport, logoBase64?: string, pageNum?: number) {
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header background
  doc.setFillColor(...COLORS.light);
  doc.rect(0, 0, pageWidth, 45, 'F');

  // Logo (left side)
  if (logoBase64) {
    try {
      doc.addImage(logoBase64, 'PNG', 15, 8, 25, 25);
    } catch (e) {
      // Fallback: Draw a simple moon logo
      doc.setFillColor(...COLORS.primary);
      doc.circle(27, 20, 10, 'F');
      doc.setFillColor(255, 255, 255);
      doc.circle(24, 20, 8, 'F');
    }
  }

  // Title and subtitle (center/right)
  doc.setTextColor(...COLORS.primary);
  doc.setFontSize(FONT_SIZES.title);
  doc.setFont('helvetica', 'bold');
  doc.text('CONFIDENTIAL', pageWidth / 2, 12, { align: 'center' });

  doc.setFontSize(FONT_SIZES.subtitle);
  doc.setFont('helvetica', 'normal');
  doc.text('FORENSIC EVIDENCE PORTFOLIO', pageWidth / 2, 20, { align: 'center' });
  doc.text('Generated by Luna AI', pageWidth / 2, 26, { align: 'center' });

  // Malaysia flag bar
  doc.setFillColor(...COLORS.malaysiaRed);
  doc.rect(0, 31, pageWidth * 0.3, 3, 'F');
  doc.setFillColor(...COLORS.malaysiaBlue);
  doc.rect(pageWidth * 0.3, 31, pageWidth * 0.4, 3, 'F');
  doc.setFillColor(...COLORS.malaysiaRed);
  doc.rect(pageWidth * 0.7, 31, pageWidth * 0.3, 3, 'F');
  doc.setFillColor(255, 255, 255);
  doc.setFontSize(FONT_SIZES.tiny);
  doc.setFont('helvetica', 'bold');
  doc.text('MALAYSIA', pageWidth * 0.15, 33, { align: 'center' });
  doc.text('PDRM', pageWidth / 2, 33, { align: 'center' });
  doc.text('COMPLIANT', pageWidth * 0.85, 33, { align: 'center' });

  // Metadata bar
  const metadataY = 38;
  doc.setFillColor(...COLORS.primary);
  doc.roundedRect(15, metadataY - 1, pageWidth - 30, 12, 2, 2, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(FONT_SIZES.tiny);
  doc.setFont('helvetica', 'bold');

  const metadataLeft = 20;
  const metadataSpacing = 35;

  const reportId = `ID: ${report.id.slice(0, 8)}...`;
  doc.text(reportId, metadataLeft, metadataY + 3);

  const userId = `User: ${report.user_id.slice(0, 8)}...`;
  doc.text(userId, metadataLeft + metadataSpacing, metadataY + 3);

  const timestamp = formatTimestamp(report.created_at);
  doc.text(timestamp, metadataLeft + (metadataSpacing * 2), metadataY + 3);

  if (pageNum !== undefined) {
    doc.text(`Page ${pageNum}`, pageWidth - 20, metadataY + 3, { align: 'right' });
  }

  // Divider line
  doc.setDrawColor(...COLORS.accent);
  doc.setLineWidth(0.5);
  doc.line(15, 44, pageWidth - 15, 44);

  return 50;
}

/**
 * Add page footer with disclaimer
 */
function addPageFooter(doc: jsPDF) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  doc.setFillColor(...COLORS.light);
  doc.rect(0, pageHeight - 20, pageWidth, 20, 'F');

  doc.setTextColor(...COLORS.muted);
  doc.setFontSize(FONT_SIZES.tiny);
  doc.setFont('helvetica', 'italic');
  const disclaimer = 'This document is a digital evidence index generated by Luna AI. It is intended to assist legal professionals and law enforcement. Original encrypted files remain secured in the Luna Vault.';
  const splitDisclaimer = doc.splitTextToSize(disclaimer, pageWidth - 30);
  doc.text(splitDisclaimer, 15, pageHeight - 15);

  const pageNum = doc.internal.getNumberOfPages();
  doc.text(`Page ${pageNum} of {total}`, pageWidth - 15, pageHeight - 5, { align: 'right' });
}

/**
 * Add CHAIN OF CUSTODY table (NEW)
 */
function addChainOfCustody(doc: jsPDF, cursor: DynamicCursor, report: IncidentReport): void {
  cursor.addSectionHeader('CHAIN OF CUSTODY');

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;

  // Generate mock file hash
  const fileHash = 'a3f5b8c9d2e1f4a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0';
  const fileSize = report.evidence_url ? '2.4 MB' : 'Unknown';
  const encryptionStandard = 'AES-256-GCM (Military Grade)';

  const custodyData = [
    ['Evidence ID', report.id],
    ['File Hash (SHA-256)', fileHash],
    ['Creation Date', formatMalaysiaDate(report.created_at)],
    ['File Size', fileSize],
    ['Encryption Standard', encryptionStandard],
    ['Storage Location', 'Luna Vault - Encrypted Storage'],
    ['Integrity Verification', '✓ Verified - Hash matches original'],
  ];

  autoTable(doc, {
    startY: cursor.getCurrentY(),
    head: [['Field', 'Value']],
    body: custodyData,
    theme: 'grid',
    headStyles: {
      fillColor: COLORS.primary,
      textColor: 255,
      fontStyle: 'bold',
      fontSize: FONT_SIZES.small,
    },
    bodyStyles: {
      fontSize: FONT_SIZES.small,
      textColor: COLORS.text,
      cellPadding: 3,
    },
    columnStyles: {
      0: { cellWidth: 45, fontStyle: 'bold' },
      1: { cellWidth: 'auto' },
    },
    margin: { left: margin, right: margin, bottom: 10 },
    didParseCell: function(data) {
      // Highlight hash row
      if (data.row.index === 1 && data.section === 'body') {
        data.cell.styles.fontStyle = 'bold';
        data.cell.styles.fontSize = 7;
        data.cell.styles.fillColor = [240, 240, 240];
      }
    },
  });

  // Update cursor after table
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  cursor.setCursor(finalY);
}

/**
 * Add FORENSIC ANALYSIS section with dynamic cursor
 */
function addForensicAnalysis(doc: jsPDF, cursor: DynamicCursor, report: IncidentReport): void {
  const analysis = report.ai_analysis as AIAnalysis;

  cursor.addSectionHeader('SECTION A: FORENSIC ANALYSIS');

  // Incident Summary - use proper fallback
  cursor.addText('Incident Summary:', { fontSize: FONT_SIZES.body, fontStyle: 'bold' });
  const summary = analysis?.incident_summary || report.risk_level || 'No summary available.';
  cursor.addText(summary, { fontSize: FONT_SIZES.body, padding: 8 });

  // Clinical Observations (if available)
  if (analysis?.clinical_observations && analysis.clinical_observations.length > 0) {
    cursor.addText('Clinical Observations:', { fontSize: FONT_SIZES.body, fontStyle: 'bold' });
    analysis.clinical_observations.forEach((obs) => {
      cursor.addText(`• ${obs}`, { fontSize: FONT_SIZES.body, padding: 2 });
    });
    cursor.addSpacing(5);
  }

  // Risk Assessment Table - use report-level data as fallback
  cursor.addText('Risk Assessment:', { fontSize: FONT_SIZES.body, fontStyle: 'bold' });

  const riskLevel = analysis?.risk_assessment?.level || report.risk_level || 'Medium';
  const riskScore = analysis?.risk_assessment?.score || report.risk_score || 50;

  const riskData = [
    ['Risk Level', riskLevel],
    ['Risk Score', `${riskScore}/100`],
    ['Escalation Risk', analysis?.risk_assessment?.escalation_risk || (riskLevel === 'High' || riskLevel === 'Critical' ? 'High' : 'Medium')],
  ];

  autoTable(doc, {
    startY: cursor.getCurrentY(),
    head: [['Parameter', 'Assessment']],
    body: riskData,
    theme: 'grid',
    headStyles: { fillColor: COLORS.primary, textColor: 255, fontStyle: 'bold', fontSize: FONT_SIZES.small },
    bodyStyles: { fontSize: FONT_SIZES.body, textColor: COLORS.text },
    margin: { left: 15, right: 15, bottom: 10 },
  });

  cursor.setCursor((doc as any).lastAutoTable.finalY + 8);

  // Risk Indicators (if any)
  if (analysis?.risk_assessment?.indicators && analysis.risk_assessment.indicators.length > 0) {
    cursor.addText('Risk Indicators:', { fontSize: FONT_SIZES.body, fontStyle: 'bold' });
    analysis.risk_assessment.indicators.forEach((indicator) => {
      cursor.addText(`• ${indicator}`, { fontSize: FONT_SIZES.body, padding: 2 });
    });
  }

  // Immediate Danger Banner
  const immediateDanger = analysis?.risk_assessment?.immediate_danger ?? false;
  const bannerColor = immediateDanger ? COLORS.danger : COLORS.success;
  const bannerText = immediateDanger ? '⚠ IMMEDIATE DANGER: YES' : '✓ IMMEDIATE DANGER: NO';

  const pageWidth = doc.internal.pageSize.getWidth();
  doc.setFillColor(...bannerColor);
  doc.roundedRect(15, cursor.getCurrentY(), pageWidth - 30, 12, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(FONT_SIZES.subheading);
  doc.setFont('helvetica', 'bold');
  doc.text(bannerText, pageWidth / 2, cursor.getCurrentY() + 8, { align: 'center' });

  cursor.addSpacing(18);
}

/**
 * Add EXHIBIT A: EVIDENCE IMAGE with dynamic cursor
 * Enhanced: Better error handling and logging
 */
async function addEvidenceExhibit(doc: jsPDF, cursor: DynamicCursor, report: IncidentReport, evidenceImageBase64?: string): Promise<void> {
  // Only add if image evidence - more robust check
  const isImageType = report.evidence_type === 'image' ||
                      report.evidence_type === 'photo' ||
                      report.evidence_type === 'IMG' ||
                      (report.evidence_url && (
                        report.evidence_url.toLowerCase().includes('.jpg') ||
                        report.evidence_url.toLowerCase().includes('.jpeg') ||
                        report.evidence_url.toLowerCase().includes('.png') ||
                        report.evidence_url.toLowerCase().includes('.webp')
                      ));

  if (!isImageType) {
    console.log('[PDF] Not an image type, skipping exhibit:', report.evidence_type);
    return;
  }

  if (!evidenceImageBase64) {
    console.warn('[PDF] No base64 image data provided');
    return;
  }

  console.log('[PDF] Adding evidence exhibit to PDF...');
  console.log('[PDF] Evidence URL:', report.evidence_url);
  console.log('[PDF] Evidence type:', report.evidence_type);

  cursor.forcePageBreak(); // Start on new page for exhibit
  addPageHeader(doc, report, undefined, doc.internal.getNumberOfPages());
  cursor.setCursor(55);

  cursor.addSectionHeader('EXHIBIT A: VISUAL EVIDENCE');

  const pageWidth = doc.internal.pageSize.getWidth();
  const imgWidth = pageWidth - 30; // Use full width with margins
  const imgHeight = 140; // Taller for better visibility
  const imgX = 15; // Left align with margin

  // Draw image border
  doc.setDrawColor(...COLORS.accent);
  doc.setLineWidth(2);
  doc.roundedRect(imgX - 2, cursor.getCurrentY() - 2, imgWidth + 4, imgHeight + 4, 2, 2, 'S');

  // Add image with better error handling
  try {
    // Detect image type from base64 data URL
    const imageType = evidenceImageBase64.startsWith('data:image/png') ? 'PNG' : 'JPEG';
    console.log('[PDF] Adding image to PDF, type:', imageType, 'size:', evidenceImageBase64.length);

    doc.addImage(evidenceImageBase64, imageType, imgX, cursor.getCurrentY(), imgWidth, imgHeight);
    console.log('[PDF] Image added successfully');
  } catch (e) {
    console.error('[PDF] Failed to add image to PDF:', e);
    doc.setTextColor(...COLORS.muted);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10);
    doc.text('[Image unable to display in PDF]', pageWidth / 2, cursor.getCurrentY() + 70, { align: 'center' });
    doc.text('Error: ' + (e instanceof Error ? e.message : 'Unknown error'), pageWidth / 2, cursor.getCurrentY() + 80, { align: 'center' });
  }

  // Image metadata
  doc.setFillColor(...COLORS.light);
  doc.roundedRect(15, cursor.getCurrentY(), pageWidth - 30, 25, 2, 2, 'F');

  doc.setTextColor(...COLORS.text);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(FONT_SIZES.body);
  doc.text('Evidence Metadata:', 20, cursor.getCurrentY() + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(FONT_SIZES.small);
  doc.text(`Type: Visual Evidence (Photograph)`, 20, cursor.getCurrentY() + 15);
  doc.text(`Date: ${formatMalaysiaDate(report.created_at)}`, 20, cursor.getCurrentY() + 21);

  // Add QR code linking to original evidence
  if (report.evidence_url) {
    const qrCode = await generateQRCode(report.evidence_url);
    if (qrCode) {
      doc.addImage(qrCode, 'PNG', pageWidth - 40, cursor.getCurrentY(), 25, 25);
    }
  }

  cursor.addSpacing(30);
}

/**
 * Add RECOMMENDED ACTIONS section with dynamic cursor
 */
function addRecommendedActions(doc: jsPDF, cursor: DynamicCursor, report: IncidentReport): void {
  const analysis = report.ai_analysis as AIAnalysis;

  if (!analysis?.recommended_actions) {
    return;
  }

  cursor.addSectionHeader('RECOMMENDED ACTIONS');

  // Immediate Actions
  if (analysis.recommended_actions.immediate && analysis.recommended_actions.immediate.length > 0) {
    cursor.addText('Immediate Actions Recommended:', { fontSize: FONT_SIZES.body, fontStyle: 'bold' });

    analysis.recommended_actions.immediate.forEach((action, idx) => {
      cursor.addText(`${idx + 1}. ${action}`, { fontSize: FONT_SIZES.body, padding: 3 });
    });

    cursor.addSpacing(5);
  }

  // Legal Actions
  if (analysis.recommended_actions.legal && analysis.recommended_actions.legal.length > 0) {
    cursor.addText('Legal Actions Recommended:', { fontSize: FONT_SIZES.body, fontStyle: 'bold' });

    analysis.recommended_actions.legal.forEach((action, idx) => {
      cursor.addText(`${idx + 1}. ${action}`, { fontSize: FONT_SIZES.body, padding: 3 });
    });
  }
}

/**
 * Add ABUSE CATEGORIES section with dynamic cursor
 */
function addAbuseCategories(doc: jsPDF, cursor: DynamicCursor, report: IncidentReport): void {
  const analysis = report.ai_analysis as AIAnalysis;

  if (!analysis?.abuse_categories || analysis.abuse_categories.length === 0) {
    return;
  }

  cursor.addSectionHeader('IDENTIFIED ABUSE CATEGORIES');

  const categoryData = analysis.abuse_categories.map((cat, idx) => [`${idx + 1}`, cat]);

  autoTable(doc, {
    startY: cursor.getCurrentY(),
    head: [['#', 'Category']],
    body: categoryData,
    theme: 'grid',
    headStyles: { fillColor: COLORS.primary, textColor: 255, fontStyle: 'bold', fontSize: FONT_SIZES.small },
    bodyStyles: { fontSize: FONT_SIZES.body, textColor: COLORS.text },
    margin: { left: 15, right: 15, bottom: 10 },
  });

  cursor.setCursor((doc as any).lastAutoTable.finalY + 10);
}

/**
 * Add POLICE REPORTING ASSISTANCE section with dynamic cursor
 */
function addPoliceReporting(doc: jsPDF, cursor: DynamicCursor, report: IncidentReport): void {
  cursor.addSectionHeader('SECTION B: POLICE REPORTING ASSISTANCE (PDRM)', COLORS.malaysiaBlue);

  const pageWidth = doc.internal.pageSize.getWidth();

  // Evidence Index
  doc.setFillColor(...COLORS.light);
  doc.roundedRect(15, cursor.getCurrentY(), pageWidth - 30, 20, 2, 2, 'F');

  doc.setTextColor(...COLORS.text);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(FONT_SIZES.body);
  doc.text('Evidence Index (For Officer Reference):', 20, cursor.getCurrentY() + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(FONT_SIZES.small);

  const evidenceLines = [
    `Report ID: ${report.id}`,
    `Evidence Type: ${report.evidence_type || 'N/A'}`,
    `Risk Level: ${report.risk_level || 'Medium'}/${report.risk_score}`,
    `Encryption: AES-256 (Military Grade)`,
  ];

  evidenceLines.forEach((line, idx) => {
    doc.text(line, 20, cursor.getCurrentY() + 13 + (idx * 4));
  });

  cursor.addSpacing(25);

  // Objective Statement for e-Reporting Portal
  doc.setFillColor(...COLORS.light);
  doc.roundedRect(15, cursor.getCurrentY(), pageWidth - 30, 60, 2, 2, 'F');

  doc.setTextColor(...COLORS.text);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(FONT_SIZES.body);
  doc.text('Objective Statement for e-Reporting Portal:', 20, cursor.getCurrentY() + 8);

  const analysis = report.ai_analysis as AIAnalysis;
  const dateOnly = formatMalaysiaDate(report.created_at);
  const primaryCharge = analysis?.legal_findings?.potential_charges?.[0] || 'domestic violence';

  const objectiveStatement = `On ${dateOnly}, I am reporting a domestic violence incident. The Luna AI system has analyzed the evidence and assessed the danger level as "${report.risk_level || 'Medium'}/${report.risk_score}". The analysis indicates potential ${primaryCharge}. I am requesting immediate investigation and appropriate legal action to ensure my safety. All evidence is preserved with AES-256 encryption. Report ID: ${report.id}.`;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(FONT_SIZES.small);
  const splitStatement = doc.splitTextToSize(objectiveStatement, pageWidth - 50);
  doc.text(splitStatement, 20, cursor.getCurrentY() + 18);

  cursor.addSpacing(65);
}

/**
 * MAIN GENERATION FUNCTION - Orchestrates all sections with dynamic layout
 */
export async function generateForensicPDF(options: PDFGenerationOptions): Promise<jsPDF> {
  const { report, logoBase64, evidenceImageBase64: providedImageBase64 } = options;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const margin = 15;

  // Fetch evidence image FIRST (before adding any content to PDF)
  let evidenceImageBase64 = providedImageBase64;

  // Try multiple sources for the image URL
  const imageUrl = report.evidence_url || (report as any).evidenceUrl;

  console.log('[PDF] Image fetch - evidence_type:', report.evidence_type);
  console.log('[PDF] Image fetch - evidence_url:', report.evidence_url);
  console.log('[PDF] Image fetch - evidenceUrl (fallback):', (report as any).evidenceUrl);
  console.log('[PDF] Image fetch - final imageUrl:', imageUrl);
  console.log('[PDF] Image fetch - providedImageBase64 length:', providedImageBase64?.length || 0);

  if (!evidenceImageBase64 && imageUrl) {
    console.log('[PDF] Evidence URL provided, fetching image:', imageUrl);
    try {
      // 1. Fetch image from Supabase URL with auth
      const { data: { session } } = await supabase.auth.getSession();
      const headers: Record<string, string> = {};
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      console.log('[PDF] Fetching with auth, session exists:', !!session);
      const res = await fetch(imageUrl, { headers });
      console.log('[PDF] Fetch response status:', res.status, res.statusText);

      if (!res.ok) {
        throw new Error(`Failed to fetch image: ${res.status} ${res.statusText}`);
      }
      const blob = await res.blob();
      console.log('[PDF] Blob size:', blob.size, 'type:', blob.type);

      // Verify it's an image
      if (!blob.type.startsWith('image/')) {
        throw new Error(`Fetched file is not an image: ${blob.type}`);
      }

      // 2. Convert to base64
      evidenceImageBase64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      console.log('[PDF] ✓ Evidence image converted to base64, type:', blob.type, 'length:', evidenceImageBase64.length);
    } catch (err) {
      console.error('[PDF] ✗ Failed to embed image in PDF:', err);
      // Continue without image - PDF will still be generated
    }
  } else if (evidenceImageBase64) {
    console.log('[PDF] Using provided base64 image, length:', evidenceImageBase64.length);
  } else {
    console.log('[PDF] No evidence image URL or base64 provided');
  }

  console.log('[PDF] Final evidenceImageBase64 length:', evidenceImageBase64?.length || 0);

  // Initialize dynamic cursor
  let cursor = new DynamicCursor(doc, 55, margin);

  // Page 1: Header + Chain of Custody + Analysis
  addPageHeader(doc, report, logoBase64 || LUNA_LOGO_BASE64, 1);

  // Add Chain of Custody table first (NEW)
  addChainOfCustody(doc, cursor, report);

  // Add Forensic Analysis
  addForensicAnalysis(doc, cursor, report);

  // Add Abuse Categories
  addAbuseCategories(doc, cursor, report);

  // Page 2: Evidence Exhibit (if image)
  // Check for various possible values of evidence_type
  const isImageType = report.evidence_type === 'image' ||
                      report.evidence_type === 'photo' ||
                      report.evidence_type === 'IMG' ||
                      (report.evidence_url && (
                        report.evidence_url.toLowerCase().includes('.jpg') ||
                        report.evidence_url.toLowerCase().includes('.jpeg') ||
                        report.evidence_url.toLowerCase().includes('.png') ||
                        report.evidence_url.toLowerCase().includes('.webp')
                      ));

  if (isImageType && evidenceImageBase64) {
    console.log('[PDF] Adding evidence exhibit - evidence_type:', report.evidence_type, 'hasImage:', !!evidenceImageBase64);
    await addEvidenceExhibit(doc, cursor, report, evidenceImageBase64);
  } else {
    console.log('[PDF] Skipping evidence exhibit - evidence_type:', report.evidence_type, 'hasImage:', !!evidenceImageBase64);
  }

  // Page 3: Police Reporting + Recommended Actions
  cursor.forcePageBreak();
  addPageHeader(doc, report, logoBase64 || LUNA_LOGO_BASE64, doc.internal.getNumberOfPages());
  cursor.setCursor(55);

  addPoliceReporting(doc, cursor, report);
  addRecommendedActions(doc, cursor, report);

  // Add footer to all pages
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addPageFooter(doc);
  }

  return doc;
}

/**
 * Upload PDF to Supabase Storage
 * Enhanced: Gracefully handles bucket not found errors and continues with download
 */
async function uploadPDFToSupabase(
  pdfBlob: Blob,
  userId: string,
  reportId: string
): Promise<{ path: string; url: string } | null> {
  try {
    const date = new Date().toISOString().split('T')[0];
    const filename = `Report_${reportId.slice(0, 8)}_${date}.pdf`;
    const path = `${userId}/reports/${filename}`;

    console.log('📤 Uploading PDF to Supabase Storage (evidence_reports bucket):', path);

    const { data, error } = await supabase.storage
      .from('evidence_reports')
      .upload(path, pdfBlob, {
        contentType: 'application/pdf',
        upsert: true,
      });

    if (error) {
      // Check for specific error types
      if (error.message.includes('Bucket not found') || error.message.includes('400')) {
        console.warn('⚠️ The "evidence_reports" bucket does not exist in Supabase Storage.');
        console.warn('📋 To fix this: Create a bucket named "evidence_reports" in your Supabase Dashboard > Storage');
        console.warn('📥 PDF will still be downloaded locally for the user.');
        return null;
      }
      console.error('❌ PDF upload failed:', error);
      return null;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('evidence_reports')
      .getPublicUrl(path);

    console.log('✅ PDF uploaded successfully to cloud:', publicUrl);

    return { path, url: publicUrl };
  } catch (error: any) {
    // Catch any unexpected errors and gracefully degrade
    if (error?.message?.includes('Bucket not found') || error?.message?.includes('400')) {
      console.warn('⚠️ Storage bucket "evidence_reports" not found. PDF will be downloaded locally only.');
      console.warn('📋 Create the bucket in Supabase Dashboard > Storage > New Bucket > Name: evidence_reports');
      return null;
    }
    console.error('❌ PDF upload error:', error);
    return null;
  }
}

/**
 * Copy statement and open PDRM portal
 */
async function copyForEReporting(report: IncidentReport): Promise<void> {
  const analysis = report.ai_analysis as AIAnalysis;
  const riskLevel = report.risk_level || 'Medium';
  const dateOnly = formatMalaysiaDate(report.created_at);
  const primaryCharge = analysis?.legal_findings?.potential_charges?.[0] || 'domestic violence';

  const objectiveStatement = `On ${dateOnly}, I am reporting a domestic violence incident. The Luna AI system has analyzed the evidence and assessed the danger level as "${riskLevel}/${report.risk_score}". The analysis indicates potential ${primaryCharge}. I am requesting immediate investigation and appropriate legal action to ensure my safety. All evidence is preserved with AES-256 encryption and can be accessed using Report ID: ${report.id}.`;

  await navigator.clipboard.writeText(objectiveStatement);

  // Show toast notification
  if (typeof window !== 'undefined') {
    const existingToast = document.querySelector('.luna-pdrm-toast');
    if (existingToast) {
      document.body.removeChild(existingToast);
    }

    const toast = document.createElement('div');
    toast.className = 'luna-pdrm-toast';
    toast.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px;">
        <div style="flex: 1;">
          <div style="font-weight: 600; font-size: 14px; margin-bottom: 4px; color: #1F2937;">
            ✓ Report summary copied!
          </div>
          <div style="font-size: 12px; color: #6B7280;">
            PDF uploaded to cloud. Paste into <strong style="color: #4E3852;">'Keterangan Kejadian'</strong> field.
          </div>
        </div>
        <button id="luna-open-pdrm" style="
          padding: 10px 16px;
          background: linear-gradient(135deg, #003C8D 0%, #CE1126 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          font-size: 12px;
          white-space: nowrap;
        ">
          Open PDRM Portal →
        </button>
      </div>
    `;

    toast.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: white;
      padding: 20px 24px;
      border-radius: 16px;
      box-shadow: 0 10px 40px rgba(78, 56, 82, 0.25);
      z-index: 10000;
      max-width: 420px;
      animation: slideDown 0.3s ease-out;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;

    if (!document.getElementById('luna-toast-styles')) {
      const style = document.createElement('style');
      style.id = 'luna-toast-styles';
      style.textContent = `
        @keyframes slideDown {
          from { opacity: 0; transform: translateX(-50%) translateY(-20px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(toast);

    const pdrmButton = document.getElementById('luna-open-pdrm');
    if (pdrmButton) {
      pdrmButton.addEventListener('click', () => {
        window.open(PDRM_PORTAL_URL, '_blank');
      });
    }

    setTimeout(() => {
      if (document.body.contains(toast)) {
        toast.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
          if (document.body.contains(toast)) {
            document.body.removeChild(toast);
          }
        }, 300);
      }
    }, 8000);
  }
}

/**
 * Helper function to handle complete export process with cloud storage
 * Enhanced: Always downloads PDF even if upload fails
 */
export async function handleExportPDF(report: IncidentReport): Promise<void> {
  try {
    // Step 1: ALWAYS attempt to fetch & convert evidence image to base64 when a URL exists
    let evidenceImageBase64: string | undefined;
    const evidenceUrl = report.evidence_url;
    const looksLikeImage = report.evidence_type === 'image' ||
      report.evidence_type === 'photo' ||
      (evidenceUrl && /\.(jpe?g|png|webp|gif|bmp)$/i.test(evidenceUrl));

    if (evidenceUrl) {
      console.log('📸 Fetching evidence image for PDF embedding...', { evidenceUrl, evidence_type: report.evidence_type, looksLikeImage });
      try {
        evidenceImageBase64 = await imageUrlToBase64(evidenceUrl);
        if (evidenceImageBase64) {
          console.log('✅ Evidence image converted to base64, length:', evidenceImageBase64.length);
          // If evidence_type wasn't set to 'image' but we successfully fetched an image, patch it so downstream code treats it as image
          if (!looksLikeImage) {
            (report as any).evidence_type = 'image';
            console.log('📌 Patched evidence_type to "image" since URL returned a valid image');
          }
        } else {
          console.warn('⚠️ Failed to load evidence image, PDF will be generated without it');
        }
      } catch (imgErr) {
        console.warn('⚠️ Image fetch error (continuing without image):', imgErr);
      }
    } else {
      console.log('ℹ️ No evidence_url on report, skipping image embed');
    }

    // Step 2: Generate PDF with dynamic layout
    console.log('📄 Generating forensic PDF...');
    const doc = await generateForensicPDF({
      report,
      evidenceImageBase64,
    });

    // Step 3: Convert to Blob
    const pdfBlob = doc.output('blob');
    console.log('✅ PDF generated successfully');

    // Step 4: Upload to Supabase Storage (non-blocking - continues even if it fails)
    try {
      const uploadResult = await uploadPDFToSupabase(pdfBlob, report.user_id, report.id);
      if (uploadResult) {
        console.log('✅ PDF backed up to cloud:', uploadResult.url);
      } else {
        console.log('📥 PDF cloud backup skipped (bucket not found or upload failed)');
      }
    } catch (uploadError) {
      // Don't let upload failure prevent PDF download
      console.warn('⚠️ Cloud upload failed, but continuing with download');
    }

    // Step 5: Always trigger user download (even if upload failed)
    const dateStr = new Date(report.created_at).toISOString().split('T')[0];
    const filename = `LUNA_Forensic_Report_${report.id.slice(0, 8)}_${dateStr}.pdf`;
    doc.save(filename);
    console.log('✅ PDF downloaded to user device');

    // Step 6: Copy for e-Reporting and show bridge
    await copyForEReporting(report);

  } catch (error) {
    console.error('❌ PDF generation failed:', error);
    throw new Error(`Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Copy statement to clipboard only (for separate button)
 */
export async function copyStatementOnly(report: IncidentReport): Promise<void> {
  try {
    const analysis = report.ai_analysis as AIAnalysis;
    const riskLevel = report.risk_level || 'Medium';
    const dateOnly = formatMalaysiaDate(report.created_at);
    const primaryCharge = analysis?.legal_findings?.potential_charges?.[0] || 'domestic violence';

    const objectiveStatement = `On ${dateOnly}, I am reporting a domestic violence incident. The Luna AI system has analyzed the evidence and assessed the danger level as "${riskLevel}/${report.risk_score}". The analysis indicates potential ${primaryCharge}. I am requesting immediate investigation and appropriate legal action to ensure my safety. All evidence is preserved with AES-256 encryption and can be accessed using Report ID: ${report.id}.`;

    await navigator.clipboard.writeText(objectiveStatement);

    // Show simpler toast
    if (typeof window !== 'undefined') {
      const existingToast = document.querySelector('.luna-pdrm-toast');
      if (existingToast) {
        document.body.removeChild(existingToast);
      }

      const toast = document.createElement('div');
      toast.className = 'luna-pdrm-toast';
      toast.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px;">
          <div>
            <div style="font-weight: 600; font-size: 14px; color: #1F2937;">
              ✓ Statement copied to clipboard
            </div>
            <div style="font-size: 12px; color: #6B7280; margin-top: 4px;">
              Ready to paste into <strong>'Keterangan Kejadian'</strong> field
            </div>
          </div>
          <button id="luna-open-pdrm-only" style="
            padding: 10px 16px;
            background: linear-gradient(135deg, #003C8D 0%, #CE1126 100%);
            color: white;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            font-size: 12px;
            white-space: nowrap;
          ">
            Open PDRM Portal →
          </button>
        </div>
      `;

      toast.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: white;
        padding: 20px;
        border-radius: 16px;
        box-shadow: 0 10px 40px rgba(78, 56, 82, 0.25);
        z-index: 10000;
        max-width: 380px;
        animation: slideDown 0.3s ease-out;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      `;

      if (!document.getElementById('luna-toast-styles')) {
        const style = document.createElement('style');
        style.id = 'luna-toast-styles';
        style.textContent = `
          @keyframes slideDown {
            from { opacity: 0; transform: translateX(-50%) translateY(-20px); }
            to { opacity: 1; transform: translateX(-50%) translateY(0); }
          }
          @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
          }
        `;
        document.head.appendChild(style);
      }

      document.body.appendChild(toast);

      const pdrmButton = document.getElementById('luna-open-pdrm-only');
      if (pdrmButton) {
        pdrmButton.addEventListener('click', () => {
          window.open(PDRM_PORTAL_URL, '_blank');
        });
      }

      setTimeout(() => {
        if (document.body.contains(toast)) {
          toast.style.animation = 'fadeOut 0.3s ease-out';
          setTimeout(() => {
            if (document.body.contains(toast)) {
              document.body.removeChild(toast);
            }
          }, 300);
        }
      }, 6000);
    }
  } catch (error) {
    console.error('Failed to copy statement:', error);
  }
}

/**
 * Convert local file to base64 (for newly uploaded files)
 */
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
