module.exports = function(grunt) {
    var webpack = require('webpack');
    var path = require('path');
    var sass = require('node-sass');

    // Store location settings
    // var settings = grunt.file.readJSON('gruntfile.settings.json');

    // Get and store version
    var versionData = grunt.file.readJSON('src/version.json').version,
        version = versionData.major + '.' + versionData.minor + '.' + versionData.patch;

    // Project configuration
    var config = {
        pkg: grunt.file.readJSON('package.json'),
        // settings: settings,
        // Clean folders or files
        clean: {
            build: {
                src: ['./build']
            }
        },

        sass: {
            build: {
                options: {
                    implementation: sass,
                    sourceMap: true
                },
                files: [{
                    cwd: 'src/app/stylesheets',
                    src: '**/*.sass',
                    dest: 'build/css/',
                    expand: true,
                    ext: '.css'
                }]
            }
        },

        copy: {
            build: {
                options: { },
                files: [{
                    cwd: 'node_modules/bootstrap/fonts',
                    src: "*",
                    dest: 'build/fonts/',
                    expand: true
                }, {
                    cwd: 'src/images/',
                    src: '**/*',
                    dest: 'build/images/',
                    expand: true
                }, {
                    cwd: 'src/app/components/',
                    src: '**/*.html',
                    dest: 'build/',
                    expand: true,
                    flatten: true
                }]
            }
        },

        concat: {
            build: {
                files: [{
                    src: [
                        "node_modules/bootstrap/dist/css/bootstrap.min.css"
                    ],
                    dest: 'build/css/extra.css'
                }]
            }
        },

        webpack: {
            build: {
                mode: 'development',
                entry: {
                    'main': './src/main.ts',
                    'vendor': './src/vendor.ts'
                },
                output: {
                    path: __dirname + '/build',
                    publicPath: '/',
                    filename: '[name].bundle.js',
                    chunkFilename: '[id].bundle.js',
                    sourceMapFilename: '[name].bundle.js.map'
                },
                plugins: [
                    // Required for Bootstrap
                    new webpack.ProvidePlugin({
                        $: "jquery",
                        jquery: "jquery",
                        "window.jQuery": "jquery",
                        jQuery: "jquery"
                    })
                ],
                resolve: {
                    extensions: ['.ts', '.js']
                },
                module: {
                    rules: [
                        {
                            loader: "source-map-loader",
                            enforce: "pre"
                        },
                        {
                            test: /\.ts$/,
                            loaders: ['ts-loader', 'angular2-router-loader']
                        },
                    ],
                },
                devServer: {
                    historyApiFallback: true
                },
                watch: false,
                keepalive: false
            }
        },

        watch: {
            options: {
                interrupt: true,
                // livereload: true,
                spawn: true
            },
            sass: {
                files: ['src/**/*.sass'],
                tasks: ['sass'],
            },
            copy: {
                files: ['src/**/*.html'],
                tasks: ['copy'],
            },
            webpack: {
                files: ['src/**/*.ts'],
                tasks: ['webpack'],
                options: {
                    livereload: true
                }
            }
        },

        // Serve stuff while grunt is running
        connect: {
            build: {
                options: {
                    port: 9000,
                    base: 'build',
                    // open: true,
                    keepalive: true
                    // livereload: true
                }
            }
        },

        // Watch tasks concurrently
        concurrent: {
            options: {
                logConcurrentOutput: true
            },
            build: ['watch:sass', 'watch:copy', 'watch:webpack', 'connect']
        },
    };

    return config;
};
