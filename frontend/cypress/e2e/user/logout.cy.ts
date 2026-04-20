/// <reference types="cypress" />

describe('Logout Flow', () => {
  beforeEach(() => {
    // Login before each test - using same credentials as login.cy.ts
    cy.visit('/auth/login');
    cy.get('input[name="email"]').type('onlyforstudy12hr@gamil.com');
    cy.get('input[name="password"]').type('123@Rider');
    cy.get('button[type="submit"]').click();
    
    // Wait for redirect to home
    cy.url({ timeout: 15000 }).should('eq', `${Cypress.config().baseUrl}/`);
    
    // Set viewport to desktop to ensure avatar is visible (hidden on mobile)
    cy.viewport(1280, 720);
    
    // Wait for page to fully load
    cy.wait(2000);
  });

  it('should successfully logout', () => {
    // Click on avatar span to open dropdown menu - use force to ensure click happens
    cy.get('div.relative.hidden.md\\:block').find('span.cursor-pointer').click({ force: true });
    
    // Wait for dropdown animation
    cy.wait(500);
    
    // Click logout button
    cy.contains('button', 'Logout').should('be.visible').click();
    
    // Should redirect to login page
    cy.url({ timeout: 10000 }).should('include', '/auth/login');
  });

  it('should clear user session after logout', () => {
    // Click on avatar to open dropdown
    cy.get('div.relative.hidden.md\\:block').find('span.cursor-pointer').click({ force: true });
    cy.wait(500);
    
    // Click logout
    cy.contains('button', 'Logout').should('be.visible').click();
    
    // Wait for redirect
    cy.url({ timeout: 10000 }).should('include', '/auth/login');
    
    // Try to access protected route
    cy.visit('/');
    
    // Should redirect back to login
    cy.url({ timeout: 10000 }).should('include', '/auth/login');
  });

  it('should not allow access to protected routes after logout', () => {
    // Click on avatar to open dropdown
    cy.get('div.relative.hidden.md\\:block').find('span.cursor-pointer').click({ force: true });
    cy.wait(500);
    
    // Click logout
    cy.contains('button', 'Logout').should('be.visible').click();
    
    // Try to access profile page
    cy.visit('/profile/123');
    
    // Should redirect to login
    cy.url({ timeout: 10000 }).should('include', '/auth/login');
  });

  it('should show login form after logout', () => {
    // Click on avatar to open dropdown
    cy.get('div.relative.hidden.md\\:block').find('span.cursor-pointer').click({ force: true });
    cy.wait(500);
    
    // Click logout
    cy.contains('button', 'Logout').should('be.visible').click();
    
    // Should see login form
    cy.contains('Welcome Back').should('be.visible');
    cy.get('input[name="email"]').should('be.visible');
    cy.get('input[name="password"]').should('be.visible');
  });

  it('should allow login again after logout', () => {
    // Click on avatar to open dropdown
    cy.get('div.relative.hidden.md\\:block').find('span.cursor-pointer').click({ force: true });
    cy.wait(500);
    
    // Click logout
    cy.contains('button', 'Logout').should('be.visible').click();
    
    // Wait for redirect to login
    cy.url({ timeout: 10000 }).should('include', '/auth/login');
    
    // Login again
    cy.get('input[name="email"]').type('onlyforstudy12hr@gamil.com');
    cy.get('input[name="password"]').type('123@Rider');
    cy.get('button[type="submit"]').click();
    
    // Should successfully login
    cy.url({ timeout: 15000 }).should('eq', `${Cypress.config().baseUrl}/`);
  });
});
