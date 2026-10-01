const { test, afterEach } = require('node:test')
const assert = require('node:assert/strict')
const { journeyScenes, getJourneyRoute, getResumeScreen, reverseDirection, isTopicAnswerValid } = require('../tmp/journey-tests/journey-flow.js')
const { identitySchema, readSession, saveSession } = require('../tmp/journey-tests/vision-session.js')

const route = getJourneyRoute(journeyScenes)
const completeSession = {
  identity: { name: 'Journey Test', gender: 'Nam', age: '25 - 34' },
  vibe: 'Tự do',
  boardId: 'test-board',
  activeScreenId: 'review',
  answers: {
    vibe: ['Tự do', 'Sáng tạo', 'Bình yên'],
    relationships: ['Ăn tối cùng gia đình', 'Đi chơi với bạn bè', 'Gặp người hợp vibe'],
    learning: 'Learn Japanese',
    travel: { destination: 'Kyoto', companion: 'Friends', highlight: 'Gardens' },
    career: ['One goal', 'Second goal', 'Third goal'],
  },
}

afterEach(() => { delete global.window })

test('configured path follows the spatial journey, independent of input array order', () => {
  assert.deepEqual(getJourneyRoute([...journeyScenes].reverse()).map((scene) => scene.id), [
    'home', 'identity', 'vibe', 'relationships', 'learning', 'travel', 'career', 'review', 'result',
  ])
  assert.deepEqual(route.slice(0, -1).map((scene) => scene.transitionToNext), [
    'down', 'down', 'down', 'right', 'right', 'up', 'left', 'expand',
  ])
})

test('direction overrides are accepted and all slide directions reverse correctly', () => {
  const custom = journeyScenes.map((scene) => scene.id === 'relationships' ? { ...scene, transitionToNext: 'up' } : scene)
  assert.equal(getJourneyRoute(custom)[3].transitionToNext, 'up')
  for (const [forward, backward] of [['up', 'down'], ['right', 'left'], ['down', 'up'], ['left', 'right']]) {
    assert.equal(reverseDirection(forward), backward)
  }
})

test('invalid configs fail early: cycles, duplicate IDs, missing screens and misplaced reveal', () => {
  assert.throws(() => getJourneyRoute([...journeyScenes, journeyScenes[0]]), /unique/)
  assert.throws(() => getJourneyRoute(journeyScenes.map((scene) => scene.id === 'identity' ? { ...scene, next: 'home' } : scene)), /cycle/)
  assert.throws(() => getJourneyRoute(journeyScenes.filter((scene) => scene.id !== 'travel')), /connect/)
  assert.throws(() => getJourneyRoute(journeyScenes.map((scene) => scene.id === 'vibe' ? { ...scene, transitionToNext: 'expand' } : scene)), /expand/)
  assert.throws(() => getJourneyRoute(journeyScenes.map((scene) => scene.id === 'review' ? { ...scene, transitionToNext: 'down' } : scene)), /expand/)
})

test('validation prevents incomplete, repeated and whitespace-only answers from advancing', () => {
  for (const id of ['vibe', 'relationships', 'learning', 'travel', 'career']) {
    assert.equal(isTopicAnswerValid(id, completeSession.answers[id]), true)
    assert.equal(isTopicAnswerValid(id, undefined), false)
  }
  assert.equal(isTopicAnswerValid('vibe', ['Tự do', 'Tự do', 'Tự do']), false)
  assert.equal(isTopicAnswerValid('vibe', ['Tự do', 'Sáng tạo', 'Unknown']), false)
  assert.equal(isTopicAnswerValid('learning', '   '), false)
  assert.equal(isTopicAnswerValid('learning', 'a'.repeat(201)), false)
  assert.equal(isTopicAnswerValid('career', ['a', ' ', 'c']), false)
  assert.equal(isTopicAnswerValid('travel', { destination: 'Kyoto', companion: ' ', highlight: 'Gardens' }), false)
  assert.equal(identitySchema.safeParse({ ...completeSession.identity, name: '  ' }).success, false)
})

test('refresh resumes the current draft but never bypasses an incomplete prerequisite', () => {
  assert.equal(getResumeScreen(route, { ...completeSession, activeScreenId: 'learning' }), 'learning')
  assert.equal(getResumeScreen(route, { ...completeSession, answers: { ...completeSession.answers, relationships: [] } }), 'relationships')
  assert.equal(getResumeScreen(route, { ...completeSession, identity: { name: '', gender: '', age: '' } }), 'identity')
})

test('interrupted expansion returns to review, completed result restores directly', () => {
  assert.equal(getResumeScreen(route, { ...completeSession, activeScreenId: 'result' }), 'review')
  assert.equal(getResumeScreen(route, { ...completeSession, manifestPhase: 'result' }), 'result')
  assert.equal(getResumeScreen(route, { ...completeSession, manifestPhase: 'result', answers: { ...completeSession.answers, travel: '' } }), 'travel')
})

test('storage round-trip preserves edit return and completed answers', () => {
  const values = new Map()
  global.window = { sessionStorage: { getItem: (key) => values.get(key), setItem: (key, value) => values.set(key, value) } }
  const editing = { ...completeSession, activeScreenId: 'learning', editingTopicId: 'learning' }
  saveSession(editing)
  assert.deepEqual(readSession(), editing)
})

test('broken or unavailable browser storage cannot crash the journey', () => {
  for (const raw of ['bad json', '{}', JSON.stringify({ ...completeSession, answers: { career: [null] } })]) {
    global.window = { sessionStorage: { getItem: () => raw } }
    assert.equal(readSession(), null)
  }
  global.window = { sessionStorage: { getItem: () => { throw new Error('blocked') }, setItem: () => { throw new Error('quota') } } }
  assert.equal(readSession(), null)
  assert.doesNotThrow(() => saveSession(completeSession))
})
