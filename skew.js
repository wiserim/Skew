/*!
* Skew v0.3
* Copyright 2018 Marcin Walczak
*This file is part of Skew which is released under MIT license.
*See LICENSE for full license details.
*/
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
                        breakpoints: []
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

function Skew(elements, settings) {

    if(typeof elements == 'string')
        this.targets = document.querySelectorAll(elements);
    else if(elements.nodeType)
        this.targets = [elements];
    else
        this.targets = elements;

    settings = this.parseSettings(settings);
    this.x = settings.x;
    this.y = settings.y;
    this.breakpoints = settings.breakpoints;

    this.skew();
    var self = this;
    this.resizeEvent = function(){self.skew();}

    window.addEventListener('resize', this.resizeEvent);

    return this;
};

Skew.prototype = {
    skew: function() {
        var self = this;
        
        for(var i=0; i < self.targets.length; i++){
            var target = self.targets[i];    
            var width = target.offsetWidth;
            var height = target.offsetHeight;
            var skewX = self.x;
            var skewY = self.y;
            
            if(self.breakpoints !== undefined)
            {
                var winWidth = window.innerWidth;

                self.breakpoints.forEach(function(breakpoint){
                    if(breakpoint.break >= winWidth) {
                        skewX = breakpoint.x;
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
        settings = this.parseSettings(settings);
        this.x = (settings.x !== undefined ? settings.x : 0);
        this.y = (settings.y !== undefined ? settings.y : 0);
        this.breakpoints = (settings.breakpoints !== undefined ? settings.breakpoints : 0);
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

    parseSettings: function(settings) {
        var results = {x: 0, y: 0, breakpoints: []};
        if(settings !== undefined) {
            results.x = (settings.x !== undefined ? settings.x : 0);
            results.y = (settings.y !== undefined ? settings.y : 0);
            results.breakpoints = [];
            if(Array.isArray(settings.breakpoints))
                settings.breakpoints.forEach(function(breakpoint) {
                    results.breakpoints.push({
                        break: (breakpoint.break !== undefined ? breakpoint.break : 0),
                        x: (breakpoint.x !== undefined ? breakpoint.x : 0),
                        y: (breakpoint.y !== undefined ? breakpoint.y : 0)
                    });
                });
        }

        return results;
    }
};
