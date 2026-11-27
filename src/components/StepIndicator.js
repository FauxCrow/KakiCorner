import React from 'react';

export default function StepIndicator({
    current = 1,
    total = 5,
    onStepClick
}) {
    const steps = Array.from({ length: total }, (_, index) => index + 1);

    return (
        <div className="flex items-center justify-center gap-x-3">
            {steps.map((step) => (
                // <div
                //     key={step}
                //     className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${step === current ? 'bg-gray-400 shadow-md' : 'bg-gray-200'}`}
                // >
                //     {step}
                // </div>

                // Each number is a button when the wizard passes onStepClick; the wizard decides if the jump is allowed
                <button
                    key={step}
                    aria-label={`Go to step ${step}`}
                    disabled={!onStepClick}
                    onClick={() => step !== current && onStepClick(step)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-xl transition ${step === current ? 'bg-gray-400 shadow-md' : 'bg-gray-200'} ${onStepClick && step !== current ? 'hover:scale-110 cursor-pointer' : 'cursor-default'}`}
                >
                    {step}
                </button>
            ))}
        </div>
    );
}
