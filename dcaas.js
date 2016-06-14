
// activate special checkbox rendering for the already existing checkboxes
$(':checkbox').checkboxpicker();

// these are the entries in the left navigation which are created dynamically
$.navigationEntries = [
    {"href":"tab_main", "active" : "1", "id": "tab_main_field", "value" : "User data", "class" : "MainTabClass" },
    //{"href":"tab_service", "value" : "Service", "id": "tab_service_field", "class" : "ServiceTabClass" },
    {"href":"tab_system", "value" : "System", "id": "tab_system_field", "class" : "SystemTabClass" },
    {"href":"tab_network", "value" : "Network", "id" : "tab_network_field", "class" : "NetworkTabClass" },
    {"href":"tab_os", "value" : "OS", "id" : "tab_os_field", "class" : "OSTabClass" },
    {"href":"tab_access", "value" : "Access", "id": "tab_access_field", "class" : "AccessTabClass" },
    {"href":"tab_distrproc", "value" : "Distributed Processing", "id": "tab_distrproc_field", "class" : "DistrProcTabClass" },
    {"href":"tab_deployment", "value" : "Deployment", "id": "tab_deployment_field", "class" : "DeploymentTabClass" },
    {"href":"tab_organisation", "value" : "Cluster Organisation", "id": "tab_organisation_field", "class" : "ClusterTabClass" }
];

// The following variables will be transmitted at cluster creation. Before
// transmitting, they will be checked against the default value. Unless they
// have been changed to an alternate value, they won't be included in the
// values that are transmitted.
// Following values are possible in the dictionary:
//      - name: manadory; if no "element" is given, this will be taken as ID
//      - element: if a different ID has been given to the element, you can
//                 note it here
//      - defaultValue: the default value(s) of the specified field; this has
//                      to be an array with the values listed in it
$.creationVariables = [
    {"name": "tenant"},
    {"name": "username"},
    {"name": "password"},
    {"name": "region"},
    {"name": "token"},
    {"name": "icclab.haas.cluster.name"},
    {"name": "icclab.haas.master.image"},
    {"name": "icclab.haas.slave.image"},
    {"name": "icclab.haas.master.sshkeyname"},
    {"name": "icclab.haas.master.publickey"},
    {"name": "icclab.haas.master.flavor"},
    {"name": "icclab.haas.slave.flavor"},
    {"name": "icclab.haas.master.number"},
    {"name": "icclab.haas.slave.number"},
    {"name": "icclab.haas.master.slaveonmaster"},
    {"name": "icclab.haas.master.withfloatingip"},
    {"name": "icclab.haas.master.attachfloatingipwithid"},
    {"name": "icclab.haas.master.name"},
    {"name": "icclab.haas.slave.name"},
    {"name": "icclab.haas.network.subnet.cidr"},
    {"name": "icclab.haas.network.gw.ip"},
    {"name": "icclab.haas.network.subnet.allocpool.start"},
    {"name": "icclab.haas.network.subnet.allocpool.end"},
    {"name": "icclab.haas.network.dnsservers"},
    {"name": "icclab.haas.master.imageid"},
    {"name": "icclab.haas.master.transfermethod"},
    {"name": "icclab.haas.cluster.username"},
    {"name": "icclab.haas.cluster.usergroup"},
    {"name": "icclab.haas.cluster.homedir"}
];

// The following variables have to be included into every request
$.compulsoryVariables = [
    {"name": "username" },
    {"name": "password" },
    {"name": "tenant" },
    {"name": "region" }
]

$.loggedin = false;

$.GetCompulsoryVariables = function() {
    var requestData = {};
    $.each($.compulsoryVariables, function (i, item) {
        var value;
        requestData[item.name] = $("#"+item.name).val();
        if( requestData[item.name]=='' ) {
            alert('value '+item.name+' not set');
            throw Exception('value '+item.name+' not set');
        }
    });
    return requestData;
}

$.AjaxRequest = function( reqdata, reqsuccess, reqerror ) {
    // check if data is JSON - if not, convert it to JSON
    try {
        var json = JSON.parse(reqdata);
    }
    catch(e) {
        reqdata = JSON.stringify(reqdata);
    }

    //MyLogger.debug(reqdata);

    // send the request and call given success / error functions
    $.ajax({
        method: "POST",
        url: "so.php",
        contentType: "application/json; charset=utf-8",
        //dataType: "json",
        data: reqdata
    }).done(function (msg) {
        if( reqsuccess===undefined ) {
            MyLogger.ownColor(msg, '#333');
        }
        else {
            reqsuccess(msg);
        }
    }).error(function() {
        if (reqerror === undefined) {
            MyLogger.error("request "+reqdata+" failed");
        }
        else {
            reqerror();
        }
    });
}

$.outputMaxHeight = 500;
$.outputMinHeight = 50;
$.OutputFloatIn = function() {
    var outputbox = $("#outputbox");
    clearInterval($.floatInInterval);
    $.floatInInterval = setInterval( function() {
        if (outputbox.height() < $.outputMaxHeight) {

            outputbox.height(outputbox.height() + 20);
        }
        else {
            clearInterval($.floatInInterval );
        }
    },10);
}

$.OutputFloatOut = function() {
    var outputbox = $("#outputbox");
    clearInterval($.floatInInterval);
    $.floatInInterval = setInterval( function() {
        if (outputbox.height() > $.outputMinHeight) {

            outputbox.height(outputbox.height() - 20);
        }
        else {
            clearInterval($.floatInInterval );
        }
    },10);
}

$.RemoveAllOptionsAndAddDefaultOption = function( element, defaultText, defaultValue ) {
    element.find('option').remove();
    if( defaultText===undefined) {
        defaultText = "";
    }
    if( defaultValue===undefined ) {
        defaultValue = "";
    }
    element.append($("<option>").val(defaultValue).text(defaultText));
}

$(document).ready( function() {

    // fill in the previously defined tabs from navigationEntries
    $.each($.navigationEntries, function (i, item) {
        var act = item.active == 1 ? " class='active'" : "";
        var id = item.id != 'undefined' ? " id='" + item.id + "'" : "";
        var listElem = "<li" + act + "><a href='#" + item.href + "'" + id + " data-toggle='tab'>" + item.value + "</a></li>";
        $("#navigationEntries").append(listElem);

        if (item.class !== undefined) {
            test = eval("new " + item.class + "( '#navigationContent' )");
            test.drawInterface();
        }

        try {
            eval("var inst = new "+item.class+"(); inst.isReady()");
        }
        catch(error) {
            console.info( item.class+".isReady() isn't defined" );
        }

    });

    // has to be called now as before, dynamically created checkboxes were not available yet
    $(':checkbox').checkboxpicker();

});


var running = 0;
var refreshId;

var publicSSHKeysLoaded = false;

$.haas = { serviceURL: "http://127.0.0.1:8080" };
