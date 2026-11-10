import React, { useState } from 'react';
import { CircleQuestionMark, ZoomIn, ZoomOut, Languages } from 'lucide-react';
import AccessibilityButton from './AccessibilityButton';
import { useFontSize } from '../hooks/FontSize';
import { useLanguage } from '../hooks/UseLanguage';
import { useGuide } from '../hooks/TutorialGuide';
import { useHelp } from '../hooks/UseHelp';

export default function AccessibilityBar() {
    const { toggleSize, isLarge } = useFontSize();
    const { isLangOpen, menuRef, changeLanguage, toggleLangMenu } = useLanguage();

    const { isHelpOpen, menuRef: helpMenuRef, toggleHelpMenu, closeHelpMenu } = useHelp();
    const { tutorials, activeTutorial, startGuide, cancelGuide } = useGuide();

    const handleHelpClick = () => {
        if (activeTutorial) {
            cancelGuide();
            closeHelpMenu();
        } else {
            toggleHelpMenu();
        }
    };

    return (
        <header className="w-full p-4 z-50 bg-white shadow-sm flex-shrink-0 relative overflow-visible">
            <div className="max-w-md mx-auto w-full">
                <div className="grid grid-cols-3 gap-3 w-full">
                    {/* Help Button Dropdown Container */}
                    <div className="relative" ref={helpMenuRef}>
                        <AccessibilityButton
                            icon={CircleQuestionMark}
                            title='Help'
                            iconSize={isLarge ? 28 : 24}
                            onClick={handleHelpClick}
                            className={
                                activeTutorial
                                    ? 'ring-4 ring-yellow-400 bg-yellow-100 font-bold text-yellow-900'
                                    : ''
                            }
                        />

                        {/* Help Questions Dropdown Popup */}
                        {isHelpOpen && (
                            <div className="absolute left-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-[9999] animate-in fade-in zoom-in-95 duration-100">
                                <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    Common Questions
                                </div>
                                {tutorials && tutorials.length > 0 ? (
                                    tutorials.map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => {
                                                startGuide(item.id);
                                                closeHelpMenu();
                                            }}
                                            className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors font-medium flex items-center space-x-2 border-b border-slate-100 last:border-none"
                                        >
                                            <span>❓</span>
                                            <span>{item.question}</span>
                                        </button>
                                    ))
                                ) : (
                                    <div className="px-4 py-3 text-sm text-slate-500">No tutorials available</div>
                                )}
                            </div>
                        )}
                    </div>

                    <AccessibilityButton icon={isLarge ? ZoomOut : ZoomIn} title={isLarge ? 'Zoom Out' : 'Zoom In'} iconSize={isLarge ? 28 : 24} isLarge={isLarge} onClick={toggleSize} />

                    <div className="relative" ref={menuRef}>
                        <AccessibilityButton
                            icon={Languages}
                            title='Language'
                            iconSize={isLarge ? 28 : 24}
                            onClick={toggleLangMenu}
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
                {activeTutorial && (
                    <div className="mt-3 px-4 rounded-xl text-sm font-bold flex items-center">
                        <span className="truncate pr-2">Help: {activeTutorial.instruction}</span>
                    </div>
                )}
            </div>
        </header>
    );
}
