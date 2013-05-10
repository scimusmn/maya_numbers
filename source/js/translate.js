/*
 * Change the language of text strings on the page.
 * Based on http://stackoverflow.com/a/13427846/1940172
*/
var dictionary, set_lang;

// Object literal behaving as multi-dictionary
dictionary = {
  "english": {
      "splash-title": "The Maya devised a math to map the heavens",
      "headline": "Can you match numbers with the corresponding glyphs?",
      "glyph_text_1": "Drag the correct glyph from below into the value box.",
      "glyph_text_2": "Using the glyphs and the value boxes, generate the number shown.",
      "glyph_text_3": "Double-tap a glyph to put it back.",
      "target_1": "Add a glyph to the box that equals this number:",
      "target_2": "Add glyphs to the boxes that add up to this number:",
      "enter_button": "Check your answer",
      "reset_button": "Reset glyphs",
      "help_link": "Instructions",
      "level": "Level",
      "restart": "Restart game",
      "help_1": "The Maya created a mathematical system for documenting and predicting astronomical phenomena. They had several symbols for zero. Combinations of dots (ones) and bars (fives) represented any value from one to nineteen. And like our place values of tens, hundreds and thousands, the value of larger numbers was determined by each symbol’s position.",
      "help_1_a": "Dots indicate values of one.",
      "help_1_b": "Lines indicate values of five.",
      "help_1_c": "A glyph with one dot and one line represents the value six.",
      "help_intro": "Can you match numbers with the corresponding glyphs? Touch the screen to begin.",
      "help_2": "The Maya employed a vertically structured \"base 20\" value system.",
      "help_3": "Now things get a little tougher!",
      "win": "Success! You’ve mastered Maya numbers. Look for them throughout the exhibit.",
      "dialog_btn_1": "Go!",
      "dialog_btn_win": "Play again",
      "dialog_title_win": "Nice work!",
      "alert_correct": "Correct",
      "alert_incorrect": "Incorrect",
      "hint_link": "Hint",
      "hint": "Try dragging a guess into the highest value box. If your guess is too high, try a glyph with a lower value.",
      "your_answer": "Your answer:",
      "next": "Next",
      "fact_1": "The Maya math system is built around the number 20 because that’s how many fingers and toes you have.",
      "fact_2": "The Maya were one of only four civilizations to develop the concept of zero.",
      "fact_3": "A place value system allows the user to write and manipulate really big numbers—like those required to track astronomical phenomena—and to break those numbers down into units—such as days, weeks, months, etc.",
      "fact_4": "For the purposes of astronomy, the Maya had to tweak their system a bit. In their Long Count calendar, the third place value represents quantities of 360, instead of 400, since this is closer to the length of the year. Consequently, the fourth place value was valued at 7200 and the place values continued in this manner.",
      "fact_5": "The exhibit is full of Maya numbers. Look around: can you find some?"
  },
  "spanish": {
      "splash-title": "Los mayas idearon un sistema matemático para trazar el mapa del cielo",
      "headline": "Puede coincidir con los números con los glifos correspondientes?",
      "glyph_text_1": "Arrastre el glifo correcto de abajo en el cuadro de valores.",
      "glyph_text_2": "Uso de los glifos y los cuadros de valor, generar el número.",
      "glyph_text_3": "Puntee dos veces en un glifo a poner de nuevo.",
      "target_1": "Añadir un glifo a la casilla que corresponde a este número:",
      "target_2": "Añadir glifos para las cajas que se suman a este número:",
      "enter_button": "Compruebe su respuesta",
      "reset_button": "Cambiar glifos",
      "help_link": "Instrucciones",
      "level": "Nivel",
      "restart": "Reinicie juego",
      "help_1": "Los mayas crearon un sistema matemático para documentar y predecir los fenómenos astronómicos. Tenían varios símbolos para el cero y combinaciones de puntos (unos) y barras (cincos) que representaban cualquier valor del uno al diecinueve. Y como en nuestros valores posicionales para las decenas, las centenas y los millares, el valor de los números más grandes se determinaba por la posición de cada símbolo.",
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
      "alert_correct": "Correcto",
      "alert_incorrect": "Incorrecta",
      "hint_link": "Indicio",
      "hint": "Pruebe a arrastrar una conjetura sobre el área de mayor valor. Si su respuesta es demasiado alto, pruebe con un glifo con un valor inferior.",
      "your_answer": "Su respuesta:",
      "next": "Próximo",
      "fact_1": "El sistema matemático maya se basa en el número 20 porque es el número de dedos que tiene.",
      "fact_2": "Los mayas fueron una de las cuatro civilizaciones para desarrollar el concepto de cero.",
      "fact_3": "Un sistema de valor posicional permite al usuario escribir y manipular números muy grandes-como los requeridos para seguir fenómenos astronómicos y romper esos números en unidades-como días, semanas, meses, etc",
      "fact_4": "A los efectos de la astronomía, los mayas tenían que modificar su sistema un poco. En su calendario de cuenta larga, el tercer valor de posición representa cantidades de 360, en lugar de 400, ya que este está más cerca de la longitud del año. En consecuencia, el cuarto valor de posición se valoró en 7200 y los valores de lugar continuó de esta manera.",
      "fact_5": "La exposición está llena de números mayas. Mira a tu alrededor: ¿puedes encontrar algo?"
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
    $('body').toggleClass('spanish'); // Toggle the body class

    // Swap images in the help dialogs
    if (language == 'english') {
      var helpImages = ['help-level2.png', 'help-level3.png'];
    } else {
      var helpImages = ['help-level2-spanish.png', 'help-level3-spanish.png'];
    }
    var path = '../assets/images/';
    $('#level-2-help img').attr('src', path + helpImages[0]);
    $('#level-3-help img').attr('src', path + helpImages[1]);

    // Update jQuery UI dialog titles and buttons
    var level = $('body').attr('class').match(/\d+/);
    helpDialogs(level, false); // The "false" keeps autoOpen from happening on the language change

    // @SELENIUM Log message
    console.log(makeTimestamp() + ': Language changed to ' + language);

  });

  // Set initial language to English
  set_lang(dictionary.english);

});
