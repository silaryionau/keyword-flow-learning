/**
 * Used for library tests
 */

const LoginPage = require("./page-selectors/login-page");
const WikiPage = require("./page-selectors/wiki-page");
const WikiResultPage = require("./page-selectors/wiki-result-page");
const DatePicker = require("./page-selectors/date-picker");
const CreateExerciseForm = require("./page-selectors/create-exercise-form");
const NavigationBar = require("./page-selectors/navigation-bar");
const LoggedExercisesTable = require("./page-selectors/logged-exercises-table");

module.exports = {
  loginPage: new LoginPage(),
  wikiPage: new WikiPage(),
  wikiResultPage: new WikiResultPage(),
  datePicker: new DatePicker(),
  createExerciseForm: new CreateExerciseForm(),
  navigationBar: new NavigationBar(),
  loggedExercisesTable: new LoggedExercisesTable(),

  // should be added all application pages depends on project needs
};
