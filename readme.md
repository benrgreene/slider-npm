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

## Options

* slider: selector of the slider container (required)
* hasDots: whether to add dots to the slider container (default: true)
* hasArrows: whether or not to add arrows to the slider container (default: true)
* variableHeight: whether the slider height adapts to the visible child (default: true)
* timer: amount of time on a slide before moving along. Not passing a time means there is no timer.
* dotColor: color of the dot representing the active slide