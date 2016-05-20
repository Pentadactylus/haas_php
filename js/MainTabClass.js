
var MainTabClass = function( container ) {
    this.selector = container;
}

MainTabClass.prototype.drawInterface = function() {
    $(this.selector).append( "<div class='tab-pane active panel panel-info withpadding' id='tab_main'>" +
        "<h4 class='panel-heading'>Main menu</h4>" +
        "<p><button id=\"changecredentials\" type=\"button\" class=\"btn btn-primary btn-lg\" data-toggle=\"modal\" data-target=\"#authenticationDialog\">" +
        "Change user credentials" +
        "</button></p>" +
        "</div>" );
}


MainTabClass.prototype.isReady = function() {
    var authenticated = false;

    $('#changecredentials').on('click', function() {
        authenticated = false;
    });

    $('#container').append('<div class="modal fade" id="authenticationDialog" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'+
        '<div class="modal-dialog" role="document">'+
        '<div class="modal-content">'+
        '<div class="modal-header">'+
        '<h4 class="panel-heading">Authentication</h4>'+
        '</div>'+
        '<div class="modal-body">'+
        'Please authenticate yourself...<br /><br />'+
        '<p><b>Username</b><input type="text" class="form-control" id="username" placeholder="enter username"></p>'+
        '<p><b>Tenant</b><input type="text" class="form-control" id="tenant" placeholder="enter tenant name"></p>'+
        '<p><b>Password</b><input type="password" class="form-control" id="password" placeholder="enter password"></p>'+
        '<p><b>Region</b><input type="text" class="form-control" id="region" placeholder="enter region name"></p>'+
        '</div>'+
        '<div class="modal-footer">'+
        '<button type="button" class="btn btn-primary" data-dismiss="modal">authenticate</button>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '</div>');

    // after loading the site, the credentials screen has to be shown so that the user can login
    $('#authenticationDialog').modal('show');

    // as soon as the login screen is about to disappear,
    $('#authenticationDialog').on('hide.bs.modal', function () {
        if( authenticated==false ) {
            var request = $.GetCompulsoryVariables();
            request['action'] = 'authenticate';
            MyLogger.info(request);
            $.AjaxRequest(request,function(msg) {
                if( msg.indexOf("true")>=0 ) {
                    authenticated = true;
                    $('#authenticationDialog').modal('hide');
                }
                else {
                    alert( 'something went wrong - please try again' );
                }
            });
            return false;
        }
        else {
            return true;
        }
    });
}