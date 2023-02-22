class LoggedExercisesTable {
  constructor() {}

  get tableLoc() {
    return "table[data-ta='exercise-list']";
  }

  get tableTitle() {
    return "//div/h3[text()='Logged Exercises']";
  }
}

module.exports = LoggedExercisesTable;
