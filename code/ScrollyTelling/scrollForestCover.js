let rendered = false;
function handleStepEnterForestPlot(response, callback) {
    if(!rendered) {
        rendered = callback();
    }
    response.element.classList.add('is-active');
}
function handleStepExitForestPlot(response) {
    response.element.classList.remove('is-active');
}
function handleStepProgressForestPlot(response) {
}


export { handleStepEnterForestPlot, handleStepExitForestPlot, handleStepProgressForestPlot };