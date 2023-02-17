class DatePicker {
  constructor() {}

  get datePickerLoc() {
    return "div[class='react-datepicker']";
  }

  get commonDayLoc() {
    return "div[role=option]";
  }
}

module.exports = DatePicker;
