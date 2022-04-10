import { entityItemSelector } from '../../support/commands';
import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityCreateCancelButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

describe('Status e2e test', () => {
  const statusPageUrl = '/status';
  const statusPageUrlPattern = new RegExp('/status(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const statusSample = { code: 'Soft Balanced Operations', name: 'architect Chief' };

  let status: any;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/statuses+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/statuses').as('postEntityRequest');
    cy.intercept('DELETE', '/api/statuses/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (status) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/statuses/${status.id}`,
      }).then(() => {
        status = undefined;
      });
    }
  });

  it('Statuses menu should load Statuses page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('status');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Status').should('exist');
    cy.url().should('match', statusPageUrlPattern);
  });

  describe('Status page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(statusPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Status page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/status/new$'));
        cy.getEntityCreateUpdateHeading('Status');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', statusPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/statuses',
          body: statusSample,
        }).then(({ body }) => {
          status = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/statuses+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [status],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(statusPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Status page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('status');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', statusPageUrlPattern);
      });

      it('edit button click should load edit Status page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Status');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', statusPageUrlPattern);
      });

      it('last delete button click should delete instance of Status', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('status').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', statusPageUrlPattern);

        status = undefined;
      });
    });
  });

  describe('new Status page', () => {
    beforeEach(() => {
      cy.visit(`${statusPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Status');
    });

    it('should create an instance of Status', () => {
      cy.get(`[data-cy="code"]`).type('card').should('have.value', 'card');

      cy.get(`[data-cy="name"]`).type('Music white parsing').should('have.value', 'Music white parsing');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        status = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', statusPageUrlPattern);
    });
  });
});
