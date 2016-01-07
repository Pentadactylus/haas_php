
var AccessTabClass = function( container ) {
    this.selector = container;
}

AccessTabClass.prototype.drawInterface = function() {
    $(this.selector).append( "<div class=\"tab-pane panel panel-info withpadding\" id=\"tab_access\"><h4 class=\"panel-heading\">Access to the Cluster</h4><p>SSH public key to be inserted (if this field is filled in, following input won't be considered)<input type=\"text\" class=\"form-control\" id=\"sshkey\" placeholder=\"paste your SSH public key here...\"></p><p>and the new key's name:<input type=\"text\" class=\"form-control\" id=\"sshkeyname\" placeholder=\"what's the name?\"></p><p>...or select a registered SSH public key:<br><select id=\"registeredsshkeys\" class=\"selectpicker\"></select></p></div>" );

}

AccessTabClass.prototype.isReady = function() {
    $("#tab_access").click( function () {
        if( publicSSHKeysLoaded==false ) {
            // in the beginning - else, it might get called multiple times if user is clicking here before loading
            publicSSHKeysLoaded = true;

            // remove all the loaded public SSH keys
            $('#registeredsshkeys')
                .find('option')
                .remove();

            $.ajax({
                method: "POST",
                url: "so.php",
                data: {action: 'getsshpublickeys', token: $("#tokenid").val() }
            }).done(function (msg) {
                MyLogger.info(msg);
                var sshKeys = $("#registeredsshkeys");
                json = JSON.parse(msg);
                $.each(json, function(i,item) {
                    sshKeys.append($("<option>").val(item.publickey).text(item.publickey+" ("+item.fingerprint+")"));
                });
                $('.selectpicker').selectpicker('refresh');
            }).error(function () {
                MyLogger.error("request failed");
            });
        }
    });
};
