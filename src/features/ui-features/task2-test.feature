
Feature: Task 2 scenarious
    Background: Navigate to url and click create Excercise log button
        Given User navigates to "http://localhost:3000"
        When User clicks [Create Excersice button] "li[data-ta*='create-exercise']"
            And User waits 3 seconds

    Scenario: Check user is able to select User from dropdown
        When User selects item "option" with text "Anton" from [Username Dropdown] "select[data-ta='selectUser']"
        Then User verifies default selected option in [Select User Dropdown] "select[data-ta='selectUser']" dropdown is equal to "Anton"

    Scenario: Date picker exists and able to select data
        When User clicks [Date field] "div[data-ta='date'] input"
        Then User verifies each element in [Date Picker] "div[class='react-datepicker']" is "present"
        When User clicks [Date Picker Day] "div[role=option]" with text "16"
        Then [Date field] "div[data-ta='date'] input" input text is equal to "02/16/2023"

    Scenario: Submit is disabled when required fields are not filled
        Then User verifies each element in [Submit Excersice button] "input[type='submit']" is "enabled"

    Scenario: Check description And Duration fields exist
        Then User verifies each element in [Date Picker] "div[class='react-datepicker']" is "present"

    Scenario: E2E - Create new exercise for client with
        When User selects item "option" with text "Anton" from [Select User Dropdown] "select[data-ta='selectUser']"
            And User enters "0 Anton unique description" in [Descritpion field] "input[data-ta='description']"
            And User clears text from [Duration field] "input[data-ta='duration']"
            And User enters "10" in [Duration field] "input[data-ta='duration']"
            And User enters "02/01/2023" in [Date field] "div[data-ta='date'] input"
            And User presses Enter key
            And User clicks [Submit Excersice button] "input[type='submit']"
        Then User verifies each element in [Logged Exercises Table Title] "//div/h3[text()='Logged Exercises']" is "present"
            And [Logged Exercises] table "table[data-ta='exercise-list']" data contains values:
            | Username | Description | Duration | Date       |
            | Anton    | Description | 10       | 2023-02-01 |