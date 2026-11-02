import React from 'react';

export default function StepIndicator({
    current = 1,
    total = 5
}) {
    const steps = Array.from({ length: total }, (_, index) => index + 1);

    return (
        <div className="flex items-center justify-center gap-x-3">
            {steps.map((step) => (
                <div
                    key={step}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${step === current ? 'bg-gray-400 shadow-md' : 'bg-gray-200'}`}
                >
                    {step}
                </div>
            ))}
        </div>
    );
}
