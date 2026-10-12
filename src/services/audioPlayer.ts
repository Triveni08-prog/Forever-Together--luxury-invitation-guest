/**
 * Luxury Indian Wedding Audio Experience
 * Supports both custom external audio URLs and an authentic Web Audio API
 * procedural synthesizer generating calming Raag Yaman / Bhoopali shehnai & tanpura harmony.
 */

class WeddingAudioManager {
  private audioEl: HTMLAudioElement | null = null;
  private audioCtx: AudioContext | null = null;
  private isSynthesizing = false;
  private isPlaying = false;
  private isMuted = false;
  private volume = 0.5;
  private synthInterval: number | null = null;
  private activeNodes: (OscillatorNode | GainNode)[] = [];
  private listeners: Set<(isPlaying: boolean, isMuted: boolean) => void> = new Set();

  public subscribe(fn: (isPlaying: boolean, isMuted: boolean) => void) {
    this.listeners.add(fn);
    fn(this.isPlaying, this.isMuted);
    return () => {
      this.listeners.delete(fn);
    };
  }

  private notify() {
    this.listeners.forEach((fn) => fn(this.isPlaying, this.isMuted));
  }

  public getStatus() {
    return { isPlaying: this.isPlaying, isMuted: this.isMuted };
  }

  public async startAudio(customUrl?: string) {
    if (this.isPlaying) return;

    if (customUrl && customUrl.trim().length > 0) {
      try {
        if (!this.audioEl) {
          this.audioEl = new Audio(customUrl);
          this.audioEl.loop = true;
        } else {
          this.audioEl.src = customUrl;
        }
        this.audioEl.volume = this.isMuted ? 0 : this.volume;
        await this.audioEl.play();
        this.isPlaying = true;
        this.notify();
        return;
      } catch (err) {
        console.warn('Custom audio playback failed, falling back to palace acoustic synthesis:', err);
      }
    }

    // Procedural Indian Classical Ambient (Tanpura & Shehnai notes)
    try {
      if (typeof window === 'undefined') return;
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) {
        console.info('Web Audio not supported in this environment');
        return;
      }
      if (!this.audioCtx) {
        this.audioCtx = new AudioContextClass();
      }
      if (this.audioCtx.state === 'suspended') {
        await this.audioCtx.resume();
      }
      this.isSynthesizing = true;
      this.isPlaying = true;
      this.startTanpuraDrone();
      this.startShehnaiMelody();
      this.notify();
    } catch (e) {
      console.warn('Web Audio synthesis could not initialize:', e);
      this.isPlaying = false;
      this.notify();
    }
  }

  public pauseAudio() {
    if (this.audioEl) {
      this.audioEl.pause();
    }
    if (this.synthInterval) {
      window.clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
    this.activeNodes.forEach((node) => {
      try {
        if ('stop' in node) (node as OscillatorNode).stop();
        node.disconnect();
      } catch {
        // ignore
      }
    });
    this.activeNodes = [];
    this.isSynthesizing = false;
    this.isPlaying = false;
    this.notify();
  }

  public togglePlay(customUrl?: string) {
    if (this.isPlaying) {
      this.pauseAudio();
    } else {
      this.startAudio(customUrl);
    }
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.audioEl) {
      this.audioEl.volume = this.isMuted ? 0 : this.volume;
    }
    this.notify();
  }

  // Raag Yaman notes (Sa, Re, Ga, Ma(tivra), Pa, Dha, Ni)
  private startTanpuraDrone() {
    if (!this.audioCtx) return;
    const baseFreq = 146.83; // D3 root
    const droneFreqs = [baseFreq, baseFreq * 1.5, baseFreq * 2]; // Sa, Pa, high Sa

    droneFreqs.forEach((freq) => {
      if (!this.audioCtx) return;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      const filter = this.audioCtx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, this.audioCtx.currentTime);

      gain.gain.setValueAtTime(this.isMuted ? 0 : 0.03, this.audioCtx.currentTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      this.activeNodes.push(osc, gain);
    });
  }

  private startShehnaiMelody() {
    if (!this.audioCtx) return;
    // Pentatonic Bhoopali notes: Sa, Re, Ga, Pa, Dha (D, E, F#, A, B)
    const scale = [293.66, 329.63, 369.99, 440.00, 493.88, 587.33, 659.25, 739.99];

    let noteIdx = 0;
    this.synthInterval = window.setInterval(() => {
      if (!this.audioCtx || !this.isSynthesizing || this.isMuted) return;

      const freq = scale[noteIdx % scale.length];
      noteIdx = (noteIdx + Math.floor(Math.random() * 3) + 1) % scale.length;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      const filter = this.audioCtx.createBiquadFilter();

      // Shehnai has rich nasal reed timbre with gentle portamento
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * (1 + 0.015 * Math.sin(10)), this.audioCtx.currentTime + 1.2);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, this.audioCtx.currentTime);
      filter.Q.setValueAtTime(3.5, this.audioCtx.currentTime);

      const now = this.audioCtx.currentTime;
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.045 * this.volume, now + 0.4);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 2.3);
    }, 2800);
  }
}

export const weddingAudio = new WeddingAudioManager();
