/**
 * Screensaver functionality.
 * After 3 minutes of inactivity, play the screensaver animation.
 * Reload the page when the screen is touched.
 */

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
function timerIncrement() {
  idleTime = idleTime + 1;
  if (idleTime > 2) {
    screensaver();
  }
}

/**
 * Screensaver animation
 */
function screensaver() {
  console.log('SCREENSAVERED!');

  // Fade out all the content
  $('#language_bar, #wrapper, footer').fadeOut('slow', function() {
    $('body').addClass('screensavered'); // Darken the background

    // Show the headline, then animate the glyphs in, then fade in the subheadline
    $('#screensaver #headline').fadeIn(3000, function() {
      $('.bigGlyph').each(function(index) {
        $(this).delay(index * 1600).show('slide', 1600, function() {
          if ($(".bigGlyph:animated").length === 0)
            $("#subheadline").fadeIn('slow');
        });
      });
    });

  });

  //wakeUp(); // Watch for mousemove, which will reload the page
}

/**
 * Clear screensaver
 */
function wakeUp() {
  // Refresh on mousemove
  $('body').mousemove(function (e) {
    location.reload();
  });
}
