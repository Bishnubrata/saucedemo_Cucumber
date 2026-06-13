Feature: SauceDemo E2E Continuous Flow
  As a standard user
  I want to log in and manage my cart
  So that I can complete my shopping journey

  Scenario: Execute complete shopping flow
    Given I navigate to the SauceDemo login page
    When I log in with valid credentials
    Then I should see exactly 6 products on the inventory page
    When I sort the products by "Price (low to high)"
    Then the products should be sorted correctly
    When I add 2 products to the cart
    Then the cart badge should display 2
    When I remove 1 product from the cart
    Then the cart badge should display 1


    Scenario: Validate login with invalid credentials
    Given I navigate to the SauceDemo login page
    When I log in with invalid credentials
    Then I should see an error message "Username and password do not match"