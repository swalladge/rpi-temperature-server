module.exports = function(grunt) {

  delete process.env._JAVA_OPTIONS;

  grunt.initConfig({
    htmllint: {
      all: {
        src: ['webapp/*.html'],
        options: {
          ignore: /Section lacks heading./
        }
      }
    },
    jshint: {
      all: {
        src: ['Gruntfile.js', 'webapp/js/**/*.js', 'tests/*.js']
      }
    },
    csslint: {
      all: {
        src: ['webapp/css/**/*.css']
      }
    },
    bootlint: {
      options: {
        stoponerror: false,
        relaxerror: []
      },
      files: ['webapp/*.html']
    }
  });

  grunt.loadNpmTasks('grunt-html');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-bootlint');

  grunt.registerTask('default', ['htmllint', 'jshint', 'csslint', 'bootlint']);

};
