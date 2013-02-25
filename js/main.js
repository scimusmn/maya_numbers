$(function () {
  "use strict";

  // Insert markup for glyphs
  generateGlyphs();

  var level = 1,
      totalCorrect = 0,
      number = 0,
      $glyphs = $('#glyphs img'),
      $bucket = $('#bucket');

  // Insert a target value
  insertTarget(level);

  // Let the glyphs be draggable
  $glyphs.draggable({
    revert: 'invalid' // Revert back to the original location if dropped outside the target
  });

  // Make the bucket droppable
  var bucketInit = function($bucket) {
    $bucket.droppable({
      drop: function (event, ui) {
        // Show the current total when a glyph is dropped.
        displayNumber(ui.draggable, 'addition');
        ui.draggable.addClass('dropped');

        // @TODO: If there's already a block here, put it back if a new one's added
      },

      // Allow items to be removed from the bucket
      // @TODO: Items won't go back in after they've been removed, that's no good
      out: function (event, ui) {
        // When the item leaves, allow another item to replace it
        $(this).droppable('option', 'accept', $glyphs);
        ui.draggable.draggable({
          revert: 'valid',

          // Subtract the value from the total once the item's removed
          // @TODO: This can happen multiple times - should only happen on removal from bucket
          stop: function (event, ui) {
            $(this).removeClass('dropped');
            displayNumber($(this), 'subtract');
          }
        });
      }
    });
  }

  // Initialize the bucket
  bucketInit($bucket);

  // Calculate the total sum value. This runs when a glyph is dropped in the bucket.
  var updateNumber = function(value, op) {
    var value = parseInt(value, 10),
        multiplier = 0;
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
  var displayNumber = function($item, op) {
    // Only update if a glyph has moved or left the bucket
    if (!$item.hasClass('dropped')) {
      var value = $item.attr('data-glyph-value');
      var updatedNumber = updateNumber(value, op);

      // Show numbers currently in the bucket above the total
      /*if (op == 'addition') {
        $('#live_sum').prepend('<div class="value" id="value-'+ value +'">'+ value +'</div>');
      } else {
        $('#value-' + value).remove();
      }*/

      // Update the total
      $('div#total').html('= ' + updatedNumber);
    }
  }

  // When the Enter button is clicked, see if the answer is correct
  $('.btn').click(function() {
    var target = $('div#target_value').text(),
        value = $('div#total').text().match(/\d+/); // Look at integers in the div only

    // Correct answer
    if (value == target) {
      totalCorrect++;
      alert('Correct! ' + totalCorrect + ' so far');

      // Reset the glyphs
      $glyphs.each(function() {
        // Removes the "position: relative" added by jqUI draggable.
        // Without this, the glyphs end up at the bottom of the page. There's probably a better fix for this.
        $(this).removeAttr('style');
        $('#live_sum div').text('');
        // Put the glyphs back home
        $(this).animate({
          'left': $(this).data('left'),
          'top':  $(this).data('top'),
        }, 'slow',  function() {
          // Reinstate draggble CSS attributes and behavior
          $glyphs.removeAttr('style').css('position', 'relative');
          bucketInit($bucket);
          number = 0;
        });
      });

      // Load a new target value
      $('div#target_value').html('');
      insertTarget(level);

      // Move to the next level after 10 correct answers
      if (totalCorrect == 10) {
        level++;
        alert('Good job! On to level ' + level);
      }

    } else { // Incorrect answer
      alert('Try again');
    }
  });

  // Note original positions of glyphs; will use for resetting later
  $glyphs.each(function() {
    $(this).data('left', $(this).position().left).data('top', $(this).position().top);
  });

});

/*
 * Make glyphs, and put them in the glyphs div.
 * @TODO: This should just be HTML on the page in the final version (for performance).
 * This is just easier to manipulate for now.
*/
var generateGlyphs = function() {
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
 * @TODO: Have it generate an array instead - we don't want repeats in a level
 * @param level - integer - current game level
*/
var insertTarget = function(level) {
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
