const { defineConfig } = require("cypress");

module.exports = defineConfig({
  reporter: 'mochawesome',
  reporterOptions: {
    // To display small circular charts regarding test results
    charts: true,
    // Generate JSON file to create custom reports
    json: true,

    html: false,
    // Customize the directory in which reports are saved
    reportsDir: 'reports/',
    // Customize the report file name
    reportFilename: 'amelio_report',
    // Generate new report file or overwrite the a single file
    overwrite: false
  },
  e2e: {
    projectId: "xd835s",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    experimentalRunAllSpecs: true
  },
});

