import { fetchVerificationLink } from '../../../support/emailUtils';

describe('Survey Language Verify Test for bulk users- Bulgarian', () => {
    it('Survey language test - Fill survey with survey preffered language as Bulgarian', () => {

        const EXPECTED_SUBJECT = `TestAutomationSupport иска да знае вашето мнение`;

        // Fetch the verification link
        fetchVerificationLink(EXPECTED_SUBJECT).then((verificationUrl) => {
            cy.log('Verification URL:', verificationUrl);

            // Visit the verification link
            cy.visit(verificationUrl);

            cy.wait(12000);

            // Verify the header
            cy.get('h2').should('contain.text', 'Добре дошли в анкетата си.');

            // Verify the opinion expression message
            cy.get('p').should('contain.text', 'Споделете мнението си!');

            // Verify the agreement message
            cy.get('h5').should('contain.text', 'Като кликнете на следващия бутон, вие приемате да участвате в анкетата на вашата компания.');

            // Click the start button
            cy.get('button').contains('Започнете').click();

            // Verify the question text
            cy.get('.question-title-top p').should('contain.text', 'Намерихте ли това, което търсехте днес?');

            cy.get('ul > .MuiList-root > :nth-child(1)').click();

            // Verify the min and max labels
            cy.get('ul.rating-ui li.min').should('contain.text', 'Категорично несъгласен');
            cy.get('ul.rating-ui li.max').should('contain.text', 'Напълно съгласен');

            // Click the slider to set the value to 8
            cy.get('.MuiSlider-mark[data-index="7"]').click({ force: true });

            cy.get('p').should('contain.text', 'Кой сектор/отрасъл най-добре описва вашата компания?');

            // Enter a comment
            cy.get('textarea').first().type('Escreva sua resposta aqui');

            cy.get('.MuiButton-contained').click();

            // Verify the question text
            cy.get('.question-title-top p').should('contain.text', 'Какво е нивото ви на удовлетвореност от нашата поддръжка?');

            // Array of expected options
            const options = [
                'Напълно съгласен',
                'Донякъде съгласен',
                'Неутрален',
                'Донякъде не съм съгласен',
                'Категорично несъгласен'
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
                .contains('Вашата анкета е завършена.')
                .should('be.visible');

            cy.get('.MuiCardContent-root')
                .contains(' КЛИКНЕТЕ ВЪРХУ БУТОНА ИЗПРАТИ.')
                .should('be.visible');

            // Click the "Enviar" button
            cy.get('button')
                .contains('Изпрати')
                .should('be.visible') // Ensure the button is visible before clicking
                .click();

            // Verify the contents of the thank you message
            cy.get('.surv').within(() => {
                cy.get('h2').should('have.text', 'Вашата анкета е завършена.');
                cy.get('p').should('have.text', ' КЛИКНЕТЕ ВЪРХУ БУТОНА ИЗПРАТИ.');
            });

        });

    });
});
