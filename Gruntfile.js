/* jshint node : true */
module.exports = function(grunt) {
  "use strict";
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    sass: {
      dist: {
        options: {
          style: 'compressed',
          noCache: true
        },
        files: [{
          expand: true,
          cwd: 'public/css/sass',
          src: ['*.scss', '!_*.scss'],
          dest: 'public/css',
          ext: '.css'
        }]
      }
    },

    jshint: {
      options: {
        force: true
      },
      gruntfile: 'Gruntfile.js',
      cache: ['ops/*.js'],
      js: ['app.js', 'public/js/*.js', 'lib/routes/*.js'],
      routes: 'lib/routes/*.js'
    },

    uglify: {
      options: {
        compress: true,
        mangle: true,
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd") %> */'
      },
      build: {
        // This is where all to-be compiled javascript files are recorded.
        // First comes the path to the javascript file itself, followed by the list of source javascript files that need
        // to be compiled for that one to work.
        // In development, you can act as though those dependencies exist in your scripts, without explicitly including them.
        //
        // For example, if you don't use the searchbar in your index page, there's no reason to include typeahead and hogan there.
        // However, if you used it on every page, it'd make sense to add those dependencies to the base.
        files: {
          'public/js/min/base.min.js': ['public/js/lib/jquery-1.9.1.min.js', 'public/js/lib/underscore-min.js', 'public/js/base.js'],
          'public/js/min/index.min.js': ['public/js/airports.js', 'public/js/lib/hogan-2.0.0.js', 'public/js/index.js', 'public/js/filters.js']
        }
      }
    },

    watch: {
      gruntfile: {
        files: 'Gruntfile.js',
        tasks: ['jshint:gruntfile']
      },
      js: {
        files: 'public/js/*.js',
        tasks: ['jshint', 'uglify']
      },
      sass: {
        files: ['public/css/sass/*.scss'],
        tasks: ['sass']
      }
    },

    nodemon: {
      prod: {
        options: {
          file: 'app.js',
          ignoredFiles: ['README.md', 'node_modules/**', 'public/js/min/**'],
          watchedExtensions: ['js'],
          debug: false
        }
      }
    },

    concurrent: {
      target: {
        tasks: ['nodemon', 'watch'],
        options: {
          logConcurrentOutput: true
        }
      }
    }
  });
  // Load grunt tasks
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-concurrent');
  // Register grunt tasks
  grunt.registerTask('default', ['jshint', '']);
  grunt.registerTask('quality', ['jshint']);
  grunt.registerTask('style', ['sass']);
  grunt.registerTask('start', ['concurrent']);
};