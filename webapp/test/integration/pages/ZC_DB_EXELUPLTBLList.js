sap.ui.define(['sap/fe/test/ListReport'], function(ListReport) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ListReport(
        {
            appId: 'uploadexcel',
            componentId: 'ZC_DB_EXELUPLTBLList',
            contextPath: '/ZC_DB_EXELUPLTBL'
        },
        CustomPageDefinitions
    );
});