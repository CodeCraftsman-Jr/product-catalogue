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
    When I request the product with ID 1
    Then I should see the product details for "Laptop Pro"

  Scenario: Update a product
    Given I request the product with ID 2
    When I update the product name to "Running Shoes Pro" and price to 99
    Then the product should now be named "Running Shoes Pro" with price 99

  Scenario: Delete a product
    Given I request the product with ID 3
    When I delete the product
    Then the product should no longer exist in the catalogue

  Scenario: List all products
    When I request the list of all products
    Then I should see all 6 products in the catalogue

  Scenario: Search products by name
    When I search for products with name "Mouse"
    Then I should see 1 product matching "Mouse"

  Scenario: Search products by category
    When I search for products in category "Electronics"
    Then I should see 2 products in the "Electronics" category

  Scenario: Search products by availability
    When I search for available products
    Then I should see 4 products that are in stock
