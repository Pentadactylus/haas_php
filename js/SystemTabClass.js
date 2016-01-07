
var SystemTabClass = function( container ) {
    this.selector = container;
}

SystemTabClass.prototype.drawInterface = function() {
    $(this.selector).append( "<div class=\"tab-pane panel panel-info withpadding\" id=\"tab_system\"><h4 class=\"panel-heading\">System preferences</h4><p>what's the cluster's name?<input type=\"text\" class=\"form-control\" id=\"clustername\" placeholder=\"enter the cluster's name\"></p><p># Masters<input type=\"text\" class=\"form-control\" id=\"mastercount\" placeholder=\"enter amount of master nodes\"></p><p># Slaves<input type=\"text\" class=\"form-control\" id=\"slavecount\" placeholder=\"enter amount of slave nodes\"></p><p>should a slave node be started on the master(s) as well?<input type=\"checkbox\" id=\"slaveonmaster\" data-reverse></p></div>" );

}

SystemTabClass.prototype.isReady = function() {

};
