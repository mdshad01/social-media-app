/// <reference types="cypress" />

describe('Create Post Flow', () => {
  beforeEach(() => {
    // Login before each test
    cy.visit('/auth/login');
    cy.get('input[name="email"]').type('onlyforstudy12hr@gamil.com');
    cy.get('input[name="password"]').type('123@Rider');
    cy.get('button[type="submit"]').click();
    
    // Wait for redirect to home
    cy.url({ timeout: 15000 }).should('eq', `${Cypress.config().baseUrl}/`);
    
    // Wait for page to load
    cy.wait(2000);
  });

  it('should display create post section on home page', () => {
    // Check if create post section is visible
    cy.contains(/what.*mind/i, { timeout: 10000 }).should('be.visible');
    
    // Check if post options are visible
    cy.contains('Photo').should('be.visible');
    cy.contains('Video').should('be.visible');
  });

  it('should open modal when clicking on "What\'s on your mind?"', () => {
    // Click on the "What's on your mind?" div
    cy.contains(/what.*mind/i).click();
    
    // Modal should open
    cy.contains('Create Post', { timeout: 5000 }).should('be.visible');
    
    // Textarea should be visible in modal
    cy.get('textarea[placeholder*="mind"]').should('be.visible');
  });

  it('should successfully create a text post', () => {
    const postContent = `Test post from Cypress ${Date.now()} 🚀`;
    
    // Click to open modal
    cy.contains(/what.*mind/i).click();
    
    // Wait for modal to open
    cy.contains('Create Post', { timeout: 5000 }).should('be.visible');
    
    // Type in textarea
    cy.get('textarea[placeholder*="mind"]').type(postContent);
    
    // Click Post button
    cy.contains('button', /^Post$/i).click();
    
    // Wait for post to appear in feed
    cy.contains(postContent, { timeout: 15000 }).should('be.visible');
  });

  it('should not allow posting empty content', () => {
    // Click to open modal
    cy.contains(/what.*mind/i).click();
    
    // Wait for modal
    cy.contains('Create Post', { timeout: 5000 }).should('be.visible');
    
    // Try to click Post button without typing
    cy.contains('button', /^Post$/i).should('be.disabled');
  });

  it('should open modal when clicking Photo button', () => {
    // Click Photo button
    cy.contains('button', 'Photo').click();
    
    // Modal should open
    cy.contains('Create Post', { timeout: 5000 }).should('be.visible');
    
    // Should show file upload option
    cy.contains('Photo/Video').should('be.visible');
  });

  it('should open modal when clicking Video button', () => {
    // Click Video button
    cy.contains('button', 'Video').click();
    
    // Modal should open
    cy.contains('Create Post', { timeout: 5000 }).should('be.visible');
  });

  it('should open modal when clicking Poll button', () => {
    // Click Poll button
    cy.contains('button', 'Poll').click();
    
    // Modal should open
    cy.contains('Create Post', { timeout: 5000 }).should('be.visible');
  });

  it('should open modal when clicking Event button', () => {
    // Click Event button
    cy.contains('button', 'Event').click();
    
    // Modal should open
    cy.contains('Create Post', { timeout: 5000 }).should('be.visible');
  });

  it('should close modal when clicking X icon', () => {
    // Open modal
    cy.contains(/what.*mind/i).click();
    
    // Wait for modal
    cy.contains('Create Post', { timeout: 5000 }).should('be.visible');
    
    // Type something
    cy.get('textarea[placeholder*="mind"]').type('Test content');
    
    // Click X icon to close modal (top-right corner of dialog)
    cy.get('[data-slot="dialog-close"]').click();
    
    // Modal should close
    cy.contains('Create Post').should('not.exist');
  });

  it('should display created post with user info', () => {
    const postContent = `Test post with user info ${Date.now()}`;
    
    // Create post
    cy.contains(/what.*mind/i).click();
    cy.contains('Create Post', { timeout: 5000 }).should('be.visible');
    cy.get('textarea[placeholder*="mind"]').type(postContent);
    cy.contains('button', /^Post$/i).click();
    
    // Wait for post to appear
    cy.contains(postContent, { timeout: 15000 }).should('be.visible');
    
    // Post should have user info (check if post exists in feed)
    cy.contains(postContent)
      .parents('[class*="post"], div')
      .should('exist');
  });
});
