var LogMessage = function( message, loglevel, logcolor ) {
    this.message = message;
    this.loglevel = loglevel;
    this.logtime = new Date();
    this.logcolor = logcolor;
}

var Logger = function() {
    this.logMessages = new Array();
    this.levelColors = ["#777","#55f","#ccf","#007","#fc5","#f22","#f00","#000"];
}

Logger.prototype.log = function( message, loglevel, logcolor ) {
    this.logMessages[this.logMessages.length] = new LogMessage( message, loglevel, logcolor );

    var logText = "";

    for( var i=0; i<this.logMessages.length; i++ ) {
        var logColor = (this.logMessages[i].loglevel<=Logger.OFF) ? this.levelColors[this.logMessages[i].loglevel] : this.logMessages[i].logcolor;
        logText += "<span style='color: "+logColor+"'><b>"+this.logMessages[i].logtime.toLocaleTimeString()+"</b>: "+this.logMessages[i].message+"</span>\n";
    }

    var textarea = $("#masterlog");
    textarea.html(logText);
    textarea.scrollTop = textarea.scrollHeight;
}

Logger.prototype.all = function( message ) {
    this.log( message, Logger.ALL );
}

Logger.prototype.trace = function( message ) {
    this.log( message, Logger.TRACE );
}

Logger.prototype.debug = function( message ) {
    this.log( message, Logger.DEBUG );
}

Logger.prototype.info = function( message ) {
    this.log( message, Logger.INFO );
}

Logger.prototype.warn = function( message ) {
    this.log( message, Logger.WARN );
}

Logger.prototype.error = function( message ) {
    this.log( message, Logger.ERROR );
}

Logger.prototype.fatal = function( message ) {
    this.log( message, Logger.FATAL );
}

Logger.prototype.ownColor = function( message, color ) {
    this.log( message, Logger.CUSTOM, color );
}

/*
 * log levels taken from log4js except for Logger.CUSTOM
 */
Logger.ALL = 0;
Logger.TRACE = 1;
Logger.DEBUG = 2;
Logger.INFO = 3;
Logger.WARN = 4;
Logger.ERROR = 5;
Logger.FATAL = 6;
Logger.OFF = 7;
Logger.CUSTOM = 8;

MyLogger = new Logger();