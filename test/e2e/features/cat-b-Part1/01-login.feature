@catb @full_smoke @regression
Feature: Login

  Scenario: User logs into the application

    Given I am not logged in
    When I log in to the application as "mobexaminer1"
    Then I should see the "My dashboard" page
