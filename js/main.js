$(function() {
  $( "div.glyphs" ).draggable();
  $( "#bucket" ).droppable({
    drop: function( event, ui ) {
            $( this )
    .addClass( "ui-state-highlight" )
    .find( "p" )
    .html( "Dropped!" );
          }
  });
});
