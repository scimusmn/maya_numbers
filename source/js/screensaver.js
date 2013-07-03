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
  /*if (idleTime > 2) {
    screensaver();
  }*/
}


/**
 * Screensaver animation sequence
 */
var screensaver = function() {
  console.log('SCREENSAVERED!');

  // Values to show on the backs of the glyphs after they flip
  var glyphVals = [0, 17, 11, 4];

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

          // Then flip the glyphs over and back
          $('.bigGlyph').each(function(index) {
            flipIt(this.id, index, glyphVals);
          });

        });
      });

    });
  });

  //wakeUp(); // Watch for mousemove, which will reload the page
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
          back;

      back = flippant.flip(front, backContent);

      // Pause, then flip back
      setTimeout(function() {
        back.close();
      }, ((index + 1) * 2000));

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
