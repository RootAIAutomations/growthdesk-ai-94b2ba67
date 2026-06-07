import { useState, useRef, useCallback } from "react";

export type TranscriptionState = "idle" | "listening" | "error";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecognition = any;

export function useVoiceTranscription(onTranscript: (text: string) => void) {
  const [state, setState] = useState<TranscriptionState>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const recognitionRef = useRef<AnyRecognition>(null);

  const isSupported =
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  const start = useCallback(() => {
    if (!isSupported) {
      setErrorMsg("Voice input is not supported in this browser. Try Chrome.");
      setState("error");
      return;
    }

    const SpeechRecognitionClass =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    const recognition: AnyRecognition = new SpeechRecognitionClass();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setState("listening");
      setErrorMsg(null);
    };

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results as any[])
        .map((r: any) => r[0].transcript)
        .join(" ")
        .trim();
      onTranscript(transcript);
      setState("idle");
    };

    recognition.onerror = (event: any) => {
      setErrorMsg(event.error === "not-allowed"
        ? "Microphone access denied. Allow it in your browser settings."
        : `Voice error: ${event.error}`);
      setState("error");
    };

    recognition.onend = () => {
      setState("idle");
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [isSupported, onTranscript]);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setState("idle");
  }, []);

  return { state, errorMsg, isSupported, start, stop };
}
