$(function () {
  "use strict";

  // Insert markup for glyphs
  generateGlyphs();

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
  $('#enter').click(function() {
    var target = $('div#target_value').text(),
        value = $('div#total').text().match(/\d+/); // Look at integers in the div only

    // Correct answer
    if (value == target) {
      totalCorrect++;
      if (totalCorrect < required) {
        alert('Correct! ' + totalCorrect + ' so far');
      }

      // Reset the glyphs
      resetGlyphs($glyphs);

      // Move to the next level after required number of correct answers
      if (totalCorrect == required) {
        level++;
        levelChange(level);
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
 * This runs when you advance levels.
 * Load and show the help dialog, update that link, and generate a new array of potential target values.
 * @param level - integer - current game level
*/
var levelChange = function(level) {

  if (level != 1) {
    alert('Good job! On to level ' + level);
    targetValues.length = 0; // Empty out the targetValues array so we can put new values up in it
  }

  // Set level-specific values
  switch (level) {
    case 1:
      var min = 0;
      var max = 19;
      required = 2; // @TODO This will really be 10, but 2's easier for testing.
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
  while (targetValues.length < 10) {
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

  // Update body class
  var lastLevel = level - 1;
  $('body').removeClass('level-' + lastLevel).addClass('level-' + level);

  // Update directions
  $('span#required').text(required);

  // Open the level's help dialog
  helpDialogs(level, dialogTitle);

  // Display the level below the glyphs
  // $('#wrapper').append('Level ' + level + '<br />');
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
  // @BUG On level 2, it opens both dialogs
  $('.level-'+ level +' #help').click(function() {
    $('#level-'+ level +'-help').dialog('open');
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

