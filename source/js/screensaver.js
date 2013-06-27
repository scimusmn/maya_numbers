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

  // If it's been 3 minutes of inactivity, and a video's not playing, save the screen
  if (idleTime > 2) {

    console.log('SCREENSAVERED!');

    // Fade out all the content

    // Fade to darker background

    // Animate the headline text in

    // Animate (bounce? spin?) the glyphs in

    // Animate the call-to-action in

    // Pause

    // Repeat

    wakeUp(); // Watch for mousemove, or an error, which will reload the page

  }
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
