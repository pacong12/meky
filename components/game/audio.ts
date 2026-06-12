class RetroAudioSynth {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private musicInterval: any = null;
  
  constructor() {
    // Lazy initialization on user interaction
  }

  private initCtx() {
    if (this.ctx) return;
    if (typeof window === "undefined") return;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      this.ctx = new AudioContextClass();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopMusic();
    } else {
      this.playMusic();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  private playTone(freq: number, type: OscillatorType, duration: number, gainStart: number, pitchSweep?: number) {
    this.initCtx();
    if (!this.ctx || this.isMuted) return;
    
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }

    try {
      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      if (pitchSweep) {
        osc.frequency.exponentialRampToValueAtTime(pitchSweep, this.ctx.currentTime + duration);
      }

      gainNode.gain.setValueAtTime(gainStart, this.ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gainNode);
      gainNode.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn("Audio tone error:", e);
    }
  }

  private playNoise(duration: number, gainStart: number, sweepType: "lowpass" | "highpass" | "none") {
    this.initCtx();
    if (!this.ctx || this.isMuted) return;
    
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }

    try {
      const bufferSize = this.ctx.sampleRate * duration;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noiseNode = this.ctx.createBufferSource();
      noiseNode.buffer = buffer;

      const gainNode = this.ctx.createGain();
      gainNode.gain.setValueAtTime(gainStart, this.ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      let finalNode: AudioNode = noiseNode;

      if (sweepType !== "none") {
        const filter = this.ctx.createBiquadFilter();
        filter.type = sweepType;
        filter.frequency.setValueAtTime(sweepType === "lowpass" ? 1000 : 8000, this.ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(sweepType === "lowpass" ? 100 : 800, this.ctx.currentTime + duration);
        noiseNode.connect(filter);
        finalNode = filter;
      }

      finalNode.connect(gainNode);
      gainNode.connect(this.ctx.destination);

      noiseNode.start();
    } catch (e) {
      console.warn("Audio noise error:", e);
    }
  }

  public playWalk() {
    this.playTone(120, "triangle", 0.06, 0.08, 60);
  }

  public playAttack() {
    this.playNoise(0.12, 0.12, "highpass");
  }

  public playHit() {
    this.playTone(160, "sawtooth", 0.1, 0.15, 50);
    this.playNoise(0.06, 0.1, "none");
  }

  public playDefeat() {
    this.playNoise(0.35, 0.25, "lowpass");
  }

  public playDamage() {
    this.playTone(110, "sawtooth", 0.2, 0.22, 30);
  }

  public playChest() {
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, "sine", 0.12, 0.15);
      }, idx * 80);
    });
  }

  public playLevelUp() {
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50, 1318.51];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, "triangle", 0.2, 0.2);
      }, idx * 60);
    });
  }

  public playDoor() {
    this.playTone(70, "triangle", 0.4, 0.25, 40);
  }

  public playMusic() {
    this.initCtx();
    if (!this.ctx || this.isMuted) return;
    if (this.musicInterval) return;

    const progression = [
      [110.00, 165.00], // Am
      [98.00, 146.83],  // G
      [87.31, 130.81],  // F
      [116.54, 174.61]  // A#
    ];
    
    let step = 0;
    
    const playNote = () => {
      if (this.isMuted) return;
      const chords = progression[Math.floor(step / 4) % progression.length];
      const baseNote = chords[step % 2];
      
      this.playTone(baseNote, "triangle", 0.5, 0.04);
      
      if (step % 2 === 0 && Math.random() > 0.5) {
        const melody = [220.00, 261.63, 293.66, 329.63, 392.00, 440.00];
        const pitch = melody[Math.floor(Math.random() * melody.length)];
        this.playTone(pitch, "sine", 0.35, 0.02);
      }
      step++;
    };

    this.musicInterval = setInterval(playNote, 900);
  }

  public stopMusic() {
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }
}

export const retroAudio = new RetroAudioSynth();
