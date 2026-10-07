/** Musical content of the landing demo; independent from the application editor. */
const names = {
  0: ["C", "Am", "F", "G"],
  2: ["D", "Bm", "G", "A"],
  5: ["F", "Dm", "B♭", "C"],
  7: ["G", "Em", "C", "D"],
};
const spanish = {
  0: ["Do mayor", "La menor", "Fa mayor", "Sol mayor"],
  2: ["Re mayor", "Si menor", "Sol mayor", "La mayor"],
  5: ["Fa mayor", "Re menor", "Si bemol mayor", "Do mayor"],
  7: ["Sol mayor", "Mi menor", "Do mayor", "Re mayor"],
};
const functions = ["Tónica", "Relativa menor", "Subdominante", "Dominante"];
const degrees = ["I", "vi", "IV", "V"];
const suffixes = ["maj7", "7", "maj7", "7"];
const baseNotes = [
  [60, 64, 67],
  [57, 60, 64],
  [53, 57, 60],
  [55, 59, 62],
];
const sevenths = [71, 67, 64, 65];
export function getProgression(offset = 0, withSevenths = false) {
  if (!Object.hasOwn(names, offset)) throw new RangeError("Unsupported key");
  return names[offset].map((name, index) => ({
    name: name + (withSevenths ? suffixes[index] : ""),
    accessibleName:
      spanish[offset][index] + (withSevenths ? ", con séptima" : ""),
    degree: degrees[index] + (withSevenths ? suffixes[index] : ""),
    function: functions[index],
    notes: [
      ...baseNotes[index],
      ...(withSevenths ? [sevenths[index]] : []),
    ].map((note) => note + Number(offset)),
  }));
}
