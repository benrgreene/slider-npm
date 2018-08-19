module.exports = {
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

    // Setup the slider arrows
    if (sliderOptions.hasArrows) {
      this.setUpArrows(sliderObject);
    }
    // Setup slider timer
    if (sliderOptions.timer) {
      this.setUpTimer(sliderObject);
    }
    // Setup slider navigation dots
    if (sliderOptions.hasDots) {
      this.setUpDots(sliderObject);
    }

    // On the first image load, resize the slider
    let firstImage = document.querySelectorAll(`${sliderOptions.slider} img`)[0];
    let self = this;
    firstImage.onload = (event) => {
      self.setSliderHeight(sliderObject);
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
  // Set up the slider dots (and listeners)
  setUpDots: function(slider) {
    let dotContainer = document.createElement('ul');
    dotContainer.classList.add('dot-container');
    
    // For all the instance's slides, add a dot to the slider's dot container
    let self = this;
    slider.slides.forEach((slide, i) => {
      let newDot = document.createElement('li');
      newDot.classList.add('dot');
      // If it's the first dot, add the 'active dot' class
      if (0 == i) {
        newDot.classList.add('dot--active');  
      }
      // Add a listener to the dot to move the slider to the coresponding dot
      newDot.addEventListener('click', function(event) {
        slider.currentSlide = i;
        self.moveSlide(slider, 0);
        self.resetSlideTimer(slider);
      });
      dotContainer.appendChild(newDot);
      slider.dots.push(newDot);
    });
    // Add the active dot styling
    let dotStyleElement = document.createElement('style');
    dotStyleElement.innerHTML = `${slider.options.slider} .dot--active { background-color: ${slider.options.dotColor}; }`;
    dotContainer.appendChild(dotStyleElement);
    // Add dots to the slider container
    slider.sliderContainer.appendChild(dotContainer);
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

    // Reset dot classes (if dots are enabled)
    if (slider.options.hasDots) {
      slider.dots.forEach((dot, index) => {
        if (index == slider.currentSlide) {
          // new active slide
          dot.classList.add('dot--active');
        } else {
          // inactive slide
          dot.classList.remove('dot--active');
        }
      });
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
      this.setUpTimer(slider);
    }
  },
  // Setup for sliders in general. 
  setupSliderGlobals: function () {
    // Add all the styling for the microlibrary
    let styleElement = document.createElement('style');
    styleElement.innerHTML = ".arrow-left,.arrow-right,.dot-container{margin: 0;padding:10px 15px;background-color:rgba(100,100,100,.8);z-index:10}.slider{position:relative;width:100%;overflow:hidden;transition:height .75s}.slide{position:absolute;display:block;width:100%;transition:left .75s}.arrow-left,.arrow-right{position:absolute;top:50%;color:#FFF;cursor:pointer}.arrow-left{left:0;transform:translateY(-50%) scale(-1,1)}.arrow-right{right:0;transform:translateY(-50%)}.dot-container{position:absolute;bottom:0;left:50%;transform:translateX(-50%);line-height:15px}.dot{position:relative;display:inline-block;border-radius:50%;height:15px;width:15px;background-color:#FFF;cursor:pointer}.dot+.dot{margin-left:15px}";
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