/*!
* Skew v0.7
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
        unskewContent: false,
        breakpoints: [],
        debounce: true,
        debounceTime: 50,
        beforeSkewListeners: [],
        afterSkewListeners: [],
        beforeElementSkewListeners: [],
        afterElementSkewListeners: []
    };

    this.options = this.defaults;

    this.currentUnskewContent = this.options.unskewContent;

    this.timeout;

    this.update(settings);

    var self = this;

    //events
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
        var self = this,
        target = null,
        width = 0,
        height = 0,
        skewX = self.options.x,
        skewY = self.options.y,
        skewXAngle = 0,
        skewYAngle = 0;
        content = [],
        unskewContent = self.options.unskewContent,
        contentSkewStyle = '';

        if(self.options.breakpoints !== undefined) {
            var winWidth = window.innerWidth;

            self.options.breakpoints.forEach(function(breakpoint) {
                if(breakpoint.break < winWidth)
                    return;

                if(breakpoint.x !== undefined)
                    skewX = breakpoint.x;
                if(breakpoint.y !== undefined)
                    skewY = breakpoint.y;
                
                if(breakpoint.unskewContent !== undefined)
                    unskewContent = breakpoint.unskewContent;
            });

            if(self.currentUnskewContent !== unskewContent) {

                //removing previous content unskew
                for(var i=0; i < self.targets.length; i++){
                    target = self.targets[i];

                    if(self.currentUnskewContent === true)
                        content = target.childNodes;
                    else if(typeof self.currentUnskewContent == 'string')
                        content = target.querySelectorAll(self.currentUnskewContent);

                    for(var j=0; j < content.length; j++){
                        self.setSkewStyle(content[j], '');
                    };
                }
                content = [];

                self.currentUnskewContent = unskewContent;
            }
        }

        for(var i = 0; i < this.options.beforeSkewListeners.length; i++) {
            this.options.beforeSkewListeners[i](self, self.targets);
        }
        
        for(var i=0; i < self.targets.length; i++){
            target = self.targets[i];
            
            for(var j= 0; j < this.options.beforeElementSkewListeners.length; j++) {
                this.options.beforeElementSkewListeners[j](self, target);
            }
            

            width = target.offsetWidth;
            height = target.offsetHeight;

            skewXAngle = Math.atan(skewX/height);
            skewYAngle = Math.atan(skewY/width);
            skewStyle = 'skew('+skewXAngle+'rad, '+skewYAngle+'rad)';
            self.setSkewStyle(target, skewStyle);

            if(unskewContent === true)
                content = target.childNodes;
            else if(typeof unskewContent == 'string')
                content = target.querySelectorAll(unskewContent);

            contentSkewStyle = 'skew('+(-skewXAngle)+'rad, '+(-skewYAngle)+'rad)';
            for(var j=0; j < content.length; j++){
                self.setSkewStyle(content[j], contentSkewStyle);
            };
            
            for(var j = 0; j < this.options.afterElementSkewListeners.length; j++) {
                this.options.afterElementSkewListeners[j](self, target);
            }
        }

        for(var i = 0; i < this.options.afterSkewListeners.length; i++) {
            this.options.afterSkewListeners[i](self, self.targets);
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
        var addEventListener = function(eventArray, listeners) {
            if(listeners !== undefined)
                if(Array.isArray(listeners))
                    listeners.forEach(function(listener) {
                        eventArray.push(listener);
                    });
                else
                    eventArray.push(listeners);
        }
        
        if(settings !== undefined) {
            if(settings.x !== undefined)
                results.x = settings.x;

            if(settings.y !== undefined)
                results.y = settings.y;

            if(settings.unskewContent !== undefined)
                results.unskewContent = settings.unskewContent;

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

                    if(breakpoint.unskewContent !== undefined)
                        breakObj.unskewContent = breakpoint.unskewContent;

                    if(breakpoint.debounce !== undefined)
                        breakObj.debounce = breakpoint.debounce;

                    if(breakpoint.debounceTime !== undefined)
                        breakObj.debounce = breakpoint.debounceTime;

                    results.breakpoints.push(breakObj);
                });

                results.breakpoints.sort(function(a, b) {
                    if(a.break < b.break)
                        return 1;
                    if(a.break > b.break)
                        return -1;
                    return 0;
                });
            }

            if(settings.debounce !== undefined)
                results.debounce = settings.debounce; 

            if(settings.debounceTime !== undefined)
                results.debounceTime = settings.debounceTime;

            results.beforeSkewListeners= defaults.beforeSkewListeners;
            addEventListener(results.beforeSkewListeners, settings.beforeSkew);

            results.afterSkewListeners = defaults.afterSkewListeners;
            addEventListener(results.afterSkewListeners, settings.afterSkew);

            results.beforeElementSkewListeners = defaults.beforeElementSkewListeners;
            addEventListener(results.beforeElementSkewListeners, settings.beforeElementSkew);

            results.afterElementSkewListeners = defaults.afterElementSkewListeners;
            addEventListener(results.afterElementSkewListeners, settings.afterElementSkew);
        }
        return results;
    },

    setSkewStyle: function(element, skewStyle) {
        var style = element.getAttribute('style');

        if(style === null) {
            style = 'transform: '+skewStyle+';';
            element.setAttribute('style', style);
            return;
        }

        var transformIndex = style.indexOf('transform:');
        if(transformIndex < 0) {
            style += 'transform: '+skewStyle+';';
            element.setAttribute('style', style);
            return;
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
            element.setAttribute('style', style);
            return;
        }
        
        transformIndex = style.indexOf('skew');
        transformEndIndex = transformIndex+style.substring(transformIndex).indexOf(')')+1;
        pre = style.substring(0, transformIndex);
        post = style.substring(transformEndIndex);

        style = pre+skewStyle+post;
        element.setAttribute('style', style);
    },

    beforeSkew: function(listener) {
       this.options.beforeSkewListeners.push(listener);
       return this;
    },

    afterSkew: function(listener) {
        this.options.afterSkewListeners.push(listener);
        return this;
    },

    beforeElementSkew: function(listener) {
       this.options.beforeElementSkewListeners.push(listener);
       return this;
    },

    afterElementSkew: function(listener) {
        this.options.afterElementSkewListeners.push(listener);
        return this;
    }
};
