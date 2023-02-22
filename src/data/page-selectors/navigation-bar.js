class NavigationBar {
  constructor() {}

  get createExerciseBtn() {
    return "li[data-ta*='create-exercise']";
  }
}

module.exports = NavigationBar;
