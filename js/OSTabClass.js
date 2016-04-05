
var OSTabClass = function( container ) {
    this.selector = container;
}

OSTabClass.prototype.drawInterface = function() {
    $(this.selector).append( "<div class='tab-pane panel panel-info withpadding' id='tab_os'>" +
        "<h4 class='panel-heading'>OS settings</h4>" +
        "<p>Select an Image for the Master(s):<br>" +
        "<select id='icclab.haas.master.image' class='selectpicker'></select></p>" +
        "<p>...and a flavor as well:<br>" +
        "<select id='icclab.haas.master.flavor' class='selectpicker'></select></p>" +
        "<p>Select an Image for the Slave(s):<br><select id='icclab.haas.slave.image' class='selectpicker'></select></p>" +
        "<p>...plus a flavor:<br><select id='icclab.haas.slave.flavor' class='selectpicker'></select></p>" +
        "<p>What's the existing username?<input type='text' class='form-control' id='icclab.haas.cluster.username' placeholder='ec2-user'></p>" +
        "<p>what's the user's group name?<input type='text' class='form-control' id='icclab.haas.cluster.usergroup' placeholder='ec2-user'></p>" +
        "<p>what's the user's home directory?<input type='text' class='form-control' id='icclab.haas.cluster.homedir' placeholder='/home/ec2-user'></p>" +
        "</div>" );

}

var imagesLoaded = false;


OSTabClass.prototype.isReady = function() {
    if(imagesLoaded==false) {
        imagesLoaded = true;

        $("#tab_os_field").click(function () {

            $.AjaxRequest({action: 'getimages', token: $("#tokenid").val()}, function (msg) {
                MyLogger.info(msg);
                var imageMaster = $("#icclab\\.haas\\.master\\.image");
                var imageSlave = $("#icclab\\.haas\\.slave\\.image");
                json = JSON.parse(msg);
                $.RemoveAllOptionsAndAddDefaultOption(imageMaster, "select Master image");
                $.RemoveAllOptionsAndAddDefaultOption(imageSlave, "select Slave image");
                $.each(json, function (i, item) {
                    imageMaster.append($("<option>").val(item.id).text(item.image));
                    imageSlave.append($("<option>").val(item.id).text(item.image));
                });
                imageMaster.selectpicker('refresh');
                imageSlave.selectpicker('refresh');
            });

            $.AjaxRequest({action: 'getflavors', token: $("#tokenid").val()}, function (msg) {
                MyLogger.info(msg);
                var flavourMaster = $("#icclab\\.haas\\.master\\.flavor");
                var flavourSlave = $("#icclab\\.haas\\.slave\\.flavor");
                json = JSON.parse(msg);
                $.RemoveAllOptionsAndAddDefaultOption(flavourMaster, "select Master flavour");
                $.RemoveAllOptionsAndAddDefaultOption(flavourSlave, "select Slave flavour");
                $.each(json, function (i, item) {
                    flavourMaster.append($("<option>").val(item.id).text(item.name + " (" + item.memory + "MB RAM, " + item.vcpu + " VCPU, " + item.disk + "GB Disk)"));
                    flavourSlave.append($("<option>").val(item.id).text(item.name + " (" + item.memory + "MB RAM, " + item.vcpu + " VCPU, " + item.disk + "GB Disk)"));
                });
                $('#flavormaster').selectpicker('refresh');
                $('#flavorslave').selectpicker('refresh');
            });
        });
    }
};

