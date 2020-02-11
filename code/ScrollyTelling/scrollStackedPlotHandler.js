let rendered = false;
function handleStepEnterStackedPlot(response, callback) {
    if(!rendered) {
        rendered = callback();
    }
    response.element.classList.add('is-active');
}
function handleStepExitStackedPlot(response) {
    response.element.classList.remove('is-active');
}
function handleStepProgressStackedPlot(response) {
}


export { handleStepEnterStackedPlot, handleStepExitStackedPlot, handleStepProgressStackedPlot };