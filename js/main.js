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

  // Show the number returned by the updateNumber function.
  function displayNumber($item) {
    var updatedNumber = updateNumber($item.attr('data-glyph-value'), 'addition');
    // Show the total over to the right of the bucket
    $('div#total').html(updatedNumber);
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
    glyphs += '<li id="glyph-'+ val +'"><img data-glyph-value="'+ val +'" alt="'+ val +'" src="media/images/numbers/'+ val +'.png" /></li>';
  }
  glyphs += '</ul>';

  // Put markup into the glyphs div.
  $('#glyphs').html(glyphs);
}
