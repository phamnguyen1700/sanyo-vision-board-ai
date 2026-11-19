import fs from 'node:fs/promises';
import { FileBlob, SpreadsheetFile } from 'file:///C:/Program%20Files/WindowsApps/OpenAI.CodexPrimaryRuntime.v26-1112-737-0_26.1112.737.0_x64__3k8sg7r9htsxt/dependencies/node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs';

const filePath = 'C:/Users/Admin/Documents/Codex/2026-11-14/referenced-chatgpt-conversation-this-is-an/outputs/SANYO_launching_phase_2_SOW_coding_REVISED.xlsx';
const outputPath = 'C:/Users/Admin/Documents/Codex/2026-11-14/referenced-chatgpt-conversation-this-is-an/outputs/SANYO_launching_phase_2_SOW_coding_REVISED_AI_POOL_ESTIMATE.xlsx';
const previewPath = 'D:/Điện Máy/sanyo-vision-board-ai/ai-cost-preview.png';

const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(filePath));
const sheet = workbook.worksheets.getItem('Trang tính1');

sheet.getRange('B4').values = [[
  'Chi phí AI cho pre-generation và replenishment Image Pool\n' +
  '- Phương án đề xuất: sử dụng OpenAI Image API theo token, pre-generate ảnh theo các chủ đề đã khóa và lưu vào Image Pool cùng metadata; khi user thực hiện, hệ thống chọn ảnh phù hợp rồi render 5 ảnh vào design bằng custom renderer.\n' +
  '- Không generate realtime cho từng user trong luồng chính. Với quy mô khoảng 1.000 user / 5.000 ảnh, realtime gần như không khả thi nếu không được provider nâng limit. Image Pool giúp thời gian trả ảnh rất nhanh, đổi lại độ chính xác ban đầu dự kiến tối thiểu khoảng 70–80% và sẽ tiếp tục tối ưu thuật toán.\n' +
  '- Giới hạn tham chiếu của OpenAI API: khoảng 20 ảnh/phút. Queue/worker và automation chạy trước theo batch; khi pool thiếu ảnh thì bổ sung bất đồng bộ, có quota, rate limit, retry và cảnh báo chi phí.\n' +
  '- Ước tính hiện tại: 1 user dùng tối thiểu 5 ảnh, khoảng 4.000 token/user; theo mức 1.000.000 token = 30 USD, chi phí khoảng 3.000 VND/user/lần. Dự toán token cho 1.000–1.500 user: khoảng 3.000.000–4.500.000 VND, chưa gồm retry phát sinh, thuế/phí thanh toán, storage/CDN và hạ tầng worker.\n' +
  '- Mức trên là báo giá ước tính tối thiểu để planning; chốt ngân sách sau benchmark chất lượng ảnh, kích thước/quality, tỷ lệ retry, pool hit và số ảnh replenishment thực tế.\n' +
  '- Phương án tự host model trên VPS không bị giới hạn 20 ảnh/phút nhưng model thấp có thể chậm, còn model cao làm chi phí VPS tăng mạnh; để đạt phản hồi dưới 1 phút ở kịch bản khoảng 3.500 request gen ảnh cần chạy song song nhiều instance, nên chưa chọn làm phương án V1.\n' +
  'Lưu ý: Canva không dùng cho pipeline này do giới hạn và tốc độ trả ảnh; phần render 5 ảnh vào design do hệ thống tự code bằng custom renderer.'
]];

workbook.recalculate();
const check = await workbook.inspect({ kind: 'table', range: 'Trang tính1!A4:B4', include: 'values,formulas', tableMaxRows: 2, tableMaxCols: 3, tableMaxCellChars: 6000 });
console.log(check.ndjson);
const errors = await workbook.inspect({ kind: 'match', searchTerm: '#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!', options: { useRegex: true, maxResults: 100 }, summary: 'AI cost update formula error scan' });
console.log(errors.ndjson);
const preview = await workbook.render({ sheetName: 'Trang tính1', range: 'A1:B6', scale: 1, format: 'png' });
await fs.writeFile(previewPath, new Uint8Array(await preview.arrayBuffer()));
const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(outputPath);
console.log(`SAVED=${outputPath}`);
