
var ClusterTabClass = function( container ) {
    this.selector = container;
}

ClusterTabClass.prototype.drawInterface = function() {
    $(this.selector).append( "<div class=\"tab-pane panel panel-info withpadding\" id=\"tab_organisation\"><h4 class=\"panel-heading\">Cluster Organisation</h4><p>Cluster's Master's IP<input type=\"text\" class=\"form-control\" id=\"ipnumber\" value=\"160.85.4.\"></p><p>Command<input type=\"text\" class=\"form-control\" id=\"command\"></p><p><button type=\"button\" class=\"btn btn-default btn-block\" id=\"commandbutton\">send command</button></p><p><button type=\"button\" class=\"btn btn-default btn-block\" id=\"deploymentstatebutton\">get state</button></p><p><button type=\"button\" class=\"btn btn-default btn-block\" id=\"clusterstatebutton\">get Cluster state</button></p><p><button type=\"button\" class=\"btn btn-default btn-block\" id=\"deleteclusterbutton\">delete this Cluster</button></p></div></div>" );

}

ClusterTabClass.prototype.isReady = function() {

    $("#deploymentstatebutton").click( function () {

        if (running == 0) {
            $("#command").val("cat /home/ec2-user/deployment.log");
            running = 1;
            refreshId = setInterval(function () {
                $.ajax({
                    method: "POST",
                    url: "system.php",
                    data: {command: $("#command").val(), ip: $("#ipnumber").val()}
                }).done(function (msg) {
                    MyLogger.ownColor(msg, '#333');
                }).error(function () {
                    MyLogger.error("request failed");
                });
            }, 1000);
        }
        else {
            running = 0;
            clearInterval(refreshId);
        }
    });

    $("#clusterstatebutton").click( function () {

        if (running == 0) {
            $.ajax({
                method: "POST",
                url: "so.php",
                data: {action: 'getclusterstate', token: $("#tokenid").val()}
            }).done(function (msg) {
                MyLogger.ownColor(msg, '#333');
            }).error(function () {
                MyLogger.error("request failed");
            });
        };
    });


    $( "#commandbutton" ).click(function() {
        $.ajax({
            method: "POST",
            url: "system.php",
            data: {command: $("#command").val(), ip: $("#ipnumber").val() }
        }).done(function (msg) {
            $("#command").val("");
            MyLogger.ownColor(msg,'#000');
        }).error(function () {
            MyLogger.error("request failed");
        });
    });

    $( "#deleteclusterbutton" ).click(function() {
        $.ajax({
            method: "POST",
            url: "so.php",
            data: {action: "deletecluster", ip: $("#ipnumber").val(), token: $("#tokenid").val() }
        }).done(function (msg) {
            $("#command").val("");
            MyLogger.ownColor(msg,'#000');
        }).error(function () {
            MyLogger.error("request failed");
        });
    });
};
