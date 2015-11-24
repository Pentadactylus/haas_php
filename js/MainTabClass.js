
var MainTabClass = function( container ) {
    this.container = container;
}

MainTabClass.prototype.drawInterface = function() {
    this.container.append( "        <div class=\"tab-pane active panel panel-info withpadding\" id=\"tab_main\">\n    <h4 class=\"panel-heading\">Main menu</h4>\n    <p>\n    <button type=\"button\" class=\"btn btn-default btn-block\" id=\"tokenbutton\">get Token</button>\n    </p>\n    <p>Token-ID\n    <input type=\"text\" class=\"form-control\" id=\"tokenid\" placeholder=\"enter token ID\">\n        </p>\n        </div>\n        " );

}

var MainTabClassInstance = new MainTabClass( $("#navigationContent"));