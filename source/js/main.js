$(function () {
  "use strict";

  // Hide markup we don't need for level 1
  $('.level-2, .level-3').hide();

  var level = 1,
      totalCorrect = 0,
      number = 0,
      $dropzone = $('.dropzone');

  // Initialize the level
  levelChange(level, $dropzone);
  updateTarget(targetValues, totalCorrect);

  // Let the glyphs be draggable
  $('#glyphs img').draggable({
    helper: 'clone',
    revert: 'invalid' // Revert back to the original location if dropped outside the targets
  });

  // When a draggable goes into the bucket, add points.
  $dropzone.droppable({
    drop: function (event, ui) {
      var value = ui.draggable.attr('data-glyph-value'); // How many points?
      var bucketID = $(this).attr('id').match(/\d+/); // Which bucket?

      // If the bucket already had a glyph in it, remove that one's value from the total
      if ($(this).data('bucketValue')) {
        var firstValue = $(this).data('bucketValue');
        displayNumber(firstValue, 'subtract', bucketID);
      }

      // Set the bucket ID as data on the glyph and the glyph value as data on the bucket
      ui.draggable.data('bucketID', bucketID);
      $(this).data('bucketValue', value).attr('data-glyph-value', value);

      // Add the glyph's value to the total
      displayNumber(value, 'add', bucketID);

      // Show the dropped block as the bucket's background image
      $(this).css('background', 'url(../assets/images/numbers/' + value + '.png) 8px 8px no-repeat').addClass('full');

    }
  });

  // Calculate the total sum value.
  // This runs when a glyph is dropped in the bucket or when a glyph is removed.
  var updateNumber = function(value, op, bucketID) {
    var value = parseInt(value, 10),
        bucketID = parseInt(bucketID, 10),
        multiplier = 0;

    switch (op) {
      case 'add':
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
    console.log(op + ' ' + Math.abs(value * multiplier) + ' from bucket ' + bucketID);
    return number;
  }

  // Show the active numbers.
  var displayNumber = function(value, op, bucketID) {
    // Run addition/subtraction
    var updatedNumber = commaSeparateNumber(updateNumber(value, op, bucketID));
    $('div#total').html('= ' + updatedNumber); // Update the total
  }

  // When the Enter button is clicked, see if the answer is correct
  $('#enter').click(function() {

    // Make array of values in the buckets
    var values = [];
    $.each($('.dropzone'), function(index, value) {
      values.push($(this).attr('data-glyph-value'));
    });

    correct = solve(values); // Calculates answer and returns true or false

    // Correct answer
    if (correct == true) {
      totalCorrect++;
      $('span#correct').text(totalCorrect);

      // Move to the next level after required number of correct answers
      if (totalCorrect == required) {
        level++;
        levelChange(level, $dropzone);
        totalCorrect = 0;
        console.log('Moving to level ' + level);
      } else {
        // Append number remaining in the level to the success message, then show a success alert
        var remaining = required - totalCorrect;
        $('p#progress').prepend('<span id="totalCorrect"><strong>' + remaining + ' </strong></span>');
        $('#notifications .alert-success').fadeIn('fast');
        setTimeout(function() {
          $('#notifications .alert-success').fadeOut(800, function() {
            $('span#totalCorrect').remove();
          });
        }, 2400);
      }

      // Reset the glyphs
      resetGlyphs();

      // Load a new target value
      $('div#target_value').html('');
      updateTarget(targetValues, totalCorrect);

    } else {
      // Incorrect answer
      $('#total').animate({
        color: "#880606"
      }, 400);
      $('#notifications .alert-error').fadeIn(800);
    }
  });

  // When a bucket is double-tapped, clear out that bucket and remove its value from the total
  $dropzone.hammer().on('doubletap', function() {
    // Get the bucket ID and the value from the clicked object
    var bucketID = $(this).attr('id').match(/\d+/);
    var bucketValue = $(this).data('bucketValue');
    // Clear bucket and run subtract function
    if (bucketValue) {
      resetGlyphs(bucketID, bucketValue);
      $(this).removeData('bucketValue').removeClass('full'); // Reset the bucket value
    }
  });

  // Clear out the buckets and the live sum
  // If a bucketID exists, clear that bucket only, otherwise clear them all
  var resetGlyphs = function(bucketID, value) {
    if (bucketID > 0) {
      // For one bucket - run this on a double-click
      $('#bucket-'+ bucketID +'.dropzone').css('background', '').removeClass('full'); // Make buckets appear empty
      displayNumber(value, 'subtract', bucketID); // subtract the glyph's value from the total
    } else {
      // For all buckets - run this on "Clear glyphs" button or after a correct answer
      $('#live_sum div#total').text('');
      $dropzone.removeData('bucketValue');
      $dropzone.css('background', '').removeClass('full'); // Make buckets appear empty
      number = 0;
    }
    $('#total').css('color', '#333333'); // Return text to black in case an error had turned it red
    $('#notifications div.alert-error').fadeOut('slow'); // Remove error notification
  }

  // When the reset button is clicked, reset all the things
  $('#reset').click(function() {
    resetGlyphs();
  });

  // Restart the game if you click the "Restart game" link
  $('#restart').click(function() {
    location.reload();
  });

  // Open the dialog from the help link
  $('#help').click(function() {
    $('#level-'+ level +'-help').dialog('open');
  });

});

/*
 * This runs when you advance levels.
 * Load and show the help dialog, update that link, and generate a new array of potential target values.
 * @param level - integer - current game level
 * @param $dropzone - jQuery object representing the bucket dropzone divs
*/
var levelChange = function(level, $dropzone) {

  // Set level-specific values
  switch (level) {
    case 1:
      var min = 0;
      var max = 19;
      required = 5;
      break;
    case 2:
      var min = 20;
      var max = 7999;
      required = 3;
      break;
    case 3:
      var min = 8000;
      var max = 159999;
      required = 3;
      break;
  }

  // Run functions for levels 1-3 (if you're at level 4, you won)
  if (level < 4) {

    // Levels 2-3 only
    if (level != 1) {
      targetValues.length = 0; // Empty out target values array
      $('span#level-num').text(level); // Update the level text
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

    // Update footer text
    $('span#correct').text('0');
    $('span#required').text(required);
    $('.level-' + lastLevel).hide();
    // Clear out the bucket
    $dropzone.removeData('bucketValue');
    // Show the correct buckets and directions for this level (#instructions fades in after the dialog close)
    $('.level-'+ level +':not(#instructions p)').show();

  } else {
    $('h1, .column, footer').hide(); // When the game ends, just hide everything except the dialog
  }

  helpDialogs(level, true); // Launch dialogs
}

/*
 * Change the target value. The player needs to hit this value with their glyphs.
 * Store the unformatted integer as a data attribute for easier math when finding the solution (solve()).
 * Possible values for this depend on the game level the player has reached. Those are generated by levelChange().
 * @param targetValues - array - the target values for this level
 * @param totalCorrect - int - number of correct answers so far this level
*/
var updateTarget = function(targetValues, totalCorrect) {
  $('div#target_value').attr('data-target', targetValues[totalCorrect]);
  $('div#target_value').html(commaSeparateNumber(targetValues[totalCorrect]));
}

/*
 * Help dialogs. These open when each level begins and can be re-opened using the "Help?" link.
 * @param level - int - which level we're currently on
*/
var helpDialogs = function(level, autoOpen) {

  // Level-specific text
  if (level < 4) {
    var text = $('#btn-1').text();
    var dialogTitle = $('#dialog-title').text() + ' ' + level;
  } else {
    var text = $('#btn-win').text();
    var dialogTitle = $('#dialog-title-win').text();
  }
  if (level == 1) {
    var dialogTitle = $('#splash-title').text();
  }

  var options = {
    autoOpen: autoOpen,
    buttons: [{
      text: text,
      click: function() {
        $(this).dialog('close');
        $('p#intro').hide(); // Only show this message on the initial page load
      }
    }],
    modal: true,
    width: 600,
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
    title: dialogTitle,
    close: function(event, ui) {
      if (level == 4) {
        location.reload(); // Restart the game after the last dialog is closed.
      } else {
        $(this).dialog('close');
        // Fade in directions after the box closes
        $('#instructions p.level-' + level + ':eq(0)').fadeIn(600, function() {
          $('#instructions p.level-' + level + ':eq(1)').fadeIn(1000);
        });
      }
    },
    resizable: false,
    draggable: false,
    height: 560
  }

  // Initialize dialogs
  $('#level-'+ level +'-help').dialog(options);

}

/*
 * Add a comma to big numbers to make them more readable.
 * @param val - int - number to format nicely
 * http://stackoverflow.com/a/12947816/1940172
*/
var commaSeparateNumber = function(val) {
  while (/(\d+)(\d{3})/.test(val.toString())){
    val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
  }
  return val;
}

// Find the correct answer to the current problem.
// @param - values - array containing the glyph value that's in each bucket
// @return - boolean - true for correct, false for incorrect
var solve = function(values) {
  var target = $('div#target_value').attr('data-target');

  // Fill solution array with the correct value for each bucket. MATH!
  var bucket4 = bucket3 = bucket2 = bucket1 = 0;

  // All 4 buckets in play
  if (target >= 8000) {
    bucket4 = Math.floor(target / 8000);
    var remainder = target % 8000;

    bucket3 = Math.floor(remainder / 400);
    remainder = (target - bucket4 * 8000) % 400;

    bucket2 = Math.floor(remainder / 20);
    remainder = (target - (bucket4 * 8000) - (bucket3 * 400)) % 20;

    bucket1 = remainder;
  }

  // 3 buckets
  if (target >= 400 && target < 8000) {
    bucket3 = Math.floor(target / 400);
    var remainder = target % 400;

    bucket2 = Math.floor(remainder / 20);
    remainder = (target - bucket3 * 400) % 20;

    bucket1 = remainder;
  }

  // 2 buckets
  if (target >= 20 && target < 400) {
    bucket2 = Math.floor(target / 20);
    var remainder = target % 20;
    bucket1 = remainder;
  }

  // 1 bucket
  if (target < 20) {
    bucket1 = target;
  }

  var solution = [bucket4, bucket3, bucket2, bucket1];

  // Are the two arrays the same?
  console.log('Comparing values ' + values + ' to target values ' + solution);
  correct = arraysEqual(solution, values);

  return correct;
}

/*
 * Check if two arrays are the same
 * See http://stackoverflow.com/a/13201935/1940172
 * @params arr1, arr2 - arrays - two arrays to compare
 * @return - boolean - are the arrays the same?
*/
function arraysEqual(arr1, arr2){
  // If the arrays are different lengths, false
  if (arr1.length != arr2.length) return false;

  // Compare each element in the array
  for (var i=0;i<arr1.length;i++){
    if (arr1[i] != arr2[i]) return false;
  }

  return true;
}