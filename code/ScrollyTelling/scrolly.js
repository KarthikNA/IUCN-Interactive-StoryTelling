/*
 * File: scrolly.js
 * Project: ScrollyTelling
 * File Created: November 2019
 * Author: Shalini Chaudhuri (you@you.you)
 */

import {handleStepEnterFirst, handleStepExitFirst, handleStepProgressFirst} from './scrollFirstHandler';
import {handleStepProgressSecond, handleStepExitSecond, handleStepEnterSecond} from './scrollSecondHandler';
import {handleStepProgressThird, handleStepEnterThird, handleStepExitThird} from './scrollThirdHandler';
import {handleStepEnterStackedPlot, handleStepProgressStackedPlot, handleStepExitStackedPlot} from './scrollStackedPlotHandler';
import {handleStepEnterStackedPercentPlot, handleStepExitStackedPercentPlot, handleStepProgressStackedPercentPlot} from './scrollStackedPercentHandler';
import {handleStepEnterAnimatedStackedPlot, handleStepExitAnimatedStackedPlot, handleStepProgressAnimatedStackedPlot} from "./scrollAnimatedStackedPlot";
import {handleStepEnterForestPlot, handleStepExitForestPlot, handleStepProgressForestPlot} from "./scrollForestCover";
import {disintegrateElement} from './disintegrateAnimal';



import * as chartOverview from './Chart1Overview/chart1';
import * as forestPlt from './forestcoverplot/forestcover'
import * as animatedStackedPlt from './stacked plot/animatedStackedPlot'
import './industrializationplot/industrializationplot';
import './Chart2Map/main';
import './overview-bubble-flags/script-copy'
import './Chartbubble/extinctBubbleChart';

let ScrollerFirst, ScrollerSecond, ScrollerThird, ScrollerStackedPlot, ScrollerForestPlot, ScrollerAnimatedStackedPlot; // global for now

disintegrate.init();
$(document).ready(() => {
    // when the doc body is set up
    setUpBody();
    // set up the scrollama instance
    setUpScrollerFirst();
    setUpScrollerSecond();
    setUpScrollerThird();
    setUpScrollerAnimatedStackedPlot();
    setupScrollForestPlot();

    setUpCarousel();

    // Set up responsive resizing
    $(document).on('resize', (event) => {
        Scroller.resize;
    });

});

/**
 * Prototype function to check scrolly
 */
function setUpBody() {
    let container = document.querySelector('#narrative');
    let texts = container.querySelector('.scroll__text');
    let steps = texts.querySelectorAll('.step');

    // steps.forEach(function (step) {
    //     var v = 100 + Math.floor(Math.random() * window.innerHeight / 4);
    //     step.style.padding = v + 'px 0px';
    // });


    
    let el = document.querySelector('.animalimage');
    disintegrateElement('.prob_introduction');
    setTimeout(() => {$('.prob_introduction').toggleClass('active')}, 500);
    setTimeout(() => {$(el).remove();}, 3000);
}

/**
 * Set up scrollama instance with the callbacks and params
 */
function setUpScrollerFirst() {
    ScrollerFirst = scrollama();
    // define the params for scrollama instance
    ScrollerFirst.setup({
        container: '#narrative',
        step: '#scroll_first .step',
        offset: '0.5',
    })
        .onStepEnter(response => {
            handleStepEnterFirst(response, chartOverview.drawLinePlotForOverview);
        })
        .onStepExit(response => {
            handleStepExitFirst(response);
        })
        .onStepProgress(response => {
            handleStepProgressFirst(response);
        });
}


function setUpScrollerSecond() {
    ScrollerSecond = scrollama();
    // define the params for scrollama instance
    ScrollerSecond.setup({
        container: '#narrative',
        step: '#scroll_second .step',
        offset: '0.5',
    })
        .onStepEnter(response => {
            handleStepEnterSecond(response);
        })
        .onStepExit(response => {
            handleStepExitSecond(response);
        })
        .onStepProgress(response => {
            handleStepProgressSecond(response);
        });
}


function setUpScrollerThird() {
    ScrollerThird = scrollama();
    // define the params for scrollama instance
    ScrollerThird.setup({
        container: '#narrative',
        step: '#scroll_third .step',
        offset: '0.5',
    })
        .onStepEnter(response => {
            handleStepEnterThird(response);
        })
        .onStepExit(response => {
            handleStepExitThird(response);
        })
        .onStepProgress(response => {
            handleStepProgressThird(response);
        });
}

function setUpScrollerStackedPlot() {
    ScrollerStackedPlot = scrollama();
    // define the params for scrollama instance
    ScrollerStackedPlot.setup({
        container: '#narrative',
        step: '#scroll_stacked_plot .step',
        offset: '0.5',
    })
        .onStepEnter(response => {
            // handleStepEnterStackedPlot(response, stackedPlt.drawStackedPlot);
        })
        .onStepExit(response => {
            handleStepExitStackedPlot(response);
        })
        .onStepProgress(response => {
            handleStepProgressStackedPlot(response);
        });
}

function setUpScrollerStackedPercentPlot() {
    ScrollerStackedPlot = scrollama();
    // define the params for scrollama instance
    ScrollerStackedPlot.setup({
        container: '#narrative',
        step: '#scroll_stacked_percent .step',
        offset: '0.5',
    })
        .onStepEnter(response => {
            // handleStepEnterStackedPercentPlot(response, stackedPerPlt.drawStackedPlot);
        })
        .onStepExit(response => {
            handleStepExitStackedPercentPlot(response);
        })
        .onStepProgress(response => {
            handleStepProgressStackedPercentPlot(response);
        });
}

function setupScrollForestPlot () {
    ScrollerForestPlot = scrollama();
    // define the params for scrollama instance
    ScrollerForestPlot.setup({
        container: '#narrative',
        step: '#forest_cover .step',
        offset: '0.5',
    })
        .onStepEnter(response => {
            handleStepEnterForestPlot(response, forestPlt.buildGraph);
        })
        .onStepExit(response => {
            handleStepExitForestPlot(response);
        })
        .onStepProgress(response => {
            handleStepProgressForestPlot(response);
        });
}

function setUpScrollerAnimatedStackedPlot () {
    ScrollerAnimatedStackedPlot = scrollama();
    // define the params for scrollama instance
    ScrollerAnimatedStackedPlot.setup({
        container: '#narrative',
        step: '#animatedstackedplot .step',
        offset: '0.5',
    })
        .onStepEnter(response => {
            handleStepEnterAnimatedStackedPlot(response, animatedStackedPlt.update);
        })
        .onStepExit(response => {
            handleStepExitAnimatedStackedPlot(response);
        })
        .onStepProgress(response => {
            handleStepProgressAnimatedStackedPlot(response);
        });
}




function setUpCarousel() {
    $('.carousel').carousel({
        interval: 5000,
        pause: 'hover'
      })
}