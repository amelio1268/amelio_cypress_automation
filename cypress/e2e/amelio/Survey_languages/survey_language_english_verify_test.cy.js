import { fetchVerificationLink } from '../../../support/emailUtils';

describe('Survey Language Verify Test for bulk users- English', () => {
    it('Survey language test - Fill survey with survey preffered language as English', () => {

        const EXPECTED_SUBJECT = `TestAutomationSupport precisamos da sua opinião`;

        // Fetch the verification link
        fetchVerificationLink(EXPECTED_SUBJECT).then((verificationUrl) => {
            cy.log('Verification URL:', verificationUrl);

            // Visit the verification link
            cy.visit(verificationUrl);


            cy.wait(12000);

            // Verify the header
            cy.get('h2').should('contain.text', 'Welcome to your employee survey');

            // Verify the opinion expression message
            cy.get('p').should('contain.text', "We'd love your feedback on our workplace.");

            // Verify the agreement message
            cy.get('h5').should('contain.text', "By clicking the button below, you are agreeing to participate in your employer’s survey.");

            // Click the start button
            cy.get('button').contains('Get started').click();

            // Verify the question text
            cy.get('.question-title-top p').should('contain.text', 'Did you find what you were looking for today?');

            cy.get('ul > .MuiList-root > :nth-child(1)').click();

            // Verify the min and max labels
            cy.get('ul.rating-ui li.min').should('contain.text', 'Strongly disagree');
            cy.get('ul.rating-ui li.max').should('contain.text', 'Strongly agree');

            // Click the slider to set the value to 8
            cy.get('.MuiSlider-mark[data-index="7"]').click({ force: true });

            cy.get('p').should('contain.text', 'What vertical/industry best describes your company?');

            // Enter a comment
            cy.get('textarea').first().type('Its very good employee culture');

            cy.get('.MuiButton-contained').click();

            // Verify the question text
            cy.get('.question-title-top p').should('contain.text', 'How satisfied are you with our support?');

            // Array of expected options
            const options = [
                "Strongly agree",
                "Somewhat agree",
                'Neutral',
                "Somewhat disagree",
                "Strongly disagree"
            ];

            // Loop through each expected option and verify its presence
            options.forEach(option => {
                cy.get('nav.MuiList-root')
                    .contains(option)
                    .should('be.visible')
            });

            // Input an answer into the textarea
            const answer = 'This is english language survey';
            cy.get('.MuiInput-root').type(answer);

            cy.get('.MuiButton-contained').click();

            // Verify the content of the completion message
            cy.get('.MuiCardContent-root')
                .contains('Your survey is complete.')
                .should('be.visible');

            cy.get('.MuiCardContent-root')
                .contains(' PLEASE CLICK ON THE SUBMIT BUTTON BELOW.')
                .should('be.visible');

            // Click the "Enviar" button
            cy.get('button')
                .contains('Submit')
                .should('be.visible') // Ensure the button is visible before clicking
                .click();

            // Verify the contents of the thank you message
            cy.get('.surv').within(() => {
                cy.get('h2').should('have.text', 'Thank you so much for your feedback!');
                cy.get('p').should('have.text', "You're helping us build a greater workplace.");
            });

        });

    });
});
