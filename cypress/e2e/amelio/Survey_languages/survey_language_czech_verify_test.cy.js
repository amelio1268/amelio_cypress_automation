import { fetchVerificationLink } from '../../../support/emailUtils';

describe('Survey Language Verify Test for bulk users- Czech', () => {
    it('Survey language test - Fill survey with survey preffered language as Czech', () => {

        const EXPECTED_SUBJECT = `TestAutomationSupport chce znát váš názor`;

        // Fetch the verification link
        fetchVerificationLink(EXPECTED_SUBJECT).then((verificationUrl) => {
            cy.log('Verification URL:', verificationUrl);

            // Visit the verification link
            cy.visit(verificationUrl);


            cy.wait(12000);

            // Verify the header
            cy.get('h2').should('contain.text', 'Vítejte ve své anketě.');

            // Verify the opinion expression message
            cy.get('p').should('contain.text', 'Dejte najevo svou zpětnou vazbu!');

            // Verify the agreement message
            cy.get('h5').should('contain.text', 'Kliknutím na následující tlačítko souhlasíte s účastí na anketě vaší společnosti.');

            // Click the start button
            cy.get('button').contains('Začít').click();

            // Verify the question text
            cy.get('.question-title-top p').should('contain.text', 'Našli jste dnes, co jste hledali?');

            cy.get('ul > .MuiList-root > :nth-child(1)').click();

            // Verify the min and max labels
            cy.get('ul.rating-ui li.min').should('contain.text', 'Rozhodně nesouhlasím');
            cy.get('ul.rating-ui li.max').should('contain.text', 'Rozhodně souhlasím');

            // Click the slider to set the value to 8
            cy.get('.MuiSlider-mark[data-index="7"]').click({ force: true });

            cy.get('p').should('contain.text', 'Který vertikální/obor nejlépe popisuje vaši firmu?');

            // Enter a comment
            cy.get('textarea').first().type('מה רמת שביעות הרצון');

            cy.get('.MuiButton-contained').click();

            // Verify the question text
            cy.get('.question-title-top p').should('contain.text', 'Jaká je vaše úroveň spokojenosti s naší podporou?');

            // Array of expected options
            const options = [
                'Rozhodně souhlasím',
                'Trochu souhlas',
                'Neutrální',
                'Poněkud nesouhlasím',
                'Rozhodně nesouhlasím'
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
                .contains('Vaše anketa byla dokončena.')
                .should('be.visible');

            cy.get('.MuiCardContent-root')
                .contains(' KLIKNĚTE NA TLAČÍTKO ODESLAT.')
                .should('be.visible');

            // Click the "Enviar" button
            cy.get('button')
                .contains('Odeslat')
                .should('be.visible') // Ensure the button is visible before clicking
                .click();

            // Verify the contents of the thank you message
            cy.get('.surv').within(() => {
                cy.get('h2').should('have.text', 'Děkujeme za vaše odpovědi!');
                cy.get('p').should('have.text', 'Pomáháte nám vytvářet lepší pracovní prostředí.');
            });

        });

    });
});
