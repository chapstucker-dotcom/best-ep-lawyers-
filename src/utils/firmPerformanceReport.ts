export type PerformanceReport = {
  firmName: string;
  start: string | null;
  end: string | null;
  generatedAt: string;
  engagement: Record<string, number>;
  inquiries: Record<string, number>;
};

const engagementMetrics = [
  ['listing_impressions', 'Listing impressions'],
  ['total_views', 'Profile views'],
  ['phone_clicks', 'Phone clicks'],
  ['email_clicks', 'Email clicks'],
  ['website_clicks', 'Website clicks'],
  ['consultation_submissions', 'Attributed consultation submissions'],
  ['total_clicks', 'Total contact and website clicks'],
] as const;

const inquiryMetrics = [
  ['total', 'Total authorized inquiries'],
  ['new_count', 'New'],
  ['contacted_count', 'Currently contacted'],
  ['scheduled_count', 'Consultations scheduled'],
  ['retained_count', 'Currently retained'],
  ['closed_count', 'Closed'],
  ['recorded_retained_count', 'Recorded retained inquiries'],
] as const;

const notes = [
  'Engagement counts recorded events, not unique visitors or confirmed calls, emails or website visits.',
  'Inquiry counts use assignments received during the reporting period and their latest firm-reported outcomes, including updates made later.',
  'Recorded conversion rate = recorded retained inquiries / total authorized inquiries. Retained matters later closed are included. Repeated inquiries may not represent unique clients.',
  'Attribution submissions and authorized assignments are different records; do not add them together. Outcomes are not independently verified or financial ROI.',
];

export function validatePerformanceReport(report: PerformanceReport): void {
  for (const [key] of engagementMetrics) {
    if (!Number.isSafeInteger(report.engagement[key]) || report.engagement[key] < 0) throw new Error('Invalid engagement counts');
  }
  for (const [key] of inquiryMetrics) {
    if (!Number.isSafeInteger(report.inquiries[key]) || report.inquiries[key] < 0) throw new Error('Invalid inquiry counts');
  }
  const i = report.inquiries;
  const e = report.engagement;
  if (i.new_count + i.contacted_count + i.scheduled_count + i.retained_count + i.closed_count !== i.total
    || i.recorded_retained_count < i.retained_count || i.recorded_retained_count > i.total
    || e.phone_clicks + e.email_clicks + e.website_clicks !== e.total_clicks) throw new Error('Inconsistent report counts');
}

function periodLabel(report: PerformanceReport): string {
  return report.start && report.end ? `${report.start} through ${report.end}` : 'All time';
}

function conversion(report: PerformanceReport): string {
  return report.inquiries.total ? `${(100 * report.inquiries.recorded_retained_count / report.inquiries.total).toFixed(1)}%` : 'N/A';
}

// Escape every field and neutralize spreadsheet formula prefixes, including leading whitespace.
function csvCell(value: string | number): string {
  const text = String(value);
  const safe = typeof value === 'string' && /^[\s\u0000-\u001f]*[=+\-@]/u.test(text) ? "'" + text : text;
  return '"' + safe.replace(/"/g, '""') + '"';
}

export function buildPerformanceCsv(report: PerformanceReport): string {
  validatePerformanceReport(report);
  const rows: (string | number)[][] = [
    ['Section', 'Metric', 'Value'],
    ['Report', 'Firm', report.firmName],
    ['Report', 'Period (El Paso local time, inclusive)', periodLabel(report)],
    ['Report', 'Generated at (UTC)', report.generatedAt],
    ...engagementMetrics.map(([key, label]) => ['Visibility and engagement', label, report.engagement[key]]),
    ...inquiryMetrics.map(([key, label]) => ['Inquiry performance', label, report.inquiries[key]]),
    ['Inquiry performance', 'Recorded conversion rate', conversion(report)],
    ...notes.map(note => ['Definitions', 'Note', note]),
  ];
  return '\uFEFF' + rows.map(row => row.map(csvCell).join(',')).join('\r\n') + '\r\n';
}

function html(value: string | number): string {
  const entities: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return String(value).replace(/[&<>"']/g, char => entities[char] ?? char);
}

export function buildPerformancePrintHtml(report: PerformanceReport): string {
  validatePerformanceReport(report);
  const table = (metrics: ReadonlyArray<readonly [string, string]>, values: Record<string, number>) =>
    metrics.map(([key, label]) => `<tr><th scope="row">${html(label)}</th><td>${html(values[key].toLocaleString('en-US'))}</td></tr>`).join('');
  const generated = new Date(report.generatedAt).toLocaleString('en-US', { timeZone: 'America/Denver', dateStyle: 'medium', timeStyle: 'short' });
  return `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>EPBL Firm Performance Report</title><style>
@page { size: letter; margin: 0.5in; }
* { box-sizing: border-box; }
body { margin: 0; font: 13px/1.45 Arial, Helvetica, sans-serif; color: #0f2a43; background: #eaf0f3; }
.sheet { width: min(100%, 816px); margin: 24px auto; background: white; padding: 28px; }
.header { background: #0f2a43; color: white; padding: 20px 24px; border-bottom: 4px solid #e9b846; }
.brand { color: #f0c34e; font-weight: bold; letter-spacing: 1.5px; font-size: 11px; text-transform: uppercase; }
h1 { font-size: 27px; margin: 6px 0 0; line-height: 1.15; }
.meta { padding: 15px 0 12px; border-bottom: 1px solid #dce4ea; }
.firm { font-size: 19px; font-weight: bold; overflow-wrap: anywhere; }
.meta p { margin: 3px 0; color: #526373; }
.columns { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; margin-top: 16px; }
h2 { font-size: 16px; margin: 0 0 6px; }
table { width: 100%; border-collapse: collapse; }
th, td { border-bottom: 1px solid #dce4ea; padding: 7px 5px; vertical-align: top; }
th { text-align: left; font-weight: normal; font-size: 12px; }
td { text-align: right; font-weight: bold; white-space: nowrap; font-variant-numeric: tabular-nums; }
.conversion { background: #e7f5f2; margin-top: 12px; padding: 10px 12px; font-weight: bold; border-left: 4px solid #199b92; display: flex; justify-content: space-between; gap: 8px; }
.notes { border-top: 1px solid #dce4ea; margin-top: 18px; padding-top: 11px; font-size: 10px; color: #526373; }
.notes p { margin: 4px 0; }
footer { margin-top: 15px; border-top: 1px solid #dce4ea; padding-top: 8px; font-size: 10px; color: #526373; }
.toolbar { text-align: right; margin-bottom: 12px; }
button { border: 0; border-radius: 6px; padding: 9px 14px; background: #0f2a43; color: white; cursor: pointer; }
@media (max-width: 580px) { .columns { grid-template-columns: 1fr; } }
@media print { body { background: white; print-color-adjust: exact; -webkit-print-color-adjust: exact; } .sheet { width: auto; margin: 0; padding: 0; } .toolbar { display: none; } .columns { grid-template-columns: 1fr 1fr; } .header, table, .conversion, .notes { break-inside: avoid; } }
</style></head><body><main class="sheet">
<div class="toolbar"><button id="print-report" type="button">Print / Save as PDF</button></div>
<header class="header"><div class="brand">El Paso's Best Lawyers</div><h1>Firm Performance Report</h1></header>
<div class="meta"><div class="firm">${html(report.firmName)}</div><p>Reporting period: ${html(periodLabel(report))} · El Paso local time (inclusive)</p><p>Generated: ${html(generated)} MT</p></div>
<div class="columns"><section><h2>Visibility &amp; engagement</h2><table>${table(engagementMetrics, report.engagement)}</table></section>
<section><h2>Inquiry performance</h2><table>${table(inquiryMetrics, report.inquiries)}</table>
<div class="conversion"><span>Recorded conversion rate</span><span>${html(conversion(report))}</span></div></section></div>
<section class="notes"><h2>How to read this report</h2>${notes.map(note => `<p>${html(note)}</p>`).join('')}</section>
<footer>El Paso's Best Lawyers · Aggregate firm reporting · No individual consumer information included</footer>
</main></body></html>`;
}

export function downloadPerformanceCsv(report: PerformanceReport): void {
  const blob = new Blob([buildPerformanceCsv(report)], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `EPBL-performance-${report.start ?? 'all-time'}${report.end ? '-' + report.end : ''}.csv`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
