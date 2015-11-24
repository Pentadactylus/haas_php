
// activate special checkbox rendering
$(':checkbox').checkboxpicker();

var navigationEntries = [
    {"href":"tab_main", "active" : "1", "value" : "Main", "class" : "MainTabClass" },
    {"href":"tab_service", "value" : "Service"},
    {"href":"tab_system", "value" : "System"},
    {"href":"tab_os", "value" : "OS", "id" : "tab_os_field"},
    {"href":"tab_access", "value" : "Access"},
    {"href":"tab_distrproc", "value" : "Distributed Processing"},
    {"href":"tab_deployment", "value" : "Deployment"},
    {"href":"tab_organisation", "value" : "Cluster Organisation"}
];
$.each(navigationEntries, function(i,item) {
    var act = item.active==1 ? " class=\"active\"":"";
    var id = item.id != 'undefined' ? " id=\""+item.id+"\"" : "";
    var listElem = "<li"+act+"><a href=\"#"+item.href+"\""+id+" data-toggle=\"tab\">"+item.value+"</a></li>";
    $("#navigationEntries").append(listElem);
});


$( "#initialize" ).addClass("disabled");
$( "#initialize" ).click(function() {
    if( !$( "#initialize" ).hasClass("disabled") ) {
        alert( "Handler for .click() called." );
    }
    else {
        alert( "element not clickable" );
    }
});

$( "#getstate" ).click(function() {
    if( !$( "#getstate" ).hasClass("disabled") ) {
        alert( "Handler for .click() called." );
    }
    else {
        alert( "element not clickable" );
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

        var regExp = /Category\: ([^;]+)\;/;
        var matches = regExp.match(msg);

        $("#oterm").val(matches[matches.length-1]);
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
$(function(){
    var navMain = $("#tab_os_field");
    navMain.click( function () {
        if( imagesLoaded==false ) {
            // in the beginning - else, it might get called multiple times if user is clicking here before loading
            imagesLoaded = true;
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
        }
    });
});

for( j=0; j<100; j++ ) {
    MyLogger.info("started");
    MyLogger.ownColor("my color", "#f00");
}