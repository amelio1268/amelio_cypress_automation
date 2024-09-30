import { fetchVerificationLink } from '../../../support/emailUtils';

describe('Survey Language Verify Test for bulk users- Romanian', () => {
    it('Survey language test - Fill survey with survey preffered language as Romanian', () => {
        const EXPECTED_SUBJECT = `TestAutomationSupport vrea să știe părerea ta`;

        // Fetch the verification link
        fetchVerificationLink(EXPECTED_SUBJECT).then((verificationUrl) => {
            cy.log('Verification URL:', verificationUrl);

            // Visit the verification link
            cy.visit(verificationUrl);


            cy.wait(12000);

            // Verify the header
            cy.get('h2').should('contain.text', 'Bienvenido/a a su encuesta.');

            // Verify the opinion expression message
            cy.get('p').should('contain.text', '¡Dé a conocer su opinión!');

            // Verify the agreement message
            cy.get('h5').should('contain.text', 'Al hacer clic en el botón siguiente, acepta participar en la encuesta de su empresa.');

            // Click the start button
            cy.get('button').contains('Comenzar').click();

            // Verify the question text
            cy.get('.question-title-top p').should('contain.text', 'Ai găsit ceea ce căutai astăzi?');

            cy.get('ul > .MuiList-root > :nth-child(1)').click();

            // Verify the min and max labels
            cy.get('ul.rating-ui li.min').should('contain.text', 'Dezacord total');
            cy.get('ul.rating-ui li.max').should('contain.text', 'Acord total');

            // Click the slider to set the value to 8
            cy.get('.MuiSlider-mark[data-index="7"]').click({ force: true });

            cy.get('p').should('contain.text', 'Ce verticală/sector descrie cel mai bine compania dvs.?');

            // Enter a comment
            cy.get('textarea').first().type('Ce verticală sector');

            cy.get('.MuiButton-contained').click();

            // Verify the question text
            cy.get('.question-title-top p').should('contain.text', 'Care este nivelul dvs. de satisfacție cu suportul nostru?');

            // Array of expected options
            const options = [
                'Total acord',
                'Acord parțial',
                'Neutru',
                'Dezacord parțial',
                'Total dezacord'
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
                .contains('Se ha completado su encuesta.')
                .should('be.visible');

            cy.get('.MuiCardContent-root')
                .contains(' HAGA CLIC EN EL BOTÓN ENVIAR.')
                .should('be.visible');

            // Click the "Enviar" button
            cy.get('button')
                .contains('Trimite')
                .should('be.visible') // Ensure the button is visible before clicking
                .click();

            // Verify the contents of the thank you message
            cy.get('.surv').within(() => {
                cy.get('h2').should('have.text', '¡Muchas gracias por sus respuestas!');
                cy.get('p').should('have.text', 'Nos ayuda a crear un lugar de trabajo mejor.');
            });

        });

    });
});
