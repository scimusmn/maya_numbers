/**
 * Numbers game screensaver.
 * After 3 minutes of inactivity, play the screensaver animation.
 * Reload the page when the screen is touched, or once we've hit 100 loops.
 */

var savedScreen = false, // Screen is initially not saved.
    loops = 1, // Keep track of how many times the animation runs.
    enoughLoops = 100, // When we hit enoughLoops, the page will reload.
    glyphVals = [0, 17, 11, 4]; // Numbers to show on the backs of the glyphs when they flip.

$(function () {

  // Start the clock
  idleTime = 0;

  // Increment the idle time counter every minute.
  var idleInterval = setInterval(timerIncrement, 60000); // 1 minute

  // Zero the idle timer on mouse movement.
  $(this).mousemove(function (e) {
    idleTime = 0;
  });
  $(this).keypress(function (e) {
    idleTime = 0;
  });

});


/**
 * Start the screensaver after 3 minutes of inactivity.
 */
var timerIncrement = function() {
  idleTime = idleTime + 1;
  if (idleTime > 2) {
    if (!savedScreen) {
      console.log(makeTimestamp() + ': Saving the screen');
      screensaver();
    }
  }
}


/**
 * Set up the page for screensavering.
 * Kick off the screensaver animation sequence and watch for activity.
 */
var screensaver = function() {

  // Close any open dialogs
  $('.ui-dialog, .ui-widget-overlay').fadeOut('fast');

  // Fade out all the content
  $('#content').fadeOut('slow', function() {
    $('body').addClass('screensavered'); // Darken the background
    screensaverLoop(); // Run the animation
  });

  // The screen is saved! Hooray!
  savedScreen = true;

  wakeUp(); // Watch for mousemove, which will reload the page
}


/**
 * Screensaver animation.
 * This runs in a loop until the screen is touched or the page is reloaded.
 */
var screensaverLoop = function() {

  // Show the headline
  $('#screensaver #headline').fadeIn(3000, function() {

    // Then animate each glyphs in
    $('.bigGlyph').each(function(index) {
      $(this).delay(index * 1600).show('puff', 1600);

    // When the glyphs finish puffing in, show the subheadline
    }).promise().done(function() {
      $('#subheadline').fadeIn('slow', function() {

        // Then flip the glyphs over and back
        $('.bigGlyph').each(function(index) {
          flipIt(this.id, index, glyphVals);
        });

      });
    });

  });

}


/**
 * Flip the glyphs over and back
 * @param id - string - ID of element to flip
 * @param index - integer - array key for the value we want to see on the back of the item
 * @param glyphVals - array - list of values to show on the backs of the glyphs
 */
var flipIt = function(id, index, glyphVals) {

  // Set up content and a function call for glyph flipping
  var front = document.getElementById(id),
      backContent = '<h1>'+ glyphVals[index] +'</h1>',
      back = flippant.flip(front, backContent);

  /**
   * Implementation of tock.js for handling timers.
   * Using the setTimeout() method gets sketchy after running in loops for awhile.
   * See http://www.sitepoint.com/creating-accurate-timers-in-javascript/
   */
  // Backflip the glyphs one-by-one
  var flipTockOptions = {
    countdown: true,
    complete: function() {
      back.close();
    }
  },
  flipTimer = new Tock(flipTockOptions);
  flipTimer.start((index + 1) * 2000);

  // Restart the animation when the backflips are done
  if (index > 2) {
    var loopClockOptions = {
      countdown: true,
      complete: function() {
        restartScreensaver();
      }
    }
    loopTimer = new Tock(loopClockOptions);
    loopTimer.start(12000);
  }

}


/**
 * Loop the screensaver animation the set number of times, then reload the page.
 */
var restartScreensaver = function() {

  loops++; // Add 1 to the loops variable
  console.log(makeTimestamp() + ': Restarting screensaver, loop ' + loops);

  if (loops < enoughLoops) {
    $('#subheadline').fadeOut(1700, function() {
      $('.bigGlyph').removeClass('flippant').hide('puff', 800);
    });
    $('#screensaver #headline').fadeOut(1700, function() {
      screensaverLoop();
    });
  } else {
    location.reload();
  }

}


/**
 * Clear screensaver when the screen is touched.
 * This reloads the page and shows the game start dialog.
 */
var wakeUp = function() {
  $('body').mousemove(function (e) {
    location.reload();
  });
}
