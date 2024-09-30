import { fetchVerificationLink } from '../../../support/emailUtils';

describe('Survey Language Verify Test for bulk users- Italian', () => {
    it('Survey language test - Fill survey with survey preffered language as Italian', () => {

        const EXPECTED_SUBJECT = `TestAutomationSupport vuole conoscere la tua opinione`;

        // Fetch the verification link
        fetchVerificationLink(EXPECTED_SUBJECT).then((verificationUrl) => {
            cy.log('Verification URL:', verificationUrl);

            // Visit the verification link
            cy.visit(verificationUrl);


            cy.wait(12000);

            // Verify the header
            cy.get('h2').should('contain.text', 'Benvenuto al tuo sondaggio.');

            // Verify the opinion expression message
            cy.get('p').should('contain.text', 'Condividi la tua opinione!');

            // Verify the agreement message
            cy.get('h5').should('contain.text', 'Cliccando sul pulsante successivo, accetti di partecipare al sondaggio della tua azienda.');

            // Click the start button
            cy.get('button').contains('Inizia').click();

            // Verify the question text
            cy.get('.question-title-top p').should('contain.text', 'Ma megtaláltad, amit kerestél?');

            cy.get('ul > .MuiList-root > :nth-child(1)').click();

            // Verify the min and max labels
            cy.get('ul.rating-ui li.min').should('contain.text', 'határozottan nem értek egyet');
            cy.get('ul.rating-ui li.max').should('contain.text', 'Teljesen egyetértek');

            // Click the slider to set the value to 8
            cy.get('.MuiSlider-mark[data-index="7"]').click({ force: true });

            cy.get('p').should('contain.text', 'Melyik ágazat/ágazat jellemzi legjobban az Ön cégét?');

            // Enter a comment
            cy.get('textarea').first().type('Ce verticală sector');

            cy.get('.MuiButton-contained').click();

            // Verify the question text
            cy.get('.question-title-top p').should('contain.text', 'Mennyire elégedett a támogatásunkkal?');

            // Array of expected options
            const options = [
                "Sono d'accordo",
                "In parte sono d'accordo",
                'Neutro',
                "In parte non sono d'accordo",
                "Non sono d'accordo"
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
                .contains('Il tuo sondaggio è completo.')
                .should('be.visible');

            cy.get('.MuiCardContent-root')
                .contains(' CLICCA SUL PULSANTE INVIA.')
                .should('be.visible');

            // Click the "Enviar" button
            cy.get('button')
                .contains('Invia')
                .should('be.visible') // Ensure the button is visible before clicking
                .click();

            // Verify the contents of the thank you message
            cy.get('.surv').within(() => {
                cy.get('h2').should('have.text', 'Grazie per le tue risposte!');
                cy.get('p').should('have.text', 'Ci aiuta a creare un ambiente di lavoro migliore.');
            });

        });

    });
});
