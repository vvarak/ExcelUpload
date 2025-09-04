sap.ui.define([], function (MessageBox, Xlsxfull) {
	return {
        /**
         * Public method to perform an AJAX call with given parameters
         * @param  {string} sMethod                   HTTP call method
         * @param  {string} sUrl                      URL to call
         * @param  {object} oValues                   Data to send in POST case
         * @param  {string} sTimeoutDuration          Timeout length
         * @param  {string} sDataType                 Data format type
         * @param  {array} aParamResponseHttpHeaders  Response headers to recover
         * @param  {object} sAuth                     object with {type: "" , value:""}
         * @return {promise}                          Promise generated from ajax call
         */
        requestRestAjax: function (
            sMethod,
            sUrl,
            oValues,
            sTimeoutDuration,
            sDataType,
            aParamResponseHttpHeaders,
            sAuth
        ) {
            if (typeof (sMethod) === "object") {
                sUrl = sMethod.sUrl;
                oValues = sMethod.oValues;
                sTimeoutDuration = sMethod.sTimeoutDuration;
                sDataType = sMethod.sDataType;
                aParamResponseHttpHeaders = sMethod.aParamResponseHttpHeaders;
                sAuth = sMethod.sAuth;
                sMethod = sMethod.sMethod;
            }
            return this._doRestAjaxCall(
                sMethod.toUpperCase(),
                sUrl,
                oValues,
                sTimeoutDuration,
                sDataType,
                aParamResponseHttpHeaders,
                sAuth
            );
        },

        /* =========================================================== */
        /* begin: internal methods                                     */
        /* =========================================================== */
        /**
         * Private method to perform an AJAX call with given parameters
         * @param  {string} sMethod                   HTTP call method
         * @param  {string} sUrl                      URL to call
         * @param  {object} oValues                   Data to send in POST case
         * @param  {string} sTimeoutDuration          Timeout length
         * @param  {string} sDataType                 Data format type
         * @param  {array} aParamResponseHttpHeaders  Response headers to recover
         * @param  {string} sAuth                     object with {type: "" , value:""}
         * @return {promise}                          Promise generated from ajax call
         */
        _doRestAjaxCall: function (
            sMethod,
            sUrl,
            oValues,
            sCsrfToken,
            sTimeoutDuration,
            sDataType,
            aParamResponseHttpHeaders,
            sAuth
        ) {
            sDataType = sDataType || "json";
            oValues = oValues || "";
            sTimeoutDuration = sTimeoutDuration || "long";

            let sContentType = "";
            if (sDataType === "json") {
                sContentType = "application/json; charset=UTF-8";
            } else if (sDataType === "xml") {
                sContentType = "application/xml; charset=UTF-8";
            }

            let oFormattedValues;
            if (oValues instanceof Blob || !oValues) {
                oFormattedValues = oValues;
            } else if (typeof oValues === "string" || sDataType === "form") {
                oFormattedValues = oValues;
            } else {
                oFormattedValues = JSON.stringify(oValues);
            }

            let oHeaders = {};
            if(sCsrfToken){
                oHeaders["X-CSRF-Token"] = sCsrfToken;
            }
            if (sDataType && sDataType !== "form") {
                oHeaders["Content-Type"] = sContentType;
            }

            if (!jQuery.isEmptyObject(sAuth)) {
                oHeaders.Authorization = sAuth.type + " " + sAuth.value;
            }

            return new Promise(function (resolve, reject) {
                if (!window["navigator"].onLine) {
                    //Send NO NETWORK available
                    reject({
                        id: "NO_NETWORK",
                        error: {
                            message: "Currently the application can not connect to Internet. Please check your connection and try again."
                        }
                    });
                } else {
                    jQuery.ajax({
                        cache: false,
                        crossDomain: false,
                        timeout: 300000,
                        type: sMethod,
                        url: sUrl,
                        headers: oHeaders,
                        contentType: sDataType === "form" ? false : "multipart/form-data; charset=UTF-8",
                        dataType: sDataType !== "raw" ? "json" : "text",
                        processData: false,
                        data: oFormattedValues,
                        success: function (response, textStatus, jqXHR) {
                            if (jqXHR.getResponseHeader("com.sap.cloud.security.login")) {
                                // publish message in the event manager
                                let oEventBus = sap.ui.getCore().getEventBus();
                                oEventBus.publish("xpr:AjaxCaller", "sessionTimeout", {});
                                //Generation of an orphaned promise
                                return;
                            }
                            //Only takes into account if service wants to receive some HTTP Response Header
                            if (aParamResponseHttpHeaders) {
                                let oParamValueReponseHttpHeaders = {};
                                //Add http response header in a special attribute of retrieved data
                                aParamResponseHttpHeaders.forEach(function (
                                    sParamResponseHttpHeader
                                ) {
                                    let sValueResponseHeader = jqXHR.getResponseHeader(
                                        sParamResponseHttpHeader
                                    );
                                    if (sValueResponseHeader) {
                                        oParamValueReponseHttpHeaders[
                                            sParamResponseHttpHeader
                                        ] = sValueResponseHeader;
                                    }
                                });
                                if (oParamValueReponseHttpHeaders) {
                                    response.responseHttpHeaders = oParamValueReponseHttpHeaders;
                                }
                            }
                            //Send response
                            resolve(response);
                        },
                        error: function (jqXHR, textStatus) {
                            if (textStatus === "timeout") {
                                //Send TIMEOUT obtained
                                reject({
                                    id: "TIMEOUT",
                                    error: {}
                                });
                            } else {
                                //Send complete error to evaluate what to do
                                reject({
                                    id: "HTTP_ERROR",
                                    error: jqXHR
                                });
                            }
                        }
                    });
                }
            }.bind(this));
        }
    };
});