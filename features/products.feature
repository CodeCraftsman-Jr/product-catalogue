Feature: Product Catalogue Management
  As an administrator
  I want to manage products in the catalogue
  So that I can maintain the e-commerce product inventory

  Background:
    Given the following products exist in the catalogue
      | name            | category    | price | available | description              |
      | Laptop Pro      | Electronics | 1299  | true      | High performance laptop  |
      | Fedora Hat      | Fashion     | 49    | true      | Classic felt hat         |
      | Desk Lamp       | Home        | 45    | false     | LED desk lamp            |
      | Wireless Mouse  | Electronics | 29    | true      | Ergonomic design         |
      | Yoga Mat        | Sports      | 25    | true      | Non-slip surface         |
      | Coffee Maker    | Home        | 79    | false     | 12-cup programmable      |
      | Running Shoes   | Sports      | 89    | true      | Lightweight running     |
      | Straw Hat       | Fashion     | 35    | true      | Summer straw hat         |
      | Baseball Cap    | Fashion     | 20    | true      | Cotton baseball cap      |
      | Winter Beanie   | Fashion     | 15    | true      | Warm winter beanie       |

  Scenario: Read a product by ID
    When I set the product name to "Fedora Hat"
    And I press the "Search" button
    Then I should see the success message "Product found"
    And I should see the text "Fedora Hat" in the search results
    And the product details should show name "Fedora Hat", description "Classic felt hat", available "true", category "Fashion", and price "49"

  Scenario: Update a product
    When I set the product name to "Fedora Hat"
    And I press the "Search" button
    Then I should see the success message "Product found"
    And I should see the text "Fedora Hat" in the search results
    When I press the "Clear" button
    And I set the product name to "Fedora Hat"
    And I press the "Search" button
    Then I should see the success message "Product found"

  Scenario: Delete a product
    Given I am on the Home Page
    When I set the product name to "Desk Lamp"
    And I press the "Search" button
    Then I should see the success message "Product found"
    When I delete the product "Desk Lamp"
    Then I should see the success message "Product deleted"
    And I should not see the text "Desk Lamp" in the search results

  Scenario: List all products
    When I press the "Clear" button
    And I press the "Search" button
    Then I should see the success message "Product found"
    And I should see the text "Fedora Hat" in the search results
    And I should see the text "Laptop Pro" in the search results
    And I should see the text "Desk Lamp" in the search results

  Scenario: Search products by category
    Given I am on the Home Page
    When I press the "Clear" button
    And I select "Fashion" from the category dropdown
    And I press the "Search" button
    Then I should see the success message "Product found"
    And I should see the text "Fedora Hat" in the search results
    And I should see the text "Straw Hat" in the search results
    And I should see 4 products in the "Fashion" category

  Scenario: Search products by availability
    When I press the "Clear" button
    And I select "true" from the availability dropdown
    And I press the "Search" button
    Then I should see the success message "Product found"
    And I should see the text "Fedora Hat" in the search results
    And I should not see the text "Desk Lamp" in the search results
    And I should see 8 products that are in stock

  Scenario: Search products by name
    When I set the product name to "Hat"
    And I press the "Search" button
    Then I should see the success message "Product found"
    And I should see the text "Fedora Hat" in the search results
    And I should see the text "Straw Hat" in the search results
    And I should see 2 products matching "Hat"
