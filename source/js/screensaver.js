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
var timerIncrement = function() {
  idleTime = idleTime + 1;
  if (idleTime > 2) {
    screensaver();
  }
}

/**
 * Screensaver animation
 */
var screensaver = function() {
  console.log('SCREENSAVERED!');

  var glyphVals = [0, 17, 11, 4]; // Glyph values to show on backs, after the flip

  // Fade out all the content
  $('#content').fadeOut('slow', function() {
    $('body').addClass('screensavered'); // Darken the background

    // Show the headline
    $('#screensaver #headline').fadeIn(3000, function() {

      // Then animate each glyphs in
      $('.bigGlyph').each(function(index) {
        $(this).delay(index * 1600).show('puff', 1600);

      // When the glyphs finish puffing in, show the subheadline
      }).promise().done(function() {
        $('#subheadline').fadeIn('slow', function() {

          // Then flip the glyphs, using the flippant.js plugin
          $('.bigGlyph').each(function(i) {
            var front = document.getElementById(this.id),
                backContent = '<h1>'+ glyphVals[i] +'</h1>',
                back = flippant.flip(front, backContent);
          });
        });
      });
    });
  });

  //wakeUp(); // Watch for mousemove, which will reload the page
}

/**
 * Clear screensaver
 */
var wakeup = function() {
  // Refresh on mousemove
  $('body').mousemove(function (e) {
    location.reload();
  });
}
