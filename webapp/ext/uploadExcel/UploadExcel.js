sap.ui.define([
    "sap/m/Dialog",
    "sap/m/VBox",
    "sap/m/Button",
    "sap/ui/unified/FileUploader",
    "uploadexcel/js/MassUploadParse",
    "uploadexcel/js/Ajaxcaller"
], function (Dialog, VBox, Button, FileUploader, MassUploadParse, Ajaxcaller) {
    'use strict';
    let Module = {
        OpenUploadDialog: function () {
            let dataArray;
            let oModel = this.getModel();
            let oFileUploader = new FileUploader({
                fileType: ["xlsx", "xls"],
                placeholder: "Choose an Excel file...",
                change: function (oEvent) {
                    let oFile = oEvent.getParameter("files")[0];
                    let parsedData = MassUploadParse.getExcelData(oFile);
                    parsedData.then(function (data) {
                        dataArray = data;
                    })
                }
            });
            let oDialog = new Dialog({
                title: "Upload Excel File",
                content: new VBox({
                    items: [oFileUploader]
                }),
                beginButton: new Button({
                    text: "Upload",
                    press: async function () {
                        let token;
                        try {
                            let response = await fetch(`${oModel.getServiceUrl()}`, {
                                method: "GET",
                                headers: {
                                    "X-CSRF-Token": "Fetch"
                                },
                                credentials: "include"
                            });
                            if (response.ok) {
                                token = response.headers.get("X-CSRF-Token");
                            } else {
                                console.log("Failed to fetch CSRF token");
                            }
                        } catch (error) {
                            console.error("Error fetching CSRF token:", error);
                        }

// let sBatchBody =
// `--batch_id-1742965902135-261
// Content-Type: multipart/mixed;boundary=changeset_id-1742965902135-262

// --changeset_id-1742965902135-262
// Content-Type: application/http
// Content-Transfer-Encoding: binary
// Content-ID: 0.0

// POST ZC_DT_EXELUPLTBL HTTP/1.1
// Accept: application/json;odata.metadata=minimal;IEEE754Compatible=true
// Accept-Language: en
// X-CSRF-Token: ${token}
// Content-Type: application/json;charset=UTF-8;IEEE754Compatible=true

// {
//   "OrderType": "PB",
//   "CompanyCode": "1180",
//   "FileName": "podata.xlsx"
// }

// --changeset_id-1742965902135-262--
// --batch_id-1742965902135-261--
// Group ID: $auto`
                      

//                         await Ajaxcaller._doRestAjaxCall(
//                             "POST",
//                             `${oModel.getServiceUrl()}$batch`,
//                             sBatchBody,
//                             token
//                         );

                            // let requests = dataArray.map((obj, i) => {
                            //     return {
                            //         "id": i + "",
                            //         "method": "POST",
                            //         "url": `/ZC_DB_EXELUPLTBL`
                            //     }
                            // })
                            // if (requests.length > 0) {
                            //     let responses = await Ajaxcaller._doRestAjaxCall(
                            //         "POST",
                            //         `${oModel.getServiceUrl()}$batch`, 
                            //         { requests }, token)
                            // }

                        let i = 0;
                        let url = `/ZC_DB_EXELUPLTBL`;
                        let requests = [];
                        dataArray.forEach((row) => {
                            let date = new Date();
                            row["UploadDate"] = dataArray[0]["UploadDate"] = date.toISOString().split("T")[0];
                            requests.push({
                                "id": i++,
                                "method": "POST",
                                "url": url,
                                "headers": {
                                    "Accept": "application/json",
                                    "content-type": "application/json;IEEE754Compatible=true"
                                },
                                "body": row
                            })
                        })
                        let payload = {
                            requests: requests
                        };
                        await Ajaxcaller._doRestAjaxCall("POST", `${oModel.getServiceUrl()}$batch`, payload, token, "long", "json")
                        // let date = new Date();
                        // dataArray[0]["UploadDate"] = date.toISOString().split("T")[0];
                        // try {
                        //     let response = await Ajaxcaller._doRestAjaxCall("POST", `${oModel.getServiceUrl()}ZC_DB_EXELUPLTBL`,dataArray[0],token);
                        // } catch (error) {
                        // 	console.log(error)
                        // }
                        oDialog.close();
                    }
                }),
                endButton: new Button({
                    text: "Cancel",
                    press: function () {
                        oDialog.close();
                    }
                })
            });
            oDialog.open();
        }
    };
    return Module;
});
