


var DistrProcTabClass = function( container ) {
    this.selector = container;
}

DistrProcTabClass.prototype.drawInterface = function() {
    $(this.selector).append( "<div class=\"tab-pane panel panel-info withpadding\" id=\"tab_distrproc\"><h4 class=\"panel-heading\">Distributed Processing</h4><p>which Framework(s) should be installed?<br><table class=\"table\"><tr><th>Framework</th><th>install it?</th></tr><tr><td class=\"vert-align\">Hadoop:</td><td class=\"vert-align\"><input type=\"checkbox\" class=\"form-control\" id=\"frameworkselecthadoop\" data-reverse /></td></tr><tr><td class=\"vert-align\">Spark:</td><td class=\"vert-align\"><input type=\"checkbox\" class=\"form-control disabled deactivated\" id=\"frameworkselectspark\" data-reverse /></td></tr></table></p></div>" );

}

DistrProcTabClass.prototype.isReady = function() {

};
