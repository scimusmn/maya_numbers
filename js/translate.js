/*
 * Change the language of text strings on the page.
 * Based on http://stackoverflow.com/a/13427846/1940172
*/
var dictionary, set_lang;

// Object literal behaving as multi-dictionary
dictionary = {
  "english": {
      "headline": "Can you match numbers with the corresponding glyphs?",
      "glyph_text_1": "Drag the correct glyph from below into the value box.",
      "glyph_text_2": "Using the glyphs and the value boxes, generate the number shown.",
      "glyph_text_3": "Double-tap a glyph to put it back.",
      "target_1": "Add a glyph to the box that equals this number:",
      "target_2": "Add glyphs to the boxes that add up to this number:",
      "buttons": "Then press Enter to check your answer:",
      "enter_button": "Enter",
      "reset_button": "Reset glyphs",
      "help_link": "Help",
      "level": "Level",
      "restart": "Restart game",
      "help_1": "The Maya developed glyphs that visually express the numeric values they represent.",
      "help_1_a": "Dots indicate values of one.",
      "help_1_b": "Lines indicate values of five.",
      "help_1_c": "A glyph with one dot and one line represents the value six.",
      "help_intro": "Can you match numbers with the corresponding glyphs? Touch the screen to begin.",
      "help_2": "The Maya employed a vertically structured \"base 20\" value system.",
      "help_3": "Now things get a little tougher!",
      "win": "Success! You’ve mastered Maya numbers. Look for them throughout the exhibit.",
      "dialog_btn_1": "Go!",
      "dialog_btn_win": "Ir!",
      "dialog_title_win": "Nice work!",
      "alert_correct": "Correct!",
      "alert_next": "more to reach the next level.",
      "alert_incorrect": "Incorrect.",
      "alert_tryagain": "Try again."
  },
  // @TODO: These came from Google Translate and are probably not that good. Get real translations.
  "spanish": {
      "headline": "Puede coincidir con los números con los glifos correspondientes?",
      "glyph_text_1": "Arrastre el glifo correcto de abajo en el cuadro de valores.",
      "glyph_text_2": "Uso de los glifos y los cuadros de valor, generar el número.",
      "glyph_text_3": "Puntee dos veces en un glifo a poner de nuevo.",
      "target_1": "Añadir un glifo a la casilla que corresponde a este número:",
      "target_2": "Añadir glifos para las cajas que se suman a este número:",
      "buttons": "A continuación, pulse Entrar para comprobar su respuesta:",
      "enter_button": "Entrar",
      "reset_button": "Cambiar glifos",
      "help_link": "Ayuda",
      "level": "Nivel",
      "restart": "Reinicie juego",
      "help_1": "Los glifos mayas desarrollaron visualmente que expresan los valores numéricos que representan.",
      "help_1_a": "Los puntos indican los valores de uno.",
      "help_1_b": "Las líneas indican los valores de cinco.",
      "help_1_c": "Un glifo con un punto y una línea representa el valor de seis.",
      "help_intro": "Puede coincidir con los números con los glifos correspondientes? Toque la pantalla para comenzar.",
      "help_2": "Los mayas emplearon una base de estructura vertical 20 sistema de valores.",
      "help_3": "Ahora las cosas se ponen un poco más difícil!",
      "win": "Éxito! Usted ha dominado números mayas. Búscalos por toda la instalación.",
      "dialog_btn_1": "Ir!",
      "dialog_btn_win": "Jugar de nuevo",
      "dialog_title_win": "Buen trabajo!",
      "alert_correct": "Correcto!",
      "alert_next": "más para llegar al siguiente nivel.",
      "alert_incorrect": "Incorrecta.",
      "alert_tryagain": "Inténtelo de nuevo."
  }
};


$(function () {
  "use strict";

  // Function for swapping dictionaries
  set_lang = function (dictionary) {
    $('[data-translate]').text(function () {
      var key = $(this).data('translate');
      if (dictionary.hasOwnProperty(key)) {
        return dictionary[key];
      }
    });
  };

  // Swap languages when menu changes
  $('span.lang').click(function() {
    $('span.lang').not(this).removeClass('selected');
    var language = $(this).text().toLowerCase();
    if (dictionary.hasOwnProperty(language)) {
      set_lang(dictionary[language]);
    }
    $(this).addClass('selected'); // Toggle button class

    // Swap images in the help dialogs
    if (language == 'english') {
      var helpImages = ['help-level2.png', 'help-level3.png'];
    } else {
      var helpImages = ['help-level2-spanish.png', 'help-level3-spanish.png'];
    }
    var path = 'media/images/';
    $('#level-2-help img').attr('src', path + helpImages[0]);
    $('#level-3-help img').attr('src', path + helpImages[1]);

    // Update jQuery UI dialog titles and buttons
    var level = $('body').attr('class').match(/\d+/);
    helpDialogs(level, false); // The "false" keeps autoOpen from happening on the language change
  });

  // Set initial language to English
  set_lang(dictionary.english);

});
