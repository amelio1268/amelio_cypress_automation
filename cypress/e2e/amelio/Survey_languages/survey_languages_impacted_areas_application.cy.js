describe('Survey impacted areas verification', () => {
    const expectedLanguages = [
        { value: 'fr', text: 'French' },
        { value: 'es', text: 'Spanish' },
        { value: 'vi', text: 'Vietnamese' },
        { value: 'tl', text: 'Tagalog' },
        { value: 'de', text: 'German' },
        { value: 'pt', text: 'Portuguese' },
        { value: 'zh', text: 'Chinese (Mandarin)' },
        { value: 'hu', text: 'Hungarian' },
        { value: 'it', text: 'Italian' },
        { value: 'th', text: 'Thai (Thailand)' },
        { value: 'tr', text: 'Turkish' },
        { value: 'pt_BR', text: 'Brazilian Portuguese' },
        { value: 'ro', text: 'Romanian' },
        { value: 'cs', text: 'Czech' },
        { value: 'he', text: 'Hebrew' },
        { value: 'sk', text: 'Slovak' },
        { value: 'km', text: 'Cambodian' },
        { value: 'bg', text: 'Bulgarian' }
    ];

    const login = () => {
        cy.visit('https://testapp.amelio.co/');
        cy.wait(8000);
        cy.get('input[name="Username"]').type("qekvs.testautomationsupport@yopmail.com");
        cy.get('input[name="Password"]').type('Centrify@123');
        cy.get('button[type="submit"]').click();
        cy.wait(5000);
    };

    const verifyLanguages = () => {
        cy.get('#language-selector-select').click();
        expectedLanguages.forEach(({ value, text }) => {
            cy.get(`li[data-value="${value}"]`).should('exist').and('contain', text);
        });
    };

    const visitAndVerify = (url) => {
        cy.visit(url);
        cy.wait(20000);
        verifyLanguages();
    };

    it('Verifying Survey languages impacted areas in the application', () => {
        login();

        cy.visit('https://testapp.amelio.co/Admin/CompanyDetails');
        cy.wait(16000);
        cy.get('button').contains('Edit Company Details').click();

        //Verify language chips
        const languages = [
            'English',
            'French',
            'Spanish',
            'Vietnamese',
            'Tagalog',
            'German',
            'Portuguese',
            'Chinese (Mandarin)',
            'Hungarian',
            'Italian',
            'Thai (Thailand)',
            'Turkish',
            'Brazilian Portuguese',
            'Romanian',
            'Czech',
            'Hebrew',
            'Slovak',
            'Cambodian',
            'Bulgarian'
        ];

        languages.forEach(language => {
            cy.get('.MuiChip-label').contains(language).should('be.visible');
        });

        // // Verify dropdown languages in different sections
        // visitAndVerify('https://testapp.amelio.co/Admin/Department');
        // visitAndVerify('https://testapp.amelio.co/Admin/EmployeeLevel');
        // visitAndVerify('https://testapp.amelio.co/Admin/JobTitle');
        // visitAndVerify('https://testapp.amelio.co/Admin/Workplace');
        // visitAndVerify('https://testapp.amelio.co/Admin/CustomAttribute1');
        // visitAndVerify('https://testapp.amelio.co/Admin/CustomAttribute2');
        // visitAndVerify('https://testapp.amelio.co/Admin/CustomAttribute3');

        // Verifying attribute through Excel file
        visitAndVerify('https://testapp.amelio.co/Admin/Department');


        cy.get('.MuiButton-root > .MuiTypography-root')
            .contains('+ Add New Value')

        cy.get('.MuiButton-root > .MuiTypography-root').click({ force: true });

        cy.get('body').click();

        // Enter a new value in the English title input
        // cy.get('input[name="customAttributeValues[0].titles.en"]')
        //     .type('Test');

        // Click the "Update" button
        //cy.get('button').contains('Update').click();

        cy.get('[aria-label=""] > .MuiButton-root').click()

        cy.wait(4000);

        // Path to the Excel file
        const path_to_excel = 'C:\\Users\\QA-lead\\Documents\\Cypress-POC\\cypress\\downloads\\Amélio_Attribute_automation_test.xlsx';

        // Wait for the dialog to appear
        cy.get('.MuiDialogContent-root', { timeout: 10000 }).should('be.visible');

        // Click the button to open the upload file window
        cy.get('.upload-question-list > div').contains('Upload Translation File').click();

        // Select the file input and upload the Excel file, forcing the action
        cy.get('input[type="file"]')
            .selectFile(path_to_excel, { force: true });

        const languagesToVerify = [
            { name: 'English', expectedValue: 'Test', inputName: 'customAttributeValues[0].titles.en' },
            { name: 'Tagalog', expectedValue: 'pagsusulit', inputName: 'customAttributeValues[0].titles.tl' },
            { name: 'Spanish', expectedValue: 'examen', inputName: 'customAttributeValues[0].titles.es' },
            { name: 'French', expectedValue: 'test', inputName: 'customAttributeValues[0].titles.fr' },
            { name: 'Vietnamese', expectedValue: 'kiểm tra', inputName: 'customAttributeValues[0].titles.vi' },
            { name: 'German', expectedValue: 'Prüfung', inputName: 'customAttributeValues[0].titles.de' },
            { name: 'Italian', expectedValue: 'test', inputName: 'customAttributeValues[0].titles.it' },
            { name: 'Portuguese', expectedValue: 'teste', inputName: 'customAttributeValues[0].titles.pt' },
            { name: 'Chinese', expectedValue: '测试', inputName: 'customAttributeValues[0].titles.zh' },
            { name: 'Hungarian', expectedValue: 'vizsga', inputName: 'customAttributeValues[0].titles.hu' },
            { name: 'Thai', expectedValue: 'การทดสอบ', inputName: 'customAttributeValues[0].titles.th' },
            { name: 'Turkish', expectedValue: 'test', inputName: 'customAttributeValues[0].titles.tr' },
        ];

        languagesToVerify.forEach(language => {
            it(`should reflect the correct value for ${language.name}`, () => {
                // Step 1: Select the language to translate from the dropdown
                cy.get('#language-selector-select').click(); // Open the dropdown
                cy.get('li').contains(language.name).click(); // Select the language

                // Step 2: Verify the input value for the selected language
                cy.get(`input[name="${language.inputName}"]`).should('have.value', language.expectedValue);
            });
        });

        // Ensure the relevant section is loaded
        cy.get('.attribute-row').should('exist');

        // Hover over the specific div element to make the delete icon visible
        cy.get('.MuiGrid-root.MuiGrid-container.attribute-row.profile-boxes-card-table')
            .trigger('mouseover'); // Trigger the hover action

        // Now try to find and click the delete icon
        cy.get('.attribute-delete-btn svg[data-testid="DeleteForeverIcon"]').click({ force: true }); // Click the icon, forcing if necessary

        // Handle confirmation dialog if it appears
        cy.get('.MuiDialogActions-root').should('be.visible'); // Check if confirmation dialog is visible
        cy.get('button').contains('Ok').click(); // Click the "Ok" button to confirm deletion


        // Verifying Feedback Customization page

        cy.visit("https://testapp.amelio.co/Admin/Customizations/Feedback");

        const languagesToVerifyFeedback = [
            { name: 'English', expectedValue: "I hear it's your party", inputName: 'feedbackCustomization[0].descriptions.en' },
            { name: 'Tagalog', expectedValue: 'Naririnig ko na ang party mo.', inputName: 'feedbackCustomization[0].descriptions.tl' },
            { name: 'Spanish', expectedValue: "He oído que es tu fiesta", inputName: 'feedbackCustomization[0].descriptions.es' },
            { name: 'French', expectedValue: "Il paraît que c'est ta fête", inputName: 'feedbackCustomization[0].descriptions.fr' },
            { name: 'Vietnamese', expectedValue: 'Tôi nghe nói đó là bữa tiệc của bạn.', inputName: 'feedbackCustomization[0].descriptions.vi' }
        ];

        languagesToVerifyFeedback.forEach(language => {
            it(`should reflect the correct value for ${language.name}`, () => {
                // Step 1: Select the language to translate from the dropdown
                cy.get('#language-selector-select').click(); // Open the dropdown
                cy.get('li').contains(language.name).click(); // Select the language

                // Step 2: Verify the input value for the selected language
                cy.get(`input[name="${language.inputName}"]`).should('have.value', language.expectedValue);
            });
        });

        //Verifying Suggestions- Get Ideas section

        cy.visit("https://testapp.amelio.co/Admin/Customizations/Suggestions");
        cy.wait(12000);

        // Click the button
        cy.get('button.MuiTab-root').contains('Ideas & suggestions').click();

        //cy.get('#mui-p-3817-T-Suggestions').click();

        cy.get('button.MuiButton-contained').contains('Add Subject').click();

        cy.get('.css-kyse2m > .MuiButton-root').click();

        //cy.wait(5000);

        cy.get('input[type="radio"][name="radio-buttons"]').first().check();

        cy.get('.MuiDialogActions-root > .MuiLoadingButton-root').click();

        const languagesGetIdeas = {
            en: {
                title: "Disrupt the industry",
                subject: "If you could only work on one project for a year to transform the business, what would it be and why?",
            },
            es: {
                title: "Disruptir la industria",
                subject: "Si solo pudieras trabajar en un proyecto durante un año para transformar el negocio, ¿cuál sería y por qué?",
            },
            fr: {
                title: "Perturber l'industrie",
                subject: "Si vous ne pouviez travailler sur un projet pendant un an pour transformer l'entreprise, lequel serait-ce et pourquoi ?",
            },
            de: {
                title: "Die Branche revolutionieren",
                subject: "Wenn Sie nur ein Jahr lang an einem Projekt arbeiten könnten, um das Unternehmen zu transformieren, welches wäre das und warum?",
            },
            it: {
                title: "Disturbare l'industria",
                subject: "Se potessi lavorare su un solo progetto per un anno per trasformare l'azienda, quale sarebbe e perché?",
            },
        };

        Object.keys(languagesGetIdeas).forEach((lang) => {
            it(`should update inputs correctly for ${lang}`, () => {
                // Change the language selector
                cy.get('#language-selector-select').click();
                cy.contains(lang).click();

                // Verify the title input field
                cy.get('input[name="titles"]').should('have.value', languagesGetIdeas[lang].title);

                // Verify the subject input field
                cy.get('input[name="subjectTitles"]').should('have.value', languagesGetIdeas[lang].subject);
            });
        });

    });

});


