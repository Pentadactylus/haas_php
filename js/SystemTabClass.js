
var SystemTabClass = function( container ) {
    this.selector = container;
}

SystemTabClass.prototype.drawInterface = function() {
    $(this.selector).append( "<div class='tab-pane panel panel-info withpadding' id='tab_system'>" +
        "<h4 class='panel-heading'>System preferences</h4>" +
        "<p>what's the cluster's name?<input type='text' class='form-control' id='icclab.haas.cluster.name' placeholder='enter the cluster's name'></p>" +
        "<p>what's the master's name?<input type='text' class='form-control' id='icclab.haas.master.name' placeholder='enter the master's name'></p>" +
        "<p># Masters<input type='text' class='form-control' id='icclab.haas.master.number' placeholder='enter amount of master nodes'></p>" +
        "<p>what's the slave's name?<input type='text' class='form-control' id='icclab.haas.slave.name' placeholder='enter the slave's name'></p>" +
        "<p># Slaves<input type='text' class='form-control' id='icclab.haas.slave.number' placeholder='enter amount of slave nodes'></p>" +
        "<p>should a slave node be started on the master(s) as well?<input type='checkbox' id='icclab.haas.master.slaveonmaster' data-reverse></p>" +
        "<!--<p>Which volume contains the software to be installed?<br>" +
        "<select id='icclab.haas.master.imageid' class='selectpicker'></select></p>-->" +
        "</div>" );

}

var softwareVolumesLoaded = false;

SystemTabClass.prototype.isReady = function() {

    /*
    if( softwareVolumesLoaded==false ) {
        softwareVolumesLoaded = true;
        $("#tab_system_field").click(function () {
            var requestData = {};
            $.each($.compulsoryVariables, function (i, item) {
                var value;
                requestData[item.name] = $("#"+item.name).val();
                if( requestData[item.name]=='' ) {
                    alert('value '+item.name+' not set');
                    throw Exception('value '+item.name+' not set');
                }
            });

            requestData['action'] = 'getvolumes';
            $.AjaxRequest(JSON.stringify(requestData), function (msg) {
                MyLogger.info(msg);
                var softwareVolumes = $("#icclab\\.haas\\.master\\.imageid");
                json = JSON.parse(msg);
                $.RemoveAllOptionsAndAddDefaultOption(softwareVolumes, "select software volume");
                $.each(json, function (i, item) {
                    softwareVolumes.append($("<option>").val(item.id).text(item.volume));
                });
                softwareVolumes.selectpicker('refresh');
            });
        });
    }
    */
};
