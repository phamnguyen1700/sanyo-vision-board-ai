import fs from 'node:fs/promises';
import { FileBlob, SpreadsheetFile } from 'file:///C:/Program%20Files/WindowsApps/OpenAI.CodexPrimaryRuntime.v26-1112-737-0_26.1112.737.0_x64__3k8sg7r9htsxt/dependencies/node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs';

const inputPath = 'C:/Users/Admin/Documents/Codex/2026-11-14/referenced-chatgpt-conversation-this-is-an/outputs/SANYO_launching_phase_2_SOW_coding_REVISED_AI_POOL_ESTIMATE.xlsx';
const outputPath = 'C:/Users/Admin/Documents/Codex/2026-11-14/referenced-chatgpt-conversation-this-is-an/outputs/SANYO_launching_phase_2_SOW_coding_REVISED_WITH_PRICING.xlsx';
const previewPath = 'D:/Điện Máy/sanyo-vision-board-ai/pricing-preview.png';

const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(inputPath));
const sheet = workbook.worksheets.getItem('Trang tính1');

// Extend the existing two-column quote layout with a clear price-reference column.
sheet.getRange('C1:C6').copyFrom(sheet.getRange('B1:B6'), 'all');
sheet.getRange('C1:C6').values = [
  ['GIÁ THAM CHIẾU (VND)'],
  ['15.000.000\nPhát triển core experience, questionnaire, session, selection, renderer, API/Database, queue/worker, fallback và QA cơ bản.'],
  ['5.000.000\nCMS/Admin, prompt & metadata, Image Pool management, template configuration và dashboard cơ bản.'],
  ['3.000.000–4.500.000\nAI token cho 1.000–1.500 user; chưa gồm retry phát sinh, thuế/phí thanh toán, storage/CDN và worker.'],
  ['2.000.000\nHosting 2 tháng: VPS/API, PostgreSQL, Redis, worker, Object Storage/CDN cơ bản.'],
  ['500.000\nDomain 1 năm, SSL/cấu hình cơ bản.'],
];

sheet.getRange('A7:C7').copyFrom(sheet.getRange('A6:C6'), 'all');
sheet.getRange('A7:C7').values = [[
  'TỔNG THAM CHIẾU TỐI THIỂU',
  'Gói triển khai V1 gồm phần phát triển hệ thống, AI token theo quy mô 1.000–1.500 user, hosting 2 tháng và domain 1 năm.\nPhần phát triển: khoảng 20.000.000 VND. Tổng tham chiếu: khoảng 25.500.000–27.000.000 VND.\nChưa bao gồm các yêu cầu mở rộng ngoài scope, retry vượt dự toán, nâng tier/provider và phát sinh hạ tầng theo traffic thực tế.',
  '25.500.000–27.000.000'
]];

sheet.getRange('C1:C7').format.columnWidth = 30;
sheet.getRange('C1:C7').format.wrapText = true;
sheet.getRange('C1:C7').format.verticalAlignment = 'center';
sheet.getRange('A7:C7').format.font = { bold: true };

workbook.recalculate();
const check = await workbook.inspect({ kind: 'table', range: 'Trang tính1!A1:C7', include: 'values,formulas', tableMaxRows: 10, tableMaxCols: 4, tableMaxCellChars: 3000 });
console.log(check.ndjson);
const errors = await workbook.inspect({ kind: 'match', searchTerm: '#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!', options: { useRegex: true, maxResults: 100 }, summary: 'pricing column formula error scan' });
console.log(errors.ndjson);
const preview = await workbook.render({ sheetName: 'Trang tính1', range: 'A1:C7', scale: 1, format: 'png' });
await fs.writeFile(previewPath, new Uint8Array(await preview.arrayBuffer()));
const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(outputPath);
console.log(`SAVED=${outputPath}`);
