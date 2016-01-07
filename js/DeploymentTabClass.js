
var DeploymentTabClass = function( container ) {
    this.selector = container;
}

DeploymentTabClass.prototype.drawInterface = function() {
    $(this.selector).append( "<div class=\"tab-pane panel panel-info withpadding\" id=\"tab_deployment\"><h4 class=\"panel-heading\">Deployment</h4><p>OTERM<input type=\"text\" class=\"form-control\" id=\"oterm\" placeholder=\"oterm\"></p><p>Tenant name<input type=\"text\" class=\"form-control\" id=\"tenantid\" placeholder=\"enter tenant name\"></p><p>Select a data transfer method within cluster during setup:<br><select id=\"setuptransfer\" class=\"selectpicker\"><option value=\"transferFirstUnpackLater\">transfer compressed files</option><option value=\"transferUnpackedFiles\" selected>transfer extracted files</option></select></p><p><button type=\"button\" class=\"btn btn-default btn-block\" id=\"createinstancebutton\">create instance</button></p></div>" );

}

DeploymentTabClass.prototype.isReady = function() {
    $( "#createinstancebutton" ).click(function() {
        $.ajax({
            method: "POST",
            url: "so.php",
            data: {action: 'createinstance',
                token: $("#tokenid").val(),
                tenant: $("#tenantid").val(),
                url: $.haas.serviceURL,
                oterm: $("#oterm").val(),
                slavecount: $("#slavenumber").val() }
        }).done(function (msg) {
            MyLogger.info(msg);
        }).error(function () {
            MyLogger.error("request failed");
        });
    });

};
