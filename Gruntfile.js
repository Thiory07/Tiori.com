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
                'dist/assets/v2/css/*.css',
                'dist/assets/v2/js/*.js',
                'dist/assets/v2/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
              ]
            },
            gruntfile: {
              files: 'Gruntfile.js',
              tasks: ['build'],
            },
            sassV2: {
              files: [
                  'src/assets/v2/sass/**/*.scss',
              ],
              tasks: ['newer:sass'],
            },
            cssv2: {
              files: [
                  'src/assets/v2/css/*.css',
                  'src/assets/v2/css/**/*.css'
              ],
              tasks: ['newer:cssmin'],
            },
            jsv2: {
                files: [
                    'src/assets/v2/js/*.js',
                    'src/assets/v2/js/**/*.js',
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
                    'src/assets/v2/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
                    'src/assets/v2/images/**/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
                    'src/assets/v2/images/**/*.{png,jpg,jpeg,gif,webp,svg}',
                    'src/assets/v2/images/*.{png,jpg,jpeg,gif,webp,svg}'
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
                assets: 'dist/assets/v2',
                plugins: ['permalinks','grunt-assemble-sitemap'],
                partials: ['<%= settings.src %>/templates/includes/**/*.hbs'],
                layoutdir: 'src/templates/layouts/',
                layout: 'alternate-template.hbs',
                data: ['src/data/*.{json,yml}']
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
                    cwd: 'src/assets/v2/sass/pages/',
                    src: ['*.scss'],
                    dest: 'src/assets/v2/css/',
                    ext: '.css'
                }]
            },
            commonV2: {
              files: {
                'src/assets/v2/css/common/main.css': 'src/assets/v2/sass/main.scss'
              }
            }
        },


        //Minify CSS files
        cssmin: {
            mainV2: {
                files: [{
                    expand: true,
                    cwd: 'src/assets/v2/css/',
                    src: ['*.css', '!*.min.css'],
                    dest: 'dist/assets/v2/css/',
                    ext: '.min.css'
                }]
            },
            commonV2: {
                files: [{
                    expand: true,
                    cwd: 'src/assets/v2/css/common/',
                    src: ['*.css', '!*.min.css'],
                    dest: 'dist/assets/v2/css/common/',
                    ext: '.min.css'
                }]
            }
        },

        //Minify images - optimization of files for web
        imagemin: {
            mainV2: {// Another target
                files: [{
                    expand: true, // Enable dynamic expansion
                    cwd: 'src/assets/v2/images/',                // Src matches are relative to this path
                    src: ['**/*.{png,jpg,gif}'],// Actual patterns to match
                    dest: 'dist/assets/v2/images/' // Destination path prefix
                }]
            },

        },

        copy: {
          scripts: {
            files: [{
              expand: true,
              cwd: 'src/assets/v2/js/',
              src: '*.js',
              dest: 'dist/assets/v2/js/'
            }]
          }
        },

        //clean folder - remove old files under production - dist
        clean: [
            "dist/assets/v2/css/",
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
      'watch'
  ]);

  grunt.registerTask('load', [
      'connect:livereload',
      'watch'
  ]);

  grunt.registerTask('build', [
      'assemble',
      //'imagemin',
      'sass',
      'cssmin'
  ]);
};
