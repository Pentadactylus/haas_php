
var ServiceTabClass = function( container ) {
    this.selector = container;
}

ServiceTabClass.prototype.drawInterface = function() {
    $(this.selector).append( "        <div class=\"tab-pane panel panel-info withpadding\" id=\"tab_service\">\n            <h4 class=\"panel-heading\">Service</h4>\n            <p>\n                <button type=\"button\" class=\"btn btn-default btn-block\" id=\"servicetypebutton\">service type</button>\n            </p>\n            <p>\n                <button type=\"button\" class=\"btn btn-default btn-block\" id=\"getservicesbutton\">get services</button>\n            </p>\n        </div>\n" );

}

ServiceTabClass.prototype.isReady = function() {
    $( "#servicetypebutton" ).click(function() {
        $.ajax({
            method: "POST",
            url: "so.php",
            data: {action: 'servicetype', token: $("#tokenid").val(), tenant: $("#tenantid").val(), url: 'http://localhost:8888' }
        }).done(function (msg) {
            MyLogger.info(msg);
        }).error(function () {
            MyLogger.error("request failed");
        });
    });


    $( "#getservicesbutton" ).click(function() {
        $.ajax({
            method: "POST",
            url: "so.php",
            data: {action: 'getservices', token: $("#tokenid").val(), tenant: $("#tenantid").val(), url: 'http://localhost:8888', oterm: $("#oterm").val() }
        }).done(function (msg) {
            MyLogger.info(msg);
        }).error(function () {
            MyLogger.error("request failed");
        });
    });
};
