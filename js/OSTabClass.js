
var OSTabClass = function( container ) {
    this.selector = container;
}

OSTabClass.prototype.drawInterface = function() {
    $(this.selector).append( "<div class=\"tab-pane panel panel-info withpadding\" id=\"tab_os\"><h4 class=\"panel-heading\">OS settings</h4><p><button type=\"button\" class=\"btn btn-default btn-block\" id=\"imagebutton\">get OS Images</button></p><p>Select an Image for the Master(s):<br><select id=\"osimagemaster\" class=\"selectpicker\"></select></p><p>...and a flavor as well:<br><select id=\"flavormaster\" class=\"selectpicker\"></select></p><p>Select an Image for the Slave(s):<br><select id=\"osimageslave\" class=\"selectpicker\"></select></p><p>...plus a flavor:<br><select id=\"flavorslave\" class=\"selectpicker\"></select></p><p>What's the existing username?<input type=\"text\" class=\"form-control\" id=\"username\" placeholder=\"ec2-user\"></p><p>what's the user's group name?<input type=\"text\" class=\"form-control\" id=\"groupname\" placeholder=\"ec2-user\"></p><p>what's the user's home directory?<input type=\"text\" class=\"form-control\" id=\"homedir\" placeholder=\"/home/ec2-user\"></p></div>\n" );

}

var imagesLoaded = false;


OSTabClass.prototype.isReady = function() {

    $( "#imagebutton" ).click(function() {
        $('#osimagemaster')
            .find('option')
            .remove();
        $('#osimageslave')
            .find('option')
            .remove();

        $.ajax({
            method: "POST",
            url: "so.php",
            data: {action: 'getimages', token: $("#tokenid").val() }
        }).done(function (msg) {
            MyLogger.info(msg);
            var imageMaster = $("#osimagemaster");
            var imageSlave = $("#osimageslave");
            json = JSON.parse(msg);
            $.each(json, function(i,item) {
                imageMaster.append($("<option>").val(item.id).text(item.image));
                imageSlave.append($("<option>").val(item.id).text(item.image));
            });
            $('.selectpicker').selectpicker('refresh');
        }).error(function () {
            MyLogger.error("request failed");
        });
    });

    $(function(){
        $("#tab_os_field").click( function () {
            if( imagesLoaded==false ) {
                // in the beginning - else, it might get called multiple times if user is clicking here before loading
                imagesLoaded = true;

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
                    data: {action: 'getimages', token: $("#tokenid").val() }
                }).done(function (msg) {
                    MyLogger.info(msg);
                    var imageMaster = $("#osimagemaster");
                    var imageSlave = $("#osimageslave");
                    json = JSON.parse(msg);
                    $.each(json, function(i,item) {
                        imageMaster.append($("<option>").val(item.id).text(item.image));
                        imageSlave.append($("<option>").val(item.id).text(item.image));
                    });
                    $('#osimagemaster').selectpicker('refresh');
                    $('#osimageslave').selectpicker('refresh');
                }).error(function () {
                    MyLogger.error("request failed");
                });

                $.ajax({
                    method: "POST",
                    url: "so.php",
                    data: {action: 'getflavors', token: $("#tokenid").val() }
                }).done(function (msg) {
                    MyLogger.info(msg);
                    var flavorMaster = $("#flavormaster");
                    var flavorSlave = $("#flavorslave");
                    json = JSON.parse(msg);
                    $.each(json, function(i,item) {
                        flavorMaster.append($("<option>").val(item.id).text(item.name+" ("+item.memory+"MB RAM, "+item.vcpu+" VCPU, "+item.disk+"GB Disk)"));
                        flavorSlave.append($("<option>").val(item.id).text(item.name+" ("+item.memory+"MB RAM, "+item.vcpu+" VCPU, "+item.disk+"GB Disk)"));
                    });
                    $('#flavormaster').selectpicker('refresh');
                    $('#flavorslave').selectpicker('refresh');
                }).error(function () {
                    MyLogger.error("request failed");
                });
            }
        });
    });
};


