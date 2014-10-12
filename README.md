# Stream Line Dispatch

A way to read lines from a stream and dispatch events based off of pattern matching of those strings. Stream Line Dispatch is a stream transform, that does not transform data but analyses the data from a stream and allow for some simple event binding when data comes throught the pipe.

# Install

```
npm install stream-line-dispatch
``` 

# Usage

Example usage.

```javascript
var 
spawn = require( 'child_process' ).spawn,
sld = require( 'stream-line-dispatch' ),
ssh = spawn( 'ssh', [ '-i', '~/.ssh/bar', '-tt', 'root@foo.com' ] ),
transform = sld( {
    output: process.stdout,
    writeOutput
});  

sld.on( '#$', function() { // terminal char aka ready for input
    ssh.stdin.write( 'exit \n' );
});

ssh.stdout.pipe( sld );
```
