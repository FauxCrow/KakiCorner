import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

// Deletes the saved language cookie so the page loads in English (used on a fresh open)
export function resetLanguageToEnglish() {
    const expired = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    document.cookie = expired;
    document.cookie = `${expired}; domain=${window.location.hostname}`;
    document.cookie = `${expired}; domain=.${window.location.hostname}`;
}

export function useLanguage() {
    const { i18n } = useTranslation();
    const [isLangOpen, setIsLangOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsLangOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const changeLanguage = async (langCode) => {
        setIsLangOpen(false);

        // 1. Update i18next for static UI text
        if (typeof i18n?.changeLanguage === 'function') {
            await i18n.changeLanguage(langCode);
        }

        // 2. Trigger GTranslate for dynamic/unmarked text
        if (langCode === 'en') {
            resetLanguageToEnglish();
        }

        if (typeof window.doGTranslate === 'function') {
            window.doGTranslate(`en|${langCode}`);
        } else {
            const cookieValue = langCode === 'en' ? '/en/en' : `/en/${langCode}`;
            document.cookie = `googtrans=${cookieValue}; path=/; domain=${window.location.hostname}`;
            document.cookie = `googtrans=${cookieValue}; path=/;`;
            window.location.reload();
        }
    };

    const toggleLangMenu = () => setIsLangOpen((prev) => !prev);

    return {
        isLangOpen,
        menuRef,
        changeLanguage,
        toggleLangMenu,
        currentLanguage: i18n.language,
    };
}