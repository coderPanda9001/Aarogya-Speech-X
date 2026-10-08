import { useCallback, useEffect, useRef, useState } from "react";

export interface RecorderState {
  status: "idle" | "recording" | "recorded";
  error: string | null;
  audioUrl: string | null;
  audioBlob: Blob | null;
  spokenTranscript: string | null;
  durationMs: number;
  isSupported: boolean;
  start: () => Promise<void>;
  stop: () => void;
  reset: () => void;
}

/**
 * Real microphone recording via MediaRecorder API + Live WebSpeech STT transcription.
 */
export function useRecorder(): RecorderState {
  const [status, setStatus] = useState<RecorderState["status"]>("idle");
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [spokenTranscript, setSpokenTranscript] = useState<string | null>(null);
  const [durationMs, setDurationMs] = useState(0);
  const [isSupported, setIsSupported] = useState(true);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const speechRecognitionRef = useRef<any>(null);
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
    };
  }, []);

  const cleanupUrl = useCallback(() => {
    setAudioUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
  }, []);

  // Pre-warm SpeechRecognition instance on mount for immediate first-attempt capture
  useEffect(() => {
    if (typeof window === "undefined") return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition && !speechRecognitionRef.current) {
      try {
        const sr = new SpeechRecognition();
        sr.lang = "hi-IN";
        sr.continuous = true;
        sr.interimResults = true;
        sr.maxAlternatives = 3;
        speechRecognitionRef.current = sr;
      } catch (e) {}
    }
  }, []);

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

      // 1. Start SpeechRecognition FIRST so it warms up before audio stream capture
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

          sr.onerror = (e: any) => {
            console.warn("Speech recognition notice:", e.error);
          };

          sr.start();
          speechRecognitionRef.current = sr;
        } catch (e) {
          console.warn("SpeechRecognition init warning:", e);
        }
      }

      // 2. Obtain audio stream and start MediaRecorder
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        setDurationMs(Date.now() - startedAtRef.current);
        setStatus("recorded");
        stream.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      };
      recorder.onerror = () => {
        setError("Recording error. Your browser stopped the microphone.");
        setStatus("idle");
      };

      recorderRef.current = recorder;
      startedAtRef.current = Date.now();
      recorder.start();
      setStatus("recording");
    } catch (err) {
      const e = err as DOMException | Error;
      const name = (e as DOMException).name;
      if (name === "NotAllowedError" || name === "SecurityError") {
        setError("Microphone permission denied. Allow mic access in your browser, then try again.");
      } else if (name === "NotFoundError") {
        setError("No microphone found on this device. Connect a mic and retry.");
      } else if ((e as Error).message === "unsupported") {
        setIsSupported(false);
        setError("This browser does not support microphone recording. Try Chrome, Edge or Safari.");
      } else {
        setError("Could not start recording. Please check your microphone and retry.");
      }
      setStatus("idle");
    }
  }, [cleanupUrl]);

  const stop = useCallback(() => {
    const rec = recorderRef.current;
    if (rec && rec.state !== "inactive") {
      rec.stop();
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
  }, [cleanupUrl]);

  return { status, error, audioUrl, audioBlob, spokenTranscript, durationMs, isSupported, start, stop, reset };
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
