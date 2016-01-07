
var NetworkTabClass = function( container ) {
    this.selector = container;
}

NetworkTabClass.prototype.drawInterface = function() {
    $(this.selector).append( "<div class=\"tab-pane panel panel-info withpadding\" id=\"tab_network\">" +
        "<h4 class=\"panel-heading\">Network</h4>" +
        "<p>Subnet CIDR:<input type=\"text\" class=\"form-control\" id=\"subnetcidr\" placeholder=\"192.168.19.0/24\"></p>" +
        "<p>Gateway IP:<input type=\"text\" class=\"form-control\" id=\"gatewayip\" placeholder=\"192.168.19.1\"></p>" +
        "<p>Allocation pool start:<input type=\"text\" class=\"form-control\" id=\"allocpoolstart\" placeholder=\"192.168.19.2\"></p>" +
        "<p>Allocation pool end:<input type=\"text\" class=\"form-control\" id=\"allocpoolend\" placeholder=\"192.168.19.254\"></p>" +
        "<p>DNS servers:<input type=\"text\" class=\"form-control\" id=\"dnsservers\" placeholder=\"['64.6.64.6','64.6.65.6']\"></p>" +
        "<p>should a floating IP automatically be assigned to the master?<input type=\"checkbox\" id=\"icclab.haas.master.withfloatingip\" data-reverse checked></p>" +
        "<p id=\"floatingipidlist\">Please choose a floating IP from the list:<br><select id=\"icclab.haas.master.attachfloatingipwithid\" class=\"selectpicker\"></select></p>" +
        "</div>" );

}

var floatingIpsLoaded = false;

NetworkTabClass.prototype.isReady = function() {
    $("#tab_network_field").click( function () {
        if( floatingIpsLoaded==false ) {
            // in the beginning - else, it might get called multiple times if user is clicking here before loading
            floatingIpsLoaded = true;

            // then, remove all content of the dropdown box
            $('#osimagemaster')
                .find('option')
                .remove();
            $('#osimageslave')
                .find('option')
                .remove();
            $('#flavormaster')
                .find('option')
                .remove();
            $('#flavorslave')
                .find('option')
                .remove();

            $.ajax({
                method: "POST",
                url: "so.php",
                data: {action: 'getfloatingips', token: $("#tokenid").val() }
            }).done(function (msg) {
                MyLogger.info(msg);
                var floatingIpList = $("#icclab\\.haas\\.master\\.attachfloatingipwithid");
                json = JSON.parse(msg);
                $.each(json, function(i,item) {
                    floatingIpList.append($("<option>").val(item.id).text(item.ip));
                });
                floatingIpList.selectpicker('refresh');
            }).error(function () {
                MyLogger.error("request failed");
            });
        }
    });

    $("#icclab\\.haas\\.master\\.withfloatingip").change(function() {
        var floatingIp = $("#floatingipidlist");
        if(true==$("#icclab\\.haas\\.master\\.withfloatingip").is(":checked")) {
            floatingIp.removeClass("invisible");
        }
        else {
            floatingIp.addClass("invisible");
            var floatingIpList = $("#icclab\\.haas\\.master\\.attachfloatingipwithid");
            floatingIpList.val('');
            floatingIpList.selectpicker('refresh'); // has to be refreshed manually
        }
    });
};
