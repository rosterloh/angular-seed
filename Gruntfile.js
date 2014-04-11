'use strict';

module.exports = function(grunt) {
	require('time-grunt')(grunt);

	// Project Configuration
    grunt.initConfig({
    	// get the configuration info from package.json ----------------------------
    	// this way we can use things like name and version (pkg.name)
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            js: {
                files: ['Gruntfile.js', 'server.js', 'index.js', 'requestHandlers.js', 'route.js', 'public/js/**'],
                tasks: ['jshint', 'uglify'],
                options: {
                    livereload: true
                }
            },
            html: {
                files: ['public/views/**'],
                options: {
                    livereload: true
                }
            },
            css: {
                files: ['public/css/**'],
                tasks: ['csslint', 'cssmin'],
                options: {
                    livereload: true
                }
            }
        },
        jshint: {
        	options: {
            	jshintrc: true,
                reporter: require('jshint-stylish') // use jshint-stylish to make our errors look and read good
            },
            build: ['Gruntfile.js', 'server.js', 'index.js', 'requestHandlers.js', 'route.js', 'public/js/**']
        },
        // configure uglify to minify js files -------------------------------------
        uglify: {
            options: {
            	banner: '/*\n <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n*/\n',
            	mangle: false,
            	compress: true,
            	report: 'gzip'
            },
            build: {
                files: {
                    'public/build/app.min.js': [
                        'public/lib/angular/angular.js',
                        'public/lib/angular-ui-router/release/angular-ui-router.js',
						'public/lib/angular-bootstrap/ui-bootstrap.js',
						'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
						'public/js/**/*.js'
                    ]
                }
            }
        },
        csslint: {
            options: {
                csslintrc: '.csslintrc'
            },
            all: {
                src: ['public/css/**/*.css']
            }
        },
        cssmin: {
            combine: {
                options: {
                    report: 'gzip'
                },
                files: {
                    'public/build/app.min.css': [
                        'public/lib/bootstrap/dist/css/bootstrap.css',
						'public/**/*.css'
                    ]
                }
            }
        },
        nodemon: {
            dev: {
                script: 'index.js',
                options: {
                    args: [],
                    ignore: ['public/**'],
                    ext: 'js,html',
                    nodeArgs: ['--debug'],
                    delayTime: 1,
                    env: {
                        PORT: 3000
                    },
                    cwd: __dirname
                }
            }
        },
        concurrent: {
            tasks: ['nodemon', 'watch'],
            options: {
                logConcurrentOutput: true
            }
        }
    });

    //Load NPM tasks
    require('load-grunt-tasks')(grunt);

    //Making grunt default to force in order not to break the project.
    grunt.option('force', true);

    grunt.registerTask('default', ['jshint', 'csslint', 'cssmin', 'uglify', 'concurrent']);
};