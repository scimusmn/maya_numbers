/**
 * Functionality for the Maya numbers game.
 * The object of the game is to select the correct Mayan glyphs that add up to a given target value.
 * Visitors drag glyphs into buckets which multiply those glyphs by a 20-based value.
 * There are 3 levels, which get progressively more difficult by increasing the target value.
 *
 * @DEBUG markers in the code can be un-commented to print more verbose output to the browser's console.
 * @SELENIUM markers are console.log statements that could be useful to log to a text file later via Selenium.
*/

$(function () {
  "use strict";

  // @SELENIUM Log message
  console.log(makeTimestamp() + ': Starting new game');

  // Hide markup we don't need for level 1
  $('.level-2, .level-3').hide();

  // Check for URL parameters for skipping to levels 2 and 3.
  // This is handy for development.
  if (window.location.href.indexOf('level-2') > -1) {
    var level = 2;
  } else if (window.location.href.indexOf('level-3') > -1) {
    var level = 3;
  } else {
    var level = 1;
  }

  var totalCorrect = 0,
      number = 0,
      factIndex = 0,
      factTotal = $('#facts p').length,
      $dropzone = $('.dropzone');

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
      // Background position depends on the level. Buckets are smaller in levels 2 and 3.
      if ($('#level-num').text() > 1) {
        var x = 5;
      } else {
        var x = 10;
      }
      $(this).css('background', 'rgb(191,191,191) url(../assets/images/numbers/' + value + '.png) '+ x +'px '+ x +'px no-repeat').addClass('full');

      // Make array of values in the buckets
      var allValues = [];
      $.each($('.dropzone'), function(index, value) {
        allValues.push($(this).attr('data-glyph-value'));
      });
      correct = solve(level, allValues); // Calculate answer and return true or false

      // Correct answer
      if (correct == true) {
        totalCorrect++;
        factIndex++;

        // Update the totals in the footer
        $('span#correct').text(totalCorrect);
        // Update the status box
        $('div#correct').css('opacity', 1);
        $('div#incorrect').css('opacity', .3);

        // Hide any leftover hints
        if ($('#zero_hint').is(':visible')) {
          $('#zero_hint').fadeOut('fast');
        }
        // Show the next button
        $('#btn-next').fadeIn(200, function() {
          // The show a new fact (unless we're out of facts)
          if (factIndex <= factTotal) {
            $('#facts h4, #facts p#fact_' + factIndex).fadeIn(500);
          }
        });

        // Don't allow other blocks to be dropped in til the next round
        $(this).droppable('disable');

      };
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

    // Show this bucket's total next to it
    $('#bucketSum-' + bucketID).text(commaSeparateNumber(value * multiplier));

    // @DEBUG
    // console.log(op + ' ' + Math.abs(value * multiplier) + ' from bucket ' + bucketID);
    return number;
  }

  // Show the active numbers.
  var displayNumber = function(value, op, bucketID) {
    // Run addition/subtraction
    var updatedNumber = commaSeparateNumber(updateNumber(value, op, bucketID));
    $('div#total').html(updatedNumber); // Update the total
  }

  // Move forward to the next level or problem when the Next button is tapped
  $('#btn-next').click(function() {
    // To the next level:
    if (totalCorrect == required) {
      level++;
      levelChange(level, $dropzone);
      totalCorrect = 0;

      if (level < 4) {
        // @SELENIUM Log message
        console.log(makeTimestamp() + ': Moving to level ' + level);
      }

    // Or, to the next problem
    } else {
      // Append number remaining in the level to the success message
      var remaining = required - totalCorrect;
      $('p#progress').prepend('<span id="totalCorrect"><strong>' + remaining + ' </strong></span>');
    }

    // Reset the glyphs
    resetGlyphs();

    // Load a new target value
    $('div#target_value').html('');
    updateTarget(targetValues, totalCorrect);

    $('#facts h4, #facts p').fadeOut(100); // Hide the fun fact

    // Hide the Next button til next time
    $('#btn-next').fadeOut(200);
    $('div#correct').css('opacity', .3);
    $('div#incorrect').css('opacity', 1);

    // Re-enable the dropzone
    $dropzone.droppable('enable');

  });

  // When a bucket is double-tapped, clear out that bucket and remove its value from the total
  $dropzone.hammer().on('doubletap', function() {

    // Don't allow clearing the bucket if the right answer's in there
    if (!$('#btn-next').is(':visible')) {

      // Get the bucket ID and the value from the clicked object
      var bucketID = $(this).attr('id').match(/\d+/);
      var bucketValue = $(this).data('bucketValue');
      // Clear bucket and run subtract function
      if (bucketValue) {
        resetGlyphs(bucketID, bucketValue);
        $(this).removeData('bucketValue').removeClass('full'); // Reset the bucket value
      }
    }
  });

  // Clear out the buckets and the live sum
  // If a bucketID exists, clear that bucket only, otherwise clear them all
  var resetGlyphs = function(bucketID, value) {
    if (bucketID > 0) {
      // For one bucket - run this on a double-click
      $('#bucket-'+ bucketID +'.dropzone').css('background', '').removeClass('full'); // Make buckets appear empty
      displayNumber(value, 'subtract', bucketID); // subtract the glyph's value from the total
      $('#bucketSum-' + bucketID).text(''); // Clear out the single bucket sum
    } else {
      // For all buckets - run this on "Clear glyphs" button or after a correct answer
      $('#live_sum div#total').text('0');
      $dropzone.removeData('bucketValue');
      $dropzone.css('background', '').removeClass('full'); // Make buckets appear empty
      $('.bucketSum').text(''); // Remove single bucket sums
      number = 0;
    }
  }

  // Restart the game if you click the "Restart game" link
  $('#restart').click(function() {
    location.reload();
  });

  // Open the dialog from the help link
  $('#help').click(function() {
    $('#level-'+ level +'-help').dialog('open');
    $('button').blur(); // Take focus off button
  });

  // Open the hint dialog from the hint link
  $('#hint_link').click(function() {
    $('#hint').dialog('open');
    $('button').blur();
  });
  var hintOptions = {
    autoOpen: false,
    buttons: [{
      text: 'OK',
      click: function() {
        $('#hint').dialog('close');
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
        $('#hint').dialog('close');
      });
    },
    dialogClass: "no-close",
    close: function(event, ui) {
      $('#hint').dialog('close');
    },
    resizable: false,
    draggable: false
  };
  $('#hint').dialog(hintOptions);

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
      var min = 400;
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
      targetValues = []; // Empty out target values array
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

    // @DEBUG - Check for an URL parameter which contains a target value. Handy for testing specific scenarios
    if (window.location.href.indexOf('target') > -1) {
      var newTarget = getURLParameter('target');
      targetValues[0] = newTarget;
    }

    // @DEBUG
    // console.log('New array of target values generated for level ' + level + ': ' + targetValues);

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

/**
 * Help dialogs. These open when each level begins and can be re-opened using the "Help?" link.
 * @param level - int - which level we're currently on
 * @param autoOpen - boolean - should the dialog open automatically?
*/
var helpDialogs = function(level, autoOpen) {

  // Level-specific text
  if (level < 4) {
    var text = $('#btn-1').text();
  } else {
    var text = $('#btn-win').text();

    // @SELENIUM Log message
    console.log(makeTimestamp() + ': Game completed');
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
    width: 700,
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
    close: function(event, ui) {
      if (level == 4) {
        location.reload(); // Restart the game after the last dialog is closed.
      } else {
        $(this).dialog('close');
        // Fade in directions after the box closes
        $('#instructions p.level-' + level + ':eq(0)').fadeIn();
      }
    },
    resizable: false,
    draggable: false,
    height: 700
  }

  // Initialize dialogs
  $('#level-'+ level +'-help').dialog(options);

  // Take the Focus off the button. The browser outlines the button in blue when it has the focus attribute.
  $('button').blur();

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
var solve = function(level, values) {
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
  // @DEBUG
  console.log('Comparing values ' + values + ' to target values ' + solution);
  correct = arraysEqual(solution, values);

  // If a bucket (except the top one) isn't full, the answer is wrong
  if (((level == 2) && ((!$('#bucket-1').hasClass('full')) || (!$('#bucket-2').hasClass('full')))) ||
      ((level == 3) && ((!$('#bucket-1').hasClass('full')) || (!$('#bucket-2').hasClass('full')) || (!$('#bucket-3').hasClass('full'))))) {
    correct = false;
    // And if the answer requires it, show the user the "add a zero glyph" hint
    if (inArray(solution, 0)) {
      $('#zero_hint').fadeIn();
    }
  }

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

/**
 * Make a timestamp.
 * Format is like this: 5/10/2013 5:19:22 PM
 * Used for logging events.
 */
function makeTimestamp() {
  var timestamp = (new Date()).toLocaleString();
  return timestamp;
}

/**
 * Get an URL parameter value.
 * This is used for manually setting target values, for testing.
 * See http://stackoverflow.com/a/1404100
 */
function getURLParameter(name) {
  return decodeURI((RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]);
}

/**
 * Check if an array contains a value.
 */
function inArray(array, value) {
  for (var i = 0; i < array.length; i++) {
      if (array[i] == value) return true;
  }
  return false;
}

