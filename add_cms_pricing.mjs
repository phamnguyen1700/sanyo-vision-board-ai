import fs from 'node:fs/promises';
import { FileBlob, SpreadsheetFile } from 'file:///C:/Program%20Files/WindowsApps/OpenAI.CodexPrimaryRuntime.v26-1112-737-0_26.1112.737.0_x64__3k8sg7r9htsxt/dependencies/node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs';

const inputPath = 'C:/Users/Admin/Documents/Codex/2026-11-14/referenced-chatgpt-conversation-this-is-an/outputs/SANYO_launching_phase_2_SOW_coding_REVISED_FINAL_PRICING.xlsx';
const outputPath = 'C:/Users/Admin/Documents/Codex/2026-11-14/referenced-chatgpt-conversation-this-is-an/outputs/SANYO_launching_phase_2_SOW_coding_REVISED_FINAL_PRICING_WITH_CMS.xlsx';
const previewPath = 'D:/Điện Máy/sanyo-vision-board-ai/final-pricing-with-cms-preview.png';

const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(inputPath));
const sheet = workbook.worksheets.getItem('Trang tính1');

// Reuse the existing row styles while separating CMS as a separately chargeable scope.
sheet.getRange('A6:C6').copyFrom(sheet.getRange('A5:C5'), 'all');
sheet.getRange('A5:C5').copyFrom(sheet.getRange('A4:C4'), 'all');

sheet.getRange('A3').values = [['Prompt + Custom Renderer']];
sheet.getRange('B3').values = [['Prompt 5 chủ đề, mapping input, prompt variation, generate flow, tự fill 5 ảnh, fill text, font, crop/fit, giữ layout, xuất Vision Board.']];
sheet.getRange('C3').values = [['5.000.000đ\nPrompt engineering, mapping, custom renderer và xuất Vision Board.']];

sheet.getRange('A4').values = [['CMS / Admin Dashboard']];
sheet.getRange('B4').values = [['CMS quản lý questionnaire và nội dung câu hỏi; mapping theo chủ đề; Vision Board template; prompt, style, metadata/tag và phiên bản asset; Image Pool; ngưỡng replenishment; logo, sản phẩm Sanyo; dashboard cơ bản và export dữ liệu.']];
sheet.getRange('C4').values = [['3.000.000đ\nCMS/Admin cơ bản, không bao gồm các tính năng quản trị mở rộng ngoài scope.']];

sheet.getRange('A5').values = [['AI Token']];
sheet.getRange('B5').values = [['OpenAI API cho 5 ảnh/user; pre-generation và replenishment Image Pool theo batch, selection khi user cần, queue/worker, rate limit và retry. Ước tính khoảng 4.000 token/user.']];
sheet.getRange('C5').values = [['3.000.000–4.500.000\nAI token cho 1.000–1.500 user; chưa gồm retry phát sinh, thuế/phí thanh toán, storage/CDN và worker.']];

sheet.getRange('A6').values = [['Storage']];
sheet.getRange('B6').values = [['5 ảnh gốc + 1 Vision Board/user; khoảng 3–6 MB/user nếu nén WebP/JPEG. Storage phát sinh theo usage thực tế.']];
sheet.getRange('C6').values = [['Tính theo usage thực tế']];

sheet.getRange('A7:C7').values = [['Tổng development', 'Web Implement + Prompt + Renderer + CMS', '20.000.000đ']];
sheet.getRange('A8:C8').values = [['Tổng campaign dự kiến', 'Development + AI Token; Storage tính thêm theo usage thực tế', '23–24,5 triệu']];

sheet.getRange('C1:C8').format.columnWidth = 30;
sheet.getRange('C1:C8').format.wrapText = true;
sheet.getRange('C1:C8').format.verticalAlignment = 'center';
sheet.getRange('A7:C8').format.font = { bold: true };

workbook.recalculate();
const check = await workbook.inspect({ kind: 'table', range: 'Trang tính1!A1:C8', include: 'values,formulas', tableMaxRows: 12, tableMaxCols: 4, tableMaxCellChars: 3000 });
console.log(check.ndjson);
const errors = await workbook.inspect({ kind: 'match', searchTerm: '#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!', options: { useRegex: true, maxResults: 100 }, summary: 'CMS pricing formula error scan' });
console.log(errors.ndjson);
const preview = await workbook.render({ sheetName: 'Trang tính1', range: 'A1:C8', scale: 1, format: 'png' });
await fs.writeFile(previewPath, new Uint8Array(await preview.arrayBuffer()));
const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(outputPath);
console.log(`SAVED=${outputPath}`);
