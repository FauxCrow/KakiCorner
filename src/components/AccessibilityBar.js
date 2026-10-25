import React from 'react';
import { CircleQuestionMark, ZoomIn, ZoomOut,Languages } from 'lucide-react';
import AccessibilityButton from './AccessibilityButton';
import { useFontSize } from '../hooks/FontSize';

// TODO: function to show tutorial overlay
// TODO: function to swap between zoom in and zoom out, use ZoomOut
// TODO: function to change language

export default function AccessibilityBar() {
    const { toggleSize, isLarge } = useFontSize();

    return (
        <header className="w-full p-4 z-50 bg-white shadow-sm flex-shrink-0">
            <div className="max-w-md mx-auto w-full">
                <div className="grid grid-cols-3 gap-3 w-full">
                    <AccessibilityButton icon={CircleQuestionMark} title='Help' iconSize={isLarge ? 28 : 24 } onClick={() => alert('Help!')} />
                    <AccessibilityButton icon={isLarge ? ZoomOut : ZoomIn} title={isLarge ? 'Zoom Out' : 'Zoom In'} iconSize={isLarge ? 28 : 24 } isLarge={isLarge} onClick={toggleSize} />
                    <AccessibilityButton icon={Languages} title='Language' iconSize={isLarge ? 28 : 24 } onClick={() => alert('Change Language!')} />
                </div>
            </div>
        </header>
    );
}
