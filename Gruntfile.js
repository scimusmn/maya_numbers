module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
        kiosk_scripts: {
          files: {
            'build/js/maya_numbers.min.js': [
              'libs/jquery-1.9.0.min.js',
              'libs/jquery.hammer.min.js',
              'libs/jquery-ui-1.10.0.custom.min.js',
              'libs/jquery.ui.touch-punch.min.js',
              'source/js/main.js',
              'source/js/translate.js',
              'source/js/screensaver.js'
            ]
          }
        }
    },
    cssmin: {
      compress: {
        files: {
          'build/css/maya_numbers.min.css': [
            'source/css/main.css',
            'source/css/normalize.min.css',
            'source/css/jquery-ui.min.css',
            'source/css/build.css',
            'source/css/maya.css'
          ]
        }
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // CSSMin plugin
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  // Default task(s).
  grunt.registerTask('default', ['uglify', 'cssmin']);

};
