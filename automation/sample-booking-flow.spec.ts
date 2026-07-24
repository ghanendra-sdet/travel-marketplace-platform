/**
 * Sample Cypress test (TypeScript-style pseudocode) for the Travel
 * Marketplace search-to-booking journey. All data below is DUMMY/SAMPLE
 * data for portfolio demonstration only — no real supplier endpoints or
 * credentials.
 */

describe('Travel Marketplace — Search, Fare Lock & Booking Flow', () => {
  const DUMMY_SEARCH = {
    origin: 'DEMO-CITY-A',
    destination: 'DEMO-CITY-B',
    date: '2026-09-15',
  };

  beforeEach(() => {
    cy.visit('/search');
  });

  it('returns results matching the applied filters', () => {
    cy.intercept('GET', '/api/search*', {
      statusCode: 200,
      body: { results: [{ id: 'FLT-001', price: 4599, currency: 'INR' }] },
    }).as('searchResults');

    cy.get('[data-testid="origin"]').type(DUMMY_SEARCH.origin);
    cy.get('[data-testid="destination"]').type(DUMMY_SEARCH.destination);
    cy.get('[data-testid="travel-date"]').type(DUMMY_SEARCH.date);
    cy.get('[data-testid="search-btn"]').click();

    cy.wait('@searchResults');
    cy.get('[data-testid="result-FLT-001"]').should('contain.text', '4599');
  });

  it('triggers a fare lock on selection, showing Price Held', () => {
    cy.intercept('POST', '/api/fare-lock', {
      statusCode: 200,
      body: { status: 'PRICE_HELD', price: 4599, holdExpiresInSeconds: 600 },
    }).as('fareLock');

    cy.get('[data-testid="result-FLT-001"]').click();
    cy.wait('@fareLock');

    cy.get('[data-testid="booking-status"]').should('contain.text', 'Price Held');
  });

  it('blocks payment after the fare-lock window has expired', () => {
    cy.intercept('POST', '/api/payment', {
      statusCode: 409,
      body: { error: 'FARE_LOCK_EXPIRED', message: 'Price expired — please re-search' },
    }).as('expiredPayment');

    cy.get('[data-testid="result-FLT-001"]').click();
    // Simulate the hold window elapsing before payment is attempted.
    cy.get('[data-testid="pay-btn"]').click();

    cy.wait('@expiredPayment');
    cy.get('[data-testid="payment-error"]').should('contain.text', 'Price expired');
  });

  it('only confirms one of two concurrent bookings for the same inventory unit', () => {
    // In a real suite this scenario is driven by a k6 concurrency script
    // (see automation/k6/concurrent-booking-race.js); this UI-level test
    // asserts the resulting state after a simulated race.
    cy.intercept('POST', '/api/booking/confirm', (req) => {
      req.reply({ statusCode: 409, body: { error: 'INVENTORY_NO_LONGER_AVAILABLE' } });
    }).as('secondBookingAttempt');

    cy.get('[data-testid="result-FLT-001"]').click();
    cy.get('[data-testid="pay-btn"]').click();

    cy.wait('@secondBookingAttempt');
    cy.get('[data-testid="booking-error"]').should('contain.text', 'no longer available');
  });
});
