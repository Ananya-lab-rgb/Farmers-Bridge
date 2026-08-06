import React from 'react';
import { useLanguage, LANGUAGES } from '@/context/LanguageContext';
import { Languages } from 'lucide-react';

export default function LanguageSelector() {
    const { lang, setLang } = useLanguage();

    return (
        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm p-1.5 rounded-full border border-gray-200 shadow-sm">
            <div className="w-8 h-8 rounded-full bg-[#E8F5E9] flex items-center justify-center text-[#2E7D32]">
                <Languages className="w-4 h-4" />
            </div>
            <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="bg-transparent text-sm font-bold text-[#1A2E1A] outline-none cursor-pointer pr-2 appearance-none"
                style={{ textAlignLast: 'center' }}
            >
                {LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>
                        {l.native}
                    </option>
                ))}
            </select>
        </div>
    );
}
