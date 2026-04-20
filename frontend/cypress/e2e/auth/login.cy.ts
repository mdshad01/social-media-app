/// <reference types="cypress" />

describe('Login Flow', () => {
  beforeEach(() => {
    // Visit login page before each test
    cy.visit('/auth/login');
  });

  it('should display login form with all elements', () => {
    // Check if all form elements are present
    cy.contains('Welcome Back').should('be.visible');
    cy.get('input[name="email"]').should('be.visible');
    cy.get('input[name="password"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
    cy.contains('Forgot Password?').should('be.visible');
    cy.contains('Create Account').should('be.visible');
  });

  it('should show validation errors for empty fields', () => {
    // Click submit without filling form
    cy.get('button[type="submit"]').click();
    
    // Should stay on login page (no redirect)
    cy.url().should('include', '/auth/login');
  });

  it('should show error for invalid credentials', () => {
    // Fill form with invalid credentials
    cy.get('input[name="email"]').type('wrong@example.com');
    cy.get('input[name="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();
    
    // Wait for error message (toast or error text)
    cy.contains(/invalid|incorrect|wrong/i, { timeout: 10000 }).should('be.visible');
  });

  it('should successfully login with valid credentials', () => {
    // Fill form with valid credentials
    // ⚠️ Replace with your actual test user credentials
    cy.get('input[name="email"]').type('onlyforstudy12hr@gamil.com');
    cy.get('input[name="password"]').type('123@Rider');
    
    // Submit form
    cy.get('button[type="submit"]').click();
    
    // Wait for redirect to home page
    cy.url({ timeout: 15000 }).should('eq', `${Cypress.config().baseUrl}/`);
    
    // Verify user is logged in (check for user-specific elements)
    cy.contains('Suggested Users', { timeout: 10000 }).should('be.visible');
  });

  it('should navigate to signup page when clicking Create Account', () => {
    // Click on "Create Account" link
    cy.contains('Create Account').click();
    
    // Verify redirect to signup page
    cy.url().should('include', '/auth/signup');
  });

  it('should navigate to forgot password page', () => {
    // Click on "Forgot Password?" link
    cy.contains('Forgot Password?').click();
    
    // Verify redirect to forgot password page
    cy.url().should('include', '/auth/forget-password');
  });

  it('should toggle password visibility', () => {
    // Type password
    cy.get('input[name="password"]').type('password123');
    
    // Password should be hidden by default
    cy.get('input[name="password"]').should('have.attr', 'type', 'password');
    
    // Click eye icon to show password
    cy.get('input[name="password"]').parent().find('button').click();
    
    // Password should now be visible
    cy.get('input[name="password"]').should('have.attr', 'type', 'text');
    
    // Click again to hide
    cy.get('input[name="password"]').parent().find('button').click();
    
    // Password should be hidden again
    cy.get('input[name="password"]').should('have.attr', 'type', 'password');
  });

  it('should show loading state during login', () => {
    // Fill form
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password123');
    
    // Submit form
    cy.get('button[type="submit"]').click();
    
    // Button should be disabled during loading
    cy.get('button[type="submit"]').should('be.disabled');
  });
});