import React, { createContext, useContext, useState } from 'react';
import tutorialData from '../content/tutorial.json';

const GuideContext = createContext();

export const GuideProvider = ({ children }) => {
    const [activeTutorial, setActiveTutorial] = useState(null);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    const currentStep = activeTutorial ? activeTutorial.steps[currentStepIndex] : null;

    const getStartingStepIndex = (steps) => {
        const hashPath = window.location.hash.replace(/^#/, '').split('?')[0];

        const matchingIndex = steps.findIndex((step) => {
            if (!step.path) return false;

            const paths = Array.isArray(step.path) ? step.path : [step.path];

            return paths.some((targetPath) => {
                if (hashPath === targetPath || hashPath.startsWith(targetPath + '/')) {
                    return true;
                }
                return false;
            });
        });

        return matchingIndex !== -1 ? matchingIndex : 0;
    };

    const startGuide = (tutorialId) => {
        const selectedTutorial = tutorialData.tutorial.find((item) => item.id === tutorialId);

        if (selectedTutorial) {
            setActiveTutorial(selectedTutorial);
            const initialStepIndex = getStartingStepIndex(selectedTutorial.steps);
            setCurrentStepIndex(initialStepIndex);
        }
    };

    const handleElementClick = (targetId) => {
        if (!currentStep) return;

        if (currentStep.targetId === targetId) {
            if (currentStepIndex + 1 < activeTutorial.steps.length) {
                setCurrentStepIndex((prev) => prev + 1);
            } else {
                cancelGuide();
            }
        }
    };

    const cancelGuide = () => {
        setActiveTutorial(null);
        setCurrentStepIndex(0);
    };

    return (
        <GuideContext.Provider
            value={{
                tutorials: tutorialData.tutorial,
                activeTutorial,
                currentStep,
                startGuide,
                handleElementClick,
                cancelGuide,
            }}
        >
            {children}
        </GuideContext.Provider>
    );
};

export const useGuide = () => useContext(GuideContext);