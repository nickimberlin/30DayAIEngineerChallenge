import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import type { Proposal, BrandingConfig } from '@/types';

export interface PDFOptions {
  filename?: string;
  quality?: number;
  format?: 'a4' | 'letter';
  margin?: number;
}

const DEFAULT_OPTIONS: PDFOptions = {
  filename: 'proposal.pdf',
  quality: 2,
  format: 'a4',
  margin: 20,
};

export async function generatePDF(
  proposal: Proposal,
  element: HTMLElement,
  options: Partial<PDFOptions> = {}
): Promise<Blob> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const margin = opts.margin ?? 20;

  const canvas = await html2canvas(element, {
    scale: opts.quality,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: opts.format,
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = pdfWidth - (margin * 2);
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = margin;

  pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
  heightLeft -= pdfHeight - (margin * 2);

  while (heightLeft > 0) {
    position = heightLeft - imgHeight + margin;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight - (margin * 2);
  }

  return pdf.output('blob');
}

export function downloadPDF(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function generateAndDownloadPDF(
  proposal: Proposal,
  element: HTMLElement,
  options: Partial<PDFOptions> = {}
): Promise<void> {
  const blob = await generatePDF(proposal, element, options);
  const filename = options.filename || `${proposal.title.replace(/\s+/g, '-').toLowerCase()}-proposal.pdf`;
  downloadPDF(blob, filename);
}

export function createPDFStyles(branding: BrandingConfig): string {
  return `
    .pdf-container {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      color: #0e0f0c;
      background: #ffffff;
      padding: 40px;
    }
    .pdf-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 2px solid ${branding.primaryColor};
    }
    .pdf-title {
      font-size: 32px;
      font-weight: 900;
      color: #0e0f0c;
      margin: 0;
    }
    .pdf-client {
      text-align: right;
    }
    .pdf-client-name {
      font-size: 18px;
      font-weight: 600;
      margin: 0 0 4px 0;
    }
    .pdf-section {
      margin-bottom: 30px;
    }
    .pdf-section-title {
      font-size: 20px;
      font-weight: 700;
      color: ${branding.primaryColor};
      margin: 0 0 12px 0;
      padding-bottom: 8px;
      border-bottom: 1px solid #e8ebe6;
    }
    .pdf-content {
      font-size: 12px;
      line-height: 1.6;
      color: #454745;
    }
    .pdf-pricing-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 16px;
    }
    .pdf-pricing-table th {
      background: ${branding.primaryColor}20;
      padding: 12px;
      text-align: left;
      font-weight: 600;
      font-size: 11px;
      color: #454745;
    }
    .pdf-pricing-table td {
      padding: 12px;
      border-bottom: 1px solid #e8ebe6;
      font-size: 12px;
    }
    .pdf-pricing-table .total-row {
      font-weight: 700;
      font-size: 16px;
      color: ${branding.primaryColor};
    }
    .pdf-footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid ${branding.primaryColor};
      font-size: 10px;
      color: #868685;
      text-align: center;
    }
    .pdf-logo {
      max-width: 150px;
      max-height: 50px;
    }
  `;
}

export function getProposalPreviewHTML(
  proposal: Proposal,
  branding: BrandingConfig
): string {
  const styles = createPDFStyles(branding);

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>${styles}</style>
      </head>
      <body>
        <div class="pdf-container">
          <div class="pdf-header">
            <div>
              <h1 class="pdf-title">${proposal.title}</h1>
              ${branding.companyName ? `<p style="color: #868685; font-size: 14px;">${branding.companyName}</p>` : ''}
            </div>
            <div class="pdf-client">
              <p class="pdf-client-name">${proposal.clientName}</p>
              ${proposal.clientEmail ? `<p style="font-size: 12px; color: #454745;">${proposal.clientEmail}</p>` : ''}
            </div>
          </div>

          ${proposal.sections.map(section => `
            <div class="pdf-section">
              <h2 class="pdf-section-title">${section.title}</h2>
              <div class="pdf-content">${section.content.replace(/\n/g, '<br>')}</div>
            </div>
          `).join('')}

          <div class="pdf-section">
            <h2 class="pdf-section-title">Pricing</h2>
            <table class="pdf-pricing-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th style="text-align: right;">Qty</th>
                  <th style="text-align: right;">Unit Price</th>
                  <th style="text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${proposal.pricing.items.map(item => `
                  <tr>
                    <td>${item.description}</td>
                    <td style="text-align: right;">${item.quantity}</td>
                    <td style="text-align: right;">$${item.unitPrice.toLocaleString()}</td>
                    <td style="text-align: right;">$${item.total.toLocaleString()}</td>
                  </tr>
                `).join('')}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="3" style="text-align: right; font-weight: 600;">Subtotal</td>
                  <td style="text-align: right;">$${proposal.pricing.subtotal.toLocaleString()}</td>
                </tr>
                <tr class="total-row">
                  <td colspan="3" style="text-align: right;">Total</td>
                  <td style="text-align: right;">$${proposal.pricing.total.toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div class="pdf-footer">
            <p>Generated on ${new Date().toLocaleDateString()} | ${branding.companyName || 'Proposal Generator'}</p>
          </div>
        </div>
      </body>
    </html>
  `;
}
