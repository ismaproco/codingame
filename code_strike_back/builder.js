var watch = require('node-watch');
var concat = require('concat-files');
var exec = require('child_process').exec;

watch('.', function(filename) {
    
    if(filename != 'coders_strike_back.js') {
        console.log((new Date().toISOString()) + ' file changed ' + filename);
        concat([
            './vec2.js',
            './util.js',
            './loop.js',
        ],'./coders_strike_back.js', function() {
            console.log( (new Date().toISOString()) + ' created coders_strike_back.js');
            exec('jshint ./coders_strike_back.js', function(error, stdout, stderr) {
              // command output is in stdout
              console.log( stdout);
            });
        });    
    }
});