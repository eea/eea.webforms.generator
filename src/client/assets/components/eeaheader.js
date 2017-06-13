'use strict';

app.component("eeaHeader", {
	template: `
  <div id="toolribbon">
            <div id="lefttools">
                <a id="eealink" href="http://www.eea.europa.eu/">EEA</a>
                <a id="ewlink" href="http://www.ewindows.eu.org/">EnviroWindows</a>
            </div>
            <div id="righttools">
                    <a id="printlink" title="Print this page" href="javascript:this.print();"><span>Print</span></a>
            </div>
        </div>
        <div id="pagehead">
            <a href="/" accesskey="1" style="top:auto"><img src="//webq2test.eionet.europa.eu/images/eea-print-logo.gif" alt="Logo" id="logo"></a>
            <div id="networktitle">Eionet</div>
            <div id="sitetitle">European Environment Information and Observation Network</div>
            <div id="sitetagline">Web questionnaires</div>
        </div>
});
