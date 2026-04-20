/// <reference types="cypress" />

describe('Signup Flow', () => {
  beforeEach(() => {
    cy.visit('/auth/signup');
  });

  it('should display signup form with all elements', () => {
    // Check if all form elements are present
    cy.contains('Create Account').should('be.visible');
    cy.get('input[name="username"]').should('be.visible');
    cy.get('input[name="email"]').should('be.visible');
    cy.get('input[name="password"]').should('be.visible');
    cy.get('input[name="passwordConfirm"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
    cy.contains('Sign In').should('be.visible'); // Link to login
  });

  it('should show validation error for password mismatch', () => {
    // Fill form with mismatched passwords
    cy.get('input[name="username"]').type('testuser');
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('input[name="passwordConfirm"]').type('differentpassword');
    
    cy.get('button[type="submit"]').click();
    
    // Should show error or stay on page
    cy.url().should('include', '/auth/signup');
  });

  it('should successfully signup with valid data', () => {
    // Generate unique email to avoid conflicts
    const timestamp = Date.now();
    const email = `testuser${timestamp}@example.com`;
    const username = `testuser${timestamp}`;
    
    // Fill signup form
    cy.get('input[name="username"]').type(username);
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type('password123');
    cy.get('input[name="passwordConfirm"]').type('password123');
    
    // Submit form
    cy.get('button[type="submit"]').click();
    
    // Should redirect to verify page or show success message
    cy.url({ timeout: 15000 }).should('match', /verify|success/i);
  });

  it('should show error for existing email', () => {
    // Try to signup with existing email
    cy.get('input[name="username"]').type('Alia');
    cy.get('input[name="email"]').type('onlyforstudy12hr@gmail.com');
    cy.get('input[name="password"]').type('123@Rider');
    cy.get('input[name="passwordConfirm"]').type('123@Rider');
    
    cy.get('button[type="submit"]').click();
    
    // Should show error message (flexible regex to match different error formats)
    cy.contains(/email.*already|already.*email|already.*exist|already.*register/i, { timeout: 10000 }).should('be.visible');
  });

  it('should navigate to login page when clicking Sign In', () => {
    // Click on "Sign In" link
    cy.contains('Sign In').click();
    
    // Verify redirect to login page
    cy.url().should('include', '/auth/login');
  });

  it('should toggle password visibility', () => {
    // Type password
    cy.get('input[name="password"]').type('password123');
    
    // Password should be hidden by default
    cy.get('input[name="password"]').should('have.attr', 'type', 'password');
    
    // Click eye icon to show password
    cy.get('input[name="password"]').parent().find('button').first().click();
    
    // Password should now be visible
    cy.get('input[name="password"]').should('have.attr', 'type', 'text');
  });
});
