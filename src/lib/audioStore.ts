"use client";

class AudioStore {
  private static instance: AudioStore;
  private ctx: AudioContext | null = null;

  private constructor() {}

  public static getInstance(): AudioStore {
    if (!AudioStore.instance) {
      AudioStore.instance = new AudioStore();
    }
    return AudioStore.instance;
  }

  public getContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    
    if (!this.ctx) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    
    if (this.ctx?.state === "suspended") {
      this.ctx.resume();
    }
    
    return this.ctx;
  }

  public playClickSound() {
    if (typeof window === "undefined") return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const bufferSize = ctx.sampleRate * 0.4;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.05));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(400, ctx.currentTime);
      filter.Q.setValueAtTime(1.5, ctx.currentTime);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();

      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(200, ctx.currentTime + 0.05);
      osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.25);
      oscGain.gain.setValueAtTime(0, ctx.currentTime + 0.05);
      oscGain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.1);
      oscGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.connect(oscGain);
      oscGain.connect(ctx.destination);
      osc.start(ctx.currentTime + 0.05);
      osc.stop(ctx.currentTime + 0.35);
    } catch {
    }
  }

  public playBubbleSound(volume = 0.1) {
    if (typeof window === "undefined") return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "sine";
      const freq = 200 + Math.random() * 150;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.8, ctx.currentTime + 0.1); 

      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(volume * 0.5, ctx.currentTime + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.15);
    } catch {
    }
  }

  public playHitSound(volume = 0.1) {
    if (typeof window === "undefined") return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
      
      osc.type = "sine";
      const baseFreq = 700 + Math.random() * 300; 
      osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.9, ctx.currentTime + 0.4);

      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(volume * 0.6, ctx.currentTime + 0.015); 
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4); 

      osc.connect(gain);
      
      if (panner) {
        panner.pan.setValueAtTime((Math.random() * 1.4) - 0.7, ctx.currentTime);
        gain.connect(panner);
        panner.connect(ctx.destination);
      } else {
        gain.connect(ctx.destination);
      }

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.45);
    } catch {
    }
  }
}

export const audioStore = AudioStore.getInstance();
