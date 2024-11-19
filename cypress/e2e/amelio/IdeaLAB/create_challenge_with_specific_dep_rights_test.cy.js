// In support/createChallenge.spec.js

describe('Create Challenge Command', () => {

    it('should create a challenge with default options', () => {
        cy.createChallenge().then((suggestionId) => {
            expect(suggestionId).to.exist; // Check if suggestionId was returned
        });
    });

    it('should create a challenge with specific titles', () => {
        const titles = {
            en: "Custom Challenge Title"
        };

        cy.createChallenge({ titles }).then((suggestionId) => {
            expect(suggestionId).to.exist; 
        });
    });

    it('should create a challenge for a specific department', () => {
        const departmentId = "628543ec-c5df-4a3b-969d-7a317c6fa74a"; // Example department ID

        cy.createChallenge({ departmentId }).then((suggestionId) => {
            expect(suggestionId).to.exist; // Check if suggestionId was returned
        });
    });

    it('should create a challenge with specific permissions', () => {
        const permissions = {
            canEdit: true,
            canDelete: false
        };

        cy.createChallenge({ permissions }).then((suggestionId) => {
            expect(suggestionId).to.exist; // Check if suggestionId was returned
        });
    });

    it('should create a challenge with department and permissions', () => {
        const departmentId = "628543ec-c5df-4a3b-969d-7a317c6fa74a"; // Example department ID
        const permissions = {
            canEdit: true,
            canDelete: true
        };

        cy.createChallenge({ departmentId, permissions }).then((suggestionId) => {
            expect(suggestionId).to.exist; // Check if suggestionId was returned
        });
    });
});
