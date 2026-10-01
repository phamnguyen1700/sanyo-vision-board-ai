"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.identitySchema = void 0;
exports.readSession = readSession;
exports.saveSession = saveSession;
exports.createEmptySession = createEmptySession;
const zod_1 = require("zod");
exports.identitySchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(2, 'Cho SANYO biết tên của bạn nhé'),
    gender: zod_1.z.string().min(1, 'Chọn một lựa chọn nha'),
    age: zod_1.z.string().min(1, 'Chọn độ tuổi của bạn'),
});
const sessionKey = 'sanyo-vision-session';
const storedSessionSchema = zod_1.z.object({
    identity: zod_1.z.object({ name: zod_1.z.string(), gender: zod_1.z.string(), age: zod_1.z.string() }),
    answers: zod_1.z.record(zod_1.z.string(), zod_1.z.union([
        zod_1.z.string(),
        zod_1.z.array(zod_1.z.string()),
        zod_1.z.object({ destination: zod_1.z.string(), companion: zod_1.z.string(), highlight: zod_1.z.string(), taste: zod_1.z.string().optional(), memorable: zod_1.z.string().optional() }),
    ])),
    vibe: zod_1.z.string(),
    boardId: zod_1.z.string(),
    manifestPhase: zod_1.z.literal('result').optional(),
    activeScreenId: zod_1.z.enum(['home', 'identity', 'vibe', 'relationships', 'learning', 'travel', 'career', 'review', 'result']).optional(),
    editingTopicId: zod_1.z.enum(['vibe', 'relationships', 'learning', 'travel', 'career']).optional(),
});
function readSession() {
    if (typeof window === 'undefined')
        return null;
    try {
        const parsed = storedSessionSchema.safeParse(JSON.parse(window.sessionStorage.getItem(sessionKey) || 'null'));
        return parsed.success ? parsed.data : null;
    }
    catch {
        return null;
    }
}
function saveSession(session) {
    if (typeof window === 'undefined')
        return;
    try {
        window.sessionStorage.setItem(sessionKey, JSON.stringify(session));
    }
    catch {
        // The in-memory journey remains usable when browser storage is unavailable.
    }
}
function createEmptySession(identity, vibe = '', answers = {}) {
    return {
        identity,
        vibe,
        answers,
        boardId: crypto.randomUUID(),
    };
}
