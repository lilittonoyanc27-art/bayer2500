/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Music, 
  HelpCircle, 
  GraduationCap, 
  Award, 
  Play, 
  RotateCcw, 
  ArrowRight, 
  BookOpen, 
  Crown, 
  Smile, 
  CheckCircle, 
  Flame, 
  Heart, 
  Keyboard, 
  ChevronRight, 
  Gamepad2, 
  Info,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { VERB_EXERCISES, PIANO_SONGS, VerbExercise, PianoSong } from './verbs';

// Middle octave and higher frequencies for our synthesizer piano notes
const PIANO_NOTES = [
  { note: "C4", frequency: 261.63, isBlack: false, label: "Do" },
  { note: "C#4", frequency: 277.18, isBlack: true, label: "Do#" },
  { note: "D4", frequency: 293.66, isBlack: false, label: "Re" },
  { note: "D#4", frequency: 311.13, isBlack: true, label: "Re#" },
  { note: "E4", frequency: 329.63, isBlack: false, label: "Mi" },
  { note: "F4", frequency: 349.23, isBlack: false, label: "Fa" },
  { note: "F#4", frequency: 369.99, isBlack: true, label: "Fa#" },
  { note: "G4", frequency: 392.00, isBlack: false, label: "Sol" },
  { note: "G#4", frequency: 415.30, isBlack: true, label: "Sol#" },
  { note: "A4", frequency: 440.00, isBlack: false, label: "La" },
  { note: "A#4", frequency: 466.16, isBlack: true, label: "La#" },
  { note: "B4", frequency: 493.88, isBlack: false, label: "Si" },
  { note: "C5", frequency: 523.25, isBlack: false, label: "Do (2)" },
  { note: "C#5", frequency: 554.37, isBlack: true, label: "Do#2" },
  { note: "D5", frequency: 587.33, isBlack: false, label: "Re (2)" },
  { note: "D#5", frequency: 622.25, isBlack: true, label: "Re#2" },
  { note: "E5", frequency: 659.25, isBlack: false, label: "Mi (2)" },
  { note: "F5", frequency: 698.46, isBlack: false, label: "Fa (2)" },
  { note: "F#5", frequency: 739.99, isBlack: true, label: "Fa#2" },
  { note: "G5", frequency: 783.99, isBlack: false, label: "Sol (2)" }
];

// Map a white note index to actual physical computer keyboard keys for easy playing
// Keyboard rows: A S D F G H J K L ; ' for white keys
const COMPUTER_KEY_BINDS: { [key: string]: string } = {
  'a': 'C4',
  'w': 'C#4',
  's': 'D4',
  'e': 'D#4',
  'd': 'E4',
  'f': 'F4',
  't': 'F#4',
  'g': 'G4',
  'y': 'G#4',
  'h': 'A4',
  'u': 'A#4',
  'j': 'B4',
  'k': 'C5',
  'o': 'C#5',
  'l': 'D5',
  'p': 'D#5',
  ';': 'E5',
  '\'': 'F5',
};

// Pink-Color theme configurations
interface VisualTheme {
  primaryBg: string;
  cardBg: string;
  tintBg: string;
  accentColor: string;
  textColor: string;
  headingColor: string;
  pianoWhiteKey: string;
  pianoBlackKey: string;
}

const THEMES: { [key: string]: VisualTheme } = {
  frosted_glass: {
    primaryBg: "bg-gradient-to-br from-[#1b0213] via-[#350220] to-[#0a0026] text-pink-100 relative",
    cardBg: "bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_0_rgba(255,20,147,0.15)]",
    tintBg: "bg-white/5 border border-white/10 text-pink-200",
    accentColor: "bg-gradient-to-r from-[#de1e7e] to-[#ff6584] hover:from-[#ff6584] hover:to-[#de1e7e] text-white shadow-[#de1e7e]/20 border border-white/10",
    textColor: "text-pink-100/90",
    headingColor: "text-transparent bg-clip-text bg-gradient-to-r from-[#ff8ebb] via-pink-300 to-fuchsia-400 font-display",
    pianoWhiteKey: "from-white/95 to-[#ffeef4]/90 text-slate-900 border-pink-200",
    pianoBlackKey: "from-pink-600 to-[#4d0026] border-pink-800"
  },
  barbie: {
    primaryBg: "bg-radial from-[#fff0f6] via-[#ffe3ec] to-[#ffb3cd]",
    cardBg: "bg-white/90 backdrop-blur-md shadow-[0_8px_30px_rgb(255,105,180,0.15)] border-2 border-[#ff85b3]/30",
    tintBg: "bg-[#fff0f6] border-[#ffb3cd]/40",
    accentColor: "bg-[#ff4081] hover:bg-[#e91e63] text-white shadow-[#ff4081]/30",
    textColor: "text-[#6d214f]",
    headingColor: "text-[#de1e7e] font-display",
    pianoWhiteKey: "from-white to-[#ffe3e3]",
    pianoBlackKey: "from-[#ef4499] to-[#bf1768]"
  },
  sakura: {
    primaryBg: "bg-gradient-to-tr from-[#ffeef2] via-[#ffd5e2] to-[#fcb1ca]",
    cardBg: "bg-white/85 backdrop-blur-md shadow-[0_10px_25px_rgba(240,128,128,0.12)] border border-[#ffb7b2]/45",
    tintBg: "bg-[#fdf0f4] border-[#fcb1ca]/35",
    accentColor: "bg-[#ff8da1] hover:bg-[#ff7991] text-white shadow-[#ff8da1]/20",
    textColor: "text-[#5c2e37]",
    headingColor: "text-[#ff6584] font-display",
    pianoWhiteKey: "from-[#fffcfd] to-[#ffdce6]",
    pianoBlackKey: "from-[#db5c84] to-[#99264c]"
  },
  unicorn: {
    primaryBg: "bg-gradient-to-br from-[#ebedfa] via-[#f7d6e0] to-[#f2b5d4]",
    cardBg: "bg-white/80 backdrop-blur-md shadow-[0_8px_32px_rgba(138,43,226,0.12)] border border-[#ea9ab2]/40",
    tintBg: "bg-[#f5eef7] border-[#f2b5d4]/40",
    accentColor: "bg-gradient-to-r from-[#9c27b0] to-[#e040fb] hover:opacity-90 text-white shadow-purple-200",
    textColor: "text-[#3f194c]",
    headingColor: "text-[#8e24aa] font-display",
    pianoWhiteKey: "from-[#fafaff] to-[#ebdcf5]",
    pianoBlackKey: "from-[#9c27b0] to-[#4a0072]"
  },
  cream: {
    primaryBg: "bg-gradient-to-r from-[#fff3f3] to-[#ffd6da]",
    cardBg: "bg-white/95 shadow-lg border border-[#fca5a5]/30",
    tintBg: "bg-[#fff8f8] border-[#fca5a5]/20",
    accentColor: "bg-[#f87171] hover:bg-[#ef4444] text-white shadow-red-200",
    textColor: "text-[#7f1d1d]",
    headingColor: "text-[#dc2626] font-display",
    pianoWhiteKey: "from-[#fffffb] to-[#ffebeb]",
    pianoBlackKey: "from-[#b91c1c] to-[#7f1d1d]"
  }
};

export default function App() {
  // --- STATE DECLARATIONS ---
  const [activeTab, setActiveTab] = useState<'quest' | 'free_play' | 'learn'>('quest');
  const [score, setScore] = useState<number>(() => {
    const saved = localStorage.getItem('piano_spanish_score');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [streak, setStreak] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    const saved = localStorage.getItem('piano_spanish_highscore');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [currentTheme, setCurrentTheme] = useState<keyof typeof THEMES>('frosted_glass');
  const [instrument, setInstrument] = useState<'piano' | 'music_box' | 'synth'>('music_box');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  
  // Custom Audio Context ref to lazily resume/initialize
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Quest game states
  const [exercisePool, setExercisePool] = useState<VerbExercise[]>(() => VERB_EXERCISES);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState<number>(0);
  const [typedAnswer, setTypedAnswer] = useState<string>('');
  const [showHint, setShowHint] = useState<boolean>(false);
  const [shakeTrigger, setShakeTrigger] = useState<boolean>(false);
  const [completedList, setCompletedList] = useState<string[]>([]);
  const [shuffledLetterKeycaps, setShuffledLetterKeycaps] = useState<string[]>([]);
  const [genderFilter, setGenderFilter] = useState<'all' | 'futuro_simple' | 'futuro_perfecto'>('all');
  const [successAnimation, setSuccessAnimation] = useState<boolean>(false);
  
  // Song book play states
  const [activeSongIndex, setActiveSongIndex] = useState<number | null>(null);
  const [songProgressIndex, setSongProgressIndex] = useState<number>(0);
  const [autoPlayTimerId, setAutoPlayTimerId] = useState<number | any>(null);
  const [activeAutoNote, setActiveAutoNote] = useState<string | null>(null);
  const [activeKeyPressed, setActiveKeyPressed] = useState<string | null>(null);

  const activeTheme = THEMES[currentTheme];
  const currentExercise = exercisePool[currentExerciseIndex] || exercisePool[0];

  // Map Spanish accented vowels to plain ones for extremely comfortable physical keyboard inputs
  const ACCENT_MAP: { [key: string]: string } = {
    'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u', 'ñ': 'n'
  };

  // --- AUDIO SYNTH ENGINE ---
  const initAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  const playSound = useCallback((frequency: number, type: 'piano' | 'music_box' | 'synth' = instrument) => {
    if (!soundEnabled) return;
    try {
      const ctx = initAudio();
      const now = ctx.currentTime;
      
      const gainNode = ctx.createGain();
      gainNode.connect(ctx.destination);
      
      if (type === 'piano') {
        // Fundamental Warmth
        const osc1 = ctx.createOscillator();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(frequency, now);
        
        // Fast attack, mellow decay
        const osc2 = ctx.createOscillator();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(frequency * 2, now); // Sweet octave higher
        
        const gain1 = ctx.createGain();
        const gain2 = ctx.createGain();
        
        gain1.gain.setValueAtTime(0.4, now);
        gain2.gain.setValueAtTime(0.15, now);
        
        osc1.connect(gain1);
        osc2.connect(gain2);
        
        gain1.connect(gainNode);
        gain2.connect(gainNode);
        
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.5, now + 0.015);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
        
        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 1.4);
        osc2.stop(now + 1.4);
        
      } else if (type === 'music_box') {
        // High-pitched crystal bell sound (Cute Chimes)
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(frequency, now);
        
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(frequency * 4, now); // Beautiful shimmer higher octaves
        
        const g1 = ctx.createGain();
        const g2 = ctx.createGain();
        
        g1.gain.setValueAtTime(0.45, now);
        g2.gain.setValueAtTime(0.25, now);
        
        osc1.connect(g1);
        osc2.connect(g2);
        
        g1.connect(gainNode);
        g2.connect(gainNode);
        
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.6, now + 0.006);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 1.8); // Shimmering resonance
        
        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 2.0);
        osc2.stop(now + 2.0);
        
      } else {
        // Cute cosmic retro wave
        const osc = ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(frequency, now);
        
        osc.connect(gainNode);
        
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.35, now + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
        
        osc.start(now);
        osc.stop(now + 0.8);
      }
    } catch (err) {
      console.warn("Web Audio failure:", err);
    }
  }, [instrument, soundEnabled, initAudio]);

  // Happy celebration arpeggio played when a word is solved!
  const playVictoryArpeggio = useCallback(() => {
    if (!soundEnabled) return;
    const notesToPlay = [
      { freq: 261.63, delay: 0 },   // C4
      { freq: 329.63, delay: 100 }, // E4
      { freq: 392.00, delay: 200 }, // G4
      { freq: 523.25, delay: 300 }, // C5
      { freq: 659.25, delay: 400 }, // E5
      { freq: 783.99, delay: 500 }, // G5
      { freq: 1046.50, delay: 650 }, // C6
    ];
    
    notesToPlay.forEach(n => {
      setTimeout(() => {
        playSound(n.freq, 'music_box');
      }, n.delay);
    });
  }, [soundEnabled, playSound]);

  // Error feedback chord
  const playErrorBuzz = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const ctx = initAudio();
      const now = ctx.currentTime;
      const gainNode = ctx.createGain();
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();

      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(130, now); // Low frequency
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(133, now); // Slightly detuned

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);

      gainNode.gain.setValueAtTime(0.3, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.5);
      osc2.stop(now + 0.5);
    } catch (e) {
      console.log(e);
    }
  }, [soundEnabled, initAudio]);

  // --- SCORE SAVING & HIGH SCORE ---
  useEffect(() => {
    localStorage.setItem('piano_spanish_score', score.toString());
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('piano_spanish_highscore', score.toString());
    }
  }, [score, highScore]);

  // --- FILTER EXERCISE POOL ---
  useEffect(() => {
    let filtered = VERB_EXERCISES;
    if (genderFilter !== 'all') {
      filtered = VERB_EXERCISES.filter(ex => ex.tense === genderFilter);
    }
    setExercisePool(filtered);
    setCurrentExerciseIndex(0);
    setTypedAnswer('');
    setShowHint(false);
  }, [genderFilter]);

  // --- GENERATE KEYCAP LETTER BOARD ---
  // We extract the unique letters of the *entire correct answer* and pad them
  // with some common letters of the Spanish alphabet to make a beautiful, highly interactive 
  // pink spelling keycaps tray.
  const rebuildLetterKeys = useCallback((word: string) => {
    if (!word) return;
    const cleanLetters = Array.from(new Set(word.toLowerCase().replace(/\s/g, '')));
    
    // Distractors
    const spanishDistractors = ['a', 'e', 'i', 'o', 'u', 'r', 's', 'n', 't', 'l', 'c', 'd', 'm', 'á', 'é', 'í', 'ó', 'ú'];
    const added: string[] = [];
    
    // Add distractors that aren't already in the cleanLetters
    for (const char of spanishDistractors) {
      if (!cleanLetters.includes(char) && added.length < 5) {
        added.push(char);
      }
    }
    
    // Compile and shuffle
    const combined = [...cleanLetters, ...added];
    // Shuffle helper
    const shuffled = [...combined].sort(() => Math.random() - 0.5);
    setShuffledLetterKeycaps(shuffled);
  }, []);

  useEffect(() => {
    if (currentExercise) {
      rebuildLetterKeys(currentExercise.answer);
    }
  }, [currentExercise, rebuildLetterKeys]);

  // --- INPUT ATTEMPT RESOLVER ---
  // Resolves typed action, handles correct sequence, triggers bells and feedback
  const handleLetterInput = useCallback((char: string) => {
    if (successAnimation) return;
    
    const target = currentExercise.answer;
    const nextCharIndex = typedAnswer.length;
    const expectedNextChar = target[nextCharIndex];

    if (!expectedNextChar) return;

    const inputLower = char.toLowerCase();
    const expectedLower = expectedNextChar.toLowerCase();

    // Check equality with helper conversion for accented letters
    const isDirectMatch = inputLower === expectedLower;
    const isAccentedMatch = ACCENT_MAP[expectedLower] === inputLower;

    if (isDirectMatch || isAccentedMatch) {
      // Correct character typed! Build actual target spelling
      const actualInputLetter = expectedNextChar; // Preserve original correct capitalization/accents
      const updatedStr = typedAnswer + actualInputLetter;
      setTypedAnswer(updatedStr);

      // Map letter index to pitch: higher letters represent higher pitch notes
      const pitchValue = 260 + (updatedStr.length * 28);
      playSound(pitchValue);

      // Check if word is complete!
      if (updatedStr === target) {
        setSuccessAnimation(true);
        playVictoryArpeggio();
        setScore(prev => prev + 15 + streak * 3);
        setStreak(prev => prev + 1);
        if (!completedList.includes(currentExercise.id)) {
          setCompletedList(prev => [...prev, currentExercise.id]);
        }
        
        // Stagger to next question with visual delays
        setTimeout(() => {
          setSuccessAnimation(false);
          setTypedAnswer('');
          setShowHint(false);
          // Advance index
          setCurrentExerciseIndex(prev => {
            const nextIdx = prev + 1;
            return nextIdx < exercisePool.length ? nextIdx : 0;
          });
        }, 2200);
      }
    } else {
      // Incorrect input! Set wiggler animation, play minor dissonance, and keep streak healthy
      setShakeTrigger(true);
      playErrorBuzz();
      setStreak(0);
      setTimeout(() => setShakeTrigger(false), 500);
    }
  }, [typedAnswer, currentExercise, exercisePool, streak, completedList, successAnimation, playSound, playVictoryArpeggio, playErrorBuzz]);

  // --- PHYSICAL KEYBOARD BINDINGS ---
  useEffect(() => {
    const handlePhysicalKeyPress = (e: KeyboardEvent) => {
      // Ignore when typing inside input blocks or if playing other tabs
      if (e.repeat) return;
      
      const key = e.key.toLowerCase();
      
      // Quest Mode controls
      if (activeTab === 'quest') {
        const isLetter = /^[a-zа-яёáéíóúñ]$/i.test(key);
        // Spacebar handler
        if (key === ' ' || key === 'space') {
          handleLetterInput(' ');
          e.preventDefault();
          return;
        }
        if (isLetter) {
          handleLetterInput(key);
          return;
        }
      }
      
      // Piano synthesizer bind checks
      if (COMPUTER_KEY_BINDS[key]) {
        const noteSymbol = COMPUTER_KEY_BINDS[key];
        const match = PIANO_NOTES.find(n => n.note === noteSymbol);
        if (match) {
          playSound(match.frequency);
          setActiveKeyPressed(match.note);
          setTimeout(() => setActiveKeyPressed(null), 250);

          // If in Music Book mode, check if Gayane hit the correct expected note!
          if (activeTab === 'free_play' && activeSongIndex !== null) {
            const s = PIANO_SONGS[activeSongIndex];
            const currentExpectedNote = s.notes[songProgressIndex];
            if (currentExpectedNote === match.note) {
              // Target hit! Progress forward!
              const nextProgress = songProgressIndex + 1;
              if (nextProgress >= s.notes.length) {
                // Song Completed! Win arpeggio
                playVictoryArpeggio();
                setScore(prev => prev + 25);
                setSongProgressIndex(0);
                alert(`✨ Ура, Гаяне! Мелодия "${s.name}" сыграна полностью и без ошибок! Ты заработала 25 очков! ✨`);
              } else {
                setSongProgressIndex(nextProgress);
              }
            }
          }
        }
      }
    };

    window.addEventListener('keydown', handlePhysicalKeyPress);
    return () => {
      window.removeEventListener('keydown', handlePhysicalKeyPress);
    };
  }, [activeTab, handleLetterInput, playSound, songProgressIndex, activeSongIndex, playVictoryArpeggio]);

  // --- AUTOMATIC SONG DEMO PLAYER ---
  const stopAutoPlay = useCallback(() => {
    if (autoPlayTimerId) {
      clearTimeout(autoPlayTimerId);
      setAutoPlayTimerId(null);
    }
    setActiveAutoNote(null);
  }, [autoPlayTimerId]);

  const startSongAutoPlay = useCallback((song: PianoSong) => {
    stopAutoPlay();
    let noteIdx = 0;
    
    const playNext = () => {
      if (noteIdx >= song.notes.length) {
        stopAutoPlay();
        return;
      }
      
      const currentNote = song.notes[noteIdx];
      const match = PIANO_NOTES.find(n => n.note === currentNote);
      if (match) {
        playSound(match.frequency);
        setActiveAutoNote(match.note);
        setTimeout(() => setActiveAutoNote(null), 300);
      }
      
      noteIdx++;
      const timer = setTimeout(playNext, 450);
      setAutoPlayTimerId(timer);
    };

    playNext();
  }, [playSound, stopAutoPlay]);

  useEffect(() => {
    return () => stopAutoPlay();
  }, [stopAutoPlay]);

  return (
    <div className={`min-h-screen ${activeTheme.primaryBg} ${activeTheme.textColor} transition-all duration-700 ease-in-out p-4 md:p-6 font-sans flex flex-col justify-between overflow-x-hidden`}>
      
      {/* 🚀 STRAWBERRY COSMIC GLOW ACCENTS / DECORATIVE COSMIC LIGHT ORBS */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-radial from-pink-500/20 to-transparent pointer-events-none rounded-full animate-pulse-glow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-radial from-purple-500/20 to-transparent pointer-events-none rounded-full animate-pulse-glow delay-[3000ms]" />

      <div className="absolute top-20 left-10 pointer-events-none opacity-20 animate-float">
        <span className="text-pink-400 text-6xl">✨</span>
      </div>
      <div className="absolute top-2/3 right-10 pointer-events-none opacity-25 animate-float delay-1000">
        <span className="text-rose-400 text-7xl">🌸</span>
      </div>
      <div className="absolute bottom-1/4 left-5 pointer-events-none opacity-15 animate-float delay-2000">
        <span className="text-pink-300 text-8xl">🎵</span>
      </div>

      {/* --- TOP HEADER NAVIGATION --- */}
      <header className="max-w-6xl w-full mx-auto flex flex-col md:flex-row gap-4 items-center justify-between mb-4 border-b border-rose-200/20 pb-4">
        
        {/* LOGO & SALON NAME */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-pink-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-pink-500/30 animate-pulse border-2 border-white">
            <Music className="w-6 h-6" />
          </div>
          <div>
            <h1 className={`text-2xl md:text-3xl font-bold tracking-tight font-display flex items-center gap-2 ${
              currentTheme === 'frosted_glass' ? 'text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-pink-400 to-rose-300' : 'text-pink-600'
            }`}>
              Գայանեի Վարդագույն Խաղը <span className="text-lg">🌸🎹</span>
            </h1>
            <p className={`text-xs font-semibold opacity-75 tracking-wider uppercase font-mono ${
              currentTheme === 'frosted_glass' ? 'text-pink-200' : 'text-pink-900/80'
            }`}>
              Իսպաներեն` Futuro Simple & Perfecto
            </p>
          </div>
        </div>

        {/* METRICS & LEADERBOARD BADGES */}
        <div className="flex flex-wrap gap-2 items-center">
          
          {/* Current Score */}
          <div className={`${
            currentTheme === 'frosted_glass' ? 'bg-white/10 backdrop-blur-md border-white/20 text-white' : 'bg-white/80 border-pink-200 text-[#6d214f]'
          } px-4 py-1.5 rounded-full border flex items-center gap-2 shadow-sm font-display text-sm md:text-base`}>
            <span className="text-yellow-400">✨</span>
            <span>Միավորներ: <strong className={currentTheme === 'frosted_glass' ? 'text-pink-300' : 'text-pink-600'}>{score}</strong></span>
          </div>
          
          {/* Streak Flame */}
          <div className={`${
            currentTheme === 'frosted_glass' ? 'bg-white/10 backdrop-blur-md border-white/20 text-white' : 'bg-white/80 border-pink-200 text-[#6d214f]'
          } px-4 py-1.5 rounded-full border flex items-center gap-2 shadow-sm font-display text-xs md:text-sm`}>
            <Flame className="w-4 h-4 text-orange-500 fill-orange-400" />
            <span>Շարք: <strong className="text-orange-500">{streak}</strong></span>
          </div>

          {/* Record */}
          <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-1.5 rounded-full flex items-center gap-2 shadow-md text-xs font-semibold">
            <Crown className="w-4 h-4 text-amber-200" />
            <span>Ռեկորդ: <strong>{highScore}</strong></span>
          </div>

          {/* Reset Score button */}
          <button 
            onClick={() => {
              if(confirm("Ջնջե՞լ Գայանեի ընթացիկ միավորները:")) {
                setScore(0);
                setStreak(0);
              }
            }} 
            title="Ջնջել հաշիվը"
            className={`p-1 px-2.5 rounded-full border text-xs font-semibold flex items-center gap-1 transition ${
              currentTheme === 'frosted_glass' ? 'border-pink-300/30 text-pink-300 hover:bg-white/10 hover:text-white' : 'border-rose-300 text-rose-500 hover:bg-rose-50/50 hover:text-rose-600'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Զրոյացնել</span>
          </button>
        </div>
      </header>

      {/* --- DASHBOARD TAB SELECTORS --- */}
      <nav className={`max-w-4xl w-full mx-auto flex p-1.5 rounded-2xl justify-around mb-6 relative z-10 ${
        currentTheme === 'frosted_glass'
          ? 'bg-white/10 backdrop-blur-md border border-white/20 shadow-lg shadow-black/10'
          : 'bg-[#ffeeee]/60 backdrop-blur-sm border border-pink-200'
      }`}>
        
        <button
          onClick={() => { setActiveTab('quest'); stopAutoPlay(); }}
          className={`flex-1 py-3 text-sm md:text-base font-bold rounded-xl transition duration-300 flex items-center justify-center gap-2 ${
            activeTab === 'quest' 
              ? currentTheme === 'frosted_glass'
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/10'
                : 'bg-pink-500 text-white shadow-md shadow-pink-200' 
              : currentTheme === 'frosted_glass'
                ? 'text-pink-300 hover:bg-white/5'
                : 'text-pink-600 hover:bg-pink-50'
          }`}
          id="tab-quest"
        >
          <Gamepad2 className="w-4 h-4" />
          <span>Դաշնամուր-Գուշակ 🌸</span>
        </button>

        <button
          onClick={() => { setActiveTab('free_play'); }}
          className={`flex-1 py-3 text-sm md:text-base font-bold rounded-xl transition duration-300 flex items-center justify-center gap-2 ${
            activeTab === 'free_play' 
              ? currentTheme === 'frosted_glass'
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/10'
                : 'bg-pink-500 text-white shadow-md shadow-pink-200' 
              : currentTheme === 'frosted_glass'
                ? 'text-pink-300 hover:bg-white/5'
                : 'text-pink-600 hover:bg-pink-50'
          }`}
          id="tab-free"
        >
          <Music className="w-4 h-4" />
          <span>Ազատ Դաշնամուր 🎹</span>
        </button>

        <button
          onClick={() => { setActiveTab('learn'); stopAutoPlay(); }}
          className={`flex-1 py-3 text-sm md:text-base font-bold rounded-xl transition duration-300 flex items-center justify-center gap-2 ${
            activeTab === 'learn' 
              ? currentTheme === 'frosted_glass'
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/10'
                : 'bg-pink-500 text-white shadow-md shadow-pink-200' 
              : currentTheme === 'frosted_glass'
                ? 'text-pink-300 hover:bg-white/5'
                : 'text-pink-600 hover:bg-pink-50'
          }`}
          id="tab-learn"
        >
          <GraduationCap className="w-5 h-5" />
          <span>Հուշաթերթիկ 🎓</span>
        </button>
      </nav>

      {/* --- MAIN GAME AND STUDY PORTALS --- */}
      <main className="max-w-5xl w-full mx-auto flex-1 flex flex-col justify-center relative z-10 mb-6">
        
        {/* TAB 1: INTERACTIVE SPELLING GRAMMAR GAME */}
        {activeTab === 'quest' && currentExercise && (
          <div className="space-y-6">
            
            {/* STAGE & TENSE PICKER FILTER ROW */}
            <div className={`flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl border ${
              currentTheme === 'frosted_glass'
                ? 'bg-white/10 backdrop-blur-md border-white/20 text-white'
                : 'bg-white/70 backdrop-blur-sm border border-rose-200/50'
            }`}>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-pink-500" />
                <span className={`text-sm font-bold ${currentTheme === 'frosted_glass' ? 'text-pink-200' : 'text-pink-800'}`}>Առաջադրանքների զտիչ:</span>
              </div>
              <div className={`flex rounded-lg p-1 text-xs font-semibold gap-1 ${
                currentTheme === 'frosted_glass' ? 'bg-white/5' : 'bg-pink-100'
              }`}>
                <button
                  onClick={() => setGenderFilter('all')}
                  className={`px-3 py-1.5 rounded-md transition ${
                    genderFilter === 'all' 
                      ? 'bg-pink-500 text-white shadow-sm' 
                      : currentTheme === 'frosted_glass'
                        ? 'text-pink-200 hover:bg-white/5'
                        : 'text-pink-700 hover:bg-pink-50'
                  }`}
                >
                  Բոլորը ({VERB_EXERCISES.length})
                </button>
                <button
                  onClick={() => setGenderFilter('futuro_simple')}
                  className={`px-3 py-1.5 rounded-md transition ${
                    genderFilter === 'futuro_simple' 
                      ? 'bg-pink-500 text-white shadow-sm' 
                      : currentTheme === 'frosted_glass'
                        ? 'text-pink-200 hover:bg-white/5'
                        : 'text-pink-700 hover:bg-pink-50'
                  }`}
                >
                  Futuro Simple
                </button>
                <button
                  onClick={() => setGenderFilter('futuro_perfecto')}
                  className={`px-3 py-1.5 rounded-md transition ${
                    genderFilter === 'futuro_perfecto' 
                      ? 'bg-pink-500 text-white shadow-sm' 
                      : currentTheme === 'frosted_glass'
                        ? 'text-pink-200 hover:bg-white/5'
                        : 'text-pink-700 hover:bg-pink-50'
                  }`}
                >
                  Futuro Perfecto
                </button>
              </div>

              {/* LEVEL PROGRESS CHIPS */}
              <div className={`text-xs font-bold flex items-center gap-1.5 ${currentTheme === 'frosted_glass' ? 'text-pink-300' : 'text-pink-500'}`}>
                <span>Անցած է:</span>
                <span className={`px-2 py-0.5 rounded-full font-mono ${
                  currentTheme === 'frosted_glass' ? 'bg-white/10 text-pink-200' : 'bg-pink-200/60 text-pink-700'
                }`}>
                  {completedList.length} / {exercisePool.length}
                </span>
              </div>
            </div>

            {/* GRAMMAR QUEST CONTAINER */}
            <div className={`p-6 md:p-8 rounded-3xl ${activeTheme.cardBg} transition-all duration-300 relative overflow-hidden`}>
              
              {/* SUCCESS POP OVER OVERLAY */}
              <AnimatePresence>
                {successAnimation && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-pink-500/90 flex flex-col items-center justify-center z-45 text-white p-4 text-center rounded-3xl"
                  >
                    <motion.div
                       animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: 2 }}
                      className="text-7xl mb-4"
                    >
                      👑🌸✨
                    </motion.div>
                    <h2 className="text-3xl font-bold font-display tracking-tight mb-2">Ապրե՛ս: Ճիշտ է!</h2>
                    <p className="text-xl font-medium max-w-md mx-auto mb-2 font-display">
                      {currentExercise.subject} {currentExercise.answer}
                    </p>
                    <p className="text-sm bg-black/20 px-4 py-2 rounded-xl max-w-sm font-mono text-pink-100">
                      Ստացար: +{15 + streak * 3} միավոր! 🏆
                    </p>
                    
                    {/* CONFETTI FLUTTER RECREATION */}
                    <div className="absolute top-10 left-10 animate-ping text-pink-200 text-3xl">🌸</div>
                    <div className="absolute bottom-10 right-10 animate-bounce text-yellow-200 text-2xl">✨</div>
                    <div className="absolute top-1/2 left-4 px-2 py-1 bg-yellow-300 text-pink-700 rounded-lg text-xs font-bold rotate-12">ՇԱՐՔ: {streak + 1} 🔥</div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* CARD DETAILS */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                
                {/* Left side: Formula explanation & target prompt */}
                <div className="col-span-1 md:col-span-7 space-y-4">
                  
                  {/* Tense Label */}
                  <div className="flex items-center gap-2">
                    <span className={`text-xs uppercase font-extrabold px-3 py-1 rounded-full ${
                      currentTheme === 'frosted_glass'
                        ? currentExercise.tense === 'futuro_simple'
                          ? 'bg-pink-500/30 text-pink-100 border border-pink-400/30'
                          : 'bg-purple-500/30 text-purple-100 border border-purple-400/30'
                        : currentExercise.tense === 'futuro_simple' 
                          ? 'bg-rose-100 text-rose-700 border border-rose-300' 
                          : 'bg-purple-100 text-purple-700 border border-purple-300'
                    }`}>
                      {currentExercise.tense === 'futuro_simple' ? 'Futuro Simple ⏱️' : 'Futuro Perfecto 🕰️'}
                    </span>
                    
                    {currentExercise.isIrregular && (
                      <span className={`text-xs font-mono px-2.5 py-0.5 rounded-full font-bold border ${
                        currentTheme === 'frosted_glass'
                          ? 'bg-amber-500/30 text-amber-100 border-amber-400/35'
                          : 'bg-amber-100 border border-amber-300 text-amber-700'
                      }`}>
                        irregular
                      </span>
                    )}
                  </div>

                  {/* Russian Translation with high readability */}
                  <div className="space-y-1">
                    <div className={`text-xs font-bold font-mono tracking-wider ${currentTheme === 'frosted_glass' ? 'text-pink-300' : 'text-pink-400'}`}>ԹԱՐԳՄԱՆՈՒԹՅՈՒՆ:</div>
                    <h2 className={`text-xl md:text-2xl font-bold font-display ${
                      currentTheme === 'frosted_glass' ? 'text-white' : 'text-pink-700'
                    }`}>
                      « {currentExercise.translationRu} »
                    </h2>
                  </div>

                  {/* Infinitive clue */}
                  <div className={`flex gap-4 p-3 rounded-xl border text-sm ${
                    currentTheme === 'frosted_glass' ? 'bg-white/5 border-white/10 text-white' : 'bg-pink-50/50 border-pink-100/60'
                  }`}>
                    <div>
                      <span className={`${currentTheme === 'frosted_glass' ? 'text-pink-300' : 'text-pink-400'} font-mono text-xs block`}>Բայ / Անորոշ ձև:</span>
                      <strong className={`${currentTheme === 'frosted_glass' ? 'text-white' : 'text-pink-700'} font-display text-base`}>{currentExercise.infinitive}</strong>
                      <span className={`text-xs block ${currentTheme === 'frosted_glass' ? 'text-pink-200/70' : 'text-pink-500'}`}>({currentExercise.russianInfinitive})</span>
                    </div>
                    <div className={`border-l pl-4 ${currentTheme === 'frosted_glass' ? 'border-white/10' : 'border-pink-200'}`}>
                      <span className={`${currentTheme === 'frosted_glass' ? 'text-pink-300' : 'text-pink-400'} font-mono text-xs block`}>Դերանուն:</span>
                      <strong className={`${currentTheme === 'frosted_glass' ? 'text-white' : 'text-pink-700'} font-display text-base uppercase font-extrabold`}>{currentExercise.subject}</strong>
                    </div>
                  </div>

                  {/* Grammar hints section */}
                  <div className={`text-sm p-4 rounded-xl border space-y-2 ${
                    currentTheme === 'frosted_glass' ? 'bg-white/5 border-white/10 text-white' : 'bg-white/70 border border-pink-100'
                  }`}>
                    <p className={`text-xs uppercase font-extrabold flex items-center gap-1.5 font-mono ${
                      currentTheme === 'frosted_glass' ? 'text-pink-300' : 'text-[#de1e7e]'
                    }`}>
                      <Info className="w-4 h-4 text-pink-500" />
                      Ինչպես կազմել:
                    </p>
                    <p className={`font-medium text-xs md:text-sm ${
                      currentTheme === 'frosted_glass' ? 'text-pink-100/95' : 'text-pink-955'
                    }`}>
                      {currentExercise.hintRu}
                    </p>
                  </div>

                </div>

                {/* Right side: Word Spaces & interactive state */}
                <div className={`col-span-1 md:col-span-5 flex flex-col items-center justify-center p-4 rounded-2xl border ${
                  currentTheme === 'frosted_glass' ? 'bg-white/5 border-white/10' : 'bg-pink-50/30 border-pink-200/40'
                }`}>
                  
                   <div className={`text-xs font-bold font-mono mb-2 ${currentTheme === 'frosted_glass' ? 'text-pink-300' : 'text-pink-400'}`}>ԳՐԻ՛Ր ԵՎ ՆՎԱԳԻ՛Ր:</div>
                  
                  {/* WORD SPACES */}
                  <div 
                    className={`flex flex-wrap gap-2 justify-center py-6 px-4 w-full justify-items-center ${
                      shakeTrigger ? 'animate-shake' : ''
                    }`}
                  >
                    {currentExercise.answer.split('').map((char, index) => {
                      const isTyped = index < typedAnswer.length;
                      const letterToShow = isTyped ? typedAnswer[index] : '';
                      const isSpace = char === ' ';

                      if (isSpace) {
                        return (
                          <div 
                            key={index} 
                            className={`w-8 h-10 border-b-2 flex items-center justify-center mx-1 text-lg font-bold ${
                              currentTheme === 'frosted_glass' ? 'border-white/40 text-pink-300' : 'border-pink-300 text-slate-400'
                            }`}
                            title="Space"
                          >
                            ␣
                          </div>
                        );
                      }

                      return (
                        <motion.div
                          key={index}
                          initial={isTyped ? { scale: 0.8, y: 5 } : {}}
                          animate={isTyped ? { scale: [0.8, 1.15, 1], y: 0 } : {}}
                          className={`w-10 h-12 md:w-12 md:h-14 rounded-2xl border-2 flex items-center justify-center font-bold font-display text-lg shadow-sm transition-all duration-300 ${
                            isTyped 
                              ? 'bg-pink-500 border-pink-600 text-white shadow-md shadow-pink-200' 
                              : currentTheme === 'frosted_glass'
                                ? 'bg-white/10 border-white/20 text-white font-normal shadow-inner'
                                : 'bg-white border-pink-300 text-pink-400 font-normal shadow-inner'
                          }`}
                        >
                          {letterToShow}
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* QUICK HINT BUTTON */}
                  <div className="flex gap-2 w-full mt-2">
                    <button
                      onClick={() => setShowHint(prev => !prev)}
                      className={`flex-1 py-2 rounded-xl text-center border-2 text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                        currentTheme === 'frosted_glass'
                          ? 'border-white/20 bg-white/10 hover:bg-white/20 text-white'
                          : 'border-pink-300 bg-white/80 hover:bg-pink-50 text-pink-600'
                      }`}
                    >
                      <HelpCircle className="w-4 h-4 text-pink-500" />
                      <span>{showHint ? 'Թաքցնել հուշումը' : 'Հուշել տառը'}</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        setTypedAnswer('');
                        setStreak(0);
                      }}
                      className={`p-2 rounded-xl text-xs font-bold transition flex items-center justify-center ${
                        currentTheme === 'frosted_glass'
                          ? 'bg-white/10 hover:bg-white/20 text-white'
                          : 'bg-pink-100 hover:bg-pink-200 text-pink-600'
                      }`}
                      title="Մաքրել և սկսել սկզբից"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        setTypedAnswer('');
                        setCurrentExerciseIndex(prev => {
                          const nextIdx = prev + 1;
                          return nextIdx < exercisePool.length ? nextIdx : 0;
                        });
                      }}
                      className="px-3 bg-pink-500 hover:bg-pink-600 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1"
                      title="Բաց թողնել առաջադրանքը"
                    >
                      <span>Անցնել</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* ADVANCED REVEAL LETTER BOX */}
                  {showHint && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className={`mt-3 p-2 text-xs font-medium rounded-lg border w-full text-center ${
                        currentTheme === 'frosted_glass'
                          ? 'bg-pink-500/20 text-pink-200 border-pink-400/30'
                          : 'bg-yellow-50 text-yellow-800 border-yellow-250'
                      }`}
                    >
                      Հաջորդ տառը: <strong className={`text-lg font-display ${currentTheme === 'frosted_glass' ? 'text-white' : 'text-pink-600'}`}>
                        "{currentExercise.answer[typedAnswer.length]}"
                      </strong>
                    </motion.div>
                  )}

                </div>

              </div>

              {/* SEED LETTERS BOARD FOR CLICKS */}
              <div className="mt-8 pt-6 border-t border-rose-100/10 flex flex-col items-center">
                <div className={`text-xs font-bold mb-3 uppercase tracking-wider font-mono flex items-center gap-1.5 ${
                  currentTheme === 'frosted_glass' ? 'text-pink-300' : 'text-pink-500'
                }`}>
                  <Keyboard className="w-4 h-4" />
                  <span>Սեղմի՛ր վարդագույն տառերին` դաշնամուրի վրա բառը հավաքելու համար:</span>
                </div>
                
                <div className="flex flex-wrap gap-2.5 justify-center max-w-2xl px-2">
                  {shuffledLetterKeycaps.map((letter, i) => {
                    const isNextTarget = currentExercise.answer[typedAnswer.length]?.toLowerCase() === letter.toLowerCase();
                    return (
                      <button
                        key={`${letter}-${i}`}
                        onClick={() => handleLetterInput(letter)}
                        className={`min-w-11 h-12 md:min-w-12 md:h-14 rounded-2xl font-bold text-lg md:text-xl font-display flex items-center justify-center shadow-md active:translate-y-1 active:shadow-sm border-b-4 transition-all duration-150 ${
                          isNextTarget && showHint
                            ? 'bg-amber-400 border-amber-600 text-amber-950 scale-105 animate-pulse'
                            : currentTheme === 'frosted_glass'
                              ? 'bg-gradient-to-b from-pink-500 to-pink-700 hover:from-pink-400 hover:to-pink-600 border-pink-900 text-white hover:scale-103'
                              : 'bg-gradient-to-b from-[#ff8ebb] to-[#ff488e] hover:from-[#ff9fca] hover:to-[#ff5c9a] border-[#d81b60] text-white hover:scale-103'
                        }`}
                        id={`letter-btn-${letter}`}
                      >
                        {letter}
                      </button>
                    );
                  })}

                  {/* SPACE BUTTON FOR COMPOUND TENSES */}
                  {currentExercise.answer.includes(' ') && (
                    <button
                      onClick={() => handleLetterInput(' ')}
                      className={`px-6 h-12 md:h-14 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-1 shadow-md border-b-4 transition ${
                        currentTheme === 'frosted_glass'
                          ? 'from-purple-500 to-purple-700 border-purple-900'
                          : 'from-purple-400 to-purple-600 border-purple-800 hover:opacity-90'
                      } bg-gradient-to-b`}
                    >
                      <span>Բացատ (Haber _)</span>
                    </button>
                  )}
                </div>

                <p className={`text-[11px] mt-4 text-center font-mono ${
                  currentTheme === 'frosted_glass' ? 'text-pink-300/80' : 'text-pink-400/80'
                }`}>
                  (Դու կարող ես նաև տպել քո համակարգչի ստեղնաշարով: Շեշտված տառերի համար սեղմիր սովորական `a, e, i, o, u`, խաղն ինքնուրույն կուղղի դրանք:)
                </p>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: FREE REACTION PIANO & SONGS BOOK */}
        {activeTab === 'free_play' && (
          <div className="space-y-6">
            
            {/* SONG SELECTOR PORTAL */}
            <div className={`p-6 rounded-3xl border ${
              currentTheme === 'frosted_glass'
                ? 'bg-white/10 backdrop-blur-md border-white/20 text-white shadow-2xl'
                : 'bg-white/85 backdrop-blur-md border border-pink-200'
            }`}>
              <h2 className={`text-xl font-bold font-display mb-4 flex items-center gap-2 ${
                currentTheme === 'frosted_glass' ? 'text-white' : 'text-pink-600'
              }`}>
                <BookOpen className="w-5 h-5 text-pink-500" />
                <span>Երգարան Գայանեի համար 🌸🎼</span>
              </h2>
              
              <p className={`text-xs mb-4 ${
                currentTheme === 'frosted_glass' ? 'text-pink-200/95' : 'text-pink-900/70'
              }`}>
                Ընտրի՛ր հայտնի մեղեդի: Դաշնամուրը մեղմոցով ոսկեգույն կլուսավորի քեզ անհրաժեշտ ստեղները: Սեղմի՛ր դրանք հերթով` քո ձեռքերով գեղեցիկ երգ նվագելու համար!
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {PIANO_SONGS.map((song, idx) => {
                  const isSelected = activeSongIndex === idx;
                  return (
                    <div
                      key={song.name}
                      onClick={() => {
                        setActiveSongIndex(idx);
                        setSongProgressIndex(0);
                        stopAutoPlay();
                      }}
                      className={`p-4 rounded-2xl border cursor-pointer transition text-left relative flex flex-col justify-between h-36 overflow-hidden ${
                        isSelected 
                          ? currentTheme === 'frosted_glass'
                            ? 'bg-pink-500/30 border-pink-400 shadow-md ring-2 ring-pink-400/30 text-white'
                            : 'bg-[#ffe4ee] border-[#ff8db4] shadow-md ring-2 ring-[#ff8db4]/40' 
                          : currentTheme === 'frosted_glass'
                            ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white'
                            : 'bg-pink-50/40 border-pink-200/50 hover:bg-[#fff0f5] hover:border-pink-300'
                      }`}
                    >
                      <div>
                        <h3 className={`font-bold text-sm md:text-base font-display line-clamp-1 ${
                          currentTheme === 'frosted_glass' ? 'text-white' : 'text-pink-700'
                        }`}>{song.name}</h3>
                        <p className={`text-[11px] italic block mb-2 ${
                          currentTheme === 'frosted_glass' ? 'text-pink-300' : 'text-pink-500'
                        }`}>{song.originalName}</p>
                        <p className={`text-xs font-medium line-clamp-2 italic ${
                          currentTheme === 'frosted_glass' ? 'text-pink-100/90' : 'text-pink-955 font-normal'
                        }`}>"{song.lyrics}"</p>
                      </div>

                      {/* Controls inside song card */}
                      <div className="flex gap-2 justify-end mt-2 relative z-10">
                        {/* Auto demo trigger */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveSongIndex(idx);
                            setSongProgressIndex(0);
                            startSongAutoPlay(song);
                          }}
                          className="px-2 py-1 bg-pink-500 hover:bg-pink-600 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                        >
                          <Play className="w-3 h-3 text-white fill-white" />
                          <span>Լսել</span>
                        </button>
                        
                        {isSelected && (
                          <span className="text-[10px] bg-emerald-500 text-white rounded px-1.5 py-0.5 font-bold font-mono">
                            Ակտիվ է
                          </span>
                        )}
                      </div>

                      {/* Watermark decors */}
                      <Music className={`absolute -right-3 -bottom-3 w-14 h-14 ${
                        currentTheme === 'frosted_glass' ? 'text-white/5' : 'text-pink-300/10'
                      }`} />
                    </div>
                  );
                })}
              </div>

              {/* If song is active, show instruction panel */}
              {activeSongIndex !== null && (
                <div className={`mt-4 p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
                  currentTheme === 'frosted_glass'
                    ? 'bg-pink-500/20 border-pink-400/30 text-white'
                    : 'bg-yellow-50 border-yellow-250 text-slate-800'
                }`}>
                  <div>
                    <h4 className={`text-sm font-bold font-display flex items-center gap-1.5 ${
                      currentTheme === 'frosted_glass' ? 'text-pink-200' : 'text-yellow-800'
                    }`}>
                      <span>Լսի՛ր և կրկնի՛ր:</span>
                      <strong className={currentTheme === 'frosted_glass' ? 'text-white underline decoration-pink-400' : 'text-[#de1e7e]'}>{PIANO_SONGS[activeSongIndex].name}</strong>
                    </h4>
                    <p className={`text-xs mt-1 ${currentTheme === 'frosted_glass' ? 'text-pink-100/80' : 'text-yellow-900'}`}>
                      Նվագած նոտաներ: <strong className={`font-mono ${currentTheme === 'frosted_glass' ? 'text-white bg-pink-500/40 px-1.5 py-0.5 rounded' : 'text-pink-600'}`}>{songProgressIndex} / {PIANO_SONGS[activeSongIndex].notes.length}</strong>
                    </p>
                    
                    {/* Visual note letters sequence progress */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {PIANO_SONGS[activeSongIndex].notes.map((n, i) => {
                        const isCurrent = i === songProgressIndex;
                        const isPast = i < songProgressIndex;
                        return (
                          <span 
                            key={i} 
                            className={`text-xs font-bold px-2 py-0.5 rounded font-mono ${
                              isCurrent 
                                ? 'bg-pink-500 text-white scale-110 shadow' 
                                : isPast 
                                  ? 'bg-pink-150/20 text-pink-300/40 line-through' 
                                  : currentTheme === 'frosted_glass'
                                    ? 'bg-white/10 text-pink-300 border border-white/15'
                                    : 'bg-white text-pink-700/60 border border-pink-200'
                            }`}
                          >
                            {PIANO_SONGS[activeSongIndex].labels[i]}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSongProgressIndex(0);
                        stopAutoPlay();
                      }}
                      className={`px-3.5 py-2 border rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                        currentTheme === 'frosted_glass'
                          ? 'bg-white/10 border-white/20 hover:bg-white/20 text-white'
                          : 'bg-white border-rose-300 text-rose-500 hover:bg-rose-50'
                      }`}
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Վերսկսել նորից</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveSongIndex(null);
                        setSongProgressIndex(0);
                        stopAutoPlay();
                      }}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                        currentTheme === 'frosted_glass'
                          ? 'bg-pink-500 hover:bg-pink-600 text-white'
                          : 'bg-pink-100 hover:bg-pink-200 text-pink-600'
                      }`}
                    >
                      Դուրս գալ երգերի ռեժիմից
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 3: SPANISH GRAMMAR SHEETS (СПРАВОЧНИК ВРЕМЁН) */}
        {activeTab === 'learn' && (
          <div className="space-y-6">
            <div className={`p-6 md:p-8 rounded-3xl border space-y-8 ${
              currentTheme === 'frosted_glass'
                ? 'bg-white/10 backdrop-blur-md border-white/20 text-white shadow-2xl'
                : 'bg-white/90 backdrop-blur-md border border-pink-200'
            }`}>
              
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mx-auto shadow-inner border ${
                  currentTheme === 'frosted_glass'
                    ? 'bg-white/10 text-pink-300 border-white/15'
                    : 'bg-pink-100/80 text-pink-500 border-pink-200'
                }`}>
                  <GraduationCap className="w-8 h-8" />
                </div>
                <h2 className={`text-2xl font-bold font-display ${currentTheme === 'frosted_glass' ? 'text-white' : 'text-pink-700'}`}>Ապառնի Ժամանակի Իսպաներեն Հուշաթերթիկ 🌸</h2>
                <p className={`text-sm ${currentTheme === 'frosted_glass' ? 'text-pink-200/90' : 'text-pink-900/80'}`}>
                  Բայերի խոնարհման պարզ և հեշտ հիշվող աղյուսակներ <strong>Futuro Simple</strong> և <strong>Futuro Perfecto</strong> ժամանակաձևերում` Գայանեի համար!
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Futuro Simple Section */}
                <div className={`p-5 rounded-2xl border space-y-4 ${
                  currentTheme === 'frosted_glass'
                    ? 'bg-pink-500/10 border-white/15 text-white'
                    : 'bg-gradient-to-tr from-[#ffeef2] to-white border-[#fcb1ca]/60'
                }`}>
                  <div className={`flex items-center gap-2 border-b pb-2.5 ${currentTheme === 'frosted_glass' ? 'border-white/10' : 'border-rose-100'}`}>
                    <span className="text-xl">⏱️</span>
                    <h3 className={`font-bold text-lg font-display ${currentTheme === 'frosted_glass' ? 'text-white' : 'text-pink-700'}`}>Futuro Simple</h3>
                  </div>
                  
                  <p className={`text-xs ${currentTheme === 'frosted_glass' ? 'text-pink-200' : 'text-pink-900/85'}`}>
                    <strong>Ապառնի պարզ ժամանակ:</strong> Օգտագործվում է ապագայում տեղի ունենալիք գործողությունների համար, ինչպես նաև արտահայտում է ենթադրություններ / կանխատեսումներ:
                  </p>

                  <div className={`rounded-xl border shadow-inner overflow-hidden ${
                    currentTheme === 'frosted_glass' ? 'bg-white/5 border-white/10' : 'bg-white/95 border-pink-200'
                  }`}>
                    <table className="w-full text-left border-collapse text-xs md:text-sm">
                      <thead>
                        <tr className={`${
                          currentTheme === 'frosted_glass' ? 'bg-white/10 text-white border-b border-white/10' : 'bg-pink-50 border-b border-pink-100 text-pink-700'
                        } font-bold font-display`}>
                          <th className="p-2.5">Դերանուն</th>
                          <th className="p-2.5">Վերջավորություն</th>
                          <th className="p-2.5">Օրինակ (cantar)</th>
                        </tr>
                      </thead>
                      <tbody className={`divide-y text-xs font-display ${
                        currentTheme === 'frosted_glass' ? 'divide-white/15 text-pink-100' : 'divide-pink-100 text-pink-955'
                      }`}>
                        <tr>
                          <td className="p-2.5 font-bold">Yo (Ես)</td>
                          <td className={`p-2.5 font-mono font-bold ${currentTheme === 'frosted_glass' ? 'text-pink-300' : 'text-pink-600'}`}>-é</td>
                          <td className="p-2.5 m-1">cantar<strong className={currentTheme === 'frosted_glass' ? 'text-pink-300' : 'text-pink-600'}>-é</strong> (Ես կերգեմ)</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-bold">Tú (Դու)</td>
                          <td className={`p-2.5 font-mono font-bold ${currentTheme === 'frosted_glass' ? 'text-pink-300' : 'text-pink-600'}`}>-ás</td>
                          <td className="p-2.5">cantar<strong className={currentTheme === 'frosted_glass' ? 'text-pink-300' : 'text-pink-600'}>-ás</strong> (Դու կերգես)</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-bold">Él / Ella (Նա)</td>
                          <td className={`p-2.5 font-mono font-bold ${currentTheme === 'frosted_glass' ? 'text-pink-300' : 'text-pink-600'}`}>-á</td>
                          <td className="p-2.5">cantar<strong className={currentTheme === 'frosted_glass' ? 'text-pink-300' : 'text-pink-600'}>-á</strong> (Նա կերգի)</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-bold">Nosotros (Մենք)</td>
                          <td className={`p-2.5 font-mono font-bold ${currentTheme === 'frosted_glass' ? 'text-pink-300' : 'text-pink-600'}`}>-emos</td>
                          <td className="p-2.5">cantar<strong className={currentTheme === 'frosted_glass' ? 'text-pink-300' : 'text-pink-600'}>-emos</strong> (Մենք կերգենք)</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-bold">Vosotros (Դուք)</td>
                          <td className={`p-2.5 font-mono font-bold ${currentTheme === 'frosted_glass' ? 'text-pink-300' : 'text-pink-600'}`}>-éis</td>
                          <td className="p-2.5">cantar<strong className={currentTheme === 'frosted_glass' ? 'text-pink-300' : 'text-pink-600'}>-éis</strong> (Դուք կերգեք)</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-bold">Ellos / Ellas (Նրանք)</td>
                          <td className={`p-2.5 font-mono font-bold ${currentTheme === 'frosted_glass' ? 'text-pink-300' : 'text-pink-600'}`}>-án</td>
                          <td className="p-2.5">cantar<strong className={currentTheme === 'frosted_glass' ? 'text-pink-300' : 'text-pink-600'}>-án</strong> (Նրանք կերգեն)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className={`space-y-1 p-3 rounded-xl border ${
                    currentTheme === 'frosted_glass' ? 'bg-white/5 border-white/10' : 'bg-white/70 border border-pink-100'
                  }`}>
                    <span className="text-xs uppercase font-extrabold text-amber-550 font-mono block">⚠️ Անկանոն հիմքեր (Stems):</span>
                    <p className={`text-[11px] leading-relaxed ${currentTheme === 'frosted_glass' ? 'text-pink-200' : 'text-slate-800'}`}>
                      Որոշ բայեր փոխում են իրենց հիմքը Futuro Simple-ում: Վերջավորությունները մնում են նույնը! <br/>
                      • <strong>tener</strong> → tendr- (Yo tendré) <br/>
                      • <strong>hacer</strong> → har- (Yo haré) <br/>
                      • <strong>decir</strong> → dir- (Yo diré) <br/>
                      • <strong>querer</strong> → querr- (Yo querré) <br/>
                      • <strong>poder</strong> → podr- (Yo podré)
                    </p>
                  </div>
                </div>

                {/* Futuro Perfecto Section */}
                <div className={`p-5 rounded-2xl border space-y-4 ${
                  currentTheme === 'frosted_glass'
                    ? 'bg-purple-500/10 border-white/15 text-white'
                    : 'bg-gradient-to-tr from-[#f3ebff] to-white border border-purple-200'
                }`}>
                  <div className={`flex items-center gap-2 border-b pb-2.5 ${currentTheme === 'frosted_glass' ? 'border-white/10' : 'border-purple-100'}`}>
                    <span className="text-xl">🕰️</span>
                    <h3 className={`font-bold text-lg font-display ${currentTheme === 'frosted_glass' ? 'text-white' : 'text-purple-700'}`}>Futuro Perfecto</h3>
                  </div>
                  
                  <p className={`text-xs ${currentTheme === 'frosted_glass' ? 'text-purple-200' : 'text-purple-900/85'}`}>
                    <strong>Ապառնի վաղակատար ժամանակաձև:</strong> Արտահայտում է գործողություն, որն <strong>արդեն ավարտված կլինի</strong> ապագայի որևէ պահից կամ մեկ այլ գործողությունից առաջ:
                  </p>

                  <div className={`rounded-xl border shadow-inner p-3 text-xs leading-relaxed ${
                    currentTheme === 'frosted_glass' ? 'bg-white/5 border-white/10' : 'bg-white/95 border-purple-200'
                  }`}>
                    <div className={`text-xs font-bold uppercase tracking-wide font-mono mb-1.5 ${
                      currentTheme === 'frosted_glass' ? 'text-purple-300' : 'text-purple-800'
                    }`}>Բանաձևի սխեման:</div>
                    <div className={`p-2.5 rounded-lg border flex justify-center items-center font-bold text-sm mb-3 text-center ${
                      currentTheme === 'frosted_glass'
                        ? 'bg-white/10 border-white/15 text-white'
                        : 'bg-purple-50 border border-purple-200/50 text-purple-950'
                    }`}>
                      Haber բայը (Futuro-ում) + Դերբայ (Participio)
                    </div>

                    <div className={`space-y-1.5 text-[11px] ${
                      currentTheme === 'frosted_glass' ? 'text-purple-200' : 'text-[#4a154b]'
                    }`}>
                      <div>• <strong>Yo:</strong> habré <span className="underline">cantado</span></div>
                      <div>• <strong>Tú:</strong> habrás <span className="underline">cantado</span></div>
                      <div>• <strong>Él/Ella:</strong> habrá <span className="underline">cantado</span></div>
                      <div>• <strong>Nosotros:</strong> habremos <span className="underline">cantado</span></div>
                      <div>• <strong>Vosotros:</strong> habréis <span className="underline">cantado</span></div>
                      <div>• <strong>Ellos/Ellas:</strong> habrán <span className="underline text-emerald-450 font-bold">cantado</span></div>
                    </div>
                  </div>

                  <div className={`space-y-1 p-3 rounded-xl border ${
                    currentTheme === 'frosted_glass' ? 'bg-white/5 border-white/10' : 'bg-white/70 border border-purple-100'
                  }`}>
                    <span className={`text-xs uppercase font-extrabold font-mono block ${
                      currentTheme === 'frosted_glass' ? 'text-purple-300' : 'text-purple-700'
                    }`}>🎯 Ինչպես կազմել դերբայը (Participio):</span>
                    <p className={`text-[11px] leading-relaxed ${
                      currentTheme === 'frosted_glass' ? 'text-purple-200/90' : 'text-slate-800'
                    }`}>
                      • <strong>-AR</strong>-ով վերջացող բայերի համար ավելացրո՛ւ <strong>-ado</strong> (cantar → cantado) <br/>
                      • <strong>-ER/-IR</strong>-ով վերջացող բայերի համար ավելացրո՛ւ <strong>-ido</strong> (comer → comido, vivir → vivido) <br/>
                      • <strong>Բայց կան բացառություններ:</strong> <br/>
                      &nbsp;&nbsp; hacer → hecho &nbsp;&nbsp;&nbsp;&nbsp; escribir → escrito <br/>
                      &nbsp;&nbsp; decir → dicho &nbsp;&nbsp;&nbsp;&nbsp; ver → visto <br/>
                      &nbsp;&nbsp; abrir → abierto &nbsp;&nbsp; romper → roto
                    </p>
                  </div>
                </div>

              </div>

              {/* Practice button shortcut */}
              <div className="text-center pt-2">
                <button
                  onClick={() => setActiveTab('quest')}
                  className="px-8 py-3.5 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-2xl shadow-lg shadow-pink-500/20 hover:scale-103 transition-transform active:scale-97 font-display inline-flex items-center gap-2 text-base cursor-pointer"
                >
                  <Gamepad2 className="w-5 h-5 text-white" />
                  <span>Գնա՛լ խաղալու և բառերը գուշակելու: 🌸</span>
                </button>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* --- INTEGRATED DECORATIVE PINK PIANO BLOCK --- */}
      {/* This piano sits at the bottom, acts as the core interface to play music, see animations, and spell letters */}
      <footer className="max-w-6xl w-full mx-auto space-y-4 pt-4 border-t border-rose-200/40 relative z-25">
        
        {/* CUSTOMIZATION DRAWER CARD */}
        <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-rose-200/50 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Sounds and Instrument select */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold text-pink-700 uppercase tracking-widest font-mono">Կարգավորումներ:</span>
            
            {/* Audio volume switch */}
            <button
              onClick={() => setSoundEnabled(prev => !prev)}
              className={`p-2 rounded-xl border transition ${
                soundEnabled 
                  ? 'bg-pink-500 border-pink-600 text-white shadow shadow-pink-100' 
                  : 'bg-white border-pink-300 text-pink-400'
              }`}
              title={soundEnabled ? "Անջատել ձայնը" : "Միացնել ձայնը"}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Synthesizer instrument selector */}
            <div className="flex rounded-lg bg-pink-100/80 p-1 text-xs font-semibold gap-1">
              <button
                onClick={() => setInstrument('music_box')}
                className={`px-3 py-1.5 rounded-md transition ${instrument === 'music_box' ? 'bg-pink-500 text-white shadow-sm' : 'text-pink-700 hover:bg-pink-50/50'}`}
              >
                🔔 Զանգակներ
              </button>
              <button
                onClick={() => setInstrument('piano')}
                className={`px-3 py-1.5 rounded-md transition ${instrument === 'piano' ? 'bg-pink-500 text-white shadow-sm' : 'text-pink-700 hover:bg-pink-50/50'}`}
              >
                🎹 Դաշնամուր
              </button>
              <button
                onClick={() => setInstrument('synth')}
                className={`px-3 py-1.5 rounded-md transition ${instrument === 'synth' ? 'bg-pink-500 text-white shadow-sm' : 'text-pink-700 hover:bg-pink-50/50'}`}
              >
                🚀 Սինթեզատոր
              </button>
            </div>
          </div>

          {/* COLOR THEME CONTROLLERS */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-pink-700 uppercase tracking-widest font-mono">Գունապնակ:</span>
            <div className="flex gap-1.5">
              <button
                onClick={() => setCurrentTheme('frosted_glass')}
                className={`w-6 h-6 rounded-full bg-white/40 backdrop-blur-sm border border-white/65 hover:scale-115 transition ${currentTheme === 'frosted_glass' ? 'ring-2 ring-pink-500 scale-110 shadow-md shadow-pink-300' : ''}`}
                title="Սառեցված ապակի"
              />
              <button
                onClick={() => setCurrentTheme('barbie')}
                className={`w-6 h-6 rounded-full bg-[#de1e7e] border border-white filter transition cursor-pointer hover:scale-115 ${currentTheme === 'barbie' ? 'ring-2 ring-pink-500 scale-110 shadow-md shadow-pink-300' : ''}`}
                title="Բարբի"
              />
              <button
                onClick={() => setCurrentTheme('sakura')}
                className={`w-6 h-6 rounded-full bg-[#fcb1ca] border border-white filter transition cursor-pointer hover:scale-115 ${currentTheme === 'sakura' ? 'ring-2 ring-pink-500 scale-110 shadow-md shadow-pink-300' : ''}`}
                title="Սակուրա"
              />
              <button
                onClick={() => setCurrentTheme('unicorn')}
                className={`w-6 h-6 rounded-full bg-[#9c27b0] border border-white filter transition cursor-pointer hover:scale-115 ${currentTheme === 'unicorn' ? 'ring-2 ring-purple-500 scale-110 shadow-md shadow-purple-300' : ''}`}
                title="Միաեղջյուր"
              />
              <button
                onClick={() => setCurrentTheme('cream')}
                className={`w-6 h-6 rounded-full bg-[#f87171] border border-white filter transition cursor-pointer hover:scale-115 ${currentTheme === 'cream' ? 'ring-2 ring-red-500 scale-110 shadow-md shadow-red-200' : ''}`}
                title="Կլուբնիկա"
              />
            </div>
          </div>

        </div>

        {/* PHYSICAL KEYBOARD HINTS DISPLAY */}
        <div className="text-center">
          <p className="text-[10px] uppercase font-bold tracking-widest text-pink-700/60 flex items-center justify-center gap-1">
            <Keyboard className="w-3.5 h-3.5" />
            <span>Ստեղնաշարի կոճակները: C4=A | D4=S | E4=D | F4=F | G4=G | A4=H | B4=J | C5=K | D5=L | E5=; | F5='</span>
          </p>
        </div>

        {/* --- PIANO KEYS CANVAS LAYOUT --- */}
        <div className="relative select-none pb-4">
          
          {/* Main White Keys Container */}
          <div className="flex w-full justify-center relative bg-pink-950/20 p-2.5 rounded-3xl border-3 border-pink-300/40 shadow-2xl relative h-48 md:h-56">
            
            {/* Iterate through Piano Notes */}
            {PIANO_NOTES.map((n) => {
              // We render White and Black keys differently. Black keys are absolute positioned over the white ones.
              if (n.isBlack) return null;

              // Checks for highlight guide in Song Book tutorial mode
              let isGuideActive = false;
              if (activeTab === 'free_play' && activeSongIndex !== null) {
                const stepNote = PIANO_SONGS[activeSongIndex].notes[songProgressIndex];
                if (stepNote === n.note) {
                  isGuideActive = true;
                }
              }

              const isAutoPlayingNow = activeAutoNote === n.note;
              const isPressingNow = activeKeyPressed === n.note;

              return (
                <button
                  key={n.note}
                  onMouseDown={() => {
                    playSound(n.frequency);
                  }}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    playSound(n.frequency);
                  }}
                  className={`flex-1 min-w-8 max-w-16 h-full border-r border-[#ffe5ef] transition-all relative rounded-b-2xl border-b-6 flex flex-col justify-end pb-3 text-center cursor-pointer ${
                    isGuideActive 
                      ? 'bg-gradient-to-b from-amber-200 to-yellow-400 border-yellow-600 scale-y-98 shadow-inner'
                      : isAutoPlayingNow || isPressingNow
                        ? 'bg-gradient-to-b from-pink-300 to-pink-500 border-pink-700 pt-3 h-[98%] shadow-inner'
                        : `bg-gradient-to-b ${activeTheme.pianoWhiteKey} border-pink-200 shadow-[2px_4px_6px_rgba(0,0,0,0.08)] hover:brightness-98`
                  }`}
                  id={`white-key-${n.note}`}
                >
                  
                  {/* Glowing halo guide */}
                  {isGuideActive && (
                    <span className="absolute inset-x-1.5 top-2.5 h-3 bg-yellow-300/80 rounded-full animate-ping text-[10px]" />
                  )}

                  {/* Note text markers */}
                  <span className="text-[10px] font-extrabold uppercase font-mono tracking-tight block text-pink-700/80">
                    {n.label}
                  </span>
                  <span className="text-[9px] font-bold block opacity-60 font-mono">
                    {n.note}
                  </span>
                </button>
              );
            })}

            {/* Overlaid Absolute-Positioned BLACK KEYS */}
            <div className="absolute inset-x-2.5 top-2.5 pointer-events-none flex justify-center h-[58%]">
              
              {/* Calculating widths & alignment for standard black key gaps */}
              <div className="flex w-full justify-center max-w-5xl relative">
                
                {/* Manual indices aligning of standard black keys over white keys */}
                {/* White keys count is 12. List of indices is used to space black keys perfectly. */}
                {PIANO_NOTES.map((n, idx) => {
                  if (!n.isBlack) return null;

                  // Find previous white key index to align on top of boundary
                  const whiteKeysPreceding = PIANO_NOTES.slice(0, idx).filter(x => !x.isBlack).length;
                  
                  // Percentage-based dynamic positioning maps beautifully across all screens!
                  // 12 white keys means each key is 100/12 = 8.33% wide.
                  // Black keys sit on top of dividing borders: (8.33 * precedingCount) - half width.
                  const positionPercentage = (whiteKeysPreceding * 8.32);

                  let isGuideActive = false;
                  if (activeTab === 'free_play' && activeSongIndex !== null) {
                    const stepNote = PIANO_SONGS[activeSongIndex].notes[songProgressIndex];
                    if (stepNote === n.note) {
                      isGuideActive = true;
                    }
                  }

                  const isAutoPlayingNow = activeAutoNote === n.note;
                  const isPressingNow = activeKeyPressed === n.note;

                  return (
                    <button
                      key={n.note}
                      onMouseDown={() => playSound(n.frequency)}
                      onTouchStart={(e) => {
                        e.preventDefault();
                        playSound(n.frequency);
                      }}
                      className={`absolute w-5 h-full rounded-b-lg border-b-4 shadow-[3px_5px_4px_rgba(0,0,0,0.15)] transition-all pointer-events-auto flex flex-col justify-end pb-1.5 text-center cursor-pointer ${
                        isGuideActive 
                          ? 'bg-gradient-to-b from-amber-300 to-yellow-500 border-yellow-700 scale-y-98'
                          : isAutoPlayingNow || isPressingNow
                            ? 'bg-gradient-to-b from-[#ff3385] to-[#cc0052] border-pink-900 border-b-2 pt-1.5 h-[98%]'
                            : `bg-gradient-to-b ${activeTheme.pianoBlackKey} border-[#aa0653]`
                      }`}
                      style={{ left: `calc(${positionPercentage}% + 1px)` }}
                      title={`Սև ստեղն: ${n.note}`}
                      id={`black-key-${n.note}`}
                    >
                      {/* Solfège tag */}
                      <span className="text-[7.5px] font-bold text-white font-mono tracking-tight block">
                        {n.label}
                      </span>
                      <span className="text-[6.5px] font-bold text-pink-200/80 block font-mono">
                        {n.note.replace('#', '♯')}
                      </span>
                    </button>
                  );
                })}

              </div>
            </div>

          </div>

        </div>

      </footer>

      {/* --- FOOTER CREDIT INFO --- */}
      <footer className="text-center pt-6 pb-2 text-[11px] text-pink-700/60 font-medium">
        <p>Պատրաստված է սիրով Գայանեի համար 🌸 Գուշակի՛ր ապառնի ժամանակի բայերը, նվագի՛ր երգեր և հաղթի՛ր:</p>
      </footer>

    </div>
  );
}
