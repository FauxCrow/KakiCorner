import { useState, useRef, useEffect } from 'react';

export default function DropdownButton({ value, onChange, options, placeholder }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedLabel = options.find(opt => opt.value === value)?.label || placeholder;

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Trigger Button */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="py-1.5 px-2 text-sm bg-white border border-gray-300 rounded-lg cursor-pointer truncate flex items-center justify-between select-none"
            >
                <span className="truncate">{selectedLabel}</span>
                <span className="text-gray-400 text-[10px] ml-1">▼</span>
            </div>

            {/* Popup Menu */}
            {isOpen && (
                <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                    {options.map((opt) => (
                        <div
                            key={opt.value}
                            onClick={() => { onChange(opt.value); setIsOpen(false); }}
                            className={`py-1.5 px-2 text-xs hover:bg-blue-50 cursor-pointer truncate ${value === opt.value ? 'font-bold bg-blue-100' : ''}`}
                        >
                            {opt.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}