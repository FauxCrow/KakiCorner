import React from 'react';
import { CircleQuestionMark, ZoomIn, Languages } from 'lucide-react';
import AccessibilityButton from './AccessibilityButton';

// TODO: function to show tutorial overlay
// TODO: function to swap between zoom in and zoom out, use ZoomOut
// TODO: function to change language

export default function AccessibilityBar() {
    return (
        <header className="w-full p-4 z-50 bg-white shadow-sm flex-shrink-0">
            <div className="max-w-md mx-auto w-full">
                <div className="grid grid-cols-3 gap-3 w-full">
                    <AccessibilityButton icon={CircleQuestionMark} title='Help' onClick={() => alert('Help!')} />
                    <AccessibilityButton icon={ZoomIn} title='Zoom' onClick={() => alert('Zoom In!')} />
                    <AccessibilityButton icon={Languages} title='Language' onClick={() => alert('Change Language!')} />
                </div>
            </div>
        </header>
    );
}
