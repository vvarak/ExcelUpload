sap.ui.define(["sap/m/MessageBox","uploadexcel/js/Xlsxfull"], function (MessageBox, Xlsxfull) {
	return {
		getExcelData: function (file) {
			return new Promise(function (resolve, reject) {
				// feature2 added
				var reader = new FileReader();
				var excelData = {};
				reader.onload = function (e) {
					var data = e.target.result;
					var workbook = XLSX.read(data, {
						type: 'binary'
					});
					workbook.SheetNames.forEach(function (sheetName) {
						// Here is your object for every sheet in workbook
						excelData = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
					});
					resolve(excelData);
				};
				reader.readAsBinaryString(file);
			});
		},
		exportDataToExcel: function (array, fileName) {
			var ws = XLSX.utils.json_to_sheet(array);
			var wb = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(wb, ws, 'Data');
			XLSX.writeFile(wb, fileName + ".xlsx");
		}
	};
});