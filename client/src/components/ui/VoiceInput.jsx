import React from 'react';
import { Mic, MicOff } from 'lucide-react';
import { useSpeech } from '@/hooks/useSpeech';
import { useLanguage } from '@/context/LanguageContext';

export default function VoiceInput({ value, onChange, placeholder, icon: Icon, type = "text", className = "" }) {
    const { lang } = useLanguage();
    const { listen, stopListening, isListening, hasRecognitionSupport } = useSpeech(lang);

    const handleMicClick = () => {
        if (isListening) {
            stopListening();
        } else {
            listen((text) => {
                // When we receive text, we call onChange with a synthetic event-like object
                onChange({ target: { value: text } });
            });
        }
    };

    return (
        <div className={`relative group flex items-center ${className}`}>
            <div className="relative flex-1">
                <input
                    className="w-full p-4 pl-12 pr-14 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32] transition-all text-gray-900 font-bold text-lg placeholder:font-normal placeholder:text-gray-400"
                    type={type}
                    value={value || ""}
                    onChange={onChange}
                    placeholder={placeholder}
                />
                {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400 group-focus-within:text-[#2E7D32]" />}
            </div>

            {hasRecognitionSupport && (
                <button
                    type="button"
                    onClick={handleMicClick}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-xl transition-all shadow-sm ${isListening
                            ? 'bg-red-500 text-white animate-pulse shadow-red-200'
                            : 'bg-[#E8F5E9] text-[#2E7D32] hover:bg-[#C5E1A5]'
                        }`}
                    title="Voice Input"
                >
                    {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
            )}
        </div>
    );
}
