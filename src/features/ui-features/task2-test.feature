@task2
Feature: Task 2 scenarious
    Background: Navigate to url and click create Excercise log button
        Given User navigates to "ExcerTracker"
        When User clicks [Create Excersice button] "navigationBar|createExerciseBtn"
            And User waits 3 seconds

    Scenario: Check user is able to select User from dropdown
        When User selects item "createExerciseForm|drpOptionLoc" with text "Anton" from [Username Dropdown] "createExerciseForm|usernameDrp"
        Then User verifies default selected option in [Select User Dropdown] "createExerciseForm|usernameDrp" dropdown is equal to "Anton"

    Scenario: Date picker exists and able to select data
        When User clicks [Date field] "createExerciseForm|dateInput"
        Then User verifies each element in [Date Picker] "datePicker|datePickerLoc" is "present"
        When User clicks [Date Picker Day Option] "datePicker|commonDayLoc" with text "16"
        Then [Date field] "createExerciseForm|dateInput" input text is equal to "02/16/2023"

    Scenario: Submit is disabled when required fields are not filled
        Then User verifies each element in [Submit Excersice button] "createExerciseForm|submitExerciseBtn" is "disabled"

    Scenario: Check description And Duration fields exist
        Then User verifies each element in [Description field] "createExerciseForm|descriptionInput" is "present"
            And User verifies each element in [Duration field] "createExerciseForm|durationInput" is "present"

    Scenario: E2E - Create new exercise for client with
        When User selects item "createExerciseForm|drpOptionLoc" with text "Anton" from [Username Dropdown] "createExerciseForm|usernameDrp"
            And User enters "description 17.02.2023" in [Descritpion field] "createExerciseForm|descriptionInput"
            And User clears text from [Duration field] "createExerciseForm|durationInput"
            And User enters "10" in [Duration field] "createExerciseForm|durationInput"
            And User enters "02/01/2023" in [Date field] "createExerciseForm|dateInput"
            And User presses Enter key
            And User clicks [Submit Excersice button] "createExerciseForm|submitExerciseBtn"
        Then User verifies each element in [Logged Exercises Table Title] "loggedExercisesTable|tableTitle" is "present"
            And [Logged Exercises Table] table "loggedExercisesTable|tableLoc" data contains values:
            | Username | Description            | Duration | Date       |
            | Anton    | description 17.02.2023 | 10       | 2023-02-01 |