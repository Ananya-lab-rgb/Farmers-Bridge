import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const LANGUAGES = [
    { code: 'en-IN', label: 'Indian English', native: 'English (India)' },
    { code: 'hi-IN', label: 'Hindi', native: 'हिन्दी' },
    { code: 'ta-IN', label: 'Tamil', native: 'தமிழ்' },
    { code: 'te-IN', label: 'Telugu', native: 'తెలుగు' },
    { code: 'kn-IN', label: 'Kannada', native: 'ಕನ್ನಡ' },
    { code: 'ml-IN', label: 'Malayalam', native: 'മലയാളം' },
    { code: 'mr-IN', label: 'Marathi', native: 'मराठी' }
];

export function LanguageProvider({ children }) {
    // Try to load from localStorage, default to English
    const [lang, setLang] = useState(() => {
        return localStorage.getItem('farmerBridgeLang') || 'en-IN';
    });

    useEffect(() => {
        localStorage.setItem('farmerBridgeLang', lang);
    }, [lang]);

    const value = {
        lang,
        setLang,
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    return useContext(LanguageContext);
}
