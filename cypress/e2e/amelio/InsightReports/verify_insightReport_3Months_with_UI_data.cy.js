describe('Extract all UI data as per the insight reports and verify the correct data againt each section', () => {
    let categoriesData = {}; 
    let StrengthWeaknessData = {};
    let typeAndScores = [];

    before(() => {
        cy.test_env_login();
        cy.visit('https://testapp.amelio.co/Results/ExecutiveReport');
        cy.wait(15000);
        // Find and click the "Global Report" radio button using its label
        cy.contains('label', 'Global Report')
            .find('input[type="radio"]')
            .check({ force: true });
        cy.wait(7000);

        // Find and click the "Insights Report" button using its text
        cy.contains('button', 'Insights Report')
            .click({ force: true });

        cy.wait(30000);
        // Find and click the notification icon
        cy.get('.btn-icon.mobile-notification-icon')
            .click({ force: true });
        cy.wait(7000);    
        
        cy.get('#notificationPanel')
          .find('.px-4.d-flex.flex-stack.py-4.pointer.bg-light-success.border-bottom')
          .first()
          .click({ force: true });

        cy.wait(17000);  
        
        cy.get(':nth-child(2) > .symbol-circle').click({ force: true });
        cy.wait(6000);
        cy.get(':nth-child(2) > .menu > .mb-3 > .menu-link').click(); 

        const pptxPath = 'C:/Users/QA-lead/Downloads/Global Insights Report November 07, 2024 10_29 am.pptx';
        const pdfPath = pptxPath.replace('.pptx', '.pdf'); // Corresponding PDF path

        cy.task('convertPptxToPdf', pptxPath).then((message) => {
            cy.log(message);

            cy.task('parsePdf', pdfPath).then((pdfData) => {
                const rawText = pdfData.text;
                const formattedText = rawText.replace(/\n+/g, '\n').trim();

                const jsonData = {
                    text: formattedText,
                    metadata: pdfData.metadata,
                    info: pdfData.info
                };

                cy.writeFile('cypress/fixtures/parsedPdfData.json', jsonData);
            });
        });

    });

    beforeEach(() => {
        // Visit the URL and log in once
        cy.test_env_login();
        cy.visit('https://testapp.amelio.co/Results/Overview');
        cy.wait(16000);
    });

    

    const extractAllQuestionsAndResults = () => {
        const questionsData = [];
        cy.get('.graph-card-container').each(($questionElement, index) => {
            const questionData = {};

            // Extract the title
            questionData.title = $questionElement.find('h4').text().trim();

            // Extract and slice the type
            const typeText = $questionElement.find('h3').text().trim();
            questionData.type = typeText;
            questionData.trimmedType = typeText.slice(0, -7); 

            // Extract the answered text
            questionData.answered = $questionElement.find('p').text().trim();

            // Extract the average score
            questionData.averageScore = $questionElement.find('.average-btn b').text().trim();

           // Store both full and trimmed types for verification
           typeAndScores.push({ type: questionData.type, trimmedType: questionData.trimmedType, averageScore: questionData.averageScore });

            // Extract ratings
            questionData.results = [];
            $questionElement.find('.box-rate').each((_, box) => {
                const value = Cypress.$(box).find('h3').text().trim();
                const percentage = Cypress.$(box).find('p').text().trim();
                questionData.results.push({ value, percentage });
            });

            // Log each questionData object individually for debugging
            cy.log(`Question ${index + 1}:`, JSON.stringify(questionData));

            // Push question data to a global array if needed or print
            questionsData.push(questionData);
        }).then(() => {
            // Final log of all question data after processing all elements
            cy.log("All questions and results:", JSON.stringify(questionsData, null, 2));
            cy.log("Types and Average Scores:", JSON.stringify(typeAndScores, null, 2));
        });
    };

    // Function to extract all hrefs from a section and click each link separately
    const extractLinksAndClick = (sectionHeading, buttonClass) => {
        let linksList = [];
        const baseUrl = "https://testapp.amelio.co";

        // Extract href values from the section
        cy.wait(14000);
        cy.get(`h4:contains("${sectionHeading}")`) 
            .parent() 
            .find(`a.${buttonClass}`)
            .each(($link) => {
                // Push href value into the list
                linksList.push($link.attr('href'));
            })
            .then(() => {
                // Log the links
                cy.log(`Extracted Links: ${linksList}`);

                // Now, iterate over each link and click
                linksList.forEach((link) => {
                    const fullUrl = link.startsWith('http') ? link : baseUrl + link;

                    cy.visit(fullUrl); 

                    // Wait for the content to load if necessary
                    cy.wait(19000);

                    cy.get('.MuiGrid-container')
                        .invoke('text') 
                        .then((text) => {
                            const data = text.replace(/\s+/g, ' ').trim(); 
                            cy.log(`Navigated to: ${fullUrl}`);
                            cy.log(`Data: ${data}`);
                        });

                    extractAllQuestionsAndResults();

                });
            });
    };


    it('Clicks on each item in "Your Team\'s Strengths" sections, logs data, and navigates back to the main page', () => {
        // Click and log data for "Your Team's Strengths" section
        extractLinksAndClick("Your Team's Strengths", "strength-btn");



    });

    it('Clicks on each item in "Concerns Raised" sections, logs data, and navigates back to the main page', () => {
        // Extract links and click each one in "Concerns raised" section
        extractLinksAndClick("Concerns raised", "concerns-btn");
    });


    it('Should verify extracted UI data with parsed insight report PDF data', () => {
        cy.fixture('parsedPdfData.json').then((pdfData) => {
            const pdfText = pdfData.text;

            // Loop through each category in StrengthWeaknessData and check each value in pdfText
            Object.keys(StrengthWeaknessData).forEach((category) => {
                StrengthWeaknessData[category].forEach((value) => {
                    cy.log(`Checking if PDF contains Strength/Weakness value: "${value}"`);
                    expect(pdfText).to.include(
                        value,
                        `Expected PDF to contain the value: "${value}" from category: "${category}"`
                    );
                });
            });

                typeAndScores.forEach(({ type, trimmedType, averageScore }) => {
                    const targetText1 = type;
                    const targetText2 = trimmedType;
    
                    cy.log(`Checking PDF contains either "${targetText1}" or "${targetText2}" with score "${averageScore}"`);
    
                    // Assert that at least one of the patterns exists in the PDF content
                    expect(
                        pdfText.includes(targetText1) || pdfText.includes(targetText2),
                        `Expected PDF to contain either pattern "${targetText1}" or "${targetText2}"`
                    ).to.be.true;
    
                    // Verify the score as well
                    expect(pdfText).to.include(
                        averageScore,
                        `Expected PDF to contain the score: "${averageScore}" for type: "${type}"`
                    );
                });

            });
        });
    });

