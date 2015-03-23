module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['Client/*.js'],
        dest: 'Client/build/Production.js',
      },
    },

//    mochaTest: {
 //     test: {
 //       options: {
 //         reporter: 'spec'
 //       },
 //       src: ['test/**/*.js']
 //     }
 //   },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    uglify: {
      build: {
        src: 'Client/build/Production.js',
        dest: 'Client/build/Production.min.js'
      },
    },

    jshint: {
      files: [
        './*.js','./Client/*.js'
      ],
      options: {
        force: 'true',
        jshintrc: '.jshintrc',
        ignores: [
          'Client/lib/**/*.js',
          'Client/build/**/*.js'
        ]
      }
    },

//    cssmin: {
//      minify: {
//        src: './public/style.css',
//        dest: './public/style.min.css'
//      }
//    },

    watch: {
      scripts: {
        files: [
          'Client/**/*.js',
          'Client/lib/**/*.js',
        ],
        tasks: [
          'concat',
          'uglify'
        ]
      },
     // css: {
     //   files: 'public/*.css',
     //   tasks: ['cssmin']
    //  }
    },

    shell: {
      prodServer: {
        command: 'git push azure master',
        options: {
        stdout: true,
        stderr: true,
        failOnError: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  //grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('server-dev', function (target) {
    // Running nodejs in a different process and displaying output on the main console
    var nodemon = grunt.util.spawn({
         cmd: 'grunt',
         grunt: true,
         args: 'nodemon'
    });
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);

    grunt.task.run([ 'watch' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

 /* grunt.registerTask('test', [
    'mochaTest','jshint'
  ]);*/

 grunt.registerTask('test', [
    'jshint'
  ]); 

  grunt.registerTask('build', [
    'concat',
    'uglify'
    //'cssmin'
  ]);

  grunt.registerTask('upload', function(n) {

     if(grunt.option('prod')) {
       grunt.task.run([ 'shell:prodServer' ]);
     } else {
      grunt.task.run([ 'server-dev' ]);
     }
  });

  grunt.registerTask('deploy', [
    'test',
    'build',
    'upload'
  ]);


};
