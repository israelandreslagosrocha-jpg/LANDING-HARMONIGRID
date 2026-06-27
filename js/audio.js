/**
 * Web Audio API Chord Synthesizer Engine
 * Provides interactive sound feedback when clicking the chord grids.
 */

// Chord definitions mapping chord keys to frequencies (Hz)
export const chords = {
  c: [261.63, 329.63, 392.00, 523.25],   // C major: C4, E4, G4, C5
  f: [174.61, 220.00, 261.63, 349.23],   // F major: F3, A3, C4, F4
  g: [196.00, 246.94, 293.66, 392.00],   // G major: G3, B3, D4, G4
  am: [220.00, 261.63, 329.63, 440.00],  // A minor: A3, C4, E4, A4
  dm: [146.83, 174.61, 220.00, 293.66],  // D minor: D3, F3, A3, D4
  em: [164.81, 196.00, 246.94, 329.63],  // E minor: E3, G3, B3, E4
  bb: [233.08, 293.66, 349.23, 466.16],  // Bb major: Bb3, D4, F4, Bb4
  c7: [261.63, 329.63, 392.00, 466.16],  // C dominant 7th: C4, E4, G4, Bb4
};

// Map chord keys to note names (for visual feedback)
export const chordNotes = {
  c: "C - E - G - C",
  f: "F - A - C - F",
  g: "G - B - D - G",
  am: "A - C - E - A",
  dm: "D - F - A - D",
  em: "E - G - B - E",
  bb: "Bb - D - F - Bb",
  c7: "C - E - G - Bb",
};

let audioCtx = null;
let masterGain = null;
let activeOscillators = [];
let oscillatorType = 'sine'; // 'sine' (warm) or 'triangle' (bright)

/**
 * Initializes the Audio Context safely after a user interaction
 */
function initAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    // Create master gain node for volume control and smoothing
    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.2, audioCtx.currentTime); // moderate volume (20%)
    masterGain.connect(audioCtx.destination);
  }
  
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

/**
 * Stop all active oscillators with a smooth volume release ramp to prevent popping sounds
 */
export function stopCurrentChord() {
  if (!audioCtx) return;
  
  const releaseTime = 0.5; // 0.5s fade out
  const now = audioCtx.currentTime;
  
  activeOscillators.forEach(({ oscs, gainNode }) => {
    try {
      // Smoothly ramp volume to 0
      gainNode.gain.cancelScheduledValues(now);
      gainNode.gain.setValueAtTime(gainNode.gain.value, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + releaseTime);
      
      // Stop and disconnect after fade out completes
      oscs.forEach((osc) => {
        osc.stop(now + releaseTime);
      });
    } catch (e) {
      console.warn("Error releasing oscillators:", e);
    }
  });
  
  activeOscillators = [];
}

/**
 * Set the oscillator type (sine, triangle, square)
 * @param {string} type 
 */
export function setOscillatorType(type) {
  if (['sine', 'triangle'].includes(type)) {
    oscillatorType = type;
  }
}

/**
 * Plays a chord based on its key
 * @param {string} chordKey 'c', 'f', 'g', 'am', etc.
 */
export function playChord(chordKey) {
  // Initialize context on user click
  initAudioContext();
  
  // Stop any previously playing chord
  stopCurrentChord();
  
  const freqs = chords[chordKey];
  if (!freqs) return;
  
  const now = audioCtx.currentTime;
  
  // Create a localized gain node for this specific chord occurrence
  const chordGain = audioCtx.createGain();
  chordGain.gain.setValueAtTime(0, now);
  
  // ADSR Envelope: Attack (quick fade in), Decay (settle down), Sustain (hold)
  // We use exponential ramp for organic feel
  chordGain.gain.linearRampToValueAtTime(0.35, now + 0.08); // Quick attack (80ms)
  chordGain.gain.exponentialRampToValueAtTime(0.2, now + 0.3); // Decay to sustain level (300ms)
  
  chordGain.connect(masterGain);
  
  const oscs = [];
  
  freqs.forEach((freq) => {
    // Fundamental oscillator
    const osc = audioCtx.createOscillator();
    osc.type = oscillatorType;
    osc.frequency.setValueAtTime(freq, now);
    
    // Add subtle detune for warmth / chorus effect
    osc.detune.setValueAtTime((Math.random() - 0.5) * 8, now);
    osc.connect(chordGain);
    
    // If triangle, add a very quiet sub-octave or fifth oscillator for harmonic depth
    if (oscillatorType === 'triangle') {
      const subOsc = audioCtx.createOscillator();
      subOsc.type = 'sine'; // sine fundamental underneath
      subOsc.frequency.setValueAtTime(freq / 2, now); // sub-octave
      
      const subGain = audioCtx.createGain();
      subGain.gain.setValueAtTime(0.08, now); // quiet
      subOsc.connect(subGain);
      subGain.connect(chordGain);
      
      subOsc.start(now);
      oscs.push(subOsc);
    }
    
    osc.start(now);
    oscs.push(osc);
  });
  
  // Track active nodes
  activeOscillators.push({
    oscs,
    gainNode: chordGain
  });
  
  // Return notes information for display update
  return chordNotes[chordKey];
}
