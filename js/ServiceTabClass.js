
var ServiceTabClass = function( container ) {
    this.selector = container;
}

ServiceTabClass.prototype.drawInterface = function() {
    $(this.selector).append( "<div class='tab-pane panel panel-info withpadding' id='tab_service'>" +
        "<h4 class='panel-heading'>Service</h4>" +
        "<p><button type='button' class='btn btn-default btn-block' id='servicetypebutton'>service type</button></p>" +
        "<p><button type='button' class='btn btn-default btn-block' id='getservicesbutton'>get services</button></p>" +
        "</div>" );

}

ServiceTabClass.prototype.isReady = function() {
    $( "#servicetypebutton" ).click(function() {
        $.AjaxRequest({action: 'servicetype', token: $("#tokenid").val(), tenant: $("#tenantid").val(), url: 'http://localhost:8888' });
    });


    $( "#getservicesbutton" ).click(function() {
        $.AjaxRequest({action: 'getservices', token: $("#tokenid").val(), tenant: $("#tenantid").val(), url: 'http://localhost:8888', oterm: $("#oterm").val() });
    });
};
