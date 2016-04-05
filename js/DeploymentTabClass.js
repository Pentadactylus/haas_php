
var DeploymentTabClass = function( container ) {
    this.selector = container;
}

DeploymentTabClass.prototype.drawInterface = function() {
    $(this.selector).append( "<div class='tab-pane panel panel-info withpadding' id='tab_deployment'>" +
        "<h4 class='panel-heading'>Deployment</h4>" +
        "<p>OTERM<input type='text' class='form-control' id='oterm' placeholder='oterm'></p>" +
        "<p>Tenant name<input type='text' class='form-control' id='tenantid' placeholder='enter tenant name'></p>" +
        "<p>Select a data transfer method within cluster during setup:<br>" +
        "<select id='icclab.haas.master.transfermethod' class='selectpicker'>" +
        "<option value='transferFirstUnpackLater'>transfer compressed files</option>" +
        "<option value='transferUnpackedFiles' selected>transfer extracted files</option>" +
        "</select></p>" +
        "<p><button type='button' class='btn btn-default btn-block' id='createinstancebutton'>create instance</button></p>" +
        "</div>" );

}

DeploymentTabClass.prototype.isReady = function() {

    $( "#createinstancebutton" ).click(function() {
        var requestString = "";
        $.each($.creationVariables, function (i, item) {
            var value;
            if( item.element!==undefined ) {
                value = $("#"+item.element).val();
            }
            else {
                value = $("#"+item.name.replace(/\./g,"\\\.")).val();
            }
            var defaultValue = (item.defaultValue!==undefined) ? item.defaultValue : [null,''];
            var found = false;
            // .indexOf() doesn't work as
            for( var i=0; i<defaultValue.length; i++ ) {
                if( value===defaultValue[i]) {
                    found = true;
                }
            }
            if( found===false ) {
                requestString += '"'+item.name + '": "' + value + '",';
            }
        });

        alert(requestString);

        var jsonRequest = '{'+requestString+'\
            "action": "createinstance",\
            "token": "'+$("#tokenid").val()+'",\
            "tenant": "'+$("#tenantid").val()+'",\
            "url": "'+$.haas.serviceURL+'",\
            "oterm": "'+$("#oterm").val()+'" }';
        alert(jsonRequest);
        $.AjaxRequest(jsonRequest);
    });

};
