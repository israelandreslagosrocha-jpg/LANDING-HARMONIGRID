/** Small, finite Web Audio voices. No downloads, microphone or autoplay. */
let context;
let voice;
let muted = false;
const frequency = (midi) => 440 * 2 ** ((midi - 69) / 12);
export function stopAudio() {
  if (!voice || !context) return;
  const now = context.currentTime;
  voice.gain.gain.cancelScheduledValues(now);
  voice.gain.gain.setTargetAtTime(0, now, 0.025);
  for (const osc of voice.oscs) {
    try {
      osc.stop(now + 0.12);
    } catch {}
  }
  voice = undefined;
}
export function setMuted(value) {
  muted = value;
  if (muted) stopAudio();
}
export async function playChord(notes, isCurrent = () => true) {
  if (muted) return false;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) throw new Error("Audio no disponible");
  context ??= new AudioContext();
  if (context.state === "suspended") await context.resume();
  if (muted || !isCurrent()) return false;
  stopAudio();
  const now = context.currentTime;
  const gain = context.createGain();
  gain.connect(context.destination);
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.075, now + 0.025);
  gain.gain.exponentialRampToValueAtTime(0.045, now + 0.15);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.3);
  const oscs = notes.map((midi) => {
    const osc = context.createOscillator();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(frequency(midi), now);
    osc.connect(gain);
    osc.start(now);
    osc.stop(now + 1.35);
    osc.onended = () => osc.disconnect();
    return osc;
  });
  oscs[oscs.length - 1].addEventListener("ended", () => gain.disconnect());
  voice = { gain, oscs };
  return true;
}
window.addEventListener("pagehide", () => {
  stopAudio();
  context?.close().catch(() => {});
});
