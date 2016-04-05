
var ClusterTabClass = function( container ) {
    this.selector = container;
}

ClusterTabClass.prototype.drawInterface = function() {
    $(this.selector).append( "<div class='tab-pane panel panel-info withpadding' id='tab_organisation'>" +
        "<h4 class='panel-heading'>Cluster Organisation</h4>" +
        "<p>Cluster's Master's IP<input type='text' class='form-control col-lg-6' id='ipnumber' value='160.85.4.'></p>" +
        "Command<div class='input-group'><input type='text' class='form-control' id='command'>" +
        "<span class='input-group-btn'><button type='button' class='btn btn-default' id='commandbutton'>send command</button></span></div>" +
        "<p><button type='button' class='btn btn-default btn-block' id='deploymentstatebutton'>get state</button></p>" +
        "<p><button type='button' class='btn btn-default btn-block' id='clusterstatebutton'>get Cluster state</button></p>" +
        "<p><button type='button' class='btn btn-default btn-block' id='deleteclusterbutton'>delete this Cluster</button></p>" +
        "</div>" );

}

ClusterTabClass.prototype.isReady = function() {

    /*
     *  button to repeatedly query the deployment's state
     */
    $("#deploymentstatebutton").click( function () {

        if (running == 0) {
            $("#deploymentstatebutton").addClass("btn-danger");
            running = 1;
            refreshId = setInterval(function () {
                $.AjaxRequest({action: 'sshcommand', command: "cat /home/ec2-user/deployment.log", ip: $("#ipnumber").val()});
            }, 1000);
        }
        else {
            $("#deploymentstatebutton").removeClass("btn-danger");
            running = 0;
            clearInterval(refreshId);
        }
    });


    $("#clusterstatebutton").click( function () {

        if (running == 0) {
            $.AjaxRequest({action: 'getclusterstate', token: $("#tokenid").val()});
        };
    });


    $( "#commandbutton" ).click(function() {
        $.AjaxRequest({action: 'sshcommand', command: $("#command").val(), ip: $("#ipnumber").val() })
    });

    $( "#deleteclusterbutton" ).click(function() {
        $.AjaxRequest({action: "deletecluster", ip: $("#ipnumber").val(), token: $("#tokenid").val() });
    });
};
