import { useCallback, useEffect, useRef, useState } from "react";

export interface RecorderState {
  status: "idle" | "recording" | "recorded";
  error: string | null;
  audioUrl: string | null;
  audioBlob: Blob | null;
  spokenTranscript: string | null;
  durationMs: number;
  isSupported: boolean;
  isListeningSTT: boolean;
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
 * Real microphone recording via MediaRecorder API + Mobile-Safe Speech Recognition.
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

  const recorderRef = useRef<MediaRecorder | null>(null);
  const speechRecognitionRef = useRef<any>(null);
  const liveSTTRef = useRef<any>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const startedAtRef = useRef(0);
  const streamRef = useRef<MediaStream | null>(null);

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
          // Fallback to English (India) phonetics if Hindi voice pack is missing on device
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
   * Audio Recording with cross-platform mobile compatibility (iOS Safari + Android Chrome)
   */
  const start = useCallback(async () => {
    setError(null);
    cleanupUrl();
    setAudioBlob(null);
    setSpokenTranscript(null);
    setDurationMs(0);

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("unsupported");
      }

      const isMobile = typeof navigator !== "undefined" && 
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

      // 1. Attempt non-blocking SpeechRecognition for live transcription
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          if (speechRecognitionRef.current) {
            try { speechRecognitionRef.current.stop(); } catch (e) {}
          }
          const sr = new SpeechRecognition();
          sr.lang = "hi-IN";
          // Important: Mobile browsers abort on continuous=true; desktop supports continuous
          sr.continuous = !isMobile;
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

          sr.onerror = (e: any) => {
            // Mobile devices may yield 'audio-capture' or 'aborted' when getUserMedia locks the mic
            console.warn("Speech recognition notice (non-fatal):", e.error);
          };

          sr.start();
          speechRecognitionRef.current = sr;
        } catch (e) {
          console.warn("SpeechRecognition init warning:", e);
        }
      }

      // 2. Request microphone stream with mobile-optimized constraints
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      streamRef.current = stream;
      chunksRef.current = [];

      const preferredMime = getSupportedAudioMimeType();
      const options: MediaRecorderOptions = preferredMime ? { mimeType: preferredMime } : {};

      let recorder: MediaRecorder;
      try {
        recorder = new MediaRecorder(stream, options);
      } catch (mimeErr) {
        // Fallback for Safari/iOS if specific mime is rejected
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
        setDurationMs(Date.now() - startedAtRef.current);
        setStatus("recorded");

        // Clean up hardware microphone stream
        stream.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      };

      recorder.onerror = () => {
        setError("Recording error. Your browser stopped the microphone.");
        setStatus("idle");
      };

      recorderRef.current = recorder;
      startedAtRef.current = Date.now();
      
      // Request timeslices so dataavailable fires reliably across mobile browsers
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
    setDurationMs(0);
    setStatus("idle");
    setError(null);
    setIsListeningSTT(false);
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
