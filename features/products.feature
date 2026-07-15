Feature: Product Catalogue Management
  As an administrator
  I want to manage products in the catalogue
  So that I can maintain the e-commerce product inventory

  Background:
    Given the following products exist in the catalogue
      | name            | category    | price | inStock | description          |
      | Laptop Pro      | Electronics | 1299  | true    | High performance     |
      | Running Shoes   | Sports      | 89    | true    | Lightweight shoes    |
      | Desk Lamp       | Home        | 45    | false   | LED desk lamp        |
      | Wireless Mouse  | Electronics | 29    | true    | Ergonomic design     |
      | Yoga Mat        | Sports      | 25    | true    | Non-slip surface     |
      | Coffee Maker    | Home        | 79    | false   | 12-cup programmable  |

  Scenario: Read a product by ID
    When I search for products with name "Laptop Pro"
    And I click the "Search" button
    Then I should see the product "Laptop Pro" in the search results
    And the product details should show name "Laptop Pro", description "High performance", available "true", category "Electronics", and price "1299"

  Scenario: Update a product
    When I search for products with name "Running Shoes"
    And I click the "Search" button
    Then I should see the product "Running Shoes" in the search results
    When I update the product name to "Running Shoes Pro"
    Then I should see the success message "Product updated"
    And I should see the text "Running Shoes Pro" in the search results
    And I should not see the text "Running Shoes" in the search results

  Scenario: Delete a product
    When I search for products with name "Desk Lamp"
    And I click the "Search" button
    Then I should see the product "Desk Lamp" in the search results
    When I delete the product "Desk Lamp"
    Then I should see the success message "Product deleted"
    And I should not see the text "Desk Lamp" in the search results

  Scenario: List all products
    When I press the "Clear" button
    And I click the "Search" button
    Then I should see 6 products in the search results

  Scenario: Search products by category
    When I press the "Clear" button
    And I select "Electronics" from the category dropdown
    And I click the "Search" button
    Then I should see 2 products in the "Electronics" category

  Scenario: Search products by availability
    When I press the "Clear" button
    And I select "true" from the availability dropdown
    And I click the "Search" button
    Then I should see 4 products that are in stock

  Scenario: Search products by name
    When I set the product name to "Mouse"
    And I click the "Search" button
    Then I should see the success message "Product found"
    And I should see the text "Wireless Mouse" in the search results
