$(function () {
  "use strict";

  var level = 1;
  var $glyphs = $('#glyphs'),
      $bucket = $('#bucket'),
      number = 0;

  // Insert markup for glyphs
  generateGlyphs();

  // Insert a target value
  insertTarget(level);

  // Let the glyphs be draggable
  $('#glyphs img').draggable({
    revert: 'invalid' // Revert back to the original location if dropped outside the target
  });

  // Make the bucket droppable
  $('#bucket').droppable({
    drop: function (event, ui) {
      // Show the current total when a glyph is dropped.
      displayNumber(ui.draggable, 'addition');
      ui.draggable.addClass('dropped');

      // Only accept one block in the bucket (in levels 2-3, there will be multiple buckets)
      $(this).droppable('option', 'accept', ui.draggable);
    },
    // Allow items to be removed from the bucket
    out: function (event, ui) {
      // When the item leaves, allow another item to replace it
      $(this).droppable('option', 'accept', '#glyphs img');
      ui.draggable.draggable({
        revert: 'valid',

        // Subtract the value from the total once the item's removed
        stop: function (event, ui) {
          $(this).removeClass('dropped');
          displayNumber($(this), 'subtract');
        }
      });
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

  // Show the active numbers.
  function displayNumber($item, op) {
    // Only update if a glyph has moved or left the bucket
    if (!$item.hasClass('dropped')) {
      var value = $item.attr('data-glyph-value');
      var updatedNumber = updateNumber(value, op);

      // Show numbers currently in the bucket above the total
      if (op == 'addition') {
        $('#live_sum').prepend('<div class="value" id="value-'+ value +'">'+ value +'</div>');
      } else {
        $('#value-' + value).remove();
      }

      // Update the total
      $('div#total').html(updatedNumber);
    }
  }

  // When the Enter button is clicked, see if the answer is correct
  $('.btn').click(function() {
    var target = $('div#target_value').text();
    var value = $('div#total').text();
    sumChecker(target, value);
  });

});

/*
 * Make glyphs, and put them in the glyphs div.
*/
function generateGlyphs() {
  // Make 20 glyphs - images rendered as list items.
  var glyphs = '<ul>';
  for (var val=0; val<=19; val++) {
    glyphs += '<li id="glyph-'+ val +'"><img data-glyph-value="'+ val +'" alt="'+ val +'" src="media/images/numbers/'+ val +'.png" /></li>';
  }
  glyphs += '</ul>';

  // Put markup into the glyphs div.
  $('#glyphs').html(glyphs);
}

/*
 * Generate a target value. The player needs to hit this value with their glyphs.
 * Possible values for this depend on the game level the player has reached.
 * @param level - integer - current game level
*/
function insertTarget(level) {
  // Set valid range of values
  switch (level) {
    case 1:
      var min = 0;
      var max = 19;
      break;
    case 2:
      var min = 20;
      var max = 7999;
      break;
    case 3:
      var min = 8000;
      var max = 159999;
      break;
  }

  // Randomly choose values from the acceptable range
  // See https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Math/random
  var value = Math.floor(Math.random() * (max - min + 1)) + min;

  // Display this value to the player
  $('div#target_value').html(value);

}

/*
 * Compare the target value to the sum of the glyphs.
 * If they match, go to the next level.
 * @param value - int - sum of submitted glyphs.
 * @param target - int - target value for the level.
*/
function sumChecker(value, target) {
  if (value == target) {
    alert('Correct!');
  } else {
    alert('Try again');
  }
}
