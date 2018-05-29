# Skew

**Skew** is a standalone JavaScript library for performing skew transformations DOM elements measured in pixels. It calculates skew based on size of element.

**Features:**
* calculation of skew transformation measured in pixels,
* skew update on resize,
* can be used standalone and with jQuery,
* responsiveness - breakpoints definition,
* debouncing (optional),
* cross-browser - supports IE9+ and modern browsers,
* lightweight - < 3kB minified.

## Getting started
Before closing <body> tag add:
  ```html
  <script type="text/javascript" src="skew.min.js"></script>
  ```
  
  Then add script:
  ```javascript
  window.onload = function() {
    var Skew = new Skew('css selector', {x: 50});
  }
  ```
  or use jQuery:
  ```javascript
  $(function() {
    $('selector').skew({x: 50});
  });
  ```
  **Important: To calculate skew transformation correctly, Skew needs to be execute after document is loaded, by creating Skew object, or firing Skew.skew() function.**
  
## Syntax

JavaScript:
```javascript
var skewObj = new Skew('css selector', {option: value});
//example
var skewObj = new Skew('.skew', {x: 50, y: 100, breakpoints: [{break: 768, x: 30}]});

skewObject.method(argument);
//example
skewObj.update({x: 30, breakpoints: [{break: 768, x: 15}]});
```
jQuery:
```javascript
$('selector').skew({option: value});
//example
$('.skew').skew({x: 50, y: 100, breakpoints: [{break: 768, x: 30}]});

$('selector').skew('method', argument);
//example
$('.skew').skew('update', {x: 30, breakpoints: [{break: 768, x: 15}]});
```
  
  ## Options
  
  Option | Type | Default | Description
  ------------ | ------------- | ------------ | -------------
  x | int | 0 | Element's skew on x axis in pixels.
  y | int | 0 | Element's skew on y axis in pixels.
  breakpoints | array | [] | Array of objects containing breakpoints and setting objects ([see example](#breakpoints-option-example)).
  debounce | boolean | false | Debounce on resize event.
  debounceTime | int | 50 | Debounce time tollerance in ms.
  
  ### Breakpoints option example
  
  ```javascript
  var skewObj = new Skew(
    '.skew',
    {
      x: 30,
      y: 60,
      breakpoints: [
        {
          break: 1024
          x: 60,
          y: 30
        },
        {
          break: 768,
          x: 30
        },
        {
          break: 480,
          y: 60
        }
      ]
    }
  );
  ```
