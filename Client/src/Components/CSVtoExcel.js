import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const convertCsvToExcel = async (csvFile) => {
  const reader = new FileReader();

  reader.onload = (event) => {
    const csvData = event.target.result;
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.csv_to_sheet(csvData);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const excelBlob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

    saveAs(excelBlob, "converted.xlsx");
  };

  reader.readAsText(csvFile);
};

export default convertCsvToExcel;
