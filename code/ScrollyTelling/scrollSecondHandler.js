function handleStepEnterSecond(response) {
    response.element.classList.add('is-active');
}
function handleStepExitSecond(response) {
    response.element.classList.remove('is-active');
}
function handleStepProgressSecond(response) {
}


export {handleStepProgressSecond, handleStepExitSecond, handleStepEnterSecond};