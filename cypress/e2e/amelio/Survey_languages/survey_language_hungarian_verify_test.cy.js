import { fetchVerificationLink } from '../../../support/emailUtils';

describe('Survey Language Verify Test for bulk users- Hungarian', () => {
    it('Survey language test - Fill survey with survey preffered language as Hungarian', () => {

        const EXPECTED_SUBJECT = `TestAutomationSupport szeretné tudni a véleményét`;

        // Fetch the verification link
        fetchVerificationLink(EXPECTED_SUBJECT).then((verificationUrl) => {
            cy.log('Verification URL:', verificationUrl);

            // Visit the verification link
            cy.visit(verificationUrl);

            cy.wait(12000);

            // Verify the header text
            cy.get('h2').contains('Üdvözöljük a felmérésén.').should('be.visible');

            // Verify the paragraph text
            cy.get('p').contains('Ossza meg véleményét!').should('be.visible');

            // Verify the h5 text
            cy.get('h5').contains('A következő gombra kattintva elfogadja, hogy részt vesz vállalata felmérésében.').should('be.visible');

            // Verify the button text and its classes
            cy.get('button.btnstart').contains('Kezd').click()

            // Verify the question text
            cy.contains('Ma megtaláltad, amit kerestél?').should('exist');

            // Verify the options
            cy.contains('Igen').should('exist');
            cy.contains('Nem').should('exist');

            // Verify the comment section
            cy.get('label[for="mui-1"]').contains('Megjegyzés hozzáadása').should('exist');

            // Click on an option (you can choose either "Igen" or "Nem")
            cy.contains('Igen').click();

            // Verify the paragraph text
            cy.get('p').contains('Mennyire valószínű, hogy egy 0-10-ig terjedő skálán ajánl minket egy barátjának vagy kollégájának?').should('be.visible');

            // Click the slider to set the value to 8
            cy.get('.MuiSlider-mark[data-index="7"]').click({ force: true });

            // You can also type something into the text area
            cy.get('textarea#mui-3').type('Következő kérdés');

            // Click the Next button
            cy.contains('Következő kérdés').click();

            // Verify the question text
            cy.contains('Mennyire elégedett a támogatásunkkal?').should('exist');

            // Verify the satisfaction options
            const options = [
                'Határozottan egyetértek',
                'Néhányan egyetértek',
                'Semleges',
                'Néhányan nem értek egyet',
                'Határozottan nem értek egyet'
            ];

            options.forEach(option => {
                cy.contains(option).should('exist');
            });

            // Select one of the options (e.g., "Határozottan egyetértek")
            cy.contains('Határozottan egyetértek').click();

            // Verify the comment section
            cy.get('label[for="mui-7"]').contains('Megjegyzés hozzáadása').should('exist');


            // Provide input in the comment section
            cy.get('textarea#mui-7').type('Megjegyzés hozzáadása');

            // Verify the completion message
            cy.contains('A felmérés kitöltve. KATTINTSON A KÜLDÉS GOMBRA.').should('exist');

            // Verify the finish button is present and clickable
            cy.get('button.endbtn')
                .should('exist')
                .should('be.visible')
                .and('not.be.disabled')
                .click(); // Click the finish button


            // Verify the presence of the thank you heading
            cy.get('.surv h2').should('contain.text', 'Köszönjük válaszait!');

            // Verify the presence of the supporting message
            cy.get('.surv p').should('contain.text', 'Segít nekünk egy jobb munkakörnyezet létrehozásában.');

        });
    });

});