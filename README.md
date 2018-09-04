<p align="center">
  <img src="/assets/logo.png" alt="Skew">
</p>


**Skew** is a dependency free JavaScript library for performing skew transformations of DOM elements measured in pixels. It allows to keep element's skew by the same amount of pixels and unskew its content.

[![GitHub release](https://img.shields.io/github/release/wiserim/Skew.svg)](https://github.com/wiserim/Skew/releases) [![npm](https://img.shields.io/npm/v/skewjs.svg)](https://www.npmjs.com/package/skewjs)    [![GitHub](https://img.shields.io/github/license/wiserim/Skew.svg)](https://github.com/wiserim/Skew/blob/master/LICENSE)   [![Github file size](https://img.shields.io/github/size/wiserim/Skew/skew.min.js.svg)](https://github.com/wiserim/Skew)


**Features:**
* calculation of skew transformation measured in pixels,
* unskew element's content, 
* skew update on window resize,
* dependency free,
* can be used standalone with plain JavaScript or as jQuery plugin,
* responsiveness - breakpoints definition,
* configurable debouncing,
* cross-browser - supports IE9+ and modern browsers,
* lightweight - ~5kB minified.

***NPM***
```
npm install skewjs
```

***CDN***

[https://www.jsdelivr.com/package/npm/skewjs](https://www.jsdelivr.com/package/npm/skewjs)

## Getting started
Before closing ```<body>``` tag add:
  ```html
  <script type="text/javascript" src="skew.min.js"></script>
  <!--CDN-->
  <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/skewjs@0.6.0/skew.min.js"></script>
  ```
  
  Then add script:
  ```javascript
  window.onload = function() {
    var Skew = new Skew('selector', {x: 50});
  }
  ```
  or use jQuery:
  ```javascript
  $(function() {
    $('selector').skew({x: 50});
  });
  ```
  
## Syntax

JavaScript:
```javascript
var skewObj = new Skew('selector', {option: value});
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
  unskewContent | bool/string | false | Element's content unskew option / css selector of element's content to unskew ([see example](#unskew-option-example))
  breakpoints | array | [] | Array of objects containing breakpoints and setting objects ([see example](#breakpoints-option-example)).
  debounce | boolean | true | Debounce on resize event.
  debounceTime | int | 50 | Debounce time tollerance in ms.
  beforeSkew | array/function | [] | function/array of functions fired before skew ([see events](#events)).
  afterSkew | array/function | [] | function/array of functions fired after skew ([see events](#events)).
  beforeElementSkew | array/function | [] | function/array of functions fired before single element's skew ([see events](#events)).
  afterElementSkew | array/function | [] | function/array of functions fired after single element's skew ([see events](#events)).
  
  ### Unskew option example
  
  ```javascript
  //Unskew element's content
  var skewObj = new Skew(
    '.skew',
    {
      x: 30,
      unskewContent: true
    }
  );
  
  //Unskew element's content matching css selector
  var skewObj = new Skew(
    '.skew',
    {
      x: 30,
      unskewContent: '.skew-content'
    }
  );
  
  //Don't unskew element's content (default)
  var skewObj = new Skew(
    '.skew',
    {
      x: 30,
      unskewContent: false
    }
  );
  
  ```
  
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
          y: 30,
          unskewContent: true,
          debounce: false,
          debounceTime: 30
        },
        {
          break: 768,
          x: 30,
          unskewContent: '.skew-content'
        },
        {
          break: 480,
          y: 60
        }
      ]
    }
  );
  ```

  ## Methods

  Method | Arguments | Description
  ------------ | ------------- | ------------
  skew | | Recalculates skew
  update | options : object | Update Skew options
  destroy | | Destroys Skew
  beforeSkew | listener : function | Add listener to beforeSkew event ([see events](#events))
  afterSkew | listener : function | Add listener to afterSkew event ([see events](#events))
  beforeElementSkew | listener : function | Add listener to beforeElementSkew event ([see events](#events))
  afterElementSkew | listener : function | Add listener to afterElementSkew event ([see events](#events))
  
  ## Events
  
  Events has been added with version 0.7.
  
  Event | Params | Description
  ------------ | ------------- | ------------
  beforeSkew | skewObj, targets | Before start of skewing elements.
  afterSkew | skewObj, targets | After skewing all elements.
  beforeElementSkew | skewObj, target | Before skew of every element.
  afterElementSkew | skewObj, target | After skew of every element.
