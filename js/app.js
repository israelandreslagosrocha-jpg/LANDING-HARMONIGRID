import { playChord, stopAudio, setMuted } from "./audio.js";
import { getProgression } from "./harmony.js";

// Navigation remains usable without JS; only the mobile disclosure needs it.
const menuToggle = document.querySelector("#menu-toggle");
const menu = document.querySelector("#mobile-menu");
function closeMenu(restoreFocus = false) {
  menu.hidden = true;
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Abrir menú");
  if (restoreFocus) menuToggle.focus();
}
menuToggle.addEventListener("click", () => {
  const open = menu.hidden;
  menu.hidden = !open;
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
});
menu.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeMenu();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !menu.hidden) closeMenu(true);
});
document.addEventListener("click", (event) => {
  if (!event.target.closest(".header")) closeMenu();
});
matchMedia("(min-width: 851px)").addEventListener("change", (event) => {
  if (event.matches) closeMenu();
});

// Motion control also stops scroll-linked reveals at a fully visible frame.
const motionToggle = document.querySelector("#motion-toggle");
let paused = false;
motionToggle.addEventListener("click", () => {
  paused = !paused;
  document.documentElement.classList.toggle("paused", paused);
  motionToggle.setAttribute("aria-pressed", String(paused));
  motionToggle.setAttribute(
    "aria-label",
    paused ? "Activar animaciones" : "Pausar animaciones",
  );
  motionToggle.title = paused ? "Activar animaciones" : "Pausar animaciones";
  motionToggle.firstElementChild.textContent = paused ? "▶" : "Ⅱ";
});

const pads = [...document.querySelectorAll(".chord-pad")];
const keySelect = document.querySelector("#key-select");
const notationToggle = document.querySelector("#notation-toggle");
const sequenceToggle = document.querySelector("#sequence-toggle");
const soundToggle = document.querySelector("#sound-toggle");
const status = document.querySelector("#audio-status");
const voicingSelect = document.querySelector("#voicing-select");
const currentProgression = () =>
  getProgression(Number(keySelect.value), voicingSelect.value === "sevenths");
let showDegrees = false;
let muted = false;
let playing = false;
let sequenceTimer;
let visualTimer;
let generation = 0;

function clearPads() {
  pads.forEach((pad) => pad.classList.remove("active"));
}
function stopSequence() {
  generation++;
  clearTimeout(sequenceTimer);
  clearTimeout(visualTimer);
  playing = false;
  sequenceToggle.setAttribute("aria-pressed", "false");
  sequenceToggle.textContent = "▶ Escuchar progresión";
  sequenceToggle.setAttribute("aria-label", "Escuchar progresión");
  clearPads();
  stopAudio();
}
function renderLabels() {
  document
    .querySelector(".demo-panel")
    .classList.toggle("extended", voicingSelect.value === "sevenths");
  const progression = currentProgression();
  pads.forEach((pad, i) => {
    const chord = progression[i];
    pad.querySelector(".pad-chord").textContent = showDegrees
      ? chord.degree
      : chord.name;
    pad.querySelector(".pad-degree").textContent =
      `${showDegrees ? chord.name : chord.degree} · ${chord.function}`;
    pad.setAttribute("aria-label", `Escuchar ${chord.accessibleName}`);
  });
}
async function activate(index, token) {
  clearTimeout(visualTimer);
  clearPads();
  const chord = currentProgression()[index];
  try {
    const sounded = await playChord(chord.notes, () => token === generation);
    if (token !== generation) return false;
    pads[index].classList.add("active");
    status.textContent = `${chord.name} · ${chord.function}${sounded ? "" : " · sonido silenciado"}`;
    if (!playing) visualTimer = setTimeout(clearPads, 1400);
    return true;
  } catch {
    stopSequence();
    status.textContent =
      "No se pudo iniciar el sonido. Puedes seguir explorando los acordes visualmente.";
    return false;
  }
}
pads.forEach((pad, index) =>
  pad.addEventListener("click", () => {
    stopSequence();
    activate(index, generation);
  }),
);
keySelect.addEventListener("change", () => {
  stopSequence();
  renderLabels();
  status.textContent = `Tu idea en ${keySelect.selectedOptions[0].textContent}. Escucha cómo cambia.`;
});
voicingSelect.addEventListener("change", () => {
  stopSequence();
  renderLabels();
  status.textContent =
    voicingSelect.value === "sevenths"
      ? "Una capa más de color: escucha los acordes con séptima."
      : "De vuelta a las tríadas: tres notas por acorde.";
});
notationToggle.addEventListener("click", () => {
  showDegrees = !showDegrees;
  notationToggle.setAttribute("aria-pressed", String(showDegrees));
  notationToggle.textContent = showDegrees ? "Ver acordes ⇄" : "Ver grados ⇄";
  notationToggle.setAttribute(
    "aria-label",
    showDegrees ? "Ver acordes" : "Ver grados",
  );
  renderLabels();
});
sequenceToggle.addEventListener("click", async () => {
  if (playing) {
    stopSequence();
    status.textContent = "Progresión detenida.";
    return;
  }
  stopSequence();
  playing = true;
  sequenceToggle.setAttribute("aria-pressed", "true");
  sequenceToggle.textContent = "■ Detener progresión";
  sequenceToggle.setAttribute("aria-label", "Detener progresión");
  const token = generation;
  let index = 0;
  const next = async () => {
    if (token !== generation || !playing) return;
    if (index >= pads.length) {
      stopSequence();
      status.textContent = "Una idea. Cuatro acordes. ¿Qué crearías con ellos?";
      return;
    }
    if (await activate(index++, token)) sequenceTimer = setTimeout(next, 1500);
  };
  await next();
});
soundToggle.addEventListener("click", () => {
  muted = !muted;
  setMuted(muted);
  soundToggle.setAttribute("aria-pressed", String(muted));
  soundToggle.setAttribute(
    "aria-label",
    muted ? "Activar sonido" : "Silenciar sonido",
  );
  soundToggle.textContent = muted ? "Sonido: silenciado" : "Sonido: activo";
  status.textContent = muted
    ? "Sonido silenciado. Puedes explorar la progresión visualmente."
    : "Sonido activo. Toca un acorde para escucharlo.";
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    stopSequence();
    status.textContent = "Toca un acorde para escucharlo.";
  }
});
document.querySelector("#year").textContent = new Date().getFullYear();

// Stop decorative motion while out of view; no JS animation loop.
const hero = document.querySelector(".hero");
if ("IntersectionObserver" in window) {
  new IntersectionObserver((entries) =>
    hero.classList.toggle("offscreen", !entries[0].isIntersecting),
  ).observe(hero);
}
document.addEventListener("visibilitychange", () =>
  document.documentElement.classList.toggle("page-hidden", document.hidden),
);
