
// activate special checkbox rendering for the already existing checkboxes
$(':checkbox').checkboxpicker();

var navigationEntries = [
    {"href":"tab_main", "active" : "1", "value" : "Main", "class" : "MainTabClass" },
    {"href":"tab_service", "value" : "Service", "class" : "ServiceTabClass" },
    {"href":"tab_system", "value" : "System", "class" : "SystemTabClass" },
    {"href":"tab_network", "value" : "Network", "id" : "tab_network_field", "class" : "NetworkTabClass" },
    {"href":"tab_os", "value" : "OS", "id" : "tab_os_field", "class" : "OSTabClass" },
    {"href":"tab_access", "value" : "Access", "class" : "AccessTabClass" },
    {"href":"tab_distrproc", "value" : "Distributed Processing", "class" : "DistrProcTabClass" },
    {"href":"tab_deployment", "value" : "Deployment", "class" : "DeploymentTabClass" },
    {"href":"tab_organisation", "value" : "Cluster Organisation", "class" : "ClusterTabClass" }
];

$(document).ready( function() {
    // fill in the previously defined tabs from navigationEntries
    $.each(navigationEntries, function (i, item) {
        var act = item.active == 1 ? " class=\"active\"" : "";
        var id = item.id != 'undefined' ? " id=\"" + item.id + "\"" : "";
        var listElem = "<li" + act + "><a href=\"#" + item.href + "\"" + id + " data-toggle=\"tab\">" + item.value + "</a></li>";
        $("#navigationEntries").append(listElem);

        if (item.class !== undefined) {
            test = eval("new " + item.class + "( \"#navigationContent\" )");
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

$.haas = { serviceURL: "http://localhost:8080" };
