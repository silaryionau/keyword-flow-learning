class CreateEerciseForm {
  constructor() {}

  get drpOptionLoc() {
    return "option";
  }

  get usernameDrp() {
    return "select[data-ta='selectUser']";
  }

  get descriptionInput() {
    return "input[data-ta='description']";
  }

  get durationInput() {
    return "input[data-ta='duration']";
  }

  get dateInput() {
    return "div[data-ta='date'] input";
  }

  get submitExerciseBtn() {
    return "input[type='submit']";
  }
}

module.exports = CreateEerciseForm;
