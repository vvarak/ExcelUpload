sap.ui.define(['sap/fe/test/ObjectPage'], function(ObjectPage) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ObjectPage(
        {
            appId: 'uploadexcel',
            componentId: 'ZC_DB_EXELUPLTBLObjectPage',
            contextPath: '/ZC_DB_EXELUPLTBL'
        },
        CustomPageDefinitions
    );
});