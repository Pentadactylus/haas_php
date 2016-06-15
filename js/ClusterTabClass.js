
var ClusterTabClass = function( container ) {
    this.selector = container;
}

ClusterTabClass.prototype.drawInterface = function() {
    $(this.selector).append( "<div class='tab-pane panel panel-info withpadding' id='tab_organisation'>" +
        "<h4 class='panel-heading'>Cluster Organisation</h4>" +

        '<div class="list-group" id="clusterlist"></div>'+
        "</div>" +

    '<div id="clusterModal" class="modal fade" role="dialog">\
        <div class="modal-dialog">\
\
    <div class="modal-content">\
        <div class="modal-header">\
        <button type="button" class="close" data-dismiss="modal">&times;</button>\
    <h4 class="modal-title">Cluster x</h4>\
    </div>\
    <div class="modal-body">\
        <p><span style="font-weight: bold; ">State:</span> <span id="clusterstatus"></span></p>\
        <p><span style="font-weight: bold; ">Status text:</span> <span id="clusterstatustext"></span></p>\
        <p><span style="font-weight: bold; ">IP address:</span> <span id="masterip"></span></p>\
        <button type="button" class="btn btn-info" id="recreateclusterbutton">Re-create same cluster</button>\
    <button type="button" class="btn btn-success" id="newclusterbutton">New cluster with same specifics</button>\
    <button type="button" class="btn btn-danger" id="deleteclusterbutton">Delete cluster</button>\
    </div>\
    <div class="modal-footer">\
        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\
        </div>\
        </div>\
\
        </div>\
        </div>'


    );

}

var ClusterListItemSchedulingElement = function( item, intervalRate ) {
    this.intervalRate = intervalRate;
    this.currentValue = intervalRate;
    this.item = item;
    this.loaded = false;
    this.clusterID = false;
    this.contentJSONObject = false;
}

ClusterListItemSchedulingElement.prototype.getIntervalRate = function() {
    return 60;
}

ClusterListItemSchedulingElement.prototype.loadContent = function() {
    var valueSpecificProps = {
        "CREATE_IN_PROGRESS": { reloadTime: 5, backgroundColor: "#ccccff" },
        "UPDATE_IN_PROGRESS": { reloadTime: 5, backgroundColor: "#ccccff" },
        "CREATE_COMPLETE": { reloadTime: 20, backgroundColor: "#aaffaa" },
        "CREATE_FAILED": { reloadTime: 60, backgroundColor: "#ffcccc" },
        "default": { reloadTime: 60, backgroundColor: "#eeeeee" }
    };

    var request = $.GetCompulsoryVariables();
    request['action'] = 'getclusterinfo';
    request['clusterurl'] = this.item;

    var self = this;

    $.AjaxRequest(request, function (msg) {
        cluster = $.parseJSON(msg);
        self.contentJSONObject = cluster;
        self.loaded = true;
        var curReloadTime = valueSpecificProps["default"].reloadTime;
        var curBackgroundColor = valueSpecificProps["default"].backgroundColor;
        if( cluster.stack_status ) {
            curReloadTime = valueSpecificProps[cluster.stack_status].reloadTime;
            curBackgroundColor = valueSpecificProps[cluster.stack_status].backgroundColor;
        }
        window.setTimeout(function() {
            self.loadContent();
        }, curReloadTime);
        $("#"+self.clusterID+"_link").css("background",curBackgroundColor);

        if($.displayedCluster==self.clusterID) {
            $.updateClusterWindow();
        }
        console.log(cluster.stack_status);
        //console.log(cluster);
    });
}

/*
 * this is the default implementation of equals - it can be more complex in the
 * inherited classes
 */
ClusterListItemSchedulingElement.prototype.equals = function( element ) {
    if( element.item==this.item ) {
        return true;
    }
    return false;
}

var ClusterListScheduler = function() {
    this.elements = new Array();
    this.action = "test";
}

ClusterListScheduler.prototype.containsElement = function( element ) {
    for( var i=0; i<this.elements.length; i++ ) {
        if( this.elements[i].equals( element ) ) {
            return true;
        }
    }
    return false;
}

/*
 *  adds a given element to the scheduled queue
 *  return  true    element has been successfully added
 *  return  false   element was already within the queue so no addition
 */
ClusterListScheduler.prototype.addElement = function( element ) {
    var inserted = false;
    if( !this.containsElement( element ) ) {
        element.loadContent();
        this.elements.push( element );
        inserted = true;
    }

    if( inserted ) {
        var clusterID = element.item.replace(/.*haas\/(.*)/g,"$1");
        element.clusterID = clusterID;
        console.log("clusterid = "+clusterID );
        $('#clusterlist').append('<a href="#" class="list-group-item" onclick="$.clusterListClick(\''+element.clusterID+'\')" id="'+clusterID+'_link">' +
            '<h4 class="list-group-item-heading" id="'+clusterID+'_header">' +
            'Distributed Computing Cluster' +
            '</h4>' +
            '<p class="list-group-item-text" id="'+clusterID+'_content">' +
            element.item +
            '</p>' +
            '</a>')
    }

    return inserted;
}

ClusterListScheduler.prototype.getElement = function( elementID ) {
    for( var i=0; i<this.elements.length; i++ ) {
        if( this.elements[i].clusterID==elementID ) {
            return this.elements[i];
        }
    }
    return null;
}

MyClusterListScheduler = new ClusterListScheduler();

$.ManageClusterList = function() {
    if( true ) {
        window.setInterval(function () {
            if ($.loggedin == true) {
                var request = $.GetCompulsoryVariables();
                request['action'] = 'getinstances';
                $.AjaxRequest(request, function (msg) {
                    var currentClusters = new Array();
                    clusters = $.parseJSON(msg)[0];
                    console.log(clusters);
                    for (var i = 0; i < clusters.length; i++) {
                        currentClusters.push(clusters[i]);
                        MyClusterListScheduler.addElement(new ClusterListItemSchedulingElement(clusters[i], 10));
                    }
                    for (var i=0; i < MyClusterListScheduler.elements.length; i++ ) {
                        if( currentClusters.indexOf(MyClusterListScheduler.elements[i].item)==-1 ) {
                            $("#"+MyClusterListScheduler.elements[i].clusterID+"_link").css("display","none");
                        }
                    }

                });
            }
            else {
                console.log("not logged in");
            }
        }, 5000);
    }
}

$.ManageClusterList();

ClusterTabClass.prototype.isReady = function() {

    /*
     *  button to repeatedly query the deployment's state
     */
    $("#deploymentstatebutton").click( function () {

        if (running == 0) {
            $("#deploymentstatebutton").addClass("btn-danger");
            running = 1;
            refreshId = setInterval(function () {
                $.AjaxRequest({action: 'sshcommand', command: "cat /home/ubuntu/deployment.log", ip: $("#ipnumber").val()});
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

    $.clusterListClick = function( clusterID ) {

        $.displayedCluster = clusterID;
        $.updateClusterWindow();
        //console.log( currentElement );

        $('#clusterModal').modal('show');
    }

};

$.displayedCluster = false;
$.updateClusterWindow = function() {
    var currentElement = MyClusterListScheduler.getElement($.displayedCluster );
    var statusText = "no status text available";
    var statusTextReason = "no detailed status available";
    var masterIP = "N/A";

    if( currentElement.contentJSONObject &&
        !jQuery.isEmptyObject( currentElement.contentJSONObject ) ) {
        statusText = currentElement.contentJSONObject.stack_status;
        statusTextReason = currentElement.contentJSONObject.stack_status_reason;
        masterIP = currentElement.contentJSONObject.externalIP;
    }
    $("#clusterstatus").text( statusText );
    $("#clusterstatustext").text( statusTextReason );
    $("#masterip").text( masterIP );

    $("#deleteclusterbutton").click( function() {
        var request = $.GetCompulsoryVariables();
        request['action'] = 'deletecluster';
        request['clusterurl'] = currentElement.item;
        $.AjaxRequest(request, function (msg) {
            var result = $.parseJSON(msg);
            console.log(result);
        });
        $('#clusterModal').modal('hide');
    });
    $("#newclusterbutton").click( function() {

    });
    $("#recreateclusterbutton").click( function() {

    });
}
