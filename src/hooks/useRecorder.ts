import { useCallback, useEffect, useRef, useState } from "react";
import type { AcousticMetrics } from "../services/acousticAnalyzer";

export interface RecorderState {
  status: "idle" | "recording" | "recorded";
  error: string | null;
  audioUrl: string | null;
  audioBlob: Blob | null;
  spokenTranscript: string | null;
  durationMs: number;
  isSupported: boolean;
  isListeningSTT: boolean;
  liveAcousticMetrics: AcousticMetrics | null;
  start: () => Promise<void>;
  stop: () => void;
  reset: () => void;
  startLiveSTT: () => Promise<void>;
  stopLiveSTT: () => void;
}

/**
 * Detects the best audio MIME type supported by the browser/OS (especially Mobile Safari vs Chrome)
 */
function getSupportedAudioMimeType(): string {
  if (typeof MediaRecorder === "undefined" || typeof MediaRecorder.isTypeSupported !== "function") {
    return "";
  }
  const types = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/mp4",
    "audio/aac",
    "audio/ogg",
  ];
  for (const t of types) {
    if (MediaRecorder.isTypeSupported(t)) {
      return t;
    }
  }
  return "";
}

/**
 * Real microphone recording via MediaRecorder API + Live Stream Acoustic Analyzer + Mobile-Safe Speech Recognition.
 */
export function useRecorder(): RecorderState {
  const [status, setStatus] = useState<RecorderState["status"]>("idle");
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [spokenTranscript, setSpokenTranscript] = useState<string | null>(null);
  const [durationMs, setDurationMs] = useState(0);
  const [isSupported, setIsSupported] = useState(true);
  const [isListeningSTT, setIsListeningSTT] = useState(false);
  const [liveAcousticMetrics, setLiveAcousticMetrics] = useState<AcousticMetrics | null>(null);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const speechRecognitionRef = useRef<any>(null);
  const liveSTTRef = useRef<any>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const startedAtRef = useRef(0);
  const streamRef = useRef<MediaStream | null>(null);

  // Live in-stream Web Audio processing refs (Bypasses decodeAudioData mobile bugs)
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const samplerIntervalRef = useRef<any>(null);
  const liveMetricsRef = useRef({
    frameCount: 0,
    voicedCount: 0,
    sumRms: 0,
    maxPeak: 0,
    sumZcr: 0,
    sumLow: 0,
    sumMid: 0,
    sumHigh: 0,
    sumWeightedFreq: 0,
    sumMag: 0,
    lastEnergy: 0,
    modulationSum: 0,
  });

  useEffect(() => {
    if (typeof window === "undefined" || !navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setIsSupported(false);
    }
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      if (speechRecognitionRef.current) {
        try { speechRecognitionRef.current.stop(); } catch (e) {}
      }
      if (liveSTTRef.current) {
        try { liveSTTRef.current.stop(); } catch (e) {}
      }
      if (samplerIntervalRef.current) {
        clearInterval(samplerIntervalRef.current);
      }
      try { audioCtxRef.current?.close(); } catch {}
    };
  }, []);

  const cleanupUrl = useCallback(() => {
    setAudioUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
  }, []);

  /**
   * Standalone Live Speech-to-Text (STT) without MediaRecorder mic hardware lock.
   * Runs natively on Mobile Chrome and iOS Safari without any audio device conflicts.
   */
  const startLiveSTT = useCallback(async () => {
    setError(null);
    if (typeof window === "undefined") return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("Speech recognition is not supported in this browser. Try Chrome or Safari.");
      return;
    }

    try {
      if (liveSTTRef.current) {
        try { liveSTTRef.current.stop(); } catch (e) {}
      }

      const sr = new SpeechRecognition();
      sr.lang = "hi-IN";
      sr.continuous = false; // Mobile-safe single utterance
      sr.interimResults = true;
      sr.maxAlternatives = 3;

      sr.onstart = () => {
        setIsListeningSTT(true);
      };

      sr.onresult = (event: any) => {
        let currentText = "";
        for (let i = 0; i < event.results.length; i++) {
          const res = event.results[i];
          if (res && res[0]) {
            currentText += res[0].transcript + " ";
          }
        }
        const cleanText = currentText.trim();
        if (cleanText) {
          setSpokenTranscript(cleanText);
        }
      };

      sr.onerror = (e: any) => {
        console.warn("Live STT notice:", e.error);
        if (e.error === "language-not-supported") {
          try {
            const fallbackSr = new SpeechRecognition();
            fallbackSr.lang = "en-IN";
            fallbackSr.interimResults = true;
            fallbackSr.onresult = sr.onresult;
            fallbackSr.onend = () => setIsListeningSTT(false);
            fallbackSr.start();
            liveSTTRef.current = fallbackSr;
            return;
          } catch {}
        }
        setIsListeningSTT(false);
      };

      sr.onend = () => {
        setIsListeningSTT(false);
      };

      sr.start();
      liveSTTRef.current = sr;
    } catch (e) {
      console.warn("Failed to start Live STT:", e);
      setIsListeningSTT(false);
    }
  }, []);

  const stopLiveSTT = useCallback(() => {
    if (liveSTTRef.current) {
      try { liveSTTRef.current.stop(); } catch (e) {}
    }
    setIsListeningSTT(false);
  }, []);

  /**
   * Audio Recording with in-stream real-time acoustic signal sampling (Mobile Chrome & iOS Safari compatible)
   */
  const start = useCallback(async () => {
    setError(null);
    cleanupUrl();
    setAudioBlob(null);
    setSpokenTranscript(null);
    setLiveAcousticMetrics(null);
    setDurationMs(0);

    // Reset live acoustic metrics accumulators
    liveMetricsRef.current = {
      frameCount: 0,
      voicedCount: 0,
      sumRms: 0,
      maxPeak: 0,
      sumZcr: 0,
      sumLow: 0,
      sumMid: 0,
      sumHigh: 0,
      sumWeightedFreq: 0,
      sumMag: 0,
      lastEnergy: 0,
      modulationSum: 0,
    };

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("unsupported");
      }

      const isMobile = typeof navigator !== "undefined" && 
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

      // 1. Initialize AudioContext synchronously on user gesture (avoids iOS suspended state)
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      let audioCtx: AudioContext | null = null;
      if (AudioCtxClass) {
        try {
          audioCtx = new AudioCtxClass();
          if (audioCtx.state === "suspended") {
            audioCtx.resume().catch(() => {});
          }
          audioCtxRef.current = audioCtx;
        } catch {}
      }

      // 2. On desktop only, attempt background SpeechRecognition
      if (!isMobile) {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
          try {
            if (speechRecognitionRef.current) {
              try { speechRecognitionRef.current.stop(); } catch (e) {}
            }
            const sr = new SpeechRecognition();
            sr.lang = "hi-IN";
            sr.continuous = true;
            sr.interimResults = true;
            sr.maxAlternatives = 3;

            sr.onresult = (event: any) => {
              let currentText = "";
              for (let i = 0; i < event.results.length; i++) {
                const res = event.results[i];
                if (res && res[0]) {
                  currentText += res[0].transcript + " ";
                }
              }
              const cleanText = currentText.trim();
              if (cleanText) {
                setSpokenTranscript(cleanText);
              }
            };

            sr.onerror = () => {};
            sr.start();
            speechRecognitionRef.current = sr;
          } catch {}
        }
      }

      // 3. Request microphone stream with mobile-optimized constraints
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      streamRef.current = stream;
      chunksRef.current = [];

      // 4. Hook live stream to Web Audio Analyser (Real-Time in-stream feature extraction)
      if (audioCtx) {
        try {
          const source = audioCtx.createMediaStreamSource(stream);
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 1024;
          analyser.smoothingTimeConstant = 0.2;
          source.connect(analyser);

          sourceNodeRef.current = source;
          analyserRef.current = analyser;

          const timeDomain = new Float32Array(analyser.fftSize);
          const freqData = new Float32Array(analyser.frequencyBinCount);
          const sampleRate = audioCtx.sampleRate || 44100;
          const binWidth = (sampleRate / 2) / analyser.frequencyBinCount;

          if (samplerIntervalRef.current) clearInterval(samplerIntervalRef.current);

          samplerIntervalRef.current = setInterval(() => {
            if (!analyserRef.current) return;
            analyserRef.current.getFloatTimeDomainData(timeDomain);
            analyserRef.current.getFloatFrequencyData(freqData);

            const m = liveMetricsRef.current;
            let sumSq = 0;
            let zc = 0;
            for (let i = 0; i < timeDomain.length; i++) {
              const v = timeDomain[i];
              const absV = Math.abs(v);
              if (absV > m.maxPeak) m.maxPeak = absV;
              sumSq += v * v;
              if (i > 0) {
                const prev = timeDomain[i - 1];
                if ((v >= 0 && prev < 0) || (v < 0 && prev >= 0)) zc++;
              }
            }
            const rms = Math.sqrt(sumSq / timeDomain.length);
            m.frameCount++;

            if (m.lastEnergy > 0) {
              m.modulationSum += Math.abs(rms - m.lastEnergy);
            }
            m.lastEnergy = rms;

            // Voiced frames accumulation
            if (rms > 0.012) {
              m.voicedCount++;
              m.sumRms += rms;
              m.sumZcr += zc / (timeDomain.length * 2);

              for (let b = 0; b < freqData.length; b++) {
                const freq = b * binWidth;
                const db = freqData[b];
                if (db > -80) {
                  const mag = Math.pow(10, db / 20);
                  m.sumWeightedFreq += freq * mag;
                  m.sumMag += mag;

                  if (freq < 1000) m.sumLow += mag;
                  else if (freq < 4000) m.sumMid += mag;
                  else m.sumHigh += mag;
                }
              }
            }
          }, 40); // 25 times per second
        } catch (audioCtxErr) {
          console.warn("Live acoustic sampler init notice:", audioCtxErr);
        }
      }

      // 5. Initialize MediaRecorder with cross-platform MIME type
      const preferredMime = getSupportedAudioMimeType();
      const options: MediaRecorderOptions = preferredMime ? { mimeType: preferredMime } : {};

      let recorder: MediaRecorder;
      try {
        recorder = new MediaRecorder(stream, options);
      } catch (mimeErr) {
        recorder = new MediaRecorder(stream);
      }

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const finalType = recorder.mimeType || preferredMime || "audio/webm";
        const blob = new Blob(chunksRef.current, { type: finalType });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        const duration = Date.now() - startedAtRef.current;
        setDurationMs(duration);
        setStatus("recorded");

        // Clean up hardware microphone stream
        stream.getTracks().forEach((t) => t.stop());
        streamRef.current = null;

        // Finalize Live Stream Acoustic Metrics
        if (samplerIntervalRef.current) {
          clearInterval(samplerIntervalRef.current);
          samplerIntervalRef.current = null;
        }

        const m = liveMetricsRef.current;
        const totalBand = m.sumLow + m.sumMid + m.sumHigh;
        const isSilence = m.voicedCount < 3 || m.maxPeak < 0.02 || duration < 250;

        const metrics: AcousticMetrics = {
          durationMs: duration,
          rmsEnergy: m.voicedCount > 0 ? m.sumRms / m.voicedCount : 0,
          peakEnergy: m.maxPeak,
          zeroCrossingRate: m.voicedCount > 0 ? m.sumZcr / m.voicedCount : 0,
          spectralCentroidHz: m.sumMag > 0 ? Math.round(m.sumWeightedFreq / m.sumMag) : 0,
          lowBandRatio: totalBand > 0 ? Number((m.sumLow / totalBand).toFixed(3)) : 0.33,
          midBandRatio: totalBand > 0 ? Number((m.sumMid / totalBand).toFixed(3)) : 0.33,
          highBandRatio: totalBand > 0 ? Number((m.sumHigh / totalBand).toFixed(3)) : 0.33,
          isSilenceOrNoise: isSilence,
          trillModulationIndex: m.frameCount > 0 ? Number((m.modulationSum / m.frameCount).toFixed(4)) : 0,
        };

        setLiveAcousticMetrics(metrics);

        // Disconnect Web Audio graph
        try { sourceNodeRef.current?.disconnect(); } catch {}
        try { analyserRef.current?.disconnect(); } catch {}
        try { audioCtxRef.current?.close(); } catch {}
        audioCtxRef.current = null;
      };

      recorder.onerror = () => {
        setError("Recording error. Your browser stopped the microphone.");
        setStatus("idle");
      };

      recorderRef.current = recorder;
      startedAtRef.current = Date.now();
      
      recorder.start(250);
      setStatus("recording");
    } catch (err) {
      const e = err as DOMException | Error;
      const name = (e as DOMException).name;
      if (name === "NotAllowedError" || name === "SecurityError") {
        setError("Microphone permission denied. Allow mic access in your mobile browser settings and reload.");
      } else if (name === "NotFoundError") {
        setError("No microphone found on this device. Connect a mic and retry.");
      } else if ((e as Error).message === "unsupported") {
        setIsSupported(false);
        setError("This browser does not support microphone recording. Try Chrome or Safari.");
      } else {
        setError("Could not start recording. Please check your microphone permissions.");
      }
      setStatus("idle");
    }
  }, [cleanupUrl]);

  const stop = useCallback(() => {
    const rec = recorderRef.current;
    if (rec && rec.state !== "inactive") {
      try {
        rec.stop();
      } catch {}
    } else {
      setStatus("idle");
    }
    if (speechRecognitionRef.current) {
      try { speechRecognitionRef.current.stop(); } catch (e) {}
    }
  }, []);

  const reset = useCallback(() => {
    cleanupUrl();
    setAudioBlob(null);
    setSpokenTranscript(null);
    setLiveAcousticMetrics(null);
    setDurationMs(0);
    setStatus("idle");
    setError(null);
    setIsListeningSTT(false);
    if (samplerIntervalRef.current) {
      clearInterval(samplerIntervalRef.current);
    }
    try { audioCtxRef.current?.close(); } catch {}
  }, [cleanupUrl]);

  return {
    status,
    error,
    audioUrl,
    audioBlob,
    spokenTranscript,
    durationMs,
    isSupported,
    isListeningSTT,
    liveAcousticMetrics,
    start,
    stop,
    reset,
    startLiveSTT,
    stopLiveSTT,
  };
}

/** Uses the browser SpeechSynthesis API to speak a Hindi word. Returns false if unavailable. */
export function speakHindi(text: string): boolean {
  try {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return false;
    const synth = window.speechSynthesis;
    synth.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    const voices = synth.getVoices();
    const hindi = voices.find((v) => v.lang?.toLowerCase().startsWith("hi"));
    if (hindi) utter.voice = hindi;
    utter.lang = "hi-IN";
    utter.rate = 0.8;
    utter.pitch = 1.05;
    synth.speak(utter);
    return true;
  } catch {
    return false;
  }
}
