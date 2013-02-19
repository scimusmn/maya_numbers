$(function () {
  "use strict";

  // Return markup for glyphs
  generateGlyphs();

  var $glyphs = $('#glyphs'),
      $bucket = $('#bucket'),
      number = 0;

  // Let the glyphs be draggable
  $('img', $glyphs).draggable({
    revert: 'invalid' // Revert back to the original location if dropped outside the target
  });
  // Make the bucket droppable
  $('#bucket').droppable({
    drop: function (event, ui) {
      // Show the current total when a glyph is dropped.
      displayNumber(ui.draggable);
    }
  });

  // Calculate the total sum value. This runs when a glyph is dropped in the bucket.
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
    $('p', $bucket).html(updadatedNumber);
  }

});

/*
 * Make glyphs, and put them in the glyphs div.
 * @return - string - HTML markup
*/
function generateGlyphs() {
  // Make 20 glyphs - images rendered as list items.
  var glyphs = '<ul>';
  for (var val=1; val<=20; val++) {
    glyphs += '<li><img data-glyph-value="'+ val +'" alt="'+ val +'" src="media/images/numbers/'+ val +'.png" /></li>';
  }
  glyphs += '</ul>';

  // Put markup into the glyphs div.
  $('#glyphs').html(glyphs);
}
