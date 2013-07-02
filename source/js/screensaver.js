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
var screensaver = function() {
  console.log('SCREENSAVERED!');

  // Fade out all the content
  $('#content').fadeOut('slow', function() {
    $('body').addClass('screensavered'); // Darken the background

    // Show the headline, then animate each glyphs in
    $('#screensaver #headline').fadeIn(3000, function() {
      $('.bigGlyph').each(function(index) {
        $(this).delay(index * 1600).show('puff', 1600);
      });
    });
  });

  // Once the glyphs are in, fade in the subheadline
  var glyphVal = [0, 17, 11, 17]; // @TODO 17's in there twice, make a new image
  setTimeout(function(){
    $('#subheadline').fadeIn('slow', function() {
      // Then flip the glyphs
      $('.bigGlyph').each(function(i) {
        var id = this.id,
            front = document.getElementById(id),
            backContent = '<h1>'+ glyphVal[i] +'</h1>',
            back;
        back = flippant.flip(front, backContent);
      });
    });
  }, 10000);

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
