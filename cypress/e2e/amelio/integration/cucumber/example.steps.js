import { Given, Then } from 'cypress-cucumber-preprocessor/steps';

Given('I visit the example page', () => {
  cy.visit('https://example.com');
});

Then('I should see the title {string}', (title) => {
  cy.title().should('eq', title);
});
