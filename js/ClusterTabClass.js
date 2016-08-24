
var ClusterTabClass = function( container ) {
    this.selector = container;
}

$("#cluster_tab_field").click( function() {
    $.reloadClusterList();
});

ClusterTabClass.prototype.drawInterface = function() {
    $(this.selector).append( "<div class='tab-pane panel panel-info withpadding' id='tab_organisation'>" +
        "<h4 class='panel-heading'>Cluster Organisation</h4>" +
        '<div class="row">' +
        '<div class="col-md-4">last updated: <span id="lastUpdatedTag">N/A</span></div>' +
        '<div class="col-md-4"><button class="btn btn-default" id="clusterReloadButton">reload</button></div>' +
        '</div>' +

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

$.reloadClusterListTime = 60;

$.reloadClusterList = function() {
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
            $("#lastUpdatedTag").text(new Date().toTimeString());
        });
    }
    else {
        console.log("not logged in");
    }
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
        "CREATE_IN_PROGRESS": { reloadTime: 5, backgroundColor: "#fff", panelClass: "panel-info" },
        "UPDATE_IN_PROGRESS": { reloadTime: 5, backgroundColor: "#fff", panelClass: "panel-info" },
        "CREATE_COMPLETE": { reloadTime: 100, backgroundColor: "#fff", panelClass: "panel-success" },
        "CREATE_FAILED": { reloadTime: 600, backgroundColor: "#fff", panelClass: "panel-danger" },
        "default": { reloadTime: 600, backgroundColor: "#fff", panelClass: "panel-warning" }
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
        var curPanelClass = valueSpecificProps["default"].panelClass;
        if( cluster.stack_status ) {
            curReloadTime = valueSpecificProps[cluster.stack_status].reloadTime;
            curBackgroundColor = valueSpecificProps[cluster.stack_status].backgroundColor;
            curPanelClass = valueSpecificProps[cluster.stack_status].panelClass;
        }
        window.setTimeout(function() {
            self.loadContent();
        }, curReloadTime*1000);
        $("#"+self.clusterID+"_link").css("background",curBackgroundColor);
        $("#"+self.clusterID+"_link").attr("class","panel "+curPanelClass);

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
        $('#clusterlist').append('<div href="#" class="panel panel-info" onclick="$.clusterListClick(\''+element.clusterID+'\')" id="'+clusterID+'_link">' +
            '<div class="panel-heading" id="'+clusterID+'_header">' +
            'Distributed Computing Cluster' +
            '</div>' +
            '<div class="panel-body" id="'+clusterID+'_content">' +
            element.item +
            '</div>' +
            '</div>')
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
            $.reloadClusterList();
        }, $.reloadClusterListTime*1000);
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

    $("#clusterReloadButton").click( function() {
        $.reloadClusterList();
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


    $("#deleteclusterbutton").click( function() {
        var currentElement = MyClusterListScheduler.getElement($.displayedCluster );
        var request = $.GetCompulsoryVariables();
        request['action'] = 'deletecluster';
        request['clusterurl'] = currentElement.item;
        $.AjaxRequest(request, function (msg) {
            var result = $.parseJSON(msg);
            console.log(result);
            window.setTimeout($.updateClusterWindow(),1000);
        });
        $('#clusterModal').modal('hide');
    });

    $("#newclusterbutton").click( function() {
        var currentElement = MyClusterListScheduler.getElement($.displayedCluster );
        var props = $.getClusterProperties( currentElement.contentJSONObject);
        var reqVars = $.GetCompulsoryVariables();
        for( var attrname in props ) {
            reqVars[attrname] = props[attrname];
        }
        reqVars['action'] = 'createinstance';
        console.log( reqVars );

        $.AjaxRequest(JSON.stringify(reqVars),function(msg) {
            console.log(msg);
            window.setTimeout($.updateClusterWindow(),1000);
            //bootbox.alert(msg);
        });
    });

    $("#recreateclusterbutton").click( function() {
        var currentElement = MyClusterListScheduler.getElement($.displayedCluster );
        var request = $.GetCompulsoryVariables();
        var props = $.getClusterProperties( currentElement.contentJSONObject);
        var reqVars = $.GetCompulsoryVariables();
        for( var attrname in props ) {
            reqVars[attrname] = props[attrname];
        }
        reqVars['action'] = 'createinstance';
        console.log( reqVars );

        request['action'] = 'deletecluster';
        request['clusterurl'] = currentElement.item;
        $.AjaxRequest(request, function (msg) {
            var result = $.parseJSON(msg);
            console.log(result);

            $.AjaxRequest(JSON.stringify(reqVars),function(msg) {
                console.log(msg);
                window.setTimeout($.updateClusterWindow(),1000);
                //bootbox.alert(msg);
            });
        });
        $('#clusterModal').modal('hide');
    });
};

$.displayedCluster = false;
$.updateClusterWindow = function() {
    var currentElement = MyClusterListScheduler.getElement($.displayedCluster );
    var statusText = "no status text available";
    var statusTextReason = "no detailed status available";
    var masterIP = "N/A";

    if( currentElement!=null &&
        currentElement.contentJSONObject &&
        !jQuery.isEmptyObject( currentElement.contentJSONObject ) ) {
        statusText = currentElement.contentJSONObject.stack_status;
        statusTextReason = currentElement.contentJSONObject.stack_status_reason;
        masterIP = currentElement.contentJSONObject.externalIP;
    }
    $("#clusterstatus").text( statusText );
    $("#clusterstatustext").text( statusTextReason );
    $("#masterip").text( masterIP );

}

$.getClusterProperties = function( propertyObject ) {
    console.log(propertyObject);
    var retVal = new Array();
    $.each( propertyObject, function( key, value ) {
        if( key.startsWith( "icclab.haas.")) {
            console.log(key + ": " + value);
            retVal[key] = value;
        }
    });
    return retVal;
}
