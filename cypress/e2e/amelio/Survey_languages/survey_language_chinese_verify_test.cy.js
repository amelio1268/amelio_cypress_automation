import { fetchVerificationLink } from '../../../support/emailUtils';

describe('Survey Language Verify Test for bulk users- Chinese', () => {
    it('Survey language test - Fill survey with survey preffered language as Chinese', () => {

        const EXPECTED_SUBJECT = `TestAutomationSupport 想知道您的意见`;

        // Fetch the verification link
        fetchVerificationLink(EXPECTED_SUBJECT).then((verificationUrl) => {
            cy.log('Verification URL:', verificationUrl);

            // Visit the verification link
            cy.visit(verificationUrl);

            cy.wait(12000);

            // Verify the title
            cy.get('h2').should('contain.text', '欢迎参加您的调查');

            // Verify the paragraph text
            cy.get('p').should('contain.text', '请分享您的意见！');

            // Verify the consent message
            cy.get('h5').should('contain.text', '点击下一步按钮，即表示您同意参加公司的调查');

            // Click the start button
            cy.get('button').contains('开始').click();

            // Verify the question text
            cy.get('.question-title-top p').should('contain', '您今天找到您要找的東西了嗎？');

            // Click on the "是" (Yes) option
            cy.get('.yes-no-list').contains('是').click();

            // Verify the selection
            //cy.get('.yes-no-list').contains('是').should('have.class', 'Mui-selected');

            // Type a comment in the textarea
            cy.get('textarea#mui-1').type('这是我的评论。');

            // Verify the comment was entered
            //cy.get('textarea#mui-1').should('have.value', '这是我的评论。');

            // Click the slider to set the value to 8
            cy.get('.MuiSlider-mark[data-index="7"]').click({ force: true });

            // Click the "下一个问题" (Next Question) button
            cy.get('.right-btn').click();

            // Verify the question text
            //cy.get('.question-title-top p').should('contain', '您對我們的支持滿意嗎？');

            // Click on the "强烈同意" (Strongly Agree) option
            cy.get('.multiple .MuiButtonBase-root').contains('强烈同意').click();

            // Type a comment in the textarea
            cy.get('textarea#mui-7').type('这是我的反馈。');

            // Verify the comment was entered
            // cy.get('textarea#mui-7').should('have.value', '这是我的反馈。');

            // Click the "下一个问题" (Next Question) button
            //cy.get('.right-btn').click();

            // Verify the completion message is displayed
            cy.get('.question-title-top .section-text')
                .should('contain', '您的调查已完成。')
                .and('contain', '点击发送按钮。');

            cy.get('.text-center > .MuiButton-root')
                .should('contain', '提交')
                .click();



        });
    });

});


