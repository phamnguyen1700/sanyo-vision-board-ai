import fs from 'node:fs/promises';
import { FileBlob, SpreadsheetFile } from 'file:///C:/Program%20Files/WindowsApps/OpenAI.CodexPrimaryRuntime.v26-1112-737-0_26.1112.737.0_x64__3k8sg7r9htsxt/dependencies/node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs';

const inputPath = 'C:/Users/Admin/Documents/Codex/2026-11-14/referenced-chatgpt-conversation-this-is-an/outputs/SANYO_launching_phase_2_SOW_coding_REVISED_WITH_PRICING.xlsx';
const outputPath = 'C:/Users/Admin/Documents/Codex/2026-11-14/referenced-chatgpt-conversation-this-is-an/outputs/SANYO_launching_phase_2_SOW_coding_REVISED_FINAL_PRICING.xlsx';
const previewPath = 'D:/Điện Máy/sanyo-vision-board-ai/final-pricing-preview.png';

const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(inputPath));
const sheet = workbook.worksheets.getItem('Trang tính1');

sheet.getRange('A2').values = [['Web Implement']];
sheet.getRange('C2').values = [['12.000.000đ\nPlayer, admin, PostgreSQL, Redis, queue/worker, retry, job status, storage, deploy VPS/domain.']];

sheet.getRange('A3').values = [['Prompt + Custom Renderer']];
sheet.getRange('B3').values = [['Prompt 5 chủ đề, mapping input, prompt variation, generate flow, tự fill 5 ảnh, fill text, font, crop/fit, giữ layout, xuất Vision Board.\n- Không bao gồm CMS/Admin Dashboard.']];
sheet.getRange('C3').values = [['5.000.000đ\nPrompt engineering, mapping, custom renderer và xuất Vision Board.']];

sheet.getRange('A5').values = [['Storage']];
sheet.getRange('B5').values = [['5 ảnh gốc + 1 Vision Board/user; khoảng 3–6 MB/user nếu nén WebP/JPEG. Storage phát sinh theo usage thực tế.']];
sheet.getRange('C5').values = [['Tính theo usage thực tế']];

// Domain/hosting are already covered by the Web Implement scope in the reference pricing.
sheet.getRange('A6:C6').clear({ applyTo: 'contents' });

sheet.getRange('A7:C7').copyFrom(sheet.getRange('A6:C6'), 'all');
sheet.getRange('A7:C7').values = [['Tổng development', 'Web Implement + Prompt + Renderer', '17.000.000đ']];
sheet.getRange('A8:C8').copyFrom(sheet.getRange('A7:C7'), 'all');
sheet.getRange('A8:C8').values = [['Tổng campaign dự kiến', 'Development + AI Token', '20–21,5 triệu']];

sheet.getRange('C1:C8').format.columnWidth = 30;
sheet.getRange('C1:C8').format.wrapText = true;
sheet.getRange('C1:C8').format.verticalAlignment = 'center';
sheet.getRange('A7:C8').format.font = { bold: true };

workbook.recalculate();
const check = await workbook.inspect({ kind: 'table', range: 'Trang tính1!A1:C8', include: 'values,formulas', tableMaxRows: 12, tableMaxCols: 4, tableMaxCellChars: 3000 });
console.log(check.ndjson);
const errors = await workbook.inspect({ kind: 'match', searchTerm: '#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!', options: { useRegex: true, maxResults: 100 }, summary: 'final pricing formula error scan' });
console.log(errors.ndjson);
const preview = await workbook.render({ sheetName: 'Trang tính1', range: 'A1:C8', scale: 1, format: 'png' });
await fs.writeFile(previewPath, new Uint8Array(await preview.arrayBuffer()));
const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(outputPath);
console.log(`SAVED=${outputPath}`);
