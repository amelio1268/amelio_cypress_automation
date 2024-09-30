import { fetchVerificationLink } from '../../../support/emailUtils';

describe('Survey Language Verify Test for bulk users- German', () => {
    it('Survey language test - Fill survey with survey preffered language as German', () => {

        const EXPECTED_SUBJECT = `TestAutomationSupport möchte Ihre Meinung wissen`;

        // Fetch the verification link
        fetchVerificationLink(EXPECTED_SUBJECT).then((verificationUrl) => {
            cy.log('Verification URL:', verificationUrl);

            // Visit the verification link
            cy.visit(verificationUrl);


            cy.wait(12000);

            // Verify the header
            cy.get('h2').should('contain.text', 'Willkommen zu Ihrer Umfrage.');

            // Verify the opinion expression message
            cy.get('p').should('contain.text', 'Teilen Sie Ihre Meinung!');

            // Verify the agreement message
            cy.get('h5').should('contain.text', 'Wenn Sie auf die nächste Schaltfläche klicken, stimmen Sie der Teilnahme an der Umfrage Ihres Unternehmens zu.');

            // Click the start button
            cy.get('button').contains('Starten').click();

            // Verify the question text
            cy.get('.question-title-top p').should('contain.text', 'Haben Sie heute gefunden, wonach Sie gesucht haben?');

            cy.get('ul > .MuiList-root > :nth-child(1)').click();

            // Verify the min and max labels
            cy.get('ul.rating-ui li.min').should('contain.text', 'Stimme überhaupt nicht zu');
            cy.get('ul.rating-ui li.max').should('contain.text', 'Stimme voll und ganz zu');

            // Click the slider to set the value to 8
            cy.get('.MuiSlider-mark[data-index="7"]').click({ force: true });

            cy.get('p').should('contain.text', 'Welche Branche/Branche beschreibt Ihr Unternehmen am besten?');

            // Enter a comment
            cy.get('textarea').first().type('Escreva sua resposta aqui');

            cy.get('.MuiButton-contained').click();

            // Verify the question text
            cy.get('.question-title-top p').should('contain.text', 'Wie zufrieden sind Sie mit unserer Unterstützung?');

            // Array of expected options
            const options = [
                'Stimme voll und ganz zu',
                'Stimme teilweise zu',
                'Neutral',
                'Stimme teilweise zu',
                'Stimme überhaupt nicht zu'
            ];

            // Loop through each expected option and verify its presence
            options.forEach(option => {
                cy.get('nav.MuiList-root')
                    .contains(option)
                    .should('be.visible')

            });

            // Input an answer into the textarea
            const answer = 'Pinagmamalaki ko ang magandang samahan sa aming team.';
            cy.get('.MuiInput-root').type(answer);

            cy.get('.MuiButton-contained').click();

            // Verify the content of the completion message
            cy.get('.MuiCardContent-root')
                .contains('Ihre Umfrage ist abgeschlossen.')
                .should('be.visible');

            cy.get('.MuiCardContent-root')
                .contains(' KLICKEN SIE AUF DEN SENDEN-BUTTON.')
                .should('be.visible');

            // Click the "Enviar" button
            cy.get('button')
                .contains('Einreichen')
                .should('be.visible') // Ensure the button is visible before clicking
                .click();

            // Verify the contents of the thank you message
            cy.get('.surv').within(() => {
                cy.get('h2').should('have.text', 'Vielen Dank für Ihre Antworten!');
                cy.get('p').should('have.text', 'Es hilft uns, eine bessere Arbeitsumgebung zu schaffen.');
            });

        });

    });
});
