describe('Product Page', () => {
  beforeEach(() => {
    // Mock the API response   
    cy.intercept('GET', `${Cypress.env('NEXT_PUBLIC_API_ADDRESS')}products?slug=test`, {
      statusCode: 200,
      body: {
        products: {
          id: 1,
          caption: 'Milks',
          imageSrc: '/images/products/milk.jpg',
          rate: 4.5,
          price: 2.99,
          weight: '1L',
          description: '<p>Fresh, creamy milk</p>'
        }
      }
    }).as('getProduct');
    
    // Visit the product page
    cy.visit('/en/test');
    cy.wait('@getProduct')
  });

  it('should display product details correctly', () => {    
    cy.getDataTest('product-container').should('exist');
    cy.getDataTest('product-image-container').should('exist');
    cy.getDataTest('product-image').should('have.attr', 'src').and('include', 'milk.jpg');
    cy.getDataTest('product-title').should('contain', 'Milks');
    cy.getDataTest('product-weight').should('contain', '1L');
    cy.getDataTest('product-rating').should('contain', '4.5');
    cy.getDataTest('product-price').should('contain', '2.99');
    cy.getDataTest('product-description').should('contain', 'Fresh, creamy milk');
  });

  it('should handle quantity changes', () => {
    cy.getDataTest('increase-decrease-control').within(() => {
      cy.getDataTest('increase-decrease-add').click();
      cy.getDataTest('increase-decrease-value').should('contain', '1');
    });
    cy.getDataTest('cart-count').should('contain', '1');
    cy.getDataTest('increase-decrease-control').within(() => {
      cy.getDataTest('increase-decrease-increase').click();
      cy.getDataTest('increase-decrease-value').should('contain', '2');
    });
    cy.getDataTest('cart-count').should('contain', '2');
    cy.getDataTest('increase-decrease-control').within(() => {
      cy.getDataTest('increase-decrease-decrease').click();
      cy.getDataTest('increase-decrease-value').should('contain', '1');
    });
    cy.getDataTest('cart-count').should('contain', '1');
  });
});

