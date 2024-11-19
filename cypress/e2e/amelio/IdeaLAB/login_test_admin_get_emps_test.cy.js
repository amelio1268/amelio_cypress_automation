// cypress/e2e/amelio/Challenges/login.spec.js
import { readExcelFile } from '../../../support/excelReader'; 
import config from '../../../fixtures/config.json';

it('login as a admin and create Challenge', () => {
    // Use the path from the config
    const filePath = config.excelFilePath;

    readExcelFile(filePath).then(jsonData => {
        jsonData.forEach((user) => {
            const username = user.id; 
            const password = user.name; 

            cy.log(username);
            cy.log(password);

            // cy.visit('https://stage.amelio.co/');
            // cy.wait(5000);
            // cy.get('#Username').type(username);
            // cy.get('#Password').type(password);
            // cy.get('.btn').click();
            // cy.wait(5000);
            // cy.visit('https://stage.amelio.co/Colleagues');
            // cy.wait(5000);
        });
    });
});
