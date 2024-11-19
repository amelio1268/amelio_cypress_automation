describe('Extract all UI data as per the insight reports and verify the correct data againt each section', () => {
  let categoriesData = {}; 
  let StrengthWeaknessData = {};
  let extractedData = []; 
  let typeAndScores = [];

  beforeEach(() => {
      // Visit the URL and log in once
      cy.test_env_login();
      cy.visit('https://testapp.amelio.co/Results/Overview');
      cy.wait(16000);
  });

  it('Should extract titles and scores from detail dialog items and close the popover', () => {
      cy.wait(19000);

      // Step 1: Get the list of titles in the desired section only
      cy.get('.MuiList-root .MuiListItem-root').each(($el) => {
          // Add a filter to exclude items in the undesired sections
          const isDesiredSection = !$el.closest('.pros-cons').length;
          if (isDesiredSection) {
              const title = $el.find('h5.MuiTypography-root').text().trim();
              const score = $el.find('.score5 span').text().trim();
              const titleWithSpace = title.replace(/(\d+(\.\d+)?)/, ' $1').trim();

              // Add the extracted title and score to the list
              extractedData.push({ title: titleWithSpace, score: score });

              // Log for debugging
              cy.log(`logTitle: ${titleWithSpace} - Score: ${score}`);

              // Step 2: Click on the list item to open the popover
              cy.wrap($el).click();

              // Step 3: Ensure that the popover has appeared
              cy.get('.MuiPaper-root.MuiPopover-paper').should('be.visible');

              // Step 4: Extract titles and scores from the popover
              cy.get('.MuiPopover-paper .MuiList-root .MuiListItem-root').each(($popoverEl) => {
                  const popoverTitle = $popoverEl.find('h5.MuiTypography-root').text().trim();
                  const popoverScore = $popoverEl.find('.score5 span').text().trim();
                  const popoverTitleWithSpace = popoverTitle.replace(/(\d+(\.\d+)?)/, ' $1').trim();

                  // Add the extracted popover title and score to the list
                  extractedData.push({ title: popoverTitleWithSpace, score: popoverScore });

                  cy.log(`logPopoverTitle: ${popoverTitleWithSpace} - Score: ${popoverScore}`);
              });

              // Step 5: Close the popover by pressing the Escape key
              cy.get('body').type('{esc}');  // Close the popover using Escape key
          }
      });

      // Step 6: Ensure any remaining popover is closed after all items are clicked
      cy.get('body').type('{esc}');
  });


  it('Should get the title and values for each category and store them', () => {
      cy.get('.category-card-design', { timeout: 30000 }).should('be.visible');

      // Extract the score from the web page
      cy.get('.mixed-widget-4-chart')
          .within(() => {
              cy.get('.apexcharts-datalabel-value')
                  .invoke('text')
                  .then((score) => {
                      const extractedScore = score.trim();

                      // Load the parsed PDF data
                      cy.fixture('parsedPdfData.json').then((pdfData) => {
                          const pdfText = pdfData.text;
                          const targetText = `current engagement level is ${extractedScore}`;

                          // Log to help debug if needed
                          cy.log(`Checking PDF contains the text current engagement level is: "${targetText}"`);


                          expect(pdfText).to.include(
                              targetText,
                              `PDF should contain the phrase "${targetText}"`
                          );
                      });
                  });
          });


      // Extract titles and their associated links
      cy.get('.engagement-score > .MuiGrid-root').each(($container) => {
          // Extract the title (h4 text)
          const title = $container.find('h4.MuiTypography-root.MuiTypography-h4').text().trim();

          // Extract the links (values)
          let values = [];
          $container.find('a').each((index, link) => {
              const linkText = Cypress.$(link).text().trim();
              values.push(linkText);
          });
          cy.log(title);
          values.forEach((value) => {
              cy.log(value);
          });
          // Add values to the categoriesData object under the category title
          StrengthWeaknessData[title] = values;
          cy.log(`StrengthWeaknessData[${title}] = ${JSON.stringify(values)}`);


      });

      cy.get('.category-card-design').each(($categoryCard) => {
          cy.wrap($categoryCard)
              .find('.header-progress h3')
              .invoke('text')
              .then((title) => {
                  const categoryTitle = title.trim();
                  categoriesData[categoryTitle] = categoriesData[categoryTitle] || [];

                  cy.wrap($categoryCard)
                      .find('.report-progress')
                      .each(($item) => {
                          cy.wrap($item)
                              .find('h5.MuiTypography-h5')
                              .invoke('text')
                              .then((itemTitle) => {
                                  const cleanedItemTitle = itemTitle.trim().slice(0, -3);

                                  cy.wrap($item)
                                      .find('.rating .score5 span, .rating .score7 span')
                                      .invoke('text')
                                      .then((score) => {
                                          const scoreValue = score.trim();
                                          if (cleanedItemTitle && scoreValue) {
                                              categoriesData[categoryTitle].push({ title: cleanedItemTitle, score: scoreValue });
                                          } else {
                                              cy.log('Missing data for:', categoryTitle, cleanedItemTitle, scoreValue);
                                          }

                                      });
                              });
                      });
              });
      });

      cy.then(() => {
          cy.log('Company|Relationship|Growth :', JSON.stringify(categoriesData, null, 2));
      });
  });


  it('Should verify extracted UI data with parsed insight report PDF data', () => {
      cy.fixture('parsedPdfData.json').then((pdfData) => {
          const pdfText = pdfData.text;

          // Loop through categoriesData to check each title and score directly in pdfText
          Object.keys(categoriesData).forEach((category) => {
              categoriesData[category].forEach((item) => {
                  const { title, score } = item;

                  cy.log(`Checking if PDF contains report title: "${title}" with score: "${score}"`);
                  expect(pdfText).to.include(
                      title,
                      `Expected PDF to contain the report title: "${title}"`
                  );
                  expect(pdfText).to.include(
                      score,
                      `Expected PDF to contain the score: "${score}" for title: "${title}"`
                  );
              });
  
              extractedData.forEach((data) => {
                  const { title } = data;

                  // Define both possible target patterns for the search
                  const targetText1 = title;
                  const targetText2 = title.replace(/(\S+)\s(\d+\.\d+)/, '$1 ($2)');

                  // Log to help debug if needed
                  cy.log(`Checking PDF contains either "${targetText1}" or "${targetText2}"`);

                  // Assert that at least one of the patterns exists in the PDF content
                  expect(
                      pdfText.includes(targetText1) || pdfText.includes(targetText2)
                  ).to.be.true;
              });

          });
      });
  });
});
