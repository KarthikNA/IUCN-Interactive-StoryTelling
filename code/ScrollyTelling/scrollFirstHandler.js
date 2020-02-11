/*
 * File: handleStepEnterFirst.js
 * Project: ScrollyTelling
 * File Created: November 2019
 * Author: Shalini Chaudhuri (you@you.you)
 */


let rendered = false;
function handleStepEnterFirst(response, callback) {
    if(!rendered) {
        rendered = callback();
    }
    response.element.classList.add('is-active');
}
function handleStepExitFirst(response) {
    response.element.classList.remove('is-active');
}
function handleStepProgressFirst(response) {
}


export { handleStepEnterFirst, handleStepExitFirst, handleStepProgressFirst };