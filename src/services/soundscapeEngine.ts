/**
 * Vietnamese Traditional Soundscape & Instrument Audio Synthesis Engine
 * Tái hiện âm sắc Đàn Tranh, Đàn Bầu, Sáo Trúc, Chuông Đồng và Âm Cảnh Hoàng Cung bằng Web Audio API
 */

export interface TrackInfo {
  id: string;
  titleVi: string;
  titleEn: string;
  instrumentVi: string;
  instrumentEn: string;
  descriptionVi: string;
  descriptionEn: string;
  bpm: number;
}

export const SOUNDSCAPE_TRACKS: TrackInfo[] = [
  {
    id: 'luu-thuy',
    titleVi: 'Lưu Thủy Đoản Khúc',
    titleEn: 'Flowing Water Melody',
    instrumentVi: 'Đàn Tranh Cổ Phong',
    instrumentEn: 'Đàn Tranh (Zither Solo)',
    descriptionVi: 'Giai điệu ngũ cung Hò - Xự - Xang - Xê - Cống thanh thoát, róc rách tựa dòng suối tơ lụa.',
    descriptionEn: 'Ethereal Vietnamese pentatonic scale evoking flowing silk streams.',
    bpm: 72,
  },
  {
    id: 'da-co',
    titleVi: 'Dạ Cổ Hoài Lang',
    titleEn: 'Echoes of Longing',
    instrumentVi: 'Đàn Bầu & Đàn Tranh',
    instrumentEn: 'Đàn Bầu & Đàn Tranh Duet',
    descriptionVi: 'Âm sắc Đàn Bầu uốn lượn da diết quyện cùng tiếng gảy Đàn Tranh sâu lắng.',
    descriptionEn: 'Poignant monochord glissando harmonized with delicate zither plucks.',
    bpm: 60,
  },
  {
    id: 'vong-nguyet',
    titleVi: 'Vọng Nguyệt Dạ Khúc',
    titleEn: 'Moonlit Night Serenade',
    instrumentVi: 'Sáo Trúc & Đàn Cầm',
    instrumentEn: 'Bamboo Flute & Zither',
    descriptionVi: 'Tiếng sáo trúc vút cao phiêu diêu giữa màn sương hoàng thành tĩnh mịch.',
    descriptionEn: 'Soaring bamboo flute over serene imperial courtyard echoes.',
    bpm: 66,
  },
  {
    id: 'cung-dinh-kim-tien',
    titleVi: 'Cung Đình Kim Tiền',
    titleEn: 'Imperial Court Celebration',
    instrumentVi: 'Nhã Nhạc & Chuông Khánh',
    instrumentEn: 'Imperial Court Nhã Nhạc & Chimes',
    descriptionVi: 'Nhịp điệu Nhã Nhạc cung đình trang nghiêm, tiếng khánh đồng rộn ràng cung phụng.',
    descriptionEn: 'Stately royal court melodies accompanied by resonant bronze chimes.',
    bpm: 80,
  },
];

// Pentatonic Frequencies (Hz)
const NOTE_FREQS: Record<string, number> = {
  C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.00, A3: 220.00, B3: 246.94,
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00, B5: 987.77,
  C6: 1046.50, D6: 1174.66, E6: 1318.51, G6: 1567.98, A6: 1760.00,
};

// Traditional Melodies score sequences
const MELODIES: Record<string, { note: string; dur: number; inst: 'tranh' | 'bau' | 'sao' | 'bell'; bend?: number }[]> = {
  'luu-thuy': [
    { note: 'C4', dur: 0.5, inst: 'tranh' },
    { note: 'D4', dur: 0.5, inst: 'tranh' },
    { note: 'F4', dur: 0.5, inst: 'tranh' },
    { note: 'G4', dur: 1.0, inst: 'tranh' },
    { note: 'A4', dur: 0.5, inst: 'tranh' },
    { note: 'C5', dur: 1.0, inst: 'tranh' },
    { note: 'D5', dur: 0.5, inst: 'tranh' },
    { note: 'C5', dur: 0.5, inst: 'tranh' },
    { note: 'A4', dur: 0.5, inst: 'tranh' },
    { note: 'G4', dur: 1.5, inst: 'tranh' },
    { note: 'F4', dur: 0.5, inst: 'tranh' },
    { note: 'D4', dur: 0.5, inst: 'tranh' },
    { note: 'F4', dur: 0.5, inst: 'tranh' },
    { note: 'G4', dur: 0.5, inst: 'tranh' },
    { note: 'C4', dur: 2.0, inst: 'bell' },
    // Câu 2 biến tấu bổng
    { note: 'G4', dur: 0.5, inst: 'tranh' },
    { note: 'A4', dur: 0.5, inst: 'tranh' },
    { note: 'C5', dur: 0.5, inst: 'tranh' },
    { note: 'D5', dur: 1.0, inst: 'tranh' },
    { note: 'F5', dur: 0.5, inst: 'tranh' },
    { note: 'G5', dur: 1.5, inst: 'tranh' },
    { note: 'F5', dur: 0.5, inst: 'tranh' },
    { note: 'D5', dur: 0.5, inst: 'tranh' },
    { note: 'C5', dur: 0.5, inst: 'tranh' },
    { note: 'A4', dur: 1.0, inst: 'tranh' },
    { note: 'G4', dur: 0.5, inst: 'tranh' },
    { note: 'F4', dur: 0.5, inst: 'tranh' },
    { note: 'D4', dur: 1.0, inst: 'tranh' },
    { note: 'C4', dur: 2.5, inst: 'bell' },
  ],
  'da-co': [
    { note: 'C4', dur: 1.0, inst: 'bau', bend: 15 },
    { note: 'F4', dur: 1.5, inst: 'bau', bend: -10 },
    { note: 'G4', dur: 0.5, inst: 'tranh' },
    { note: 'A4', dur: 1.0, inst: 'tranh' },
    { note: 'C5', dur: 1.5, inst: 'bau', bend: 25 },
    { note: 'D5', dur: 0.5, inst: 'bau' },
    { note: 'C5', dur: 1.0, inst: 'bau', bend: -15 },
    { note: 'A4', dur: 1.5, inst: 'tranh' },
    { note: 'G4', dur: 0.5, inst: 'tranh' },
    { note: 'F4', dur: 1.5, inst: 'bau', bend: 20 },
    { note: 'D4', dur: 1.0, inst: 'bau' },
    { note: 'C4', dur: 2.5, inst: 'bell' },
    // Đoạn 2
    { note: 'G4', dur: 1.0, inst: 'bau', bend: 10 },
    { note: 'A4', dur: 0.5, inst: 'tranh' },
    { note: 'C5', dur: 1.5, inst: 'bau', bend: 30 },
    { note: 'D5', dur: 1.0, inst: 'bau', bend: -20 },
    { note: 'F5', dur: 1.5, inst: 'bau', bend: 15 },
    { note: 'D5', dur: 0.5, inst: 'tranh' },
    { note: 'C5', dur: 1.0, inst: 'tranh' },
    { note: 'A4', dur: 1.5, inst: 'bau', bend: -25 },
    { note: 'G4', dur: 1.0, inst: 'tranh' },
    { note: 'F4', dur: 1.0, inst: 'bau', bend: 10 },
    { note: 'C4', dur: 3.0, inst: 'bell' },
  ],
  'vong-nguyet': [
    { note: 'G4', dur: 1.5, inst: 'sao' },
    { note: 'A4', dur: 0.5, inst: 'sao' },
    { note: 'C5', dur: 2.0, inst: 'sao' },
    { note: 'D5', dur: 0.5, inst: 'tranh' },
    { note: 'F5', dur: 0.5, inst: 'tranh' },
    { note: 'G5', dur: 2.0, inst: 'sao' },
    { note: 'A5', dur: 0.5, inst: 'sao' },
    { note: 'G5', dur: 1.0, inst: 'sao' },
    { note: 'F5', dur: 0.5, inst: 'sao' },
    { note: 'D5', dur: 1.5, inst: 'tranh' },
    { note: 'C5', dur: 1.0, inst: 'tranh' },
    { note: 'A4', dur: 0.5, inst: 'sao' },
    { note: 'G4', dur: 1.5, inst: 'sao' },
    { note: 'F4', dur: 1.0, inst: 'sao' },
    { note: 'C4', dur: 2.5, inst: 'bell' },
  ],
  'cung-dinh-kim-tien': [
    { note: 'C4', dur: 0.5, inst: 'bell' },
    { note: 'G4', dur: 0.5, inst: 'tranh' },
    { note: 'G4', dur: 0.5, inst: 'tranh' },
    { note: 'A4', dur: 0.5, inst: 'tranh' },
    { note: 'C5', dur: 1.0, inst: 'tranh' },
    { note: 'D5', dur: 0.5, inst: 'tranh' },
    { note: 'C5', dur: 0.5, inst: 'tranh' },
    { note: 'A4', dur: 0.5, inst: 'tranh' },
    { note: 'G4', dur: 1.0, inst: 'tranh' },
    { note: 'F4', dur: 0.5, inst: 'bell' },
    { note: 'D4', dur: 0.5, inst: 'tranh' },
    { note: 'F4', dur: 0.5, inst: 'tranh' },
    { note: 'G4', dur: 0.5, inst: 'tranh' },
    { note: 'A4', dur: 0.5, inst: 'tranh' },
    { note: 'C4', dur: 1.5, inst: 'bell' },
  ],
};

class SoundscapeEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  
  // Ambient noise generators
  private windNode: AudioNode | null = null;
  private streamNode: AudioNode | null = null;
  private windGain: GainNode | null = null;
  private streamGain: GainNode | null = null;
  private birdsTimer: number | null = null;
  private chimesTimer: number | null = null;

  // Melody Sequencer state
  private isPlaying = false;
  private isMuted = false;
  private currentTrackId = 'luu-thuy';
  private masterVolume = 0.65;
  private noteStepIndex = 0;
  private sequenceTimer: number | null = null;

  // Environmental layers levels (0.0 to 1.0)
  public windLevel = 0.4;
  public streamLevel = 0.35;
  public birdsLevel = 0.3;
  public chimesLevel = 0.4;

  private onStateChangeCallbacks: Array<() => void> = [];

  constructor() {
    // Lazy audio context init on user gesture
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();

      // Master Gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.masterVolume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Music Gain
      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(0.8, this.ctx.currentTime);
      this.musicGain.connect(this.masterGain);

      // Ambient Gain
      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.6, this.ctx.currentTime);
      this.ambientGain.connect(this.masterGain);

      this.initAmbientNodes();
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  private initAmbientNodes() {
    if (!this.ctx || !this.ambientGain) return;

    // 1. Wind Generator (Pink/Brown noise with resonant sweeping low-pass filter)
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
      b6 = white * 0.115926;
    }

    const windSource = this.ctx.createBufferSource();
    windSource.buffer = noiseBuffer;
    windSource.loop = true;

    const windFilter = this.ctx.createBiquadFilter();
    windFilter.type = 'lowpass';
    windFilter.frequency.setValueAtTime(320, this.ctx.currentTime);
    windFilter.Q.setValueAtTime(2.5, this.ctx.currentTime);

    // LFO for swaying wind breeze
    const windLFO = this.ctx.createOscillator();
    windLFO.frequency.setValueAtTime(0.12, this.ctx.currentTime);
    const windLFOGain = this.ctx.createGain();
    windLFOGain.gain.setValueAtTime(140, this.ctx.currentTime);
    windLFO.connect(windLFOGain);
    windLFOGain.connect(windFilter.frequency);
    windLFO.start();

    this.windGain = this.ctx.createGain();
    this.windGain.gain.setValueAtTime(this.windLevel * 0.35, this.ctx.currentTime);

    windSource.connect(windFilter);
    windFilter.connect(this.windGain);
    this.windGain.connect(this.ambientGain);
    windSource.start();
    this.windNode = windSource;

    // 2. Flowing Stream Generator (Bandpass filtered bubbling noise)
    const streamSource = this.ctx.createBufferSource();
    streamSource.buffer = noiseBuffer;
    streamSource.loop = true;

    const streamFilter = this.ctx.createBiquadFilter();
    streamFilter.type = 'bandpass';
    streamFilter.frequency.setValueAtTime(800, this.ctx.currentTime);
    streamFilter.Q.setValueAtTime(1.8, this.ctx.currentTime);

    this.streamGain = this.ctx.createGain();
    this.streamGain.gain.setValueAtTime(this.streamLevel * 0.15, this.ctx.currentTime);

    streamSource.connect(streamFilter);
    streamFilter.connect(this.streamGain);
    this.streamGain.connect(this.ambientGain);
    streamSource.start();
    this.streamNode = streamSource;

    // 3. Start intermittent bird chirps and temple chimes
    this.startIntermittentAmbiance();
  }

  private startIntermittentAmbiance() {
    if (this.birdsTimer) clearInterval(this.birdsTimer);
    if (this.chimesTimer) clearInterval(this.chimesTimer);

    // Chirps every 4-8 seconds
    this.birdsTimer = window.setInterval(() => {
      if (this.isPlaying && !this.isMuted && this.birdsLevel > 0.05 && Math.random() > 0.3) {
        this.playBirdChirp();
      }
    }, 4500);

    // Wind chimes every 7-12 seconds
    this.chimesTimer = window.setInterval(() => {
      if (this.isPlaying && !this.isMuted && this.chimesLevel > 0.05 && Math.random() > 0.4) {
        this.playWindChime();
      }
    }, 8000);
  }

  private playBirdChirp() {
    if (!this.ctx || !this.ambientGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    const baseFreq = 2200 + Math.random() * 800;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq + 600, now + 0.08);
    osc.frequency.exponentialRampToValueAtTime(baseFreq + 200, now + 0.15);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(this.birdsLevel * 0.15, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

    osc.connect(gain);
    gain.connect(this.ambientGain);
    osc.start(now);
    osc.stop(now + 0.25);
  }

  private playWindChime() {
    if (!this.ctx || !this.ambientGain) return;
    const chimeFreqs = [NOTE_FREQS['G5'], NOTE_FREQS['A5'], NOTE_FREQS['C6'], NOTE_FREQS['D6'], NOTE_FREQS['E6']];
    const freq = chimeFreqs[Math.floor(Math.random() * chimeFreqs.length)];
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(this.chimesLevel * 0.12, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

    osc.connect(gain);
    gain.connect(this.ambientGain);
    osc.start(now);
    osc.stop(now + 2.6);
  }

  /**
   * Sound of Đàn Tranh (16/19 String Vietnamese Zither)
   */
  private playDanTranh(freq: number, duration: number) {
    if (!this.ctx || !this.musicGain) return;
    const now = this.ctx.currentTime;

    // Main plucked oscillator (triangle + sine harmonics)
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const osc3 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(freq, now);

    // Second harmonic for zither string shimmer
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2.01, now);

    // Subtle third harmonic
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(freq * 3.02, now);

    // Characteristic Đàn Tranh pitch vibrato (nhấn ngón)
    const vibrato = this.ctx.createOscillator();
    vibrato.frequency.setValueAtTime(4.8, now);
    const vibratoGain = this.ctx.createGain();
    vibratoGain.gain.setValueAtTime(freq * 0.015, now);
    vibrato.connect(vibratoGain);
    vibratoGain.connect(osc1.frequency);
    vibrato.start(now + 0.08);

    // Pluck Envelope
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.35, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.09, now + 0.18);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + Math.max(duration * 1.8, 1.2));

    osc1.connect(gain);
    osc2.connect(gain);
    osc3.connect(gain);
    gain.connect(this.musicGain);

    osc1.start(now);
    osc2.start(now);
    osc3.start(now);

    const stopTime = now + Math.max(duration * 2.0, 1.4);
    osc1.stop(stopTime);
    osc2.stop(stopTime);
    osc3.stop(stopTime);
    vibrato.stop(stopTime);
  }

  /**
   * Sound of Đàn Bầu (Vietnamese Monochord with smooth glissando pitch bend)
   */
  private playDanBau(freq: number, duration: number, bendCents = 0) {
    if (!this.ctx || !this.musicGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const subOsc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    subOsc.type = 'triangle';

    // Start slightly detuned for authentic flexible cane bend
    const startFreq = bendCents !== 0 ? freq * Math.pow(2, -bendCents / 1200) : freq * 0.96;
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(freq, now + 0.12);
    if (bendCents > 0) {
      osc.frequency.exponentialRampToValueAtTime(freq * Math.pow(2, bendCents / 1200), now + duration * 0.7);
    }

    subOsc.frequency.setValueAtTime(freq * 2, now);

    // Vocal vibrato
    const vibrato = this.ctx.createOscillator();
    vibrato.frequency.setValueAtTime(5.2, now);
    const vGain = this.ctx.createGain();
    vGain.gain.setValueAtTime(freq * 0.025, now);
    vibrato.connect(vGain);
    vGain.connect(osc.frequency);
    vibrato.start(now + 0.1);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.32, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.18, now + duration * 0.5);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration * 1.5);

    osc.connect(gain);
    subOsc.connect(gain);
    gain.connect(this.musicGain);

    osc.start(now);
    subOsc.start(now);

    const stopTime = now + duration * 1.6;
    osc.stop(stopTime);
    subOsc.stop(stopTime);
    vibrato.stop(stopTime);
  }

  /**
   * Sound of Sáo Trúc (Bamboo Flute)
   */
  private playSaoTruc(freq: number, duration: number) {
    if (!this.ctx || !this.musicGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq * 0.98, now);
    osc.frequency.exponentialRampToValueAtTime(freq, now + 0.06);

    // Flute breath vibrato
    const vibrato = this.ctx.createOscillator();
    vibrato.frequency.setValueAtTime(4.5, now);
    const vGain = this.ctx.createGain();
    vGain.gain.setValueAtTime(freq * 0.018, now);
    vibrato.connect(vGain);
    vGain.connect(osc.frequency);
    vibrato.start(now + 0.15);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.28, now + 0.1);
    gain.gain.setValueAtTime(0.25, now + duration * 0.7);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration * 1.4);

    osc.connect(gain);
    gain.connect(this.musicGain);

    osc.start(now);
    const stopTime = now + duration * 1.5;
    osc.stop(stopTime);
    vibrato.stop(stopTime);
  }

  /**
   * Imperial Bronze Bell / Chuông Đồng Cung Đình
   */
  private playImperialBell(freq: number, duration: number) {
    if (!this.ctx || !this.musicGain) return;
    const now = this.ctx.currentTime;

    const partials = [1.0, 1.48, 2.05, 2.76, 3.82];
    const partialGains = [0.35, 0.22, 0.15, 0.08, 0.04];

    partials.forEach((mult, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq * mult, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(partialGains[idx], now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + Math.max(duration * 2.2, 3.5));

      osc.connect(gain);
      gain.connect(this.musicGain!);

      osc.start(now);
      osc.stop(now + Math.max(duration * 2.5, 3.8));
    });
  }

  /**
   * Play single note step from score
   */
  private stepMelody() {
    if (!this.isPlaying || !this.ctx) return;

    const score = MELODIES[this.currentTrackId] || MELODIES['luu-thuy'];
    const track = SOUNDSCAPE_TRACKS.find(t => t.id === this.currentTrackId) || SOUNDSCAPE_TRACKS[0];
    const beatSeconds = 60 / track.bpm;

    const step = score[this.noteStepIndex];
    if (step) {
      const freq = NOTE_FREQS[step.note] || 440;
      const duration = step.dur * beatSeconds;

      if (step.inst === 'tranh') {
        this.playDanTranh(freq, duration);
      } else if (step.inst === 'bau') {
        this.playDanBau(freq, duration, step.bend || 0);
      } else if (step.inst === 'sao') {
        this.playSaoTruc(freq, duration);
      } else if (step.inst === 'bell') {
        this.playImperialBell(freq, duration);
      }

      // Schedule next note
      this.noteStepIndex = (this.noteStepIndex + 1) % score.length;
      this.sequenceTimer = window.setTimeout(() => {
        this.stepMelody();
      }, duration * 1000);
    }
  }

  public play() {
    this.initContext();
    if (this.isPlaying) return;

    this.isPlaying = true;
    this.stepMelody();
    this.notifyState();
  }

  public pause() {
    this.isPlaying = false;
    if (this.sequenceTimer) {
      clearTimeout(this.sequenceTimer);
      this.sequenceTimer = null;
    }
    this.notifyState();
  }

  public togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  public setTrack(trackId: string) {
    if (this.currentTrackId === trackId) return;
    this.currentTrackId = trackId;
    this.noteStepIndex = 0;
    if (this.sequenceTimer) {
      clearTimeout(this.sequenceTimer);
      this.sequenceTimer = null;
    }
    if (this.isPlaying) {
      this.stepMelody();
    }
    this.notifyState();
  }

  public nextTrack() {
    const currentIndex = SOUNDSCAPE_TRACKS.findIndex(t => t.id === this.currentTrackId);
    const nextIndex = (currentIndex + 1) % SOUNDSCAPE_TRACKS.length;
    this.setTrack(SOUNDSCAPE_TRACKS[nextIndex].id);
  }

  public prevTrack() {
    const currentIndex = SOUNDSCAPE_TRACKS.findIndex(t => t.id === this.currentTrackId);
    const prevIndex = (currentIndex - 1 + SOUNDSCAPE_TRACKS.length) % SOUNDSCAPE_TRACKS.length;
    this.setTrack(SOUNDSCAPE_TRACKS[prevIndex].id);
  }

  public setMasterVolume(vol: number) {
    this.masterVolume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.masterVolume, this.ctx.currentTime);
    }
    this.notifyState();
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.masterVolume, this.ctx.currentTime);
    }
    this.notifyState();
  }

  public setWindLevel(val: number) {
    this.windLevel = val;
    if (this.windGain && this.ctx) {
      this.windGain.gain.setValueAtTime(val * 0.35, this.ctx.currentTime);
    }
    this.notifyState();
  }

  public setStreamLevel(val: number) {
    this.streamLevel = val;
    if (this.streamGain && this.ctx) {
      this.streamGain.gain.setValueAtTime(val * 0.15, this.ctx.currentTime);
    }
    this.notifyState();
  }

  public setBirdsLevel(val: number) {
    this.birdsLevel = val;
    this.notifyState();
  }

  public setChimesLevel(val: number) {
    this.chimesLevel = val;
    this.notifyState();
  }

  public getState() {
    return {
      isPlaying: this.isPlaying,
      isMuted: this.isMuted,
      currentTrackId: this.currentTrackId,
      currentTrack: SOUNDSCAPE_TRACKS.find(t => t.id === this.currentTrackId) || SOUNDSCAPE_TRACKS[0],
      masterVolume: this.masterVolume,
      windLevel: this.windLevel,
      streamLevel: this.streamLevel,
      birdsLevel: this.birdsLevel,
      chimesLevel: this.chimesLevel,
    };
  }

  public subscribe(cb: () => void) {
    this.onStateChangeCallbacks.push(cb);
    return () => {
      this.onStateChangeCallbacks = this.onStateChangeCallbacks.filter(c => c !== cb);
    };
  }

  private notifyState() {
    for (const cb of this.onStateChangeCallbacks) {
      cb();
    }
  }
}

// Global Singleton Instance to maintain seamless playback across all React re-renders & realm routes
export const soundscapeEngine = new SoundscapeEngine();
