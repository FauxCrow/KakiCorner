import { useState, useEffect, useRef } from 'react';

export function useHelp() {
    const [isHelpOpen, setIsHelpOpen] = useState(false);
    const menuRef = useRef(null);

    const toggleHelpMenu = () => setIsHelpOpen((prev) => !prev);
    const closeHelpMenu = () => setIsHelpOpen(false);

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsHelpOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return { isHelpOpen, menuRef, toggleHelpMenu, closeHelpMenu };
}