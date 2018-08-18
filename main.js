let mod = {
  sliders: [],
  includedStyles: false,
  /**
   * Instantiate new slider 
   */
  newSlider: function (options) {
    // Make sure the slider styles are included
    if (!this.includedStyles) {
      this.setupSliderGlobals();
      this.includedStyles = true;
    }

    // setup the newslider object
    let sliderOptions = this.setDefaults(options);
    let sliderObject  = this.newSliderObject(sliderOptions);
    this.sliders.push(sliderObject);
    
    // Get the slider elements
    sliderObject.sliderContainer = document.querySelector(sliderOptions.slider);
    sliderObject.slides = document.querySelectorAll(`${sliderOptions.slider} .slide`);
    // Add the slider class for styling 
    sliderObject.sliderContainer.classList.add('slider');
    // set slider position
    this.moveSlide(sliderObject, 0);

    // Set the variable height of the slider
    if (sliderOptions.variableHeight) {
      this.setSliderHeight(sliderObject); 
    }
    // Setup the slider arrows
    if (sliderOptions.hasArrows) {
      this.setUpArrows(sliderObject);
    }
    // Setup slider timer
    if (sliderOptions.timer) {
      this.setUpTimer(sliderObject);
    }
  },
  // Create a new blank/default slider object
  newSliderObject: function (sliderOptions) {
    return {
      'options': sliderOptions,
      'currentSlide': 0,
      'dots': [],
      'sliderTimer': null,
      'slides': null,
      'sliderContainer': null
    }
  },
  // Make sure defaults are set for the slider
  setDefaults: function (options) {
    options.variableHeight = (undefined != options.variableHeight) ? options.variableHeight : true;
    options.hasDots = (undefined != options.hasDots) ? options.hasDots : true;
    options.hasArrows = (undefined != options.hasArrows) ? options.hasArrows : true;
    options.timer = (undefined != options.timer) ? options.timer : false;
    options.dotColor = (undefined != options.dotColor) ? options.dotColor : '#18F';
    return options;
  },
  // Setup the slider arrows
  setUpArrows: function (slider) {
    let self = this;
    let leftArrow = document.createElement('div');
    leftArrow.innerHTML = '&#10145;';
    leftArrow.classList.add('arrow-left');
    leftArrow.addEventListener('click', (event) => {
      self.moveSlide(slider, -1);
      self.resetSlideTimer(slider);
    });
   
    let rightArrow = document.createElement('div');
    rightArrow.innerHTML = '&#10145;';
    rightArrow.classList.add('arrow-right');
    rightArrow.addEventListener('click', (event) => {
      self.moveSlide(slider, 1);
      self.resetSlideTimer(slider);
    });
    
    slider.sliderContainer.appendChild(leftArrow);
    slider.sliderContainer.appendChild(rightArrow);
  },
  /*
   * Move to a new slide
   */
  moveSlide: function (slider, direction) {
    slider.currentSlide += direction;
    // Wrap to the other side of the slider is we're past slider bounds
    if (0 > slider.currentSlide) {
      slider.currentSlide = slider.slides.length - 1;
    } else if (slider.currentSlide >= slider.slides.length) {
      slider.currentSlide = 0;  
    }
    // Set positioning of all slides
    slider.slides.forEach((slide, index) => {
      let position = ((index - slider.currentSlide) * 100) + 'vw';
      slide.style.left = position;
    });

    // Reset slider height (if applicable)
    if (slider.options.variableHeight) {
      this.setSliderHeight(slider);
    }
  },
  // set the height of the slider to the height of the child
  setSliderHeight: function (sliderObject) {
    let newHeight = sliderObject.slides[sliderObject.currentSlide].offsetHeight;
    sliderObject.sliderContainer.style.height = newHeight + 'px';
  },
  // slider timer for moving the slide along
  setUpTimer: function (slider) {
    let self = this;
    slider.sliderTimer = setInterval(() => {
      self.moveSlide(slider, 1);
    }, slider.options.timer);
  },
  // reset the slider timer
  resetSlideTimer: function(slider) {
    // reset the slider timer
    if (slider.sliderTimer) {
      clearInterval(slider.sliderTimer);
      slider.sliderTimer = null; 
      setUpTimer(slider);
    }
  },
  // Setup for sliders in general. 
  setupSliderGlobals: function () {
    // Add all the styling for the microlibrary
    let styleElement = document.createElement('style');
    styleElement.innerHTML = ".arrow-left,.arrow-right,.dot-container{padding:10px 15px;background-color:rgba(100,100,100,.8);z-index:10}.slider{position:relative;width:100%;overflow:hidden;transition:height .75s}.slide{position:absolute;display:block;width:100%;transition:left .75s}.arrow-left,.arrow-right{position:absolute;top:50%;color:#FFF;cursor:pointer}.arrow-left{left:0;transform:translateY(-50%) scale(-1,1)}.arrow-right{right:0;transform:translateY(-50%)}.dot-container{position:absolute;bottom:0;left:50%;transform:translateX(-50%);line-height:15px}.dot{position:relative;display:inline-block;border-radius:50%;height:15px;width:15px;background-color:#FFF;cursor:pointer}.dot+.dot{margin-left:15px}";
    document.body.appendChild(styleElement);
    // on resize, we want to reset the slider height for each slider
    let self = this;
    window.addEventListener('resize', (event) => {
      self.sliders.forEach((slider, i) => {
        if (slider.options.variableHeight) {
          self.setSliderHeight(slider);
        }
      });
    });
  }
}