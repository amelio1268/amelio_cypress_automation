// In integration/fetchDepartments.spec.js

describe('Fetch Departments and Append to Excel', () => {
    it('should fetch all departments and append to existing Excel', () => {
        cy.fetchDepartmentsAndCreateExcel();
    });
});
