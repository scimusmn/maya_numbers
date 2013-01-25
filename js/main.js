$(function () {
    "use strict";
    var $glyphs = $("#glyphs"),
        $bucket = $("#bucket"),
        number = 0;

    function updateNumber(value, op) {
        value = parseInt(value, 10);
        var multiplier = 0;
        switch (op) {
        case 'addition':
            multiplier = 1;
            break;
        case 'subtract':
            multiplier = -1;
            break;
        }
        number = number + (value * multiplier);
        return number;
    }

    function displayNumber($item) {
        var updadatedNumber = updateNumber($item.attr('data-glyph-value'), 'addition');
        // Trying to set the internal HTML to the class of the dragged element
        $("p", $bucket).html(updadatedNumber);
    }

    // Let the glyphs be draggable
    $("img", $glyphs).draggable({
        // Revert back to the original location if dropped outside the target
        revert: "invalid"
    });

    // Make the bucket droppable
    $("#bucket").droppable({
        //accept: "div.glyphs",

        drop: function (event, ui) {
            displayNumber(ui.draggable);
        }
    });

});
