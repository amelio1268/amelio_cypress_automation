import { fetchVerificationLink } from '../../../support/emailUtils';

describe('Survey Language Verify Test for bulk users- Brazilian Turkish', () => {
    it('Survey language test - Fill survey with survey preffered language as Turkish', () => {

        const EXPECTED_SUBJECT = `TestAutomationSupport görüşünüzü bilmek istiyor`;

        // Fetch the verification link
        fetchVerificationLink(EXPECTED_SUBJECT).then((verificationUrl) => {
            cy.log('Verification URL:', verificationUrl);

            // Visit the verification link
            cy.visit(verificationUrl);

            cy.wait(12000);

            // Verify the header
            cy.get('h2').should('contain.text', 'Anketinize hoş geldiniz.');

            // Verify the opinion expression message
            cy.get('p').should('contain.text', 'Fikrinizi paylaşın!');

            // Verify the agreement message
            cy.get('h5').should('contain.text', 'Sonraki düğmesine tıklayarak, şirketinizin anketine katılmayı kabul edersiniz.');

            // Click the start button
            cy.get('button').contains('Başlat').click();

            // Verify the question text
            cy.get('.question-title-top p').should('contain.text', 'Bugün aradığınızı buldunuz mu?');

            cy.get('ul > .MuiList-root > :nth-child(1)').click();

            // Verify the min and max labels
            cy.get('ul.rating-ui li.min').should('contain.text', 'Kesinlikle katılmıyorum');
            cy.get('ul.rating-ui li.max').should('contain.text', 'Kesinlikle katılıyorum');

            // Click the slider to set the value to 8
            cy.get('.MuiSlider-mark[data-index="7"]').click({ force: true });

            cy.get('p').should('contain.text', 'Hangi sektör/sektör şirketinizi en iyi şekilde tanımlıyor?');

            // Enter a comment
            cy.get('textarea').first().type('Ce verticală sector');

            cy.get('.MuiButton-contained').click();

            // Verify the question text
            cy.get('.question-title-top p').should('contain.text', 'Desteğimizden ne kadar memnunsunuz?');

            // Array of expected options
            const options = [
                'Kesinlikle katılıyorum',
                'Biraz katılıyorum',
                'Nötr',
                'Biraz katılmıyorum',
                'Kesinlikle katılmıyorum'
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
                .contains('Anketiniz tamamlandı.')
                .should('be.visible');

            cy.get('.MuiCardContent-root')
                .contains(' GÖNDER düğmesine tıklayın.')
                .should('be.visible');

            // Click the "Enviar" button
            cy.get('button')
                .contains('Gönder')
                .should('be.visible') // Ensure the button is visible before clicking
                .click();

            // Verify the contents of the thank you message
            cy.get('.surv').within(() => {
                cy.get('h2').should('have.text', 'Yanıtlarınız için teşekkür ederiz!');
                cy.get('p').should('have.text', 'Daha iyi bir çalışma ortamı yaratmamıza yardımcı oluyor.');
            });

        });

    });
});
