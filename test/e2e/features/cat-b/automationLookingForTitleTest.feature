
Feature: Looking for title

  Scenario: User looks at the title

    Given I launch the mobile app
    When I wait "5" seconds
    Then I should see the "My dashboard" page
