/*
 * File: scrollThirdHandler.js
 * Project: ScrollyTelling
 * File Created: November 2019
 * Author: Shalini Chaudhuri (you@you.you)
 */
function handleStepEnterThird(response) {
    response.element.classList.add('is-active');
}
function handleStepExitThird(response) {
    response.element.classList.remove('is-active');
}
function handleStepProgressThird(response) {
}

export {handleStepProgressThird, handleStepEnterThird, handleStepExitThird};