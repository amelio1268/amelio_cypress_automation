const ExcelJS = require('exceljs');
const path = require('path');

describe('Create Challenge Command', () => {
    const filePath = path.join(Cypress.config('downloadsFolder'), 'C__Users_QA-lead_Downloads_amelio_cypress_automation_cypress_downloads_departments.xlsx');

    before(() => {
        // Ensure the departments.xlsx file is created before running tests
        cy.fetchDepartmentsAndCreateExcel();
    });

    it('should create a challenge with default options', () => {
        cy.createChallenge().then((suggestionId) => {
            expect(suggestionId).to.exist; // Check if suggestionId was returned
        });
    });

    it('should create a challenge with specific titles', () => {
        const titles = {
            en: "Custom Challenge Title"
        };

        cy.createChallenge({ titles }).then((suggestionId) => {
            expect(suggestionId).to.exist; 
        });
    });

    it('should create challenges for all departments in the Excel sheet', () => {
        const workbook = new ExcelJS.Workbook();

        // Read the departments from the Excel file
        return workbook.xlsx.readFile(filePath).then(() => {
            const worksheet = workbook.getWorksheet('Departments');
            const departments = [];

            worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
                // Assuming departmentId is in the first column and name in the second
                const departmentId = row.getCell(1).value;
                const departmentName = row.getCell(2).value;
                departments.push({ departmentId, departmentName });
            });

            // Create challenges for each department
            departments.forEach((dept) => {
                const titles = { en: `Challenge for ${dept.departmentName}` }; // Custom title for each department
                const permissions = {
                    canEdit: true,
                    canDelete: false // Example permissions
                };

                cy.createChallenge({ departmentId: dept.departmentId, titles, permissions }).then((suggestionId) => {
                    expect(suggestionId).to.exist; // Check if suggestionId was returned
                });
            });
        });
    });

    it('should create a challenge with specific permissions', () => {
        const permissions = {
            canEdit: true,
            canDelete: false
        };

        cy.createChallenge({ permissions }).then((suggestionId) => {
            expect(suggestionId).to.exist; // Check if suggestionId was returned
        });
    });

    it('should create a challenge with department and permissions', () => {
        const departmentId = "628543ec-c5df-4a3b-969d-7a317c6fa74a"; // Example department ID
        const permissions = {
            canEdit: true,
            canDelete: true
        };

        cy.createChallenge({ departmentId, permissions }).then((suggestionId) => {
            expect(suggestionId).to.exist; // Check if suggestionId was returned
        });
    });
});
