// Initialise
describe('View Favorite Products', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('.state-controller').contains('Close').click();
  });

  it('filtered products updated correctly', () => {
    cy.get('.nav-header').contains('Favorites').click();
    // Initially, no products should be favorited
    cy.get('.product-card').should('have.length', 0);
    cy.contains('No products found');

    // Go back to Catalog and favorite products
    cy.get('.nav-header').contains('Catalog').click();
    cy.get('.product-card')
      .contains('Bluetooth Mouse')
      .closest('.product-card')
      .find('.favorite-btn')
      .should('contain', '🤍');
    cy.get('.product-card')
      .contains('Keyboard Cover')
      .closest('.product-card')
      .find('.favorite-btn')
      .should('contain', '🤍');
    cy.get('.product-card')
      .contains('Wireless Mechanical Keyboard')
      .closest('.product-card')
      .find('.favorite-btn')
      .should('contain', '🤍');
    cy.get('.product-card')
      .contains('Bluetooth Mouse')
      .closest('.product-card')
      .find('.favorite-btn')
      .click();
    cy.get('.product-card')
      .contains('Keyboard Cover')
      .closest('.product-card')
      .find('.favorite-btn')
      .click();
    cy.get('.product-card')
      .contains('Wireless Mechanical Keyboard')
      .closest('.product-card')
      .find('.favorite-btn')
      .click();
    cy.get('.product-card')
      .contains('Bluetooth Mouse')
      .closest('.product-card')
      .find('.favorite-btn')
      .should('contain', '❤️');
    cy.get('.product-card')
      .contains('Keyboard Cover')
      .closest('.product-card')
      .find('.favorite-btn')
      .should('contain', '❤️');
    cy.get('.product-card')
      .contains('Wireless Mechanical Keyboard')
      .closest('.product-card')
      .find('.favorite-btn')
      .should('contain', '❤️');

    // Go back to Favorites and check if the products are listed
    cy.get('.nav-header').contains('Favorites').click();
    cy.get('.product-card').should('have.length', 3);
    cy.get('.product-card').contains('Bluetooth Mouse').should('exist');
    cy.get('.product-card').contains('Keyboard Cover').should('exist');
    cy.get('.product-card').contains('Wireless Mechanical Keyboard').should('exist');

    // Unfavorite one product and check if it is removed from Favorites
    cy.get('.product-card')
      .contains('Keyboard Cover')
      .closest('.product-card')
      .find('.favorite-btn')
      .click();
    cy.get('.product-card').should('have.length', 2);
    cy.get('.product-card').contains('Keyboard Cover').should('not.exist');

    // Check that Catalog has been updated and the unfavorited product is no longer marked as favorite
    cy.get('.nav-header').contains('Catalog').click();
    cy.get('.product-card')
      .contains('Keyboard Cover')
      .closest('.product-card')
      .find('.favorite-btn')
      .should('contain', '🤍');
    cy.get('.product-card')
      .contains('Bluetooth Mouse')
      .closest('.product-card')
      .find('.favorite-btn')
      .should('contain', '❤️');
    cy.get('.product-card')
      .contains('Wireless Mechanical Keyboard')
      .closest('.product-card')
      .find('.favorite-btn')
      .should('contain', '❤️');

    // Unfavorite remaining products and check if the empty state is shown
    cy.get('.nav-header').contains('Favorites').click();
    cy.get('.product-card')
      .contains('Bluetooth Mouse')
      .closest('.product-card')
      .find('.favorite-btn')
      .click();
    cy.get('.product-card')
      .contains('Wireless Mechanical Keyboard')
      .closest('.product-card')
      .find('.favorite-btn')
      .click();
    cy.get('.product-card').should('have.length', 0);
    cy.contains('No products found');

    // Check that Catalog has been updated and all products are no longer marked as favorite
    cy.get('.nav-header').contains('Catalog').click();
    cy.get('.product-card')
      .contains('Keyboard Cover')
      .closest('.product-card')
      .find('.favorite-btn')
      .should('contain', '🤍');
    cy.get('.product-card')
      .contains('Bluetooth Mouse')
      .closest('.product-card')
      .find('.favorite-btn')
      .should('contain', '🤍');
    cy.get('.product-card')
      .contains('Wireless Mechanical Keyboard')
      .closest('.product-card')
      .find('.favorite-btn')
      .should('contain', '🤍');
  });
});
