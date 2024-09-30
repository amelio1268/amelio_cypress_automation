import { fetchVerificationLink } from '../../../support/emailUtils';

describe('Survey Language Verify Test for bulk users- Slovak', () => {
    it('Survey language test - Fill survey with survey preffered language as Slovak', () => {

        const EXPECTED_SUBJECT = `TestAutomationSupport chce poznať váš názor`;

        // Fetch the verification link
        fetchVerificationLink(EXPECTED_SUBJECT).then((verificationUrl) => {
            cy.log('Verification URL:', verificationUrl);

            // Visit the verification link
            cy.visit(verificationUrl);


            cy.wait(12000);

            // Verify the header
            cy.get('h2').should('contain.text', 'Vitajte vo svojej ankete.');

            // Verify the opinion expression message
            cy.get('p').should('contain.text', 'Vyjadrite svoj názor!');

            // Verify the agreement message
            cy.get('h5').should('contain.text', 'Kliknutím na nasledujúce tlačidlo súhlasíte s účasťou na ankete vo vašej spoločnosti.');

            // Click the start button
            cy.get('button').contains('Začať').click();

            // Verify the question text
            cy.get('.question-title-top p').should('contain.text', 'Našli ste dnes to, čo ste hľadali?');

            cy.get('ul > .MuiList-root > :nth-child(1)').click();

            // Verify the min and max labels
            cy.get('ul.rating-ui li.min').should('contain.text', 'Rozhodne nesúhlasím');
            cy.get('ul.rating-ui li.max').should('contain.text', 'Dôrazne súhlasím');

            // Click the slider to set the value to 8
            cy.get('.MuiSlider-mark[data-index="7"]').click({ force: true });

            cy.get('p').should('contain.text', 'Ktor媒 vertik谩lny/odvetvie najlep拧ie vystihuje va拧u spolo膷nos钮?');

            // Enter a comment
            cy.get('textarea').first().type('វិស័យណាដែលពិពណ៌ន');

            cy.get('.MuiButton-contained').click();

            // Verify the question text
            cy.get('.question-title-top p').should('contain.text', 'Aká je vaša úroveň spokojnosti s našou podporou?');

            // Array of expected options
            const options = [
                'Dôrazne súhlasím',
                'Trochu súhlas',
                'Neutrálne',
                'Trochu nesúhlasím',
                'Rozhodne nesúhlasím'
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
                .contains('Vaša anketa bola dokončená.')
                .should('be.visible');

            cy.get('.MuiCardContent-root')
                .contains(' KLIKNITE NA TLAČIDLO ODOSLAŤ.')
                .should('be.visible');

            // Click the "Enviar" button
            cy.get('button')
                .contains('Odoslať')
                .should('be.visible') // Ensure the button is visible before clicking
                .click();

            // Verify the contents of the thank you message
            cy.get('.surv').within(() => {
                cy.get('h2').should('have.text', 'Ďakujeme za vaše odpovede!');
                cy.get('p').should('have.text', 'Pomáhate nám vytvárať lepšie pracovisko.');
            });

        });

    });
});
