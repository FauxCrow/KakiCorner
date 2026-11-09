import { useState, useEffect, useRef } from 'react';

export function useLanguage() {
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

    // Function to trigger GTranslate
    const changeLanguage = (langCode) => {
        setIsLangOpen(false);

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
    };
}