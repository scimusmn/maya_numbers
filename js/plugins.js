// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// Place any jQuery/helper plugins in here.

/*
 * MODAL DIALOGS
 * Help text is shown in a modal overlay at the start of each level.
 * Clicking the "Help?" link re-opens that level's dialog box.
*/

$(document).ready(function() {
  // Level 1: Dialog opens on the initial page load.
  $('#level-1').dialog({
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
        $('#level-1').dialog('close');
      })
    },
    dialogClass: "no-close",
    title: "Touch the screen to start"
  });
});

// Level 2: Dialog opens on level change

// Level 3: Dialog opens on level change

// @TODO: Set up help link to fire these, too

