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
    
    // Resume context if it was suspended (common browser policy)
    if (this.ctx?.state === "suspended") {
      this.ctx.resume();
    }
    
    return this.ctx;
  }
}

export const audioStore = AudioStore.getInstance();
