@functional @soft_assert_enable
Feature: task 7
    Scenario: task 7 scenario
        Given User navigates to "ExcerTracker"
        When User clicks [Create Excersice button] "navigationBar|createExerciseBtn"
        Then User verifies each element in [Username Dropdown] "createExerciseForm|usernameDrp" is "present"
            And User verifies each element in [Description field] "createExerciseForm|descriptionInput" is "present"
            And User verifies each element in [Duration field] "createExerciseForm|durationInput" is "present"
            And User verifies each element in [Date field] "createExerciseForm|dateInput" is "present"
            And User verifies each element in [Submit Excersice button] "createExerciseForm|submitExerciseBtn" is "disabled"
            And User verifies each element in [Submit Excersice button] "createExerciseForm|submitExerciseBtn" is "present"
            