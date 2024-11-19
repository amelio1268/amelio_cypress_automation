import { fetchVerificationLink } from '../../../support/emailUtils';

describe('Survey Language Verify Test for bulk users- Portuguese', () => {
    it('Survey language test - Fill survey with survey preffered language as Portuguese', () => {

        const EXPECTED_SUBJECT = `TestAutomationSupport quer saber a sua opinião`;

        // Fetch the verification link
        fetchVerificationLink(EXPECTED_SUBJECT).then((verificationUrl) => {
            cy.log('Verification URL:', verificationUrl);

            // Visit the verification link
            cy.visit(verificationUrl);


            cy.wait(12000);

            // Verify the header
            cy.get('h2').should('contain.text', 'Bem-vindo à sua pesquisa.');

            // Verify the opinion expression message
            cy.get('p').should('contain.text', 'Compartilhe sua opinião!');

            // Verify the agreement message
            cy.get('h5').should('contain.text', 'Ao clicar no próximo botão, você concorda em participar da pesquisa da sua empresa.');

            // Click the start button
            cy.get('button').contains('Começar').click();

            // Verify the question text
            cy.get('.question-title-top p').should('contain.text', 'Você encontrou o que procurava hoje?');

            cy.get('ul > .MuiList-root > :nth-child(1)').click();

            // Verify the min and max labels
            cy.get('ul.rating-ui li.min').should('contain.text', 'Discordo totalmente');
            cy.get('ul.rating-ui li.max').should('contain.text', 'Concordo plenamente');

            // Click the slider to set the value to 8
            cy.get('.MuiSlider-mark[data-index="7"]').click({ force: true });

            cy.get('p').should('contain.text', 'Qual vertical/setor melhor descreve sua empresa?');

            // Enter a comment
            cy.get('textarea').first().type('Escreva sua resposta aqui');

            cy.get('.MuiButton-contained').click();

            // Verify the question text
            cy.get('.question-title-top p').should('contain.text', 'Qual é seu nível de satisfação com nosso suporte?');

            // Array of expected options
            const options = [
                'Concordo totalmente',
                'Concordo em parte',
                'Neutro',
                'Discordo em parte',
                'Discordo totalmente'
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
                .contains('Sua pesquisa está completa.')
                .should('be.visible');

            cy.get('.MuiCardContent-root')
                .contains('CLIQUE NO BOTÃO ENVIAR.')
                .should('be.visible');

            // Click the "Enviar" button
            cy.get('button')
                .contains('Enviar')
                .should('be.visible') // Ensure the button is visible before clicking
                .click();

            // Verify the contents of the thank you message
            cy.get('.surv').within(() => {
                cy.get('h2').should('have.text', 'Obrigado por suas respostas!');
                cy.get('p').should('have.text', 'Isso nos ajuda a criar um ambiente de trabalho melhor.');
            });

        });

    });
});
