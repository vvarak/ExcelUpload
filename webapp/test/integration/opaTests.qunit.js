sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'uploadexcel/test/integration/FirstJourney',
		'uploadexcel/test/integration/pages/ZC_DB_EXELUPLTBLList',
		'uploadexcel/test/integration/pages/ZC_DB_EXELUPLTBLObjectPage'
    ],
    function(JourneyRunner, opaJourney, ZC_DB_EXELUPLTBLList, ZC_DB_EXELUPLTBLObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('uploadexcel') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheZC_DB_EXELUPLTBLList: ZC_DB_EXELUPLTBLList,
					onTheZC_DB_EXELUPLTBLObjectPage: ZC_DB_EXELUPLTBLObjectPage
                }
            },
            opaJourney.run
        );
    }
);