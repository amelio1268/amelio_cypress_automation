import { fetchVerificationLink } from '../../../support/emailUtils';

describe('Survey Language Verify Test for bulk users- Thai', () => {
    it('Survey language test - Fill survey with survey preffered language as Thai', () => {
        const EXPECTED_SUBJECT = `TestAutomationSupport ต้องการทราบความคิดเห็นของคุณ`;

        // Fetch the verification link
        fetchVerificationLink(EXPECTED_SUBJECT).then((verificationUrl) => {
            cy.log('Verification URL:', verificationUrl);

            // Visit the verification link
            cy.visit(verificationUrl);


            cy.wait(12000);

            // Verify the header
            cy.get('h2').should('contain.text', 'ยินดีต้อนรับสู่แบบสอบถามของคุณ');

            // Verify the opinion expression message
            cy.get('p').should('contain.text', 'แบ่งปันความคิดเห็นของคุณ!');

            // Verify the agreement message
            cy.get('h5').should('contain.text', 'เมื่อคุณคลิกปุ่มถัดไป คุณยินยอมที่จะเข้าร่วมแบบสอบถามของบริษัทของคุณ');

            // Click the start button
            cy.get('button').contains('เริ่มต้น').click();

            // Verify the question text
            cy.get('.question-title-top p').should('contain.text', 'วันนี้คุณพบสิ่งที่คุณกำลังมองหาแล้วหรือยัง?');

            cy.get('ul > .MuiList-root > :nth-child(1)').click();

            // Verify the min and max labels
            cy.get('ul.rating-ui li.min').should('contain.text', 'ไม่เห็นด้วยอย่างยิ่ง');
            cy.get('ul.rating-ui li.max').should('contain.text', 'เห็นด้วยอย่างยิ่ง');

            // Click the slider to set the value to 8
            cy.get('.MuiSlider-mark[data-index="7"]').click({ force: true });

            cy.get('p').should('contain.text', 'ประเภทธุรกิจ/อุตสาหกรรมใดที่อธิบายบริษัทของคุณได้ดีที่สุด?');

            // Enter a comment
            cy.get('textarea').first().type('Ce verticală sector');

            cy.get('.MuiButton-contained').click();

            // Verify the question text
            cy.get('.question-title-top p').should('contain.text', 'คุณพอใจกับการสนับสนุนของเรามากน้อยเพียงใด');

            // Array of expected options
            const options = [
                'เห็นด้วยอย่างยิ่ง',
                'ค่อนข้างเห็นด้วย',
                'กลางๆ',
                'ไม่ค่อยเห็นด้วย',
                'ไม่เห็นด้วยอย่างยิ่ง'
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
                .contains('แบบสอบถามของคุณเสร็จสมบูรณ์แล้ว.')
                .should('be.visible');

            cy.get('.MuiCardContent-root')
                .contains(' คลิกที่ปุ่มส่ง')
                .should('be.visible');

            // Click the "Enviar" button
            cy.get('button')
                .contains('ส่ง')
                .should('be.visible') // Ensure the button is visible before clicking
                .click();

            // Verify the contents of the thank you message
            cy.get('.surv').within(() => {
                cy.get('h2').should('have.text', 'ขอบคุณสำหรับคำตอบของคุณ!');
                cy.get('p').should('have.text', 'มันช่วยให้เราสร้างสภาพแวดล้อมการทำงานที่ดีขึ้น');
            });

        });

    });
});
