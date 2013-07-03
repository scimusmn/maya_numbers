/**
 * Screensaver functionality.
 * After 3 minutes of inactivity, play the screensaver animation.
 * Reload the page when the screen is touched.
 */
var loops = 0; // Count how many times the animation runs

$(function () {

  // Start the clock
  idleTime = 0;

  // Increment the idle time counter every minute.
  var idleInterval = setInterval('timerIncrement()', 60000); // 1 minute

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
  /*if (idleTime > 2) {
    screensaver();
  }*/
}


/**
 * Screensaver animation sequence
 */
var screensaver = function() {
  console.log('SCREENSAVERED!');

  // Fade out all the content
  $('#content').fadeOut('slow', function() {
    $('body').addClass('screensavered'); // Darken the background
    screensaverLoop(); // Run the animation
  });

  //wakeUp(); // Watch for mousemove, which will reload the page
}


/**
 * Screensaver animation
 */
var screensaverLoop = function() {

  // Values to show on the backs of the glyphs after they flip
  var glyphVals = [0, 17, 11, 4];

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

  var front = document.getElementById(id),
      backContent = '<h1>'+ glyphVals[index] +'</h1>',
      back,
      time = 2000; // milliseconds between flips

  back = flippant.flip(front, backContent);

  // Pause, then flip back one-by-one
  setTimeout(function() {
    back.close();
  }, ((index + 1) * time));

  // If we're done, restart
  if (index === 3) {
    setTimeout(function() {
      restartScreensaver();
    }, time * 5);
  }

}


/**
 * Loop the screensaver animation a few times, then reload the page.
 */
var restartScreensaver = function() {

  loops++; // Add 1 to the loops variable
  console.log('Loops:' + loops);

  // Start the screensaver over
  $('#screensaver img').not('#headline').fadeOut('slow');
  $('#screensaver #headline').fadeOut('fast', function() {
    screensaver();
  });

  // Reload the page after 2 loops
  if (loops > 2) {
    location.reload();
  }
}


/**
 * Clear screensaver when the screen is touched.
 * This reloads the page and shows the game start dialog.
 */
var wakeup = function() {
  $('body').mousemove(function (e) {
    location.reload();
  });
}
