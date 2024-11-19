const { defineConfig } = require("cypress");
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');  // To run shell commands
const pdf = require('pdf-parse');  // Import pdf-parse for reading PDF

module.exports = defineConfig({
  reporter: 'mochawesome',
  reporterOptions: {
    charts: true,
    json: true,
    html: false,
    reportsDir: 'reports/',
    reportFilename: 'amelio_report',
    overwrite: false
  },
  e2e: {
    specPattern: [
      'cypress/e2e/**/**/**.cy.{js,jsx,ts,tsx}', // E2E tests
      'cypress/e2e/amelio/integration/cucumber/**/*.feature', // Cucumber feature files
    ],
    supportFile: 'cypress/support/index.js',
    projectId: "xd835s",
    setupNodeEvents(on, config) {
      on('task', {
        // Task to convert PPTX to PDF using LibreOffice
        convertPptxToPdf(filePath) {
          return new Promise((resolve, reject) => {
            const outputDir = path.dirname(filePath); // Output directory is same as the input file
            const command = `"C:\\Program Files\\LibreOffice\\program\\soffice.exe" --headless --convert-to pdf "${filePath}" --outdir "${outputDir}"`;

            // Execute LibreOffice command to convert PPTX to PDF
            exec(command, (error, stdout, stderr) => {
              if (error || stderr) {
                return reject(`Error converting PPTX to PDF: ${error || stderr}`);
              }
              resolve('PDF conversion successful');
            });
          });
        },

        // Task to parse PDF and extract text/metadata
        parsePdf(filePath) {
          return new Promise((resolve, reject) => {
            // Read the PDF file as a buffer
            fs.readFile(filePath, (err, data) => {
              if (err) {
                return reject(`Error reading PDF file: ${err}`);
              }

              // Parse the PDF
              pdf(data).then(function (pdfData) {
                resolve({
                  text: pdfData.text, // Extracted text
                  metadata: pdfData.metadata, // Metadata of the PDF
                  info: pdfData.info // Additional PDF info
                });
              }).catch(reject);
            });
          });
        },
      });
    },
    experimentalRunAllSpecs: true
  },
});
