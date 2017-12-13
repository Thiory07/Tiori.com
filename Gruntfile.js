/*
 * Created on 2016-03-10
 * Copyright (c) 2016 Lilian Dias
 * https://github.com/liliansousa
 */

 module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
      //set work directory - config paths
      settings: {
        src: 'src',
        dist: 'dist'
      },
      //wacth the files that the project is using according the paths set
      watch: {
            livereload: {
              options: {
                livereload: '<%= connect.options.livereload %>'
              },
              files: [
                'dist/{,*/}*.html',
                'dist/assets/css/*.css',
                'dist/assets/js/*.js',
                'dist/assets/img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
              ]
            },
            gruntfile: {
              files: 'Gruntfile.js',
              tasks: ['build'],
            },
            sassV2: {
              files: [
                  'src/assets/sass/**/*.scss',
              ],
              tasks: ['newer:sass'],
            },
            cssv2: {
              files: [
                  'src/assets/css/*.css',
                  'src/assets/css/**/*.css'
              ],
              tasks: ['newer:cssmin'],
            },
            jsv2: {
                files: [
                    'src/assets/js/*.js',
                    'src/assets/js/**/*.js',
                ],
                tasks: ['copy:scripts'],
            },
            json: {
              files: [
                  'src/json-editor/json/*.json',
                  'src/json-editor/schema/*.json'
              ],
              tasks: ['copy'],
            },
            templates:{
                files: [
                    'src/templates/includes/**/*.hbs',
                    'src/templates/layouts/*.hbs'
                ],
                tasks: ['assemble'],
            },
            assessmentTemplate:{
                files: [
                    'src/templates/pages/*.hbs',
                    'src/templates/pages/**/*.hbs',
                    'src/templates/pages/{,*/}.hbs'
                ],
                tasks: ['newer:assemble'],
            },
            dataAssemble:{
                files: [
                    'src/data/*.json'
                ],
                tasks: ['assemble'],
            },
            dataLocal:{
                files: [
                    'src/assets/data/*.xml'
                ],
                tasks: ['newer:copy'],
            },
            imagesV2:{
                files: [
                    'src/assets/img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
                    'src/assets/img/**/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
                    'src/assets/img/**/*.{png,jpg,jpeg,gif,webp,svg}',
                    'src/assets/img/*.{png,jpg,jpeg,gif,webp,svg}'
                ],
                tasks: ['newer:imagemin'],
            },
        },

        //create a local connect server connecting on localhost with NodeJS
        connect: {
          options: {
            port: 9000,
            livereload: 5729,
            hostname: 'localhost'
          },
          livereload: {
            options: {
              open: true,
              base:'dist'
            }
          }
        },

        //Template generator assemble.io site for documentation
        assemble: {
            options: {
                flatten: true,
                assets: 'dist/assets',
                plugins: ['permalinks','grunt-assemble-sitemap'],
                partials: ['<%= settings.src %>/templates/includes/**/*.hbs'],
                layoutdir: 'src/templates/layouts/',
                layout: 'template.hbs',
                data: ['src/data/*.{json,yml}'],
                helpers: ['src/helpers/*.js']
            },
            main: {
                files: [
                  {
                      expand: true,
                      cwd: '<%= settings.src %>/templates/pages/',
                      src: ['**/*.hbs'],
                      dest: '<%= settings.dist %>/'
                  }
                ]
            },
        },

        //convert sass files to css - needs to set the path in the task
        sass: {
            pagesV2: {
                files: [{
                    expand: true,
                    cwd: 'src/assets/sass/pages/',
                    src: ['*.scss'],
                    dest: 'src/assets/css/',
                    ext: '.css'
                }]
            },
            commonV2: {
              files: {
                'src/assets/css/common/main.css': 'src/assets/sass/main.scss'
              }
            }
        },


        //Minify CSS files
        cssmin: {
            mainV2: {
                files: [{
                    expand: true,
                    cwd: 'src/assets/css/',
                    src: ['*.css', '!*.min.css'],
                    dest: 'dist/assets/css/',
                    ext: '.min.css'
                }]
            },
            commonV2: {
                files: [{
                    expand: true,
                    cwd: 'src/assets/css/common/',
                    src: ['*.css', '!*.min.css'],
                    dest: 'dist/assets/css/common/',
                    ext: '.min.css'
                }]
            }
        },

        //Minify images - optimization of files for web
        imagemin: {
            mainV2: {// Another target
                files: [{
                    expand: true, // Enable dynamic expansion
                    cwd: 'src/assets/img/',                // Src matches are relative to this path
                    src: ['**/*.{png,jpg,gif}'],// Actual patterns to match
                    dest: 'dist/assets/img/' // Destination path prefix
                }]
            },

        },

        htmlmin: {                                     // Task
          dist: {                                      // Target
            options: {                                 // Target options
              removeComments: true,
              collapseWhitespace: true
            },
            files: [
              {
                  expand: true,
                  cwd: 'dist/',
                  src: ['**/*.html'],
                  dest: 'dist/'
              }]

          }
        },

        copy: {
          scripts: {
            files: [{
              expand: true,
              cwd: 'src/assets/js/',
              src: '*.js',
              dest: 'dist/assets/js/'
            }]
          },
          jsons: {
            files: [{
              expand: true,
              cwd: 'src/data/',
              src: '*.json',
              dest: 'dist/assets/lang/'
            }]
          }
        },
        uglify: {
          scripts: {
            files: {
              'dist/assets/js/main.min.js': ['src/assets/js/*.js'],
            }
          },
        },
        'json-minify': {
          build: {
            files: 'dist/assets/lang/*.json'
          }
        },

        //clean folder - remove old files under production - dist
        clean: [
            "dist/assets/css/",
            "dist/**/*.{html,xml}"
        ]
    });

    //loading tasks from NPM modules installed on this project
    require('load-grunt-tasks')(grunt, {scope: 'devDependencies'});

  // task(s).
  grunt.registerTask('default', [
      'assemble',
      'imagemin',
      'sass',
      'cssmin',
      'copy',
      'connect:livereload',
      'htmlmin',
      'watch'
  ]);

  grunt.registerTask('load', [
      'connect:livereload',
      'watch'
  ]);

  grunt.registerTask('build', [
      'assemble',
      'imagemin',
      'sass',
      'cssmin',
      'copy:jsons',
      'json-minify',
      'uglify',
      'htmlmin'
  ]);
};
