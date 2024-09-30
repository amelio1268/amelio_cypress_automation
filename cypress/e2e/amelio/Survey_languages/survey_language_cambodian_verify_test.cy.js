import { fetchVerificationLink } from '../../../support/emailUtils';

describe('Survey Language Verify Test for bulk users- Cambodian', () => {
    it('Survey language test - Fill survey with survey preffered language as cambodian', () => {

        const EXPECTED_SUBJECT = `TestAutomationSupport ចង់ដឹងពីមតិយោបល់របស់អ្នក`;

        // Fetch the verification link
        fetchVerificationLink(EXPECTED_SUBJECT).then((verificationUrl) => {
            cy.log('Verification URL:', verificationUrl);

            // Visit the verification link
            cy.visit(verificationUrl);


            cy.wait(12000);

            // Verify the header
            cy.get('h2').should('contain.text', 'សូមស្វាគមន៍មកកាន់សំណួររបស់អ្នក។');

            // Verify the opinion expression message
            cy.get('p').should('contain.text', 'សូមឲ្យអានសំណួររបស់អ្នក!');

            // Verify the agreement message
            cy.get('h5').should('contain.text', 'នៅពេលចុចប៊ូតុងបន្ទាប់ អ្នកយល់ព្រមចូលរួមក្នុងសំណួររបស់ក្រុមហ៊ុនអ្នក។');

            // Click the start button
            cy.get('button').contains('ចាប់ផ្តើម').click();

            // Verify the question text
            cy.get('.question-title-top p').should('contain.text', 'តើអ្នកបានរកឃើញអ្វីដែលអ្នកកំពុងស្វែងរកថ្ងៃនេះទេ?');

            cy.get('ul > .MuiList-root > :nth-child(1)').click();

            // Verify the min and max labels
            cy.get('ul.rating-ui li.min').should('contain.text', 'មិនយល់ស្របយ៉ាងខ្លាំង');
            cy.get('ul.rating-ui li.max').should('contain.text', 'យល់ស្របយ៉ាងខ្លាំង');

            // Click the slider to set the value to 8
            cy.get('.MuiSlider-mark[data-index="7"]').click({ force: true });

            cy.get('p').should('contain.text', 'តើផ្នែក/វិស័យណាដែលពិពណ៌នាអាជីវកម្មរបស់អ្នកបានល្អបំផុត?');

            // Enter a comment
            cy.get('textarea').first().type('វិស័យណាដែលពិពណ៌ន');

            cy.get('.MuiButton-contained').click();

            // Verify the question text
            cy.get('.question-title-top p').should('contain.text', 'តើអ្នកមានកម្រិតពេញចិត្តប៉ុន្មានចំពោះការគាំទ្ររបស់យើងខ្ញុំ?');

            // Array of expected options
            const options = [
                'យល់ស្របយ៉ាងខ្លាំង',
                'យល់ស្របខ្លះ',
                'អព្យាក្រឹត',
                'មិនយល់ស្របខ្លះ',
                'មិនយល់ស្របយ៉ាងខ្លាំង'
            ];

            // Loop through each expected option and verify its presence
            options.forEach(option => {
                cy.get('nav.MuiList-root')
                    .contains(option)
                    .should('be.visible')
            });

            // Input an answer into the textarea
            const answer = 'Какво е нивото ви на удовлетвореност от нашата';
            cy.get('.MuiInput-root').type(answer);

            cy.get('.MuiButton-contained').click();

            // Verify the content of the completion message
            cy.get('.MuiCardContent-root')
                .contains('សំណួររបស់អ្នកបានបញ្ចប់។')
                .should('be.visible');

            cy.get('.MuiCardContent-root')
                .contains(' សូមចុចប៊ូតុងផ្ញើ។')
                .should('be.visible');

            // Click the "Enviar" button
            cy.get('button')
                .contains('ផ្ញើ')
                .should('be.visible') // Ensure the button is visible before clicking
                .click();

            // Verify the contents of the thank you message
            cy.get('.surv').within(() => {
                cy.get('h2').should('have.text', 'សូមអរគុណសម្រាប់ចម្លើយរបស់អ្នក!');
                cy.get('p').should('have.text', 'វាជួយយើងក្នុងការបង្កើតកន្លែងធ្វើការដែលល្អប្រសើរ។');
            });

        });

    });
});
