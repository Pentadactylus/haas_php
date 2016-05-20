
var AccessTabClass = function( container ) {
    this.selector = container;
}

AccessTabClass.prototype.drawInterface = function() {
    $(this.selector).append( "<div class='tab-pane panel panel-info withpadding' id='tab_access'>" +
        "<h4 class='panel-heading'>Access to the Cluster</h4>" +
        "<!--<p>SSH public key to be inserted (if this field is filled in, following input won't be considered)" +
        "<input type='text' class='form-control' id='icclab.haas.master.publickey' placeholder='paste your SSH public key here...'></p>" +
        "<p>and the new key's name:<input type='text' class='form-control' id='sshkeyname' placeholder='key name...'></p>-->" +
        "<p>...or select a registered SSH public key:<br>" +
        "<select id='icclab.haas.master.sshkeyname' class='selectpicker'></select></p></div>" );

}

AccessTabClass.prototype.isReady = function() {
    $("#tab_access_field").click( function () {
        if( publicSSHKeysLoaded==false ) {
            // in the beginning - else, it might get called multiple times if user is clicking here before loading
            publicSSHKeysLoaded = true;

            var requestData = $.GetCompulsoryVariables();

            requestData['action'] = 'getsshpublickeys';
            $.AjaxRequest(JSON.stringify(requestData),function (msg) {
                MyLogger.info(msg);
                var sshKeys = $("#icclab\\.haas\\.master\\.sshkeyname");
                json = JSON.parse(msg);
                $.RemoveAllOptionsAndAddDefaultOption(sshKeys,"registered SSH public keys");
                $.each(json, function (i, item) {
                    sshKeys.append($("<option>").val(item.publickey).text(item.publickey + " (" + item.fingerprint + ")"));
                });
                sshKeys.selectpicker('refresh');
            });
        }
    });
};
