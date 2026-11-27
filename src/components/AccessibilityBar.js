import React, { useState } from 'react';
import { CircleQuestionMark, ZoomIn, ZoomOut, Languages } from 'lucide-react';
import AccessibilityButton from './AccessibilityButton';
import { useFontSize } from '../hooks/FontSize';
import { useLanguage } from '../hooks/UseLanguage';
import { useGuide } from '../hooks/TutorialGuide';
import { useHelp } from '../hooks/UseHelp';
import { useTranslation } from 'react-i18next';

const LANGUAGE_OPTIONS = [
    { code: 'en', label: 'English' },
    { code: 'zh-CN', label: '中文 (Chinese)' },
    { code: 'ms', label: 'Bahasa Melayu' },
    { code: 'ta', label: 'தமிழ் (Tamil)' },
];

export default function AccessibilityBar() {
    const { t } = useTranslation();
    const { toggleSize, isLarge } = useFontSize();
    const { isLangOpen, menuRef, changeLanguage, toggleLangMenu, currentLanguage } = useLanguage();

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
                            title={t('help')}
                            translate="no"
                            iconSize={isLarge ? 28 : 24}
                            onClick={handleHelpClick}
                            className={
                                activeTutorial
                                    ? 'notranslate ring-4 ring-yellow-400 bg-yellow-100 font-bold text-yellow-900'
                                    : 'notranslate'
                            }
                        />

                        {/* Help Questions Dropdown Popup */}
                        {isHelpOpen && (
                            <div className="absolute left-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-[9999] animate-in fade-in zoom-in-95 duration-100">
                                <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    {t('commonQuestions')}
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
                                    <div className="px-4 py-3 text-sm text-slate-500">{t('noTutorials')}</div>
                                )}
                            </div>
                        )}
                    </div>

                    <AccessibilityButton
                        icon={isLarge ? ZoomOut : ZoomIn}
                        translate="no"
                        title={isLarge ? t('zoomOut') : t('zoomIn')}
                        iconSize={isLarge ? 28 : 24}
                        isLarge={isLarge}
                        onClick={toggleSize}
                        className="notranslate"
                    />

                    <div className="relative" ref={menuRef}>
                        <AccessibilityButton
                            icon={Languages}
                            translate="no"
                            title={t('language')}
                            iconSize={isLarge ? 28 : 24}
                            onClick={toggleLangMenu}
                            className="notranslate"
                        />

                        {/* Language Selection Popup Menu */}
                        {isLangOpen && (
                            <div translate="no" className="notranslate absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-[9999] animate-in fade-in zoom-in-95 duration-100">
                                <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    {t('selectLanguage')}
                                </div>
                                {LANGUAGE_OPTIONS.map((option) => {
                                    const isSelected = currentLanguage === option.code;
                                    return (
                                        <button
                                            key={option.code}
                                            onClick={() => changeLanguage(option.code)}
                                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors font-medium flex items-center justify-between ${
                                                isSelected
                                                    ? 'bg-slate-100 text-slate-900 font-semibold'
                                                    : 'text-slate-700 hover:bg-slate-50'
                                            }`}
                                        >
                                            <span>{option.label}</span>
                                            {isSelected && <span>✓</span>}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
                {activeTutorial && (
                    <div className="mt-3 px-4 rounded-xl text-sm font-bold flex items-center">
                        <span className="truncate pr-2">
                            {t('helpInstruction', { instruction: activeTutorial.instruction })}
                        </span>
                    </div>
                )}
            </div>
        </header>
    );
}