const { start } = require('cypress-html-reporter');
const cucumber = require('cypress-cucumber-preprocessor').default;
const webpack = require('@cypress/webpack-preprocessor');
const path = require('path');
const fs = require('fs');
const pdf = require('pdf-parse');
const { exec } = require('child_process');

module.exports = (on, config) => {
  const options = {
    webpackOptions: require(path.resolve(__dirname, '../../webpack.config.js')),
  };
  
  on('file:preprocessor', cucumber(options));

  // Define the task to convert PPTX to PDF using LibreOffice
  on('task', {
    convertPptxToPdf(filePath) {
      return new Promise((resolve, reject) => {
        const outputDir = path.dirname(filePath); // Output directory should be same as input
        const command = `"C:\\Program Files\\LibreOffice\\program\\soffice.exe" --headless --convert-to pdf "${filePath}" --outdir "${outputDir}"`;

        exec(command, (error, stdout, stderr) => {
          if (error || stderr) {
            return reject(`Error converting PPTX to PDF: ${error || stderr}`);
          }
          resolve('PDF conversion successful');
        });
      });
    },

    // Define the task to parse the PDF and extract text and metadata
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

  on('after:run', (results) => {
    start(results);
  });
};
