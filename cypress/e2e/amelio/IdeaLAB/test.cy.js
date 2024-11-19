import { readExcelFile } from '../../../support/excelReader';
import config from '../../../fixtures/config.json';

describe('Main Tests', () => {
    const targetDepartment = 'Department 1';
    const targetRole = 'Employee';
    // before(() => {
    //     // Run the setup test
    //     cy.exec('npx cypress run --spec "C:\\Users\\QA-lead\\Downloads\\amelio_cypress_automation\\cypress\\e2e\\amelio\\Challenges\\create_challenges_for_all_departments_separately_test.cy.js"');
    // });

    it('should create a challenge with default options', () => {

        const filePath = config.excelFilePath;

        readExcelFile(filePath).then(jsonData => {
            // Step 1: Filter by department and role
            const filteredData = jsonData.filter(user => 
                user.Department === targetDepartment && user.Role === targetRole
            );

            // Step 2: Process the filtered data
            filteredData.forEach((user) => {
                const username = user.Email; // Assuming 'Email' is the column for usernames
                const password = user.Password; // Assuming 'Password' is the column for passwords
                
                cy.log(`Username: ${username}`);
                cy.log(`Password: ${password}`);

                cy.visit('https://stage.amelio.co/');
                cy.wait(8000);
                cy.get('#Username').type(username);
                cy.get('#Password').type(password);
                cy.get('.btn').click();
                cy.wait(5000);
                cy.visit('https://stage.amelio.co/Suggestions/IdeaLab');
                cy.wait(9000);
                cy.get(':nth-child(2) > .symbol-circle > span.mobile-hidden').click()
                cy.get(':nth-child(2) > .menu > .mb-3 > .menu-link').click();
                cy.wait(7000);
            });
        });

    });

    // after(() => {
    //     // Run the cleanup test
    //     cy.exec('npx cypress run --spec "C:\\Users\\QA-lead\\Downloads\\amelio_cypress_automation\\cypress\\e2e\\amelio\\Challenges\\delete_all_challenges_exist_verify_test.cy.js"');
    // });
});
