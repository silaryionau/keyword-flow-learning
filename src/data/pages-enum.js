/**
 * Used for library tests
 */

const LoginPage = require('./page-selectors/login-page');
const WikiPage = require('./page-selectors/wiki-page');
const WikiResultPage = require('./page-selectors/wiki-result-page');

module.exports = {
  loginPage: new LoginPage(), 
  wikiPage: new WikiPage(), 
  wikiResultPage: new WikiResultPage(), 

  // should be added all application pages depends on project needs
};