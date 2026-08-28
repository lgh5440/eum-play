import assert from 'node:assert/strict';

const store = new Map();
globalThis.localStorage = {
  getItem(key) {
    return store.has(key) ? store.get(key) : null;
  },
  setItem(key, value) {
    store.set(key, String(value));
  },
  removeItem(key) {
    store.delete(key);
  },
  clear() {
    store.clear();
  },
};

const mod = await import('../src/utils/chosung.js');

assert.equal(mod.toChosung('모세'), 'ㅁㅅ');
assert.equal(mod.toChosung('우공이산 123 ABC'), 'ㅇㄱㅇㅅ 123 ABC');
assert.equal(mod.toChosung(''), '');
assert.equal(mod.toChosung(null), '');

const originalRandom = Math.random;
Math.random = () => 0;
try {
  assert.equal(mod.randomChosung(4), 'ㄱㄱㄱㄱ');
} finally {
  Math.random = originalRandom;
}

const original = ['a', 'b', 'c'];
const shuffled = mod.shuffle(original);
assert.notEqual(shuffled, original);
assert.deepEqual([...original].sort(), [...shuffled].sort());

localStorage.clear();
assert.equal(mod.addCustomQuestion('bible', '상', '  다윗  '), true);
assert.equal(mod.addCustomQuestion('bible', '상', '다윗'), false);
assert.deepEqual(mod.loadCustom(), { bible: { '상': ['다윗'] } });
assert.deepEqual(
  mod.getMergedAnswers({ bible: { '상': ['모세'] } }, mod.loadCustom(), 'bible', '상'),
  ['모세', '다윗'],
);

mod.markComplete('bible', '상', 0, 7);
const progress = mod.loadProgress();
assert.deepEqual(mod.getSetState(progress, 'bible', '상', 0), { done: true, score: 7 });
assert.deepEqual(mod.getCategoryStats(progress, 'bible', { '상': [0, 1], '중': [], '하': [] }), {
  done: 1,
  total: 2,
});

mod.resetCategory('bible');
assert.deepEqual(mod.loadProgress(), {});

console.log('chosung.test.mjs: all assertions passed');
