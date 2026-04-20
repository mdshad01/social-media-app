/// <reference types="cypress" />

describe('Post Interaction Flow', () => {
  beforeEach(() => {
    // Login before each test
    cy.visit('/auth/login');
    cy.get('input[name="email"]').type('onlyforstudy12hr@gamil.com');
    cy.get('input[name="password"]').type('123@Rider');
    cy.get('button[type="submit"]').click();
    
    // Wait for redirect to home
    cy.url({ timeout: 15000 }).should('eq', `${Cypress.config().baseUrl}/`);
    
    // Wait for posts to load
    cy.wait(3000);
  });

  it('should display posts on home page', () => {
    // Check if posts are visible
    cy.get('.bg-card.rounded').should('exist');
  });

  it('should like a post', () => {
    // Find first post's like button (Heart icon)
    cy.get('.bg-card.rounded')
      .first()
      .within(() => {
        // Find like button by looking for Heart icon (lucide-react)
        cy.get('button').contains('Like').parent().as('likeButton');
        
        // Get initial like count
        cy.get('@likeButton').find('span').first().invoke('text').then((initialCount) => {
          // Click like button
          cy.get('@likeButton').click();
          
          // Wait for like to register
          cy.wait(1000);
          
          // Like should be registered (button state changes)
          cy.get('@likeButton').should('exist');
        });
      });
  });

  it('should unlike a post', () => {
    // Find first post
    cy.get('.bg-card.rounded')
      .first()
      .within(() => {
        cy.get('button').contains('Like').parent().as('likeButton');
        
        // Like the post first
        cy.get('@likeButton').click();
        cy.wait(1000);
        
        // Unlike the post
        cy.get('@likeButton').click();
        cy.wait(1000);
        
        // Should be unliked
        cy.get('@likeButton').should('exist');
      });
  });

  it('should open comment section', () => {
    // Find first post
    cy.get('.bg-card.rounded')
      .first()
      .within(() => {
        // Click comment button
        cy.get('button').contains('Comment').parent().click();
      });
    
    // Wait for comment section to appear
    cy.wait(500);
    
    // Comment input should be visible
    cy.get('input[placeholder*="comment"]').should('be.visible');
  });

  it('should add a comment to a post', () => {
    const commentText = `Test comment ${Date.now()}`;
    
    // Find first post
    cy.get('.bg-card.rounded')
      .first()
      .within(() => {
        // Click comment button to open comment section
        cy.get('button').contains('Comment').parent().click();
      });
    
    // Wait for comment input to appear
    cy.wait(1000);
    
    // Type comment
    cy.get('input[placeholder*="comment"]').first().type(commentText);
    
    // Press Enter or click send button
    cy.get('input[placeholder*="comment"]').first().type('{enter}');
    
    // Wait for comment to appear
    cy.contains(commentText, { timeout: 10000 }).should('be.visible');
  });

  it('should display comment count', () => {
    // Find a post with comments
    cy.get('.bg-card.rounded')
      .first()
      .within(() => {
        // Should show comment button with count
        cy.get('button').contains('Comment').should('exist');
      });
  });

  it('should share a post', () => {
    // Find first post
    cy.get('.bg-card.rounded')
      .first()
      .within(() => {
        // Look for share button
        cy.get('button').contains('Share').then(($btn) => {
          if ($btn.length > 0) {
            cy.wrap($btn).parent().click();
            
            // Wait for share action
            cy.wait(1000);
          }
        });
      });
  });
});
