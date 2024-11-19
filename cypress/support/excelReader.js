const XLSX = require('xlsx');

export function readExcelFile(filePath) {
    return cy.readFile(filePath, 'base64').then(file => {
        // Parse the Excel file
        const workbook = XLSX.read(file, { type: 'base64' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]]; // Get the first sheet

        // Convert the sheet to JSON format
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        return jsonData; // Return the data
    });
}
