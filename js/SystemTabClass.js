
var SystemTabClass = function( container ) {
    this.selector = container;
}

SystemTabClass.prototype.drawInterface = function() {
    $(this.selector).append( "        <div class=\"tab-pane panel panel-info withpadding\" id=\"tab_system\">\n            <h4 class=\"panel-heading\">System preferences</h4>\n            <p>what's the cluster's name?\n                <input type=\"text\" class=\"form-control\" id=\"clustername\" placeholder=\"enter the cluster's name\">\n            </p>\n            <p># Masters\n                <input type=\"text\" class=\"form-control\" id=\"mastercount\" placeholder=\"enter amount of master nodes\">\n            </p>\n            <p># Slaves\n                <input type=\"text\" class=\"form-control\" id=\"slavecount\" placeholder=\"enter amount of slave nodes\">\n            </p>\n            <p>should a slave node be started on the master(s) as well?\n                <input type=\"checkbox\" id=\"slaveonmaster\" data-reverse>\n            </p>\n        </div>\n" );

}
