To add a new scrolly-telling section, follow this structure:

Section is a new scroll-section. If you want a static chart to the side, add this and change the id and class names:
<div class="chart sticky">
    <div id="chart1">
        <svg width="680" height="600" style=" width:680; height:600">
        </svg>
    </div>
</div>


 <section id='scroll_third'>
 <!--- ADD STATIC CHART HERE-------->
      <div class='scroll__text'>

          <div class="step" id="story1" data-step="1">
            <!---- THESE WILL BE THE ONES THAT SCROLL WITHIN THE SECTION---->
          </div>
          <div class="step" id="story2" data-step="2">

          </div>
          <div class="step" id="story3" data-step="3">

          </div>
          <div class="step" id="story4" data-step="4">

          </div>

      </div>
  </section>




For the JS part, just change the event handlers, handleStepEnter, handleStepExit and so on. Ensure when you add new charts, there might be namespace conflicts. Please resolve it because most variable are in global namespace.
e.g, var svg / var chart are used across all files. Scrolly.js is the entry point. Just refer to the code flow in scrolly.js and how to import/export

