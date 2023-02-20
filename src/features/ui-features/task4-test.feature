@task2
Feature: Task 4
    
    Scenario: Create new User
        Given User navigates to "http://localhost:3000"
        When User clicks [Create User] "a[href*=user]"
        When Create new User with name "Simon"
        Then [Message Banner] "form[data-ta=create-user] + div" with text "User Simon was added!" is displayed