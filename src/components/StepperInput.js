import React from 'react';
import { Plus, Minus } from 'lucide-react';

// Square +/- button; stays in the layout when hidden so the inputs don't shift
function StepButton({ icon: Icon, isVisible, isDisabled = false, onClick }) {
    return (
        <button
            className={`w-10 h-10 bg-gray-100 rounded-lg shadow-md flex items-center justify-center flex-shrink-0 hover:scale-105 transition disabled:opacity-30 disabled:hover:scale-100 ${isVisible ? '' : 'invisible'}`}
            disabled={isDisabled}
            onClick={onClick}
        >
            <Icon size={18} />
        </button>
    );
}

export default function StepperInput({
    value = "",
    onChange,
    onIncrement,
    onDecrement,
    orientation = "vertical",
    showIncrement = true,
    showDecrement = true,
    incrementDisabled = false,
    decrementDisabled = false,
    readOnly = false,
    inputMode = "numeric",
    className = ""
}) {
    const isVertical = orientation === "vertical";

    // const incrementButton = <StepButton icon={Plus} isVisible={showIncrement} onClick={onIncrement} />;
    // const decrementButton = <StepButton icon={Minus} isVisible={showDecrement} onClick={onDecrement} />;
    const incrementButton = <StepButton icon={Plus} isVisible={showIncrement} isDisabled={incrementDisabled} onClick={onIncrement} />;
    const decrementButton = <StepButton icon={Minus} isVisible={showDecrement} isDisabled={decrementDisabled} onClick={onDecrement} />;

    return (
        <div className={`flex items-center gap-3 ${isVertical ? 'flex-col' : 'flex-row'} ${className}`}>
            {isVertical ? incrementButton : decrementButton}

            <input
                type="text"
                inputMode={inputMode}
                value={value}
                readOnly={readOnly}
                onChange={(e) => onChange?.(e.target.value)}
                className="w-full min-w-0 p-3 rounded-xl border-2 border-gray-200 text-center text-base focus:outline-none"
            />

            {isVertical ? decrementButton : incrementButton}
        </div>
    );
}
