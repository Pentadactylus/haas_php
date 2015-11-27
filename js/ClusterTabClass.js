
var ClusterTabClass = function( container ) {
    this.selector = container;
}

ClusterTabClass.prototype.drawInterface = function() {
    $(this.selector).append( "<div class=\"tab-pane panel panel-info withpadding\" id=\"tab_organisation\"><h4 class=\"panel-heading\">Cluster Organisation</h4><p>Cluster's Master's IP<input type=\"text\" class=\"form-control\" id=\"ipnumber\" value=\"160.85.4.\"></p><p>Command<input type=\"text\" class=\"form-control\" id=\"command\"></p><p><button type=\"button\" class=\"btn btn-default btn-block\" id=\"commandbutton\">send command</button></p><p><button type=\"button\" class=\"btn btn-default btn-block\" id=\"statebutton\">get state</button></p></div></div>" );

}
