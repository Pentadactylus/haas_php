
var OSTabClass = function( container ) {
    this.selector = container;
}

OSTabClass.prototype.drawInterface = function() {
    $(this.selector).append( "<div class=\"tab-pane panel panel-info withpadding\" id=\"tab_os\"><h4 class=\"panel-heading\">OS settings</h4><p><button type=\"button\" class=\"btn btn-default btn-block\" id=\"imagebutton\">get OS Images</button></p><p>Select an Image for the Master(s):<br><select id=\"osimagemaster\" class=\"selectpicker\"></select></p><p>Select an Image for the Slave(s):<br><select id=\"osimageslave\" class=\"selectpicker\"></select></p></div>\n" );

}

$(function(){
    var navMain = $("#tab_os_field");
    navMain.click( function () {
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
        }
    });
});