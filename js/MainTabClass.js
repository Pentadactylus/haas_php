
var MainTabClass = function( container ) {
    this.selector = container;
}

MainTabClass.prototype.drawInterface = function() {
    $(this.selector).append( "<div class=\"tab-pane active panel panel-info withpadding\" id=\"tab_main\"><h4 class=\"panel-heading\">Main menu</h4><p><button type=\"button\" class=\"btn btn-default btn-block\" id=\"tokenbutton\">get Token</button></p><p>Token-ID<input type=\"text\" class=\"form-control\" id=\"tokenid\" placeholder=\"enter token ID\"></p></div>" );

}

//var MainTabClassInstance = new MainTabClass( "#navigationContent" );

MainTabClass.prototype.isReady = function() {
    $( "#tokenbutton" ).click(function() {
        $.ajax({
            method: "POST",
            url: "so.php",
            data: {action: 'gettoken' }
        }).done(function (msg) {
            MyLogger.info(msg);
            $("#tokenid").val(msg);
        }).error(function () {
            MyLogger.error("request failed");
        });
    });

}
