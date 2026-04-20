/// <reference types="cypress" />

// ***********************************************
// Custom commands for E2E tests
// ***********************************************

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to login
       * @example cy.login('test@example.com', 'password123')
       */
      login(email: string, password: string): Chainable<void>;
      
      /**
       * Custom command to signup
       * @example cy.signup('testuser', 'test@example.com', 'password123')
       */
      signup(username: string, email: string, password: string): Chainable<void>;
      
      /**
       * Custom command to logout
       * @example cy.logout()
       */
      logout(): Chainable<void>;
    }
  }
}

// Login command
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/auth/login');
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();
  
  // Wait for redirect to home page
  cy.url().should('eq', `${Cypress.config().baseUrl}/`);
});

// Signup command
Cypress.Commands.add('signup', (username: string, email: string, password: string) => {
  cy.visit('/auth/signup');
  cy.get('input[name="username"]').type(username);
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="password"]').type(password);
  cy.get('input[name="confirmPassword"]').type(password);
  cy.get('button[type="submit"]').click();
});

// Logout command
Cypress.Commands.add('logout', () => {
  // Click on user menu/profile
  cy.get('[data-testid="user-menu"]').click();
  
  // Click logout button
  cy.contains('Logout').click();
  
  // Verify redirect to login
  cy.url().should('include', '/auth/login');
});

export {};
