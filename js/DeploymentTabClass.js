
var DeploymentTabClass = function( container ) {
    this.selector = container;
}

DeploymentTabClass.prototype.drawInterface = function() {
    $(this.selector).append( "<div class=\"tab-pane panel panel-info withpadding\" id=\"tab_deployment\">\n            <h4 class=\"panel-heading\">Deployment</h4>\n            <p>OTERM\n                <input type=\"text\" class=\"form-control\" id=\"oterm\" placeholder=\"oterm\">\n            </p>\n            <p>\n                Tenant name\n                <input type=\"text\" class=\"form-control\" id=\"tenantid\" placeholder=\"enter tenant name\">\n            </p>\n            <p>\n                Number of Slaves\n                <input type=\"text\" class=\"form-control\" id=\"slavenumber\" placeholder=\"how many slaves to deploy?\">\n            </p>\n            <p>\n                <button type=\"button\" class=\"btn btn-default btn-block\" id=\"createinstancebutton\">create instance</button>\n            </p>\n        </div>\n        " );

}
