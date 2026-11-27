import React, { createContext, useContext, useState, useRef } from 'react';
import Toast from '../components/Toast';
import { getCurrentUser } from '../utils/db';

// The default lets pages still work (without a popup) if they're ever shown outside the provider
const ToastContext = createContext({ showToast: () => {} });

// Wraps the app so any page can call showToast("...") and the message stays up even after changing page
export const ToastProvider = ({ children }) => {
    const [message, setMessage] = useState("");
    const timerRef = useRef(null);

    const showToast = (text, duration = 3000) => {
        // A new message restarts the timer instead of being cut short by the old one
        clearTimeout(timerRef.current);
        setMessage(text);
        timerRef.current = setTimeout(() => setMessage(""), duration);
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {message && <Toast message={message} />}
        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);

// Demo only: nothing is really sent, it just tells users with a caretaker that they were "notified"
export const useNotifyCaretaker = () => {
    const { showToast } = useToast();

    return () => {
        if (getCurrentUser()?.has_caretaker) {
            showToast("Your caretaker has been notified.");
        }
    };
};
