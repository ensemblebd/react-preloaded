var console = require('console');
var sys = { 'puts': console.log, 'debug': console.error };
var exec = require('child_process').exec;
var os = require('os');

function puts(error, stdout, stderr) { sys.puts(stdout) }

// Run command depending on the OS
if (os.type() === 'Linux') 
   exec("npm run build-linux", puts); 
else if (os.type() === 'Darwin') 
   exec("npm run build-mac", puts); 
else if (os.type() === 'Windows_NT') 
   exec("npm run build-windows", puts);
else
   throw new Error("Unsupported OS found: " + os.type());
