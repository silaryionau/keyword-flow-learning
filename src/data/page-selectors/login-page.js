/**
 * This file is represent Page Objects usage.
 * Here should be CSS selectors related to application.
 * Any desired/appropriate nesting and structure can be used.
 * Used for library tests
 */

class LoginPage {

  constructor() {
  }

  get loginInput() { return '#username'; }
  get passwordInput() { return '#password'; }
  get loginButton() { return '#loginButton'; }
  
}

module.exports = LoginPage;