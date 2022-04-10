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

describe('Priority e2e test', () => {
  const priorityPageUrl = '/priority';
  const priorityPageUrlPattern = new RegExp('/priority(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const prioritySample = { code: 'architect', name: 'Cambridgeshire' };

  let priority: any;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/priorities+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/priorities').as('postEntityRequest');
    cy.intercept('DELETE', '/api/priorities/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (priority) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/priorities/${priority.id}`,
      }).then(() => {
        priority = undefined;
      });
    }
  });

  it('Priorities menu should load Priorities page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('priority');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Priority').should('exist');
    cy.url().should('match', priorityPageUrlPattern);
  });

  describe('Priority page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(priorityPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Priority page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/priority/new$'));
        cy.getEntityCreateUpdateHeading('Priority');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', priorityPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/priorities',
          body: prioritySample,
        }).then(({ body }) => {
          priority = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/priorities+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [priority],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(priorityPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Priority page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('priority');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', priorityPageUrlPattern);
      });

      it('edit button click should load edit Priority page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Priority');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', priorityPageUrlPattern);
      });

      it('last delete button click should delete instance of Priority', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('priority').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', priorityPageUrlPattern);

        priority = undefined;
      });
    });
  });

  describe('new Priority page', () => {
    beforeEach(() => {
      cy.visit(`${priorityPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Priority');
    });

    it('should create an instance of Priority', () => {
      cy.get(`[data-cy="code"]`).type('portal').should('have.value', 'portal');

      cy.get(`[data-cy="name"]`).type('deposit relationships').should('have.value', 'deposit relationships');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        priority = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', priorityPageUrlPattern);
    });
  });
});
