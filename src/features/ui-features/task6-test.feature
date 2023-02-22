@task2
Feature: Screenshot test

    Scenario: Check task-tracker navigation menu
        Given User navigates to "http://localhost:3000/"
        Then User compares screenshot of [Navigation menu] "nav[class*='navbar']" to "navigation-menu.png"