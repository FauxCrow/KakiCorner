import React from 'react';
import { CircleQuestionMark, ZoomIn, ZoomOut, Languages } from 'lucide-react';
import AccessibilityButton from './AccessibilityButton';
import { useFontSize } from '../hooks/FontSize';
import { useEffect, useState, useRef } from "react";

// TODO: function to show tutorial overlay
// TODO: function to change language

export default function AccessibilityBar() {
    const { toggleSize, isLarge } = useFontSize();

    const [isLangOpen, setIsLangOpen] = useState(false);
    const menuRef = useRef(null);

    // Closes popup when clicking outside of it
    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsLangOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Function to change language via Google Translate Cookie & reload
    const changeLanguage = (langCode) => {
        const cookieValue = langCode === 'en' ? '/en/en' : `/en/${langCode}`;

        document.cookie = `googtrans=${cookieValue}; path=/; domain=${window.location.hostname}`;
        document.cookie = `googtrans=${cookieValue}; path=/;`; // fallback for localhost

        setIsLangOpen(false);
        window.location.reload(); // Reloads app to cleanly render translated DOM elements
    };

    return (
        <header className="w-full p-4 z-50 bg-white shadow-sm flex-shrink-0 relative overflow-visible">
            <div className="max-w-md mx-auto w-full">
                <div className="grid grid-cols-3 gap-3 w-full">
                    <AccessibilityButton icon={CircleQuestionMark} title='Help' iconSize={isLarge ? 28 : 24} onClick={() => alert('Help!')} />
                    <AccessibilityButton icon={isLarge ? ZoomOut : ZoomIn} title={isLarge ? 'Zoom Out' : 'Zoom In'} iconSize={isLarge ? 28 : 24} isLarge={isLarge} onClick={toggleSize} />
                    <div className="relative" ref={menuRef}>
                        <AccessibilityButton 
                            icon={Languages} 
                            title='Language' 
                            iconSize={isLarge ? 28 : 24} 
                            onClick={() => setIsLangOpen(!isLangOpen)} 
                        />

                        {/* Language Selection Popup Menu */}
                        {isLangOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-[9999] animate-in fade-in zoom-in-95 duration-100">
                                <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    Select Language
                                </div>
                                <button
                                    onClick={() => changeLanguage('en')}
                                    className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors font-medium flex items-center justify-between"
                                >
                                    <span>English</span>
                                </button>
                                <button
                                    onClick={() => changeLanguage('zh-CN')}
                                    className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors font-medium flex items-center justify-between"
                                >
                                    <span>中文 (Chinese)</span>
                                </button>
                                <button
                                    onClick={() => changeLanguage('ms')}
                                    className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors font-medium flex items-center justify-between"
                                >
                                    <span>Bahasa Melayu</span>
                                </button>
                                <button
                                    onClick={() => changeLanguage('ta')}
                                    className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors font-medium flex items-center justify-between"
                                >
                                    <span>தமிழ் (Tamil)</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
