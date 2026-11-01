const MESSAGES = {
  idle: 'Microphone off. You can simulate a call first.', requesting: 'Please allow microphone access in the browser...',
  listening: 'Analyzing volume locally. No recording, transcription or audio uploads.', ready: 'Audio unlocked. Simulated calls do not use the microphone.',
  stopped: 'Stopped. Microphone tracks and audio resources released.', denied: 'Microphone permission denied. Allow it in the browser or simulate a call.',
  unavailable: 'Microphone unavailable. Use localhost or HTTPS, or simulate a call.',
  'no-device': 'No microphone found. Simulated calls remain available.', error: 'Microphone unavailable or busy. Retry or simulate a call.',
  ended: 'Microphone disconnected. Re-enable it or simulate a call.', 'audio-error': 'Audio could not start. Click again to retry.',
};

// Original electronic-organic soundprints, including the whale; these are not animal recordings.
const SOUNDS = {
  jelly: {base: 174.61, tone: 1, ring: .045, rate: 1.2, noise: .13, bend: -.018, tremolo: 2.4, ratio: 1.4983},
  fish: {base: 261.63, tone: .9, ring: .12, rate: 5.2, noise: .13, bend: .045, tremolo: 4, ratio: 1.4983},
  mollusc: {base: 110, tone: 1, ring: .045, rate: 2.1, noise: .2, bend: -.018, tremolo: 11, ratio: 1.4983},
  whale: {base: 55, tone: 1.15, ring: .11, rate: 1.7, noise: .1, bend: -.028, tremolo: 1.4, ratio: 2.003},
  shark: {base: 82.41, tone: .65, ring: .04, rate: .7, noise: .8, bend: -.012, tremolo: 3.2, ratio: 1.33},
  angelfish: {base: 349.23, tone: .8, ring: .09, rate: 3.3, noise: .12, bend: .024, tremolo: 5.2, ratio: 1.25},
  butterflyfish: {base: 440, tone: .7, ring: .14, rate: 6.4, noise: .09, bend: .032, tremolo: 8, ratio: 1.667},
  tang: {base: 293.66, tone: .85, ring: .13, rate: 4.7, noise: .16, bend: .052, tremolo: 6.4, ratio: 1.414},
  algae: {base: 783.99, tone: .5, ring: .14, rate: 13.7, noise: .65, bend: .009, tremolo: 17, ratio: 1.732},
};

// Replace this buffer maker to use authored samples while retaining the same bounded playback lifecycle.
function makeSoundprint(context, species) {
  const sampleRate = 24000, length = Math.floor(sampleRate * 4.1);
  const buffer = context.createBuffer(2, length, sampleRate), sound = SOUNDS[species];
  const dry = new Float32Array(length);
  let seed = 9217, breath = 0;
  for (let i = 0; i < length; i++) {
    const t = i / sampleRate, fade = Math.sin(Math.PI * Math.min(1, t / 3.1)) ** 2;
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    breath += (((seed / 4294967296) * 2 - 1) - breath) * .075;
    const bend = sound.bend * (sound.bend > 0 ? Math.sin(t * 4) : t);
    const phase = 2 * Math.PI * sound.base * (t + bend * t * .5) + .8 * Math.sin(t * 4.2);
    let voice = Math.sin(phase) * .3 + Math.sin(phase * sound.ratio + .2 * Math.sin(t * 3)) * .17 + Math.sin(phase * 2.002) * .075;
    voice *= sound.tone * (.76 + .24 * Math.sin(t * sound.tremolo));
    const ringAge = (t * sound.rate) % 1;
    const ring = Math.exp(-ringAge * (species === 'whale' ? 55 : 16)) * (Math.sin(phase * (species === 'whale' ? 24.7 : 3.43)) + .4 * Math.sin(phase * 5.17));
    const grain = species === 'algae' ? .3 + .7 * Math.sin(t * 37) ** 8 : 1;
    dry[i] = t < 3.1 ? (voice + ring * sound.ring + breath * sound.noise) * grain * fade * .34 : 0;
  }
  for (let channel = 0; channel < 2; channel++) {
    const data = buffer.getChannelData(channel);
    for (let i = 0; i < length; i++) {
      let value = dry[i];
      for (const [delay, gain] of [[.137, .24], [.271, .14], [.449, .09], [.733, .04]]) {
        const index = i - Math.floor((delay + channel * .019) * sampleRate);
        if (index >= 0) value += dry[index] * gain;
      }
      data[i] = Math.tanh(value) * .8;
    }
  }
  return buffer;
}

export function createMarineAudio() {
  const waveform = new Float32Array(1024), buffers = new Map(), voices = new Set();
  let context = null, stream = null, input = null, analyser = null, generation = 0, pending = null;
  let status = 'idle', disposed = false;
  function setStatus(next) { status = next; }
  function release() {
    const oldStream = stream, oldContext = context;
    input?.disconnect(); analyser?.disconnect();
    stream = input = analyser = context = null;
    oldStream?.getTracks().forEach(track => track.stop());
    voices.forEach(voice => { try { voice.stop(); } catch {} voice.disconnect(); });
    voices.clear(); buffers.clear(); waveform.fill(0);
    if (oldContext && oldContext.state !== 'closed') Promise.resolve(oldContext.close()).catch(() => {});
  }
  function stop() { generation++; pending = null; release(); setStatus('stopped'); }
  function finishInput(){generation++;pending=null;const oldStream=stream;input?.disconnect();analyser?.disconnect();stream=input=analyser=null;oldStream?.getTracks().forEach(track=>track.stop());waveform.fill(0);setStatus(context?.state==='running'?'ready':'stopped');}
  async function unlock() {
    if (disposed) return false;
    const token = generation;
    try {
      const Constructor = globalThis.AudioContext || globalThis.webkitAudioContext;
      if (!Constructor) { setStatus('audio-error'); return false; }
      if (!context || context.state === 'closed') context = new Constructor();
      const current = context;
      await current.resume();
      if (token !== generation || current !== context || disposed) return false;
      if (current.state !== 'running') { release(); setStatus('audio-error'); return false; }
      if (!stream && status !== 'requesting') setStatus('ready');
      return true;
    } catch { if (token === generation) { release(); setStatus('audio-error'); } return false; }
  }
  function start() {
    if (disposed) return Promise.resolve(false);
    if (stream) return Promise.resolve(true);
    if (pending) return pending;
    const token = generation;
    setStatus('requesting');
    const operation = (async () => {
      if (!globalThis.navigator?.mediaDevices?.getUserMedia) { release(); setStatus('unavailable'); return false; }
      if (!await unlock()) return false;
      let acquired;
      try {
        acquired = await navigator.mediaDevices.getUserMedia({audio: {echoCancellation: true, noiseSuppression: true, autoGainControl: true}, video: false});
        if (token !== generation || disposed) { acquired.getTracks().forEach(track => track.stop()); return false; }
        stream = acquired;
        analyser = context.createAnalyser(); analyser.fftSize = waveform.length; analyser.smoothingTimeConstant = .72;
        input = context.createMediaStreamSource(stream); input.connect(analyser);
        // The microphone has no route to the speakers; only a response buffer reaches destination.
        stream.getTracks().forEach(track => track.addEventListener('ended', () => {
          if (stream !== acquired) return;
          stop(); setStatus('ended');
        }, {once: true}));
        setStatus('listening'); return true;
      } catch (error) {
        acquired?.getTracks().forEach(track => track.stop());
        if (token !== generation || disposed) return false;
        release();
        setStatus(error.name === 'NotAllowedError' || error.name === 'SecurityError' ? 'denied' : error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError' ? 'no-device' : 'error');
        return false;
      }
    })();
    pending = operation;
    operation.finally(() => { if (pending === operation) pending = null; });
    return operation;
  }
  function update() {
    if (!analyser || context?.state !== 'running') { waveform.fill(0); return 0; }
    analyser.getFloatTimeDomainData(waveform);
    let energy = 0;
    for (const value of waveform) energy += value * value;
    return Math.min(1, Math.sqrt(energy / waveform.length));
  }
  function respond(species) {
    if (typeof species !== 'string' || !Object.hasOwn(SOUNDS, species)) throw new TypeError('Unknown marine soundprint.');
    if (!context || context.state !== 'running') return false;
    voices.forEach(voice => { try { voice.stop(); } catch {} voice.disconnect(); }); voices.clear();
    if (!buffers.has(species)) buffers.set(species, makeSoundprint(context, species));
    const voice = context.createBufferSource(); voice.buffer = buffers.get(species);
    voice.connect(context.destination); voices.add(voice);
    voice.onended = () => { voices.delete(voice); voice.disconnect(); };
    voice.start(); return true;
  }
  return {
    start, unlock, stop, finishInput, update, respond, waveform,
    get status() { return status; }, get message() { return MESSAGES[status]; },
    diagnostics: () => ({status, contextState: context?.state || 'closed', activeTracks: stream?.getTracks().filter(track => track.readyState === 'live').length || 0, activeVoices: voices.size, pending: !!pending, recordsAudio: false, uploadsAudio: false}),
    dispose() { disposed = true; stop(); },
  };
}
