// cypress/e2e/amelio/Challenges/login.spec.js
import { readExcelFile } from '../../../support/excelReader'; 
import config from '../../../fixtures/config.json';

it('login as a admin and create Challenge', () => {
    // Use the path from the config
    const filePath = config.departmentNamesWithId;
    const departments = [];

    readExcelFile(filePath).then(jsonData => {
        jsonData.forEach((user) => {
            const departmentID = user.id; 
            const departmentName = user.name; 

            departments.push({ departmentID, departmentName }); })

            cy.log(departments);

            // Create challenges for each department
            departments.forEach((dept) => {
                const titles = { en: `Challenge for ${dept.departmentName}` }; // Custom title for each department
                const permissions = {
                    canEdit: true,
                    canDelete: false // Example permissions
                };

                cy.createChallenge({ departmentId: dept.departmentID, departmentName: dept.departmentName,dept, titles, permissions }).then((suggestionId) => {
                    expect(suggestionId).to.exist; // Check if suggestionId was returned
                });
            });
        });

            // cy.visit('https://stage.amelio.co/');
            // cy.wait(5000);
            // cy.get('#Username').type(username);
            // cy.get('#Password').type(password);
            // cy.get('.btn').click();
            // cy.wait(5000);
            // cy.visit('https://stage.amelio.co/Colleagues');
            // cy.wait(5000);
        });
 
