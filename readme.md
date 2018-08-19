# Slider Micro Library

## Installing

```
npm install brg-slider
```

## Use

First, you'll need to require the slider:

```
const sliderLibrary = require('brg-slider')
```

Then to use, simple use the command:

```
sliderLibrary.newSlider({
  ... options ...
});
```

Slides can have whatever in them, images, HTML, anything. All direct children of the slider should have the class "slide". If your slider selector is `#my-slider`, then the HTML structure of the slider should be:

```
<div id="my-slider">
  <div class="slide"> ... </div>
  ...
  <div class="slide"> ... </div>
</div>
```  

## Options

* slider: selector of the slider container (required)
* hasDots: whether to add dots to the slider container (default: true)
* dotColor: color of the dot representing the active slide (optional)
* hasArrows: whether or not to add arrows to the slider container (default: true)
* variableHeight: whether the slider height adapts to the visible child. If this is set to false, then you'll need to set the height yourself. (default: true). 
* timer: amount of time on a slide before moving along. Not passing a time means there is no timer. (optional)
