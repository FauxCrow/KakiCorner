// For the clickable step numbers in the wizards.
// Returns the first step before `target` that still needs answering, or null if jumping there is fine.
// Going back is always fine, because every step before an earlier step was already passed.
export function getBlockingStep(target, isStepComplete) {
    for (let step = 1; step < target; step++) {
        if (!isStepComplete(step)) return step;
    }
    return null;
}
