/*!
* Skew v0.5
* Copyright 2018 Marcin Walczak
*This file is part of Skew which is released under MIT license.
*See LICENSE for full license details.
*/

//jQuery plugin
if(window.jQuery) {
    $.fn.skew = function(options) {
        var args = $.makeArray(arguments);
        
        return this.each(function () {
            var instance = $.data(this, 'skewjs');
            if(instance) {
                if(typeof options == 'string') {
                    if(instance[options]) {
                        instance[options].apply(instance, settings);

                        if(options == 'destroy'){
                            $.removeData(this, 'skewjs');
                        }
                    }
                    else {
                        $.error('Method '+options+' does not exist on Skew');
                    }
                }
                else {
                    var settings = $.extend({
                        x: 0,
                        y: 0,
                        breakpoints: [],
                    }, options);
                    instance.update(settings);
                }
            }
            else if(typeof options !== 'string'){
                var settings = $.extend({
                    x: 0,
                    y: 0,
                    breakpoints: []
                }, options );

                var skewjs = new Skew(this, settings);

                $.data(this, 'skewjs', skewjs);
                return skewjs;
            }
        });
    };
}

//constructor
function Skew(elements, settings) {
    //affected DOM elements
    if(typeof elements == 'string')
        this.targets = document.querySelectorAll(elements);
    else if(elements.nodeType)
        this.targets = [elements];
    else
        this.targets = elements;

    this.defaults = {
        x: 0,
        y: 0,
        breakpoints: [],
        debounce: true,
        debounceTime: 50
    };

    this.options = this.defaults;

    this.timeout;

    this.update(settings);

    this.skew();

    var self = this;


    //method fired on load/resize event, can be used to debounce custom events.
    this.eventMethod = function() {
        var debounce = self.options.debounce;
        var debounceTime = self.options.debounceTime;

        if(self.options.breakpoints !== undefined) {
            var winWidth = window.innerWidth;

            self.options.breakpoints.forEach(function(breakpoint){
                if(breakpoint.break >= winWidth) {
                    if(breakpoint.debounce !== undefined)
                        debounce = breakpoint.debounce;
                    if(breakpoint.debounceTime !== undefined)
                        debounceTime = breakpoint.debounceTime;
                }
            });
        }

        if(debounce) {
            var later = function() {
                self.timeout = null;
                self.skew();
            };
            clearTimeout(self.timeout);
            self.timeout = setTimeout(later, debounceTime);
        }
        else
            self.skew();
    }

    window.addEventListener('load', this.eventMethod);
    window.addEventListener('resize', this.eventMethod);

    return this;
};

Skew.prototype = {
    skew: function() {
        var self = this;
        
        for(var i=0; i < self.targets.length; i++){
            var target = self.targets[i];    
            var width = target.offsetWidth;
            var height = target.offsetHeight;
            var skewX = self.options.x;
            var skewY = self.options.y;
            
            if(self.options.breakpoints !== undefined) {
                var winWidth = window.innerWidth;

                self.options.breakpoints.forEach(function(breakpoint) {
                    if(breakpoint.break >= winWidth) {
                        if(breakpoint.x !== undefined)
                            skewX = breakpoint.x;
                        if(breakpoint.y !== undefined)
                            skewY = breakpoint.y;
                    }
                });
            }

            skewXAngle = Math.atan(skewX/height);
            skewYAngle = Math.atan(skewY/width);
            var skewStyle = 'skew('+skewXAngle+'rad, '+skewYAngle+'rad)';
            var style = target.getAttribute('style');

            if(style === null) {
                style = 'transform: '+skewStyle+';';
                target.setAttribute('style', style);
                continue;
            }

            var transformIndex = style.indexOf('transform:');
            if(transformIndex < 0) {
                style += 'transform: '+skewStyle+';';
                target.setAttribute('style', style);
                continue;
            }

            var transformEndIndex = transformIndex+style.substring(transformIndex).indexOf(';');
            if(transformEndIndex < transformIndex) {
                transformEndIndex = style.length;
                skewStyle += ';'
            }

            var skewIndex = style.indexOf('skew');
            var pre = style.substring(0, transformEndIndex);
            var post = style.substring(transformEndIndex);

            if(skewIndex < 0){

                style = pre+' '+skewStyle+post;
                target.setAttribute('style', style);
                continue;
            }
            
            transformIndex = style.indexOf('skew');
            transformEndIndex = transformIndex+style.substring(transformIndex).indexOf(')')+1;
            pre = style.substring(0, transformIndex);
            post = style.substring(transformEndIndex);

            style = pre+skewStyle+post;
            target.setAttribute('style', style);
        }

        return this;
    },

    update: function(settings) {
        this.options = this.parseSettings(settings, this.options);
        this.skew();

        return this;
    },

    destroy: function(){
        var self = this;
        window.removeEventListener('resize', this.resizeEvent);
        
        for(var i=0; i < self.targets.length; i++){
            var target = self.targets[i];
            var style = target.getAttribute('style');
            var skewIndex = style.indexOf('skew');
            var skewEndIndex = skewIndex+style.substring(skewIndex).indexOf(')')+1;

            if(skewIndex > -1) {
                var pre = style.substring(0, skewIndex);
                var post = style.substring(skewEndIndex);
                target.setAttribute('style', pre+post);
            }
        }
    },

    parseSettings: function(settings, defaults) {
        var results = (defaults !== undefined ? defaults : this.defaults);
        
        if(settings !== undefined) {
            if(settings.x !== undefined)
                results.x = settings.x;

            if(settings.y !== undefined)
                results.y = settings.y;

            if(Array.isArray(settings.breakpoints)) {
                results.breakpoints = [];
                
                settings.breakpoints.forEach(function(breakpoint) {
                    var breakObj = {
                        break: (breakpoint.break !== undefined ? breakpoint.break : 0)
                    };

                    if(breakpoint.x !== undefined)
                        breakObj.x = breakpoint.x;

                    if(breakpoint.y !== undefined)
                        breakObj.y = breakpoint.y;

                    if(breakpoint.debounce !== undefined)
                        breakObj.debounce = breakpoint.debounce;

                    if(breakpoint.debounceTime !== undefined)
                        breakObj.debounce = breakpoint.debounceTime;

                    results.breakpoints.push(breakObj);
                });
            }

            if(settings.debounce !== undefined)
                results.debounce = settings.debounce; 

            if(settings.debounceTime !== undefined)
                results.debounceTime = settings.debounceTime;
        }
        return results;
    }
};
