function demo(container, control) {
    var container = document.querySelector(container);
    var control = document.querySelector(control);
    var controls = {
        skewX: control.querySelector('#skew-x'),
        skewY: control.querySelector('#skew-y'),
        unskewContent: control.querySelector('#unskew'),
        unskewContentSelector: control.querySelector('#unskew-selector'),
    };

    var unskewContent = function(){
        switch(controls.unskewContent.value) {
            case 'true':
                controls.unskewContentSelector.disabled = true;
                return true;
                break;
            case 'false':
                controls.unskewContentSelector.disabled = true;
                return false;
                break;
            case 'selector':
                var selector = controls.unskewContentSelector.value;
                controls.unskewContentSelector.disabled = false;
                try {
                    document.querySelector(selector);
                    return selector;
                }
                catch(error) {
                    return '';
                };
        }
    }

    var skew = new Skew(container, {
        x: controls.skewX.value,
        y: controls.skewY.value,
        unskewContent: unskewContent()
    });

    controls.skewX.addEventListener('input', function(e){skew.update({x: e.target.value})},false);
    controls.skewX.addEventListener('mouseup', function(e){skew.update({x: e.target.value})},false);
    controls.skewY.addEventListener('input', function(e){skew.update({y: e.target.value})},false);
    controls.skewY.addEventListener('click', function(e){skew.update({y: e.target.value})},false);
    controls.unskewContent.addEventListener('input', function(e){skew.update({unskewContent: unskewContent()})},false);
    controls.unskewContent.addEventListener('change', function(e){skew.update({unskewContent: unskewContent()})},false);
    controls.unskewContentSelector.addEventListener('input', function(e){skew.update({unskewContent: unskewContent()})},false);
}

window.addEventListener('load', function(){
    demo('#skew-element', '#skew-control');
    var sliders = document.querySelectorAll('.slider input[type="range"]');
    for(var i = 0, size = sliders.length; i<size;i++) {
        sliders[i].addEventListener('input', function(e){
            e.target.parentNode.setAttribute('data-value', e.target.value);
        });
        sliders[i].addEventListener('mouseup', function(e){
            e.target.parentNode.setAttribute('data-value', e.target.value);
        });
    };
});


