const { start } = require('cypress-html-reporter');

module.exports = (on, config) => {
  on('after:run', (results) => {
    start(results);
  });
};
