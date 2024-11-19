import 'cypress-cucumber-preprocessor/steps';
import './commands';

Cypress.Commands.add('deleteFile', (filePath) => {
    return new Promise((resolve, reject) => {
        fs.unlink(filePath, (err) => {
            if (err && err.code !== 'ENOENT') {
                reject(err); // Reject on error, unless the file doesn't exist
            }
            resolve(); // Resolve if file was deleted or didn't exist
        });
    });
});

Cypress.on("uncaught:exception", (err) => {
    // Ignore "Cancel: CANCELLED" error specifically
    if (err.message.includes("Cancel: CANCELLED")) {
        return false; // Prevent Cypress from failing the test
    }
    // Let Cypress fail the test for any other exceptions
});


// cypress/support/index.js

// This is where you can add global configuration or behavior
// For example, you can add commands or setup code here
