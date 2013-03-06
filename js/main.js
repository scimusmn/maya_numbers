$(function () {
  "use strict";

  // Hide markup we don't need for level 1
  $('.level-2, .level-3').hide();

  var level = 1,
      totalCorrect = 0,
      number = 0,
      $glyphs = $('#glyphs img');

  // Initialize the level
  levelChange(level);
  updateTarget(targetValues, totalCorrect);

  // Let the glyphs be draggable
  $glyphs.draggable({
    revert: 'invalid' // Revert back to the original location if dropped outside the targets
  });

  // When a draggable goes into the bucket, add points.
  // When it returns to the origin, subtract those points.
  // The "math" data attribute checks if the appropriate math has already happened.

  // @TODO: You can't move a glyph to another bucket yet unless you first put it back in the glyphs div
  var bucketInit = function() {
    $('.bucket .dropzone').droppable({
      drop: function (event, ui) {
        // Make note of which bucket we're dropping in
        var bucketID = $(this).attr('id').match(/\d+/);
        ui.draggable.data('bucketID', bucketID);
        // Run the addition function if we haven't already
        if (ui.draggable.data('math') != true) {
          displayNumber(ui.draggable, 'addition', bucketID);
        }
        ui.draggable.data('math', true); // Note that this glyph has been added to the total.
      }
    });
    $('#glyphs').droppable({
      drop: function (event, ui) {
        var bucketID = ui.draggable.data('bucketID');
        // Run the subtraction function if we haven't already
        if (ui.draggable.data('math') == true) {
          displayNumber(ui.draggable, 'subtract', bucketID);
        }
        ui.draggable.data('math', false); // Note that this glyph is not part of the total.
      }
    });
  }

  // Initialize the droppables
  bucketInit();

  // Calculate the total sum value. This runs when a glyph is dropped in the bucket.
  var updateNumber = function(value, op, bucketID) {
    var value = parseInt(value, 10),
        bucketID = parseInt(bucketID, 10),
        multiplier = 0;

    switch (op) {
      case 'addition':
        switch (bucketID) {
          case 1: multiplier = 1; break;
          case 2: multiplier = 20; break;
          case 3: multiplier = 400; break;
          case 4: multiplier = 8000; break;
        }
        break;

      case 'subtract':
        switch (bucketID) {
          case 1: multiplier = -1; break;
          case 2: multiplier = -20; break;
          case 3: multiplier = -400; break;
          case 4: multiplier = -8000; break;
        }
        break;
    }
    number = number + (value * multiplier);
    console.log(op + ' ' + value + ' from bucket ' + bucketID);
    return number;
  }

  // Show the active numbers.
  var displayNumber = function($item, op, bucketID) {
    var value = $item.attr('data-glyph-value');
    // Run addition/subtraction
    var updatedNumber = commaSeparateNumber(updateNumber(value, op, bucketID));
    $('div#total').html('= ' + updatedNumber); // Update the total
  }

  // When the Enter button is clicked, see if the answer is correct
  $('#enter').click(function() {
    // Just look at integers, not commas/equals sign
    var target = solve(), // Calculates and returns the correct answer
        value = parseInt($('div#total').text().match(/\d+/), 10);

    // Correct answer
    if (value == target) {
      totalCorrect++;
      console.log('Correct answer');
      if (totalCorrect < required) {
        $('span#correct').text(totalCorrect);
      }

      // Reset the glyphs
      resetGlyphs($glyphs);

      // Move to the next level after required number of correct answers
      if (totalCorrect == required) {
        level++;
        levelChange(level);
        totalCorrect = 0;
        console.log('Moving to level ' + level);
      }

      // Load a new target value
      $('div#target_value').html('');
      updateTarget(targetValues, totalCorrect);


    } else { // Incorrect answer
      alert('Try again');
    }
  });

  // When the reset button is clicked, reset all the things
  $('#reset').click(function() {
    resetGlyphs($glyphs);
    $glyphs.data('math', false);
    console.log('Reset glyphs');
  });

  // Note original positions of glyphs; will use for resetting later
  $glyphs.each(function() {
    $(this).data('left', $(this).position().left).data('top', $(this).position().top);
  });

  // Put the glyphs back where they started, and clear out the live sum
  var resetGlyphs = function($glyphs) {
    $glyphs.each(function() {
      $('#live_sum div').text('');
      // Removes the "position: relative" added by jqUI draggable.
      // Without this, the glyphs end up at the bottom of the page. There's probably a better fix for this.
      $(this).removeAttr('style');
      // Put the glyphs back home
      $(this).animate({
        'left': $(this).data('left'),
        'top':  $(this).data('top'),
      }, 'slow',  function() {
        // Reinstate draggble CSS attributes and behavior once the animation's done
        $glyphs.removeAttr('style').css('position', 'relative');
        bucketInit();
        number = 0;
      });
    });
  }

});

/*
 * This runs when you advance levels.
 * Load and show the help dialog, update that link, and generate a new array of potential target values.
 * @param level - integer - current game level
*/
var levelChange = function(level) {

  if (level != 1) {
    targetValues.length = 0; // Empty out the targetValues array so we can put new values up in it
    $('span#level').text(level);
  }

  // Set level-specific values
  switch (level) {
    case 1:
      var min = 0;
      var max = 19;
      required = 2; // @TODO - Change this to 10 for production
      var dialogTitle = 'Touch the screen to start';
      break;
    case 2:
      var min = 20;
      var max = 7999;
      required = 3;
      var dialogTitle = 'Level 2';
      break;
    case 3:
      var min = 8000;
      var max = 159999;
      required = 3;
      var dialogTitle = 'Level 3';
      break;
  }

  // Randomly choose values from the acceptable range
  // See https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Math/random
  // And http://stackoverflow.com/a/2380113/1940172
  targetValues = [];
  while (targetValues.length < required) {
    var rando = Math.floor(Math.random() * (max - min + 1)) + min;
    var found = false;
    for (var i=0; i<targetValues.length; i++) {
      if (targetValues[i] == rando) {
        found=true;
        break
      }
    }
    if(!found)targetValues[targetValues.length]=rando;
  }
  console.log('New array of target values generated for level ' + level + ': ' + targetValues);

  // Update body class
  var lastLevel = level - 1;
  $('body').removeClass('level-' + lastLevel).addClass('level-' + level);

  // Update directions
  $('span#required').text(required);
  $('.level-' + lastLevel).hide();
  $('.level-' + level).show();

  helpDialogs(level, dialogTitle);
}

/*
 * Change the target value. The player needs to hit this value with their glyphs.
 * Possible values for this depend on the game level the player has reached. Those are generated by levelChange().
*/
var updateTarget = function(targetValues, totalCorrect) {
  $('div#target_value').html(commaSeparateNumber(targetValues[totalCorrect]));
}

/*
 * Help dialogs. These open when each level begins and can be re-opened using the "Help?" link.
*/
var helpDialogs = function(level, dialogTitle) {

  var options = {
    buttons: [{
      text: "Go!",
      click: function() {
        $(this).dialog('close');
      }
    }],
    modal: true,
    width: 500,
    hide: {
      effect: 'fadeOut',
      duration: 200
    },
    open: function() {
      $('.ui-widget-overlay').bind('click', function() {
        $('#level-'+ level +'-help').dialog('close');
      })
    },
    dialogClass: "no-close",
    title: dialogTitle
  }

  // Initialize dialogs
  $('#level-'+ level +'-help').dialog(options);

  // Open the dialog from the help link
  $('#help').click(function() {
    $('#level-'+ level +'-help').dialog('open');
    // @TODO - Why does this fire twice and open both dialogs on level 2?
    console.log('Level ' + level + ' help dialog opened');
  });

}

/*
 * Add a comma to big numbers to make them more readable.
 * http://stackoverflow.com/a/12947816/1940172
*/
var commaSeparateNumber = function(val) {
  while (/(\d+)(\d{3})/.test(val.toString())){
    val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
  }
  return val;
}

// @TODO - You could still get the total correct while not doing the glyphs correctly.
// For example, you could add 20 "1" glyphs instead of a 20-value glyph.
// This needs to calculate and return not the correct total, but really the correct combination of bricks,
// maybe as an array, and then we'd run a check against the result of that function here.
var solve = function() {
  solution = parseInt($('div#target_value').text().match(/\d+/), 10);
  return solution;
}
