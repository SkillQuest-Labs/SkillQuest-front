// Service audio pour les effets sonores
class AudioService {
  private audioContext: AudioContext | null = null;
  private isInitialized = false;

  private async initAudioContext() {
    if (this.isInitialized) return;

    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.isInitialized = true;
    } catch (error) {
      console.warn("AudioContext non supporté:", error);
    }
  }

  // Son exact du coffre Zelda 8-bit (NES/Game Boy)
  async playChestSound() {
    await this.initAudioContext();
    if (!this.audioContext) return;

    const ctx = this.audioContext;
    const now = ctx.currentTime;

    // Séquence exacte du coffre Zelda 8-bit
    const notes = [
      { freq: 523.25, duration: 0.1, volume: 0.3 }, // C5
      { freq: 659.25, duration: 0.1, volume: 0.3 }, // E5
      { freq: 783.99, duration: 0.1, volume: 0.3 }, // G5
      { freq: 1046.5, duration: 0.2, volume: 0.4 }, // C6 (plus long et fort)
    ];

    notes.forEach((note, index) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      // Ondes carrées pour l'effet 8-bit authentique
      oscillator.type = "square";
      oscillator.frequency.setValueAtTime(note.freq, now);

      // Timing exact du coffre Zelda
      const startTime = now + index * 0.12; // 120ms entre chaque note

      // Enveloppe 8-bit : attack instantané, sustain, release court
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(note.volume, startTime + 0.001); // Attack instantané
      gainNode.gain.setValueAtTime(note.volume, startTime + note.duration * 0.8); // Sustain
      gainNode.gain.linearRampToValueAtTime(0, startTime + note.duration); // Release court

      oscillator.start(startTime);
      oscillator.stop(startTime + note.duration);
    });

    // Son final caractéristique du coffre (note aiguë avec vibrato)
    setTimeout(() => {
      this.playZelda8BitFinal(ctx, now + 0.5);
    }, 500);
  }

  // Son final 8-bit du coffre Zelda (note aiguë avec vibrato)
  private playZelda8BitFinal(ctx: AudioContext, startTime: number) {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Onde carrée pour l'authenticité 8-bit
    oscillator.type = "square";
    oscillator.frequency.setValueAtTime(1567.98, startTime); // G6

    // Vibrato caractéristique du coffre Zelda
    const vibratoFreq = 5; // 5Hz de vibrato
    const vibratoDepth = 50; // 50Hz d'amplitude
    const vibratoOscillator = ctx.createOscillator();
    const vibratoGain = ctx.createGain();

    vibratoOscillator.connect(vibratoGain);
    vibratoGain.connect(oscillator.frequency);

    vibratoOscillator.type = "sine";
    vibratoOscillator.frequency.setValueAtTime(vibratoFreq, startTime);
    vibratoGain.gain.setValueAtTime(vibratoDepth, startTime);

    // Enveloppe 8-bit : attack instantané, sustain, release
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(0.4, startTime + 0.001);
    gainNode.gain.setValueAtTime(0.4, startTime + 0.15);
    gainNode.gain.linearRampToValueAtTime(0, startTime + 0.3);

    vibratoOscillator.start(startTime);
    vibratoOscillator.stop(startTime + 0.3);
    oscillator.start(startTime);
    oscillator.stop(startTime + 0.3);
  }

  // Effet sonore de gain XP (plus court)
  async playXpGainSound() {
    await this.initAudioContext();
    if (!this.audioContext) return;

    const ctx = this.audioContext;
    const now = ctx.currentTime;

    // Son plus aigu et court pour le gain XP
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(800, now);
    oscillator.frequency.exponentialRampToValueAtTime(1200, now + 0.1);

    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.2, now + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    oscillator.start(now);
    oscillator.stop(now + 0.2);
  }

  // Effet sonore de niveau up
  async playLevelUpSound() {
    await this.initAudioContext();
    if (!this.audioContext) return;

    const ctx = this.audioContext;
    const now = ctx.currentTime;

    // Séquence ascendante pour le level up
    const frequencies = [261.63, 329.63, 392.0, 523.25]; // C4, E4, G4, C5
    const durations = [0.15, 0.15, 0.15, 0.3];

    frequencies.forEach((freq, index) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(freq, now + index * 0.1);

      gainNode.gain.setValueAtTime(0, now + index * 0.1);
      gainNode.gain.linearRampToValueAtTime(0.25, now + index * 0.1 + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + index * 0.1 + durations[index]);

      oscillator.start(now + index * 0.1);
      oscillator.stop(now + index * 0.1 + durations[index]);
    });
  }
}

export const audioService = new AudioService();
