// Runs through the page and if your browser doesn't support the placeholder attr for inputs, polyfills
// Requires jQuery and Modernizr
// modified from http://webdesignerwall.com/tutorials/cross-browser-html5-placeholder-text/comment-page-2
//
// Because older browsers don't support placeholders and because you may want some placeholder text in a 
// password input, this implementation sets the input value for the text instead of using placeholder.  If
// it's a password input, we hide the input and show a text input to allow the placeholder text to be visible

define(/*['jquery'],*/ function () {
$.fn.placeholder = function (classes, tabIndex) {
    tabIndex = tabIndex || 1;

    this.each(function () {

    // Keeps track of password input when working with type=password
    var input = $(this);

    // Keeps track of faux text input when working with type=password
    var faux;

    // Password inputs need another text input to swap back and forth between
    if (input.attr('type').toLowerCase() === 'password') {
        var placeholderValue = input.attr('placeholder');

        // left 0 isn't totally maintainable if there are paddings or margins desired
        faux = $('<input type="text" class="' + classes + '" tabindex="' + tabIndex + '" style="position: absolute;left:0;" placeholder="' + placeholderValue + '"" value="' + placeholderValue + '" />');
        //    .data('originalPlaceholder', input);             
              
        // using visibility important here vs display or .show()/.hide() because of IE8 rendering bugs
        input.css('visibility', 'hidden');
        input.before(faux); 
    }

    faux && faux.focus(focus) || input.focus(focus);
    input.blur(blur);

    input.blur();

    function blur() {
        if (input.val() === '') {
            if (faux) {

                // visibility used over display/hide/show because of IE8 jerkiness when adding input
                faux.val(input.attr('placeholder'));
                input.css('visibility', 'hidden');
                faux.css('visibility', 'visible');
            } else {
                input.val(input.attr('placeholder'));
            }
        }
    }

    function focus() {
        var el = faux || input;

        if (el.val() === input.attr('placeholder')) {
            el.val('');
        }
        
        if (faux) {

            // visibility used over display/hide/show because of IE8 jerkiness when adding input
            faux.css('visibility', 'hidden');
            input.css('visibility', 'visible').focus();
        }
    }

    });
};
});
