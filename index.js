var 
Transform = require( 'stream' ).Transform,
util = require( 'util' );

util.inherits( Output, Transform );

function Output ( options ) {
    Transform.call( this, options );
    this._events = {};
}

Output.prototype.when = function( pattern, fn ) { // make simple event binder
    if ( this._events[ pattern ] ) {
        this._events[ pattern ].push( fn );
        return;
    }

    this._events[ pattern ] = [ fn ];
};


module.exports = function( opts ){

    var 
    _output = new Output( opts.transformOptions ),
    login = new RegExp( '#$' );

    _output._transform = streamTransform;

    function dispatch ( line ) {

        function dispatchToHandle ( fn ) {
            fn( line );
        }

        for ( var key in _output._events ) {
            var pattern = new RegExp( key );
            if ( pattern.test( line ) ) {
                _output._events[ key ].forEach( dispatchToHandle );
            }
        }
    }

    function streamTransform( chunk, enc, done ) {

        var lines = chunk.toString( 'utf8' ).trim().split( /(\r?\n)/g );

        function eachLine( line ) {
            var _line = line.trim();
            
            if ( opts.sendOutput && opts.output ) {
                opts.output.write( _line + '\n\r' );
            }

            dispatch( _line );
        }

        lines.forEach( eachLine );

        // let stream continue
        this.push( chunk );
        done();
    }

    return _output;
};