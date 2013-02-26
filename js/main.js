$(function () {
  "use strict";

  // Insert markup for glyphs
  generateGlyphs();

  var level = 1,
      totalCorrect = 0,
      number = 0,
      $glyphs = $('#glyphs img');

  // Insert a target value
  insertTarget(level, totalCorrect);

  // Let the glyphs be draggable
  $glyphs.draggable({
    revert: 'invalid' // Revert back to the original location if dropped outside the targets
  });

  // When a draggable goes into the bucket, add points.
  // When it returns to the origin, subtract those points.
  // The "math" data attribute checks if the appropriate math has already happened.
  var bucketInit = function() {
    $('#bucket').droppable({
      drop: function (event, ui) {
        if (ui.draggable.data('math') != true) {
          displayNumber(ui.draggable, 'addition');
        }
        ui.draggable.data('math', true);
      }
    });
    $('#glyphs').droppable({
      drop: function (event, ui) {
        if (ui.draggable.data('math') == true) {
          displayNumber(ui.draggable, 'subtract');
        }
        ui.draggable.data('math', false);
      }
    });
  }

  // Initialize the droppables
  bucketInit();

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
          bucketInit();
          number = 0;
        });
      });

      // Load a new target value
      $('div#target_value').html('');
      insertTarget(level, totalCorrect);

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
 * @param level - integer - current game level
*/
var insertTarget = function(level, totalCorrect) {
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
  // And http://stackoverflow.com/a/2380113/1940172
  var values = []
  while (values.length < 10) {
    var rando = Math.floor(Math.random() * (max - min + 1)) + min;
    var found = false;
    for (var i=0; i<values.length; i++) {
      if (values[i] == rando) {
        found=true;
        break
      }
    }
    if(!found)values[values.length]=rando;
  }

  // Display this value to the player
  $('div#target_value').html(values[totalCorrect]);

}
