import { fetchVerificationLink } from '../../../support/emailUtils';

describe('Survey Language Verify Test for bulk users- Hebrew', () => {
    it('Survey language test - Fill survey with survey preffered language as Hebrew', () => {
        const EXPECTED_SUBJECT = `TestAutomationSupport רוצה לדעת את דעתך`;

        // Fetch the verification link
        fetchVerificationLink(EXPECTED_SUBJECT).then((verificationUrl) => {
            cy.log('Verification URL:', verificationUrl);

            // Visit the verification link
            cy.visit(verificationUrl);

            cy.wait(12000);

            // Verify the header
            cy.get('h2').should('contain.text', 'ברוך הבא לסקר שלך.');

            // Verify the opinion expression message
            cy.get('p').should('contain.text', 'הבע את דעתך!');

            // Verify the agreement message
            cy.get('h5').should('contain.text', 'בלחיצה על הכפתור הבא, אתה מסכים להשתתף בסקר של החברה שלך.');

            // Click the start button
            cy.get('button').contains('להתחיל').click();

            // Verify the question text
            cy.get('.question-title-top p').should('contain.text', 'האם מצאת את מה שחיפשת היום?');

            cy.get('ul > .MuiList-root > :nth-child(1)').click();

            // Verify the min and max labels
            cy.get('ul.rating-ui li.min').should('contain.text', 'לא מסכים מאוד');
            cy.get('ul.rating-ui li.max').should('contain.text', 'מסכים מאוד');

            // Click the slider to set the value to 8
            cy.get('.MuiSlider-mark[data-index="7"]').click({ force: true });

            cy.get('p').should('contain.text', 'איזה ענף/תחום מתאר בצורה הטובה ביותר את החברה שלך');

            // Enter a comment
            cy.get('textarea').first().type('מה רמת שביעות הרצון');

            cy.get('.MuiButton-contained').click();

            // Verify the question text
            cy.get('.question-title-top p').should('contain.text', 'מה רמת שביעות הרצון שלך מהתמיכה שלנו?');

            // Array of expected options
            const options = [
                'מסכים מאוד',
                'מסכים במידה מסוימת',
                'נֵטרָלִי',
                'קצת לא מסכים',
                'לא מסכים מאוד'
            ];

            // Loop through each expected option and verify its presence
            options.forEach(option => {
                cy.get('nav.MuiList-root')
                    .contains(option)
                    .should('be.visible')
            });

            // Input an answer into the textarea
            const answer = 'Rozhodne nesúhlasím Rozhodne nesúhlasím';
            cy.get('.MuiInput-root').type(answer);

            cy.get('.MuiButton-contained').click();

            // Verify the content of the completion message
            cy.get('.MuiCardContent-root')
                .contains('הסקר שלך הושלם.')
                .should('be.visible');

            cy.get('.MuiCardContent-root')
                .contains(' לחץ על כפתור שליחה.')
                .should('be.visible');

            // Click the "Enviar" button
            cy.get('button')
                .contains('שלח')
                .should('be.visible') // Ensure the button is visible before clicking
                .click();

            // Verify the contents of the thank you message
            cy.get('.surv').within(() => {
                cy.get('h2').should('have.text', 'תודה רבה על תשובותיך!');
                cy.get('p').should('have.text', 'זה עוזר לנו ליצור מקום עבודה טוב יותר.');
            });

        });

    });
});
