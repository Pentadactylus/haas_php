
var DistrProcTabClass = function( container ) {
    this.selector = container;
}

DistrProcTabClass.prototype.drawInterface = function() {
    $(this.selector).append( "        <div class=\"tab-pane panel panel-info withpadding\" id=\"tab_distrproc\">\n            <h4 class=\"panel-heading\">Distributed Processing</h4>\n            <p>\n                which Framework(s) should be installed?<br>\n            <table class=\"table\">\n                <tr>\n                    <th>\n                        Framework\n                    </th>\n                    <th>\n                        install it?                    </th>                </tr>                <tr>                    <td class=\"vert-align\">                        Hadoop:                    </td>                    <td class=\"vert-align\">                        <input type=\"checkbox\" class=\"form-control\" id=\"frameworkselecthadoop\" data-reverse />                    </td>                </tr>                <tr>                    <td class=\"vert-align\">                        Spark:                    </td>                    <td class=\"vert-align\">                        <input type=\"checkbox\" class=\"form-control disabled deactivated\" id=\"frameworkselectspark\" data-reverse />                    </td>                </tr>            </table>            </p>        </div>" );

}
