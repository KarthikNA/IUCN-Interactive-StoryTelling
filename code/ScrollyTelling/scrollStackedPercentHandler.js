let rendered = false;
function handleStepEnterStackedPercentPlot(response, callback) {
    if(!rendered) {
        rendered = callback();
    }
    response.element.classList.add('is-active');
}
function handleStepExitStackedPercentPlot(response) {
    response.element.classList.remove('is-active');
}
function handleStepProgressStackedPercentPlot(response) {
}


export { handleStepEnterStackedPercentPlot, handleStepExitStackedPercentPlot, handleStepProgressStackedPercentPlot };