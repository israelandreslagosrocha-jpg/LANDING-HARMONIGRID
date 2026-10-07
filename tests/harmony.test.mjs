import test from "node:test";
import assert from "node:assert/strict";
import { getProgression } from "../js/harmony.js";

test("sevenths respect the major key: major, minor, major, dominant", () => {
  const progression = getProgression(0, true);
  assert.deepEqual(
    progression.map((chord) => chord.name),
    ["Cmaj7", "Am7", "Fmaj7", "G7"],
  );
  assert.deepEqual(
    progression.map((chord) => (chord.notes[3] - chord.notes[0]) % 12),
    [11, 10, 11, 10],
  );
  assert.ok(progression[3].notes.includes(65), "G7 must contain F natural");
});
test("transposition preserves musical intervals in every supported key", () => {
  for (const offset of [0, 2, 5, 7])
    for (const extended of [false, true]) {
      const original = getProgression(0, extended);
      const shifted = getProgression(offset, extended);
      for (let i = 0; i < 4; i++) {
        assert.deepEqual(
          shifted[i].notes.map((note, n) => note - original[i].notes[n]),
          Array(extended ? 4 : 3).fill(offset),
        );
        assert.equal(shifted[i].degree, original[i].degree);
      }
    }
  assert.deepEqual(
    getProgression(5).map((chord) => chord.name),
    ["F", "Dm", "B♭", "C"],
  );
});
test("each demo request owns its notes and unsupported keys fail explicitly", () => {
  const first = getProgression();
  first[0].notes[0] = 0;
  assert.equal(getProgression()[0].notes[0], 60);
  assert.throws(() => getProgression(3), RangeError);
});
