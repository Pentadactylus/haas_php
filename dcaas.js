
// activate special checkbox rendering
$(':checkbox').checkboxpicker();

var navigationContent = Array();

var navigationEntries = [
    {"href":"tab_main", "active" : "1", "value" : "Main", "class" : "MainTabClass" },
    {"href":"tab_service", "value" : "Service", "class" : "ServiceTabClass" },
    {"href":"tab_system", "value" : "System", "class" : "SystemTabClass" },
    {"href":"tab_os", "value" : "OS", "id" : "tab_os_field", "class" : "OSTabClass" },
    {"href":"tab_access", "value" : "Access", "class" : "AccessTabClass" },
    {"href":"tab_distrproc", "value" : "Distributed Processing", "class" : "DistrProcTabClass" },
    {"href":"tab_deployment", "value" : "Deployment", "class" : "DeploymentTabClass" },
    {"href":"tab_organisation", "value" : "Cluster Organisation", "class" : "ClusterTabClass" }
];

$.each(navigationEntries, function(i,item) {
    var act = item.active==1 ? " class=\"active\"":"";
    var id = item.id != 'undefined' ? " id=\""+item.id+"\"" : "";
    var listElem = "<li"+act+"><a href=\"#"+item.href+"\""+id+" data-toggle=\"tab\">"+item.value+"</a></li>";
    $("#navigationEntries").append(listElem);

    if( item.class!==undefined ) {
        test = eval("new "+item.class+"( \"#navigationContent\" )");
        test.drawInterface();
    }
});


$( "#deploy" ).click(function() {
    if( !$( "#deploy" ).hasClass("disabled") ) {
        alert( "Handler for .click() called." );
    }
    else {
        alert( "element not clickable" );
    }
});

$( "#delete" ).click(function() {
    if( !$( "#delete" ).hasClass("disabled") ) {
        alert( "Handler for .click() called." );
    }
    else {
        alert( "element not clickable" );
    }
});

var running = 0;
var refreshId;


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

$( "#tokenbutton" ).click(function() {
    $.ajax({
        method: "POST",
        url: "gettoken.php"
    }).done(function (msg) {
        MyLogger.info(msg);
        $("#tokenid").val(msg);
    }).error(function () {
        MyLogger.error("request failed");
    });
});

$( "#imagebutton" ).click(function() {
    $('#osimageoption')
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

$( "#statebutton" ).click(function() {

    if( running==0 ) {
        $("#command").val("cat /home/ec2-user/deployment.log");
        running = 1;
        refreshId = setInterval(function () {
            $.ajax({
                method: "POST",
                url: "system.php",
                data: {command: $("#command").val(), ip: $("#ipnumber").val() }
            }).done(function (msg) {
                MyLogger.ownColor(msg,'#333');
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


$( "#servicetypebutton" ).click(function() {
    $.ajax({
        method: "POST",
        url: "so.php",
        data: {action: 'servicetype', token: $("#tokenid").val(), tenant: $("#tenantid").val(), url: 'http://localhost:8888' }
    }).done(function (msg) {
        MyLogger.info(msg);
    }).error(function () {
        MyLogger.error("request failed");
    });
});

$( "#createinstancebutton" ).click(function() {
    $.ajax({
        method: "POST",
        url: "so.php",
        data: {action: 'createinstance',
            token: $("#tokenid").val(),
            tenant: $("#tenantid").val(),
            url: 'http://localhost:8888',
            oterm: $("#oterm").val(),
            slavecount: $("#slavenumber").val() }
    }).done(function (msg) {
        MyLogger.info(msg);
    }).error(function () {
        MyLogger.error("request failed");
    });
});

$( "#getservicesbutton" ).click(function() {
    $.ajax({
        method: "POST",
        url: "so.php",
        data: {action: 'getservices', token: $("#tokenid").val(), tenant: $("#tenantid").val(), url: 'http://localhost:8888', oterm: $("#oterm").val() }
    }).done(function (msg) {
        MyLogger.info(msg);
    }).error(function () {
        MyLogger.error("request failed");
    });
});

var imagesLoaded = false;
var publicSSHKeysLoaded = false;

for( j=0; j<100; j++ ) {
    MyLogger.info("started");
    MyLogger.warn("my awesome warning");
    MyLogger.error("my ultimate error");

    MyLogger.ownColor("my color", "#ff4; background-color:#000");
}