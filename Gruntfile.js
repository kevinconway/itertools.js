/*jslint node: true, indent: 2, passfail: true */
"use strict";

module.exports = function (grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jslint: {
      all: {
        src: [
          'helper/*',
          'itertools/*.js',
          'itertools/core/*.js',
          'itertools/iterables/*.js'
        ],
        exclude: ['test/*', 'Gruntfile.js'],
        directives: {
          node: true,
          browser: true,
          indent: 2,
          passfail: true
        },
        options: {
          edition: 'latest'
        }
      }
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/*.spec.js']
      }
    },
    browserify: {
      itertools: {
        files: {
          'build/itertools.browser.js': ['itertools/browser.js']
        },
        options: {
          bundleOptions: {
            "standalone": "itertools"
          }
        }
      },
      tests: {
        files: {
          'build/itertools.tests.browser.js': ['test/*.spec.js']
        },
        options: {
          exclude: ["test/file.spec.js", "test/stream.spec.js"]
        }
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        files: {
          'build/itertools.browser.min.js': ['build/itertools.browser.js'],
          'build/itertools.tests.browser.min.js': ['build/itertools.tests.browser.js']
        },
      }
    },
    shell: {
      prepareBrowserTests: {
        command: 'test/install_libs'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-jslint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-shell');

  grunt.registerTask('default', ['jslint', 'mochaTest', 'browserify', 'uglify', 'shell']);

};
