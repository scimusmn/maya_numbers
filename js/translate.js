/*
 * Change the language of text strings on the page.
 * Based on http://stackoverflow.com/a/13427846/1940172
*/

var dictionary, set_lang;

// Object literal behaving as multi-dictionary
dictionary = {
  "english": {
      "headline": "Can you match numbers with the corresponding glyphs?",
      "glyph_text_1": "Drag the correct glyph from below into the value box. Double-tap a glyph to put it back.",
      "glyph_text_2": "Using the glyphs and the value boxes, generate the number shown. Double-tap a glyph to put it back.",
      "target_1": "Add a glyph to the box that equals this number:",
      "target_2": "Add glyphs to the boxes that add up to this number:",
      "buttons": "Then press Enter to check your answer:",
      "enter_button": "Enter",
      "reset_button": "Reset glyphs",
      "help_link": "Help",
      "level": "Level",
      "restart": "Restart game",
      "lang_eng": "English",
      "lang_es": "Spanish"
      // @TODO Add text from help dialogs
  },
  // @TODO: These came from Google Translate and are probably not that good. Get real translations.
  "spanish": {
      "headline": "Puede coincidir con los números con los glifos correspondientes?",
      "glyph_text_1": "Arrastre el glifo correcto de abajo en el cuadro de valores. Puntee dos veces en un glifo a poner de nuevo.",
      "glyph_text_2": "Uso de los glifos y los cuadros de valor, generar el número. Puntee dos veces en un glifo a poner de nuevo.",
      "target_1": "Añadir un glifo a la casilla que corresponde a este número:",
      "target_2": "Añadir glifos para las cajas que se suman a este número:",
      "buttons": "A continuación, pulse Entrar para comprobar su respuesta:",
      "enter_button": "Entrar",
      "reset_button": "Cambiar glifos",
      "help_link": "Help",
      "level": "Nivel",
      "restart": "Reinicie juego",
      "lang_eng": "Inglés",
      "lang_es": "Español"
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
  $('#es').click(function() {
    var language = $(this).text().toLowerCase();
    if (dictionary.hasOwnProperty(language)) {
      set_lang(dictionary[language]);
    }
  });

  // @TODO Update the button class

  // @TODO Add a body class to use for swapping images

  // Set initial language to English
  set_lang(dictionary.english);

});
