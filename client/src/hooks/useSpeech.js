import { useState, useCallback, useEffect } from 'react';

export function useSpeech(lang = 'en-IN') {
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [recognition, setRecognition] = useState(null);
    const [synth, setSynth] = useState(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SpeechRecognition) {
                const rec = new SpeechRecognition();
                rec.continuous = false; // Stop after a single phrase
                rec.interimResults = false; // Final results only
                rec.lang = lang;
                setRecognition(rec);
            }
            if (window.speechSynthesis) {
                setSynth(window.speechSynthesis);
            }
        }
    }, [lang]);

    const speak = useCallback((text) => {
        if (!synth) return;
        synth.cancel(); // Stop any current speech
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;

        // Enhance Voice Selection to correctly match the Locale
        // We explicitly search for matching voices for the locale (e.g. hi-IN, en-IN)
        const voices = synth.getVoices();

        // 1. Try to find exact locale match first (e.g., 'hi-IN')
        let preferredVoice = voices.find(v => v.lang === lang && (v.name.includes('Female') || v.name.includes('Google') || v.name.includes('Natural')));

        // 2. Try generic language match (e.g., 'hi')
        if (!preferredVoice) {
            preferredVoice = voices.find(v => v.lang.startsWith(lang.split('-')[0]));
        }

        // 3. Force 'en-IN' (Indian English) if a specific regional dialect voice is missing
        // This ensures names and sentences are pronounced with an Indian accent instead of US/UK
        if (!preferredVoice) {
            preferredVoice = voices.find(v => v.lang === 'en-IN');
        }

        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        synth.speak(utterance);
    }, [synth, lang]);

    const stopSpeaking = useCallback(() => {
        if (synth) {
            synth.cancel();
            setIsSpeaking(false);
        }
    }, [synth]);

    const listen = useCallback((onResult, onError) => {
        if (!recognition) {
            if (onError) onError(new Error("Speech recognition not supported in this browser."));
            return;
        }

        // Stop current before starting 
        try { recognition.abort(); } catch (e) { }

        recognition.onstart = () => setIsListening(true);

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            if (onResult) onResult(transcript);
        };

        recognition.onerror = (event) => {
            console.error("Speech Recognition Error:", event.error);
            setIsListening(false);
            if (onError) onError(new Error(event.error));
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        // Ensure language is updated in case it changed
        recognition.lang = lang;
        try {
            recognition.start();
        } catch (e) {
            console.error("Failed to start recognition:", e);
        }

    }, [recognition, lang]);

    const stopListening = useCallback(() => {
        if (recognition) {
            recognition.stop();
            setIsListening(false);
        }
    }, [recognition]);

    return {
        speak,
        listen,
        stopSpeaking,
        stopListening,
        isListening,
        isSpeaking,
        hasRecognitionSupport: !!recognition,
        hasSynthesisSupport: !!synth
    };
}
