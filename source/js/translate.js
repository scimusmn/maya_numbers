/*
 * Change the language of text strings on the page.
 * Based on http://stackoverflow.com/a/13427846/1940172
*/
var dictionary, set_lang;

// Object literal behaving as multi-dictionary
dictionary = {
  "english": {
      "glyph_text_1": "Drag the correct glyph from below into the value box. Double-tap a glyph to put it back.",
      "glyph_text_2": "Using the glyphs and the value boxes, generate the number shown. Double-tap a glyph to put it back.",
      "target_1": "Add a glyph to the box that equals this number:",
      "target_2": "Add glyphs to the boxes that add up to this number:",
      "help_link": "Instructions",
      "level": "Level",
      "restart": "Restart game",
      "help_1": "The Maya created a mathematical system for documenting and predicting astronomical phenomena. They had several symbols for zero. Combinations of dots (ones) and bars (fives) represented any value from one to nineteen. And like our place values of tens, hundreds and thousands, the value of larger numbers was determined by each symbol's position.",
      "help_1_a": "Dots indicate values of one.",
      "help_1_b": "Lines indicate values of five.",
      "help_1_c": "A glyph with one dot and one line represents the value six.",
      "help_intro": "Can you match numbers with the corresponding glyphs? Touch the screen to begin.",
      "help_2": "The Maya employed a vertically structured \"base 20\" value system.",
      "help_3": "Now things get a little tougher!",
      "win": "Success! You’ve mastered Maya numbers. Look for them throughout the exhibit.",
      "dialog_btn_1": "Go!",
      "dialog_btn_win": "Play again",
      "alert_correct": "Correct",
      "alert_incorrect": "Incorrect",
      "hint_link": "Hint",
      "hint": "Try dragging a guess into the highest value box. If your guess is too high, try a glyph with a lower value.",
      "zero_hint": "Hint: If one place of the target number is supposed to be zero, you need to add the zero-value glyph to fully solve the problem.",
      "next": "Next question",
      "funfacts": "Fact",
      "fact_1": "The Maya math system is built around the number 20—based on the number of fingers and toes people have.",
      "fact_2": "The Maya were one of only four civilizations to develop the concept of zero.",
      "fact_3": "A place-value system allows the user to write and manipulate really big numbers – like those required to track astronomical phenomena – and to break those numbers down into units such as days, weeks and months.",
      "fact_4": "In the Long Count calendar, the third place value represents quantities of 260, instead of 400, since 260 is closer to the length of the year. As a result, the digit in the fourth place represents quantities of 7,200.",
      "fact_5": "The exhibit is full of Maya numbers. Look around: can you find some?",
      "dialog_btn_ok": "OK"
  },
  "español": {
      "glyph_text_1": "Arrastra el glifo correcto desde abajo hasta la casilla de los valores. Toca el glifo dos veces para devolverlo a su lugar.",
      "glyph_text_2": "Utilizando los glifos y las casillas de valores, genera el número que aparece aquí.",
      "target_1": "Añadir un glifo a la casilla que suman a este número:",
      "target_2": "Agrega glifos a las casillas que suman este número:",
      "help_link": "Instrucciones",
      "level": "Nivel",
      "restart": "Reiniciar juego",
      "help_1": "Los mayas crearon un sistema matemático para documentar y predecir los fenómenos astronómicos. Tenían varios símbolos para el cero y combinaciones de puntos (unos) y barras (cincos) para representar cualquier valor del uno al diecinueve. Y como en nuestros valores posicionales para las decenas, las centenas y los millares, el valor de los números más grandes se determinaba por la posición de cada símbolo.",
      "help_1_a": "Los puntos indican valores de uno.",
      "help_1_b": "Las líneas indican valores de cinco.",
      "help_1_c": "Un glifo con una línea y un punto representa el valor seis.",
      "help_intro": "¿Puedes hacer coincidir los números  con los glifos correspondientes? Toca la pantalla para comenzar.",
      "help_2": "Los mayas utilizaron un sistema de valores, verticalmente estructurado, \"basado en el 20\".",
      "help_3": "¡Ahora las cosas se ponen más difíciles!",
      "win": "¡Lo lograste! Has aprendido cómo funcionan los números mayas. Búscalos por toda la exhibición.",
      "dialog_btn_1": "Comenzar",
      "dialog_btn_win": "Volver a jugar",
      "alert_correct": "Correcto",
      "alert_incorrect": "Incorrecto",
      "hint_link": "Pista",
      "hint": "Pista: Arrastra el número que creas correcto a la casilla de los valores de arriba. Si es muy alto, escoge un glifo de menor valor.",
      "zero_hint": "Pista: Completa todas las casillas de los valores, incluso si tienes que mantener uno de los valores posicionales con un glifo de cero.",
      "next": "Siguiente",
      "funfacts": "Dato",
      "fact_1": "El sistema matemático maya está construido alrededor del número 20. Se basa en el número de dedos de las manos y de los pies que tiene la gente.",
      "fact_2": "La maya es una de las cuatro únicas  civilizaciones que desarrollaron el concepto del cero.",
      "fact_3": "Un sistema de valor posicional le permite a quien lo use, escribir y manipular números realmente grandes – como aquellos que se requieren para registrar fenómenos astronómicos – y descomponer esos números en unidades tales como días, semanas y meses.",
      "fact_4": "En el calendario de Cuenta Larga, el tercer valor posicional representa cantidades de 260, en vez de 400, puesto que 260 es un número más próximo a la duración del año. Como resultado de esto, el dígito en el cuarto lugar representa cantidades de 7200.",
      "fact_5": "En esta exhibición hay montones de números mayas. Mira alrededor: ¿puedes encontrar algunos?",
      "dialog_btn_ok": "Bien"
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

    // Markup changes
    if (language == 'english') {
      // Toggle body class
      $('body').removeClass('spanish');
      // Swap images in the help dialogs
      var helpImages = ['help-level2.gif', 'help-level3.gif'];
    } else {
      // Add a body class for Spanish - this sizes some text down a bit
      $('body').addClass('spanish');
      var helpImages = ['help-level2-spanish.gif', 'help-level3-spanish.gif'];
    }
    var path = '../assets/images/';
    $('#level-2-help img').attr('src', path + helpImages[0]);
    $('#level-3-help img').attr('src', path + helpImages[1]);

    // Update jQuery UI dialog buttons
    var level = $('body').attr('class').match(/\d+/);
    helpDialogs(level, false); // The "false" keeps autoOpen from happening on the language change
    var hintText = $('#btn-aight').text();
    $('#hint').dialog({
      buttons: [{
        text: hintText,
        click: function() {
          $('#hint').dialog('close');
        }
      }]
    });

    // @SELENIUM Log message
    console.log(makeTimestamp() + ': Language changed to ' + language);

  });

  // Set initial language to English
  set_lang(dictionary.english);

});
