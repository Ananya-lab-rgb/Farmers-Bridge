import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useSpeech } from '@/hooks/useSpeech';
import { useLanguage } from '@/context/LanguageContext';

export default function SpeakButton({ textToSpeak, ariaLabel = "Speak" }) {
    const { lang } = useLanguage();
    const { speak, stopSpeaking, isSpeaking, hasSynthesisSupport } = useSpeech(lang);

    if (!hasSynthesisSupport) return null;

    const handleClick = () => {
        if (isSpeaking) {
            stopSpeaking();
        } else {
            speak(textToSpeak);
        }
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            className={`w-12 h-12 flex items-center justify-center rounded-full transition-all shadow-md ${isSpeaking
                    ? 'bg-[#C5E1A5] text-[#1B5E20] animate-pulse shadow-green-200'
                    : 'bg-white text-[#2E7D32] hover:bg-[#E8F5E9] border-2 border-[#E8F5E9]'
                }`}
            aria-label={ariaLabel}
            title={ariaLabel}
        >
            {isSpeaking ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
        </button>
    );
}
