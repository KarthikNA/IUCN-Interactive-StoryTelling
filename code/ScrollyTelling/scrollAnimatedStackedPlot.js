let rendered = false;
function handleStepEnterAnimatedStackedPlot(response, callback) {
    if(!rendered) {
        rendered = callback();
    }
    response.element.classList.add('is-active');
}
function handleStepExitAnimatedStackedPlot(response) {
    response.element.classList.remove('is-active');
}
function handleStepProgressAnimatedStackedPlot(response) {
}


export { handleStepEnterAnimatedStackedPlot, handleStepExitAnimatedStackedPlot, handleStepProgressAnimatedStackedPlot };